"""End-to-end agent cycle with mocked feeds and Facebook."""

from __future__ import annotations

from datetime import datetime, timedelta, timezone
from email.utils import format_datetime
from pathlib import Path

import httpx
import respx

from arsenal_agent.agent import ArsenalNewsAgent
from arsenal_agent.config import Settings
from arsenal_agent.facebook.client import FacebookClient
from arsenal_agent.news.fetcher import NewsFetcher
from arsenal_agent.news.sources import NewsSource
from arsenal_agent.posts.generator import PostGenerator
from arsenal_agent.store.seen import ArticleStore


def _rss(title: str, link: str, guid: str, hours_ago: float = 0.5) -> bytes:
    published = datetime.now(timezone.utc) - timedelta(hours=hours_ago)
    xml = f"""<?xml version="1.0"?>
    <rss version="2.0"><channel>
      <item>
        <title>{title}</title>
        <link>{link}</link>
        <guid>{guid}</guid>
        <pubDate>{format_datetime(published)}</pubDate>
        <description>Breaking Arsenal update.</description>
      </item>
    </channel></rss>
    """
    return xml.encode()


@respx.mock
def test_run_once_publishes_new_article(tmp_path: Path):
    feed_url = "https://feeds.example.com/arsenal.xml"
    respx.get(feed_url).mock(
        return_value=httpx.Response(
            200,
            content=_rss("Rice injury update", "https://ex.com/rice", "rice-1"),
        )
    )
    fb = respx.post("https://graph.facebook.com/v22.0/999/feed").mock(
        return_value=httpx.Response(200, json={"id": "999_1"})
    )

    settings = Settings(
        facebook_page_id="999",
        facebook_page_access_token="tok",
        publish_mode="immediate",
        database_path=tmp_path / "seen.db",
        max_age_hours=6,
        max_posts_per_cycle=3,
        use_llm_rewrite=False,
    )
    source = NewsSource(name="TestFeed", url=feed_url, priority=1)
    http = httpx.Client()
    agent = ArsenalNewsAgent(
        settings=settings,
        fetcher=NewsFetcher(sources=[source], client=http),
        generator=PostGenerator(settings, client=http),
        facebook=FacebookClient(settings, client=http),
        store=ArticleStore(settings.database_path),
    )

    first = agent.run_once()
    assert first.new_articles == 1
    assert len(first.published) == 1
    assert first.published[0].facebook_post_id == "999_1"
    assert fb.call_count == 1

    # Second cycle should not re-post
    second = agent.run_once()
    assert second.new_articles == 0
    assert second.published == []
    assert fb.call_count == 1

    agent.close()
    http.close()


@respx.mock
def test_bootstrap_then_no_posts(tmp_path: Path):
    feed_url = "https://feeds.example.com/arsenal2.xml"
    respx.get(feed_url).mock(
        return_value=httpx.Response(
            200,
            content=_rss("Old headline", "https://ex.com/old", "old-1", hours_ago=1),
        )
    )
    fb = respx.post("https://graph.facebook.com/v22.0/999/feed").mock(
        return_value=httpx.Response(200, json={"id": "x"})
    )

    settings = Settings(
        facebook_page_id="999",
        facebook_page_access_token="tok",
        publish_mode="immediate",
        database_path=tmp_path / "seen.db",
        use_llm_rewrite=False,
    )
    source = NewsSource(name="TestFeed", url=feed_url, priority=1)
    http = httpx.Client()
    agent = ArsenalNewsAgent(
        settings=settings,
        fetcher=NewsFetcher(sources=[source], client=http),
        generator=PostGenerator(settings, client=http),
        facebook=FacebookClient(settings, client=http),
        store=ArticleStore(settings.database_path),
    )
    seeded = agent.bootstrap_skip_existing()
    assert seeded == 1
    result = agent.run_once()
    assert result.new_articles == 0
    assert not fb.called
    agent.close()
    http.close()
