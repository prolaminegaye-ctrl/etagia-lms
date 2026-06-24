#!/bin/bash
# ─────────────────────────────────────────────────────────────────────────────
#  ETAGIA × Kolibri — Entrypoint Railway (Kolibri 0.19.4)
#  is_provisioned=True est la clé pour bypasser le setup wizard
# ─────────────────────────────────────────────────────────────────────────────

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

# 2. Provision via Django shell (is_provisioned=True est OBLIGATOIRE)
echo "⚙️  Configuration device..."
kolibri manage shell << 'PYEOF'
import django
from kolibri.core.auth.models import Facility, FacilityUser
from kolibri.core.device.models import DeviceSettings, DevicePermissions
import os

ADMIN_USER = os.environ.get('KOLIBRI_ADMIN_USER', 'etagia_admin')
ADMIN_PASS = os.environ.get('KOLIBRI_ADMIN_PASSWORD', 'Etagia2025!')

try:
    # Facility
    facility, created = Facility.objects.get_or_create(name='ETAGIA LMS')
    if created:
        print('✓ Facility créée')

    # Device settings — is_provisioned=True bypass le setup wizard
    ds, _ = DeviceSettings.objects.get_or_create()
    ds.is_provisioned = True
    ds.default_facility = facility
    ds.allow_guest_access = True
    ds.language_id = 'fr'
    ds.save()
    print('✓ Device provisionné (wizard désactivé)')

    # Superuser
    if not FacilityUser.objects.filter(username=ADMIN_USER, facility=facility).exists():
        user = FacilityUser(username=ADMIN_USER, facility=facility)
        user.set_password(ADMIN_PASS)
        user.save()
        DevicePermissions.objects.get_or_create(
            user=user,
            defaults={'is_superuser': True, 'can_manage_content': True}
        )
        print(f'✓ Admin "{ADMIN_USER}" créé')
    else:
        print(f'✓ Admin "{ADMIN_USER}" déjà existant')

except Exception as e:
    print(f'⚠ Setup: {e}')
PYEOF

echo "Setup terminé"

# 3. Import canal KA Français
echo "📚 Import canal Khan Academy Français..."
kolibri manage importchannel network $KA_FR_CHANNEL 2>&1 | tail -5 && \
  echo "✓ Canal importé" || echo "⚠ Import canal différé"

# 4. Démarrer Kolibri en foreground
echo "✅ Démarrage Kolibri sur port $PORT"
exec kolibri start --foreground --port="$PORT"
