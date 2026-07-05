export type BlogCategory = 'formateur-augmente' | 'veille-ia-education'

export interface BlogPost {
  slug: string
  category: BlogCategory
  title: string
  excerpt: string
  date: string // ISO date
  readingTime: string
  author: string
  tags: string[]
  paragraphs: string[]
  sources?: { label: string; url: string }[]
}

export const CATEGORY_LABELS: Record<BlogCategory, string> = {
  'formateur-augmente': 'Formateur augmenté',
  'veille-ia-education': 'Veille IA & Éducation',
}

export const CATEGORY_DESCRIPTIONS: Record<BlogCategory, string> = {
  'formateur-augmente': "Méthodes, outils et retours d'expérience pour intégrer l'IA dans votre pratique de formateur, sans perdre votre posture pédagogique. Publié tous les quinze jours.",
  'veille-ia-education': "L'actualité de l'intelligence artificielle appliquée à l'éducation et à la formation, sélectionnée et commentée chaque semaine.",
}

// Articles triés du plus récent au plus ancien.
export const blogPosts: BlogPost[] = [
  {
    slug: 'devenir-formateur-augmente-sans-perdre-sa-posture',
    category: 'formateur-augmente',
    title: 'Devenir un formateur augmenté sans perdre sa posture pédagogique',
    excerpt: "L'IA générative peut préparer un cours, corriger des copies ou générer un quiz en quelques secondes. Le vrai enjeu n'est pas l'outil, c'est la posture que vous gardez face à lui.",
    date: '2026-07-05',
    readingTime: '6 min',
    author: 'Rédaction EtagIA',
    tags: ['posture pédagogique', 'IA générative', 'formation de formateurs'],
    paragraphs: [
      "« Formateur augmenté » n'est pas un slogan marketing : c'est une description assez précise de ce qui se passe déjà dans la majorité des organismes de formation. L'IA générative prépare des supports, reformule des consignes, génère des quiz, résume des ressources — et le formateur, lui, reste le seul capable de donner du sens à tout cela pour un groupe précis, à un moment précis.",
      "Le risque n'est pas que l'IA remplace le formateur : c'est que le formateur, séduit par la vitesse d'exécution, délègue aussi le jugement pédagogique. Un cours généré en cinq minutes reste un cours à valider, contextualiser et souvent réécrire à moitié pour qu'il colle réellement au niveau du groupe, à ses objectifs professionnels et à la culture de l'entreprise commanditaire.",
      "Trois réflexes permettent de garder la main. Premièrement, utiliser l'IA en amont (préparation, brouillons, variantes d'exercices) plutôt qu'en direct devant les apprenants, pour ne jamais improviser une réponse non vérifiée. Deuxièmement, toujours relire une production IA avec la question : « est-ce que je pourrais défendre ce contenu devant un expert du métier ? ». Troisièmement, documenter ses prompts et ses choix, pour transformer une astuce isolée en méthode reproductible et transmissible à d'autres formateurs de l'équipe.",
      "C'est exactement l'angle du Manuel du formateur augmenté : non pas une liste d'outils qui seront obsolètes dans six mois, mais une méthode pour décider quand déléguer à l'IA, quand reprendre la main, et comment transformer ce nouvel équilibre en avantage pédagogique durable plutôt qu'en dépendance à un outil.",
      "Si vous formez vous-même des formateurs, ou si vous pilotez une équipe pédagogique, la question à vous poser cette semaine n'est pas « quel outil IA adopter » mais « quelle partie de ma valeur ajoutée dois-je protéger absolument, quel que soit l'outil utilisé ». C'est cette clarté-là qui distingue un formateur augmenté d'un formateur simplement assisté.",
    ],
  },
  {
    slug: '5-usages-ia-preparer-cours-deux-fois-moins-de-temps',
    category: 'formateur-augmente',
    title: "5 usages concrets de l'IA pour préparer un cours en deux fois moins de temps",
    excerpt: "Générer un plan de séance, varier les exercices, produire des études de cas réalistes : cinq usages testés qui font gagner du temps sans sacrifier la qualité pédagogique.",
    date: '2026-06-20',
    readingTime: '5 min',
    author: 'Rédaction EtagIA',
    tags: ['productivité', 'ingénierie pédagogique', 'IA générative'],
    paragraphs: [
      "La préparation pédagogique reste, pour la plupart des formateurs, la tâche la plus chronophage et la moins valorisée du métier : structurer un plan, imaginer des exercices variés, anticiper les questions des apprenants. C'est précisément le terrain où l'IA générative apporte le gain de temps le plus mesurable, à condition de l'utiliser sur des tâches bien délimitées.",
      "Premier usage : générer trois variantes d'un plan de séance à partir d'un objectif pédagogique donné, puis composer le meilleur plan à partir des trois. Deuxième usage : transformer un même exercice en plusieurs niveaux de difficulté, pour différencier sans tout réécrire à la main. Troisième usage : produire des études de cas ancrées dans un secteur précis (banque, santé, distribution) pour rendre un contenu générique immédiatement pertinent pour un groupe donné.",
      "Quatrième usage : générer des questions de relance imprévues pour préparer les débats ou les mises en situation, afin de ne jamais être pris au dépourvu. Cinquième usage : produire un premier jet de grille d'évaluation critériée, que le formateur affine ensuite selon ses propres exigences de qualité.",
      "Le point commun de ces cinq usages : l'IA produit un brouillon rapide, jamais un livrable final. Le temps gagné sur la mise en forme est réinvesti dans ce qui ne s'automatise pas — l'animation, la lecture du groupe, l'ajustement en temps réel. C'est cette discipline de relecture systématique qui est développée pas à pas dans le Manuel du formateur augmenté, avec des gabarits de prompts réutilisables pour chacun de ces cas d'usage.",
    ],
  },
  {
    slug: 'formateur-augmente-ce-que-change-vraiment-ia',
    category: 'formateur-augmente',
    title: "Le formateur augmenté : ce que change vraiment l'IA dans le métier de formateur",
    excerpt: "Au-delà du buzz, trois transformations concrètes du métier de formateur : la préparation, l'individualisation du suivi et la production de ressources.",
    date: '2026-06-05',
    readingTime: '5 min',
    author: 'Rédaction EtagIA',
    tags: ['transformation du métier', 'IA générative', 'pédagogie'],
    paragraphs: [
      "Depuis deux ans, l'expression « formateur augmenté » circule dans tous les organismes de formation, souvent sans définition claire. Concrètement, trois dimensions du métier sont transformées en profondeur par l'IA générative, et il est utile de les distinguer pour ne pas tout mélanger.",
      "La première est la préparation : conception de supports, de scénarios pédagogiques et d'évaluations. C'est le champ où les gains de temps sont les plus immédiats, mais aussi celui où la vigilance sur la qualité doit rester la plus forte, car un contenu mal vérifié se propage vite à tout un groupe d'apprenants.",
      "La deuxième dimension est le suivi individualisé : repérer plus vite un apprenant en difficulté, adapter un parcours, proposer des ressources complémentaires ciblées. L'IA ne remplace pas la relation humaine du formateur, mais elle peut signaler des signaux faibles (retard, décrochage, incompréhension récurrente) qu'un formateur suivant plusieurs groupes en parallèle n'a pas toujours le temps de détecter seul.",
      "La troisième dimension, plus récente, est la production de ressources à grande échelle : décliner un même contenu en plusieurs formats (vidéo, fiche, quiz, podcast) pour toucher des profils d'apprenants différents. C'est un changement d'échelle plus qu'un changement de nature du métier.",
      "Le Manuel du formateur augmenté aborde ces trois dimensions avec un même fil conducteur : l'IA change la manière de faire, elle ne change pas ce pour quoi les apprenants ont besoin d'un formateur. Comprendre cette frontière est le point de départ de toute vraie montée en compétence sur le sujet.",
    ],
  },
  {
    slug: 'veille-ia-education-semaine-du-5-juillet-2026',
    category: 'veille-ia-education',
    title: 'Veille IA & Éducation — semaine du 5 juillet 2026',
    excerpt: "Stratégie européenne 2026-2030, formation CPF sur l'IA éducative disponible dès le 10 juillet, et débat sur l'enseignement de l'IA au lycée : le tour d'horizon de la semaine.",
    date: '2026-07-05',
    readingTime: '4 min',
    author: 'Veille EtagIA',
    tags: ['Europe', 'CPF', 'lycée', 'politiques éducatives'],
    paragraphs: [
      "La feuille de route 2026-2030 du Conseil européen pour l'éducation et la formation intègre désormais l'intelligence artificielle comme un axe structurant, avec un objectif chiffré : au moins 32 % des étudiants de l'enseignement supérieur inscrits dans une filière STIM d'ici 2030. Un signal fort envoyé aux organismes de formation, qui devront démontrer comment leurs parcours contribuent à cet objectif.",
      "En France, une formation dédiée aux usages de l'IA en contexte éducatif devient éligible au Compte Personnel de Formation (CPF) à partir du 10 juillet 2026. C'est une étape importante pour la montée en compétence des équipes pédagogiques, jusqu'ici souvent livrées à elles-mêmes sur ces sujets, et une opportunité concrète pour les formateurs qui veulent professionnaliser leur pratique de l'IA plutôt que d'empiler des astuces glanées au fil de l'eau.",
      "Le débat sur l'enseignement de l'IA au lycée continue d'avancer : l'intelligence artificielle sera enseignée dans les lycées français à partir de la rentrée 2027, mais la Société informatique de France exprime des doutes sur la manière dont ces cours seront construits et sur la formation réelle des enseignants qui les porteront. Un rappel utile : donner un cours sur l'IA ne s'improvise pas plus qu'un cours sur n'importe quelle autre discipline technique.",
      "Enfin, un rapport parlementaire porté par la députée Céline Calvez propose d'autoriser l'usage pédagogique de l'IA générative dès la 6e, voire à l'école élémentaire, alors qu'il est aujourd'hui limité aux collégiens à partir de la 4e. Le débat qui s'ouvre — à quel âge, avec quel encadrement — concerne directement tous les formateurs qui interviennent sur des publics jeunes ou en insertion.",
    ],
    sources: [
      { label: "L'UE grave l'IA dans sa stratégie éducation-formation", url: 'https://www.silicon.fr/emploi-formation-1373/ue-ia-formation-education-228137' },
      { label: 'Cadre d\'usage de l\'IA en éducation — Ministère de l\'Éducation nationale', url: 'https://www.education.gouv.fr/cadre-d-usage-de-l-ia-en-education-450647' },
      { label: 'La Société informatique de France doute des cours sur l\'IA dans les lycées', url: 'https://www.lemondeinformatique.fr/actualites/lire-la-societe-informatique-de-france-doute-des-cours-sur-l-ia-dans-les-lycees-100643.html' },
      { label: 'IA et éducation : le rapport parlementaire de Céline Calvez', url: 'https://lcp.fr/actualites/ia-et-education-dans-un-rapport-parlementaire-la-deputee-celine-calvez-preconise-une' },
    ],
  },
  {
    slug: 'veille-ia-education-semaine-du-29-juin-2026',
    category: 'veille-ia-education',
    title: 'Veille IA & Éducation — semaine du 29 juin 2026',
    excerpt: "Cadre d'usage ministériel de l'IA en éducation, montée des diplômes universitaires spécialisés, et prudence persistante des enseignants face aux outils génératifs.",
    date: '2026-06-29',
    readingTime: '4 min',
    author: 'Veille EtagIA',
    tags: ['cadre réglementaire', 'enseignement supérieur', 'adoption'],
    paragraphs: [
      "Le ministère de l'Éducation nationale a précisé son cadre d'usage de l'IA en éducation, qui distingue clairement les usages autorisés pour les enseignants (préparation, différenciation, évaluation) de ceux encore restreints pour les élèves. Ce cadre sert de référence à de nombreux organismes de formation professionnelle, qui s'en inspirent pour bâtir leurs propres chartes internes.",
      "Du côté de l'enseignement supérieur, l'offre de diplômes universitaires spécialisés continue de s'étoffer : plusieurs INSPÉ proposent désormais un DU « Intelligences artificielles en éducation », signe que la formation des formateurs sur ces sujets se structure enfin au-delà des webinaires ponctuels et des tutoriels isolés.",
      "Sur le terrain, la prudence reste de mise. De nombreux formateurs et enseignants continuent de tester les outils génératifs de manière informelle, sans méthode ni cadre partagé au sein de leur organisme — ce qui produit des usages très hétérogènes d'une équipe à l'autre, et parfois des résultats décevants faute de maîtrise des bases du prompt et de la vérification des contenus produits.",
    ],
    sources: [
      { label: "Cadre d'usage de l'IA en éducation — Ministère de l'Éducation nationale", url: 'https://www.education.gouv.fr/cadre-d-usage-de-l-ia-en-education-450647' },
      { label: 'DU Intelligences Artificielles en éducation — INSPÉ de Bretagne', url: 'https://www.inspe-bretagne.fr/diplome-universitaire-ia-en-education-2026-2027' },
    ],
  },
  {
    slug: 'veille-ia-education-semaine-du-22-juin-2026',
    category: 'veille-ia-education',
    title: 'Veille IA & Éducation — semaine du 22 juin 2026',
    excerpt: "Faut-il encore faire des études supérieures à l'heure de l'IA ? Le débat qui traverse l'enseignement supérieur, et ce qu'il signifie pour les organismes de formation continue.",
    date: '2026-06-22',
    readingTime: '3 min',
    author: 'Veille EtagIA',
    tags: ['enseignement supérieur', 'employabilité', 'compétences'],
    paragraphs: [
      "Un débat de fond traverse l'enseignement supérieur en 2026 : à l'heure où l'IA générative automatise une partie des tâches auparavant réservées aux jeunes diplômés, la valeur d'un cursus long est de plus en plus questionnée par les étudiants comme par les employeurs. Plusieurs analyses convergent vers une même conclusion : ce n'est pas le diplôme qui perd de la valeur, c'est le contenu figé et non actualisé qui devient rapidement obsolète.",
      "Pour les organismes de formation professionnelle, ce débat est une opportunité directe : la formation continue, courte, actualisable et centrée sur des compétences vérifiables devient un complément — voire une alternative — de plus en plus légitime face à des cursus longs perçus comme lents à s'adapter aux usages réels de l'IA en entreprise.",
      "Le point de vigilance pour les formateurs : construire des parcours qui restent pertinents douze à vingt-quatre mois après leur conception, ce qui suppose une veille active sur les usages métiers de l'IA et une capacité à réviser régulièrement le contenu des formations, plutôt que de les figer une fois pour toutes.",
    ],
    sources: [
      { label: 'Faire des études supérieures en 2026 : est-ce toujours pertinent à l\'heure de l\'IA ? — Institut F2I', url: 'https://www.institut-f2i.fr/intelligence-artificielle-et-etudes-superieures/' },
    ],
  },
  {
    slug: 'veille-ia-education-semaine-du-15-juin-2026',
    category: 'veille-ia-education',
    title: 'Veille IA & Éducation — semaine du 15 juin 2026',
    excerpt: "Personnalisation des parcours par l'IA : les bénéfices attendus, mais aussi les questions de valeurs que soulèvent les algorithmes d'apprentissage adaptatif.",
    date: '2026-06-15',
    readingTime: '3 min',
    author: 'Veille EtagIA',
    tags: ['apprentissage adaptatif', 'éthique', 'personnalisation'],
    paragraphs: [
      "La personnalisation des parcours d'apprentissage par l'IA continue de s'imposer comme l'un des cas d'usage les plus matures de l'IA en éducation : ajustement du rythme, des exercices et du niveau de difficulté selon la progression réelle de chaque apprenant. Les premiers retours d'expérience à grande échelle confirment un effet positif sur l'engagement, en particulier pour les apprenants en difficulté ou en reprise d'études.",
      "Mais des voix expertes rappellent que ces algorithmes d'apprentissage adaptatif ne sont jamais neutres : ils reflètent des choix — souvent implicites — sur ce qui compte comme « réussite », sur le rythme jugé normal, sur les erreurs qui méritent d'être corrigées en priorité. Pour un formateur, cela signifie qu'un outil adaptatif ne dispense jamais d'un regard critique sur les recommandations qu'il produit pour chaque apprenant.",
      "Retenir cette semaine : la personnalisation par l'IA est un formidable outil de repérage, pas un pilote automatique. Le rôle du formateur reste d'interpréter les signaux fournis par l'outil à la lumière de ce qu'il connaît réellement de son groupe.",
    ],
    sources: [
      { label: "Liaison directe entre l'intelligence artificielle et la personnalisation du parcours d'apprentissage", url: 'https://www.smhec.org/intelligence-artificielle-education/' },
    ],
  },
]

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug)
}

export function getPostsByCategory(category?: BlogCategory): BlogPost[] {
  if (!category) return blogPosts
  return blogPosts.filter((post) => post.category === category)
}
