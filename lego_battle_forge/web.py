"""Web UI for LEGO Battle Forge."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Optional

from fastapi import FastAPI, HTTPException
from fastapi.responses import HTMLResponse, JSONResponse
from pydantic import BaseModel

from lego_battle_forge.battles.database import list_battles
from lego_battle_forge.export import export_all
from lego_battle_forge.forge import generate_battle_content
from lego_battle_forge.models import ContentFormat, ViralAngle

app = FastAPI(title="LEGO Battle Forge", version="0.1.0")

OUTPUT_DIR = Path("output/web")


class GenerateRequest(BaseModel):
    battle_id: str
    format: str = "reel"
    angle: Optional[str] = None


@app.get("/", response_class=HTMLResponse)
async def index():
    return HTML_PAGE


@app.get("/api/battles")
async def api_battles():
    battles = list_battles()
    return [
        {
            "id": b.id,
            "name": b.name,
            "year": b.year,
            "era": b.era,
            "summary": b.summary,
            "trending_score": b.trending_score,
            "difficulty": b.difficulty,
            "viral_angles": [a.value for a in b.viral_angles],
        }
        for b in battles
    ]


@app.post("/api/generate")
async def api_generate(req: GenerateRequest):
    try:
        fmt = ContentFormat(req.format.lower())
        angle = ViralAngle(req.angle.lower()) if req.angle else None
        content = generate_battle_content(req.battle_id, fmt, angle)
        paths = export_all(content, OUTPUT_DIR)
        return JSONResponse({
            "success": True,
            "content": json.loads(content.model_dump_json()),
            "files": {k: str(v) for k, v in paths.items()},
        })
    except (KeyError, ValueError) as e:
        raise HTTPException(status_code=400, detail=str(e))


HTML_PAGE = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>LEGO Battle Forge</title>
<style>
  :root {
    --bg: #0f0f13; --surface: #1a1a24; --border: #2a2a3a;
    --accent: #e63946; --accent2: #ffd60a; --text: #e8e8f0; --muted: #8888a0;
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Segoe UI', system-ui, sans-serif; background: var(--bg); color: var(--text); min-height: 100vh; }
  .hero { background: linear-gradient(135deg, #1a0a2e 0%, #16213e 50%, #0f3460 100%); padding: 3rem 2rem; text-align: center; border-bottom: 2px solid var(--accent); }
  .hero h1 { font-size: 2.5rem; margin-bottom: 0.5rem; }
  .hero h1 span { color: var(--accent2); }
  .hero p { color: var(--muted); font-size: 1.1rem; max-width: 600px; margin: 0 auto; }
  .container { max-width: 1200px; margin: 0 auto; padding: 2rem; }
  .controls { display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 2rem; align-items: end; }
  .control-group { display: flex; flex-direction: column; gap: 0.3rem; }
  .control-group label { font-size: 0.85rem; color: var(--muted); text-transform: uppercase; letter-spacing: 0.05em; }
  select, button { padding: 0.7rem 1.2rem; border-radius: 8px; border: 1px solid var(--border); background: var(--surface); color: var(--text); font-size: 1rem; }
  button { background: var(--accent); border: none; cursor: pointer; font-weight: 600; transition: transform 0.15s; }
  button:hover { transform: scale(1.03); }
  button:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 1.5rem; }
  .card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 1.5rem; cursor: pointer; transition: border-color 0.2s, transform 0.15s; }
  .card:hover { border-color: var(--accent); transform: translateY(-2px); }
  .card.selected { border-color: var(--accent2); box-shadow: 0 0 20px rgba(255,214,10,0.15); }
  .card h3 { margin-bottom: 0.5rem; }
  .card .meta { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.8rem; }
  .badge { font-size: 0.75rem; padding: 0.2rem 0.6rem; border-radius: 20px; background: var(--border); }
  .badge.hot { background: var(--accent); }
  .card p { color: var(--muted); font-size: 0.9rem; line-height: 1.5; }
  .result { margin-top: 2rem; }
  .result-panel { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 2rem; }
  .hook { font-size: 1.3rem; font-weight: 600; color: var(--accent2); margin-bottom: 1rem; padding: 1rem; background: rgba(255,214,10,0.05); border-left: 3px solid var(--accent2); border-radius: 0 8px 8px 0; }
  .tabs { display: flex; gap: 0.5rem; margin-bottom: 1rem; flex-wrap: wrap; }
  .tab { padding: 0.5rem 1rem; border-radius: 8px; background: var(--border); cursor: pointer; font-size: 0.9rem; border: none; color: var(--text); }
  .tab.active { background: var(--accent); }
  .tab-content { display: none; }
  .tab-content.active { display: block; }
  pre { background: #0a0a10; padding: 1rem; border-radius: 8px; overflow-x: auto; font-size: 0.85rem; line-height: 1.6; white-space: pre-wrap; }
  .shot { border-left: 2px solid var(--accent); padding: 0.8rem 1rem; margin-bottom: 0.8rem; background: rgba(230,57,70,0.03); border-radius: 0 8px 8px 0; }
  .shot .time { color: var(--accent2); font-weight: 600; font-size: 0.85rem; }
  .hashtags { color: #4cc9f0; line-height: 2; }
  .loading { text-align: center; padding: 3rem; color: var(--muted); }
  @keyframes spin { to { transform: rotate(360deg); } }
  .spinner { display: inline-block; width: 24px; height: 24px; border: 3px solid var(--border); border-top-color: var(--accent); border-radius: 50%; animation: spin 0.8s linear infinite; }
</style>
</head>
<body>
<div class="hero">
  <h1>⚔️ LEGO <span>Battle Forge</span></h1>
  <p>Generate viral historical battle shorts & reels — scripts, storyboards, LEGO build plans, captions & hashtags.</p>
</div>
<div class="container">
  <div class="controls">
    <div class="control-group">
      <label>Format</label>
      <select id="format">
        <option value="short">Short (15-30s)</option>
        <option value="reel" selected>Reel (30-60s)</option>
        <option value="extended">Extended (60-90s)</option>
      </select>
    </div>
    <div class="control-group">
      <label>Viral Angle</label>
      <select id="angle">
        <option value="">Auto (best for battle)</option>
        <option value="underdog">Underdog</option>
        <option value="betrayal">Betrayal</option>
        <option value="one_mistake">One Mistake</option>
        <option value="genius_tactic">Genius Tactic</option>
        <option value="what_if">What If</option>
        <option value="forbidden">Forbidden History</option>
        <option value="countdown">Countdown</option>
      </select>
    </div>
    <button id="generateBtn" disabled onclick="generate()">Generate Content</button>
  </div>
  <div class="grid" id="battleGrid"></div>
  <div class="result" id="result" style="display:none"></div>
</div>
<script>
let battles = [], selectedId = null;

async function loadBattles() {
  const res = await fetch('/api/battles');
  battles = await res.json();
  const grid = document.getElementById('battleGrid');
  grid.innerHTML = battles.map(b => `
    <div class="card" data-id="${b.id}" onclick="selectBattle('${b.id}')">
      <h3>${b.name}</h3>
      <div class="meta">
        <span class="badge">${Math.abs(b.year)} ${b.year < 0 ? 'BC' : 'AD'}</span>
        <span class="badge">${b.era}</span>
        <span class="badge hot">🔥 ${b.trending_score}/10</span>
        <span class="badge">${b.difficulty}</span>
      </div>
      <p>${b.summary}</p>
    </div>
  `).join('');
}

function selectBattle(id) {
  selectedId = id;
  document.querySelectorAll('.card').forEach(c => c.classList.toggle('selected', c.dataset.id === id));
  document.getElementById('generateBtn').disabled = false;
}

async function generate() {
  if (!selectedId) return;
  const result = document.getElementById('result');
  result.style.display = 'block';
  result.innerHTML = '<div class="loading"><div class="spinner"></div><p>Generating content package...</p></div>';

  const res = await fetch('/api/generate', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      battle_id: selectedId,
      format: document.getElementById('format').value,
      angle: document.getElementById('angle').value || null,
    }),
  });
  const data = await res.json();
  if (!data.success) { result.innerHTML = '<p style="color:red">Error generating content</p>'; return; }

  const c = data.content;
  const vm = c.viral_metadata;
  const shots = c.storyboard.map(s => `
    <div class="shot">
      <div class="time">[${s.timestamp_start.toFixed(1)}s - ${s.timestamp_end.toFixed(1)}s] Shot ${s.shot_number} — ${s.shot_type}</div>
      <div><strong>${s.description}</strong></div>
      <div style="color:var(--muted);margin-top:0.3rem">${s.lego_setup}</div>
      ${s.on_screen_text ? '<div style="color:var(--accent2);margin-top:0.3rem">TEXT: ' + s.on_screen_text + '</div>' : ''}
      <div style="margin-top:0.3rem;font-style:italic">"${s.narration}"</div>
    </div>
  `).join('');

  result.innerHTML = `
    <div class="result-panel">
      <h2 style="margin-bottom:1rem">${vm.title}</h2>
      <div class="hook">${vm.hook_line}</div>
      <div class="tabs">
        <button class="tab active" onclick="showTab('script')">Script</button>
        <button class="tab" onclick="showTab('storyboard')">Storyboard</button>
        <button class="tab" onclick="showTab('caption')">Caption</button>
        <button class="tab" onclick="showTab('build')">LEGO Build</button>
        <button class="tab" onclick="showTab('meta')">Posting</button>
      </div>
      <div id="tab-script" class="tab-content active"><pre>${c.script_full}</pre></div>
      <div id="tab-storyboard" class="tab-content">${shots}</div>
      <div id="tab-caption" class="tab-content">
        <pre>${vm.caption}</pre>
        <p class="hashtags" style="margin-top:1rem">${vm.hashtags.join(' ')}</p>
      </div>
      <div id="tab-build" class="tab-content"><pre>${c.lego_build_notes.join('\\n')}</pre></div>
      <div id="tab-meta" class="tab-content">
        <h3 style="margin-bottom:0.5rem">Suggested Audio</h3>
        <ul>${vm.suggested_audio.map(a => '<li>' + a + '</li>').join('')}</ul>
        <h3 style="margin:1rem 0 0.5rem">Thumbnail Text</h3>
        <p style="font-size:1.5rem;font-weight:bold;color:var(--accent2)">${vm.thumbnail_text}</p>
        <h3 style="margin:1rem 0 0.5rem">Posting Tips</h3>
        <ul>${vm.posting_tips.map(t => '<li>' + t + '</li>').join('')}</ul>
      </div>
    </div>
  `;
}

function showTab(name) {
  document.querySelectorAll('.tab').forEach((t, i) => {
    const tabs = ['script','storyboard','caption','build','meta'];
    t.classList.toggle('active', tabs[i] === name);
  });
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  document.getElementById('tab-' + name).classList.add('active');
}

loadBattles();
</script>
</body>
</html>"""
