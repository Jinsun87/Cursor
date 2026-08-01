"""Application settings loaded from environment / .env."""

from __future__ import annotations

from pathlib import Path
from typing import Literal

from pydantic import Field, SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Runtime configuration for the Arsenal news agent."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # Facebook Page Graph API
    facebook_page_id: str = Field(default="", description="Facebook Page ID")
    facebook_page_access_token: SecretStr = Field(
        default=SecretStr(""),
        description="Page access token with pages_manage_posts",
    )
    facebook_graph_version: str = Field(default="v22.0")

    # Publishing behaviour
    # "immediate" posts as soon as news is detected (best for breaking news).
    # "schedule" uses Facebook scheduled posts (min +10 minutes from now).
    publish_mode: Literal["immediate", "schedule", "dry_run"] = "immediate"
    schedule_delay_minutes: int = Field(
        default=10,
        ge=10,
        le=43200,
        description="Minutes ahead when publish_mode=schedule (FB min is 10)",
    )

    # News polling
    poll_interval_seconds: int = Field(default=60, ge=15)
    max_age_hours: int = Field(
        default=6,
        ge=1,
        description="Ignore articles older than this when first starting",
    )
    max_posts_per_cycle: int = Field(default=3, ge=1)

    # Storage
    database_path: Path = Field(default=Path("data/seen_articles.db"))

    # Post style
    hashtags: str = Field(
        default="#Arsenal #AFC #COYG #Gunners",
        description="Space-separated hashtags appended to posts",
    )
    include_link: bool = True
    post_prefix: str = Field(
        default="🔴 Arsenal News",
        description="Short prefix for every Facebook post",
    )

    # Optional OpenAI-compatible rewrite (falls back to template if unset)
    openai_api_key: SecretStr = Field(default=SecretStr(""))
    openai_base_url: str = "https://api.openai.com/v1"
    openai_model: str = "gpt-4o-mini"
    use_llm_rewrite: bool = False

    @property
    def facebook_configured(self) -> bool:
        return bool(
            self.facebook_page_id
            and self.facebook_page_access_token.get_secret_value()
        )

    @property
    def llm_configured(self) -> bool:
        return bool(self.openai_api_key.get_secret_value()) and self.use_llm_rewrite


def get_settings() -> Settings:
    return Settings()
