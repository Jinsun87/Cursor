"""Turn news articles into Facebook-ready post copy."""

from __future__ import annotations

import logging
import re
from typing import Optional

import httpx

from arsenal_agent.config import Settings
from arsenal_agent.news.models import FacebookPostDraft, NewsArticle

logger = logging.getLogger(__name__)


def _clean_summary(summary: str, max_len: int = 220) -> str:
    text = re.sub(r"\s+", " ", summary).strip()
    if len(text) <= max_len:
        return text
    cut = text[: max_len - 1].rsplit(" ", 1)[0]
    return f"{cut}…"


def _template_message(article: NewsArticle, settings: Settings) -> str:
    parts = [settings.post_prefix.strip(), article.title.strip()]
    summary = _clean_summary(article.summary)
    # Avoid repeating the title as the summary
    if summary and summary.lower() not in article.title.lower():
        parts.append(summary)
    parts.append(f"Source: {article.source}")
    tags = settings.hashtags.strip()
    if tags:
        parts.append(tags)
    return "\n\n".join(p for p in parts if p)


class PostGenerator:
    """Builds Facebook post drafts; optionally rewrites with an LLM."""

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

    def generate(self, article: NewsArticle) -> FacebookPostDraft:
        message = _template_message(article, self.settings)
        if self.settings.llm_configured:
            rewritten = self._llm_rewrite(article)
            if rewritten:
                message = rewritten

        link: Optional[str] = article.link if self.settings.include_link else None
        return FacebookPostDraft(
            article_id=article.id,
            message=message,
            link=link,
            source_title=article.title,
            source_url=article.link,
        )

    def _llm_rewrite(self, article: NewsArticle) -> Optional[str]:
        api_key = self.settings.openai_api_key.get_secret_value()
        url = f"{self.settings.openai_base_url.rstrip('/')}/chat/completions"
        prompt = (
            "Write a short Facebook Page post about this Arsenal FC news story. "
            "Tone: excited but professional Gunners fan page. "
            "2–4 short sentences. Include a clear hook. "
            f"End with these hashtags exactly: {self.settings.hashtags}\n\n"
            f"Title: {article.title}\n"
            f"Summary: {article.summary}\n"
            f"Source: {article.source}\n"
            "Do not invent facts. Do not wrap in quotes."
        )
        try:
            response = self.client.post(
                url,
                headers={
                    "Authorization": f"Bearer {api_key}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": self.settings.openai_model,
                    "messages": [
                        {
                            "role": "system",
                            "content": "You write concise Arsenal FC social posts.",
                        },
                        {"role": "user", "content": prompt},
                    ],
                    "temperature": 0.6,
                    "max_tokens": 280,
                },
            )
            response.raise_for_status()
            data = response.json()
            text = data["choices"][0]["message"]["content"].strip()
            if self.settings.post_prefix and not text.startswith(
                self.settings.post_prefix
            ):
                text = f"{self.settings.post_prefix}\n\n{text}"
            return text
        except Exception as exc:  # noqa: BLE001
            logger.warning("LLM rewrite failed, using template: %s", exc)
            return None
