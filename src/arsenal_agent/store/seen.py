"""SQLite persistence for seen articles and publish history."""

from __future__ import annotations

import sqlite3
from datetime import datetime, timezone
from pathlib import Path
from typing import Iterable, Optional


class ArticleStore:
    """Tracks articles already processed so we never double-post."""

    def __init__(self, path: Path) -> None:
        self.path = Path(path)
        self.path.parent.mkdir(parents=True, exist_ok=True)
        self._conn = sqlite3.connect(self.path)
        self._conn.row_factory = sqlite3.Row
        self._init_schema()

    def _init_schema(self) -> None:
        self._conn.executescript(
            """
            CREATE TABLE IF NOT EXISTS seen_articles (
                article_id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                link TEXT NOT NULL,
                source TEXT NOT NULL,
                published_at TEXT,
                facebook_post_id TEXT,
                publish_mode TEXT,
                processed_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS agent_meta (
                key TEXT PRIMARY KEY,
                value TEXT NOT NULL
            );
            """
        )
        self._conn.commit()

    def close(self) -> None:
        self._conn.close()

    def __enter__(self) -> "ArticleStore":
        return self

    def __exit__(self, *args: object) -> None:
        self.close()

    def seen_ids(self) -> set[str]:
        rows = self._conn.execute("SELECT article_id FROM seen_articles").fetchall()
        return {row["article_id"] for row in rows}

    def is_seen(self, article_id: str) -> bool:
        row = self._conn.execute(
            "SELECT 1 FROM seen_articles WHERE article_id = ?",
            (article_id,),
        ).fetchone()
        return row is not None

    def mark_processed(
        self,
        *,
        article_id: str,
        title: str,
        link: str,
        source: str,
        published_at: Optional[datetime],
        facebook_post_id: Optional[str],
        publish_mode: str,
    ) -> None:
        now = datetime.now(timezone.utc).isoformat()
        pub = published_at.isoformat() if published_at else None
        self._conn.execute(
            """
            INSERT INTO seen_articles (
                article_id, title, link, source, published_at,
                facebook_post_id, publish_mode, processed_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(article_id) DO UPDATE SET
                facebook_post_id = excluded.facebook_post_id,
                publish_mode = excluded.publish_mode,
                processed_at = excluded.processed_at
            """,
            (
                article_id,
                title,
                link,
                source,
                pub,
                facebook_post_id,
                publish_mode,
                now,
            ),
        )
        self._conn.commit()

    def recent(self, limit: int = 20) -> list[sqlite3.Row]:
        return self._conn.execute(
            """
            SELECT * FROM seen_articles
            ORDER BY processed_at DESC
            LIMIT ?
            """,
            (limit,),
        ).fetchall()

    def seed_seen(self, article_ids: Iterable[str]) -> int:
        """Mark IDs as seen without publishing (bootstrap / catch-up skip)."""
        now = datetime.now(timezone.utc).isoformat()
        count = 0
        for article_id in article_ids:
            cur = self._conn.execute(
                """
                INSERT OR IGNORE INTO seen_articles (
                    article_id, title, link, source, processed_at, publish_mode
                ) VALUES (?, '', '', 'seed', ?, 'seed')
                """,
                (article_id, now),
            )
            count += cur.rowcount
        self._conn.commit()
        return count
