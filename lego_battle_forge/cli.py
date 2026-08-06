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

    console.print(Panel(
        f"[bold]{vm.title}[/bold]\n\n"
        f"[yellow]Hook:[/yellow] {vm.hook_line}\n\n"
        f"[green]Duration:[/green] ~{content.total_duration_seconds:.0f}s | "
        f"[green]Shots:[/green] {len(content.storyboard)} | "
        f"[green]Angle:[/green] {content.viral_angle.value}",
        title="Generated Content",
        border_style="green",
    ))

    console.print("\n[bold]Hashtags:[/bold]", " ".join(vm.hashtags[:8]))
    console.print("\n[bold]Files exported:[/bold]")
    for name, path in paths.items():
        console.print(f"  {name}: {path}")

    if show_script:
        console.print("\n" + Panel(content.script_full, title="Script", border_style="blue"))


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
