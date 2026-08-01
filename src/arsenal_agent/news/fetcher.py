"""Fetch and normalize Arsenal news from RSS feeds."""

from __future__ import annotations

import hashlib
import logging
import re
from calendar import timegm
from datetime import datetime, timezone
from email.utils import parsedate_to_datetime
from typing import Iterable, Optional

import feedparser
import httpx

from arsenal_agent.news.models import NewsArticle
from arsenal_agent.news.sources import ARSENAL_SOURCES, NewsSource

logger = logging.getLogger(__name__)

USER_AGENT = (
    "ArsenalNewsAgent/1.0 (+https://github.com/Jinsun87/Cursor; "
    "breaking Arsenal news monitor)"
)

ARSENAL_KEYWORDS = (
    "arsenal",
    "gunners",
    "afc",
    "arteta",
    "emirates stadium",
)


def _stable_id(entry: dict, link: str, source: str) -> str:
    raw = entry.get("id") or entry.get("guid") or link or entry.get("title", "")
    digest = hashlib.sha256(f"{source}|{raw}".encode("utf-8")).hexdigest()
    return digest[:32]


def _parse_published(entry: dict) -> datetime:
    for key in ("published_parsed", "updated_parsed"):
        struct = entry.get(key)
        if struct:
            try:
                return datetime.fromtimestamp(timegm(struct), tz=timezone.utc)
            except (OverflowError, ValueError, TypeError):
                pass
    for key in ("published", "updated"):
        value = entry.get(key)
        if value:
            try:
                dt = parsedate_to_datetime(value)
                if dt.tzinfo is None:
                    dt = dt.replace(tzinfo=timezone.utc)
                return dt.astimezone(timezone.utc)
            except (TypeError, ValueError, IndexError):
                pass
    return datetime.now(timezone.utc)


def _extract_image(entry: dict) -> Optional[str]:
    media = entry.get("media_content") or entry.get("media_thumbnail") or []
    if isinstance(media, list) and media:
        url = media[0].get("url")
        if url:
            return url
    for link in entry.get("links") or []:
        if link.get("rel") == "enclosure" and str(link.get("type", "")).startswith(
            "image/"
        ):
            return link.get("href")
    return None


def _summary_text(entry: dict) -> str:
    summary = entry.get("summary") or entry.get("description") or ""
    text = re.sub(r"<[^>]+>", " ", summary)
    text = re.sub(r"\s+", " ", text).strip()
    return text[:500]


def _mentions_arsenal(title: str, summary: str) -> bool:
    haystack = f"{title} {summary}".lower()
    return any(keyword in haystack for keyword in ARSENAL_KEYWORDS)


def parse_feed(content: bytes | str, source: NewsSource) -> list[NewsArticle]:
    """Parse feed bytes/string into NewsArticle list."""
    parsed = feedparser.parse(content)
    articles: list[NewsArticle] = []
    for entry in parsed.entries:
        link = entry.get("link") or ""
        title = (entry.get("title") or "").strip()
        if not title or not link:
            continue
        summary = _summary_text(entry)
        if source.require_arsenal_mention and not _mentions_arsenal(title, summary):
            continue
        articles.append(
            NewsArticle(
                id=_stable_id(entry, link, source.name),
                title=title,
                summary=summary,
                link=link,
                source=source.name,
                published_at=_parse_published(entry),
                image_url=_extract_image(entry),
            )
        )
    return articles


class NewsFetcher:
    """HTTP client that polls configured Arsenal RSS sources."""

    def __init__(
        self,
        sources: Iterable[NewsSource] | None = None,
        timeout: float = 20.0,
        client: httpx.Client | None = None,
    ) -> None:
        self.sources = list(sources or ARSENAL_SOURCES)
        self._owns_client = client is None
        self.client = client or httpx.Client(
            timeout=timeout,
            headers={"User-Agent": USER_AGENT},
            follow_redirects=True,
        )

    def close(self) -> None:
        if self._owns_client:
            self.client.close()

    def __enter__(self) -> "NewsFetcher":
        return self

    def __exit__(self, *args: object) -> None:
        self.close()

    def fetch_source(self, source: NewsSource) -> list[NewsArticle]:
        try:
            response = self.client.get(source.url)
            response.raise_for_status()
            return parse_feed(response.content, source)
        except Exception as exc:  # noqa: BLE001 — keep agent running on bad feeds
            logger.warning("Failed to fetch %s: %s", source.name, exc)
            return []

    def fetch_all(self) -> list[NewsArticle]:
        """Fetch all sources and return unique articles, newest first."""
        seen_ids: set[str] = set()
        seen_links: set[str] = set()
        articles: list[NewsArticle] = []

        for source in sorted(self.sources, key=lambda s: s.priority):
            for article in self.fetch_source(source):
                link_key = article.link.split("?")[0].rstrip("/").lower()
                if article.id in seen_ids or link_key in seen_links:
                    continue
                seen_ids.add(article.id)
                seen_links.add(link_key)
                articles.append(article)

        articles.sort(key=lambda a: a.published_at, reverse=True)
        return articles

    def fetch_new(
        self,
        *,
        seen_ids: set[str],
        max_age_hours: float,
        limit: int,
    ) -> list[NewsArticle]:
        """Return unseen articles within the age window."""
        fresh: list[NewsArticle] = []
        for article in self.fetch_all():
            if article.id in seen_ids:
                continue
            if article.age_hours > max_age_hours:
                continue
            fresh.append(article)
            if len(fresh) >= limit:
                break
        return fresh
