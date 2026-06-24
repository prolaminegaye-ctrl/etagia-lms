#!/bin/bash
# ─────────────────────────────────────────────────────────────────────────────
#  ETAGIA × Kolibri — Entrypoint Railway
#  KA FR canal: 878ec2e6f88c5c268b1be6f202833cd4
# ─────────────────────────────────────────────────────────────────────────────

KA_FR_CHANNEL="878ec2e6f88c5c268b1be6f202833cd4"
ADMIN_USER="${KOLIBRI_ADMIN_USER:-etagia_admin}"
ADMIN_PASS="${KOLIBRI_ADMIN_PASSWORD:-Etagia2025!}"
PORT="${PORT:-8080}"
export KOLIBRI_HTTP_PORT="$PORT"

echo "════════════════════════════════════════"
echo "  ETAGIA × Kolibri — port $PORT"
echo "  Canal KA FR: $KA_FR_CHANNEL"
echo "════════════════════════════════════════"

# 1. Migrations
echo "📦 Migrations..."
kolibri manage migrate --noinput 2>/dev/null || true

# 2. Provision via Python script (setup_wizard_finished + is_provisioned)
echo "⚙️  Provision device..."
python3 - << PYEOF
import django, os, sys
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'kolibri.deployment.default.settings.base')

ADMIN_USER = os.environ.get('KOLIBRI_ADMIN_USER', 'etagia_admin')
ADMIN_PASS = os.environ.get('KOLIBRI_ADMIN_PASSWORD', 'Etagia2025!')

try:
    import kolibri
    kolibri.dist.django.setup()
except Exception as e:
    print(f'Django setup error: {e}')
    # Try alternative import
    try:
        from kolibri.utils.main import initialize
        initialize()
    except Exception as e2:
        print(f'Init error: {e2}')
        sys.exit(0)

try:
    from kolibri.core.auth.models import Facility, FacilityUser
    from kolibri.core.device.models import DeviceSettings, DevicePermissions

    # Facility
    facility, _ = Facility.objects.get_or_create(name='ETAGIA LMS')

    # Device settings — BOTH fields to bypass wizard
    ds, _ = DeviceSettings.objects.get_or_create()
    ds.default_facility = facility
    ds.allow_guest_access = True
    ds.language_id = 'fr'
    # Try both field names (changed between versions)
    for field in ['is_provisioned', 'setup_wizard_finished']:
        try:
            setattr(ds, field, True)
        except Exception:
            pass
    ds.save()
    print(f'✓ Device settings sauvegardés')

    # Admin user
    if not FacilityUser.objects.filter(username=ADMIN_USER, facility=facility).exists():
        u = FacilityUser(username=ADMIN_USER, facility=facility)
        u.set_password(ADMIN_PASS)
        u.save()
        DevicePermissions.objects.get_or_create(
            user=u,
            defaults={'is_superuser': True, 'can_manage_content': True}
        )
        print(f'✓ Admin "{ADMIN_USER}" créé')
    else:
        print(f'✓ Admin "{ADMIN_USER}" existant')

except Exception as e:
    print(f'⚠ Setup: {e}')

PYEOF

echo "Setup OK"

# 3. Import canal KA Français
echo "📚 Import canal KA FR (878ec2e6...)..."
kolibri manage importchannel network $KA_FR_CHANNEL 2>&1 && \
  echo "✓ Canal importé" || echo "⚠ Import canal: sera importé au démarrage"

# 4. Démarrer Kolibri
echo "✅ Kolibri → port $PORT"
exec kolibri start --foreground --port="$PORT"
