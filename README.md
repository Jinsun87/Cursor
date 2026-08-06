# LEGO Battle Forge

Generate viral historical battle shorts and reels content using LEGO miniature dioramas. Produces complete content packages: scripts, shot-by-shot storyboards, LEGO build plans, captions, hashtags, and posting strategy.

## What It Does

Pick a historical battle → get a ready-to-film content package optimized for TikTok, YouTube Shorts, and Instagram Reels.

Each package includes:

- **Viral hook** — pattern-interrupt opening line (first 3 seconds)
- **Full narration script** — timed to the second
- **Storyboard** — shot-by-shot with camera angles, LEGO setup, SFX, and on-screen text
- **LEGO build plan** — terrain, minifig placement, parts inventory, stop-motion tips
- **Social metadata** — caption, hashtags, suggested audio, thumbnail text, posting tips

## Quick Start

```bash
pip install -r requirements.txt

# List available battles
python -m lego_battle_forge.cli list

# Generate content for Thermopylae
python -m lego_battle_forge.cli generate thermopylae

# Generate a random battle as a 60s reel
python -m lego_battle_forge.cli generate -f reel

# Batch-generate all battles (content calendar)
python -m lego_battle_forge.cli batch

# Launch web UI
uvicorn lego_battle_forge.web:app --reload --port 8080
```

## Available Battles

| Battle | Era | Viral Score | Best Angles |
|--------|-----|-------------|-------------|
| Battle of Stalingrad | WWII | 10/10 | Underdog, Countdown, Forbidden |
| Battle of Thermopylae | Ancient Greece | 9/10 | Underdog, Betrayal |
| Battle of Cannae | Ancient Rome | 9/10 | Genius Tactic, Countdown |
| Battle of Midway | WWII | 9/10 | One Mistake, Genius Tactic |
| Battle of Hastings | Medieval | 8/10 | One Mistake, Genius Tactic |
| Battle of Waterloo | Napoleonic | 8/10 | One Mistake, What If |
| Battle of Agincourt | Medieval | 8/10 | Underdog, One Mistake |

## Viral Content Angles

- **underdog** — David vs Goliath stories
- **betrayal** — plot twist hooks
- **one_mistake** — cautionary "what NOT to do"
- **genius_tactic** — educational military brilliance
- **what_if** — speculation and debate drivers
- **forbidden** — edgy/controversial history
- **countdown** — listicle retention format

## Content Formats

| Format | Duration | Platform |
|--------|----------|----------|
| `short` | ~25s | TikTok quick hits |
| `reel` | ~55s | YouTube Shorts, IG Reels |
| `extended` | ~85s | Longer-form shorts |

## Output Files

Each generation creates three files in `output/`:

- `{battle}.json` — full structured data (for automation/API)
- `{battle}.md` — human-readable production document
- `{battle}_shots.txt` — on-set shot list reference

## Viral Shorts Playbook

Built-in best practices for maximum reach:

1. **Hook in 0-3s** — pattern interrupt (explosion, text slam, dramatic close-up)
2. **On-screen text** — 80% watch without sound; keep text under 2 seconds per frame
3. **Retention beats** — every 5-8 seconds, a new visual or narrative hook
4. **Comment bait** — end with "Which battle next?" to drive engagement
5. **Cross-post** — same content to TikTok, Shorts, and Reels with platform-specific captions
6. **Post 3-5x/week** — consistency beats perfection for algorithm momentum

## LEGO Filming Tips

- Phone on a LEGO Technic slider for smooth tracking shots
- Film at 60fps+, slow to 24fps in post for cinematic slow-mo
- Cotton balls between frames for dust/explosion clouds
- Fishing line for flying arrows/planes (remove in post)
- 2-3mm movement per frame for stop-motion (12-15 fps)

## Project Structure

```
lego_battle_forge/
├── battles/database.py    # Historical battle data
├── viral/optimizer.py     # Hooks, captions, hashtags
├── lego/scene_planner.py  # Build plans & parts lists
├── generator.py           # Storyboard & script engine
├── forge.py               # Main pipeline
├── export.py              # JSON/Markdown export
├── cli.py                 # Command-line interface
└── web.py                 # Web UI (FastAPI)
```

## Extending

Add new battles in `lego_battle_forge/battles/database.py`:

```python
_register(HistoricalBattle(
    id="my_battle",
    name="Battle of ...",
    year=1066,
    ...
))
```

## License

MIT
