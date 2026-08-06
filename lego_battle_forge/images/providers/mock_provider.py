"""Mock image provider — generates storyboard-style placeholder previews."""

from __future__ import annotations

import textwrap
from pathlib import Path

from lego_battle_forge.images.providers.base import ImageProvider

# Portrait dimensions for 9:16 shorts
WIDTH = 540
HEIGHT = 960


class MockImageProvider(ImageProvider):
    """Creates styled placeholder previews without an API key (for dev/demo)."""

    name = "mock"

    def generate(self, prompt: str, output_path: Path, size: str = "1024x1792") -> Path:
        try:
            from PIL import Image, ImageDraw, ImageFont
        except ImportError as e:
            raise RuntimeError(
                "Mock image provider requires Pillow. Install with: pip install pillow"
            ) from e

        output_path.parent.mkdir(parents=True, exist_ok=True)

        # Parse shot info from prompt for labeling
        lines = _extract_label_lines(prompt)

        img = Image.new("RGB", (WIDTH, HEIGHT), color=(15, 15, 22))
        draw = ImageDraw.Draw(img)

        # Gradient background bands
        for y in range(HEIGHT):
            r = int(20 + (y / HEIGHT) * 30)
            g = int(10 + (y / HEIGHT) * 20)
            b = int(35 + (y / HEIGHT) * 50)
            draw.line([(0, y), (WIDTH, y)], fill=(r, g, b))

        # Battlefield ground
        draw.rectangle([0, HEIGHT * 2 // 3, WIDTH, HEIGHT], fill=(45, 38, 28))
        draw.rectangle([0, HEIGHT * 2 // 3 - 20, WIDTH, HEIGHT * 2 // 3], fill=(60, 50, 35))

        # LEGO stud grid on ground
        for x in range(20, WIDTH - 20, 35):
            for y in range(HEIGHT * 2 // 3 + 15, HEIGHT - 20, 35):
                draw.ellipse([x, y, x + 12, y + 12], fill=(70, 60, 45))

        # Minifigure silhouettes
        _draw_minifigs(draw, WIDTH, HEIGHT)

        # Header bar
        draw.rectangle([0, 0, WIDTH, 80], fill=(230, 57, 70))
        font_lg = _get_font(22)
        font_sm = _get_font(14)
        font_xs = _get_font(11)

        draw.text((20, 25), "LEGO BATTLE FORGE", fill=(255, 255, 255), font=font_lg)
        draw.text((20, 52), "Scene Preview (mock)", fill=(255, 214, 10), font=font_sm)

        # Prompt text area
        y_pos = 100
        draw.text((20, y_pos), "SCENE:", fill=(255, 214, 10), font=font_sm)
        y_pos += 25
        for line in lines[:6]:
            draw.text((20, y_pos), line, fill=(200, 200, 210), font=font_xs)
            y_pos += 16

        # Footer
        draw.rectangle([0, HEIGHT - 50, WIDTH, HEIGHT], fill=(26, 26, 36))
        draw.text((20, HEIGHT - 35), "Set OPENAI_API_KEY for real AI previews", fill=(136, 136, 160), font=font_xs)

        img.save(output_path, "PNG", optimize=True)
        return output_path


def _get_font(size: int):
    from PIL import ImageFont
    for path in [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
    ]:
        try:
            return ImageFont.truetype(path, size)
        except (OSError, IOError):
            continue
    return ImageFont.load_default()


def _extract_label_lines(prompt: str) -> list[str]:
    """Pull readable labels from the prompt for the placeholder."""
    labels = []
    if "Scene:" in prompt:
        scene = prompt.split("Scene:")[1].split(". LEGO setup:")[0].strip()
        labels.append(scene[:70])
    if "LEGO setup:" in prompt:
        setup = prompt.split("LEGO setup:")[1].split(". Era details:")[0].strip()
        labels.extend(textwrap.wrap(setup, width=55)[:3])
    if "Camera:" in prompt:
        cam = prompt.split("Camera:")[1].split(". Action:")[0].strip()
        labels.append(f"Camera: {cam[:50]}")
    if not labels:
        labels = textwrap.wrap(prompt, width=55)[:5]
    return labels


def _draw_minifigs(draw, width: int, height: int) -> None:
    """Draw simple LEGO minifigure silhouettes on the battlefield."""
    ground = height * 2 // 3
    positions = [
        (width // 4, ground - 60, (200, 50, 50)),
        (width // 4 + 40, ground - 55, (200, 50, 50)),
        (width // 4 + 80, ground - 58, (200, 50, 50)),
        (width * 3 // 4 - 80, ground - 55, (50, 80, 200)),
        (width * 3 // 4 - 40, ground - 60, (50, 80, 200)),
        (width * 3 // 4, ground - 57, (50, 80, 200)),
    ]
    for x, y, color in positions:
        # Head
        draw.ellipse([x, y, x + 18, y + 18], fill=(255, 213, 170))
        # Body
        draw.rectangle([x - 2, y + 18, x + 20, y + 45], fill=color)
        # Legs
        draw.rectangle([x, y + 45, x + 8, y + 60], fill=color)
        draw.rectangle([x + 10, y + 45, x + 18, y + 60], fill=color)
