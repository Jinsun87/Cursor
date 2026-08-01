"""CLI for the Arsenal News → Facebook agent."""

from __future__ import annotations

import logging
from typing import Optional

import typer
from rich.console import Console
from rich.logging import RichHandler
from rich.table import Table

from arsenal_agent import __version__
from arsenal_agent.agent import ArsenalNewsAgent
from arsenal_agent.config import get_settings
from arsenal_agent.facebook.client import FacebookError

app = typer.Typer(
    name="arsenal-agent",
    help="Monitor Arsenal news and post to Facebook as soon as stories break.",
    add_completion=False,
)
console = Console()


def _configure_logging(verbose: bool) -> None:
    level = logging.DEBUG if verbose else logging.INFO
    logging.basicConfig(
        level=level,
        format="%(message)s",
        datefmt="[%X]",
        handlers=[RichHandler(console=console, rich_tracebacks=True)],
    )


@app.callback()
def main(
    verbose: bool = typer.Option(False, "--verbose", "-v", help="Debug logging"),
) -> None:
    _configure_logging(verbose)


@app.command("run")
def run(
    once: bool = typer.Option(
        False, "--once", help="Poll feeds a single time then exit"
    ),
    cycles: Optional[int] = typer.Option(
        None, "--cycles", help="Run a fixed number of poll cycles"
    ),
) -> None:
    """Start the agent (continuous by default)."""
    settings = get_settings()
    if settings.publish_mode != "dry_run" and not settings.facebook_configured:
        console.print(
            "[yellow]Facebook credentials missing — forcing dry_run mode. "
            "Set FACEBOOK_PAGE_ID and FACEBOOK_PAGE_ACCESS_TOKEN.[/yellow]"
        )
        settings.publish_mode = "dry_run"

    with ArsenalNewsAgent(settings=settings) as agent:
        if once:
            result = agent.run_once()
            _print_cycle(result)
            raise typer.Exit(code=1 if result.errors else 0)
        agent.run_forever(stop_after=cycles)


@app.command("bootstrap")
def bootstrap() -> None:
    """Mark all current feed items as seen without posting (first-run setup)."""
    with ArsenalNewsAgent() as agent:
        count = agent.bootstrap_skip_existing()
    console.print(
        f"[green]Seeded {count} existing articles as seen.[/green] "
        "Future releases will be posted."
    )


@app.command("preview")
def preview(
    limit: int = typer.Option(5, "--limit", "-n", help="How many articles to show"),
) -> None:
    """Fetch latest Arsenal headlines and show the Facebook drafts (no publish)."""
    settings = get_settings()
    settings.publish_mode = "dry_run"

    with ArsenalNewsAgent(settings=settings) as agent:
        articles = agent.fetcher.fetch_all()[:limit]
        if not articles:
            console.print("[yellow]No articles found from configured feeds.[/yellow]")
            raise typer.Exit(code=1)

        table = Table(title="Arsenal news draft preview")
        table.add_column("Source", style="cyan")
        table.add_column("Title")
        table.add_column("Age (h)", justify="right")
        table.add_column("Draft (excerpt)")

        for article in articles:
            draft = agent.generator.generate(article)
            excerpt = draft.message.replace("\n", " ")[:120] + "…"
            table.add_row(
                article.source,
                article.title[:60],
                f"{article.age_hours:.1f}",
                excerpt,
            )
        console.print(table)


@app.command("verify-facebook")
def verify_facebook() -> None:
    """Check that Facebook Page credentials work."""
    settings = get_settings()
    with ArsenalNewsAgent(settings=settings) as agent:
        try:
            data = agent.facebook.verify_token()
        except FacebookError as exc:
            console.print(f"[red]Facebook check failed:[/red] {exc}")
            raise typer.Exit(code=1) from exc
    console.print(
        f"[green]OK[/green] — Page {data.get('name')} (id={data.get('id')})"
    )


@app.command("history")
def history(
    limit: int = typer.Option(15, "--limit", "-n"),
) -> None:
    """Show recently processed / posted articles."""
    with ArsenalNewsAgent() as agent:
        rows = agent.store.recent(limit=limit)

    if not rows:
        console.print("No history yet.")
        return

    table = Table(title="Processed articles")
    table.add_column("When")
    table.add_column("Source")
    table.add_column("Title")
    table.add_column("FB post")
    table.add_column("Mode")
    for row in rows:
        table.add_row(
            str(row["processed_at"])[:19],
            row["source"] or "",
            (row["title"] or "")[:50],
            row["facebook_post_id"] or "—",
            row["publish_mode"] or "",
        )
    console.print(table)


@app.command("version")
def version() -> None:
    console.print(__version__)


def _print_cycle(result) -> None:
    console.print(
        f"New articles: {result.new_articles} | "
        f"Published: {len(result.published)} | "
        f"Errors: {len(result.errors)}"
    )
    for pub in result.published:
        label = pub.facebook_post_id or pub.mode
        console.print(f"  • [{pub.mode}] {label}")
        console.print(f"    {pub.message[:160].replace(chr(10), ' ')}…")
    for err in result.errors:
        console.print(f"  [red]✗ {err}[/red]")


if __name__ == "__main__":
    app()
