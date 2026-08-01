# AGENTS.md

Guidance for AI coding agents working in this repository.

## Repository status

This is a **greenfield repository**. It currently contains only `README.md` (project title) and has no application source code, dependency manifests, or service definitions. There is nothing to lint, test, build, or run until a product is added.

## Cursor Cloud specific instructions

### VM toolchain (pre-installed)

The Cloud Agent VM provides common development tools without repo-specific setup:

| Tool | Version (as of initial setup) |
|------|-------------------------------|
| Node.js | v22.x |
| npm | 10.x |
| pnpm | 10.x |
| Python | 3.12 |
| Go | 1.22 |
| Rust | 1.83 |
| Git | 2.43 |
| GitHub CLI (`gh`) | 2.91 |

Docker is **not** installed in the default VM image.

### Services

| Service | Required? | Notes |
|---------|-----------|-------|
| — | — | No services are defined in this repository |

### Lint / test / run

No lint, test, or run commands exist yet. When application code is added, document them here and in `README.md` (for example `npm run dev`, `make test`, or `docker compose up`).

### Update script

The VM update script is a no-op (`true`) because this repository has no dependencies to refresh on startup.

### Getting started (for future agents)

Once a stack is chosen, add at minimum:

1. Source code and a dependency manifest (`package.json`, `go.mod`, `requirements.txt`, etc.)
2. `README.md` setup and run instructions
3. Lint and test scripts
4. Update the VM update script in Cursor environment settings to install dependencies (e.g. `npm install`, `pip install -r requirements.txt`)
