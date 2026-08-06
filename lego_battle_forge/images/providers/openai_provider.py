"""OpenAI DALL-E image generation provider."""

from __future__ import annotations

import os
import urllib.request
from pathlib import Path

from lego_battle_forge.images.providers.base import ImageProvider


class OpenAIImageProvider(ImageProvider):
    """Generate images via OpenAI DALL-E 3 API."""

    name = "openai"

    def __init__(self, api_key: str | None = None, model: str = "dall-e-3"):
        self.api_key = api_key or os.environ.get("OPENAI_API_KEY", "")
        self.model = model or os.environ.get("OPENAI_IMAGE_MODEL", "dall-e-3")

    def is_available(self) -> bool:
        return bool(self.api_key)

    def generate(self, prompt: str, output_path: Path, size: str = "1024x1792") -> Path:
        if not self.api_key:
            raise RuntimeError(
                "OPENAI_API_KEY not set. Export it or use --provider mock for placeholders."
            )

        try:
            from openai import OpenAI
        except ImportError as e:
            raise RuntimeError(
                "OpenAI provider requires the openai package. Install with: pip install openai"
            ) from e

        client = OpenAI(api_key=self.api_key)
        output_path.parent.mkdir(parents=True, exist_ok=True)

        response = client.images.generate(
            model=self.model,
            prompt=prompt[:4000],
            size=size,
            quality="standard",
            n=1,
        )

        image_url = response.data[0].url
        if not image_url:
            raise RuntimeError("OpenAI returned no image URL")

        urllib.request.urlretrieve(image_url, output_path)
        return output_path
