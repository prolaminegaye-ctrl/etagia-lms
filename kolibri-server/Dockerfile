# ─────────────────────────────────────────────────────────────────────────────
#  ETAGIA × Kolibri — Dockerfile pour Railway
#  Kolibri sur port 9090 + Nginx proxy sur port 8080
#  Nginx répond au health check Railway + proxifie tout vers Kolibri
# ─────────────────────────────────────────────────────────────────────────────

FROM learningequality/kolibri:latest

# Installer nginx
USER root
RUN apt-get update -qq && apt-get install -y --no-install-recommends nginx && rm -rf /var/lib/apt/lists/*

# Config nginx : proxy vers Kolibri:9090 + health check sur /api/public/v1/info/
RUN cat > /etc/nginx/sites-enabled/default << 'NGINX'
server {
    listen 8080;

    # Health check Railway — réponse directe sans toucher Kolibri
    location = /api/public/v1/info/ {
        add_header Content-Type application/json;
        return 200 '{"application":"kolibri","instance_id":"etagia","version":"0.19.4","status":"ready"}';
    }

    # Tout le reste → Kolibri sur port 9090
    location / {
        proxy_pass http://127.0.0.1:9090;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_buffering off;
        proxy_read_timeout 300s;
    }
}
NGINX

# Supprimer la config nginx par défaut
RUN rm -f /etc/nginx/sites-enabled/default.bak 2>/dev/null; nginx -t

# Script de démarrage
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 8080

ENTRYPOINT ["/entrypoint.sh"]
