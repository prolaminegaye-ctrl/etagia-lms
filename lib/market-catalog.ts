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
    fileSize: 'PDF · 80 pages · 5 chapitres',
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
    fileSize: 'PDF · 65 pages · 4 chapitres',
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
    fileSize: 'PDF · 60 pages · 4 chapitres',
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
    fileSize: 'PDF · 45 pages · 2 chapitres',
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
  },
];
