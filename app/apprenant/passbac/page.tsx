'use client'

import { useState } from 'react'

type Tab = 'cours' | 'fiches' | 'flashcards' | 'quiz' | 'examens' | 'conseils'
type Subject = 'maths' | 'physique' | 'svt' | 'francais' | 'philosophie' | 'histoire' | 'geographie' | 'anglais'

interface Chapter {
  id: string
  title: string
  summary: string
  keyPoints: string[]
  fiche?: string
}

interface Flashcard {
  question: string
  answer: string
}

interface QuizQuestion {
  question: string
  options: string[]
  correct: number
  explanation: string
}

interface ExamSubject {
  subject: string
  duration: string
  questions: string[]
}

const curriculum: Record<Subject, { label: string; icon: string; color: string; chapters: Chapter[]; flashcards: Flashcard[]; quiz: QuizQuestion[] }> = {
  histoire: {
    label: 'Histoire', icon: '📜', color: '#C0392B',
    chapters: [
      { id: 'h1', title: 'Conséquences de la Seconde Guerre Mondiale',
        summary: 'La 2GM (1939–1945) a profondément reconfiguré le monde : des millions de morts, destruction des économies européennes, et émergence de deux superpuissances (USA et URSS). Elle engendre la création de l\'ONU (1945) pour garantir la paix et les droits de l\'homme.',
        keyPoints: ['Bilan humain : 60 millions de morts dont 40 millions de civils','Plan Marshall (1947) : aide américaine à la reconstruction européenne','Création de l\'ONU le 26 juin 1945 à San Francisco','Procès de Nuremberg (1945–46) : crimes contre l\'humanité','Bipolarisation du monde autour des USA et de l\'URSS'],
        fiche: 'FICHE MÉMO — 2GM\n\n• Début : 1er sept. 1939 (invasion de la Pologne)\n• Fin Europe : 8 mai 1945 | Fin Pacifique : 2 sept. 1945\n• Shoah : 6 millions de Juifs exterminés\n• ONU créée : 26 juin 1945\n• Plan Marshall : 1947, 12 milliards $\n• Début Guerre Froide : 1947' },
      { id: 'h2', title: 'La Guerre Froide : Relations Est/Ouest',
        summary: 'La Guerre Froide (1947–1991) oppose les blocs occidental (USA, OTAN) et oriental (URSS, Pacte de Varsovie) sans affrontement direct. Elle se manifeste par des crises majeures, la course aux armements et la rivalité idéologique.',
        keyPoints: ['Doctrine Truman (1947) et Plan Marshall : endiguement du communisme','Blocus de Berlin (1948–49) et pont aérien américain','Guerre de Corée (1950–53) : première guerre par procuration','Crise des missiles de Cuba (octobre 1962) : point culminant','Chute du Mur de Berlin : 9 novembre 1989','Dissolution de l\'URSS : 25 décembre 1991'],
        fiche: 'FICHE MÉMO — GUERRE FROIDE\n\n• 1947 : Doctrine Truman + Plan Marshall\n• 1949 : OTAN côté Ouest / Pacte de Varsovie 1955\n• 1948–49 : Blocus de Berlin\n• 1950–53 : Guerre de Corée\n• 1962 : Crise missiles Cuba (13 jours)\n• 1989 : Chute du Mur\n• 1991 : Fin de l\'URSS' },
      { id: 'h3', title: 'La Chine de 1945 à 1990',
        summary: 'Après la victoire des communistes de Mao Zedong (1949), la Chine populaire engage de grandes réformes : Grand Bond en Avant (1958–62), Révolution culturelle (1966–76), puis ouverture économique sous Deng Xiaoping (1978).',
        keyPoints: ['Proclamation de la RPC le 1er octobre 1949 par Mao Zedong','Grand Bond en Avant (1958–62) : collectivisation forcée, famines','Révolution culturelle (1966–76) : persécution des intellectuels','Mort de Mao : septembre 1976','Deng Xiaoping : "Quatre Modernisations" et économie de marché','Tiananmen (juin 1989) : répression du mouvement démocratique'] },
      { id: 'h4', title: 'La Décolonisation : causes et formes',
        summary: 'La décolonisation (1945–1975) est le processus par lequel les peuples colonisés accèdent à l\'indépendance. Elle résulte de l\'affaiblissement des métropoles, l\'essor des nationalismes, le rôle de l\'ONU et de la Guerre Froide.',
        keyPoints: ['Causes : affaiblissement de l\'Europe, nationalisme, ONU, Guerre Froide','Deux formes : pacifique (Gold Coast/Ghana 1957) ou armée (Algérie)','Conférence de Bandung (1955) : naissance du Tiers-Monde','Inde (1947) : Gandhi et la non-violence','Algérie (1954–1962) : guerre de libération nationale (FLN)','Sénégal : indépendance le 4 avril 1960'] },
      { id: 'h5', title: 'Décolonisation en Afrique noire',
        summary: 'L\'Afrique noire accède massivement à l\'indépendance en 1960 ("l\'Année de l\'Afrique"). Kwame Nkrumah au Ghana (1957), Sékou Touré en Guinée (1958) et Senghor au Sénégal (1960) incarnent cette génération.',
        keyPoints: ['Gold Coast → Ghana : 6 mars 1957, Kwame Nkrumah','Guinée Conakry : 2 octobre 1958, Sékou Touré, seul "Non" au référendum','"L\'Année de l\'Afrique" : 17 indépendances en 1960','AOF et AEF : dissolution des fédérations coloniales','Sénégal : 4 avril 1960, Léopold Sédar Senghor','Guinée-Bissau et Angola : lutte armée (PAIGC, MPLA)'] },
      { id: 'h6', title: 'Civilisation Négro-Africaine',
        summary: 'Les civilisations négro-africaines ont développé des structures politiques, artistiques et philosophiques propres. Les grands empires (Ghana, Mali, Songhaï) illustrent la richesse de ces civilisations avant et pendant la période coloniale.',
        keyPoints: ['Empire du Ghana (VIIIe–XIe s.) : premier grand empire ouest-africain','Empire du Mali (XIIIe–XVe s.) : Soundjata Keïta, Kankou Moussa','Empire Songhaï (XVe–XVIe s.) : Askia Mohammed','Organisation sociale : clans, castes, royautés','Tradition orale : griots, gardiens de la mémoire collective','Art africain : sculptures, masques, bronzes du Bénin'] },
      { id: 'h7', title: 'Civilisation Musulmane',
        summary: 'L\'islam (VIIe s.) naît en Arabie avec le Prophète Mohammed. Il se diffuse rapidement en Asie, Afrique du Nord et Europe. La civilisation islamique contribue massivement aux sciences, mathématiques et philosophie durant l\'Âge d\'or (IXe–XIIIe s.).',
        keyPoints: ['Hégire : 622, point de départ du calendrier musulman','Les 5 piliers : shahada, salat, zakat, sawm, hajj','Expansion : Moyen-Orient, Afrique, Espagne (711), Inde','Âge d\'or : Al-Khawarizmi (algèbre), Ibn Sina (médecine), Ibn Rushd','Unité : Coran en arabe ; Diversité : sunnites/chiites','Islam en Afrique : voie commerciale transsaharienne'] },
    ],
    flashcards: [
      { question: 'Quelle date marque la création de l\'ONU ?', answer: '26 juin 1945, à San Francisco' },
      { question: 'Qu\'est-ce que la Doctrine Truman (1947) ?', answer: 'Politique d\'endiguement du communisme : aide aux pays menacés par l\'URSS' },
      { question: 'Quand tombe le Mur de Berlin ?', answer: '9 novembre 1989' },
      { question: 'Qui proclame la République Populaire de Chine ?', answer: 'Mao Zedong, le 1er octobre 1949' },
      { question: 'Quelle est la date d\'indépendance du Sénégal ?', answer: '4 avril 1960' },
      { question: 'Quelle est la crise la plus dangereuse de la Guerre Froide ?', answer: 'La crise des missiles de Cuba, octobre 1962 (13 jours)' },
      { question: 'Qui est le premier chef d\'état du Ghana indépendant ?', answer: 'Kwame Nkrumah, 1957' },
      { question: 'Qu\'est-ce que la Conférence de Bandung (1955) ?', answer: 'Réunion de 29 pays afro-asiatiques, naissance du mouvement des Non-Alignés' },
    ],
    quiz: [
      { question: 'Quel plan américain aide la reconstruction de l\'Europe après la 2GM ?', options: ['Plan Schuman','Plan Marshall','Plan Truman','Plan Adenauer'], correct: 1, explanation: 'Le Plan Marshall (1947) représente 12 milliards de dollars d\'aide américaine à l\'Europe occidentale pour sa reconstruction économique.' },
      { question: 'En quelle année le Sénégal accède-t-il à l\'indépendance ?', options: ['1957','1958','1960','1962'], correct: 2, explanation: 'Le Sénégal proclame son indépendance le 4 avril 1960, sous la présidence de Léopold Sédar Senghor.' },
      { question: 'Quelle est la "Révolution Culturelle" en Chine ?', options: ['Modernisation économique de Deng','Mouvement de collectivisation forcée','Campagne de persécution des intellectuels lancée par Mao','La proclamation de la RPC'], correct: 2, explanation: 'La Révolution Culturelle (1966–76) est une campagne de Mao visant à purger les opposants et les intellectuels.' },
      { question: 'Qui mène l\'Inde à l\'indépendance par la non-violence ?', options: ['Nehru','Gandhi','Jinnah','Ambedkar'], correct: 1, explanation: 'Mahatma Gandhi dirige le mouvement d\'indépendance indien par la désobéissance civile non-violente. L\'Inde devient indépendante le 15 août 1947.' },
    ]
  },
  geographie: {
    label: 'Géographie', icon: '🌍', color: '#27AE60',
    chapters: [
      { id: 'g1', title: 'Le Système-Monde',
        summary: 'Le système-monde désigne l\'organisation hiérarchisée de l\'espace mondial autour de pôles dominants. Les États-Unis, l\'Europe et le Japon forment la "Triade" qui concentre richesse, technologies et flux commerciaux.',
        keyPoints: ['La "Triade" : USA, UE, Japon — centres de la mondialisation','Pays émergents : BRICS (Brésil, Russie, Inde, Chine, Afrique du Sud)','Pays en développement : périphéries du système','FMI et Banque Mondiale : institutions régulatrices','Flux financiers, commerciaux, migratoires et informationnels','Métropolisation : concentration dans les grandes villes mondiales'] },
      { id: 'g2', title: 'L\'Amérique du Nord : USA, Canada, Mexique',
        summary: 'L\'Amérique du Nord est le premier espace économique mondial avec l\'USMCA. Les USA dominent avec un PIB de 25 000 milliards$. Le Canada est riche en ressources naturelles. Le Mexique est un pays émergent avec de fortes inégalités.',
        keyPoints: ['PIB USA : 1er mondial, économie de services et d\'innovation (Silicon Valley)','USMCA : accord de libre-échange USA-Canada-Mexique','Mégalopolis américaine : de Boston à Washington','Canada : 2e plus grand pays au monde, riche en matières premières','Mexique : maquiladoras, inégalités Nord/Sud, émigration','Frontière USA-Mexique : 3 200 km, enjeux migratoires'] },
      { id: 'g3', title: 'L\'Europe et l\'Union Européenne',
        summary: 'L\'UE est une construction originale de coopération politique et économique entre 27 États (après Brexit). Elle représente le plus grand marché intérieur mondial et dispose d\'une monnaie commune (euro) pour 20 pays.',
        keyPoints: ['UE : 27 membres, 450 millions d\'habitants','Zone euro : 20 pays, BCE à Francfort','PAC : Politique Agricole Commune, 1er budget de l\'UE','Schengen : libre circulation des personnes','Brexit : sortie du Royaume-Uni le 31 janvier 2020','Défis : vieillissement, migrations, transition énergétique'] },
      { id: 'g4', title: 'L\'Asie-Pacifique : Japon et Chine',
        summary: 'L\'Asie-Pacifique est le moteur de la croissance mondiale. Le Japon (3e PIB mondial) est pionnier de l\'économie de haute technologie. La Chine (2e PIB, 1er commerce mondial) aspire au leadership mondial.',
        keyPoints: ['Japon : PIB 3e mondial, keiretsu, robotique, automobile','Japon : vieillissement, catastrophes naturelles, dépendance énergétique','Chine : 1,4 milliard hab., "Fabrique du monde", 2e PIB','Routes de la Soie (Belt and Road Initiative) : stratégie d\'influence','Tigres asiatiques : Corée du Sud, Taïwan, Singapour, Hong Kong','Rivalité USA-Chine : guerre commerciale et technologique'] },
      { id: 'g5', title: 'L\'Afrique : défis du développement',
        summary: 'L\'Afrique (1,4 milliard d\'hab.) est le continent le plus jeune. Malgré des ressources naturelles abondantes, elle souffre d\'inégalités, conflits, malnutrition et manque d\'infrastructures.',
        keyPoints: ['IDH faible : 33 des 40 pays les plus pauvres sont africains','Ressources : pétrole (Nigeria, Angola), or, diamants, terres rares','"Paradoxe de l\'abondance" : richesses naturelles, pauvreté persistante','Croissance démographique : 2,5%/an, doublement d\'ici 2050','Urbanisation rapide : Lagos, Kinshasa, Le Caire, Nairobi','CEDEAO, UA : organisations régionales d\'intégration'] },
      { id: 'g6', title: 'Le Sénégal : milieux naturels et économie',
        summary: 'Le Sénégal est situé à l\'extrémité occidentale de l\'Afrique. Son économie repose sur la pêche, l\'agriculture, les services, le tourisme et récemment le pétrole offshore.',
        keyPoints: ['Superficie : 196 722 km² ; Population : ~18 millions (2024)','Zones climatiques : sahélien (Nord), soudanien (Centre), guinéen (Casamance)','Fleuve Sénégal (1 700 km) et Fleuve Gambie : ressources en eau','Agriculture : arachide (bassin arachidier), coton, millet','Pêche : 1ère ressource d\'exportation traditionnelle','Plan Sénégal Émergent (PSE) : vision développement 2035','Pétrole offshore : champs de Grand Tortue Ahmeyim (GTA)'] },
    ],
    flashcards: [
      { question: 'Que désigne la "Triade" dans le système-monde ?', answer: 'Les trois pôles dominants : USA, Union Européenne et Japon' },
      { question: 'Quel est l\'accord de libre-échange en Amérique du Nord ?', answer: 'USMCA (anciennement ALENA), révisé en 2020' },
      { question: 'Combien de membres compte l\'UE après le Brexit ?', answer: '27 membres (le Royaume-Uni est sorti le 31 janvier 2020)' },
      { question: 'Quelle est la superficie du Sénégal ?', answer: '196 722 km²' },
      { question: 'Que sont les BRICS ?', answer: 'Brésil, Russie, Inde, Chine, Afrique du Sud — pays émergents majeurs' },
    ],
    quiz: [
      { question: 'Quel est le premier partenaire commercial mondial ?', options: ['États-Unis','Union Européenne','Chine','Japon'], correct: 2, explanation: 'La Chine est devenue le 1er pays exportateur mondial depuis 2009 et 1er partenaire commercial de nombreux pays.' },
      { question: 'Le Plan Sénégal Émergent (PSE) vise quelle échéance ?', options: ['2020','2025','2030','2035'], correct: 3, explanation: 'Le PSE est la stratégie de développement économique et social du Sénégal avec une vision à l\'horizon 2035.' },
    ]
  },
  philosophie: {
    label: 'Philosophie', icon: '🧠', color: '#8E44AD',
    chapters: [
      { id: 'p1', title: 'Nature et Méthode de la Philosophie',
        summary: 'La philosophie (philo-sophia : "amour de la sagesse") est une activité de la raison qui questionne les fondements de l\'existence, de la connaissance et des valeurs. Elle se distingue de la religion par son exigence de rationalité.',
        keyPoints: ['Étymologie : "amour de la sagesse" (grec ancien)','Interrogation métaphysique : Qu\'est-ce que l\'être ? (ontologie)','Interrogation anthropologique : Qu\'est-ce que l\'homme ?','Interrogation axiologique : Que devons-nous faire ? (éthique)','Méthode : questionnement, argumentation, dialectique','Philosophie africaine : Ubuntu ("je suis parce que nous sommes")'] },
      { id: 'p2', title: 'Nature et Culture',
        summary: 'L\'homme est le seul être qui transforme son environnement par la culture (langage, techniques, institutions). La question de ce passage de la nature à la culture est centrale en philosophie.',
        keyPoints: ['Nature : ce qui est inné, universel, biologique','Culture : tout ce qui est acquis, appris, transmis socialement','Rousseau : l\'homme naturel est bon, la société le corrompt','Lévi-Strauss : la prohibition de l\'inceste marque le passage nature→culture','Freud : la culture repose sur le refoulement des pulsions','Hegel : la culture comme réalisation de la liberté humaine'] },
      { id: 'p3', title: 'L\'Individu et la Société',
        summary: 'L\'individu est-il libre face au groupe ? Aristote, Hobbes, Rousseau et Marx ont chacun apporté des réponses différentes à cette question fondamentale de la philosophie politique.',
        keyPoints: ['Aristote : "l\'homme est un animal politique" — nature sociale','Hobbes : état de nature = "guerre de tous contre tous", nécessité du Léviathan','Rousseau : Contrat Social = accord des volontés pour le bien commun','Tocqueville : dangers du conformisme dans la démocratie','Marx : la société divisée en classes détermine la conscience','Sartre : on se définit par rapport aux autres'] },
      { id: 'p4', title: 'Conscience et Inconscient',
        summary: 'Descartes fonde la certitude sur le "cogito". Freud révolutionne cette vision en révélant l\'inconscient : une part de notre psychisme qui nous échappe mais détermine nos actes.',
        keyPoints: ['Descartes : "Cogito ergo sum" — la conscience comme certitude première','Freud : topiques (inconscient/préconscient/conscient ; ça/moi/surmoi)','Refoulement : désirs refoulés dans l\'inconscient','Rêves, lapsus, actes manqués : voies d\'accès à l\'inconscient','Sartre : mauvaise foi = se mentir à soi-même pour fuir sa liberté'] },
      { id: 'p5', title: 'La Liberté',
        summary: 'La liberté est-elle possible dans un monde déterminé ? Sartre affirme que l\'homme est "condamné à être libre". Pour les déterministes (Spinoza, Marx), la liberté est une illusion.',
        keyPoints: ['Libre arbitre : capacité de choisir indépendamment de toute cause','Sartre : "L\'existence précède l\'essence" — on se crée par nos choix','Spinoza : tout est déterminé, la liberté = connaissance des causes','Kant : liberté morale — agir selon la loi morale qu\'on se donne soi-même','Liberté positive vs négative (Isaiah Berlin)'] },
      { id: 'p6', title: 'L\'État',
        summary: 'L\'État est l\'organisation politique d\'une communauté sur un territoire. Il dispose du monopole de la violence légitime (Weber). Son rôle et ses limites font l\'objet de débats entre libéraux, marxistes et républicains.',
        keyPoints: ['Weber : l\'État = monopole de la violence physique légitime','Trois formes de légitimité : traditionnelle, charismatique, légale-rationnelle','État de droit : pouvoir soumis au droit, protection des libertés','Marx : l\'État = instrument de domination de la classe dominante','Séparation des pouvoirs (Montesquieu) : exécutif, législatif, judiciaire'] },
    ],
    flashcards: [
      { question: 'Qu\'est-ce que le "cogito" de Descartes ?', answer: '"Cogito ergo sum" (Je pense donc je suis) — la conscience de soi comme certitude première' },
      { question: 'Quelle est la définition de l\'inconscient selon Freud ?', answer: 'Part du psychisme inaccessible à la conscience, siège des désirs refoulés' },
      { question: 'Qu\'est-ce que l\'Ubuntu en philosophie africaine ?', answer: '"Je suis parce que nous sommes" — conception communautaire de l\'identité humaine' },
      { question: 'Pour Sartre, pourquoi l\'homme est-il "condamné à être libre" ?', answer: 'Parce que l\'existence précède l\'essence : on n\'a pas de nature préfixée, on se définit par ses actes' },
    ],
    quiz: [
      { question: 'Pour Hobbes, pourquoi les hommes acceptent-ils l\'État ?', options: ['Par amour du bien commun','Pour fuir la guerre de tous contre tous','Pour respecter la loi divine','Pour développer la culture'], correct: 1, explanation: 'Hobbes pense que l\'état de nature est une guerre permanente. Les hommes cèdent leur liberté à un souverain (le Léviathan) pour avoir la sécurité.' },
      { question: 'Quelle formule résume la philosophie de Sartre ?', options: ['"Cogito ergo sum"','"Je suis parce que nous sommes"','"L\'existence précède l\'essence"','"La liberté des uns s\'arrête..."'], correct: 2, explanation: '"L\'existence précède l\'essence" signifie que l\'homme n\'a pas de nature fixée : il existe d\'abord, puis se définit par ses choix.' },
    ]
  },
  maths: {
    label: 'Mathématiques', icon: '📐', color: '#2980B9',
    chapters: [
      { id: 'm1', title: 'Algèbre : Compositions d\'applications',
        summary: 'La composée de f : E → F et g : F → G est l\'application g∘f : E → G définie par (g∘f)(x) = g(f(x)). La composition n\'est pas commutative en général mais est associative.',
        keyPoints: ['Définition : (g∘f)(x) = g(f(x)) pour tout x ∈ E','Non-commutativité : g∘f ≠ f∘g en général','Associativité : (h∘g)∘f = h∘(g∘f)','Application identité : id∘f = f∘id = f','Bijection inverse : si f bijective, f⁻¹∘f = id','Image d\'un ensemble : (g∘f)(A) = g(f(A))'] },
      { id: 'm2', title: 'Factorisation par la méthode de Hörner',
        summary: 'La méthode de Hörner (division synthétique) permet de diviser un polynôme P(x) par (x – a) efficacement, et donc de factoriser quand P(a) = 0.',
        keyPoints: ['Si P(a) = 0, alors (x – a) est un facteur de P(x)','Tableau de Hörner : coefficients de gauche à droite, avec la racine a','Descente de Hörner : multiplication + addition successives','Résultat : P(x) = (x – a) × Q(x) où Q est le quotient','Racines multiples : si P(a) = P\'(a) = 0, (x–a)² est facteur'],
        fiche: 'MÉTHODE DE HÖRNER\n\nExemple : P(x) = 2x³ – 3x² – 11x + 6, a = 3\n\nCoefficients : | 2 | –3 | –11 | 6 |\nHörner (×3)  :     6     9    –6\nRésultat     : | 2 |  3 |  –2 | 0 |\n\nDonc P(x) = (x – 3)(2x² + 3x – 2)' },
      { id: 'm3', title: 'Probabilités',
        summary: 'Les probabilités mesurent la vraisemblance d\'événements aléatoires. Pour une variable aléatoire X discrète, on calcule espérance E(X), variance V(X) et écart-type σ(X). La loi binomiale B(n,p) modélise n expériences de Bernoulli.',
        keyPoints: ['P(A∪B) = P(A) + P(B) – P(A∩B)','Probabilités conditionnelles : P(A|B) = P(A∩B)/P(B)','Indépendance : P(A∩B) = P(A) × P(B)','Espérance E(X) = Σ xᵢ × P(X = xᵢ)','Loi binomiale : P(X=k) = C(n,k) × pᵏ × (1–p)^(n–k)','E(X) = n×p ; V(X) = n×p×(1–p) pour B(n,p)'] },
    ],
    flashcards: [
      { question: 'Que vaut (g∘f)(x) ?', answer: 'g(f(x)) — on applique d\'abord f, puis g sur le résultat' },
      { question: 'Quelle est la condition pour que (x–a) soit un facteur de P(x) ?', answer: 'P(a) = 0 (théorème de factorisation)' },
      { question: 'Formule de l\'espérance E(X) pour une variable discrète ?', answer: 'E(X) = Σ xᵢ × P(X = xᵢ)' },
      { question: 'Quelle est la formule de P(A|B) ?', answer: 'P(A|B) = P(A∩B) / P(B), avec P(B) ≠ 0' },
    ],
    quiz: [
      { question: 'Si P(3) = 0 pour P(x) = x³ – 6x² + 11x – 6, quel est un facteur de P(x) ?', options: ['(x + 3)','(x – 3)','(x – 6)','(x + 6)'], correct: 1, explanation: 'Si P(a) = 0, alors (x – a) est un facteur. Ici P(3) = 27 – 54 + 33 – 6 = 0, donc (x – 3) est un facteur.' },
      { question: 'Dans B(10 ; 0,3), quelle est l\'espérance ?', options: ['3','0,3','7','10'], correct: 0, explanation: 'Pour la loi binomiale B(n, p), E(X) = n × p = 10 × 0,3 = 3.' },
    ]
  },
  physique: {
    label: 'Physique-Chimie', icon: '⚗️', color: '#E67E22',
    chapters: [
      { id: 'sc1', title: 'Énergie Électrique',
        summary: 'L\'énergie électrique peut être produite à partir de sources diverses (thermique, hydraulique, nucléaire, solaire) et transportée sur de longues distances via des réseaux haute tension.',
        keyPoints: ['Énergie électrique : W = U × I × t (joules)','Puissance : P = U × I (watts)','Effet Joule : P = R × I² (dissipation thermique)','Transport HT : diminue les pertes par effet Joule','Alternateur : convertit énergie mécanique → électrique','Centrale hydraulique, thermique, nucléaire, photovoltaïque'] },
      { id: 'sc2', title: 'Énergie Nucléaire',
        summary: 'L\'énergie nucléaire exploite la fission de noyaux lourds (uranium-235) pour produire de la chaleur, puis de l\'électricité. Elle représente ~10% de l\'énergie mondiale.',
        keyPoints: ['Fission : noyau lourd + neutron → 2 noyaux + neutrons + énergie','Réaction en chaîne : contrôlée (réacteur) ou non contrôlée (bombe)','Défaut de masse : Δm = énergie libérée / c² (E = mc²)','Uranium enrichi : combustible des réacteurs à eau pressurisée','Déchets radioactifs : problème de stockage à long terme','Fusion nucléaire : énergie du Soleil, projet ITER'] },
      { id: 'sc3', title: 'Ondes Mécaniques',
        summary: 'Une onde mécanique est une perturbation qui se propage dans un milieu matériel sans transport de matière, mais avec transport d\'énergie.',
        keyPoints: ['Onde transversale : vibration perpendiculaire à la propagation','Onde longitudinale : vibration parallèle à la propagation (son)','Célérité v = λ/T = λ × f','Longueur d\'onde λ : distance entre deux points en phase','Onde sonore : f ∈ [20 Hz ; 20 000 Hz] pour l\'homme','Effet Doppler : décalage de fréquence quand source/récepteur bougent'] },
      { id: 'sc4', title: 'Optique Ondulatoire et Corpusculaire',
        summary: 'La lumière présente une double nature : ondulatoire (diffraction, interférences) et corpusculaire (effet photoélectrique). Cette dualité est au cœur de la physique quantique.',
        keyPoints: ['Diffraction : déviation de la lumière autour d\'un obstacle','Interférences : superposition d\'ondes → franges lumineuses/sombres','Photon : quantum d\'énergie E = h × ν (h = 6,63×10⁻³⁴ J.s)','Effet photoélectrique : lumière éjecte des électrons d\'un métal','Dualité onde-corpuscule : de Broglie λ = h/p'] },
      { id: 'sc5', title: 'Chimie : Plastiques et Textiles',
        summary: 'Les plastiques sont des polymères synthétiques obtenus par polymérisation. Ils ont révolutionné l\'industrie mais posent de graves problèmes environnementaux.',
        keyPoints: ['Polymère : macromolécule formée d\'unités répétitives (monomères)','Polyéthylène (PE) : polyaddition de CH₂=CH₂','Polyester (PET) : polycondensation avec élimination d\'eau','Fibres textiles synthétiques : polyamide (Nylon), polyester','Impact environnemental : microplastiques, recyclage, bioplastiques'] },
      { id: 'sc6', title: 'Chimie : Savons, Lessives et Pollution',
        summary: 'Les savons sont des sels d\'acides gras. Leur structure amphiphile leur permet d\'émulsionner les graisses. La pollution de l\'air et de l\'eau menace les écosystèmes.',
        keyPoints: ['Savon : sel de sodium (dur) ou potassium (mou) d\'acide gras','Structure : R–COO⁻ Na⁺ (tête hydrophile + queue lipophile)','Mécanisme : formation de micelles autour des graisses','Pollution atmosphérique : CO₂, NOₓ, particules fines (PM2.5)','Pollution de l\'eau : nitrates, phosphates, métaux lourds'] },
    ],
    flashcards: [
      { question: 'Formule de l\'énergie libérée dans une réaction nucléaire ?', answer: 'E = Δm × c² (avec c = 3×10⁸ m/s)' },
      { question: 'Relation entre vitesse, fréquence et longueur d\'onde ?', answer: 'v = λ × f (ou v = λ/T)' },
      { question: 'Qu\'est-ce que l\'effet photoélectrique ?', answer: 'Émission d\'électrons par un métal frappé par de la lumière (Einstein, 1905)' },
      { question: 'Quelle est la structure d\'un savon ?', answer: 'Molécule amphiphile : tête hydrophile (COO⁻ Na⁺) + chaîne carbonée hydrophobe' },
    ],
    quiz: [
      { question: 'Quelle est l\'énergie d\'un photon de fréquence ν ?', options: ['E = m×c²','E = h×ν','E = ½mv²','E = U×I×t'], correct: 1, explanation: 'E = h×ν est la relation de Planck (1900). h = 6,63×10⁻³⁴ J.s est la constante de Planck.' },
      { question: 'Qu\'est-ce qu\'un polymère ?', options: ['Un atome lourd','Une macromolécule formée de monomères répétés','Un acide gras','Un sel minéral'], correct: 1, explanation: 'Un polymère est une grande molécule formée par la répétition d\'unités structurales appelées monomères.' },
    ]
  },
  svt: {
    label: 'SVT', icon: '🧬', color: '#16A085',
    chapters: [
      { id: 'svt1', title: 'Système Nerveux Cérébro-Spinal',
        summary: 'Le SNCS coordonne les activités volontaires. Il comprend l\'encéphale (cerveau, cervelet, tronc cérébral) et la moelle épinière, reliés aux organes par des nerfs.',
        keyPoints: ['Neurone : cellule nerveuse (corps cellulaire + axone + dendrites)','Influx nerveux : variation du potentiel membranaire (dépolarisation)','Synapse chimique : libération de neurotransmetteurs','Arc réflexe : récepteur → nerf sensitif → centre → nerf moteur → effecteur','Localisation cérébrale : cortex moteur (frontal), sensitif (pariétal)','Plasticité cérébrale : capacité du cerveau à se réorganiser'] },
      { id: 'svt2', title: 'Activité Cardiaque et Pression Artérielle',
        summary: 'Le cœur est une pompe double assurant la circulation pulmonaire et systémique. La pression artérielle reflète la force exercée par le sang sur les parois vasculaires.',
        keyPoints: ['Fréquence cardiaque normale : 60–80 bpm au repos','Systole : contraction du ventricule ; Diastole : relâchement','PA normale : 120/80 mmHg (systolique/diastolique)','Nœud sinusal : pacemaker naturel du cœur','Régulation nerveuse : sympathique (accélère) et parasympathique (ralentit)','Hypertension : facteur de risque cardiovasculaire majeur'] },
      { id: 'svt3', title: 'Régulation de la Glycémie',
        summary: 'La glycémie est maintenue à 1 g/L par l\'antagonisme insuline/glucagon sécrétés par le pancréas. Le diabète résulte d\'une dysrégulation de ce mécanisme.',
        keyPoints: ['Glycémie normale à jeun : 0,8–1,1 g/L de sang','Hyperglycémie → pancréas sécrète l\'insuline (cellules β)','Hypoglycémie → pancréas sécrète le glucagon (cellules α)','Insuline : favorise la glycogénèse (stockage) et la glycolyse','Glucagon : favorise la glycogénolyse et la néoglucogenèse','Diabète type 1 : absence d\'insuline ; Type 2 : résistance à l\'insuline'] },
      { id: 'svt4', title: 'Immunologie',
        summary: 'Le système immunitaire protège l\'organisme contre les agents pathogènes. L\'immunité innée constitue la première ligne de défense, l\'immunité adaptative produit des anticorps.',
        keyPoints: ['Barrières physiques : peau, muqueuses, cils, sécrétions','Immunité innée : phagocytose, inflammation, NK cells','Antigène : molécule étrangère déclenchant une réponse immune','Lymphocytes B : produisent les anticorps (immunité humorale)','Lymphocytes T cytotoxiques : détruisent les cellules infectées','Vaccin : introduction d\'antigènes pour créer une mémoire immunitaire'] },
      { id: 'svt5', title: 'Reproduction et Hérédité',
        summary: 'La reproduction sexuée implique la méiose et la fécondation. Les caractères héréditaires sont transmis par les chromosomes selon les lois de Mendel.',
        keyPoints: ['Méiose : division réductrice → gamètes haploïdes (n chromosomes)','Humain : 46 chromosomes (23 paires) ; gamètes : 23 chromosomes','Fécondation : fusion des gamètes → zygote diploïde (2n)','1ère loi de Mendel : uniformité des hybrides F1','2e loi de Mendel : ségrégation indépendante des allèles','Hérédité liée au sexe : gènes portés par les chromosomes X ou Y'] },
    ],
    flashcards: [
      { question: 'Quel est le rôle de l\'insuline dans la régulation de la glycémie ?', answer: 'Diminuer la glycémie : favorise la glycogénèse (stockage du glucose en glycogène) et la glycolyse' },
      { question: 'Quelle est la glycémie normale à jeun ?', answer: '0,8 à 1,1 g de glucose par litre de sang' },
      { question: 'Qu\'est-ce qu\'un anticorps ?', answer: 'Immunoglobuline produite par les lymphocytes B, qui reconnaît et neutralise un antigène spécifique' },
      { question: 'Quelle est la différence entre mitose et méiose ?', answer: 'Mitose : 2 cellules filles identiques (2n) ; Méiose : 4 cellules haploïdes (n) pour la reproduction sexuée' },
    ],
    quiz: [
      { question: 'Quelle hormone est sécrétée en réponse à une hyperglycémie ?', options: ['Glucagon','Adrénaline','Insuline','Cortisol'], correct: 2, explanation: 'En cas d\'hyperglycémie, les cellules β du pancréas sécrètent l\'insuline pour ramener la glycémie à la normale.' },
      { question: 'Combien de chromosomes possède un gamète humain ?', options: ['46','23','92','48'], correct: 1, explanation: 'Après la méiose, les gamètes sont haploïdes : ils possèdent 23 chromosomes. La fécondation rétablit 2n = 46.' },
    ]
  },
  francais: {
    label: 'Français', icon: '📚', color: '#C0392B',
    chapters: [
      { id: 'fr1', title: 'Le Surréalisme',
        summary: 'Le surréalisme est un mouvement artistique né vers 1924 avec le Manifeste de Breton. Influencé par Freud, il valorise le rêve, l\'inconscient et l\'automatisme contre la raison bourgeoise.',
        keyPoints: ['Fondateur : André Breton, Manifeste du Surréalisme (1924)','Influences : Freud (inconscient), Rimbaud','Techniques : écriture automatique, collage, cadavre exquis','Auteurs : Apollinaire, Aragon, Éluard, Breton','Surréalisme africain : Aimé Césaire, Senghor','Négritude : courant littéraire revalorisant la culture africaine'] },
      { id: 'fr2', title: 'Apollinaire, Aragon, Éluard, Césaire, Senghor',
        summary: 'Ces poètes illustrent l\'évolution de la modernité poétique française et francophone. Apollinaire inaugure la poésie moderne ; Césaire et Senghor fondent la Négritude.',
        keyPoints: ['Apollinaire : "Alcools" (1913) — rupture typographique, images insolites','Aragon : "Les Yeux d\'Elsa" (1942) — poésie de la Résistance','Éluard : "Liberté" (1942) — anaphore, poème emblématique','Aimé Césaire : "Cahier d\'un retour au pays natal" — cri de la Négritude','Léopold Sédar Senghor : "Chants d\'Ombre", "Hosties Noires" — lyrisme africain','Procédés : anaphore, métaphore, image surréaliste, libre vers'] },
      { id: 'fr3', title: 'Esthétique des Genres Littéraires',
        summary: 'La littérature se décline en trois grands genres : la poésie, le roman et le théâtre. Chaque genre obéit à des codes spécifiques que le candidat doit maîtriser.',
        keyPoints: ['Poésie : versification (alexandrin), figures de style, registre lyrique','Roman : types (réaliste, fantastique, autobiographique)','Théâtre : genres (tragédie, comédie, drame), unités classiques','Tragédie : fatalité, catharsis, héros noble, fin malheureuse','Comédie : personnages ordinaires, dénouement heureux, satire','Drame : mélange des genres (Hugo, XIXe siècle)'] },
      { id: 'fr4', title: 'Dissertation, Commentaire et Synthèse',
        summary: 'La dissertation littéraire consiste à répondre à une question en développant une argumentation structurée. Le commentaire analyse un passage en étudiant le fond et la forme.',
        keyPoints: ['Dissertation : introduction → développement (3 parties) → conclusion','Thèse, antithèse, synthèse : structure dialectique classique','Commentaire : situation du texte → plan → analyse (procédés + effets)','Figures de style : métaphore, comparaison, anaphore, oxymore','Registres : lyrique, épique, comique, tragique, ironique','Synthèse : dégager les convergences et divergences entre documents'] },
    ],
    flashcards: [
      { question: 'Qui fonde le Surréalisme et en quelle année ?', answer: 'André Breton avec le Manifeste du Surréalisme en 1924' },
      { question: 'Qu\'est-ce que la Négritude ?', answer: 'Mouvement littéraire (Césaire, Senghor, Damas) qui revendique et valorise l\'identité et la culture africaine' },
      { question: 'Quel est le titre du recueil d\'Apollinaire publié en 1913 ?', answer: '"Alcools" — œuvre majeure de la modernité poétique française' },
      { question: 'Quelle est la structure de la dissertation dialectique ?', answer: 'Introduction (accroche + problématique + plan) → Thèse → Antithèse → Synthèse → Conclusion' },
    ],
    quiz: [
      { question: 'Quel poète a écrit "Cahier d\'un retour au pays natal" ?', options: ['Senghor','Éluard','Aimé Césaire','Aragon'], correct: 2, explanation: 'Aimé Césaire (1913–2008), poète martiniquais, a écrit cette œuvre fondatrice de la Négritude (1939).' },
      { question: 'Qu\'est-ce que la catharsis dans la tragédie ?', options: ['La morale de la pièce','La purification des passions par la pitié et la crainte','Le dénouement heureux','Le monologue du héros'], correct: 1, explanation: 'Aristote définit la catharsis comme la purification des passions (pitié et crainte) que le spectateur éprouve en regardant la tragédie.' },
    ]
  },
  anglais: {
    label: 'Anglais', icon: '🇬🇧', color: '#1ABC9C',
    chapters: [
      { id: 'an1', title: 'Grammar: Advanced Structures',
        summary: 'At Terminal level, English grammar focuses on complex structures: conditionals, modal verbs, passive constructions, reported speech, and complex sentence building.',
        keyPoints: ['Conditionals: Type 1 (real), Type 2 (hypothetical), Type 3 (impossible/past)','Modal verbs: must/have to (obligation), should (advice), might/could (possibility)','Passive voice: focus on action, not agent (be + past participle)','Reported speech: tense shifts (present → past, will → would)','Relative clauses: defining vs non-defining (which, that, who)','Gerunds vs infinitives: enjoy + -ing vs want + to V'] },
      { id: 'an2', title: 'Essay Writing and Comprehension',
        summary: 'English essay writing requires clear argumentation, appropriate vocabulary, and logical structure. Reading comprehension tests include identifying main ideas, tone, inference, and vocabulary in context.',
        keyPoints: ['Essay structure: Introduction → Body (2–3 paragraphs) → Conclusion','Topic sentence: first sentence of each paragraph (main idea)','Linking words: however, moreover, on the other hand, consequently','Comprehension: main idea, implicit meaning, vocabulary from context','Formal register: avoid contractions and colloquialisms','Cohesion: pronouns, synonyms, connectors for flow'] },
      { id: 'an3', title: 'Contemporary World Topics',
        summary: 'BAC Anglais tests thematic vocabulary around contemporary issues: globalization, climate change, technology, education, health, migration, and African development.',
        keyPoints: ['Globalization: interconnected markets, multinationals, cultural exchange','Climate: global warming, carbon footprint, renewable energy, COP summits','Technology: AI, social media, digital divide, cybersecurity','Africa: development, urbanization, youth, entrepreneurship','Education: access, equity, e-learning, brain drain','Expression: giving opinions, agreeing/disagreeing, making suggestions'] },
    ],
    flashcards: [
      { question: 'When do we use the 3rd conditional ?', answer: 'For impossible/unreal situations in the past: "If I had studied, I would have passed"' },
      { question: 'What is the passive voice used for ?', answer: 'To focus on the action or object, not the agent: "The report was written by the team"' },
      { question: 'What is a "topic sentence" ?', answer: 'The first sentence of a paragraph that states its main idea' },
      { question: 'Give 3 linking words expressing contrast.', answer: 'However / On the other hand / Nevertheless / Yet / Although' },
    ],
    quiz: [
      { question: '"If I _____ harder, I would have passed." Correct form:', options: ['study','studied','had studied','have studied'], correct: 2, explanation: '3rd conditional: "If + past perfect, would have + past participle". Here: "If I had studied harder, I would have passed."' },
      { question: 'Which sentence is in the PASSIVE voice ?', options: ['She wrote the essay','The essay was written by her','She had written the essay','She is writing the essay'], correct: 1, explanation: '"The essay was written by her" uses the passive: be + past participle. The focus is on the essay, not on who wrote it.' },
    ]
  }
}

