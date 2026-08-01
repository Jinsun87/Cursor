"""Domain models for Arsenal news articles and Facebook posts."""

from __future__ import annotations

from datetime import datetime, timezone
from typing import Optional

from pydantic import BaseModel, Field, HttpUrl


class NewsArticle(BaseModel):
    """A single Arsenal-related news item from an RSS/Atom feed."""

    id: str = Field(description="Stable unique id (usually entry.id or link)")
    title: str
    summary: str = ""
    link: str
    source: str
    published_at: datetime
    image_url: Optional[str] = None

    @property
    def age_hours(self) -> float:
        now = datetime.now(timezone.utc)
        published = self.published_at
        if published.tzinfo is None:
            published = published.replace(tzinfo=timezone.utc)
        return (now - published).total_seconds() / 3600


class FacebookPostDraft(BaseModel):
    """Content ready to publish or schedule on Facebook."""

    article_id: str
    message: str
    link: Optional[str] = None
    source_title: str
    source_url: str


class PublishResult(BaseModel):
    """Outcome of a Facebook publish/schedule attempt."""

    article_id: str
    facebook_post_id: Optional[str] = None
    mode: str
    scheduled_publish_time: Optional[int] = None
    dry_run: bool = False
    message: str
    link: Optional[str] = None
