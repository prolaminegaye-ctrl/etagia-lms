#!/bin/bash
# ─────────────────────────────────────────────────────────────────────────────
#  ETAGIA × Kolibri — Entrypoint Railway (simplifié, sans health check HTTP)
# ─────────────────────────────────────────────────────────────────────────────

set -e

KA_FR_CHANNEL="9a3a615f0501427baf1f17b08f196fd2"
ADMIN_USER="${KOLIBRI_ADMIN_USER:-etagia_admin}"
ADMIN_PASS="${KOLIBRI_ADMIN_PASSWORD:-Etagia2025!}"

# Railway injecte $PORT, Kolibri l'utilise via KOLIBRI_HTTP_PORT
PORT="${PORT:-8080}"
export KOLIBRI_HTTP_PORT="$PORT"

echo "════════════════════════════════════════"
echo "  ETAGIA × Kolibri — port $PORT"
echo "════════════════════════════════════════"

# Migrations
echo "📦 Migration base de données..."
kolibri manage migrate --noinput 2>/dev/null || true

# Config device + admin
echo "⚙️  Configuration..."
kolibri manage shell -c "
from kolibri.core.auth.models import FacilityUser, Facility
from kolibri.core.device.models import DevicePermissions, DeviceSettings

facility, _ = Facility.objects.get_or_create(name='ETAGIA LMS')
s, _ = DeviceSettings.objects.get_or_create()
s.allow_guest_access = True
s.setup_wizard_finished = True
s.save()

try:
    su = FacilityUser.objects.filter(username='${ADMIN_USER}').first()
    if not su:
        su = FacilityUser.objects.create_user(
            username='${ADMIN_USER}',
            password='${ADMIN_PASS}',
            facility=facility
        )
        DevicePermissions.objects.get_or_create(
            user=su,
            defaults={'is_superuser': True, 'can_manage_content': True}
        )
        print('✓ Admin créé')
    else:
        print('✓ Admin OK')
except Exception as e:
    print(f'Admin: {e}')
" 2>/dev/null || echo "⚠ Config ignorée"

# Import canal KA Français (métadonnées ~10MB, rapide)
echo "📚 Import canal Khan Academy Français..."
kolibri manage importchannel network "${KA_FR_CHANNEL}" 2>/dev/null && \
  echo "✓ Canal importé" || echo "⚠ Canal: import différé"

echo "✅ Démarrage Kolibri sur port $PORT"
exec kolibri start --foreground --port="$PORT"
