#!/usr/bin/env bash
set -euo pipefail
# infra/deploy.sh — CB-STEP-0014a
# Minimal deploy script: git pull, install deps, build (if present), restart services.

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_DIR"

echo "[deploy] Starting deploy at $(date -u +"%Y-%m-%dT%H:%M:%SZ")"
echo "[deploy] Repository: $REPO_DIR"

# 1) ensure branch is main (or master)
BRANCH="$(git rev-parse --abbrev-ref HEAD)"
echo "[deploy] Current branch: $BRANCH"

# Optional: ensure no local changes (fail fast)
if [[ -n "$(git status --porcelain)" ]]; then
  echo "[deploy][ERROR] Working tree is dirty. Please commit/stash changes before running deploy."
  exit 2
fi

# 2) pull latest
git fetch --all --prune
git pull --ff-only origin "$BRANCH"

# 3) backend: install & build if backend folder exists
if [ -d "./backend" ]; then
  echo "[deploy] Installing backend deps..."
  cd backend
  if [ -f package.json ]; then
    npm ci --prefer-offline --no-audit --progress=false
  fi
  # optional build step if present
  if npm run | grep -q "build"; then
    echo "[deploy] Building backend..."
    npm run build || true
  fi
  cd "$REPO_DIR"
fi

# 4) frontend: install & build if frontend folder exists
if [ -d "./frontend" ]; then
  echo "[deploy] Installing frontend deps..."
  cd frontend
  if [ -f package.json ]; then
    npm ci --prefer-offline --no-audit --progress=false
  fi
  if npm run | grep -q "build"; then
    echo "[deploy] Building frontend..."
    npm run build || true
  fi
  cd "$REPO_DIR"
fi

# 5) pm2 restart (if pm2 ecosystem exists)
if [ -f "./infra/pm2-ecosystem.config.js" ]; then
  echo "[deploy] Reloading pm2 processes..."
  pm2 reload infra/pm2-ecosystem.config.js --update-env || pm2 start infra/pm2-ecosystem.config.js --update-env
fi

# 6) docker-compose (if docker-compose.yml exists)
if [ -f "./infra/docker-compose.yml" ]; then
  echo "[deploy] Running docker-compose pull & up..."
  docker-compose -f infra/docker-compose.yml pull || true
  docker-compose -f infra/docker-compose.yml up -d --remove-orphans
fi

# 7) nginx reload if file changed
# (We do not automatically replace nginx config here — that requires sudo.)
echo "[deploy] Note: nginx config is not auto-deployed by this script. Use infra/nginx_app_crossbloom_in.conf as reference and copy manually with sudo if needed."

echo "[deploy] Completed successfully at $(date -u +"%Y-%m-%dT%H:%M:%SZ")"
exit 0
