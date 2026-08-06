"""Image generation provider interface."""

from __future__ import annotations

from abc import ABC, abstractmethod
from pathlib import Path


class ImageProvider(ABC):
    """Base class for AI image generation backends."""

    name: str = "base"

    @abstractmethod
    def generate(self, prompt: str, output_path: Path, size: str = "1024x1792") -> Path:
        """Generate an image from a prompt and save to output_path."""

    def is_available(self) -> bool:
        return True
