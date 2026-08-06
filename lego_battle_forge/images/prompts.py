"""Build AI image prompts from storyboard shots."""

from __future__ import annotations

from lego_battle_forge.models import GeneratedContent, HistoricalBattle, StoryboardShot

STYLE_PREFIX = (
    "Photorealistic LEGO stop-motion diorama miniature scene, "
    "plastic brick construction with visible studs, cinematic lighting, "
    "shallow depth of field, dramatic atmosphere, highly detailed, "
    "toy photography aesthetic, NOT cartoon, NOT illustration"
)

STYLE_SUFFIX = (
    "Vertical 9:16 composition for social media shorts. "
    "Warm cinematic color grading. No text, no watermarks, no logos."
)

SHOT_CAMERA_HINTS = {
    "wide": "wide establishing shot showing full battlefield diorama",
    "close_up": "extreme close-up on LEGO minifigure faces and details",
    "low_angle": "low angle hero shot looking up at minifigures",
    "overhead": "top-down bird's eye tactical view of the battlefield",
    "tracking": "dynamic tracking shot with motion blur feel",
    "slow_mo": "frozen action moment with dust particles suspended",
    "pov": "first-person point of view through the battle",
    "split": "split composition showing two opposing forces",
}

ERA_AESTHETICS = {
    "Ancient Greece": "bronze helmets, red capes, spears, Greek lambda shields, rocky mountain pass terrain",
    "Medieval": "chainmail armor, longbows, castle walls, muddy battlefield, horses",
    "Ancient Rome": "Roman legionary armor, red plumes, scutum shields, war elephants",
    "Napoleonic": "blue military coats, shakos, cannons, rolling green hills",
    "World War II": "military helmets, tanks built from gray bricks, urban rubble ruins, smoke",
}


def _faction_colors(battle: HistoricalBattle) -> str:
    parts = []
    for f in battle.factions:
        parts.append(f"{f.name} army in {f.color_scheme.value} LEGO bricks")
    return " versus ".join(parts)


def build_shot_prompt(
    shot: StoryboardShot,
    battle: HistoricalBattle,
    *,
    include_overlay_hint: bool = False,
) -> str:
    """Convert a storyboard shot into an optimized image generation prompt."""
    camera = SHOT_CAMERA_HINTS.get(shot.shot_type.value, "cinematic medium shot")
    era = ERA_AESTHETICS.get(battle.era, "historically accurate military minifigures")
    factions = _faction_colors(battle)

    overlay = ""
    if include_overlay_hint and shot.on_screen_text:
        overlay = f' Leave negative space at top for text overlay reading "{shot.on_screen_text}".'

    return (
        f"{STYLE_PREFIX}. "
        f"Scene: {battle.name} ({abs(battle.year)} {'BC' if battle.year < 0 else 'AD'}), "
        f"{battle.location}. {shot.description}. "
        f"LEGO setup: {shot.lego_setup}. "
        f"Era details: {era}. Factions: {factions}. "
        f"Camera: {camera}, {shot.camera_movement}. "
        f"Action: {shot.narration}. "
        f"{STYLE_SUFFIX}{overlay}"
    )


def build_thumbnail_prompt(content: GeneratedContent) -> str:
    """Generate a thumbnail-optimized prompt for maximum click-through."""
    b = content.battle
    vm = content.viral_metadata
    era = ERA_AESTHETICS.get(b.era, "historical military")
    return (
        f"{STYLE_PREFIX}. "
        f"Epic thumbnail for {b.name}. "
        f"Dramatic {era} LEGO battle diorama. "
        f"{_faction_colors(b)}. "
        f"Explosive action moment, high contrast, eye-catching composition. "
        f"Leave bold negative space for text. "
        f"Mood: {vm.thumbnail_text}. "
        f"{STYLE_SUFFIX}"
    )


def build_all_prompts(content: GeneratedContent) -> list[tuple[int, str]]:
    """Return (shot_number, prompt) pairs for every storyboard shot."""
    return [
        (shot.shot_number, build_shot_prompt(shot, content.battle))
        for shot in content.storyboard
    ]
