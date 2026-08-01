#!/bin/sh
set -eu

mkdir -p "$(dirname "${DATABASE_PATH:-/app/data/seen_articles.db}")"

# On first container start, skip existing headlines so only new releases post.
if [ "${BOOTSTRAP_ON_START:-true}" = "true" ] && [ ! -f /app/data/.bootstrapped ]; then
  echo "Bootstrapping: marking current feed items as seen..."
  arsenal-agent bootstrap
  touch /app/data/.bootstrapped
fi

exec arsenal-agent "$@"