const examBlanc: ExamSubject[] = [
  { subject: 'Histoire-Géographie', duration: '4h', questions: [
    'PARTIE A — HISTOIRE (10 pts)\n\n1. Définissez la Guerre Froide et expliquez ses principales caractéristiques. (4 pts)\n2. Analysez les causes et les formes de la décolonisation en Afrique noire. (6 pts)',
    'PARTIE B — GÉOGRAPHIE (10 pts)\n\n1. Décrivez le système-monde en vous appuyant sur des exemples précis. (4 pts)\n2. Présentez les atouts et les défis du développement du Sénégal. (6 pts)'
  ]},
  { subject: 'Philosophie', duration: '4h', questions: [
    'Sujet 1 — DISSERTATION\n"L\'homme est-il libre ?" Développez une argumentation philosophique structurée (thèse/antithèse/synthèse) en vous appuyant sur les auteurs étudiés.',
    'Sujet 2 — EXPLICATION DE TEXTE\n"Je ne suis pas libre de ne pas être libre. Ce que je dois être, j\'ai à l\'être." (Sartre)\n\n1. Dégagez l\'idée directrice du texte. (3 pts)\n2. Analysez les arguments du philosophe. (7 pts)\n3. Votre position par rapport à cette thèse. (3 pts) + expression (2 pts)'
  ]},
  { subject: 'Mathématiques (L)', duration: '3h', questions: [
    'Exercice 1 — ALGÈBRE (8 pts)\nSoit P(x) = 2x³ – 5x² – 4x + 3.\n1. Montrer que x = 3 est racine de P. (1 pt)\n2. Factoriser P(x) par la méthode de Hörner. (3 pts)\n3. Résoudre P(x) = 0. (2 pts)\n4. Dresser le tableau de signes de P(x). (2 pts)',
    'Exercice 2 — PROBABILITÉS (12 pts)\nUrne : 4 boules rouges, 6 bleues. Tirage de 3 boules avec remise.\n1. Probabilité de tirer 3 boules rouges ? (2 pts)\n2. Identifier la loi de X = "nb de boules rouges". (2 pts)\n3. Calculer E(X) et V(X). (4 pts)\n4. Calculer P(X ≥ 2). (4 pts)'
  ]},
  { subject: 'Français', duration: '4h', questions: [
    'TEXTE : Extrait du "Cahier d\'un retour au pays natal" (Aimé Césaire)\n\n"Ma bouche sera la bouche des malheurs qui n\'ont point de bouche, ma voix, la liberté de celles qui s\'affaissent au cachot du désespoir."\n\nQUESTIONS (8 pts)\n1. Registre dominant ? Justifiez avec 2 exemples. (3 pts)\n2. Identifiez et nommez les figures de style. (3 pts)\n3. Vision du poète qui se dégage du texte. (2 pts)',
    'PRODUCTION ÉCRITE — Choisissez UN sujet (12 pts)\n\nSujet A — DISSERTATION : "La littérature peut-elle changer le monde ?" Argumentation structurée appuyée sur des œuvres littéraires.\n\nSujet B — COMMENTAIRE : Comment Césaire exprime-t-il son engagement pour la Négritude dans cet extrait ?'
  ]},
]

