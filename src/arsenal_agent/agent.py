"""Core agent loop: detect Arsenal news → draft → publish to Facebook."""

from __future__ import annotations

import logging
import time
from dataclasses import dataclass, field
from typing import Optional

from arsenal_agent.config import Settings, get_settings
from arsenal_agent.facebook.client import FacebookClient, FacebookError
from arsenal_agent.news.fetcher import NewsFetcher
from arsenal_agent.news.models import NewsArticle, PublishResult
from arsenal_agent.posts.generator import PostGenerator
from arsenal_agent.store.seen import ArticleStore

logger = logging.getLogger(__name__)


@dataclass
class CycleResult:
    checked_at: float
    new_articles: int = 0
    published: list[PublishResult] = field(default_factory=list)
    errors: list[str] = field(default_factory=list)


class ArsenalNewsAgent:
    """Monitors Arsenal feeds and posts breaking stories to Facebook."""

    def __init__(
        self,
        settings: Settings | None = None,
        fetcher: NewsFetcher | None = None,
        generator: PostGenerator | None = None,
        facebook: FacebookClient | None = None,
        store: ArticleStore | None = None,
    ) -> None:
        self.settings = settings or get_settings()
        self.fetcher = fetcher or NewsFetcher()
        self.generator = generator or PostGenerator(self.settings)
        self.facebook = facebook or FacebookClient(self.settings)
        self.store = store or ArticleStore(self.settings.database_path)
        self._owns_deps = all(
            x is None for x in (fetcher, generator, facebook, store)
        )

    def close(self) -> None:
        self.fetcher.close()
        self.generator.close()
        self.facebook.close()
        self.store.close()

    def __enter__(self) -> "ArsenalNewsAgent":
        return self

    def __exit__(self, *args: object) -> None:
        self.close()

    def bootstrap_skip_existing(self) -> int:
        """Mark everything currently in feeds as seen without posting.

        Call once on first deploy so the agent only reacts to *new* releases.
        """
        articles = self.fetcher.fetch_all()
        return self.store.seed_seen(a.id for a in articles)

    def process_article(self, article: NewsArticle) -> Optional[PublishResult]:
        if self.store.is_seen(article.id):
            return None

        draft = self.generator.generate(article)
        try:
            result = self.facebook.publish(draft)
        except FacebookError as exc:
            logger.error("Facebook publish failed for %s: %s", article.id, exc)
            raise

        self.store.mark_processed(
            article_id=article.id,
            title=article.title,
            link=article.link,
            source=article.source,
            published_at=article.published_at,
            facebook_post_id=result.facebook_post_id,
            publish_mode=result.mode,
        )
        return result

    def run_once(self) -> CycleResult:
        """Poll feeds once and publish any fresh unseen articles."""
        result = CycleResult(checked_at=time.time())
        seen = self.store.seen_ids()
        fresh = self.fetcher.fetch_new(
            seen_ids=seen,
            max_age_hours=self.settings.max_age_hours,
            limit=self.settings.max_posts_per_cycle,
        )
        result.new_articles = len(fresh)

        for article in fresh:
            try:
                published = self.process_article(article)
                if published:
                    result.published.append(published)
                    logger.info(
                        "Posted: %s → %s",
                        article.title,
                        published.facebook_post_id or published.mode,
                    )
            except FacebookError as exc:
                result.errors.append(f"{article.title}: {exc}")
            except Exception as exc:  # noqa: BLE001
                logger.exception("Unexpected error processing %s", article.id)
                result.errors.append(f"{article.title}: {exc}")

        return result

    def run_forever(self, *, stop_after: Optional[int] = None) -> None:
        """Continuously poll until interrupted.

        Args:
            stop_after: optional max cycles (useful for tests).
        """
        logger.info(
            "Arsenal news agent started — mode=%s poll=%ss",
            self.settings.publish_mode,
            self.settings.poll_interval_seconds,
        )
        cycles = 0
        while True:
            cycle = self.run_once()
            cycles += 1
            logger.info(
                "Cycle %s: %s new, %s published, %s errors",
                cycles,
                cycle.new_articles,
                len(cycle.published),
                len(cycle.errors),
            )
            if stop_after is not None and cycles >= stop_after:
                break
            time.sleep(self.settings.poll_interval_seconds)
