"""Scene preview image generation orchestrator."""

from __future__ import annotations

from pathlib import Path
from typing import Callable, Optional

from lego_battle_forge.images.config import ProviderName, get_default_size, resolve_provider
from lego_battle_forge.images.prompts import build_all_prompts, build_shot_prompt, build_thumbnail_prompt
from lego_battle_forge.images.providers.base import ImageProvider
from lego_battle_forge.models import GeneratedContent, ScenePreview, ScenePreviewPackage


def generate_scene_previews(
    content: GeneratedContent,
    output_dir: Path,
    *,
    provider: ProviderName | str = ProviderName.AUTO,
    include_thumbnail: bool = True,
    max_shots: Optional[int] = None,
    on_progress: Optional[Callable[[int, int, str], None]] = None,
) -> ScenePreviewPackage:
    """Generate AI preview images for all storyboard shots."""
    img_provider = resolve_provider(provider)
    size = get_default_size(img_provider)
    previews_dir = output_dir / content.battle.id / "previews"
    previews_dir.mkdir(parents=True, exist_ok=True)

    shots = content.storyboard
    if max_shots is not None:
        shots = shots[:max_shots]

    previews: list[ScenePreview] = []
    total = len(shots) + (1 if include_thumbnail else 0)
    done = 0

    for shot in shots:
        prompt = build_shot_prompt(shot, content.battle)
        filename = f"shot_{shot.shot_number:02d}.png"
        path = previews_dir / filename

        if on_progress:
            on_progress(done, total, f"Generating shot {shot.shot_number}...")

        try:
            img_provider.generate(prompt, path, size=size)
            previews.append(ScenePreview(
                shot_number=shot.shot_number,
                prompt=prompt,
                image_path=str(path),
                provider=img_provider.name,
                status="success",
                timestamp_start=shot.timestamp_start,
                timestamp_end=shot.timestamp_end,
                description=shot.description,
            ))
        except Exception as e:
            previews.append(ScenePreview(
                shot_number=shot.shot_number,
                prompt=prompt,
                image_path="",
                provider=img_provider.name,
                status="failed",
                error=str(e),
                timestamp_start=shot.timestamp_start,
                timestamp_end=shot.timestamp_end,
                description=shot.description,
            ))
        done += 1

    thumbnail_preview: Optional[ScenePreview] = None
    if include_thumbnail:
        thumb_prompt = build_thumbnail_prompt(content)
        thumb_path = previews_dir / "thumbnail.png"
        if on_progress:
            on_progress(done, total, "Generating thumbnail...")

        try:
            img_provider.generate(thumb_prompt, thumb_path, size=size)
            thumbnail_preview = ScenePreview(
                shot_number=-1,
                prompt=thumb_prompt,
                image_path=str(thumb_path),
                provider=img_provider.name,
                status="success",
                description="Thumbnail preview",
            )
        except Exception as e:
            thumbnail_preview = ScenePreview(
                shot_number=-1,
                prompt=thumb_prompt,
                image_path="",
                provider=img_provider.name,
                status="failed",
                error=str(e),
                description="Thumbnail preview",
            )

    return ScenePreviewPackage(
        battle_id=content.battle.id,
        provider=img_provider.name,
        previews=previews,
        thumbnail=thumbnail_preview,
        output_dir=str(previews_dir),
    )


def list_available_providers() -> list[dict]:
    """Return info about configured image providers."""
    providers = []
    for name in (ProviderName.OPENAI, ProviderName.MOCK):
        try:
            p = resolve_provider(name)
            providers.append({
                "name": name.value,
                "available": p.is_available(),
                "description": _provider_description(name),
            })
        except RuntimeError:
            providers.append({
                "name": name.value,
                "available": False,
                "description": _provider_description(name),
            })
    return providers


def _provider_description(name: ProviderName) -> str:
    return {
        ProviderName.OPENAI: "OpenAI DALL-E 3 — photorealistic AI scene previews (requires OPENAI_API_KEY)",
        ProviderName.MOCK: "Mock provider — styled placeholder previews, no API key needed",
    }.get(name, "")
