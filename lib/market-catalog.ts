// ═══════════════════════════════════════════════════════════
// CATALOGUE OFFICIEL ETAGIA — 4 MODULES PROFESSIONNELS
// Regroupement thématique — Afrique francophone
// ═══════════════════════════════════════════════════════════

export interface EtProduct {
  id: string;
  type: 'cours' | 'livre' | 'logiciel' | 'ressource';
  title: string;
  author: string;
  price: number;
  cover: string;
  desc: string;
  longDesc: string;
  shortLongDesc: string;
  rating: number;
  sales: number;
  pages?: number;
  tags: string[];
  status: 'published' | 'draft';
  new?: boolean;
  bestseller?: boolean;
  featured?: boolean;
  fileSize?: string;
  fileDataUrl?: string;
  fileName?: string;
  createdAt: number;
  updatedAt: number;
  chapitres?: string[];
  niveau?: string;
  duree?: string;
}

export const ETAGIA_CATALOG: EtProduct[] = [
  {
    id: 'et_mod01',
    type: 'cours',
    title: "Maîtriser l'entretien commercial",
    author: 'ETAGIA Académie',
    price: 34900,
    cover: '🎙️',
    desc: "5 modules pour transformer chaque entretien en levier de progression : analyse, objectifs SMART, pilotage des écarts, actions correctives et loi de Pareto.",
    longDesc: `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📚 MODULE ETAGIA ACADÉMIE
MAÎTRISER L'ENTRETIEN COMMERCIAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Ce module regroupe 5 cours complémentaires pour maîtriser l'entretien commercial de bout en bout.

CHAPITRES INCLUS :
1. Analyser un entretien de vente pour s'améliorer
2. Fixer et piloter ses objectifs commerciaux (méthode SMART)
3. Comparer objectifs et réalisations — piloter les écarts
4. Mettre en place des actions correctives (cycle PDCA)
5. Loi de Pareto appliquée en commerce — prioriser ses efforts

POUR QUI ?
Commerciaux terrain, responsables de rayon, chefs d'équipe,
consultants en commerce de détail.

CONTEXTE AFRICAIN :
Exemples tirés du marché sénégalais, ivoirien, burkinabè.
Outils adaptés : Wave, Ecobank, Score, SGBCI, marchés locaux.

© ETAGIA — Licence accordée à l'acheteur uniquement
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    shortLongDesc: `Module complet de 5 cours sur l'entretien commercial. Grilles d'analyse, SMART, PDCA, Pareto — tous les outils du commercial performant en contexte africain.`,
    rating: 4.9,
    sales: 0,
    pages: 80,
    fileSize: 'PDF · 80 pages · 5 chapitres · 30 KB',
    tags: ["vente", "entretien", "objectifs", "SMART", "PDCA", "Pareto", "management commercial"],
    status: 'published',
    new: true,
    featured: true,
    chapitres: [
      "Analyser un entretien de vente",
      "Fixer et piloter ses objectifs (SMART)",
      "Comparer objectifs et réalisations",
      "Actions correctives (PDCA)",
      "Loi de Pareto en commerce"
    ],
    niveau: "Intermédiaire",
    duree: "6–8 heures",
    createdAt: 1748200000000,
    updatedAt: 1748200000000,
  fileDataUrl: '/modules/MODULE_01_Entretien_Commercial.pdf',
  fileName: 'MODULE_01_Entretien_Commercial.pdf',
},
  {
    id: 'et_mod02',
    type: 'cours',
    title: "Indicateurs & Reporting commercial",
    author: 'ETAGIA Académie',
    price: 29900,
    cover: '📊',
    desc: "Maîtrisez les KPIs essentiels, construisez vos tableaux de bord et rédigez des reportings actionnables pour piloter votre activité.",
    longDesc: `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📚 MODULE ETAGIA ACADÉMIE
INDICATEURS & REPORTING COMMERCIAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Ce module couvre l'ensemble des outils de mesure et de pilotage
d'une activité commerciale en Afrique francophone.

CHAPITRES INCLUS :
1. Indicateurs de gestion liés aux ventes (CA, taux transformation, ticket moyen...)
2. Mesurer la performance commerciale individuelle et collective
3. Le reporting : analyser pour décider
4. Construire et lire un tableau de bord professionnel

POUR QUI ?
Responsables commerciaux, managers de rayon, directeurs de magasin,
contrôleurs de gestion.

© ETAGIA — Licence accordée à l'acheteur uniquement
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    shortLongDesc: `Du KPI au tableau de bord : calculez, interprétez et pilotez vos indicateurs commerciaux. Exemples chiffrés en FCFA, cas pratiques Afrique de l'Ouest.`,
    rating: 4.8,
    sales: 0,
    pages: 65,
    fileSize: 'PDF · 5 chapitres · 21 KB',
    tags: ["KPI", "reporting", "tableau de bord", "performance", "indicateurs", "management"],
    status: 'published',
    new: true,
    bestseller: true,
    chapitres: [
      "Indicateurs de gestion des ventes",
      "Mesurer la performance commerciale",
      "Le reporting : analyser pour décider",
      "Construire et lire un tableau de bord"
    ],
    niveau: "Intermédiaire",
    duree: "5–6 heures",
    createdAt: 1748200000000,
    updatedAt: 1748200000000,
  fileDataUrl: '/modules/MODULE_02_Indicateurs_Reporting.pdf',
  fileName: 'MODULE_02_Indicateurs_Reporting.pdf',
},
  {
    id: 'et_mod03',
    type: 'cours',
    title: "Gestion des stocks & Inventaire",
    author: 'ETAGIA Académie',
    price: 27900,
    cover: '📦',
    desc: "Maîtrisez les flux de stock : indicateurs, inventaire fiable, rotation FIFO/FEFO et sélection du bon logiciel pour votre contexte africain.",
    longDesc: `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📚 MODULE ETAGIA ACADÉMIE
GESTION DES STOCKS & INVENTAIRE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Un module opérationnel pour gérer les stocks avec rigueur
dans le contexte des marchés africains francophones.

CHAPITRES INCLUS :
1. Indicateurs de gestion des stocks (taux de rupture, rotation, couverture...)
2. Maîtriser l'inventaire en point de vente (procédure, écarts, audit)
3. La rotation des produits — FIFO et FEFO
4. Panorama des logiciels de gestion : Odoo, Saari, Sage 100

POUR QUI ?
Responsables logistique, chefs de rayon, gérants de point de vente,
responsables supply chain PME africaines.

© ETAGIA — Licence accordée à l'acheteur uniquement
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    shortLongDesc: `Zéro rupture, zéro stock mort : les méthodes et outils pour gérer vos stocks efficacement. FIFO/FEFO, Odoo, inventaire physique — tout en contexte africain.`,
    rating: 4.7,
    sales: 0,
    pages: 60,
    fileSize: 'PDF · 5 chapitres · 22 KB',
    tags: ["stocks", "inventaire", "FIFO", "FEFO", "Odoo", "logistique", "supply chain"],
    status: 'published',
    new: true,
    chapitres: [
      "Indicateurs de gestion des stocks",
      "Maîtriser l'inventaire en point de vente",
      "La rotation des produits (FIFO/FEFO)",
      "Panorama des logiciels de gestion"
    ],
    niveau: "Intermédiaire",
    duree: "5–6 heures",
    createdAt: 1748200000000,
    updatedAt: 1748200000000,
  fileDataUrl: '/modules/MODULE_03_Gestion_Stocks_Inventaire.pdf',
  fileName: 'MODULE_03_Gestion_Stocks_Inventaire.pdf',
},
  {
    id: 'et_mod04',
    type: 'cours',
    title: "Veille concurrentielle & Communication pro",
    author: 'ETAGIA Académie',
    price: 19900,
    cover: '🔭',
    desc: "Deux compétences stratégiques : analyser et surveiller la concurrence avec les 5 forces de Porter, et rédiger des notes de synthèse impactantes.",
    longDesc: `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📚 MODULE ETAGIA ACADÉMIE
VEILLE CONCURRENTIELLE & COMMUNICATION PRO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Deux cours complémentaires pour des professionnels complets :
observer leur marché et communiquer avec impact.

CHAPITRES INCLUS :
1. Analyser et surveiller la concurrence (5 forces de Porter, grille concurrentielle)
2. Rédiger une note de synthèse efficace (structure, exemples, erreurs à éviter)

POUR QUI ?
Commerciaux, managers, consultants, toute personne ayant besoin
d'analyser son environnement et de communiquer par écrit.

© ETAGIA — Licence accordée à l'acheteur uniquement
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    shortLongDesc: `Porter, grille concurrentielle, note de synthèse : les outils de l'analyse stratégique et de la communication professionnelle. Exemples Ecobank, Wave, Jumia.`,
    rating: 4.7,
    sales: 0,
    pages: 45,
    fileSize: 'PDF · 4 chapitres · 18 KB',
    tags: ["concurrence", "veille", "Porter", "note de synthèse", "communication", "stratégie"],
    status: 'published',
    new: true,
    chapitres: [
      "Analyser et surveiller la concurrence",
      "Rédiger une note de synthèse efficace"
    ],
    niveau: "Tous niveaux",
    duree: "3–4 heures",
    createdAt: 1748200000000,
    updatedAt: 1748200000000,
  fileDataUrl: '/modules/MODULE_04_Veille_Communication.pdf',
  fileName: 'MODULE_04_Veille_Communication.pdf',
},
  {
    id: 'et_mod05',
    type: 'cours',
    author: 'ETAGIA Académie',
    price: 32900,
    cover: '🤝',
    title: 'Relation Client & Posture Commerciale',
    desc: "Maîtrisez l'art de vendre, d'accueillir et de fidéliser vos clients avec une posture professionnelle affirmée. Méthodes SONCAS, CAB et segmentation clientèle.",
    longDesc: `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📚 MODULE ETAGIA ACADÉMIE
RELATION CLIENT & POSTURE COMMERCIALE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Un module complet pour développer une relation client de qualité
et adopter la posture du commercial africain performant.

CHAPITRES INCLUS :
1. Vendre et conseiller : rôle et missions du commercial
2. Accueil client : les 5 premières secondes qui comptent
3. Posture et méthode SONCAS : décoder les motivations d'achat
4. Méthode CAB : Caractéristiques, Avantages, Bénéfices
5. Segmentation clientèle : cibler pour mieux servir

POUR QUI ?
Commerciaux débutants et confirmés, conseillers clientèle,
responsables de vente, entrepreneurs africains.

© ETAGIA — Licence accordée à l'acheteur uniquement
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    shortLongDesc: `SONCAS, CAB, accueil client, segmentation : toute la posture commerciale en Afrique francophone. Exemples Wave, Ecobank, Orange Money.`,
    rating: 4.8,
    sales: 0,
    pages: 90,
    fileSize: 'PDF · 5 chapitres · 28 KB',
    tags: ["relation client", "SONCAS", "CAB", "posture commerciale", "accueil", "segmentation"],
    status: 'published',
    new: true,
    featured: true,
    chapitres: [
      "Vendre et conseiller : rôle et missions",
      "Accueil client : les 5 premières secondes",
      "Posture et méthode SONCAS",
      "Méthode CAB : Caractéristiques, Avantages, Bénéfices",
      "Segmentation clientèle"
    ],
    niveau: "Débutant à intermédiaire",
    duree: "6–8 heures",
    createdAt: 1748210000000,
    updatedAt: 1748210000000,
  fileDataUrl: '/modules/MODULE_05_Relation_Client_Posture.pdf',
  fileName: 'MODULE_05_Relation_Client_Posture.pdf',
},
  {
    id: 'et_mod06',
    type: 'cours',
    author: 'ETAGIA Académie',
    price: 36900,
    cover: '🎯',
    title: 'Techniques de Vente Avancées',
    desc: "Les 7 étapes de la vente, l'argumentation CAP, la présentation du prix et le closing : un module complet pour les commerciaux qui veulent performer.",
    longDesc: `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📚 MODULE ETAGIA ACADÉMIE
TECHNIQUES DE VENTE AVANCÉES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Du premier contact à la signature : maîtrisez tout le cycle de vente
avec les meilleures techniques adaptées au marché africain.

CHAPITRES INCLUS :
1. Les 7 étapes de la vente : du contact à la conclusion
2. Méthode CAP : Caractéristiques, Avantages, Preuves
3. Présentation du prix : ancrage et valorisation
4. Traitement des objections : méthode CRAC
5. Closing : les techniques de conclusion efficaces

POUR QUI ?
Commerciaux expérimentés, chefs des ventes, business developers,
freelances et entrepreneurs cherchant à optimiser leur cycle de vente.

© ETAGIA — Licence accordée à l'acheteur uniquement
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    shortLongDesc: `7 étapes de la vente, CAP, CRAC, closing : le toolkit complet du commercial africain performant. Mises en situation Jumia, Ecobank, PME locales.`,
    rating: 4.9,
    sales: 0,
    pages: 95,
    fileSize: 'PDF · 5 chapitres · 28 KB',
    tags: ["techniques de vente", "CAP", "CRAC", "objections", "closing", "7 étapes"],
    status: 'published',
    new: true,
    bestseller: true,
    chapitres: [
      "Les 7 étapes de la vente",
      "Méthode CAP : Caractéristiques, Avantages, Preuves",
      "Présentation du prix : ancrage et valorisation",
      "Traitement des objections : méthode CRAC",
      "Closing : les techniques de conclusion"
    ],
    niveau: "Intermédiaire à avancé",
    duree: "7–9 heures",
    createdAt: 1748210000000,
    updatedAt: 1748210000000,
  fileDataUrl: '/modules/MODULE_06_Techniques_Vente_Avancees.pdf',
  fileName: 'MODULE_06_Techniques_Vente_Avancees.pdf',
},
  {
    id: 'et_mod07',
    type: 'cours',
    author: 'ETAGIA Académie',
    price: 28900,
    cover: '💬',
    title: 'Communication Commerciale & Impact',
    desc: "Verbal, non-verbal, canaux de communication, langage corporel, prise de congé réussie et gestion multi-clients : tout pour communiquer avec impact.",
    longDesc: `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📚 MODULE ETAGIA ACADÉMIE
COMMUNICATION COMMERCIALE & IMPACT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

La communication, c'est 93% de non-verbal selon Mehrabian.
Ce module vous donne les clés pour maîtriser votre impact total.

CHAPITRES INCLUS :
1. Communication verbale vs non-verbale : la règle des 7-38-55%
2. Canaux de communication : choisir le bon canal au bon moment
3. Langage corporel : décoder et maîtriser vos signaux
4. Prise de congé réussie : laisser une impression durable
5. Gestion multi-clients en affluence : priorités et équité

POUR QUI ?
Commerciaux, conseillers, managers, toute personne en contact
régulier avec des clients en face-à-face ou au téléphone.

© ETAGIA — Licence accordée à l'acheteur uniquement
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    shortLongDesc: `Règle Mehrabian, langage corporel, canaux de com, closing émotionnel et gestion d'affluence : la communication commerciale maîtrisée de A à Z.`,
    rating: 4.7,
    sales: 0,
    pages: 85,
    fileSize: 'PDF · 5 chapitres · 33 KB',
    tags: ["communication", "non-verbal", "Mehrabian", "langage corporel", "multi-clients", "impact"],
    status: 'published',
    new: true,
    chapitres: [
      "Communication verbale vs non-verbale",
      "Canaux de communication",
      "Langage corporel : décoder et maîtriser",
      "Prise de congé réussie",
      "Gestion multi-clients en affluence"
    ],
    niveau: "Tous niveaux",
    duree: "5–7 heures",
    createdAt: 1748210000000,
    updatedAt: 1748210000000,
  fileDataUrl: '/modules/MODULE_07_Communication_Commerciale.pdf',
  fileName: 'MODULE_07_Communication_Commerciale.pdf',
},
  {
    id: 'et_mod08',
    type: 'cours',
    author: 'ETAGIA Académie',
    price: 31900,
    cover: '🏪',
    title: 'Fondamentaux du Merchandising',
    desc: "Maîtrisez l'organisation et la présentation du point de vente : règle des 4P, facing, niveaux de rayon, rangement et espace de vente optimisé.",
    longDesc: `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📚 MODULE ETAGIA ACADÉMIE
FONDAMENTAUX DU MERCHANDISING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Le merchandising est l'art d'organiser et valoriser l'espace de vente
pour maximiser les achats. Dans les marchés africains, c'est un avantage
concurrentiel décisif face à Score, Mahima, Sococé et boutiques locales.

CHAPITRES INCLUS :
1. Grands principes du marchandisage (organisation, séduction, gestion)
2. Présentation marchande & règle des 4P (Plein, Prix, Propre, Promotion)
3. Facing : remplissage et implantation en rayon
4. Rangement et nettoyage des surfaces de vente
5. Organisation de l'espace de vente (zoning, allées, zones chaudes/froides)

POUR QUI ?
Responsables de rayon, chefs de secteur, gérants de boutique,
merchandisers, employés commerciaux en distribution.

© ETAGIA — Licence accordée à l'acheteur uniquement
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    shortLongDesc: `Règle des 4P, facing, niveaux de rayon, zoning : les fondamentaux du merchandising adaptés aux points de vente africains (Score, Sococé, boutiques).`,
    rating: 4.7,
    sales: 0,
    pages: 85,
    fileSize: 'PDF · 5 chapitres · 30 KB',
    tags: ["merchandising", "marchandisage", "facing", "4P", "organisation", "rayon", "point de vente"],
    status: 'published',
    new: true,
    chapitres: [
      "Grands principes du marchandisage",
      "Présentation marchande & règle des 4P",
      "Facing : remplissage et implantation",
      "Rangement et nettoyage des surfaces de vente",
      "Organisation de l'espace de vente"
    ],
    niveau: "Débutant à intermédiaire",
    duree: "6–7 heures",
    createdAt: 1748220000000,
    updatedAt: 1748220000000,
  fileDataUrl: '/modules/MODULE_08_Fondamentaux_Merchandising.pdf',
  fileName: 'MODULE_08_Fondamentaux_Merchandising.pdf',
},
  {
    id: 'et_mod09',
    type: 'cours',
    author: 'ETAGIA Académie',
    price: 34900,
    cover: '🎪',
    title: 'Animation & Dynamisation du Point de Vente',
    desc: "Marketing sensoriel, planogramme, ILV/PLV, saisonnalité africaine, actions promotionnelles et argumentaire unité marchande : animez votre espace comme un pro.",
    longDesc: `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📚 MODULE ETAGIA ACADÉMIE
ANIMATION & DYNAMISATION DU POINT DE VENTE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Attirer, retenir et pousser à l'achat : ce module vous donne tous
les outils pour créer une expérience d'achat inoubliable.

CHAPITRES INCLUS :
1. Facteurs d'ambiance & marketing sensoriel (5 sens)
2. Le planogramme : conception et utilisation
3. ILV et PLV : informer et séduire en magasin
4. Saisonnalité des ventes (Tabaski, Noël, rentrée, Ramadan)
5. Actions promotionnelles : concevoir et exécuter
6. Argumentaire pour valoriser l'unité marchande (méthode CAP)

POUR QUI ?
Responsables commerciaux, animateurs de vente, gérants de boutique,
chefs de rayon, category managers en Afrique francophone.

© ETAGIA — Licence accordée à l'acheteur uniquement
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    shortLongDesc: `Marketing sensoriel, planogramme, ILV/PLV, saisonnalité africaine (Tabaski, Noël), promotions et argumentaire CAP : l'animation commerciale maîtrisée.`,
    rating: 4.9,
    sales: 0,
    pages: 100,
    fileSize: 'PDF · 6 chapitres · 35 KB',
    tags: ["animation", "PLV", "ILV", "planogramme", "promotion", "saisonnalité", "marketing sensoriel"],
    status: 'published',
    new: true,
    bestseller: true,
    chapitres: [
      "Facteurs d'ambiance & marketing sensoriel",
      "Le planogramme : conception et utilisation",
      "ILV et PLV : informer et séduire en magasin",
      "Saisonnalité des ventes et adaptation",
      "Actions promotionnelles : concevoir et exécuter",
      "Argumentaire pour valoriser l'unité marchande"
    ],
    niveau: "Intermédiaire",
    duree: "8–10 heures",
    createdAt: 1748220000000,
    updatedAt: 1748220000000,
  fileDataUrl: '/modules/MODULE_09_Animation_Point_de_Vente.pdf',
  fileName: 'MODULE_09_Animation_Point_de_Vente.pdf',
},
  {
    id: 'et_mod10',
    type: 'cours',
    author: 'ETAGIA Académie',
    price: 29900,
    cover: '🧠',
    title: 'Image de Marque & Communication Non-Verbale',
    desc: "Construire une image de marque forte, maîtriser son langage corporel (règle Mehrabian 7-38-55%) et aligner image personnelle et communication professionnelle.",
    longDesc: `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📚 MODULE ETAGIA ACADÉMIE
IMAGE DE MARQUE & COMMUNICATION NON-VERBALE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

En Afrique, le bouche-à-oreille représente 60 % des acquisitions clients.
L'image que vous projetez conditionne tout ce que les gens disent de vous.

CHAPITRES INCLUS :
1. L'image de marque : enjeux et construction (4 piliers)
2. Image personnelle = image de marque
3. Langage corporel : décoder et maîtriser (Mehrabian 7-38-55%)
4. Communication non-verbale avancée
5. Cohérence image / communication en contexte africain

POUR QUI ?
Entrepreneurs, commerciaux, managers, toute personne souhaitant
renforcer son impact personnel et la crédibilité de sa marque.

© ETAGIA — Licence accordée à l'acheteur uniquement
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    shortLongDesc: `Image de marque, Mehrabian 7-38-55%, langage corporel, cohérence image/communication : l'impact total maîtrisé pour les professionnels africains.`,
    rating: 4.8,
    sales: 0,
    pages: 90,
    fileSize: 'PDF · 5 chapitres · 31 KB',
    tags: ["image de marque", "langage corporel", "Mehrabian", "non-verbal", "communication", "posture"],
    status: 'published',
    new: true,
    featured: true,
    chapitres: [
      "L'image de marque : enjeux et construction",
      "Image personnelle = image de marque",
      "Langage corporel : décoder et maîtriser",
      "Communication non-verbale avancée",
      "Cohérence image / communication en contexte africain"
    ],
    niveau: "Tous niveaux",
    duree: "5–7 heures",
    createdAt: 1748220000000,
    updatedAt: 1748220000000,
  fileDataUrl: '/modules/MODULE_10_Image_Marque_Communication.pdf',
  fileName: 'MODULE_10_Image_Marque_Communication.pdf',
},
  {
    id: 'et_mod11',
    type: 'cours',
    author: 'ETAGIA Académie',
    price: 39900,
    cover: '🏛️',
    title: 'Fondations du Leadership Politique',
    desc: "Vision, autorité, communication politique, storytelling, empathie, charisme et art oratoire : les 6 piliers du leader africain qui mobilise et inspire.",
    longDesc: `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📚 MODULE ETAGIA ACADÉMIE
FONDATIONS DU LEADERSHIP POLITIQUE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

De Kwame Nkrumah à Thomas Sankara, l'Afrique a enfanté des leaders
qui ont changé l'histoire. Ce module vous donne les fondations
pour rejoindre cette lignée de leaders au service du peuple.

CHAPITRES INCLUS :
1. Qu'est-ce qu'un bon leader politique ?
2. La vision du leader : inspirer et mobiliser
3. L'autorité : légitimité et crédibilité
4. La communication politique & storytelling
5. Empathie, confiance en soi et charisme
6. Maîtriser l'art de l'Oratoire Public

POUR QUI ?
Leaders associatifs, politiques, communautaires, jeunes engagés,
élus locaux, tout professionnel souhaitant développer son leadership
en Afrique francophone.

© ETAGIA — Licence accordée à l'acheteur uniquement
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    shortLongDesc: `Vision, autorité, storytelling, charisme, oratoire : les 6 piliers du leadership africain. Exemples Nkrumah, Sankara, Mandela, Obama — adaptés au terrain africain.`,
    rating: 4.9,
    sales: 0,
    pages: 95,
    fileSize: 'PDF · 6 chapitres · 37 KB',
    tags: ["leadership", "politique", "vision", "charisme", "oratoire", "communication", "Afrique"],
    status: 'published',
    new: true,
    featured: true,
    bestseller: true,
    chapitres: [
      "Qu'est-ce qu'un bon leader politique ?",
      "La vision du leader : inspirer et mobiliser",
      "L'autorité : légitimité et crédibilité",
      "La communication politique & storytelling",
      "Empathie, confiance en soi et charisme",
      "Maîtriser l'art de l'Oratoire Public"
    ],
    niveau: "Intermédiaire à avancé",
    duree: "7–9 heures",
    createdAt: 1748230000000,
    updatedAt: 1748230000000,
  fileDataUrl: '/modules/MODULE_11_Fondations_Leadership_Politique.pdf',
  fileName: 'MODULE_11_Fondations_Leadership_Politique.pdf',
},
  {
    id: 'et_mod12',
    type: 'cours',
    author: 'ETAGIA Académie',
    price: 37900,
    cover: '🧩',
    title: 'Outils & Stratégies du Leader Politique',
    desc: "Langage corporel, débats, IKIGAI, SWOT, modèle DISC et analyse PESTEL : les outils concrets du leader africain qui décide avec méthode et impact.",
    longDesc: `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📚 MODULE ETAGIA ACADÉMIE
OUTILS & STRATÉGIES DU LEADER POLITIQUE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Ce module complète les fondations du leadership par des outils
stratégiques éprouvés pour analyser, décider et agir avec impact.

CHAPITRES INCLUS :
1. Langage corporel & protocole vestimentaire (Mehrabian 55%)
2. Maîtriser les débats politiques
3. Trouver son IKIGAI pour gagner en leadership
4. Analyse SWOT appliquée au leadership politique
5. Gérer les conflits avec le modèle DISC (4 profils)
6. Décider avec l'analyse PESTEL — Étude de cas Lomé

POUR QUI ?
Leaders confirmés, candidats aux élections, responsables associatifs,
managers politiques, tout professionnel voulant passer au niveau supérieur.

© ETAGIA — Licence accordée à l'acheteur uniquement
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    shortLongDesc: `Langage corporel, IKIGAI, SWOT, DISC, PESTEL : la boîte à outils complète du leader politique africain. Étude de cas terrain Lomé, Abidjan, Dakar.`,
    rating: 4.8,
    sales: 0,
    pages: 90,
    fileSize: 'PDF · 6 chapitres · 36 KB',
    tags: ["leadership", "DISC", "PESTEL", "SWOT", "IKIGAI", "débat", "stratégie", "décision"],
    status: 'published',
    new: true,
    featured: true,
    chapitres: [
      "Langage corporel & protocole vestimentaire",
      "Maîtriser les débats politiques",
      "Trouver son IKIGAI pour gagner en leadership",
      "Analyse SWOT appliquée au leadership",
      "Gérer les conflits avec le modèle DISC",
      "Décider avec l'analyse PESTEL — Étude de cas"
    ],
    niveau: "Intermédiaire à avancé",
    duree: "7–8 heures",
    createdAt: 1748230000000,
    updatedAt: 1748230000000,
  fileDataUrl: '/modules/MODULE_12_Outils_Strategies_Leader.pdf',
  fileName: 'MODULE_12_Outils_Strategies_Leader.pdf',
},

  {
    id: 'et_ebook01',
    type: 'livre',
    author: 'ETAGIA Learning',
    price: 14900,
    cover: '🎓',
    title: "L'Intelligence Artificielle au Service des Éducateurs",
    desc: "Guide complet pour comprendre, adopter et maîtriser l'IA dans l'éducation. Basé sur Microsoft Learn, enrichi pour l'Afrique francophone.",
    longDesc: `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📚 eBOOK PREMIUM ETAGIA
L'INTELLIGENCE ARTIFICIELLE AU SERVICE DES ÉDUCATEURS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Du débutant à l'initié : 32 pages denses pour transformer votre pratique pédagogique grâce à l'IA, avec des exemples concrets contextualisés pour l'Afrique francophone.

CHAPITRES :
1. Qu'est-ce que l'Intelligence Artificielle ? (définition, histoire, types)
2. L'IA Générative — La Révolution Créative (comparatif outils, méthode SIFT)
3. Les Grands Modèles de Langage (LLM) — Cadre CRTF de prompting
4. Génération d'Images par IA (usages pédagogiques créatifs)
5. L'IA dans l'Éducation (réduction charge, personnalisation)
6. Outils IA, Accessibilité & Inclusion (contexte africain)
7. IA Responsable : Éthique & Pensée Critique (6 principes Microsoft)

BONUS INCLUS :
✅ Glossaire 20 termes clés
✅ 3 exercices pratiques (tableau de bord IA, fiche de cours, plan d'intégration)
✅ 2 études de cas africaines (Dakar, Abidjan)
✅ 30+ prompts prêts à l'emploi
✅ Workflow PACO & boîte à outils complète

Basé sur le parcours officiel Microsoft Learn — enrichi et augmenté.
© ETAGIA Learning 2025 — Licence accordée à l'acheteur
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    shortLongDesc: "De ChatGPT à Copilot, des LLM aux images IA : 7 chapitres + 30 prompts + études de cas africaines pour faire de vous un éducateur augmenté.",
    rating: 4.9,
    sales: 0,
    pages: 32,
    fileSize: 'PDF · 32 pages · 170 KB',
    tags: ["IA", "éducation", "ChatGPT", "Copilot", "prompts", "Microsoft Learn", "Afrique", "éducateur"],
    status: 'published',
    new: true,
    featured: true,
    bestseller: true,
    chapitres: [
      "Qu'est-ce que l'Intelligence Artificielle ?",
      "L'IA Générative : La Révolution Créative",
      "Les Grands Modèles de Langage (LLM) & Cadre CRTF",
      "Génération d'Images par IA",
      "L'IA dans l'Éducation",
      "Outils IA, Accessibilité & Inclusion",
      "IA Responsable : Éthique & Pensée Critique"
    ],
    niveau: "Débutant à intermédiaire",
    duree: "3–4 heures de lecture",
    createdAt: 1748300000000,
    updatedAt: 1748300000000,
    fileDataUrl: '/modules/EBOOK_IA_Educateurs_ETAGIA_2025.pdf',
    fileName: 'EBOOK_IA_Educateurs_ETAGIA_2025.pdf',
  },
  {
    id: 'et_ebook02',
    type: 'livre',
    author: 'ETAGIA Learning',
    price: 14900,
    cover: '🧰',
    title: "La Boîte à Outils IA du Formateur",
    desc: "Guide complet pour concevoir, animer et optimiser vos formations avec l'IA. Basé sur le parcours Microsoft Learn AI Toolbox for Trainers.",
    longDesc: `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📚 eBOOK PREMIUM ETAGIA
LA BOÎTE À OUTILS IA DU FORMATEUR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

28 pages pour devenir un formateur augmenté par l'IA — de la conception pédagogique à l'animation, de la personnalisation à l'inclusion.

MODULES :
1. Intégrer les Outils IA dans votre Environnement de Formation (Microsoft 365 Copilot, 4 niveaux d'apprentissage)
2. Optimiser vos Plans de Formation avec l'IA (conception, collaboration, inclusivité)
3. Créer des Environnements d'Apprentissage Inclusifs (accessibilité, différenciation, évaluation IA)
4. Maîtriser les Outils Concrets de Production IA (prompts CRTF, contenus visuels et multimédia)

BONUS INCLUS :
✅ Comparatif Microsoft vs Anthropic vs Google vs Canva
✅ 2 études de cas africaines (Dakar, Abidjan, Lomé)
✅ Glossaire 25 termes opérationnels
✅ 4 exercices pratiques avec livrables
✅ Checklist du formateur augmenté (50 points)
✅ 12 modèles CRTF prêts à l'emploi

Basé sur "An AI Toolbox for Trainers" (Microsoft Learn) — enrichi pour l'Afrique francophone.
© ETAGIA Learning 2025 — Licence accordée à l'acheteur
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    shortLongDesc: "4 modules pratiques + comparatif outils IA + 12 prompts CRTF + études de cas africaines : la boîte à outils complète du formateur augmenté.",
    rating: 4.9,
    sales: 0,
    pages: 28,
    fileSize: 'PDF · 28 pages · 168 KB',
    tags: ["IA", "formation", "formateur", "Copilot", "Microsoft 365", "prompts", "CRTF", "inclusion", "Afrique"],
    status: 'published',
    new: true,
    featured: true,
    chapitres: [
      "Intégrer les Outils IA dans votre Environnement de Formation",
      "Optimiser vos Plans de Formation avec l'IA",
      "Créer des Environnements d'Apprentissage Inclusifs",
      "Maîtriser les Outils Concrets de Production IA",
      "Comparatif des Outils IA pour Formateurs",
      "Études de Cas africaines et francophones"
    ],
    niveau: "Débutant à intermédiaire",
    duree: "2–3 heures de lecture",
    createdAt: 1748300000000,
    updatedAt: 1748300000000,
    fileDataUrl: '/modules/EBOOK_AI_Toolbox_Formateurs_ETAGIA_2025.pdf',
    fileName: 'EBOOK_AI_Toolbox_Formateurs_ETAGIA_2025.pdf',
  },
];
