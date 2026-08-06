"""LEGO scene planning and build instructions."""

from __future__ import annotations

from lego_battle_forge.models import HistoricalBattle, LegoColor, UnitType


# Map historical colors to LEGO part suggestions
COLOR_PARTS: dict[LegoColor, list[str]] = {
    LegoColor.RED: ["3024 (1x1 plate)", "3005 (1x1 brick)", "3020 (2x2 plate)"],
    LegoColor.BLUE: ["3024 blue plate", "3005 blue brick", "3031 blue baseplate"],
    LegoColor.GREEN: ["3024 green plate", "2420 green slope", "3040 green roof"],
    LegoColor.GRAY: ["3024 light gray", "3005 dark gray brick"],
    LegoColor.BROWN: ["3005 brown brick", "3034 brown plate"],
    LegoColor.TAN: ["3024 tan plate", "3040 tan slope"],
    LegoColor.BLACK: ["3024 black plate", "3005 black brick"],
    LegoColor.WHITE: ["3024 white plate", "3005 white brick"],
    LegoColor.YELLOW: ["3024 yellow plate"],
    LegoColor.DARK_BLUE: ["3024 dark blue plate", "3005 dark blue brick"],
    LegoColor.DARK_RED: ["3024 dark red plate"],
}

TERRAIN_PRESETS: dict[str, dict] = {
    "mountain_pass": {
        "baseplate": "32x32 gray + brown slope walls",
        "features": ["narrow gap (6 studs wide)", "cliff walls (stacked slopes)", "dust clouds (cotton balls)"],
        "lighting": "warm sunset side-light",
    },
    "open_field": {
        "baseplate": "48x48 green",
        "features": ["mud patches (brown plates)", "hill (stacked plates)", "stake line (toothpicks)"],
        "lighting": "overcast diffused",
    },
    "urban_ruins": {
        "baseplate": "32x32 gray",
        "features": ["broken walls (angled bricks)", "rubble piles", "half-destroyed buildings"],
        "lighting": "harsh side light with shadows",
    },
    "naval": {
        "baseplate": "48x48 blue (ocean)",
        "features": ["carrier deck (flat gray plates)", "wake trails (white tiles)", "island (tan corner)"],
        "lighting": "bright overhead sun",
    },
    "ridge_line": {
        "baseplate": "32x32 green with elevation",
        "features": ["reverse slope ridge", "farmhouse (small building)", "mud patches"],
        "lighting": "morning mist (dry ice optional)",
    },
}

ERA_TERRAIN: dict[str, str] = {
    "Ancient Greece": "mountain_pass",
    "Medieval": "open_field",
    "Ancient Rome": "open_field",
    "Napoleonic": "ridge_line",
    "World War II": "urban_ruins",
}


def plan_lego_scene(battle: HistoricalBattle) -> tuple[list[str], dict[str, int]]:
    """Generate build notes and parts inventory for a battle."""
    terrain_key = ERA_TERRAIN.get(battle.era, "open_field")
    terrain = TERRAIN_PRESETS[terrain_key]

    notes: list[str] = [
        f"## Base Setup — {battle.name}",
        f"Terrain: {terrain_key.replace('_', ' ').title()}",
        f"Baseplate: {terrain['baseplate']}",
        "",
        "### Terrain Features",
    ]
    notes.extend(f"- {f}" for f in terrain["features"])
    notes.extend(["", f"### Lighting: {terrain['lighting']}", "", "### Faction Setup"])

    parts: dict[str, int] = {"baseplate": 1}

    for faction in battle.factions:
        notes.append(f"\n**{faction.name}** ({faction.color_scheme.value} army)")
        notes.append(f"Leader: {faction.leader} — place on elevated stud or horse brick")
        for unit in faction.units:
            accessory = f" with {unit.accessory}" if unit.accessory else ""
            pose = f", pose: {unit.pose}" if unit.pose else ""
            notes.append(f"- {unit.count}x {unit.name} ({unit.unit_type.value}){accessory}{pose}")
            key = f"{unit.color.value}_{unit.unit_type.value}"
            parts[key] = parts.get(key, 0) + unit.count

    notes.extend([
        "",
        "### Camera Rig Tips",
        "- Use a phone on a LEGO technic slider for smooth tracking shots",
        "- Low angle: place phone at baseplate level pointing up at minifigs",
        "- Overhead: phone on tripod directly above scene",
        "- Slow-mo: film at 60fps+, slow to 24fps in edit",
        "",
        "### Stop-Motion Tips",
        "- Move each figure 2-3mm per frame (12-15 frames per second)",
        "- Add motion blur in post for fast action shots",
        "- Cotton ball dust clouds between frames for impact moments",
        "- Use fishing line for 'flying' arrows/planes (remove in post)",
    ])

    return notes, parts


def suggest_minifig_customization(battle: HistoricalBattle) -> list[str]:
    """Era-appropriate minifig customization tips."""
    tips = {
        "Ancient Greece": [
            "Use Spartan helmet (LEGO part 3896) or bronze helmet pieces",
            "Red capes for Spartans, print Greek lambda on shields",
            "Spears from rod pieces + spear tip",
        ],
        "Medieval": [
            "Chainmail print torsos or gray bodies",
            "Use horse sets for cavalry (set 6021 or similar)",
            "Longbows from flex tube + technic pins",
        ],
        "Ancient Rome": [
            "Red plume helmets for centurions",
            "Scutum shields from 2x3 wedge plates",
            "Build elephants from gray bricks with tan howdah",
        ],
        "Napoleonic": [
            "Blue coats with white crossbelts (paint or sticker)",
            "Shakos from modified helmets",
            "Cannon from black wheel + gray barrel bricks",
        ],
        "World War II": [
            "Gray helmets (modern army helmets work)",
            "Build tanks from plates + slopes",
            "Rubble from mixed gray/brown broken builds",
        ],
    }
    return tips.get(battle.era, ["Use era-appropriate accessories from your collection"])
