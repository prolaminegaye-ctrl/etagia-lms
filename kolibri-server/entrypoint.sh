#!/bin/bash
# ─────────────────────────────────────────────────────────────────────────────
#  ETAGIA × Kolibri — Entrypoint Railway
#  Kolibri démarre sur port 9090, Nginx proxy sur port 8080
# ─────────────────────────────────────────────────────────────────────────────

set -e

KA_FR_CHANNEL="9a3a615f0501427baf1f17b08f196fd2"
ADMIN_USER="${KOLIBRI_ADMIN_USER:-etagia_admin}"
ADMIN_PASS="${KOLIBRI_ADMIN_PASSWORD:-Etagia2025!}"
ADMIN_EMAIL="${KOLIBRI_ADMIN_EMAIL:-prolaminegaye@gmail.com}"

echo "════════════════════════════════════════"
echo "  ETAGIA × Kolibri — Démarrage Railway"
echo "  Kolibri: port 9090 | Nginx: port 8080"
echo "════════════════════════════════════════"

# ── Démarrer Nginx (health check + proxy) ──────────────────────────────────
echo "🌐 Démarrage Nginx (port 8080)..."
nginx -g "daemon off;" &
NGINX_PID=$!
echo "✓ Nginx PID: $NGINX_PID"

# ── Initialiser Kolibri ────────────────────────────────────────────────────
echo "📦 Initialisation Kolibri (port 9090)..."
export KOLIBRI_HTTP_PORT=9090
export KOLIBRI_LANG="${KOLIBRI_LANG:-fr}"
export KOLIBRI_ALLOW_GUEST_ACCESS="${KOLIBRI_ALLOW_GUEST_ACCESS:-1}"

kolibri manage migrate --noinput 2>/dev/null || true

# Créer admin si nécessaire
echo "👤 Configuration admin..."
kolibri manage shell -c "
from kolibri.core.auth.models import FacilityUser, Facility
from kolibri.core.device.models import DevicePermissions, DeviceSettings

facility, _ = Facility.objects.get_or_create(name='ETAGIA LMS')

# Activer accès invité
s, _ = DeviceSettings.objects.get_or_create()
s.allow_guest_access = True
s.setup_wizard_finished = True
s.save()

# Créer admin
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
        print('✓ Admin existe')
except Exception as e:
    print(f'Admin: {e}')
" 2>/dev/null || echo "⚠ Init ignorée"

# ── Importer les métadonnées du canal KA Français ─────────────────────────
echo "📚 Import canal Khan Academy Français..."
kolibri manage importchannel network "${KA_FR_CHANNEL}" 2>/dev/null && \
  echo "✓ Canal importé" || echo "⚠ Import différé (réseau)"

echo "✅ Lancement Kolibri sur port 9090..."
echo "════════════════════════════════════════"

# ── Démarrer Kolibri (foreground) ─────────────────────────────────────────
exec kolibri start --foreground --port=9090