const conseilsBac = [
  { icon: '📅', title: 'Planification', tip: 'Établissez un rétroplanning sur 3 mois. Révisez 2 matières/jour maximum. Alternez sujets abstraits (philo, maths) et concrets (histoire, SVT).' },
  { icon: '🧠', title: 'Mémorisation active', tip: 'Utilisez les flashcards, le mind mapping, et expliquez à voix haute. Méthode Feynman : enseignez le cours à quelqu\'un d\'autre pour consolider.' },
  { icon: '✍️', title: 'Entraînement aux épreuves', tip: 'Faites 2 examens blancs par matière minimum. Chronométrez-vous. Travaillez sur des sujets officiels des 5 dernières années.' },
  { icon: '💤', title: 'Sommeil et santé', tip: '8h de sommeil minimum. Le cerveau consolide les apprentissages pendant le sommeil. Pas d\'écrans 1h avant le coucher.' },
  { icon: '🎯', title: 'Stratégie le jour J', tip: 'Lisez tout le sujet avant de commencer. Commencez par les questions maîtrisées. Calculez le ratio points/minutes pour gérer le temps.' },
  { icon: '📝', title: 'Présentation des copies', tip: 'Soignez l\'écriture et la mise en page. Introduction et conclusion complètes. Aérez votre copie. Un correcteur apprécie une copie claire.' },
  { icon: '🤝', title: 'Groupes de révision', tip: 'Révisez en groupes de 3–4. Interrogez-vous mutuellement. Expliquer à quelqu\'un d\'autre renforce vos propres connaissances.' },
  { icon: '🏃', title: 'Activité physique', tip: '30 minutes de sport/jour améliorent la concentration et réduisent le stress. Une marche après une session aide à consolider la mémoire.' },
]

