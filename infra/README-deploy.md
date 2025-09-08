# Deploy helper (infra/deploy.sh)

Purpose:
- Minimal helper to update the repository, install dependencies, build frontend/backend (if present),
  and restart pm2 or docker-compose services.

Usage (run as cbadmin from the repo root):
    cd ~/CB-CRM
    ./infra/deploy.sh

Notes:
- This script assumes:
  - You run it on the VPS as the deploy user (cbadmin).
  - `git` is configured and you have permission to pull.
  - `pm2` is installed if you use pm2.
  - `docker` & `docker-compose` are installed if using docker.
- The script does NOT modify nginx configuration automatically (requires sudo). Use the nginx file in infra/ to manage config.
- Always ensure working tree is clean before running.
