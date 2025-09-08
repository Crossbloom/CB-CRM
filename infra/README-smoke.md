# Smoke tests & current infra state (CB-STEP-0014e)

Date: $(date -u +"%Y-%m-%dT%H:%M:%SZ")
Target domain: app.crossbloom.in

Performed checks:
- Direct backend: http://127.0.0.1:3000/  => (expected 200)
- Direct frontend: http://127.0.0.1:3001/ => (expected 200)
- nginx HTTP -> HTTPS redirect checked
- HTTPS endpoint and security headers checked
- pm2 processes saved with `pm2 save`
- certbot renewal dry-run executed

Useful commands:
- pm2 status
- pm2 logs crossbloom-backend
- pm2 logs crossbloom-frontend
- sudo nginx -t && sudo systemctl reload nginx
- sudo certbot renew --dry-run

Notes:
- pm2 log files live in ~/.pm2/logs/ by default.
- Do NOT commit real .env files. See backend/.env.example for placeholders.