export default function PassBacPage() {
  const [activeTab, setActiveTab] = useState<Tab>('cours')
  const [activeSubject, setActiveSubject] = useState<Subject>('histoire')
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null)
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({})
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({})
  const [selectedExam, setSelectedExam] = useState(0)

  const subj = curriculum[activeSubject]
  const chapter = selectedChapter ? subj.chapters.find(c => c.id === selectedChapter) : null

  const resetSubject = (s: Subject) => {
    setActiveSubject(s)
    setSelectedChapter(null)
    setQuizAnswers({})
    setQuizSubmitted(false)
    setFlippedCards({})
  }

  const quizScore = Object.entries(quizAnswers).reduce((acc, [qi, ans]) => {
    return acc + (subj.quiz[+qi]?.correct === ans ? 1 : 0)
  }, 0)

  const tabStyle = (active: boolean): React.CSSProperties => ({
    padding: '0.65rem 1.2rem',
    borderRadius: '8px 8px 0 0',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.82rem',
    fontWeight: 600,
    fontFamily: "'Syne', sans-serif",
    whiteSpace: 'nowrap',
    transition: 'all 0.2s',
    background: active ? '#E8651A' : 'rgba(245,240,232,0.06)',
    color: active ? '#fff' : 'rgba(245,240,232,0.55)',
    borderBottom: active ? '2px solid #E8651A' : '2px solid transparent',
  })

  const pillStyle = (active: boolean, color: string): React.CSSProperties => ({
    padding: '0.42rem 1rem',
    borderRadius: '20px',
    border: `1px solid ${active ? color : 'rgba(245,240,232,0.12)'}`,
    cursor: 'pointer',
    fontSize: '0.82rem',
    fontWeight: 600,
    fontFamily: "'Syne', sans-serif",
    background: active ? color + '20' : 'transparent',
    color: active ? color : 'rgba(245,240,232,0.55)',
    transition: 'all 0.2s',
  })

  const cardStyle: React.CSSProperties = {
    background: '#282220',
    borderRadius: '12px',
    padding: '1.2rem 1.5rem',
    marginBottom: '0.7rem',
    border: '1px solid rgba(245,240,232,0.1)',
    cursor: 'pointer',
    transition: 'all 0.2s',
  }

  const sectionStyle: React.CSSProperties = {
    background: '#241E19',
    borderRadius: '14px',
    padding: '1.75rem',
    marginBottom: '1.5rem',
    border: '1px solid rgba(232,101,26,0.15)',
  }

  return (
    <div style={{ minHeight: '100vh', background: '#1E1A16', color: '#F5F0E8', fontFamily: "'Syne', sans-serif", paddingBottom: '3rem' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #2C2420 0%, #241A10 100%)', padding: '2rem 2.5rem 0', borderBottom: '1px solid rgba(232,101,26,0.2)' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#F5F0E8', margin: 0 }}>🎓 Mon Pass&apos;BAC</h1>
        <p style={{ color: 'rgba(245,240,232,0.45)', fontSize: '0.88rem', marginTop: '0.3rem', marginBottom: '1.5rem' }}>
          Révisions Terminale · Sénégal · Programme officiel · 8 matières
        </p>
        <div style={{ display: 'flex', gap: '0.25rem', overflowX: 'auto', paddingBottom: 0 }}>
          {([
            ['cours', '📖 Cours & Résumés'],
            ['fiches', '📌 Fiches Mémo'],
            ['flashcards', '🃏 Flashcards'],
            ['quiz', '✅ Quiz'],
            ['examens', '📝 Examens Blancs'],
            ['conseils', '💡 Conseils BAC'],
          ] as [Tab, string][]).map(([id, label]) => (
            <button key={id} style={tabStyle(activeTab === id)} onClick={() => setActiveTab(id as Tab)}>{label}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: '2rem 2.5rem' }}>
        {/* Subject selector */}
        {activeTab !== 'conseils' && activeTab !== 'examens' && (
          <div style={{ display: 'flex', gap: '0.55rem', flexWrap: 'wrap', marginBottom: '1.75rem' }}>
            {(Object.keys(curriculum) as Subject[]).map(key => {
              const sub = curriculum[key]
              return (
                <button key={key} style={pillStyle(activeSubject === key, sub.color)} onClick={() => resetSubject(key)}>
                  {sub.icon} {sub.label}
                </button>
              )
            })}
          </div>
        )}

        {/* COURS */}
        {activeTab === 'cours' && (
          <div>
            {!chapter ? (
              <div>
                <h2 style={{ color: subj.color, fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.2rem' }}>
                  {subj.icon} {subj.label} — {subj.chapters.length} chapitres
                </h2>
                {subj.chapters.map(ch => (
                  <div key={ch.id} style={{ ...cardStyle, borderLeft: `3px solid ${subj.color}40` }}
                    onClick={() => setSelectedChapter(ch.id)}>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#F5F0E8' }}>{ch.title}</div>
                    <div style={{ color: 'rgba(245,240,232,0.4)', fontSize: '0.78rem', marginTop: '0.3rem' }}>
                      {ch.keyPoints.length} points clés · Cliquer pour lire →
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div>
                <button onClick={() => setSelectedChapter(null)} style={{ background: 'none', border: 'none', color: subj.color, cursor: 'pointer', fontSize: '0.88rem', fontFamily: "'Syne', sans-serif", marginBottom: '1.5rem', padding: 0 }}>
                  ← Retour
                </button>
                <div style={sectionStyle}>
                  <h2 style={{ color: subj.color, fontSize: '1.35rem', fontWeight: 800, marginBottom: '1rem' }}>{chapter.title}</h2>
                  <p style={{ color: 'rgba(245,240,232,0.88)', lineHeight: 1.75, fontSize: '0.93rem', marginBottom: '1.5rem' }}>{chapter.summary}</p>
                  <h3 style={{ color: '#E8651A', fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem' }}>Points clés à retenir</h3>
                  <ul style={{ paddingLeft: '1.25rem', margin: 0 }}>
                    {chapter.keyPoints.map((pt, i) => (
                      <li key={i} style={{ color: 'rgba(245,240,232,0.90)', marginBottom: '0.5rem', fontSize: '0.88rem', lineHeight: 1.65 }}>{pt}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        {/* FICHES */}
        {activeTab === 'fiches' && (
          <div>
            <h2 style={{ color: subj.color, fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.2rem' }}>
              {subj.icon} Fiches Mémo — {subj.label}
            </h2>
            {subj.chapters.filter(ch => ch.fiche).length === 0 ? (
              <div style={{ ...sectionStyle, textAlign: 'center' as const, padding: '3rem' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📌</div>
                <p style={{ color: 'rgba(245,240,232,0.45)' }}>Fiches mémo de {subj.label} — bientôt disponibles.</p>
              </div>
            ) : subj.chapters.filter(ch => ch.fiche).map(ch => (
              <div key={ch.id} style={sectionStyle}>
                <h3 style={{ color: subj.color, fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem' }}>{ch.title}</h3>
                <pre style={{ color: 'rgba(245,240,232,0.90)', whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: '0.86rem', lineHeight: 1.85, margin: 0 }}>
                  {ch.fiche}
                </pre>
              </div>
            ))}
          </div>
        )}

        {/* FLASHCARDS */}
        {activeTab === 'flashcards' && (
          <div>
            <h2 style={{ color: subj.color, fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.4rem' }}>
              {subj.icon} Flashcards — {subj.label}
            </h2>
            <p style={{ color: 'rgba(245,240,232,0.4)', fontSize: '0.82rem', marginBottom: '1.5rem' }}>Cliquez pour révéler la réponse</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '1rem' }}>
              {subj.flashcards.map((fc, i) => (
                <div key={i}
                  onClick={() => setFlippedCards(prev => ({ ...prev, [i]: !prev[i] }))}
                  style={{
                    background: flippedCards[i] ? subj.color + '1A' : '#1C1917',
                    border: `1px solid ${flippedCards[i] ? subj.color : 'rgba(245,240,232,0.08)'}`,
                    borderRadius: '14px',
                    padding: '1.5rem',
                    cursor: 'pointer',
                    minHeight: '130px',
                    display: 'flex',
                    flexDirection: 'column' as const,
                    justifyContent: 'center',
                    transition: 'all 0.3s',
                  }}>
                  <div style={{ fontSize: '0.68rem', color: flippedCards[i] ? subj.color : 'rgba(245,240,232,0.28)', fontWeight: 700, marginBottom: '0.5rem', letterSpacing: '0.06em' }}>
                    {flippedCards[i] ? '✅ RÉPONSE' : '❓ QUESTION'}
                  </div>
                  <p style={{ color: '#F5F0E8', fontSize: '0.88rem', lineHeight: 1.65, margin: 0 }}>
                    {flippedCards[i] ? fc.answer : fc.question}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* QUIZ */}
        {activeTab === 'quiz' && (
          <div>
            <h2 style={{ color: subj.color, fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem' }}>
              {subj.icon} Quiz Interactif — {subj.label}
            </h2>
            {subj.quiz.map((q, qi) => (
              <div key={qi} style={sectionStyle}>
                <p style={{ color: '#F5F0E8', fontWeight: 700, marginBottom: '1rem', fontSize: '0.93rem' }}>
                  <span style={{ color: subj.color }}>Q{qi + 1}.</span> {q.question}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '0.5rem' }}>
                  {q.options.map((opt, oi) => {
                    const selected = quizAnswers[qi] === oi
                    const isCorrect = q.correct === oi
                    let bg = 'rgba(245,240,232,0.04)'
                    let border = 'rgba(245,240,232,0.1)'
                    let color = 'rgba(245,240,232,0.7)'
                    if (quizSubmitted) {
                      if (isCorrect) { bg = 'rgba(39,174,96,0.15)'; border = '#27AE60'; color = '#27AE60' }
                      else if (selected && !isCorrect) { bg = 'rgba(231,76,60,0.15)'; border = '#E74C3C'; color = '#E74C3C' }
                    } else if (selected) {
                      bg = subj.color + '1A'; border = subj.color; color = subj.color
                    }
                    return (
                      <button key={oi}
                        onClick={() => !quizSubmitted && setQuizAnswers(prev => ({ ...prev, [qi]: oi }))}
                        style={{ background: bg, border: `1px solid ${border}`, borderRadius: '8px', padding: '0.72rem 1rem', cursor: quizSubmitted ? 'default' : 'pointer', textAlign: 'left' as const, color, fontSize: '0.87rem', fontFamily: "'Syne', sans-serif", transition: 'all 0.2s' }}>
                        <span style={{ fontWeight: 700, marginRight: '0.5rem' }}>{String.fromCharCode(65 + oi)}.</span>{opt}
                      </button>
                    )
                  })}
                </div>
                {quizSubmitted && (
                  <div style={{ marginTop: '0.75rem', padding: '0.75rem 1rem', background: 'rgba(232,101,26,0.08)', borderRadius: '8px', color: 'rgba(245,240,232,0.82)', fontSize: '0.84rem', lineHeight: 1.6 }}>
                    💡 {q.explanation}
                  </div>
                )}
              </div>
            ))}
            {!quizSubmitted ? (
              <button
                onClick={() => setQuizSubmitted(true)}
                disabled={Object.keys(quizAnswers).length < subj.quiz.length}
                style={{ background: Object.keys(quizAnswers).length < subj.quiz.length ? 'rgba(232,101,26,0.3)' : '#E8651A', color: '#fff', border: 'none', borderRadius: '10px', padding: '0.85rem 2rem', fontWeight: 700, fontSize: '0.93rem', cursor: Object.keys(quizAnswers).length < subj.quiz.length ? 'not-allowed' : 'pointer', fontFamily: "'Syne', sans-serif" }}>
                Valider mes réponses ({Object.keys(quizAnswers).length}/{subj.quiz.length})
              </button>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' as const }}>
                <div style={{ background: '#282220', borderRadius: '12px', padding: '1rem 1.5rem', border: `1px solid ${quizScore === subj.quiz.length ? '#27AE60' : quizScore >= Math.ceil(subj.quiz.length / 2) ? '#E8651A' : '#E74C3C'}` }}>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#F5F0E8' }}>{quizScore}/{subj.quiz.length}</div>
                  <div style={{ fontSize: '0.78rem', color: 'rgba(245,240,232,0.4)', marginTop: '0.25rem' }}>
                    {quizScore === subj.quiz.length ? '🎉 Parfait !' : quizScore >= Math.ceil(subj.quiz.length / 2) ? '👍 Bien !' : '📚 À retravailler'}
                  </div>
                </div>
                <button onClick={() => { setQuizAnswers({}); setQuizSubmitted(false) }}
                  style={{ background: 'rgba(245,240,232,0.07)', color: '#F5F0E8', border: '1px solid rgba(245,240,232,0.12)', borderRadius: '10px', padding: '0.85rem 1.5rem', fontWeight: 600, fontSize: '0.88rem', cursor: 'pointer', fontFamily: "'Syne', sans-serif" }}>
                  Recommencer
                </button>
              </div>
            )}
          </div>
        )}

        {/* EXAMENS BLANCS */}
        {activeTab === 'examens' && (
          <div>
            <h2 style={{ color: '#E8651A', fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem' }}>
              📝 Examens Blancs — Sujets officiels simulés
            </h2>
            <div style={{ display: 'flex', gap: '0.55rem', flexWrap: 'wrap' as const, marginBottom: '2rem' }}>
              {examBlanc.map((e, i) => (
                <button key={i} onClick={() => setSelectedExam(i)}
                  style={pillStyle(selectedExam === i, '#E8651A')}>
                  {e.subject}
                </button>
              ))}
            </div>
            <div style={sectionStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' as const }}>
                <h3 style={{ color: '#E8651A', margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>
                  📋 {examBlanc[selectedExam].subject}
                </h3>
                <span style={{ background: 'rgba(232,101,26,0.15)', color: '#E8651A', padding: '0.22rem 0.75rem', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 700 }}>
                  ⏱ {examBlanc[selectedExam].duration}
                </span>
              </div>
              {examBlanc[selectedExam].questions.map((q, qi) => (
                <div key={qi} style={{ background: '#1E1A16', borderRadius: '10px', padding: '1.25rem', marginBottom: '1rem', border: '1px solid rgba(245,240,232,0.1)' }}>
                  <pre style={{ whiteSpace: 'pre-wrap', fontFamily: "'Syne', sans-serif", fontSize: '0.87rem', lineHeight: 1.8, color: 'rgba(245,240,232,0.90)', margin: 0 }}>
                    {q}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CONSEILS BAC */}
        {activeTab === 'conseils' && (
          <div>
            <h2 style={{ color: '#E8651A', fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.4rem' }}>
              💡 Conseils pour réussir le BAC
            </h2>
            <p style={{ color: 'rgba(245,240,232,0.4)', fontSize: '0.84rem', marginBottom: '1.75rem' }}>
              Méthodes, organisation et stratégies pour maximiser tes résultats
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              {conseilsBac.map((c, i) => (
                <div key={i} style={{ background: '#282220', borderRadius: '14px', padding: '1.5rem', border: '1px solid rgba(232,101,26,0.1)' }}>
                  <div style={{ fontSize: '1.85rem', marginBottom: '0.65rem' }}>{c.icon}</div>
                  <h3 style={{ color: '#E8651A', fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.45rem' }}>{c.title}</h3>
                  <p style={{ color: 'rgba(245,240,232,0.62)', fontSize: '0.86rem', lineHeight: 1.7, margin: 0 }}>{c.tip}</p>
                </div>
              ))}
            </div>

            {/* Calendrier indicatif */}
            <div style={sectionStyle}>
              <h3 style={{ color: '#E8651A', fontWeight: 800, marginBottom: '1rem', fontSize: '1rem' }}>📅 Calendrier BAC Sénégal (indicatif)</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: '0.7rem' }}>
                {[
                  { mat: 'Philosophie', info: 'Jour 1 — Matin', duree: '4h' },
                  { mat: 'Histoire-Géo', info: 'Jour 1 — Après-midi', duree: '4h' },
                  { mat: 'Français', info: 'Jour 2 — Matin', duree: '4h' },
                  { mat: 'Mathématiques', info: 'Jour 2 — Après-midi', duree: '3h' },
                  { mat: 'Anglais', info: 'Jour 3 — Matin', duree: '3h' },
                  { mat: 'Physique-Chimie', info: 'Jour 3 — Après-midi', duree: '3h' },
                  { mat: 'SVT', info: 'Jour 4 — Matin', duree: '3h' },
                ].map((e, i) => (
                  <div key={i} style={{ background: '#1E1A16', borderRadius: '8px', padding: '0.8rem 1rem', border: '1px solid rgba(245,240,232,0.1)' }}>
                    <div style={{ color: '#E8651A', fontWeight: 700, fontSize: '0.88rem' }}>{e.mat}</div>
                    <div style={{ color: 'rgba(245,240,232,0.4)', fontSize: '0.76rem', marginTop: '0.2rem' }}>{e.info}</div>
                    <div style={{ color: 'rgba(245,240,232,0.28)', fontSize: '0.74rem' }}>Durée : {e.duree}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
