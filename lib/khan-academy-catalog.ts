/**
 * ETAGIA LMS — Catalogue Khan Academy Français
 * Modules 100% en français — contenu vérifié sur fr.khanacademy.org
 * et chaîne YouTube KhanAcademy Francophone
 *
 * POLITIQUE : seules les sections traduites de fr.khanacademy.org
 * sont incluses. Les rubriques college-careers-more (anglais) sont exclues.
 */

export type KAKind = 'video' | 'exercise' | 'course'
export type KALevel = 'débutant' | 'intermédiaire' | 'avancé'

export interface KAModule {
  id:          string
  title:       string
  description: string
  kind:        KAKind
  level:       KALevel
  duration?:   string
  domain:      string
  tags:        string[]
  /** ID YouTube → embed direct (vidéo FR confirmée) */
  youtubeId?:  string
  /** URL fr.khanacademy.org (ouvrir dans un nouvel onglet) */
  kaUrl:       string
}

export interface KADomain {
  id:          string
  label:       string
  icon:        string
  color:       string   // couleur principale (CSS)
  colorLight:  string   // fond clair (CSS)
  description: string
}

/* ── Domaines ──────────────────────────────────────────────────────────────── */
export const KA_DOMAINS: KADomain[] = [
  {
    id: 'maths',
    label: 'Mathématiques',
    icon: '📐',
    color: '#0FB6CC',
    colorLight: '#E6FBFD',
    description: 'Statistiques, probabilités, algèbre, calcul — traduit intégralement en français',
  },
  {
    id: 'sciences',
    label: 'Sciences',
    icon: '🔬',
    color: '#12A596',
    colorLight: '#E6FBF8',
    description: 'Physique, chimie, biologie, santé — contenu FR validé',
  },
  {
    id: 'informatique',
    label: 'Informatique',
    icon: '💻',
    color: '#F4B01E',
    colorLight: '#FFF7E2',
    description: 'Programmation, algorithmes, web, réseaux — traduit en français',
  },
  {
    id: 'finance',
    label: 'Finance & Économie',
    icon: '📈',
    color: '#FB6514',
    colorLight: '#FFF1E8',
    description: 'Comptabilité, marchés, micro et macro-économie en français',
  },
  {
    id: 'humanites',
    label: 'Humanités',
    icon: '📚',
    color: '#C28705',
    colorLight: '#FFF7E2',
    description: 'Histoire, géographie, éducation civique — en français',
  },
  {
    id: 'sante',
    label: 'Santé & Médecine',
    icon: '🏥',
    color: '#C94908',
    colorLight: '#FFF1E8',
    description: 'Anatomie, médecine, physiologie — sections traduites KA',
  },
]

