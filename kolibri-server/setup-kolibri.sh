#!/bin/bash
# ─────────────────────────────────────────────────────────────────────────────
#  ETAGIA LMS — Script d'installation et configuration Kolibri
#  À exécuter UNE SEULE FOIS sur le VPS Hostinger
#  Usage : chmod +x setup-kolibri.sh && ./setup-kolibri.sh
# ─────────────────────────────────────────────────────────────────────────────

set -e

KOLIBRI_URL="http://localhost:8080"

# ID du canal Khan Academy en FRANÇAIS sur Kolibri Studio
# Canal officiel KA Francophone (mathématiques, sciences, etc.)
KA_FR_CHANNEL="9a3a615f0501427baf1f17b08f196fd2"

echo "═══════════════════════════════════════════════════════"
echo "  ETAGIA × Kolibri — Setup Khan Academy Francophone"
echo "═══════════════════════════════════════════════════════"
echo ""

# ── 1. Vérifier Docker ───────────────────────────────────────────────────────
if ! command -v docker &> /dev/null; then
  echo "❌ Docker non trouvé. Installation..."
  curl -fsSL https://get.docker.com | bash
  usermod -aG docker $USER
fi
echo "✓ Docker OK"

# ── 2. Lancer Kolibri ────────────────────────────────────────────────────────
echo ""
echo "📦 Démarrage de Kolibri..."
docker compose up -d

echo "⏳ Attente du démarrage Kolibri (30s)..."
sleep 30

# ── 3. Créer le compte admin ETAGIA ──────────────────────────────────────────
echo ""
echo "👤 Création du compte admin Kolibri..."
docker exec etagia-kolibri kolibri manage createsuperuser \
  --username=etagia_admin \
  --email=prolaminegaye@gmail.com \
  --no-input || echo "⚠️ Admin déjà existant — OK"

# ── 4. Obtenir le token d'authentification ────────────────────────────────────
echo ""
echo "🔑 Obtention du token API..."
TOKEN=$(curl -s -X POST "${KOLIBRI_URL}/api/auth/login/" \
  -H "Content-Type: application/json" \
  -d '{"username":"etagia_admin","password":"etagia_kolibri_2025"}' | \
  python3 -c "import sys,json; print(json.load(sys.stdin).get('token',''))" 2>/dev/null || echo "")

if [ -z "$TOKEN" ]; then
  echo "ℹ️  Définissez d'abord le mot de passe admin via l'interface Kolibri"
  echo "   http://localhost:8080 → Se connecter → Paramètres → Mot de passe"
  echo ""
fi

# ── 5. Importer le canal Khan Academy Français ────────────────────────────────
echo "📚 Import du canal Khan Academy Francophone..."
echo "   Channel ID : ${KA_FR_CHANNEL}"
echo ""

# Import des métadonnées du canal (rapide)
docker exec etagia-kolibri kolibri manage importchannel \
  network "${KA_FR_CHANNEL}" && echo "✓ Métadonnées importées"

echo ""
echo "═══════════════════════════════════════════════════════"
echo "  CHOIX DU CONTENU À TÉLÉCHARGER"
echo "═══════════════════════════════════════════════════════"
echo ""
echo "Options :"
echo "  1) Tout le contenu KA français (~30 GB) — RECOMMANDÉ"
echo "  2) Maths + Sciences uniquement (~12 GB)"
echo "  3) Maths uniquement (~6 GB)"
echo ""
read -p "Votre choix [1/2/3] : " CHOICE

case $CHOICE in
  1)
    echo "📥 Téléchargement de TOUT le contenu KA français..."
    docker exec etagia-kolibri kolibri manage importcontent \
      network "${KA_FR_CHANNEL}"
    ;;
  2)
    echo "📥 Téléchargement Maths + Sciences..."
    # Nœuds spécifiques : Maths + Sciences
    docker exec etagia-kolibri kolibri manage importcontent \
      network "${KA_FR_CHANNEL}" \
      --node_ids="mathematics,science"
    ;;
  3)
    echo "📥 Téléchargement Maths uniquement..."
    docker exec etagia-kolibri kolibri manage importcontent \
      network "${KA_FR_CHANNEL}" \
      --node_ids="mathematics"
    ;;
esac

# ── 6. Activer l'API publique ─────────────────────────────────────────────────
echo ""
echo "🔓 Activation de l'API publique pour ETAGIA..."
docker exec etagia-kolibri kolibri manage shell -c "
from kolibri.core.device.models import DeviceSettings
s = DeviceSettings.objects.first()
if s:
    s.allow_guest_access = True
    s.save()
    print('✓ Accès invité activé')
"

# ── 7. Résumé ────────────────────────────────────────────────────────────────
echo ""
echo "═══════════════════════════════════════════════════════"
echo "  ✅ KOLIBRI PRÊT !"
echo "═══════════════════════════════════════════════════════"
echo ""
echo "  URL Kolibri     : http://$(hostname -I | awk '{print $1}'):8080"
echo "  API Content     : http://$(hostname -I | awk '{print $1}'):8080/api/content/"
echo "  Admin           : etagia_admin"
echo ""
echo "  👉 Configurer maintenant dans ETAGIA :"
echo "     Variable d'env : KOLIBRI_SERVER_URL=http://$(hostname -I | awk '{print $1}'):8080"
echo "     À ajouter dans Vercel → Settings → Environment Variables"
echo ""
echo "  📋 Prochaine étape :"
echo "     Ajouter le sous-domaine kolibri.etagia-academie.com"
echo "     pointant vers l'IP : $(hostname -I | awk '{print $1}')"
echo ""
