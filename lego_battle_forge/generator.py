"""Storyboard and script generation engine."""

from __future__ import annotations

from lego_battle_forge.models import (
    BattleMoment,
    ContentFormat,
    HistoricalBattle,
    ShotType,
    StoryboardShot,
    ViralAngle,
)

FORMAT_DURATIONS = {
    ContentFormat.SHORT: 25.0,
    ContentFormat.REEL: 55.0,
    ContentFormat.EXTENDED: 85.0,
}

SHOT_TYPE_MAP = {
    "wide": ShotType.WIDE,
    "close-up": ShotType.CLOSE_UP,
    "close up": ShotType.CLOSE_UP,
    "low angle": ShotType.LOW_ANGLE,
    "overhead": ShotType.OVERHEAD,
    "tracking": ShotType.TRACKING,
    "slow-mo": ShotType.SLOW_MO,
    "pov": ShotType.POV,
    "split": ShotType.SPLIT,
}


def _map_camera(camera: str) -> ShotType:
    lower = camera.lower()
    for key, shot_type in SHOT_TYPE_MAP.items():
        if key in lower:
            return shot_type
    return ShotType.WIDE


def _hook_shot(battle: HistoricalBattle, hook_line: str, duration: float) -> StoryboardShot:
    return StoryboardShot(
        shot_number=0,
        timestamp_start=0.0,
        timestamp_end=3.0,
        shot_type=ShotType.CLOSE_UP,
        description=f"Pattern interrupt: LEGO minifig face close-up or dramatic battle wide shot of {battle.name}",
        lego_setup="Hero minifig in dramatic pose, shallow depth of field (blur background with tissue paper)",
        camera_movement="Quick zoom in (0.5s) then hold",
        narration=hook_line,
        on_screen_text=hook_line.split(".")[0].upper()[:40],
        sfx="Impact hit + bass drop",
        music_cue="Silence → sudden sting",
        transition="Hard cut",
    )


def _moment_to_shot(
    moment: BattleMoment,
    shot_number: int,
    start: float,
    narration: str,
) -> StoryboardShot:
    return StoryboardShot(
        shot_number=shot_number,
        timestamp_start=start,
        timestamp_end=start + moment.duration_seconds,
        shot_type=_map_camera(moment.camera),
        description=moment.description,
        lego_setup=f"Action: {moment.action}. Camera: {moment.camera}",
        camera_movement=moment.camera,
        narration=narration,
        on_screen_text=moment.text_overlay,
        sfx=moment.sound_cue,
        music_cue="Build tension" if moment.viral_hook else "Maintain energy",
        transition="Quick cut" if moment.viral_hook else "Smooth dissolve",
    )


def _outro_shot(battle: HistoricalBattle, start: float, duration: float) -> StoryboardShot:
    return StoryboardShot(
        shot_number=99,
        timestamp_start=start,
        timestamp_end=start + duration,
        shot_type=ShotType.WIDE,
        description=f"Aftermath wide shot: {battle.outcome}",
        lego_setup="Winner faction standing, loser faction fallen. Banner raised.",
        camera_movement="Slow pullback revealing full battlefield",
        narration=f"Result: {battle.outcome} Fun fact: {battle.fun_fact}",
        on_screen_text="FOLLOW FOR MORE",
        sfx="Epic resolution chord",
        music_cue="Fade out swell",
        transition="Fade to black",
    )


ANGLE_NARRATION: dict[ViralAngle, str] = {
    ViralAngle.UNDERDOG: "Nobody gave them a chance. But here's what actually happened.",
    ViralAngle.BETRAYAL: "They had already won. Then one person changed everything.",
    ViralAngle.ONE_MISTAKE: "One decision. That's all it took to lose everything.",
    ViralAngle.GENIUS_TACTIC: "This is considered the greatest military maneuver ever.",
    ViralAngle.WHAT_IF: "History hinged on the smallest details.",
    ViralAngle.FORBIDDEN: "What they don't put in your history textbook.",
    ViralAngle.COUNTDOWN: "These are the moments that decided everything.",
}


def generate_storyboard(
    battle: HistoricalBattle,
    fmt: ContentFormat,
    angle: ViralAngle,
    hook_line: str,
) -> tuple[list[StoryboardShot], str]:
    """Build a shot-by-shot storyboard and full narration script."""
    target_duration = FORMAT_DURATIONS[fmt]
    shots: list[StoryboardShot] = []

    # Hook (always first 3 seconds)
    hook = _hook_shot(battle, hook_line, 3.0)
    shots.append(hook)
    current_time = 3.0

    # Context setup (3-8 seconds)
    setup = StoryboardShot(
        shot_number=1,
        timestamp_start=3.0,
        timestamp_end=8.0,
        shot_type=ShotType.OVERHEAD,
        description=f"Establish battlefield: {battle.location}, {abs(battle.year)} {'BC' if battle.year < 0 else 'AD'}",
        lego_setup=(
            f"Wide overhead of full diorama. "
            f"{battle.factions[0].name} ({battle.factions[0].color_scheme.value}) vs "
            f"{battle.factions[1].name} ({battle.factions[1].color_scheme.value})"
        ),
        camera_movement="Slow overhead pan across battlefield",
        narration=f"{ANGLE_NARRATION[angle]} {battle.summary}",
        on_screen_text=f"{abs(battle.year)} {'BC' if battle.year < 0 else ''} • {battle.location}",
        sfx="Ambient wind + distant drums",
        music_cue="Tension build",
        transition="Dissolve",
    )
    shots.append(setup)
    current_time = 8.0

    # Key moments — fit as many as duration allows
    remaining = target_duration - current_time - 5.0  # reserve 5s for outro
    moments = [m for m in battle.key_moments if m.viral_hook] + [
        m for m in battle.key_moments if not m.viral_hook
    ]

    shot_num = 2
    for moment in moments:
        if remaining <= 0:
            break
        dur = min(moment.duration_seconds, remaining)
        narration = f"{moment.name}: {moment.description}"
        shot = _moment_to_shot(moment, shot_num, current_time, narration)
        shot.timestamp_end = current_time + dur
        shots.append(shot)
        current_time += dur
        remaining -= dur
        shot_num += 1

    # Outro
    outro_dur = min(5.0, target_duration - current_time)
    outro = _outro_shot(battle, current_time, outro_dur)
    outro.shot_number = shot_num
    shots.append(outro)

    # Build full script
    script_lines = [
        f"# {battle.name} — LEGO Battle Script",
        f"Format: {fmt.value} | Angle: {angle.value} | Duration: ~{current_time + outro_dur:.0f}s",
        "",
        "---",
        "",
    ]
    for shot in shots:
        ts = f"[{shot.timestamp_start:.1f}s - {shot.timestamp_end:.1f}s]"
        script_lines.append(f"{ts} SHOT {shot.shot_number}")
        script_lines.append(f"NARRATION: \"{shot.narration}\"")
        if shot.on_screen_text:
            script_lines.append(f"TEXT ON SCREEN: {shot.on_screen_text}")
        script_lines.append(f"SFX: {shot.sfx or 'none'}")
        script_lines.append("")

    return shots, "\n".join(script_lines)
