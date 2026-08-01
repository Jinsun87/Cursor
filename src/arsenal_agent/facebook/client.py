"""Facebook Graph API client for Page posts."""

from __future__ import annotations

import logging
import time
from typing import Any, Optional

import httpx

from arsenal_agent.config import Settings
from arsenal_agent.news.models import FacebookPostDraft, PublishResult

logger = logging.getLogger(__name__)


class FacebookError(RuntimeError):
    """Raised when the Graph API returns an error."""


class FacebookClient:
    """Publish or schedule posts to a Facebook Page."""

    def __init__(
        self,
        settings: Settings,
        client: httpx.Client | None = None,
    ) -> None:
        self.settings = settings
        self._owns_client = client is None
        self.client = client or httpx.Client(timeout=30.0)

    def close(self) -> None:
        if self._owns_client:
            self.client.close()

    @property
    def _base(self) -> str:
        return (
            f"https://graph.facebook.com/{self.settings.facebook_graph_version}"
            f"/{self.settings.facebook_page_id}"
        )

    def publish(self, draft: FacebookPostDraft) -> PublishResult:
        mode = self.settings.publish_mode
        if mode == "dry_run" or not self.settings.facebook_configured:
            logger.info(
                "Dry-run / unconfigured Facebook — skipping publish for %s",
                draft.article_id,
            )
            return PublishResult(
                article_id=draft.article_id,
                mode="dry_run",
                dry_run=True,
                message=draft.message,
                link=draft.link,
            )

        payload: dict[str, Any] = {
            "message": draft.message,
            "access_token": self.settings.facebook_page_access_token.get_secret_value(),
        }
        if draft.link:
            payload["link"] = draft.link

        scheduled_ts: Optional[int] = None
        if mode == "schedule":
            # Facebook requires scheduled_publish_time between +10 min and +30 days
            delay = max(10, self.settings.schedule_delay_minutes) * 60
            scheduled_ts = int(time.time()) + delay
            payload["published"] = "false"
            payload["scheduled_publish_time"] = scheduled_ts
        else:
            payload["published"] = "true"

        response = self.client.post(f"{self._base}/feed", data=payload)
        data = response.json()
        if "error" in data:
            err = data["error"]
            raise FacebookError(
                f"{err.get('type', 'Error')} ({err.get('code')}): "
                f"{err.get('message', response.text)}"
            )
        if response.is_error:
            raise FacebookError(f"HTTP {response.status_code}: {response.text}")

        post_id = data.get("id")
        logger.info(
            "Published article %s as Facebook post %s (mode=%s)",
            draft.article_id,
            post_id,
            mode,
        )
        return PublishResult(
            article_id=draft.article_id,
            facebook_post_id=post_id,
            mode=mode,
            scheduled_publish_time=scheduled_ts,
            dry_run=False,
            message=draft.message,
            link=draft.link,
        )

    def verify_token(self) -> dict[str, Any]:
        """Lightweight credential check against the Page endpoint."""
        if not self.settings.facebook_configured:
            raise FacebookError("Facebook page ID / access token not configured")
        response = self.client.get(
            f"{self._base}",
            params={
                "fields": "id,name",
                "access_token": self.settings.facebook_page_access_token.get_secret_value(),
            },
        )
        data = response.json()
        if "error" in data:
            err = data["error"]
            raise FacebookError(err.get("message", str(data)))
        return data
