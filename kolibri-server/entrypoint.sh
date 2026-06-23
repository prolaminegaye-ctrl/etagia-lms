#!/bin/bash
# ─────────────────────────────────────────────────────────────────────────────
#  ETAGIA × Kolibri — Script de démarrage automatique
#  Initialise Kolibri, crée l'admin, importe le canal KA Français
# ─────────────────────────────────────────────────────────────────────────────

set -e

KA_FR_CHANNEL="9a3a615f0501427baf1f17b08f196fd2"
ADMIN_USER="${KOLIBRI_ADMIN_USER:-etagia_admin}"
ADMIN_PASS="${KOLIBRI_ADMIN_PASSWORD:-Etagia2025!}"
ADMIN_EMAIL="${KOLIBRI_ADMIN_EMAIL:-prolaminegaye@gmail.com}"

echo "════════════════════════════════════════"
echo "  ETAGIA × Kolibri — Démarrage"
echo "════════════════════════════════════════"

# Initialiser la base de données Kolibri (si premier démarrage)
echo "📦 Initialisation Kolibri..."
kolibri manage migrate --noinput 2>/dev/null || true

# Créer le compte admin si pas existant
echo "👤 Vérification du compte admin..."
kolibri manage shell -c "
from kolibri.core.auth.models import FacilityUser, Facility
from django.contrib.auth.models import User

# Créer la facility si nécessaire
facility, _ = Facility.objects.get_or_create(name='ETAGIA LMS')

# Créer le superuser si nécessaire
try:
    from kolibri.core.device.models import DevicePermissions
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
        print('✓ Admin existe déjà')
except Exception as e:
    print(f'Admin: {e}')
" 2>/dev/null || echo "⚠ Admin init ignoré"

# Activer l'accès invité pour l'API ETAGIA
echo "🔓 Activation accès API..."
kolibri manage shell -c "
from kolibri.core.device.models import DeviceSettings
s, _ = DeviceSettings.objects.get_or_create()
s.allow_guest_access = True
s.setup_wizard_finished = True
s.save()
print('✓ Accès API activé')
" 2>/dev/null || echo "⚠ Settings ignorés"

# Importer les métadonnées du canal KA Français (rapide, ~10 MB)
echo "📚 Import métadonnées canal Khan Academy Français..."
kolibri manage importchannel network "${KA_FR_CHANNEL}" 2>/dev/null && \
  echo "✓ Métadonnées importées" || \
  echo "⚠ Import différé (réseau)"

# Si KOLIBRI_IMPORT_CONTENT=1, télécharger une sélection de contenu
if [ "${KOLIBRI_IMPORT_CONTENT:-0}" = "1" ]; then
  echo "📥 Téléchargement contenu (KOLIBRI_IMPORT_CONTENT=1)..."
  kolibri manage importcontent network "${KA_FR_CHANNEL}" \
    --node_ids="${KOLIBRI_CONTENT_NODES:-}" 2>/dev/null || echo "⚠ Contenu différé"
fi

echo "✅ Kolibri prêt — démarrage du serveur sur port 8080"
echo "════════════════════════════════════════"

# Démarrer Kolibri
exec kolibri start --foreground --port=8080
