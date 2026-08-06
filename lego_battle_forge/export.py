"""Export generated content to various formats."""

from __future__ import annotations

import json
from pathlib import Path

from lego_battle_forge.models import GeneratedContent


def export_json(content: GeneratedContent, output_path: Path) -> Path:
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(content.model_dump_json(indent=2))
    return output_path


def export_markdown(content: GeneratedContent, output_path: Path) -> Path:
    c = content
    b = c.battle
    vm = c.viral_metadata

    lines = [
        f"# {vm.title}",
        "",
        f"**Battle:** {b.name} ({abs(b.year)} {'BC' if b.year < 0 else 'AD'})",
        f"**Format:** {c.format.value} | **Angle:** {c.viral_angle.value}",
        f"**Duration:** ~{c.total_duration_seconds:.0f} seconds",
        "",
        "## Hook",
        f"> {vm.hook_line}",
        "",
        "## Caption (copy-paste for posting)",
        "```",
        vm.caption,
        "```",
        "",
        "## Hashtags",
        " ".join(vm.hashtags),
        "",
        "## Suggested Audio",
    ]
    lines.extend(f"- {a}" for a in vm.suggested_audio)
    lines.extend([
        "",
        "## Thumbnail Text",
        f"**{vm.thumbnail_text}**",
        "",
        "## Posting Tips",
    ])
    lines.extend(f"- {t}" for t in vm.posting_tips)
    lines.extend([
        "",
        "## Full Script",
        "",
        c.script_full,
        "",
        "## Storyboard",
        "",
    ])

    for shot in c.storyboard:
        lines.extend([
            f"### Shot {shot.shot_number} [{shot.timestamp_start:.1f}s - {shot.timestamp_end:.1f}s]",
            f"- **Type:** {shot.shot_type.value}",
            f"- **Description:** {shot.description}",
            f"- **LEGO Setup:** {shot.lego_setup}",
            f"- **Camera:** {shot.camera_movement}",
            f"- **Narration:** {shot.narration}",
        ])
        if shot.on_screen_text:
            lines.append(f"- **On-screen text:** {shot.on_screen_text}")
        if shot.sfx:
            lines.append(f"- **SFX:** {shot.sfx}")
        lines.append("")

    if c.scene_previews:
        sp = c.scene_previews
        lines.extend([
            "## Scene Previews",
            "",
            f"Provider: **{sp.provider}** | Output: `{sp.output_dir}`",
            "",
        ])
        for p in sp.previews:
            status = "✓" if p.status == "success" else f"✗ {p.error}"
            lines.append(f"- Shot {p.shot_number}: {status}")
            if p.status == "success":
                lines.append(f"  - `{p.image_path}`")
        if sp.thumbnail and sp.thumbnail.status == "success":
            lines.append(f"- Thumbnail: `{sp.thumbnail.image_path}`")
        lines.append("")

    lines.extend([
        "## LEGO Build Notes",
        "",
    ])
    lines.extend(c.lego_build_notes)
    lines.extend([
        "",
        "## Parts Inventory",
        "",
        "| Part | Quantity |",
        "|------|----------|",
    ])
    for part, qty in sorted(c.parts_needed.items()):
        lines.append(f"| {part} | {qty} |")

    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text("\n".join(lines))
    return output_path


def export_shot_list(content: GeneratedContent, output_path: Path) -> Path:
    """Simple shot list for on-set reference."""
    lines = [f"SHOT LIST — {content.battle.name}", f"Total: ~{content.total_duration_seconds:.0f}s", ""]
    for shot in content.storyboard:
        lines.append(
            f"#{shot.shot_number:02d} | {shot.timestamp_start:05.1f}-{shot.timestamp_end:05.1f}s | "
            f"{shot.shot_type.value:12s} | {shot.description[:60]}"
        )
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text("\n".join(lines))
    return output_path


def export_all(content: GeneratedContent, output_dir: Path) -> dict[str, Path]:
    slug = content.battle.id
    return {
        "json": export_json(content, output_dir / f"{slug}.json"),
        "markdown": export_markdown(content, output_dir / f"{slug}.md"),
        "shot_list": export_shot_list(content, output_dir / f"{slug}_shots.txt"),
    }
