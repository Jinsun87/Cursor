"""Data models for battle content generation."""

from __future__ import annotations

from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field


class ContentFormat(str, Enum):
    SHORT = "short"  # 15-30s
    REEL = "reel"  # 30-60s
    EXTENDED = "extended"  # 60-90s


class ViralAngle(str, Enum):
    UNDERDOG = "underdog"
    BETRAYAL = "betrayal"
    ONE_MISTAKE = "one_mistake"
    GENIUS_TACTIC = "genius_tactic"
    WHAT_IF = "what_if"
    FORBIDDEN = "forbidden"
    COUNTDOWN = "countdown"


class LegoColor(str, Enum):
    RED = "red"
    BLUE = "blue"
    GREEN = "green"
    YELLOW = "yellow"
    BLACK = "black"
    WHITE = "white"
    GRAY = "gray"
    BROWN = "brown"
    TAN = "tan"
    DARK_BLUE = "dark_blue"
    DARK_RED = "dark_red"


class UnitType(str, Enum):
    INFANTRY = "infantry"
    CAVALRY = "cavalry"
    ARCHER = "archer"
    ARTILLERY = "artillery"
    ELEPHANT = "elephant"
    SHIP = "ship"
    LEADER = "leader"
    SIEGE = "siege"


class LegoUnit(BaseModel):
    name: str
    unit_type: UnitType
    color: LegoColor
    count: int = 1
    accessory: Optional[str] = None
    pose: Optional[str] = None


class BattleFaction(BaseModel):
    name: str
    color_scheme: LegoColor
    units: list[LegoUnit]
    leader: str
    morale: str = "high"


class BattleMoment(BaseModel):
    """A key dramatic beat in the battle."""
    name: str
    description: str
    duration_seconds: float
    camera: str
    action: str
    sound_cue: str
    text_overlay: Optional[str] = None
    viral_hook: bool = False


class HistoricalBattle(BaseModel):
    id: str
    name: str
    year: int
    location: str
    era: str
    summary: str
    factions: list[BattleFaction]
    key_moments: list[BattleMoment]
    outcome: str
    fun_fact: str
    viral_angles: list[ViralAngle]
    difficulty: str = "medium"  # easy, medium, hard (build complexity)
    trending_score: int = Field(ge=1, le=10, default=7)


class ShotType(str, Enum):
    WIDE = "wide"
    CLOSE_UP = "close_up"
    LOW_ANGLE = "low_angle"
    OVERHEAD = "overhead"
    TRACKING = "tracking"
    SLOW_MO = "slow_mo"
    POV = "pov"
    SPLIT = "split"


class StoryboardShot(BaseModel):
    shot_number: int
    timestamp_start: float
    timestamp_end: float
    shot_type: ShotType
    description: str
    lego_setup: str
    camera_movement: str
    narration: str
    on_screen_text: Optional[str] = None
    sfx: Optional[str] = None
    music_cue: Optional[str] = None
    transition: Optional[str] = None


class ViralMetadata(BaseModel):
    title: str
    hook_line: str
    caption: str
    hashtags: list[str]
    suggested_audio: list[str]
    posting_tips: list[str]
    thumbnail_text: str
    controversy_score: int = Field(ge=1, le=10, default=5)


class GeneratedContent(BaseModel):
    battle: HistoricalBattle
    format: ContentFormat
    viral_angle: ViralAngle
    script_full: str
    storyboard: list[StoryboardShot]
    viral_metadata: ViralMetadata
    lego_build_notes: list[str]
    total_duration_seconds: float
    parts_needed: dict[str, int]
    scene_previews: Optional["ScenePreviewPackage"] = None


class ScenePreview(BaseModel):
    shot_number: int
    prompt: str
    image_path: str
    provider: str
    status: str  # success | failed
    error: Optional[str] = None
    timestamp_start: Optional[float] = None
    timestamp_end: Optional[float] = None
    description: Optional[str] = None


class ScenePreviewPackage(BaseModel):
    battle_id: str
    provider: str
    previews: list[ScenePreview]
    thumbnail: Optional[ScenePreview] = None
    output_dir: str
