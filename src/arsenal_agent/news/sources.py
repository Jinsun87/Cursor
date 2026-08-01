"""Curated Arsenal news RSS sources."""

from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class NewsSource:
    name: str
    url: str
    # Soft priority: lower = checked / preferred first when ranking
    priority: int = 10
    # When True, drop items whose title/summary do not mention Arsenal keywords
    require_arsenal_mention: bool = False


# Public RSS feeds that reliably cover Arsenal FC.
ARSENAL_SOURCES: tuple[NewsSource, ...] = (
    NewsSource(
        name="BBC Sport Arsenal",
        url="https://feeds.bbci.co.uk/sport/football/teams/arsenal/rss.xml",
        priority=1,
    ),
    NewsSource(
        name="Football.London Arsenal",
        url="https://www.football.london/arsenal-fc/?service=rss",
        priority=2,
    ),
    NewsSource(
        name="The Guardian Arsenal",
        url="https://www.theguardian.com/football/arsenal/rss",
        priority=3,
    ),
    NewsSource(
        name="Evening Standard Arsenal",
        url="https://www.standard.co.uk/sport/football/arsenal/rss",
        priority=4,
    ),
    NewsSource(
        name="Google News Arsenal",
        url=(
            "https://news.google.com/rss/search?"
            "q=%22Arsenal%22+(FC+OR+Gunners)+when:1d&hl=en-GB&gl=GB&ceid=GB:en"
        ),
        priority=8,
        require_arsenal_mention=True,
    ),
)
