# ─────────────────────────────────────────────────────────────────────────────
#  ETAGIA × Kolibri — Dockerfile pour Railway / Render / Fly.io
#  Kolibri + Khan Academy Francophone, configuration automatique
# ─────────────────────────────────────────────────────────────────────────────

FROM learningequality/kolibri:latest

# Variables d'environnement Kolibri
ENV KOLIBRI_HTTP_PORT=8080
ENV KOLIBRI_LANG=fr
ENV KOLIBRI_ALLOW_GUEST_ACCESS=1
ENV DJANGO_SETTINGS_MODULE=kolibri.deployment.default.settings.base

# Port exposé (Railway utilise $PORT mais Kolibri sera derrière un proxy)
EXPOSE 8080

# Script de démarrage
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