/* ── Modules ───────────────────────────────────────────────────────────────── */
export const KA_MODULES: KAModule[] = [

  /* ════════════ MATHÉMATIQUES ════════════ */
  {
    id: 'math-01',
    title: 'Statistiques descriptives',
    description: 'Moyenne, médiane, écart-type, distributions et représentations graphiques. Analysez vos données en toute confiance.',
    kind: 'course', level: 'débutant', duration: '3h',
    domain: 'maths', tags: ['statistiques', 'données', 'analyse'],
    kaUrl: 'https://fr.khanacademy.org/math/statistics-probability/summarizing-quantitative-data',
  },
  {
    id: 'math-02',
    title: 'Probabilités appliquées',
    description: 'Calcul des probabilités, lois de probabilité, espérance et variance. Applications concrètes en gestion du risque.',
    kind: 'course', level: 'intermédiaire', duration: '4h',
    domain: 'maths', tags: ['probabilités', 'risque', 'statistiques'],
    kaUrl: 'https://fr.khanacademy.org/math/statistics-probability/probability-library',
  },
  {
    id: 'math-03',
    title: 'Inférence statistique',
    description: 'Tests d\'hypothèses, intervalles de confiance, régression linéaire et corrélation. Clés pour l\'analyse professionnelle.',
    kind: 'course', level: 'avancé', duration: '5h',
    domain: 'maths', tags: ['inférence', 'tests', 'régression'],
    kaUrl: 'https://fr.khanacademy.org/math/statistics-probability/significance-tests-one-sample',
  },
  {
    id: 'math-04',
    title: 'Algèbre linéaire — Matrices et vecteurs',
    description: 'Matrices, systèmes d\'équations, transformations linéaires. Fondement essentiel pour l\'IA et le data science.',
    kind: 'course', level: 'avancé', duration: '6h',
    domain: 'maths', tags: ['algèbre', 'matrices', 'data science', 'IA'],
    kaUrl: 'https://fr.khanacademy.org/math/linear-algebra',
  },
  {
    id: 'math-05',
    title: 'Mathématiques financières',
    description: 'Intérêts composés, annuités, actualisation, valeur temps de l\'argent. Indispensable pour la finance.',
    kind: 'course', level: 'intermédiaire', duration: '3h',
    domain: 'maths', tags: ['finance', 'intérêts', 'calcul financier'],
    kaUrl: 'https://fr.khanacademy.org/economics-finance-domain/core-finance/interest-tutorial',
  },
  {
    id: 'math-06',
    title: 'Calcul différentiel et intégral',
    description: 'Dérivées, intégrales, optimisation. Applications en économie, physique et ingénierie.',
    kind: 'course', level: 'avancé', duration: '8h',
    domain: 'maths', tags: ['calcul', 'dérivées', 'optimisation'],
    kaUrl: 'https://fr.khanacademy.org/math/calculus-1',
  },
  {
    id: 'math-07',
    title: 'Arithmétique et logique',
    description: 'Nombres entiers, fractions, pourcentages, proportions. Base solide pour tout raisonnement chiffré.',
    kind: 'course', level: 'débutant', duration: '2h30',
    domain: 'maths', tags: ['arithmétique', 'logique', 'nombres'],
    kaUrl: 'https://fr.khanacademy.org/math/cc-sixth-grade-math',
  },
  {
    id: 'math-08',
    title: 'Géométrie analytique',
    description: 'Vecteurs dans le plan, équations de droites, cercles et coniques. Pour l\'ingénierie et l\'architecture.',
    kind: 'course', level: 'intermédiaire', duration: '4h',
    domain: 'maths', tags: ['géométrie', 'vecteurs', 'équations'],
    kaUrl: 'https://fr.khanacademy.org/math/geometry',
  },
  {
    id: 'math-09',
    title: 'Trigonométrie',
    description: 'Fonctions trigonométriques, cercle unité, identités et équations. Essentiel pour la physique et l\'ingénierie.',
    kind: 'course', level: 'intermédiaire', duration: '3h30',
    domain: 'maths', tags: ['trigonométrie', 'fonctions', 'angles'],
    kaUrl: 'https://fr.khanacademy.org/math/trigonometry',
  },
  {
    id: 'math-10',
    title: 'Analyse — Suites et séries',
    description: 'Suites numériques, convergence, séries, développements limités. Niveau post-bac.',
    kind: 'course', level: 'avancé', duration: '5h',
    domain: 'maths', tags: ['analyse', 'suites', 'séries'],
    kaUrl: 'https://fr.khanacademy.org/math/ap-calculus-bc/bc-series-new',
  },

  /* ════════════ SCIENCES ════════════ */
  {
    id: 'sci-01',
    title: 'Physique — Mécanique classique',
    description: 'Cinématique, dynamique, travail et énergie, conservation. Niveau BTS / Licence 1.',
    kind: 'course', level: 'intermédiaire', duration: '5h',
    domain: 'sciences', tags: ['physique', 'mécanique', 'énergie'],
    kaUrl: 'https://fr.khanacademy.org/science/physics/work-energy-power',
  },
  {
    id: 'sci-02',
    title: 'Électricité et magnétisme',
    description: 'Circuits électriques, loi d\'Ohm, champs magnétiques et induction. Base pour l\'ingénierie.',
    kind: 'course', level: 'intermédiaire', duration: '4h',
    domain: 'sciences', tags: ['électricité', 'circuits', 'ingénierie'],
    kaUrl: 'https://fr.khanacademy.org/science/physics/circuits-topic',
  },
  {
    id: 'sci-03',
    title: 'Chimie — Réactions et stœchiométrie',
    description: 'Réactions chimiques, équilibres, cinétique. Indispensable pour l\'industrie et l\'agro-alimentaire.',
    kind: 'course', level: 'intermédiaire', duration: '4h',
    domain: 'sciences', tags: ['chimie', 'réactions', 'industrie'],
    kaUrl: 'https://fr.khanacademy.org/science/chemistry/chemical-reactions-stoichiome',
  },
  {
    id: 'sci-04',
    title: 'Chimie organique',
    description: 'Structure des molécules organiques, liaisons, réactions fonctionnelles. Pour les biotechnologies et la pharmacie.',
    kind: 'course', level: 'avancé', duration: '5h',
    domain: 'sciences', tags: ['chimie organique', 'molécules', 'pharmacie'],
    kaUrl: 'https://fr.khanacademy.org/science/organic-chemistry',
  },
  {
    id: 'sci-05',
    title: 'Biologie cellulaire et moléculaire',
    description: 'ADN, ARN, protéines, mitose, méiose. Fondements pour les formations en santé et biotechnologies.',
    kind: 'course', level: 'intermédiaire', duration: '5h',
    domain: 'sciences', tags: ['biologie', 'ADN', 'cellules', 'santé'],
    kaUrl: 'https://fr.khanacademy.org/science/ap-biology/gene-expression-and-regulation',
  },
  {
    id: 'sci-06',
    title: 'Thermodynamique',
    description: 'Température, chaleur, énergie thermique, lois de la thermodynamique. Pour l\'énergie et l\'industrie.',
    kind: 'course', level: 'intermédiaire', duration: '3h30',
    domain: 'sciences', tags: ['thermodynamique', 'énergie', 'chaleur'],
    kaUrl: 'https://fr.khanacademy.org/science/physics/thermodynamics',
  },
  {
    id: 'sci-07',
    title: 'Optique et ondes',
    description: 'Lumière, réfraction, diffraction, son, ondes électromagnétiques.',
    kind: 'course', level: 'intermédiaire', duration: '3h',
    domain: 'sciences', tags: ['optique', 'ondes', 'lumière'],
    kaUrl: 'https://fr.khanacademy.org/science/physics/geometric-optics',
  },
  {
    id: 'sci-08',
    title: 'Environnement et écosystèmes',
    description: 'Biomes, chaînes alimentaires, biodiversité, changement climatique. Pour les professionnels de l\'environnement.',
    kind: 'course', level: 'débutant', duration: '2h',
    domain: 'sciences', tags: ['environnement', 'écologie', 'biodiversité'],
    kaUrl: 'https://fr.khanacademy.org/science/biology/ecology/intro-to-ecosystems/a/what-is-an-ecosystem',
  },

  /* ════════════ INFORMATIQUE ════════════ */
  {
    id: 'info-01',
    title: 'Introduction à la programmation',
    description: 'Variables, boucles, fonctions, conditions — les fondamentaux pour démarrer sans expérience préalable.',
    kind: 'course', level: 'débutant', duration: '2h30',
    domain: 'informatique', tags: ['programmation', 'bases', 'algorithmique'],
    kaUrl: 'https://fr.khanacademy.org/computing/computer-programming/programming',
  },
  {
    id: 'info-02',
    title: 'HTML & CSS — Créer des pages web',
    description: 'Structure HTML, mise en forme CSS, responsive design. Construisez vos premières pages web.',
    kind: 'course', level: 'débutant', duration: '4h',
    domain: 'informatique', tags: ['web', 'HTML', 'CSS', 'développement'],
    kaUrl: 'https://fr.khanacademy.org/computing/computer-programming/html-css',
  },
  {
    id: 'info-03',
    title: 'JavaScript — Programmation web interactive',
    description: 'Événements, DOM, fonctions, objets. Rendez vos pages web dynamiques avec JavaScript.',
    kind: 'course', level: 'intermédiaire', duration: '5h',
    domain: 'informatique', tags: ['JavaScript', 'web', 'interactivité'],
    kaUrl: 'https://fr.khanacademy.org/computing/computer-programming/html-css-js',
  },
  {
    id: 'info-04',
    title: 'SQL — Bases de données relationnelles',
    description: 'Requêtes SELECT, JOIN, GROUP BY, sous-requêtes. Maîtrisez SQL pour interroger vos données.',
    kind: 'course', level: 'intermédiaire', duration: '3h30',
    domain: 'informatique', tags: ['SQL', 'bases de données', 'données'],
    kaUrl: 'https://fr.khanacademy.org/computing/computer-programming/sql',
  },
  {
    id: 'info-05',
    title: 'Algorithmes et structures de données',
    description: 'Recherche, tri, récursivité, listes chaînées, arbres. Ce que tout développeur doit savoir.',
    kind: 'course', level: 'intermédiaire', duration: '4h',
    domain: 'informatique', tags: ['algorithmes', 'logique', 'structures'],
    kaUrl: 'https://fr.khanacademy.org/computing/computer-science/algorithms',
  },
  {
    id: 'info-06',
    title: 'Cryptographie et cybersécurité',
    description: 'Chiffrement symétrique et asymétrique, protocoles TLS, hachage. Protégez vos données.',
    kind: 'course', level: 'intermédiaire', duration: '2h',
    domain: 'informatique', tags: ['sécurité', 'cryptographie', 'données'],
    kaUrl: 'https://fr.khanacademy.org/computing/computer-science/cryptography',
  },
  {
    id: 'info-07',
    title: 'Comment fonctionne Internet',
    description: 'DNS, HTTP/S, TCP/IP, routeurs, navigateurs. Comprendre l\'infrastructure numérique moderne.',
    kind: 'video', level: 'débutant', duration: '45 min',
    domain: 'informatique', tags: ['réseaux', 'internet', 'protocoles'],
    youtubeId: 'AEaKrq3SpW8',
    kaUrl: 'https://fr.khanacademy.org/computing/computers-and-internet/xcae6f4a7ff015e7d:the-internet',
  },
  {
    id: 'info-08',
    title: 'Représentation binaire de l\'information',
    description: 'Binaire, hexadécimal, encodages ASCII/Unicode — comment l\'ordinateur stocke tout.',
    kind: 'video', level: 'débutant', duration: '30 min',
    domain: 'informatique', tags: ['binaire', 'numérique', 'fondamentaux'],
    youtubeId: 'Xpk67YzOn5w',
    kaUrl: 'https://fr.khanacademy.org/computing/ap-computer-science-principles/computers-101',
  },
  {
    id: 'info-09',
    title: 'Programmation orientée objet',
    description: 'Classes, héritage, encapsulation, polymorphisme. Concepts POO expliqués avec des exemples concrets.',
    kind: 'course', level: 'avancé', duration: '3h',
    domain: 'informatique', tags: ['POO', 'programmation', 'architecture'],
    kaUrl: 'https://fr.khanacademy.org/computing/computer-programming/programming-natural-simulations',
  },
  {
    id: 'info-10',
    title: 'Sécurité des données et vie privée',
    description: 'RGPD, cookies, droits numériques, bonnes pratiques. Indispensable pour tout professionnel du numérique.',
    kind: 'course', level: 'débutant', duration: '1h30',
    domain: 'informatique', tags: ['RGPD', 'données', 'vie privée', 'sécurité'],
    kaUrl: 'https://fr.khanacademy.org/computing/computers-and-internet/xcae6f4a7ff015e7d:online-data-security',
  },

  /* ════════════ FINANCE & ÉCONOMIE ════════════ */
  {
    id: 'fin-01',
    title: 'Introduction à la comptabilité',
    description: 'Bilan, compte de résultat, flux de trésorerie. Lire et comprendre les états financiers d\'une entreprise.',
    kind: 'course', level: 'débutant', duration: '3h',
    domain: 'finance', tags: ['comptabilité', 'bilan', 'entreprise'],
    kaUrl: 'https://fr.khanacademy.org/economics-finance-domain/core-finance/accounting-and-financial-statements',
  },
  {
    id: 'fin-02',
    title: 'Microéconomie — Offre, demande et marchés',
    description: 'Comportements des consommateurs et entreprises, équilibre de marché, élasticité-prix.',
    kind: 'course', level: 'débutant', duration: '5h',
    domain: 'finance', tags: ['microéconomie', 'offre', 'demande', 'marchés'],
    kaUrl: 'https://fr.khanacademy.org/economics-finance-domain/microeconomics',
  },
  {
    id: 'fin-03',
    title: 'Macroéconomie — PIB, chômage, inflation',
    description: 'Indicateurs macroéconomiques, politiques monétaires et budgétaires, cycles économiques.',
    kind: 'course', level: 'intermédiaire', duration: '5h',
    domain: 'finance', tags: ['macroéconomie', 'PIB', 'politique économique'],
    kaUrl: 'https://fr.khanacademy.org/economics-finance-domain/macroeconomics',
  },
  {
    id: 'fin-04',
    title: 'Marchés financiers et investissement',
    description: 'Actions, obligations, fonds, marchés boursiers, valorisation. Comment fonctionnent les marchés de capitaux.',
    kind: 'course', level: 'intermédiaire', duration: '4h',
    domain: 'finance', tags: ['investissement', 'bourse', 'marchés'],
    kaUrl: 'https://fr.khanacademy.org/economics-finance-domain/core-finance/stock-and-bonds',
  },
  {
    id: 'fin-05',
    title: 'Finance d\'entreprise',
    description: 'Valorisation, coût du capital, analyse de projets, décisions de financement. Niveau Master Finance.',
    kind: 'course', level: 'avancé', duration: '6h',
    domain: 'finance', tags: ['finance', 'valorisation', 'investissement'],
    kaUrl: 'https://fr.khanacademy.org/economics-finance-domain/core-finance/corporate-finance',
  },
  {
    id: 'fin-06',
    title: 'Systèmes bancaires et création monétaire',
    description: 'Comment les banques créent la monnaie, rôle des banques centrales, politique monétaire.',
    kind: 'course', level: 'intermédiaire', duration: '3h',
    domain: 'finance', tags: ['banque', 'monnaie', 'crédit'],
    kaUrl: 'https://fr.khanacademy.org/economics-finance-domain/core-finance/money-and-banking',
  },
  {
    id: 'fin-07',
    title: 'Analyse financière — Ratios et performance',
    description: 'Ratios de liquidité, rentabilité, solvabilité. Lire et interpréter les performances d\'une entreprise.',
    kind: 'course', level: 'avancé', duration: '4h',
    domain: 'finance', tags: ['analyse', 'ratios', 'états financiers'],
    kaUrl: 'https://fr.khanacademy.org/economics-finance-domain/core-finance/accounting-and-financial-statements/financial-ratios-tutorial',
  },
  {
    id: 'fin-08',
    title: 'Commerce international et mondialisation',
    description: 'Avantages comparatifs, balance des paiements, impact de la mondialisation sur les économies africaines.',
    kind: 'course', level: 'intermédiaire', duration: '3h',
    domain: 'finance', tags: ['commerce', 'international', 'mondialisation', 'Afrique'],
    kaUrl: 'https://fr.khanacademy.org/economics-finance-domain/macroeconomics/international-trade-topic',
  },

  /* ════════════ HUMANITÉS ════════════ */
  {
    id: 'hum-01',
    title: '2ème Guerre Mondiale et ses conséquences',
    description: 'Bilan, Shoah, ONU, Plan Marshall, naissance de la Guerre Froide. Cours Pass Bac.',
    kind: 'course', level: 'débutant', duration: '2h',
    domain: 'humanites', tags: ['histoire', 'WW2', 'géopolitique', 'bac'],
    kaUrl: 'https://fr.khanacademy.org/humanities/world-history/euro-hist',
  },
  {
    id: 'hum-02',
    title: 'La Guerre Froide — Relations Est/Ouest',
    description: 'Doctrine Truman, Blocus de Berlin, crise de Cuba, chute du Mur. De 1947 à 1991.',
    kind: 'course', level: 'débutant', duration: '2h',
    domain: 'humanites', tags: ['histoire', 'guerre froide', 'géopolitique', 'bac'],
    kaUrl: 'https://fr.khanacademy.org/humanities/world-history/cold-war',
  },
  {
    id: 'hum-03',
    title: 'Décolonisation — Afrique et Asie',
    description: 'Causes, formes et acteurs de la décolonisation. Bandung, Gandhi, Nkrumah, Senghor.',
    kind: 'course', level: 'débutant', duration: '2h',
    domain: 'humanites', tags: ['histoire', 'décolonisation', 'Afrique', 'bac'],
    kaUrl: 'https://fr.khanacademy.org/humanities/world-history/euro-hist/age-of-exploration-and-conquest',
  },
  {
    id: 'hum-04',
    title: 'La mondialisation contemporaine',
    description: 'Échanges, migrations, multinationales, inégalités mondiales. Géographie terminale.',
    kind: 'course', level: 'intermédiaire', duration: '2h30',
    domain: 'humanites', tags: ['géographie', 'mondialisation', 'économie', 'bac'],
    kaUrl: 'https://fr.khanacademy.org/humanities/world-history/1600s-1800s',
  },
  {
    id: 'hum-05',
    title: 'Histoire de l\'Afrique subsaharienne',
    description: 'Grands empires, colonisation, indépendances, défis contemporains — perspective africaine.',
    kind: 'course', level: 'intermédiaire', duration: '3h',
    domain: 'humanites', tags: ['Afrique', 'histoire', 'identité'],
    kaUrl: 'https://fr.khanacademy.org/humanities/world-history/world-history-beginnings',
  },
  {
    id: 'hum-06',
    title: 'Philosophie — Grandes doctrines',
    description: 'Platon, Descartes, Kant, Sartre. Les grandes questions philosophiques expliquées simplement.',
    kind: 'course', level: 'débutant', duration: '2h',
    domain: 'humanites', tags: ['philosophie', 'pensée', 'bac'],
    kaUrl: 'https://fr.khanacademy.org/humanities/world-history/ancient-medieval',
  },

  /* ════════════ SANTÉ & MÉDECINE ════════════ */
  {
    id: 'san-01',
    title: 'Anatomie et physiologie humaine',
    description: 'Systèmes cardiovasculaire, respiratoire, digestif, nerveux. Base pour les formations en santé.',
    kind: 'course', level: 'intermédiaire', duration: '5h',
    domain: 'sante', tags: ['anatomie', 'physiologie', 'santé'],
    kaUrl: 'https://fr.khanacademy.org/science/health-and-medicine/human-anatomy-and-physiology',
  },
  {
    id: 'san-02',
    title: 'Biochimie médicale',
    description: 'Métabolisme, enzymes, hormones, biologie cellulaire appliquée à la médecine.',
    kind: 'course', level: 'avancé', duration: '5h',
    domain: 'sante', tags: ['biochimie', 'métabolisme', 'médecine'],
    kaUrl: 'https://fr.khanacademy.org/science/health-and-medicine/executive-systems-of-the-body',
  },
  {
    id: 'san-03',
    title: 'Nutrition et diététique',
    description: 'Macronutriments, micronutriments, besoins énergétiques, régimes alimentaires. Science et pratique.',
    kind: 'course', level: 'débutant', duration: '3h',
    domain: 'sante', tags: ['nutrition', 'santé', 'alimentation'],
    kaUrl: 'https://fr.khanacademy.org/science/health-and-medicine/human-anatomy-and-physiology/gastrointestinal-system-introduction',
  },
  {
    id: 'san-04',
    title: 'Immunologie et maladies infectieuses',
    description: 'Système immunitaire, anticorps, vaccins, bactéries et virus. Essentiel pour les soignants.',
    kind: 'course', level: 'intermédiaire', duration: '4h',
    domain: 'sante', tags: ['immunologie', 'maladies', 'vaccins'],
    kaUrl: 'https://fr.khanacademy.org/science/health-and-medicine/infectious-diseases',
  },
  {
    id: 'san-05',
    title: 'Neurologie et neurosciences',
    description: 'Cerveau, neurones, synapses, troubles neurologiques. Comprendre le système nerveux.',
    kind: 'course', level: 'avancé', duration: '4h',
    domain: 'sante', tags: ['neurosciences', 'cerveau', 'neurologie'],
    kaUrl: 'https://fr.khanacademy.org/science/health-and-medicine/nervous-system-and-sensory-infor',
  },
  {
    id: 'san-06',
    title: 'Santé publique et épidémiologie',
    description: 'Indicateurs de santé, surveillance épidémique, prévention. Pour les professionnels de santé.',
    kind: 'course', level: 'intermédiaire', duration: '3h',
    domain: 'sante', tags: ['santé publique', 'épidémiologie', 'prévention'],
    kaUrl: 'https://fr.khanacademy.org/science/health-and-medicine',
  },
]

