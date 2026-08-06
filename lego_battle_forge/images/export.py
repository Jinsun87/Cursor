"""Export scene preview gallery and integrate with content export."""

from __future__ import annotations

from pathlib import Path

from lego_battle_forge.models import GeneratedContent, ScenePreviewPackage


def export_preview_gallery(
    content: GeneratedContent,
    previews: ScenePreviewPackage,
    output_path: Path,
) -> Path:
    """Export a self-contained HTML gallery of scene previews."""
    b = content.battle
    vm = content.viral_metadata

    shot_cards = []
    for p in previews.previews:
        if p.status == "success" and p.image_path:
            rel = Path(p.image_path).name
            time_label = ""
            if p.timestamp_start is not None and p.timestamp_end is not None:
                time_label = f"[{p.timestamp_start:.1f}s – {p.timestamp_end:.1f}s]"
            shot_cards.append(f"""
            <div class="card">
              <img src="previews/{rel}" alt="Shot {p.shot_number}" loading="lazy">
              <div class="info">
                <div class="shot-num">Shot {p.shot_number} {time_label}</div>
                <div class="desc">{p.description or ''}</div>
              </div>
            </div>""")
        else:
            shot_cards.append(f"""
            <div class="card failed">
              <div class="fail-msg">Shot {p.shot_number} failed: {p.error or 'unknown error'}</div>
            </div>""")

    thumb_html = ""
    if previews.thumbnail and previews.thumbnail.status == "success":
        thumb_html = f"""
        <div class="thumbnail-section">
          <h2>Thumbnail Preview</h2>
          <img src="previews/thumbnail.png" alt="Thumbnail" class="thumbnail">
          <p class="thumb-text">{vm.thumbnail_text}</p>
        </div>"""

    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{b.name} — Scene Previews</title>
<style>
  :root {{ --bg: #0f0f13; --surface: #1a1a24; --accent: #e63946; --accent2: #ffd60a; --text: #e8e8f0; --muted: #8888a0; }}
  * {{ margin: 0; padding: 0; box-sizing: border-box; }}
  body {{ font-family: system-ui, sans-serif; background: var(--bg); color: var(--text); padding: 2rem; }}
  h1 {{ margin-bottom: 0.5rem; }}
  .meta {{ color: var(--muted); margin-bottom: 2rem; }}
  .hook {{ font-size: 1.2rem; color: var(--accent2); margin-bottom: 2rem; padding: 1rem; border-left: 3px solid var(--accent2); }}
  .grid {{ display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem; }}
  .card {{ background: var(--surface); border-radius: 12px; overflow: hidden; border: 1px solid #2a2a3a; }}
  .card img {{ width: 100%; display: block; aspect-ratio: 9/16; object-fit: cover; }}
  .card .info {{ padding: 1rem; }}
  .shot-num {{ color: var(--accent2); font-weight: 600; font-size: 0.9rem; }}
  .desc {{ color: var(--muted); font-size: 0.85rem; margin-top: 0.3rem; }}
  .card.failed {{ padding: 2rem; color: var(--accent); }}
  .thumbnail-section {{ margin-bottom: 2rem; text-align: center; }}
  .thumbnail {{ max-width: 300px; border-radius: 12px; border: 2px solid var(--accent2); }}
  .thumb-text {{ font-size: 1.5rem; font-weight: bold; color: var(--accent2); margin-top: 1rem; }}
  .provider {{ display: inline-block; padding: 0.3rem 0.8rem; background: #2a2a3a; border-radius: 20px; font-size: 0.8rem; margin-bottom: 1rem; }}
</style>
</head>
<body>
  <span class="provider">Provider: {previews.provider}</span>
  <h1>{b.name}</h1>
  <div class="meta">{abs(b.year)} {'BC' if b.year < 0 else 'AD'} · {b.era} · {len(previews.previews)} shots</div>
  <div class="hook">{vm.hook_line}</div>
  {thumb_html}
  <h2 style="margin-bottom:1rem">Storyboard Previews</h2>
  <div class="grid">
    {''.join(shot_cards)}
  </div>
</body>
</html>"""

    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(html)
    return output_path


def export_preview_manifest(previews: ScenePreviewPackage, output_path: Path) -> Path:
    """Export preview metadata as JSON."""
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(previews.model_dump_json(indent=2))
    return output_path


def export_previews(
    content: GeneratedContent,
    previews: ScenePreviewPackage,
    output_dir: Path,
) -> dict[str, Path]:
    """Export gallery HTML and manifest for scene previews."""
    slug = content.battle.id
    battle_dir = output_dir / slug
    return {
        "gallery": export_preview_gallery(content, previews, battle_dir / f"{slug}_gallery.html"),
        "manifest": export_preview_manifest(previews, battle_dir / f"{slug}_previews.json"),
    }
