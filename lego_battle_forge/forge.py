"""Main content generation pipeline."""

from __future__ import annotations

from typing import Optional

from lego_battle_forge.battles.database import get_battle, list_battles
from lego_battle_forge.generator import FORMAT_DURATIONS, generate_storyboard
from lego_battle_forge.lego.scene_planner import plan_lego_scene, suggest_minifig_customization
from lego_battle_forge.models import ContentFormat, GeneratedContent, ViralAngle
from lego_battle_forge.viral.optimizer import generate_viral_metadata, pick_viral_angle


def generate_battle_content(
    battle_id: str,
    fmt: ContentFormat = ContentFormat.REEL,
    angle: Optional[ViralAngle] = None,
) -> GeneratedContent:
    """Generate a complete viral LEGO battle content package."""
    battle = get_battle(battle_id)
    viral_angle = pick_viral_angle(battle, angle)
    viral_meta = generate_viral_metadata(battle, viral_angle, fmt)
    storyboard, script = generate_storyboard(battle, fmt, viral_angle, viral_meta.hook_line)
    build_notes, parts = plan_lego_scene(battle)

    customization = suggest_minifig_customization(battle)
    build_notes.extend(["", "### Minifig Customization"] + [f"- {t}" for t in customization])

    total_duration = storyboard[-1].timestamp_end if storyboard else FORMAT_DURATIONS[fmt]

    return GeneratedContent(
        battle=battle,
        format=fmt,
        viral_angle=viral_angle,
        script_full=script,
        storyboard=storyboard,
        viral_metadata=viral_meta,
        lego_build_notes=build_notes,
        total_duration_seconds=total_duration,
        parts_needed=parts,
    )


def generate_random_battle(
    fmt: ContentFormat = ContentFormat.REEL,
    angle: Optional[ViralAngle] = None,
) -> GeneratedContent:
    """Pick the highest-trending battle and generate content."""
    battles = list_battles()
    if not battles:
        raise ValueError("No battles in database")
    return generate_battle_content(battles[0].id, fmt, angle)
