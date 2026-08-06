#!/usr/bin/env python3
"""CLI for LEGO Battle Forge."""

from __future__ import annotations

from pathlib import Path
from typing import Optional

import typer
from rich.console import Console
from rich.panel import Panel
from rich.table import Table

from lego_battle_forge.battles.database import list_battles
from lego_battle_forge.export import export_all
from lego_battle_forge.forge import generate_battle_content, generate_random_battle
from lego_battle_forge.images.config import ProviderName
from lego_battle_forge.images.export import export_previews
from lego_battle_forge.images.generator import generate_scene_previews, list_available_providers
from lego_battle_forge.models import ContentFormat, ViralAngle

app = typer.Typer(
    name="lego-battle-forge",
    help="Generate viral LEGO historical battle shorts & reels content.",
    add_completion=False,
)
console = Console()


@app.command("list")
def list_cmd():
    """List all available historical battles."""
    battles = list_battles()
    table = Table(title="Historical Battles (sorted by viral potential)")
    table.add_column("ID", style="cyan")
    table.add_column("Name", style="bold")
    table.add_column("Year")
    table.add_column("Era")
    table.add_column("Viral Score", justify="center")
    table.add_column("Difficulty")

    for b in battles:
        year_str = f"{abs(b.year)} {'BC' if b.year < 0 else 'AD'}"
        table.add_row(b.id, b.name, year_str, b.era, str(b.trending_score), b.difficulty)

    console.print(table)


@app.command("generate")
def generate_cmd(
    battle_id: Optional[str] = typer.Argument(None, help="Battle ID (e.g. thermopylae). Random if omitted."),
    format: str = typer.Option("reel", "--format", "-f", help="Content format: short, reel, extended"),
    angle: Optional[str] = typer.Option(None, "--angle", "-a", help="Viral angle override"),
    output: Path = typer.Option(Path("output"), "--output", "-o", help="Output directory"),
    show_script: bool = typer.Option(True, "--script/--no-script", help="Print script to terminal"),
    previews: bool = typer.Option(False, "--previews/--no-previews", help="Generate AI scene preview images"),
    provider: str = typer.Option("auto", "--provider", "-p", help="Image provider: auto, openai, mock"),
    max_shots: Optional[int] = typer.Option(None, "--max-shots", help="Limit number of preview shots to generate"),
):
    """Generate a complete content package for a battle."""
    fmt = ContentFormat(format.lower())
    viral_angle = ViralAngle(angle.lower()) if angle else None

    if battle_id:
        content = generate_battle_content(battle_id, fmt, viral_angle)
    else:
        content = generate_random_battle(fmt, viral_angle)
        console.print(f"[dim]Auto-selected: {content.battle.name}[/dim]\n")

    paths = export_all(content, output)
    vm = content.viral_metadata

    preview_paths = {}
    if previews:
        console.print("[dim]Generating scene previews...[/dim]")
        preview_pkg = generate_scene_previews(
            content, output,
            provider=ProviderName(provider.lower()),
            max_shots=max_shots,
            on_progress=lambda done, total, msg: console.print(f"  [{done}/{total}] {msg}"),
        )
        content.scene_previews = preview_pkg
        preview_paths = export_previews(content, preview_pkg, output)
        # Re-export JSON with preview metadata
        paths["json"] = export_all(content, output)["json"]

    console.print(Panel(
        f"[bold]{vm.title}[/bold]\n\n"
        f"[yellow]Hook:[/yellow] {vm.hook_line}\n\n"
        f"[green]Duration:[/green] ~{content.total_duration_seconds:.0f}s | "
        f"[green]Shots:[/green] {len(content.storyboard)} | "
        f"[green]Angle:[/green] {content.viral_angle.value}"
        + (f"\n[green]Previews:[/green] {len(content.scene_previews.previews)} images ({content.scene_previews.provider})" if content.scene_previews else ""),
        title="Generated Content",
        border_style="green",
    ))

    console.print("\n[bold]Hashtags:[/bold]", " ".join(vm.hashtags[:8]))
    console.print("\n[bold]Files exported:[/bold]")
    for name, path in paths.items():
        console.print(f"  {name}: {path}")
    for name, path in preview_paths.items():
        console.print(f"  {name}: {path}")

    if show_script:
        console.print("\n" + Panel(content.script_full, title="Script", border_style="blue"))


