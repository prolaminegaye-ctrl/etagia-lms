# ─────────────────────────────────────────────────────────────────────────────
#  ETAGIA × Kolibri — Dockerfile Railway
#  Kolibri sur le port injecté par Railway ($PORT ou 8080)
# ─────────────────────────────────────────────────────────────────────────────

FROM learningequality/kolibri:latest

ENV KOLIBRI_LANG=fr
ENV KOLIBRI_ALLOW_GUEST_ACCESS=1

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 8080

ENTRYPOINT ["/entrypoint.sh"]
