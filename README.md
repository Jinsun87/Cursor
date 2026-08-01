# Arsenal News → Facebook Agent

Monitors Arsenal FC news feeds and **posts to your Facebook Page as soon as a story appears**.

```text
RSS feeds  →  detect new article  →  draft Facebook copy  →  Graph API publish/schedule
```

## What it does

1. Polls curated Arsenal RSS sources (BBC Sport, Football.London, Guardian, Evening Standard, Google News) on a short interval
2. Deduplicates with a local SQLite store so each story is posted once
3. Builds a Facebook-ready caption (template, or optional LLM rewrite)
4. Publishes via the Facebook Pages Graph API:
   - **`immediate`** (default) — goes live as soon as news is detected
   - **`schedule`** — Facebook scheduled post (Graph API requires ≥10 minutes ahead)
   - **`dry_run`** — draft only, no API calls

## Quick start

```bash
python -m venv .venv
source .venv/bin/activate
pip install -e ".[dev]"

cp .env.example .env
# fill FACEBOOK_PAGE_ID + FACEBOOK_PAGE_ACCESS_TOKEN

# First run: mark current headlines as already seen (avoid flooding the Page)
arsenal-agent bootstrap

# Preview drafts from live feeds
arsenal-agent preview

# Verify Facebook credentials
arsenal-agent verify-facebook

# Continuous agent (posts as news breaks)
arsenal-agent run

# Single poll cycle
arsenal-agent run --once
```

## Facebook setup

1. Create a Meta app at [developers.facebook.com](https://developers.facebook.com/)
2. Add the **pages_manage_posts**, **pages_read_engagement**, and **pages_show_list** permissions
3. Connect your Facebook Page and generate a **Page access token** (long-lived recommended)
4. Put the Page ID and token in `.env`

Minimum Graph call used by the agent:

```http
POST /{page-id}/feed
  message=...
  link=...
  published=true          # or false + scheduled_publish_time for schedule mode
```

## Configuration

| Variable | Default | Notes |
|---|---|---|
| `FACEBOOK_PAGE_ID` | — | Required for live posting |
| `FACEBOOK_PAGE_ACCESS_TOKEN` | — | Page token with `pages_manage_posts` |
| `PUBLISH_MODE` | `immediate` | `immediate` / `schedule` / `dry_run` |
| `SCHEDULE_DELAY_MINUTES` | `10` | Only for `schedule` (FB minimum is 10) |
| `POLL_INTERVAL_SECONDS` | `60` | How often feeds are checked |
| `MAX_AGE_HOURS` | `6` | Ignore older items (after bootstrap) |
| `MAX_POSTS_PER_CYCLE` | `3` | Cap per poll (rate-limit safety) |
| `HASHTAGS` | `#Arsenal #AFC #COYG #Gunners` | Appended to posts |
| `USE_LLM_REWRITE` | `false` | Optional OpenAI-compatible polish |

See `.env.example` for the full list.

## CLI

| Command | Purpose |
|---|---|
| `arsenal-agent run` | Continuous monitor + publish |
| `arsenal-agent run --once` | One poll cycle |
| `arsenal-agent bootstrap` | Seed existing articles as seen |
| `arsenal-agent preview` | Show live drafts without posting |
| `arsenal-agent verify-facebook` | Validate Page token |
| `arsenal-agent history` | Recent processed articles |

## Docker

```bash
cp .env.example .env   # add credentials
docker compose up -d --build
docker compose logs -f agent
```

On first boot the container runs `bootstrap` then `run`.

## Project layout

```text
src/arsenal_agent/
  agent.py           # orchestration loop
  cli.py             # Typer CLI
  config.py          # env settings
  news/              # RSS sources + fetcher
  posts/             # caption generator
  facebook/          # Graph API client
  store/             # SQLite dedup + history
```

## Tests

```bash
pip install -e ".[dev]"
pytest -q
```

## Notes

- Prefer **`bootstrap` on first deploy**, then keep `run` as a long-lived process (Docker, systemd, or a cloud worker).
- For true “as soon as it releases” behaviour, keep `PUBLISH_MODE=immediate` and a low `POLL_INTERVAL_SECONDS` (e.g. 30–60).
- Facebook scheduled posts cannot go live sooner than ~10 minutes after the API call — that mode is for deferred publishing, not breaking-news speed.
