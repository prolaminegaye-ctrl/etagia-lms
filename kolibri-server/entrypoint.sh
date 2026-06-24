#!/bin/bash
# ─────────────────────────────────────────────────────────────────────────────
#  ETAGIA × Kolibri — Entrypoint Railway (Kolibri 0.19.4)
#  Setup via API REST après démarrage en background
# ─────────────────────────────────────────────────────────────────────────────

set -e

KA_FR_CHANNEL="9a3a615f0501427baf1f17b08f196fd2"
ADMIN_USER="${KOLIBRI_ADMIN_USER:-etagia_admin}"
ADMIN_PASS="${KOLIBRI_ADMIN_PASSWORD:-Etagia2025!}"
PORT="${PORT:-8080}"
export KOLIBRI_HTTP_PORT="$PORT"

echo "════════════════════════════════════════"
echo "  ETAGIA × Kolibri 0.19.4 — port $PORT"
echo "════════════════════════════════════════"

# 1. Migrations
echo "📦 Migrations..."
kolibri manage migrate --noinput 2>/dev/null || true

# 2. Démarrer Kolibri en arrière-plan
echo "🚀 Démarrage Kolibri en background..."
kolibri start --foreground --port="$PORT" &
KOLIBRI_PID=$!

# 3. Attendre que Kolibri réponde (max 120s)
echo "⏳ Attente démarrage Kolibri..."
for i in $(seq 1 40); do
  if curl -s -o /dev/null -w "%{http_code}" "http://localhost:${PORT}/" 2>/dev/null | grep -qE "200|302"; then
    echo "✓ Kolibri prêt après ${i}x3s"
    break
  fi
  sleep 3
done

# 4. Setup via API REST (wizard setup)
echo "⚙️  Setup device via API..."
BASE="http://localhost:${PORT}"

# Step 1: facility list
FACILITY=$(curl -s -X POST "$BASE/api/device/setupwizard/facilityaction/" \
  -H "Content-Type: application/json" \
  -d '{"name":"ETAGIA LMS","preset":"formal"}' 2>/dev/null)
echo "Facility: $FACILITY" | head -c 100

# Step 2: créer superuser via API interne
curl -s -X POST "$BASE/api/device/setupwizard/superuser/" \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"${ADMIN_USER}\",\"password\":\"${ADMIN_PASS}\"}" 2>/dev/null | head -c 100
echo ""

# 5. Import canal KA Français
echo "📚 Import canal Khan Academy Français..."
kolibri manage importchannel network $KA_FR_CHANNEL 2>/dev/null && \
  echo "✓ Canal importé" || echo "⚠ Import canal différé"

# 6. Reprendre en foreground
echo "✅ Kolibri configuré — mode foreground"
wait $KOLIBRI_PID
