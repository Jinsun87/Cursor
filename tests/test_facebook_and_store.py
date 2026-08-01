"""Tests for Facebook client and article store."""

from __future__ import annotations

from datetime import datetime, timezone
from pathlib import Path

import httpx
import pytest
import respx

from arsenal_agent.config import Settings
from arsenal_agent.facebook.client import FacebookClient, FacebookError
from arsenal_agent.news.models import FacebookPostDraft
from arsenal_agent.store.seen import ArticleStore


def _settings(**kwargs) -> Settings:
    defaults = dict(
        facebook_page_id="12345",
        facebook_page_access_token="test-token",
        publish_mode="immediate",
        facebook_graph_version="v22.0",
    )
    defaults.update(kwargs)
    return Settings(**defaults)


def _draft() -> FacebookPostDraft:
    return FacebookPostDraft(
        article_id="art-1",
        message="🔴 Arsenal News\n\nBig win for the Gunners\n\n#Arsenal",
        link="https://example.com/win",
        source_title="Big win",
        source_url="https://example.com/win",
    )


@respx.mock
def test_publish_immediate():
    route = respx.post("https://graph.facebook.com/v22.0/12345/feed").mock(
        return_value=httpx.Response(200, json={"id": "12345_999"})
    )
    client = FacebookClient(_settings(publish_mode="immediate"))
    result = client.publish(_draft())
    assert result.facebook_post_id == "12345_999"
    assert result.mode == "immediate"
    assert result.dry_run is False
    assert route.called
    body = route.calls[0].request.content.decode()
    assert "published=true" in body
    assert "message=" in body
    client.close()


@respx.mock
def test_publish_schedule():
    route = respx.post("https://graph.facebook.com/v22.0/12345/feed").mock(
        return_value=httpx.Response(200, json={"id": "12345_111"})
    )
    client = FacebookClient(
        _settings(publish_mode="schedule", schedule_delay_minutes=15)
    )
    result = client.publish(_draft())
    assert result.mode == "schedule"
    assert result.scheduled_publish_time is not None
    body = route.calls[0].request.content.decode()
    assert "published=false" in body
    assert "scheduled_publish_time=" in body
    client.close()


@respx.mock
def test_publish_dry_run_skips_api():
    route = respx.post("https://graph.facebook.com/v22.0/12345/feed").mock(
        return_value=httpx.Response(200, json={"id": "x"})
    )
    client = FacebookClient(_settings(publish_mode="dry_run"))
    result = client.publish(_draft())
    assert result.dry_run is True
    assert not route.called
    client.close()


@respx.mock
def test_publish_api_error():
    respx.post("https://graph.facebook.com/v22.0/12345/feed").mock(
        return_value=httpx.Response(
            400,
            json={
                "error": {
                    "message": "Invalid OAuth access token",
                    "type": "OAuthException",
                    "code": 190,
                }
            },
        )
    )
    client = FacebookClient(_settings())
    with pytest.raises(FacebookError, match="Invalid OAuth"):
        client.publish(_draft())
    client.close()


def test_article_store_dedup(tmp_path: Path):
    db = tmp_path / "seen.db"
    store = ArticleStore(db)
    assert not store.is_seen("a1")
    store.mark_processed(
        article_id="a1",
        title="Title",
        link="https://example.com/a",
        source="Test",
        published_at=datetime.now(timezone.utc),
        facebook_post_id="p1",
        publish_mode="immediate",
    )
    assert store.is_seen("a1")
    assert "a1" in store.seen_ids()
    recent = store.recent(5)
    assert len(recent) == 1
    assert recent[0]["facebook_post_id"] == "p1"
    seeded = store.seed_seen(["a1", "a2", "a3"])
    assert seeded == 2  # a1 already present
    store.close()
