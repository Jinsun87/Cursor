"""Viral content optimization — hooks, captions, hashtags."""

from __future__ import annotations

import random
from typing import Optional

from lego_battle_forge.models import ContentFormat, HistoricalBattle, ViralAngle, ViralMetadata

HOOK_TEMPLATES: dict[ViralAngle, list[str]] = {
    ViralAngle.UNDERDOG: [
        "They were outnumbered {ratio}. They still fought.",
        "Everyone said they'd lose. Then THIS happened.",
        "{count} soldiers vs an empire. Guess who won?",
        "The most impossible battle in history — told in LEGO",
    ],
    ViralAngle.BETRAYAL: [
        "One traitor ended the greatest last stand in history",
        "They were WINNING... until someone betrayed them",
        "The backstab that changed {era} forever",
        "Trust no one. This battle proves it.",
    ],
    ViralAngle.ONE_MISTAKE: [
        "ONE mistake cost them everything",
        "They were winning until someone did THIS",
        "The dumbest decision in military history",
        "How to lose a war in 5 minutes (LEGO edition)",
    ],
    ViralAngle.GENIUS_TACTIC: [
        "This is the smartest battle tactic ever devised",
        "Military professors STILL teach this move",
        "He tricked {enemy_count} soldiers with ONE move",
        "The battle plan so perfect it shouldn't be legal",
    ],
    ViralAngle.WHAT_IF: [
        "What if the weather was different? History changes.",
        "One hour. That's all that separated victory from defeat.",
        "The battle that ALMOST went the other way",
        "History's biggest 'what if' — in LEGO",
    ],
    ViralAngle.FORBIDDEN: [
        "They don't teach this in school",
        "The battle too brutal for textbooks",
        "History's darkest day — miniature edition",
        "This battle had more deaths than any other in history",
    ],
    ViralAngle.COUNTDOWN: [
        "5 moments that decided {battle_name}",
        "Watch history collapse in 60 seconds",
        "Every second of {battle_name} explained with LEGO",
        "The 60 seconds that ended an empire",
    ],
}

TRENDING_AUDIO: list[str] = [
    "Epic orchestral (Hans Zimmer style) — no copyright",
    "Bones / SUV — for fast cuts and reveals",
    "Phonk drift — for battle chaos sequences",
    "Classical war drums — for ancient battles",
    "Interstellar organ swell — for emotional moments",
    "Original sound (your voiceover) — best for algorithm",
    "Trending 'oh no' sound — for mistake reveals",
    "Heartbeat bass drop — for countdown hooks",
]

HASHTAG_POOL: list[str] = [
    "#history", "#lego", "#legobattle", "#historytok", "#historyfacts",
    "#learnontiktok", "#edutok", "#battle", "#war", "#military",
    "#miniature", "#stopmotion", "#legostopmotion", "#shorts",
    "#reels", "#viral", "#fyp", "#foryou", "#didyouknow",
    "#ancienthistory", "#ww2", "#medieval", "#epic", "#satisfying",
]

POSTING_TIPS: list[str] = [
    "Post between 6-9 PM local time for max engagement",
    "Reply to every comment in the first hour — boosts algorithm",
    "Pin a comment asking 'Which battle next?' to drive engagement",
    "Use a pattern interrupt in frame 1 (explosion, text slam, zoom)",
    "Keep text on screen for max 2 seconds — readability on mobile",
    "End with a cliffhanger or question to drive comments",
    "Cross-post to TikTok, YouTube Shorts, and Instagram Reels",
    "First 3 seconds determine 80% of retention — nail the hook",
    "Use captions/subtitles — 80% watch without sound",
    "Post 3-5x per week for algorithm momentum",
]


def _format_hook(template: str, battle: HistoricalBattle) -> str:
    total_def = sum(u.count for f in battle.factions[1:] for u in f.units) if len(battle.factions) > 1 else 100
    total_att = sum(u.count for f in battle.factions[:1] for u in f.units)
    ratio = f"{total_att}:{total_def}" if total_def else "1:100"

    return template.format(
        ratio=ratio,
        count=total_att,
        era=battle.era,
        enemy_count=total_def,
        battle_name=battle.name,
    )


def pick_viral_angle(battle: HistoricalBattle, preferred: Optional[ViralAngle] = None) -> ViralAngle:
    if preferred and preferred in battle.viral_angles:
        return preferred
    return random.choice(battle.viral_angles)


def generate_viral_metadata(
    battle: HistoricalBattle,
    angle: ViralAngle,
    fmt: ContentFormat,
) -> ViralMetadata:
    hooks = HOOK_TEMPLATES[angle]
    hook = _format_hook(random.choice(hooks), battle)

    duration_label = {"short": "15s", "reel": "60s", "extended": "90s"}[fmt.value]

    title_options = [
        f"{battle.name} in LEGO ({duration_label})",
        f"The {battle.name} — LEGO Battle",
        f"POV: You're at the {battle.name}",
        f"{battle.year}: The battle that changed everything",
    ]
    title = random.choice(title_options)

    caption = (
        f"{hook}\n\n"
        f"⚔️ {battle.name} ({abs(battle.year)} {'BC' if battle.year < 0 else 'AD'})\n"
        f"📍 {battle.location}\n\n"
        f"{battle.fun_fact}\n\n"
        f"Which battle should I build next? 👇\n"
        f"Follow for more LEGO history!"
    )

    # Battle-specific hashtags
    era_tags = {
        "Ancient Greece": ["#ancientgreece", "#sparta", "#persia"],
        "Medieval": ["#medieval", "#knights", "#england"],
        "Ancient Rome": ["#rome", "#hannibal", "#ancientrome"],
        "Napoleonic": ["#napoleon", "#napoleonic", "#waterloo"],
        "World War II": ["#ww2", "#worldwar2", "#stalingrad"],
    }
    specific = era_tags.get(battle.era, [])
    hashtags = list(dict.fromkeys(
        ["#lego", "#history", "#legobattle", "#shorts", "#fyp"] + specific + random.sample(HASHTAG_POOL, 8)
    ))[:15]

    thumbnail_texts = [
        hook.split(".")[0].upper(),
        f"{abs(battle.year)}",
        "THEY LOST",
        "IMPOSSIBLE",
        battle.factions[0].name.upper(),
    ]

    return ViralMetadata(
        title=title,
        hook_line=hook,
        caption=caption,
        hashtags=hashtags,
        suggested_audio=random.sample(TRENDING_AUDIO, 4),
        posting_tips=random.sample(POSTING_TIPS, 5),
        thumbnail_text=random.choice(thumbnail_texts),
        controversy_score=min(10, battle.trending_score),
    )
