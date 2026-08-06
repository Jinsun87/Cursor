"""Image generation configuration."""

from __future__ import annotations

import os
from enum import Enum

from lego_battle_forge.images.providers.base import ImageProvider
from lego_battle_forge.images.providers.mock_provider import MockImageProvider
from lego_battle_forge.images.providers.openai_provider import OpenAIImageProvider


class ProviderName(str, Enum):
    OPENAI = "openai"
    MOCK = "mock"
    AUTO = "auto"


def resolve_provider(name: ProviderName | str = ProviderName.AUTO) -> ImageProvider:
    """Pick an image provider based on config and available credentials."""
    if isinstance(name, str):
        name = ProviderName(name.lower())

    if name == ProviderName.OPENAI:
        provider = OpenAIImageProvider()
        if not provider.is_available():
            raise RuntimeError("OPENAI_API_KEY is required for the openai provider")
        return provider

    if name == ProviderName.MOCK:
        return MockImageProvider()

    # auto: prefer OpenAI if key is set, otherwise mock
    openai = OpenAIImageProvider()
    if openai.is_available():
        return openai
    return MockImageProvider()


def get_default_size(provider: ImageProvider) -> str:
    """Return optimal portrait size for shorts/reels."""
    if provider.name == "openai":
        return os.environ.get("OPENAI_IMAGE_SIZE", "1024x1792")
    return "540x960"
