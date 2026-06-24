# ─────────────────────────────────────────────────────────────────────────────
#  ETAGIA × Kolibri — Dockerfile Railway
#  Canal KA FR: 878ec2e6f88c5c268b1be6f202833cd4
#  Bust: 2026-06-24
# ─────────────────────────────────────────────────────────────────────────────

FROM learningequality/kolibri:latest

ENV KOLIBRI_LANG=fr
ENV KOLIBRI_ALLOW_GUEST_ACCESS=1

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 8080

ENTRYPOINT ["/entrypoint.sh"]
