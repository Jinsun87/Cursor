"""Tests for news parsing and post generation."""

from __future__ import annotations

from datetime import datetime, timezone
from email.utils import format_datetime

import pytest

from arsenal_agent.config import Settings
from arsenal_agent.news.fetcher import parse_feed
from arsenal_agent.news.models import NewsArticle
from arsenal_agent.news.sources import NewsSource
from arsenal_agent.posts.generator import PostGenerator, _template_message


SAMPLE_RSS = """<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Arsenal Test</title>
    <item>
      <title>Saka signs new Arsenal contract</title>
      <link>https://example.com/saka-contract</link>
      <guid>saka-contract-001</guid>
      <pubDate>{pub}</pubDate>
      <description>Bukayo Saka has signed a new long-term deal at Arsenal.</description>
    </item>
    <item>
      <title></title>
      <link>https://example.com/empty</link>
    </item>
  </channel>
</rss>
"""


def test_parse_feed_extracts_articles():
    pub = format_datetime(datetime(2026, 8, 1, 10, 0, tzinfo=timezone.utc))
    source = NewsSource(name="Test", url="https://example.com/feed", priority=1)
    articles = parse_feed(SAMPLE_RSS.format(pub=pub).encode(), source)
    assert len(articles) == 1
    assert articles[0].title.startswith("Saka")
    assert articles[0].source == "Test"
    assert "Saka" in articles[0].summary
    assert articles[0].id


def test_require_arsenal_mention_filters_noise():
    pub = format_datetime(datetime(2026, 8, 1, 10, 0, tzinfo=timezone.utc))
    rss = f"""<?xml version="1.0"?><rss version="2.0"><channel>
      <item>
        <title>Chelsea sign new striker</title>
        <link>https://example.com/chelsea</link>
        <guid>c1</guid>
        <pubDate>{pub}</pubDate>
        <description>Blues boost attack.</description>
      </item>
      <item>
        <title>Arsenal close in on midfielder</title>
        <link>https://example.com/arsenal</link>
        <guid>a1</guid>
        <pubDate>{pub}</pubDate>
        <description>Gunners push for deal.</description>
      </item>
    </channel></rss>"""
    source = NewsSource(
        name="Noisy",
        url="https://example.com/feed",
        require_arsenal_mention=True,
    )
    articles = parse_feed(rss.encode(), source)
    assert len(articles) == 1
    assert "Arsenal" in articles[0].title


def test_template_message_includes_hashtags_and_prefix():
    settings = Settings(
        post_prefix="🔴 Arsenal News",
        hashtags="#Arsenal #COYG",
        include_link=True,
    )
    article = NewsArticle(
        id="abc",
        title="Arteta previews north London derby",
        summary="Mikel Arteta says Arsenal are ready for Spurs.",
        link="https://example.com/derby",
        source="Arsenal.com",
        published_at=datetime.now(timezone.utc),
    )
    msg = _template_message(article, settings)
    assert msg.startswith("🔴 Arsenal News")
    assert "Arteta previews" in msg
    assert "#COYG" in msg
    assert "Arsenal.com" in msg


def test_post_generator_draft():
    settings = Settings(use_llm_rewrite=False, include_link=True)
    gen = PostGenerator(settings)
    article = NewsArticle(
        id="xyz",
        title="Gabriel scores winner",
        summary="Late header seals three points.",
        link="https://example.com/gabriel",
        source="BBC Sport Arsenal",
        published_at=datetime.now(timezone.utc),
    )
    draft = gen.generate(article)
    assert draft.article_id == "xyz"
    assert draft.link == "https://example.com/gabriel"
    assert "Gabriel scores winner" in draft.message
    gen.close()