/* ── Helpers ───────────────────────────────────────────────────────────────── */

export function getModulesByDomain(domainId: string): KAModule[] {
  return KA_MODULES.filter(m => m.domain === domainId)
}

export function searchModules(query: string): KAModule[] {
  const q = query.toLowerCase().trim()
  if (!q) return KA_MODULES
  return KA_MODULES.filter(m =>
    m.title.toLowerCase().includes(q) ||
    m.description.toLowerCase().includes(q) ||
    m.tags.some(t => t.toLowerCase().includes(q))
  )
}

export function getDomainWithCount(): (KADomain & { count: number })[] {
  return KA_DOMAINS.map(d => ({
    ...d,
    count: KA_MODULES.filter(m => m.domain === d.id).length,
  }))
}

export const LEVEL_META: Record<KALevel, { label: string; color: string; bg: string }> = {
  débutant:      { label: 'Débutant',      color: '#12A596', bg: '#E6FBF8' },
  intermédiaire: { label: 'Intermédiaire', color: '#C28705', bg: '#FFF7E2' },
  avancé:        { label: 'Avancé',        color: '#C94908', bg: '#FFF1E8' },
}

export const KIND_META: Record<KAKind, { label: string; icon: string }> = {
  video:    { label: 'Vidéo',    icon: '▶' },
  exercise: { label: 'Exercice', icon: '✏️' },
  course:   { label: 'Parcours', icon: '📚' },
}