@app.command("previews")
def previews_cmd(
    battle_id: str = typer.Argument(..., help="Battle ID (e.g. thermopylae)"),
    output: Path = typer.Option(Path("output"), "--output", "-o", help="Output directory"),
    provider: str = typer.Option("auto", "--provider", "-p", help="Image provider: auto, openai, mock"),
    format: str = typer.Option("reel", "--format", "-f", help="Content format for storyboard"),
    max_shots: Optional[int] = typer.Option(None, "--max-shots", help="Limit preview shots"),
    thumbnail: bool = typer.Option(True, "--thumbnail/--no-thumbnail", help="Generate thumbnail preview"),
):
    """Generate AI scene preview images for a battle's storyboard."""
    fmt = ContentFormat(format.lower())
    content = generate_battle_content(battle_id, fmt)

    console.print(f"[bold]Generating previews for {content.battle.name}[/bold]")
    console.print(f"[dim]Provider: {provider}[/dim]\n")

    preview_pkg = generate_scene_previews(
        content, output,
        provider=ProviderName(provider.lower()),
        include_thumbnail=thumbnail,
        max_shots=max_shots,
        on_progress=lambda done, total, msg: console.print(f"  [{done}/{total}] {msg}"),
    )
    content.scene_previews = preview_pkg
    paths = export_previews(content, preview_pkg, output)
    export_all(content, output)

    success = sum(1 for p in preview_pkg.previews if p.status == "success")
    failed = len(preview_pkg.previews) - success

    console.print(Panel(
        f"[green]Generated {success} previews[/green]"
        + (f" [red]({failed} failed)[/red]" if failed else "")
        + f"\nProvider: {preview_pkg.provider}\nOutput: {preview_pkg.output_dir}",
        title="Scene Previews",
        border_style="green",
    ))
    for name, path in paths.items():
        console.print(f"  {name}: {path}")


@app.command("providers")
def providers_cmd():
    """List available AI image generation providers."""
    table = Table(title="Image Generation Providers")
    table.add_column("Provider", style="cyan")
    table.add_column("Available", justify="center")
    table.add_column("Description")

    for p in list_available_providers():
        avail = "[green]✓[/green]" if p["available"] else "[red]✗[/red]"
        table.add_row(p["name"], avail, p["description"])

    console.print(table)
    console.print("\n[dim]Set OPENAI_API_KEY for real AI previews. Use --provider mock for free placeholders.[/dim]")


@app.command("batch")
def batch_cmd(
    output: Path = typer.Option(Path("output/batch"), "--output", "-o"),
    format: str = typer.Option("reel", "--format", "-f"),
):
    """Generate content for ALL battles (content calendar)."""
    fmt = ContentFormat(format.lower())
    battles = list_battles()
    console.print(f"Generating {len(battles)} battles...\n")

    for b in battles:
        content = generate_battle_content(b.id, fmt)
        paths = export_all(content, output)
        console.print(f"  [green]✓[/green] {b.name} → {paths['markdown'].name}")

    console.print(f"\n[bold]Done![/bold] {len(battles)} content packages in {output}/")


@app.command("angles")
def angles_cmd():
    """List available viral content angles."""
    table = Table(title="Viral Content Angles")
    table.add_column("Angle", style="cyan")
    table.add_column("Best For")
    angles_info = {
        "underdog": "David vs Goliath stories — high emotional engagement",
        "betrayal": "Plot twists — drives comments and shares",
        "one_mistake": "Cautionary tales — 'what NOT to do' hooks",
        "genius_tactic": "Educational + impressive — high save rate",
        "what_if": "Speculation — drives debate in comments",
        "forbidden": "Edgy/controversial — high watch time",
        "countdown": "Listicle format — proven retention structure",
    }
    for angle, desc in angles_info.items():
        table.add_row(angle, desc)
    console.print(table)


if __name__ == "__main__":
    app()
