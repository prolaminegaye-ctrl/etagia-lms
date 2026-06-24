#!/bin/bash
# ─────────────────────────────────────────────────────────────────────────────
#  ETAGIA × Kolibri — Entrypoint Railway (Kolibri 0.19.4)
# ─────────────────────────────────────────────────────────────────────────────

set -e

KA_FR_CHANNEL="9a3a615f0501427baf1f17b08f196fd2"
ADMIN_USER="${KOLIBRI_ADMIN_USER:-etagia_admin}"
ADMIN_PASS="${KOLIBRI_ADMIN_PASSWORD:-Etagia2025!}"

# Railway injecte $PORT, Kolibri l'utilise via KOLIBRI_HTTP_PORT
PORT="${PORT:-8080}"
export KOLIBRI_HTTP_PORT="$PORT"

echo "════════════════════════════════════════"
echo "  ETAGIA × Kolibri 0.19.4 — port $PORT"
echo "════════════════════════════════════════"

# Migrations
echo "📦 Migration base de données..."
kolibri manage migrate --noinput 2>/dev/null || true

# Provision device + admin (commande officielle Kolibri 0.19)
echo "⚙️  Provision device..."
kolibri manage provisiondevice \
  --facility "ETAGIA LMS" \
  --preset formal \
  --superusername "$ADMIN_USER" \
  --superuserpassword "$ADMIN_PASS" \
  --language_id fr \
  --allow_guest_access 2>/dev/null && echo "✓ Device provisionné" || echo "⚠ Déjà provisionné — OK"

# Import canal KA Français (métadonnées seulement, ~10MB)
echo "📚 Import canal Khan Academy Français..."
kolibri manage importchannel network $KA_FR_CHANNEL 2>/dev/null && \
  echo "✓ Canal importé" || echo "⚠ Import canal différé"

echo "✅ Démarrage Kolibri sur port $PORT"
exec kolibri start --foreground --port="$PORT"
