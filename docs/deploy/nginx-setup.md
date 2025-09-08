# Nginx + Let's Encrypt (app.crossbloom.in) — deploy notes

1. Copy infra/nginx/app.crossbloom.in.conf.example -> /etc/nginx/sites-available/app.crossbloom.in.conf
   sudo cp infra/nginx/app.crossbloom.in.conf.example /etc/nginx/sites-available/app.crossbloom.in.conf

2. Enable site and test:
   sudo ln -sf /etc/nginx/sites-available/app.crossbloom.in.conf /etc/nginx/sites-enabled/app.crossbloom.in.conf
   sudo nginx -t
   sudo systemctl reload nginx

3. Obtain cert (certbot --nginx recommended):
   sudo certbot --nginx -m admin@crossbloom.in --agree-tos -d app.crossbloom.in --non-interactive --redirect

4. Security headers are included in the example; tune CSP (Content-Security-Policy) before enabling in production.

5. Logs: /var/log/nginx/app_crossbloom_access.log and /var/log/nginx/app_crossbloom_error.log

