'use client'

import { useState } from 'react'

type Tab = 'cours' | 'fiches' | 'flashcards' | 'quiz' | 'examens' | 'conseils'
type Subject = 'maths' | 'physique' | 'svt' | 'francais' | 'philosophie' | 'histoire' | 'geographie' | 'anglais'

interface Chapter { id: string; title: string; summary: string; keyPoints: string[]; fiche?: string }
interface Flashcard { question: string; answer: string }
interface QuizQuestion { question: string; options: string[]; correct: number; explanation: string }
interface ExamSubject { subject: string; duration: string; questions: string[] }

const curriculum: Record<Subject, { label: string; icon: string; color: string; chapters: Chapter[]; flashcards: Flashcard[]; quiz: QuizQuestion[] }> = {
  histoire: {
    label: 'Histoire', icon: '📜', color: '#C0392B',
    chapters: [
      { id: 'h1', title: 'Conséquences de la Seconde Guerre Mondiale',
        summary: 'La Seconde Guerre Mondiale (1939–1945) est le conflit le plus meurtrier de l\'histoire avec près de 60 millions de morts, dont 40 millions de civils. Elle provoque la destruction des économies européennes, la Shoah (6 millions de Juifs exterminés), et l\'utilisation des bombes atomiques sur Hiroshima et Nagasaki (août 1945).\n\nDes solutions sont mises en place pour reconstruire l\'ordre mondial. L\'ONU est créée le 26 juin 1945 à San Francisco pour maintenir la paix internationale. Les procès de Nuremberg (1945–46) établissent le concept de crime contre l\'humanité. Le Plan Marshall (1947) apporte 12 milliards de dollars pour reconstruire l\'Europe occidentale, mais le monde se bipolaise autour des deux superpuissances : USA et URSS.',
        keyPoints: ['Bilan : 60 millions de morts, 40 millions de civils, la Shoah (6 millions)','Plan Marshall (1947) : 12 milliards $ pour la reconstruction de l\'Europe','ONU : 26 juin 1945 à San Francisco — maintien de la paix','Procès de Nuremberg (1945–46) : crime contre l\'humanité reconnu','Bombes atomiques : Hiroshima (6 août) et Nagasaki (9 août 1945)','Bipolarisation : naissance de la Guerre Froide USA vs URSS'],
        fiche: 'FICHE MÉMO — 2GM\n\n• Début : 1er sept. 1939 (invasion Pologne)\n• Fin Europe : 8 mai 1945 | Fin Pacifique : 2 sept. 1945\n• Shoah : 6 millions de Juifs exterminés\n• Hiroshima + Nagasaki : août 1945\n• ONU : 26 juin 1945 (San Francisco)\n• Plan Marshall : 1947, 12 mds $\n• Procès Nuremberg : 1945–46' },
      { id: 'h2', title: 'La Guerre Froide : Relations Est/Ouest',
        summary: 'La Guerre Froide (1947–1991) est une confrontation idéologique, politique et stratégique entre les États-Unis (bloc occidental, démocratie libérale) et l\'URSS (bloc oriental, communisme). Elle débute avec la Doctrine Truman (1947) et le Plan Marshall, auxquels l\'URSS répond par le Kominform et la doctrine Jdanov. Les deux blocs ne s\'affrontent jamais directement mais s\'opposent à travers des guerres par procuration (Corée, Vietnam), une course aux armements nucléaires et une compétition spatiale.\n\nLes crises les plus dangereuses sont le Blocus de Berlin (1948–49), la guerre de Corée (1950–53), et surtout la crise des missiles de Cuba (octobre 1962), qui amène le monde au bord de la guerre nucléaire. La détente des années 1970, puis la politique de Gorbatchev (glasnost, perestroïka) conduisent à la chute du Mur de Berlin le 9 novembre 1989 et à la dissolution de l\'URSS le 25 décembre 1991.',
        keyPoints: ['Doctrine Truman (1947) : endiguement du communisme','Blocus de Berlin (1948–49) et pont aérien américain','OTAN (1949, Ouest) vs Pacte de Varsovie (1955, Est)','Guerre de Corée (1950–53) : premier conflit par procuration','Crise de Cuba (oct. 1962) : 13 jours au bord du nucléaire','Chute du Mur de Berlin : 9 novembre 1989','Dissolution de l\'URSS : 25 décembre 1991'],
        fiche: 'FICHE MÉMO — GUERRE FROIDE\n\n• 1947 : Doctrine Truman + Plan Marshall\n• 1949 : OTAN (Ouest) / 1955 : Pacte Varsovie\n• 1948–49 : Blocus de Berlin\n• 1950–53 : Guerre de Corée\n• 1962 : Crise missiles Cuba (13 jours)\n• 1969 : Course à la Lune (USA gagnent)\n• 1989 : Chute du Mur de Berlin\n• 1991 : Fin de l\'URSS' },
      { id: 'h3', title: 'La Chine de 1945 à 1990',
        summary: 'Après la victoire des communistes sur les nationalistes de Tchang Kaï-chek, Mao Zedong proclame la République Populaire de Chine le 1er octobre 1949. Il engage d\'abord une réforme agraire radicale, puis le Grand Bond en Avant (1958–62), une politique de collectivisation forcée qui provoque des famines terribles (30–45 millions de morts).\n\nLa Révolution Culturelle (1966–76) lance les Gardes Rouges contre les intellectuels, les "révisionnistes" et les traditions. Après la mort de Mao en septembre 1976, Deng Xiaoping prend le pouvoir (1978) et engage les "Quatre Modernisations" : agriculture, industrie, science, armée. Cette ouverture économique transforme la Chine en puissance industrielle mondiale, malgré la répression du mouvement démocratique de Tiananmen en juin 1989.',
        keyPoints: ['1er oct. 1949 : proclamation de la RPC par Mao Zedong','Grand Bond en Avant (1958–62) : famines, 30–45 millions de morts','Révolution culturelle (1966–76) : Gardes Rouges, persécutions','Mort de Mao : sept. 1976 — fin d\'une époque','Deng Xiaoping (1978) : "Quatre Modernisations", économie de marché','Tiananmen : juin 1989, répression du mouvement pro-démocratie'] },
      { id: 'h4', title: 'La Décolonisation : causes et formes',
        summary: 'La décolonisation (1945–1975) est le processus d\'accession à l\'indépendance des peuples colonisés. Elle résulte de plusieurs facteurs convergents : l\'affaiblissement des puissances coloniales européennes après la 2GM, le développement des mouvements nationalistes nourris des idées des Lumières et du panafricanisme, le rôle de l\'ONU qui condamne le colonialisme, et la rivalité USA/URSS qui soutiennent les mouvements de libération.\n\nLa décolonisation prend deux formes principales. La forme pacifique est illustrée par l\'Inde (1947, Gandhi et la non-violence) et le Ghana (1957, Kwame Nkrumah). La forme armée caractérise les guerres d\'Indochine (1946–54), la guerre d\'Algérie (1954–62) et les luttes en Guinée-Bissau et Angola. La Conférence de Bandung (1955) réunit 29 pays afro-asiatiques et fonde le mouvement des Non-Alignés.',
        keyPoints: ['Causes : affaiblissement Europe, nationalisme, ONU, Guerre Froide','Bandung (1955) : 29 pays, naissance du Mouvement des Non-Alignés','Inde : 15 août 1947, Mahatma Gandhi, non-violence','Ghana (Gold Coast) : 6 mars 1957, Kwame Nkrumah — 1er pays d\'Afrique noire','Algérie : 1954–62, guerre du FLN, indépendance 5 juillet 1962','Sénégal : 4 avril 1960, Léopold Sédar Senghor — président'] },
      { id: 'h5', title: 'Décolonisation en Afrique noire',
        summary: 'L\'Afrique noire accède massivement à l\'indépendance en 1960, surnommée l\'Année de l\'Afrique : 17 pays deviennent indépendants en un an. Les dirigeants de la première génération — Senghor (Sénégal), Houphouët-Boigny (Côte d\'Ivoire), Sékou Touré (Guinée) — incarnent des visions différentes du développement africain post-colonial.\n\nLa Guinée Conakry, sous Sékou Touré, est le seul territoire à voter "Non" au référendum de 1958 proposé par de Gaulle, choisissant l\'indépendance immédiate. La dissolution des fédérations coloniales (AOF, AEF) donne naissance à une mosaïque d\'États. Certains territoires connaissent une décolonisation plus tardive et armée : Guinée-Bissau (1974, PAIGC de Cabral), Angola et Mozambique (1975).',
        keyPoints: ['1960 : "Année de l\'Afrique" — 17 indépendances en un an','Guinée Conakry : 2 oct. 1958, Sékou Touré — seul "Non" au référendum','Dissolution AOF/AEF → multiples États indépendants','Sénégal : 4 avril 1960, Senghor 1er président','Décolonisation armée : Guinée-Bissau (1974), Angola/Mozambique (1975)','Néocolonialisme : persistance des liens économiques avec l\'ancienne métropole'] },
      { id: 'h6', title: 'Civilisation Négro-Africaine',
        summary: 'Les civilisations négro-africaines ont développé bien avant la colonisation des structures politiques, économiques et culturelles sophistiquées. L\'Empire du Ghana (VIIIe–XIe s.) contrôle le commerce de l\'or et du sel transsaharien. L\'Empire du Mali (XIIIe–XVe s.) atteint son apogée sous Kankou Moussa, dont le pèlerinage à La Mecque en 1324 éblouit le monde islamique. L\'Empire Songhaï (XVe–XVIe s.) sous Askia Mohammed développe Tombouctou en centre intellectuel mondial.\n\nCes sociétés sont organisées autour de clans, de castes spécialisées (forgeron, griot, cordonnier) et de royautés sacrées. La tradition orale, portée par les griots, constitue la mémoire collective. L\'art africain — sculptures, masques, bronzes du Bénin — influencera profondément l\'art moderne occidental (cubisme de Picasso).',
        keyPoints: ['Empire Ghana (VIIIe–XIe s.) : 1er grand empire, commerce or/sel','Empire Mali (XIIIe–XVe s.) : Soundjata Keïta (fondateur), Kankou Moussa','Empire Songhaï (XVe–XVIe s.) : Askia Mohammed, Tombouctou intellectuelle','Organisation sociale : clans, castes, royautés sacrées','Griots : gardiens de la mémoire orale des peuples','Art africain : masques, bronzes du Bénin → influence sur le cubisme'] },
      { id: 'h7', title: 'Civilisation Musulmane',
        summary: 'L\'islam naît en 610 dans la péninsule arabique avec les révélations du Prophète Mohammed à La Mecque. L\'Hégire (622) — la migration de La Mecque à Médine — marque le début du calendrier musulman. En moins d\'un siècle, la conquête arabe s\'étend de l\'Espagne (711) à l\'Inde, diffusant la langue arabe et la culture islamique.\n\nL\'Âge d\'or de l\'Islam (IXe–XIIIe s.) voit des savants comme Al-Khawarizmi (fondateur de l\'algèbre), Ibn Sina/Avicenne (médecine), Al-Biruni (astronomie) et Ibn Rushd/Averroès (philosophie) révolutionner les sciences mondiales. L\'islam se diffuse en Afrique subsaharienne par les voies commerciales transsahariennes, donnant naissance à des sultanats comme ceux du Bornou et de Sokoto.',
        keyPoints: ['622 : Hégire — migration Mecque → Médine, départ calendrier musulman','5 piliers : shahada, salat (prière), zakat, sawm (jeûne), hajj','711 : Conquête de l\'Espagne (Al-Andalus)','Âge d\'or : Al-Khawarizmi (algèbre), Ibn Sina, Averroès','Sunnites (80%) vs Chiites (20%) : division après la mort du Prophète','Islam en Afrique : voies commerciales, islamisation progressive des royaumes'],
        fiche: 'FICHE MÉMO — ISLAM\n\n• 610 : 1ères révélations à Mohammed\n• 622 : Hégire (La Mecque → Médine)\n• 632 : Mort du Prophète\n• 711 : Espagne (Al-Andalus)\n• IXe–XIIIe s. : Âge d\'Or des sciences\n• 5 piliers : shahada, salat, zakat, sawm, hajj\n• Coran : livre sacré en arabe' },
    ],
    flashcards: [
      { question: 'Quelle est la date de création de l\'ONU et où ?', answer: '26 juin 1945 à San Francisco, pour maintenir la paix internationale' },
      { question: 'Qu\'est-ce que la Doctrine Truman (1947) ?', answer: 'Politique américaine d\'endiguement du communisme : aide financière et militaire aux pays menacés par l\'URSS' },
      { question: 'Quand et comment tombe le Mur de Berlin ?', answer: '9 novembre 1989 — sous la pression populaire, les autorités est-allemandes ouvrent les checkpoints' },
      { question: 'Qui proclame la République Populaire de Chine et quand ?', answer: 'Mao Zedong, le 1er octobre 1949, à Pékin' },
      { question: 'Quelle est la date d\'indépendance du Sénégal ?', answer: '4 avril 1960, sous la présidence de Léopold Sédar Senghor' },
      { question: 'Quelle est la crise la plus dangereuse de la Guerre Froide ?', answer: 'La crise des missiles de Cuba (octobre 1962) — 13 jours au bord de la guerre nucléaire' },
      { question: 'Qui fonde l\'Empire du Mali et quand ?', answer: 'Soundjata Keïta au XIIIe siècle ; l\'empire atteint son apogée sous Kankou Moussa (1312–1337)' },
      { question: 'Qu\'est-ce que le Mouvement des Non-Alignés ?', answer: 'Né à Bandung (1955) : coalition de 29 pays afro-asiatiques refusant de choisir entre les blocs USA et URSS' },
      { question: 'Quelle est la signification de l\'Hégire (622) ?', answer: 'Migration du Prophète Mohammed de La Mecque à Médine — point de départ du calendrier musulman' },
      { question: 'Qu\'est-ce que le Grand Bond en Avant (1958–62) ?', answer: 'Politique de collectivisation forcée de Mao en Chine, provoquant des famines qui tuent 30 à 45 millions de personnes' },
    ],
    quiz: [
      { question: 'Quel plan américain aide la reconstruction de l\'Europe après la 2GM ?', options: ['Plan Schuman','Plan Marshall','Plan Truman','Plan Adenauer'], correct: 1, explanation: 'Le Plan Marshall (1947) représente 12 milliards de dollars d\'aide américaine. L\'Europe occidentale s\'en remet rapidement tandis que l\'Est, sous pression soviétique, refuse.' },
      { question: 'En quelle année le Sénégal accède-t-il à l\'indépendance ?', options: ['1957','1958','1960','1962'], correct: 2, explanation: 'Le Sénégal proclame son indépendance le 4 avril 1960. Léopold Sédar Senghor en devient le premier président jusqu\'en 1980.' },
      { question: 'Qu\'est-ce que la Révolution Culturelle chinoise (1966–76) ?', options: ['La modernisation économique de Deng','La collectivisation forcée sous Mao','Campagne de persécution des intellectuels par Mao','La proclamation de la RPC'], correct: 2, explanation: 'Les Gardes Rouges de Mao détruisent les traditions, persécutent les intellectuels et les opposants. Des millions de personnes sont déportées, emprisonnées ou tuées.' },
      { question: 'Qui mène l\'Inde à l\'indépendance par la non-violence ?', options: ['Nehru','Mahatma Gandhi','Jinnah','Ambedkar'], correct: 1, explanation: 'Gandhi dirige la résistance passive (désobéissance civile, marche du sel). L\'Inde devient indépendante le 15 août 1947.' },
      { question: 'Quand tombe le Mur de Berlin ?', options: ['9 nov. 1989','25 déc. 1991','3 oct. 1990','8 mai 1945'], correct: 0, explanation: 'Le 9 novembre 1989, sous la pression populaire, les autorités RDA ouvrent les checkpoints. C\'est le symbole de la fin de la Guerre Froide.' },
      { question: 'Quel est le 1er pays d\'Afrique noire à accéder à l\'indépendance ?', options: ['Sénégal (1960)','Nigeria (1960)','Ghana/Gold Coast (1957)','Guinée (1958)'], correct: 2, explanation: 'Le Ghana (ex-Gold Coast britannique) devient le 1er État d\'Afrique noire indépendante le 6 mars 1957, sous la direction de Kwame Nkrumah.' },
      { question: 'Quel empire africain atteint son apogée sous Kankou Moussa ?', options: ['Empire du Ghana','Empire du Mali','Empire Songhaï','Royaume du Bénin'], correct: 1, explanation: 'L\'Empire du Mali (XIIIe–XVe s.) atteint son apogée sous Kankou Moussa (1312–1337), dont le pèlerinage à La Mecque en 1324 éblouit le monde entier.' },
      { question: 'Que marque l\'Hégire dans la civilisation musulmane ?', options: ['La mort du Prophète','La conquête de l\'Espagne','La migration La Mecque→Médine, an 1 du calendrier','La rédaction du Coran'], correct: 2, explanation: 'L\'Hégire (622) est la migration du Prophète Mohammed de La Mecque à Médine. Elle marque le début du calendrier islamique (AH : Anno Hegirae).' },
    ]
  },
  geographie: {
    label: 'Géographie', icon: '🌍', color: '#27AE60',
    chapters: [
      { id: 'g1', title: 'Le Système-Monde',
        summary: 'Le système-monde est l\'organisation hiérarchisée de l\'espace planétaire autour de centres dominants (le "cœur") et de périphéries. La "Triade" formée par les États-Unis, l\'Union Européenne et le Japon concentre les richesses, les technologies et les décisions économiques mondiales. Avec la mondialisation, des pays émergents (BRICS) rééquilibrent progressivement ce système.\n\nLes flux caractérisent ce système : flux commerciaux (marchandises), financiers (capitaux), migratoires (personnes) et informationnels (données). Les institutions comme le FMI, la Banque Mondiale et l\'OMC encadrent ces échanges. La métropolisation concentre les activités dans quelques grandes métropoles mondiales (New York, Tokyo, Londres, Paris), créant de fortes inégalités spatiales.',
        keyPoints: ['La "Triade" : USA, UE, Japon — cœur de la mondialisation','BRICS : Brésil, Russie, Inde, Chine, Afrique du Sud — pays émergents','FMI, Banque Mondiale, OMC : institutions de régulation mondiale','Flux : commerciaux, financiers, migratoires, informationnels','Métropolisation : concentration dans les villes mondiales (mégalopoles)','Inégalités : gradient Nord/Sud, mais pays émergents comblent l\'écart'] },
      { id: 'g2', title: 'L\'Amérique du Nord : USA, Canada, Mexique',
        summary: 'L\'Amérique du Nord forme le premier espace économique intégré mondial avec l\'USMCA (ex-ALENA). Les États-Unis dominent avec un PIB de 25 000 milliards de dollars, une économie de services et d\'innovation (Silicon Valley, Hollywood), et le dollar comme monnaie de référence internationale. La Mégalopolis américaine (de Boston à Washington) concentre 50 millions d\'habitants et la majorité de la puissance économique du pays.\n\nLe Canada, 2e plus grand pays du monde, est riche en ressources naturelles (pétrole, bois, eau) et entretient des liens étroits avec les USA. Le Mexique est un pays émergent (16e PIB mondial) mais marqué par de fortes inégalités entre un Nord industrialisé (maquiladoras, corridor frontalier) et un Sud rural pauvre. L\'émigration mexicaine vers les USA est un enjeu géopolitique majeur.',
        keyPoints: ['USMCA (2020) : accord de libre-échange révisé USA-Canada-Mexique','PIB USA : 1er mondial, 25 000 Mds$ — économie de services et d\'innovation','Silicon Valley : hub technologique mondial (Google, Apple, Meta)','Mégalopolis américaine : Boston→Washington (50 millions d\'hab.)','Canada : 2e superficie mondiale, ressources naturelles abondantes','Mexique : maquiladoras, inégalités Nord/Sud, 16e PIB mondial'] },
      { id: 'g3', title: 'L\'Europe et l\'Union Européenne',
        summary: 'L\'Union Européenne est une construction politique et économique unique au monde : 27 États membres (après le Brexit britannique en 2020) représentant 450 millions d\'habitants et le premier marché intérieur mondial. L\'euro, monnaie commune de 20 pays, est géré par la Banque Centrale Européenne (BCE) à Francfort. L\'espace Schengen garantit la libre circulation des personnes entre 26 pays.\n\nL\'UE fait face à plusieurs défis : le vieillissement démographique, la pression migratoire aux frontières extérieures, la transition énergétique (Green Deal européen), les inégalités entre États membres (Est/Ouest) et les tensions centrifuges (euroscepticisme). La PAC (Politique Agricole Commune) représente historiquement le premier poste budgétaire de l\'UE.',
        keyPoints: ['UE : 27 membres (après Brexit 2020), 450 millions d\'habitants','Zone euro : 20 pays, BCE à Francfort, taux commun','Schengen : libre circulation dans 26 pays — espace sans frontières','Brexit : sortie du Royaume-Uni, 31 janvier 2020','PAC : Politique Agricole Commune — premier budget UE historiquement','Green Deal européen : neutralité carbone visée en 2050'] },
      { id: 'g4', title: 'L\'Asie-Pacifique : Japon et Chine',
        summary: 'L\'Asie-Pacifique est devenue le moteur de la croissance mondiale. Le Japon (3e PIB mondial) est pionnier en robotique, automobile et électronique. Son système des keiretsu (conglomérats industriels) a fait sa force, mais il affronte désormais un vieillissement démographique sévère et une dépendance énergétique totale. La Chine (2e PIB, 1er exportateur) est la "Fabrique du monde" avec 1,4 milliard d\'habitants.\n\nDepuis 2013, la Chine déploie la "Belt and Road Initiative" (Nouvelles Routes de la Soie), investissant massivement en Afrique, Asie et Europe pour étendre son influence. La rivalité sino-américaine (guerre commerciale, 5G, Taïwan) structure les relations internationales du XXIe siècle. Les Tigres asiatiques (Corée du Sud, Taïwan, Singapour, Hong Kong) ont connu des croissances économiques spectaculaires.',
        keyPoints: ['Japon : 3e PIB mondial, keiretsu, robotique, vieillissement','Chine : 2e PIB, 1,4 Md hab., "Fabrique du monde", 1er exportateur','Belt and Road (depuis 2013) : Nouvelles Routes de la Soie — stratégie d\'influence','Rivaux USA-Chine : 5G, intelligence artificielle, Taïwan','Tigres asiatiques : Corée du Sud, Taïwan, Singapour, Hong Kong','Zone ASEAN : 10 pays, moteur de croissance en Asie du Sud-Est'] },
      { id: 'g5', title: 'L\'Afrique : défis du développement',
        summary: 'L\'Afrique (1,4 milliard d\'habitants, 54 pays) est le continent le plus jeune : 60% de la population a moins de 25 ans. Paradoxalement, malgré des ressources naturelles considérables (pétrole, gaz, or, diamants, terres rares, cobalt), 33 des 40 pays les plus pauvres du monde sont africains. Ce "paradoxe de l\'abondance" s\'explique par les conflits, la mauvaise gouvernance, les termes inégaux des échanges et l\'héritage colonial.\n\nL\'Afrique connaît cependant des dynamiques positives : une croissance économique soutenue (5–6%/an avant Covid), une urbanisation rapide (Lagos, Kinshasa, Nairobi), le développement du mobile banking, et l\'émergence d\'une classe moyenne. La Zone de Libre-Échange Continentale Africaine (ZLECAf, 2021) ambitionne de créer un marché unique africain.',
        keyPoints: ['1,4 milliard d\'hab., 60% ont moins de 25 ans — continent le plus jeune','Paradoxe : immenses ressources, 33/40 pays les plus pauvres','Croissance : 5–6%/an, émergence d\'une classe moyenne','Urbanisation : Lagos, Kinshasa, Nairobi, Le Caire','ZLECAf (2021) : zone de libre-échange continentale africaine','Défis : gouvernance, conflits, changement climatique, infrastructures'] },
      { id: 'g6', title: 'Le Sénégal : milieux et développement',
        summary: 'Le Sénégal (196 722 km², ~18 millions d\'habitants) est situé à l\'extrémité occidentale de l\'Afrique, avec une façade atlantique de 700 km. Son territoire présente trois zones climatiques : sahélienne au nord (faibles pluies, élevage), soudanienne au centre (bassin arachidier, mil) et subguinéenne au sud en Casamance (forêts, riz). Dakar, capitale et métropole de 3,5 millions d\'habitants, concentre 80% de l\'activité économique nationale.\n\nLe Plan Sénégal Émergent (PSE, 2014) est la stratégie de développement à l\'horizon 2035 articulée autour de trois axes : transformation structurelle, gouvernance et capital humain. La découverte de pétrole et de gaz offshore (champs de Grand Tortue Ahmeyim et Sangomar) depuis 2014 ouvre de nouvelles perspectives économiques. La pêche, l\'agriculture (arachide, mil, coton), le tourisme et les transferts de la diaspora restent les piliers traditionnels.',
        keyPoints: ['Superficie : 196 722 km² ; ~18 millions d\'hab. ; capitale : Dakar','3 zones climatiques : sahélienne (N), soudanienne (centre), subguinéenne (S-Casamance)','Dakar : 3,5 M hab., 80% de l\'activité économique nationale','PSE (2014) : Plan Sénégal Émergent, vision 2035 — 3 axes','Pétrole/gaz offshore : champs GTA et Sangomar — nouvelle donne','Diaspora : 2e source de revenus après les exportations'] },
    ],
    flashcards: [
      { question: 'Que désigne la "Triade" dans le système-monde ?', answer: 'Les trois pôles dominants de la mondialisation : États-Unis, Union Européenne et Japon' },
      { question: 'Que sont les BRICS ?', answer: 'Brésil, Russie, Inde, Chine, Afrique du Sud — les grandes puissances émergentes' },
      { question: 'Quel est l\'accord de libre-échange en Amérique du Nord ?', answer: 'USMCA (ex-ALENA), révisé en 2020 entre USA, Canada et Mexique' },
      { question: 'Combien de membres compte l\'UE après le Brexit ?', answer: '27 membres (le Royaume-Uni est sorti le 31 janvier 2020)' },
      { question: 'Quelle est la superficie et la capitale du Sénégal ?', answer: '196 722 km², capitale : Dakar (3,5 millions d\'habitants)' },
      { question: 'Qu\'est-ce que la ZLECAf ?', answer: 'Zone de Libre-Échange Continentale Africaine, lancée en 2021 pour créer un marché unique africain' },
      { question: 'Qu\'est-ce que le Plan Sénégal Émergent (PSE) ?', answer: 'Stratégie de développement du Sénégal à l\'horizon 2035 articulée sur 3 axes : économie, gouvernance, capital humain' },
      { question: 'Qu\'est-ce que la "Belt and Road Initiative" de la Chine ?', answer: 'Les Nouvelles Routes de la Soie (depuis 2013) : réseau d\'investissements et d\'infrastructures pour étendre l\'influence chinoise' },
    ],
    quiz: [
      { question: 'Quel est le 1er partenaire commercial mondial (exportations) ?', options: ['États-Unis','Union Européenne','Chine','Japon'], correct: 2, explanation: 'La Chine est devenue le 1er exportateur mondial depuis 2009 et le 1er partenaire commercial de la majorité des pays africains.' },
      { question: 'Le Plan Sénégal Émergent (PSE) vise quelle échéance ?', options: ['2020','2025','2030','2035'], correct: 3, explanation: 'Le PSE lancé en 2014 est la stratégie de développement du Sénégal avec une vision à l\'horizon 2035. Il s\'articule autour de 3 axes stratégiques.' },
      { question: 'Combien de membres compte l\'Union Européenne en 2024 ?', options: ['28','27','25','30'], correct: 1, explanation: 'Depuis le Brexit (31 janvier 2020), l\'UE compte 27 membres. Le Royaume-Uni est le seul pays à avoir quitté l\'Union.' },
      { question: 'Que désigne la métropolisation ?', options: ['La construction de nouvelles villes','La concentration des activités dans les grandes métropoles','Le développement rural','L\'industrialisation des pays pauvres'], correct: 1, explanation: 'La métropolisation est le processus de concentration des populations, activités économiques et fonctions stratégiques dans les grandes métropoles mondiales.' },
      { question: 'Quel fleuve forme la frontière nord du Sénégal avec la Mauritanie ?', options: ['Fleuve Gambie','Fleuve Casamance','Fleuve Sénégal','Fleuve Niger'], correct: 2, explanation: 'Le Fleuve Sénégal (1 700 km) prend sa source en Guinée et forme la frontière nord avec la Mauritanie. Il alimente l\'agriculture par irrigation.' },
      { question: 'Quel accord commercial inclut USA, Canada et Mexique ?', options: ['USMCA','MERCOSUR','ASEAN','CEDEAO'], correct: 0, explanation: 'L\'USMCA (United States–Mexico–Canada Agreement), successeur de l\'ALENA, est entré en vigueur en juillet 2020.' },
    ]
  },
  philosophie: {
    label: 'Philosophie', icon: '🧠', color: '#8E44AD',
    chapters: [
      { id: 'p1', title: 'Nature et Méthode de la Philosophie',
        summary: 'La philosophie (philo-sophia : "amour de la sagesse") est née en Grèce antique au VIe siècle av. J.-C. avec Thalès, Socrate, Platon et Aristote. Elle se distingue de la mythologie et de la religion en exigeant une justification rationnelle des affirmations. La démarche philosophique commence par l\'étonnement (thaumazein) et procède par questionnement, argumentation et dialectique.\n\nElle se divise en grands domaines : la métaphysique (nature de l\'être et de la réalité), l\'épistémologie (nature de la connaissance), l\'éthique (valeurs morales et action juste), la philosophie politique (organisation de la société), et l\'esthétique (nature du beau). La philosophie africaine apporte une dimension communautaire : le concept Ubuntu ("je suis parce que nous sommes") remet en cause l\'individualisme occidental.',
        keyPoints: ['Naissance : Grèce VIe s. av. J.-C. — Thalès, Socrate, Platon, Aristote','Méthode : questionnement, argumentation, dialectique (dialogue)','Métaphysique : qu\'est-ce que l\'être ? / Épistémologie : qu\'est-ce que savoir ?','Éthique : que devons-nous faire ? / Politique : comment vivre ensemble ?','Ubuntu (philosophie africaine) : "je suis parce que nous sommes"','Philosophie ≠ religion : exigence de rationalité, pas de foi'] },
      { id: 'p2', title: 'Nature et Culture',
        summary: 'L\'homme est le seul être vivant qui ne peut pas survivre sans culture : langage, techniques, institutions, arts. La culture est tout ce qui est acquis, appris, transmis socialement — par opposition à la nature, qui est inné et biologique. Cette distinction soulève la question : l\'homme est-il naturellement bon ou mauvais ?\n\nRousseau affirme que l\'homme naturel est bon mais que la société le corrompt. Hobbes pense à l\'inverse que l\'état de nature est une guerre de tous contre tous. Lévi-Strauss montre que la prohibition de l\'inceste — universelle mais culturellement définie — marque le passage de la nature à la culture. Freud soutient que la culture exige le refoulement des pulsions instinctives, créant une "névrose culturelle" inhérente à la civilisation.',
        keyPoints: ['Nature : inné, universel, biologique vs Culture : acquis, appris, transmis','Rousseau : homme naturel = bon ; la société corrompt ("bon sauvage")','Hobbes : état de nature = "guerre de tous contre tous" (Léviathan)','Lévi-Strauss : prohibition de l\'inceste = passage nature → culture','Freud : la culture = refoulement des pulsions (Malaise dans la civilisation)','Hegel : la culture comme réalisation progressive de la liberté humaine'] },
      { id: 'p3', title: 'L\'Individu et la Société',
        summary: 'L\'individu est-il naturellement social ou est-il libre face au groupe ? Aristote affirme que "l\'homme est un animal politique" (zôon politikon) : il ne peut se réaliser qu\'au sein de la cité. À l\'opposé, les contractualistes (Hobbes, Locke, Rousseau) imaginent un "état de nature" pré-social à partir duquel les hommes passent un contrat social pour fonder la société.\n\nPour Marx, la société est divisée en classes sociales antagonistes (bourgeoisie vs prolétariat), et la conscience individuelle est déterminée par les conditions matérielles d\'existence ("l\'être social détermine la conscience"). Sartre, à l\'inverse, affirme que l\'individu est fondamentalement libre et responsable, même face à la pression du groupe : "L\'enfer, c\'est les autres" ne nie pas la liberté mais souligne la difficulté de l\'altérité.',
        keyPoints: ['Aristote : "l\'homme est un animal politique" — nature sociale','Contrat social (Hobbes, Locke, Rousseau) : fondement de la société politique','Rousseau : volonté générale — souveraineté du peuple','Tocqueville : danger du conformisme et de la tyrannie de la majorité','Marx : lutte des classes, conscience déterminée par l\'économie','Sartre : liberté individuelle face au groupe, responsabilité totale'] },
      { id: 'p4', title: 'Conscience et Inconscient',
        summary: 'Pour Descartes (XVIIe s.), la conscience est la seule certitude absolue : "Cogito ergo sum" (Je pense donc je suis). Le sujet conscient de lui-même est le fondement de toute connaissance. Cette vision est révolutionnée au XXe siècle par Freud, qui découvre l\'inconscient : une partie du psychisme inaccessible à la conscience, siège des désirs refoulés, des traumatismes et des pulsions.\n\nFreud développe deux topiques : la première distingue inconscient, préconscient et conscient ; la seconde distingue le ça (pulsions), le moi (instance médiatrice) et le surmoi (intériorisation des interdits sociaux). Les rêves, lapsus et actes manqués sont des "voies royales" vers l\'inconscient. Sartre critique l\'inconscient en lui opposant la notion de "mauvaise foi" : se mentir à soi-même pour fuir sa liberté.',
        keyPoints: ['Descartes : "Cogito ergo sum" — conscience comme 1ère certitude','Freud : l\'inconscient = siège des désirs refoulés et des traumatismes','1ère topique : inconscient / préconscient / conscient','2e topique : ça (pulsions) / moi (médiateur) / surmoi (interdits)','Voies royales : rêves, lapsus, actes manqués → accès à l\'inconscient','Sartre contre Freud : "mauvaise foi" remplace l\'inconscient'] },
      { id: 'p5', title: 'La Liberté',
        summary: 'La liberté est l\'une des questions centrales de la philosophie : sommes-nous libres dans un monde déterminé ? Le libre arbitre suppose que l\'homme peut choisir indépendamment de toute contrainte. Pour Spinoza, cette croyance est une illusion : tout est déterminé par des causes nécessaires, et la liberté consiste à comprendre ces causes (amor fati).\n\nKant distingue la liberté naturelle (absente, car soumise aux lois de la nature) et la liberté morale : la capacité de se donner à soi-même une loi morale universelle (l\'impératif catégorique). Pour Sartre, l\'homme est "condamné à être libre" : l\'existence précède l\'essence, il n\'y a pas de nature humaine préfixée, on se définit totalement par ses choix et ses actes.',
        keyPoints: ['Libre arbitre : capacité de choisir indépendamment de toute cause','Spinoza : tout est déterminé — la liberté = connaissance des causes','Kant : liberté morale — impératif catégorique ("agis comme si ta maxime...")','Sartre : "L\'existence précède l\'essence" — l\'homme se crée par ses choix','Sartre : "condamné à être libre" — pas d\'excuse, responsabilité totale','Liberté positive (agir librement) vs négative (absence de contraintes) — Berlin'] },
      { id: 'p6', title: 'L\'État',
        summary: 'L\'État est l\'organisation politique d\'une communauté sur un territoire délimité, avec une population et un gouvernement souverain. Weber définit l\'État comme l\'institution qui détient le "monopole de la violence physique légitime" : lui seul peut légalement recourir à la force. Il distingue trois formes de légitimité : traditionnelle (le roi), charismatique (le chef inspiré) et légale-rationnelle (l\'État de droit moderne).\n\nMontesquieu préconise la séparation des pouvoirs (exécutif, législatif, judiciaire) pour prévenir la tyrannie. L\'État de droit soumet le pouvoir politique au respect du droit et des libertés fondamentales. Marx, à l\'opposé, voit dans l\'État un instrument de domination de la classe dirigeante, appelé à "dépérir" dans la société communiste. Les anarchistes (Bakounine, Proudhon) nient toute légitimité à l\'État.',
        keyPoints: ['État : territoire + population + gouvernement souverain (3 éléments)','Weber : monopole de la violence légitime — 3 types de légitimité','Montesquieu : séparation des pouvoirs (exécutif/législatif/judiciaire)','État de droit : pouvoir soumis à la Constitution et aux droits fondamentaux','Marx : l\'État = instrument de classe, doit "dépérir" sous le communisme','Anarchisme (Proudhon, Bakounine) : refus de toute autorité étatique'] },
    ],
    flashcards: [
      { question: 'Qu\'est-ce que le "cogito" de Descartes ?', answer: '"Cogito ergo sum" (Je pense donc je suis) — la conscience de soi comme certitude première, indubitable' },
      { question: 'Comment Freud définit-il l\'inconscient ?', answer: 'Partie du psychisme inaccessible à la conscience, siège des désirs refoulés, traumatismes et pulsions non censurées' },
      { question: 'Qu\'est-ce que l\'Ubuntu en philosophie africaine ?', answer: '"Je suis parce que nous sommes" — l\'identité humaine est fondamentalement communautaire et relationnelle' },
      { question: 'Pourquoi Sartre dit-il que l\'homme est "condamné à être libre" ?', answer: 'Parce que l\'existence précède l\'essence : l\'homme n\'a pas de nature fixée, il se définit entièrement par ses choix et en assume la pleine responsabilité' },
      { question: 'Quelle est la définition de l\'État selon Weber ?', answer: 'L\'institution qui détient le monopole de la violence physique légitime sur un territoire' },
      { question: 'Qu\'est-ce que l\'impératif catégorique de Kant ?', answer: '"Agis de telle sorte que la maxime de ton action puisse être érigée en loi universelle" — principe de la morale kantienne' },
    ],
    quiz: [
      { question: 'Pour Hobbes, pourquoi les hommes acceptent-ils l\'État ?', options: ['Par amour du bien commun','Pour fuir la guerre de tous contre tous','Pour respecter la loi divine','Pour développer la culture'], correct: 1, explanation: 'Hobbes pense que l\'état de nature est une guerre permanente ("homo homini lupus"). Les hommes cèdent leur liberté au Léviathan (l\'État) en échange de la sécurité.' },
      { question: 'Quelle formule résume la philosophie existentialiste de Sartre ?', options: ['"Cogito ergo sum"','"Je suis parce que nous sommes"','"L\'existence précède l\'essence"','"La liberté des uns s\'arrête..."'], correct: 2, explanation: 'Cette formule signifie que l\'homme n\'a pas de nature fixée à l\'avance : il existe d\'abord, puis se définit par ses choix, sans essence préalable.' },
      { question: 'Qui définit l\'État par le "monopole de la violence physique légitime" ?', options: ['Marx','Montesquieu','Max Weber','Tocqueville'], correct: 2, explanation: 'Max Weber (sociologue allemand) définit l\'État comme l\'institution qui détient, sur un territoire donné, le monopole de l\'usage légitime de la force physique.' },
      { question: 'Qu\'est-ce que la "mauvaise foi" selon Sartre ?', options: ['Mentir à autrui','Se mentir à soi-même pour fuir sa liberté et responsabilité','Rejeter la philosophie','Suivre l\'impératif catégorique'], correct: 1, explanation: 'La mauvaise foi (Sartre) consiste à se traiter comme une chose (comme si on n\'avait pas le choix) pour fuir la responsabilité de sa liberté.' },
      { question: 'Pour Spinoza, qu\'est-ce que la vraie liberté ?', options: ['Le libre arbitre total','L\'ignorance des causes','La connaissance des causes nécessaires qui nous déterminent','L\'obéissance à l\'État'], correct: 2, explanation: 'Spinoza est déterministe : tout est nécessaire. La liberté n\'est pas l\'absence de causes mais la compréhension de ces causes — "amor fati" (amour du destin).' },
      { question: 'Aristote pense que l\'homme est par nature...', options: ['Solitaire et guerrier','Un animal politique (zôon politikon)','Libre de tout lien social','Déterminé par son inconscient'], correct: 1, explanation: 'Pour Aristote, l\'homme est un "animal politique" : il ne peut se réaliser et accéder au bonheur (eudaimonia) qu\'au sein de la cité (polis).' },
    ]
  },
  maths: {
    label: 'Mathématiques', icon: '📐', color: '#2980B9',
    chapters: [
      { id: 'm1', title: 'Algèbre : Compositions d\'applications',
        summary: 'Une application f : E → F associe à chaque élément de E un unique élément de F. La composée de f et g, notée g∘f, est l\'application qui applique d\'abord f, puis g : (g∘f)(x) = g(f(x)). La composition est une opération fondamentale sur les applications.\n\nPropriétés essentielles : la composition est associative (h∘g)∘f = h∘(g∘f) mais généralement non commutative (g∘f ≠ f∘g). L\'application identité id_E vérifie f∘id_E = id_F∘f = f. Si f est bijective, son inverse f⁻¹ vérifie f⁻¹∘f = id_E et f∘f⁻¹ = id_F. La composition de deux bijections est une bijection, et (g∘f)⁻¹ = f⁻¹∘g⁻¹.',
        keyPoints: ['(g∘f)(x) = g(f(x)) : on applique d\'abord f, puis g','Non-commutativité : g∘f ≠ f∘g en général','Associativité : (h∘g)∘f = h∘(g∘f) toujours vraie','Identité : f∘id = id∘f = f','Inverse : (g∘f)⁻¹ = f⁻¹∘g⁻¹ si f et g sont bijectives','Image : (g∘f)(A) = g(f(A)) pour tout sous-ensemble A'] },
      { id: 'm2', title: 'Factorisation par la méthode de Hörner',
        summary: 'La méthode de Hörner (ou division synthétique) est un algorithme efficace pour diviser un polynôme P(x) de degré n par un binôme (x – a). Si P(a) = 0, le théorème de factorisation garantit que (x – a) est un facteur de P(x), et Hörner donne directement le quotient Q(x) de degré n–1.\n\nLe tableau de Hörner s\'établit en plaçant les coefficients de P(x) en ligne, avec la valeur a à gauche. On descend le premier coefficient, puis on multiplie par a et additionne successivement. Si le dernier terme est 0, (x–a) divise P(x). Cette méthode permet aussi de calculer P(a) très efficacement (évaluation de polynôme). Pour les racines multiples, si P(a) = P\'(a) = 0, alors (x–a)² est facteur.',
        keyPoints: ['Condition : P(a) = 0 ⟹ (x – a) | P(x) (théorème de factorisation)','Tableau Hörner : descendre + multiplier par a + additionner','Résultat : P(x) = (x – a) × Q(x) + reste (reste = 0 si a racine)','Racine double : P(a) = 0 ET P\'(a) = 0 ⟹ (x–a)² facteur','Complexité : O(n) opérations vs O(n²) pour la division classique','Application : résolution d\'équations polynomiales de degré ≥ 3'],
        fiche: 'MÉTHODE DE HÖRNER\n\nEx: P(x) = 2x³ – 3x² – 11x + 6, a = 3\n\nCoeffs : | 2 | –3 | –11 |  6 |\nHörner  :      6     9   –6\nRésultat: | 2 |  3 |  –2 |  0 |\n\nDonc : P(x) = (x – 3)(2x² + 3x – 2)\nFactorisation complète : (x–3)(2x–1)(x+2)' },
      { id: 'm3', title: 'Probabilités et Variables Aléatoires',
        summary: 'Les probabilités mesurent la vraisemblance d\'évènements aléatoires. Pour une variable aléatoire discrète X prenant les valeurs x₁, x₂, ..., xₙ avec des probabilités p₁, p₂, ..., pₙ, on définit l\'espérance E(X) = Σ xᵢpᵢ (valeur moyenne attendue), la variance V(X) = E(X²) – [E(X)]² (dispersion), et l\'écart-type σ(X) = √V(X).\n\nLa loi binomiale B(n, p) modélise n répétitions indépendantes d\'une expérience de Bernoulli (succès/échec) avec une probabilité p de succès. P(X = k) = C(n,k) × pᵏ × (1–p)^(n–k). Son espérance vaut E(X) = np et sa variance V(X) = np(1–p). La loi binomiale est fondamentale pour modéliser des phénomènes de type "nombre de succès parmi n essais".',
        keyPoints: ['P(A∪B) = P(A) + P(B) – P(A∩B) (formule d\'addition)','Probabilité conditionnelle : P(A|B) = P(A∩B)/P(B)','Indépendance : A et B indépendants ⟺ P(A∩B) = P(A)×P(B)','E(X) = Σ xᵢ×P(X=xᵢ) ; V(X) = E(X²) – [E(X)]²','Loi binomiale B(n,p) : P(X=k) = C(n,k)×pᵏ×(1–p)^(n–k)','E(X) = np ; V(X) = np(1–p) pour B(n,p)'] },
    ],
    flashcards: [
      { question: 'Que vaut (g∘f)(x) ?', answer: 'g(f(x)) — on applique d\'abord f, puis on applique g au résultat obtenu' },
      { question: 'Quelle est la condition pour que (x – a) soit un facteur de P(x) ?', answer: 'P(a) = 0 (théorème des racines de polynômes)' },
      { question: 'Formule de l\'espérance E(X) pour une loi binomiale B(n, p) ?', answer: 'E(X) = n × p' },
      { question: 'Formule de la variance V(X) pour une loi binomiale B(n, p) ?', answer: 'V(X) = n × p × (1 – p)' },
      { question: 'Quelle est la formule de P(A|B) ?', answer: 'P(A|B) = P(A∩B) / P(B), avec P(B) ≠ 0' },
      { question: 'Si f et g sont bijectives, comment calculer (g∘f)⁻¹ ?', answer: '(g∘f)⁻¹ = f⁻¹∘g⁻¹ (on inverse l\'ordre et chaque application)' },
    ],
    quiz: [
      { question: 'Si P(3) = 0 pour P(x) = x³ – 6x² + 11x – 6, quel est un facteur de P(x) ?', options: ['(x + 3)','(x – 3)','(x – 6)','(x + 6)'], correct: 1, explanation: 'Si P(a) = 0, alors (x – a) est un facteur. P(3) = 27–54+33–6 = 0, donc (x–3) divise P(x).' },
      { question: 'Dans B(10 ; 0,3), quelle est l\'espérance E(X) ?', options: ['3','0,3','7','1'], correct: 0, explanation: 'E(X) = n×p = 10×0,3 = 3. L\'espérance de la loi binomiale est le nombre moyen de succès.' },
      { question: 'Quelle est la variance V(X) pour X ∼ B(20 ; 0,4) ?', options: ['8','4,8','80','12'], correct: 1, explanation: 'V(X) = np(1–p) = 20×0,4×0,6 = 4,8.' },
      { question: 'P(A∪B) quand A et B sont incompatibles (disjoints) ?', options: ['P(A) × P(B)','P(A) + P(B) – P(A∩B)','P(A) + P(B)','P(A∩B)'], correct: 2, explanation: 'Si A∩B = ∅, alors P(A∩B) = 0, donc P(A∪B) = P(A) + P(B).' },
      { question: 'Quelle est la valeur de (g∘f)⁻¹ si f et g sont bijectives ?', options: ['f⁻¹∘g⁻¹','g⁻¹∘f⁻¹','(f∘g)⁻¹','f⁻¹+g⁻¹'], correct: 0, explanation: 'La règle d\'inversion des composées : (g∘f)⁻¹ = f⁻¹∘g⁻¹. On inverse chaque bijection et on échange leur ordre.' },
      { question: 'P(X=2) pour X ∼ B(5 ; 0,4) vaut...', options: ['0,346','0,230','0,346 × 5','0,4²'], correct: 0, explanation: 'P(X=2) = C(5,2)×(0,4)²×(0,6)³ = 10×0,16×0,216 = 0,3456 ≈ 0,346.' },
    ]
  },
  physique: {
    label: 'Physique-Chimie', icon: '⚗️', color: '#E67E22',
    chapters: [
      { id: 'sc1', title: 'Énergie Électrique',
        summary: 'L\'énergie électrique est une forme d\'énergie produite par le déplacement de charges électriques. Elle est caractérisée par la tension U (en volts), l\'intensité I (en ampères) et la résistance R (en ohms). La loi d\'Ohm établit que U = R×I. La puissance électrique P = U×I (en watts) et l\'énergie W = P×t = U×I×t (en joules ou kilowatt-heures).\n\nL\'effet Joule (dissipation de chaleur : P = R×I²) est une perte d\'énergie à minimiser lors du transport. C\'est pourquoi l\'électricité est transportée à très haute tension (THT : 225 à 400 kV) : pour une même puissance, une tension élevée implique une intensité faible, donc des pertes Joule réduites. Les centrales (hydraulique, thermique, nucléaire, solaire, éolienne) convertissent d\'autres formes d\'énergie en énergie électrique via des alternateurs.',
        keyPoints: ['Loi d\'Ohm : U = R × I (tension = résistance × intensité)','Puissance : P = U × I = R × I² (watts)','Énergie : W = P × t = U × I × t (joules ou kWh)','Effet Joule : P_joule = R×I² — dissipation thermique, pertes','Transport THT (225–400 kV) : réduit pertes Joule par ↑U et ↓I','Alternateur : conversion énergie mécanique → électrique'] },
      { id: 'sc2', title: 'Énergie Nucléaire',
        summary: 'L\'énergie nucléaire repose sur deux phénomènes : la fission (division d\'un noyau lourd) et la fusion (union de noyaux légers). Dans les réacteurs nucléaires civils, la fission de l\'uranium-235 (ou plutonium-239) libère une énergie considérable selon la relation E = Δm×c² d\'Einstein. Un neutron frappe un noyau d\'uranium, qui se scinde en deux noyaux plus légers en libérant 2–3 neutrons qui perpétuent la réaction en chaîne.\n\nLa réaction est contrôlée dans un réacteur par des barres de contrôle (en bore ou hafnium) qui absorbent les neutrons. Le modérateur (eau légère, eau lourde, graphite) ralentit les neutrons pour qu\'ils soient capturés efficacement. L\'énergie nucléaire représente ~10% de la production mondiale d\'électricité. Le principal problème reste la gestion des déchets radioactifs à longue durée de vie.',
        keyPoints: ['Fission : U-235 + neutron → 2 noyaux + 2–3 neutrons + énergie','E = Δm × c² : énergie issue du défaut de masse (c = 3×10⁸ m/s)','Réaction en chaîne : contrôlée (réacteur) vs incontrôlée (bombe)','Barres de contrôle (bore) : absorbent neutrons pour réguler','Modérateur : ralentit les neutrons (eau légère, graphite)','Fusion : H-2 + H-3 → He-4 + n + énergie (projet ITER)'] },
      { id: 'sc3', title: 'Ondes Mécaniques',
        summary: 'Une onde mécanique est une perturbation qui se propage dans un milieu matériel (solide, liquide, gaz) en transportant de l\'énergie sans déplacer de matière. On distingue les ondes transversales (vibration ⊥ à la propagation : vagues) et les ondes longitudinales (vibration ∥ à la propagation : son).\n\nLes caractéristiques d\'une onde périodique sont : la période T (durée d\'un cycle, en secondes), la fréquence f = 1/T (nombre de cycles par seconde, en hertz), la longueur d\'onde λ (distance entre deux crêtes consécutives, en mètres), et la célérité v = λ/T = λ×f. Le son est une onde longitudinale : dans l\'air à 20°C, v_son ≈ 340 m/s. L\'effet Doppler est le décalage de fréquence perçue quand la source ou le récepteur est en mouvement (ambulance, étoiles).',
        keyPoints: ['Onde mécanique : transport d\'énergie sans transport de matière','Transversale : vibration ⊥ propagation (vague, corde) ; Longitudinale : ∥ (son)','v = λ × f = λ / T (relation fondamentale)','Fréquences audibles : 20 Hz à 20 000 Hz pour l\'homme','Ultrasons (>20 kHz) : échographie médicale, sonar','Effet Doppler : décalage f quand source mobile (sirène, radar)'] },
      { id: 'sc4', title: 'Optique : Dualité Onde-Corpuscule',
        summary: 'La lumière présente une dualité onde-corpuscule : elle se comporte comme une onde dans la diffraction et les interférences (Young, 1801), et comme un corpuscule (photon) dans l\'effet photoélectrique et la fluorescence. Cette dualité est généralisée à toute la matière par de Broglie (1924) : toute particule de quantité de mouvement p possède une longueur d\'onde λ = h/p.\n\nL\'énergie d\'un photon est E = h×ν = hc/λ, avec h = 6,63×10⁻³⁴ J.s (constante de Planck). L\'effet photoélectrique (Einstein, 1905, prix Nobel) montre que la lumière éjecte des électrons d\'un métal uniquement si sa fréquence dépasse un seuil, quelle que soit l\'intensité : preuve de la nature corpusculaire de la lumière. La mécanique quantique (Bohr, Heisenberg, Schrödinger) naît de ces découvertes.',
        keyPoints: ['Dualité onde-corpuscule : lumière = onde ET corpuscule (photon)','Interférences (Young 1801) : preuve de la nature ondulatoire','E = h × ν = hc/λ (énergie d\'un photon, h = 6,63×10⁻³⁴ J.s)','Effet photoélectrique (Einstein 1905) : preuve de la nature corpusculaire','De Broglie (1924) : λ = h/p pour toute particule (dualité universelle)','Indice de réfraction : n = c/v (rapport célérités lumière)'] },
      { id: 'sc5', title: 'Chimie : Polymères et Matériaux',
        summary: 'Les polymères sont des macromolécules formées par la répétition d\'un grand nombre d\'unités structurales appelées monomères. La polymérisation par addition (polyaddition) n\'élimine aucun sous-produit : le polyéthylène (PE) est obtenu par polymérisation de l\'éthylène CH₂=CH₂. La polycondensation implique l\'élimination de petites molécules (eau, HCl) : c\'est le cas du polyester (PET), du polyamide (Nylon) et du polycarbonate.\n\nLes plastiques ont révolutionné l\'industrie mais posent un problème environnemental majeur : durée de vie de plusieurs siècles, microplastiques dans les océans. Les bioplastiques (acide polylactique PLA, issus du maïs) constituent une alternative partielle. Le recyclage chimique (dépolymérisation) et mécanique représentent des solutions à développer.',
        keyPoints: ['Polymère : macromolécule de monomères répétés (n × monomère → polymère)','Polyaddition : PE (polyéthylène), PP, PVC — pas de sous-produit','Polycondensation : polyester, Nylon, polycarbonate — avec élimination H₂O','Fibres synthétiques : polyester (PET), polyamide (Nylon 6-6)','Impact environnemental : microplastiques, 400 ans pour se dégrader','Bioplastiques (PLA) + recyclage : pistes pour réduire la pollution'] },
      { id: 'sc6', title: 'Chimie : Savons et Pollution',
        summary: 'Les savons sont des sels d\'acides gras à longue chaîne. La saponification est la réaction d\'un corps gras (triester) avec une base forte (NaOH → savon dur ; KOH → savon mou) qui libère du glycérol et des ions carboxylate R-COO⁻. Ces ions ont une structure amphiphile : une tête hydrophile (COO⁻ Na⁺) et une longue queue lipophile (chaîne carbonée).\n\nEn solution aqueuse, les savons forment des micelles autour des graisses, les entourant et les rendant dispersables dans l\'eau (émulsification). La pollution de l\'air (CO₂, NOₓ, PM2.5 des moteurs diesel), de l\'eau (nitrates, phosphates, hydrocarbures, métaux lourds) et des sols représente un défi environnemental mondial. Au Sénégal, la pollution de la baie de Hann (Dakar) par les rejets industriels est un problème critique.',
        keyPoints: ['Saponification : corps gras + NaOH → savon (R-COO⁻ Na⁺) + glycérol','Structure amphiphile : tête hydrophile + queue lipophile (hydrophobe)','Micelles : agglomérats sphériques qui émulsifient les graisses','Pollution air : CO₂ (GES), NOₓ, PM2.5 (particules fines)','Pollution eau : nitrates (agriculture), phosphates, métaux lourds','Traitement des eaux usées : décantation, filtration, chloration'] },
    ],
    flashcards: [
      { question: 'Formule de l\'énergie libérée dans une réaction nucléaire ?', answer: 'E = Δm × c² (avec c = 3×10⁸ m/s = vitesse de la lumière)' },
      { question: 'Relation fondamentale entre vitesse, fréquence et longueur d\'onde ?', answer: 'v = λ × f (ou v = λ/T)' },
      { question: 'Qu\'est-ce que l\'effet photoélectrique ?', answer: 'Émission d\'électrons par un métal irradié par de la lumière (fréquence seuil requise). Expliqué par Einstein en 1905 — preuve de la nature corpusculaire de la lumière' },
      { question: 'Qu\'est-ce que la saponification ?', answer: 'Réaction d\'un corps gras avec NaOH (ou KOH) → savon (R-COO⁻ Na⁺) + glycérol' },
      { question: 'Formule de la puissance électrique ?', answer: 'P = U × I = R × I² = U²/R (en watts)' },
      { question: 'Quelle est la différence entre onde transversale et longitudinale ?', answer: 'Transversale : vibration perpendiculaire à la propagation (vague). Longitudinale : vibration parallèle à la propagation (son)' },
    ],
    quiz: [
      { question: 'Quelle est l\'énergie d\'un photon de fréquence ν ?', options: ['E = m×c²','E = h×ν','E = ½mv²','E = U×I×t'], correct: 1, explanation: 'E = h×ν est la relation de Planck-Einstein. h = 6,63×10⁻³⁴ J.s. Cette formule montre que l\'énergie d\'un photon est proportionnelle à sa fréquence.' },
      { question: 'Qu\'est-ce qu\'un polymère ?', options: ['Un atome lourd','Une macromolécule formée de monomères répétés','Un acide gras','Un sel minéral'], correct: 1, explanation: 'Un polymère (polyéthylène, polyester, Nylon...) est une grande molécule formée par la répétition d\'un grand nombre de monomères par des liaisons covalentes.' },
      { question: 'Quelle est la formule de la puissance électrique ?', options: ['P = U/I','P = U×I','P = R/I','P = I/U'], correct: 1, explanation: 'La puissance électrique P = U×I (en watts). On peut aussi écrire P = R×I² (effet Joule) ou P = U²/R.' },
      { question: 'Dans la fission nucléaire, que se passe-t-il quand U-235 absorbe un neutron ?', options: ['Il émet un photon uniquement','Il se scinde en 2 noyaux + libère 2–3 neutrons + énergie','Il devient U-236 stable','Il fusionne avec un autre noyau'], correct: 1, explanation: 'La fission : U-235 + n → 2 noyaux (ex: Ba-141 + Kr-92) + 2–3 neutrons + énergie. Ces neutrons alimentent la réaction en chaîne.' },
      { question: 'L\'effet Joule est proportionnel à...', options: ['R × I','R × I²','U × I²','R × U'], correct: 1, explanation: 'P_joule = R × I². La dissipation thermique est proportionnelle au carré de l\'intensité, ce qui justifie le transport à haute tension (↑U → ↓I → ↓pertes).' },
      { question: 'Qu\'est-ce que l\'indice de réfraction n d\'un milieu ?', options: ['n = λ/v','n = c/v','n = v/c','n = f×λ'], correct: 1, explanation: 'L\'indice de réfraction n = c/v, rapport de la célérité de la lumière dans le vide (c) sur sa célérité dans le milieu (v). n ≥ 1 toujours.' },
    ]
  },
  svt: {
    label: 'SVT', icon: '🧬', color: '#16A085',
    chapters: [
      { id: 'svt1', title: 'Système Nerveux Cérébro-Spinal',
        summary: 'Le système nerveux cérébro-spinal (SNCS) est le siège des activités volontaires et de la conscience. Il comprend l\'encéphale (cerveau, cervelet, tronc cérébral) et la moelle épinière. Le cerveau est divisé en deux hémisphères, avec une organisation fonctionnelle précise : le cortex moteur (lobe frontal) contrôle les mouvements volontaires, le cortex sensitif (lobe pariétal) reçoit les informations sensorielles, le lobe occipital traite la vision.\n\nL\'influx nerveux est une variation du potentiel de membrane (dépolarisation : entrée de Na⁺, puis repolarisation : sortie de K⁺). Il se transmet d\'un neurone à l\'autre via des synapses chimiques : l\'arrivée du potentiel d\'action déclenche la libération de neurotransmetteurs (acétylcholine, dopamine, sérotonine) qui se fixent sur les récepteurs du neurone post-synaptique. Le cerveau humain contient environ 86 milliards de neurones.',
        keyPoints: ['Structure : cerveau + cervelet + tronc cérébral + moelle épinière','Neurone : corps cellulaire + axone (myélinisé = transmission rapide) + dendrites','Influx nerveux : dépolarisation (Na⁺ entrant) → repolarisation (K⁺ sortant)','Synapse chimique : neurotransmetteurs (acétylcholine, dopamine, sérotonine)','Arc réflexe : récepteur → nerf sensitif → moelle → nerf moteur → effecteur','Plasticité cérébrale : réorganisation des connexions après apprentissage ou lésion'] },
      { id: 'svt2', title: 'Activité Cardiaque et Circulation',
        summary: 'Le cœur est une double pompe musculaire assurant la circulation pulmonaire (cœur droit → poumons → cœur gauche : oxygénation du sang) et la circulation systémique (cœur gauche → corps → cœur droit : distribution de l\'oxygène). Sa fréquence cardiaque normale est de 60–80 battements par minute (bpm) au repos. Le cycle cardiaque se divise en systole (contraction des ventricules, ~0,3 s) et diastole (relâchement, ~0,5 s).\n\nL\'automatisme cardiaque est assuré par le nœud sinusal (pacemaker naturel, situé dans l\'oreillette droite). L\'électrocardiogramme (ECG) enregistre l\'activité électrique du cœur. La pression artérielle normale est de 120/80 mmHg (systolique/diastolique). L\'hypertension artérielle (>140/90) est le premier facteur de risque cardiovasculaire mondial.',
        keyPoints: ['Double circulation : petite (pulmonaire) + grande (systémique)','Systole : contraction ventricules (~0,3 s) ; Diastole : relâchement (~0,5 s)','FC normale : 60–80 bpm au repos ; Bradycardie <60, Tachycardie >100','PA normale : 120/80 mmHg ; HTA > 140/90 : 1er facteur de risque CV','Nœud sinusal : pacemaker naturel (60–100 impulsions/min)','Régulation : sympathique (↑FC) vs parasympathique (↓FC, nerf vague)'] },
      { id: 'svt3', title: 'Régulation de la Glycémie',
        summary: 'La glycémie est la concentration de glucose dans le sang, normalement entre 0,8 et 1,1 g/L à jeun. Ce paramètre est maintenu constant (homéostasie) par deux hormones antagonistes sécrétées par le pancréas endocrine (îlots de Langerhans) : l\'insuline (cellules β) et le glucagon (cellules α).\n\nEn cas d\'hyperglycémie (repas, stress), les cellules β sécrètent l\'insuline qui favorise l\'entrée du glucose dans les cellules, la glycogénèse (stockage en glycogène dans le foie et muscles) et la lipogenèse. En cas d\'hypoglycémie (jeûne, effort), les cellules α sécrètent le glucagon qui stimule la glycogénolyse (glycogène → glucose) et la néoglucogenèse (synthèse de glucose à partir d\'acides aminés). Le diabète de type 1 résulte d\'une destruction auto-immune des cellules β ; le type 2 d\'une résistance à l\'insuline.',
        keyPoints: ['Glycémie normale : 0,8–1,1 g/L à jeun (homéostasie)','Hyperglycémie → insuline (cellules β du pancréas) → glycogénèse','Hypoglycémie → glucagon (cellules α) → glycogénolyse','Glycogénèse : glucose → glycogène (foie, muscles) = stockage','Glycogénolyse : glycogène → glucose (mobilisation des réserves)','Diabète T1 : pas d\'insuline (auto-immunité) ; T2 : résistance à l\'insuline'] },
      { id: 'svt4', title: 'Immunologie',
        summary: 'Le système immunitaire protège l\'organisme contre les agents pathogènes (virus, bactéries, parasites) et les cellules cancéreuses. Il fonctionne à deux niveaux : l\'immunité innée (non spécifique, immédiate) et l\'immunité adaptative (spécifique, avec mémoire).\n\nL\'immunité innée comprend les barrières physiques (peau, muqueuses), la phagocytose (macrophages, neutrophiles), l\'inflammation et les cellules NK. L\'immunité adaptative mobilise les lymphocytes B (immunité humorale : production d\'anticorps spécifiques contre l\'antigène) et les lymphocytes T (immunité cellulaire : lymphocytes T cytotoxiques qui détruisent les cellules infectées). La vaccination crée une mémoire immunitaire sans provoquer la maladie. Le SIDA (VIH) détruit les lymphocytes T4 (CD4), effondrant le système immunitaire.',
        keyPoints: ['Immunité innée : non spécifique, rapide (peau, phagocytes, NK)','Antigène : molécule étrangère reconnue par les lymphocytes','Lymphocytes B → anticorps (immunoglobulines) : immunité humorale','Lymphocytes T cytotoxiques : tuent les cellules infectées (immunité cellulaire)','Mémoire immunitaire : 2e réponse plus rapide et intense (base du vaccin)','VIH/SIDA : destruction des lymphocytes T4 → immunodépression'] },
      { id: 'svt5', title: 'Génétique et Hérédité',
        summary: 'Le génome humain contient environ 3 milliards de paires de bases d\'ADN réparties en 46 chromosomes (23 paires). Chaque chromosome porte des milliers de gènes. Les différentes versions d\'un gène sont des allèles. Un individu est diploïde (2 allèles par gène) : si les deux allèles sont identiques, il est homozygote ; s\'ils sont différents, il est hétérozygote.\n\nLa méiose est la division cellulaire qui produit les gamètes (spermatozoïdes, ovules) haploïdes (n = 23 chromosomes). Elle comprend deux divisions successives et introduit de la diversité génétique par enjambement (crossing-over) lors de la méiose I. La fécondation rétablit la diploïdie (2n = 46). Les lois de Mendel décrivent la transmission des caractères héréditaires : uniformité des F1 (1ère loi), ségrégation des allèles (2e loi), indépendance de deux caractères (3e loi).',
        keyPoints: ['Génome humain : 46 chromosomes (23 paires), ~20 000 gènes','Diploïde (2n=46) pour les cellules somatiques ; haploïde (n=23) pour les gamètes','Méiose : division réductrice, crossing-over → diversité génétique','Allèles dominants vs récessifs : l\'allèle dominant masque le récessif','1ère loi Mendel : uniformité F1 (hybrides identiques)','2e loi : ségrégation 3/4 - 1/4 en F2 (croisement Aa × Aa)'] },
    ],
    flashcards: [
      { question: 'Quel est le rôle de l\'insuline dans la régulation de la glycémie ?', answer: 'Diminuer la glycémie : favorise l\'entrée du glucose dans les cellules, la glycogénèse (stockage en glycogène) et la lipogenèse' },
      { question: 'Quelle est la glycémie normale à jeun ?', answer: '0,8 à 1,1 g de glucose par litre de sang' },
      { question: 'Qu\'est-ce qu\'un anticorps ?', answer: 'Immunoglobuline produite par les lymphocytes B, qui reconnaît et neutralise spécifiquement un antigène' },
      { question: 'Quelle est la différence entre mitose et méiose ?', answer: 'Mitose : 2 cellules filles diploïdes identiques (2n). Méiose : 4 cellules haploïdes (n) pour la reproduction sexuée' },
      { question: 'Quelle hormone est sécrétée en cas d\'hypoglycémie et quel est son effet ?', answer: 'Le glucagon (cellules α du pancréas) : stimule la glycogénolyse (glycogène → glucose) pour remonter la glycémie' },
      { question: 'Comment fonctionne la synapse chimique ?', answer: 'L\'arrivée de l\'influx déclenche la libération de neurotransmetteurs dans la fente synaptique, qui se fixent sur les récepteurs du neurone post-synaptique' },
    ],
    quiz: [
      { question: 'Quelle hormone est sécrétée en réponse à une hyperglycémie ?', options: ['Glucagon','Adrénaline','Insuline','Cortisol'], correct: 2, explanation: 'En cas d\'hyperglycémie, les cellules β des îlots de Langerhans du pancréas sécrètent l\'insuline pour ramener la glycémie à la normale.' },
      { question: 'Combien de chromosomes possède un gamète humain ?', options: ['46','23','92','48'], correct: 1, explanation: 'Après la méiose, les gamètes sont haploïdes (n = 23 chromosomes). La fécondation rétablit 2n = 46 chromosomes dans le zygote.' },
      { question: 'Quelle est la différence entre lymphocytes B et T ?', options: ['B = cellulaire, T = humorale','B produit les anticorps (humorale), T détruit les cellules infectées (cellulaire)','B et T ont exactement le même rôle','B est produit dans le thymus, T dans la moelle'], correct: 1, explanation: 'Lymphocytes B → immunité humorale (anticorps). Lymphocytes T cytotoxiques → immunité cellulaire (destruction des cellules infectées).' },
      { question: 'Qu\'est-ce que la plasticité cérébrale ?', options: ['La dureté du crâne','La capacité du cerveau à se réorganiser après apprentissage ou lésion','La fluidité du liquide cérébrospinal','La flexibilité des méninges'], correct: 1, explanation: 'La plasticité synaptique/cérébrale est la capacité du cerveau à créer de nouvelles connexions ou à en renforcer d\'existantes — base de l\'apprentissage et de la récupération après AVC.' },
      { question: 'Quel est le pacemaker naturel du cœur ?', options: ['Nœud auriculo-ventriculaire','Faisceau de His','Nœud sinusal','Fibres de Purkinje'], correct: 2, explanation: 'Le nœud sinusal (situé dans l\'oreillette droite) génère spontanément des impulsions à 60–100/min et est le pacemaker naturel du cœur.' },
      { question: 'En cas d\'hypoglycémie, le glucagon provoque...', options: ['La glycogénèse','La lipogenèse','La glycogénolyse (glycogène → glucose)','La sécrétion d\'insuline'], correct: 2, explanation: 'Le glucagon (sécrété par les cellules α du pancréas) stimule la glycogénolyse hépatique (dégradation du glycogène en glucose) pour remonter la glycémie.' },
    ]
  },
  francais: {
    label: 'Français', icon: '📚', color: '#C0392B',
    chapters: [
      { id: 'fr1', title: 'Le Surréalisme',
        summary: 'Le surréalisme est né officiellement en 1924 avec la publication du Manifeste du Surréalisme d\'André Breton. Héritier du dadaïsme et profondément influencé par la psychanalyse de Freud, il cherche à libérer l\'écriture et l\'art de la censure de la raison consciente. La technique de l\'écriture automatique consiste à écrire sans contrôle de la raison, en laissant jaillir l\'inconscient.\n\nEn Afrique francophone, le surréalisme influence profondément la Négritude, mouvement littéraire fondé par Aimé Césaire (Martinique), Léopold Sédar Senghor (Sénégal) et Léon-Gontran Damas (Guyane) dans les années 1930. La Négritude revendique l\'identité africaine, la beauté de la culture noire et la dignité des peuples colonisés, en réponse à l\'assimilation coloniale. Senghor développe l\'esthétique du "rythme nègre" et de l\'image-analogie.',
        keyPoints: ['Fondateur : André Breton, Manifeste (1924) — libérer l\'inconscient','Techniques : écriture automatique, collage, "cadavre exquis", dérive','Influences : Freud (inconscient), Rimbaud ("dérèglement des sens")','Auteurs : Breton, Aragon, Éluard, Apollinaire (précurseur)','Négritude (1930s) : Césaire, Senghor, Damas — identité africaine','Esthétique négro-africaine : rythme, image-analogie, lyrisme de la parole'] },
      { id: 'fr2', title: 'Apollinaire, Aragon, Éluard, Césaire, Senghor',
        summary: 'Guillaume Apollinaire (1880–1918) inaugure la modernité poétique avec Alcools (1913) : il supprime la ponctuation, juxtapose des images insolites et mêle tradition (alexandrin) et rupture (vers libres). Son "Calligramme" explore la spatialisation du texte. Louis Aragon et Paul Éluard incarnent le surréalisme politique : Éluard\'s "Liberté" (1942), répandu clandestinement par l\'aviation britannique, est l\'un des poèmes de la Résistance les plus célèbres.\n\nAimé Césaire (1913–2008) est l\'auteur du "Cahier d\'un retour au pays natal" (1939), long poème en prose qui mêle surréalisme et dénonciation du colonialisme. Il forge le concept de Négritude comme une "arme miraculeuse" de résistance culturelle. Léopold Sédar Senghor (1906–2001), premier président du Sénégal, publie Chants d\'Ombre (1945) et Hosties Noires (1948), explorant la beauté de l\'Afrique et la tragédie de la colonisation avec un lyrisme d\'une grande richesse musicale.',
        keyPoints: ['Apollinaire "Alcools" (1913) : suppression ponctuation, images surréalistes','Calligrammes : poèmes-tableaux, espace typographique comme matière poétique','Aragon "Les Yeux d\'Elsa" (1942) : amour et résistance, néo-romantisme','Éluard "Liberté" (1942) : anaphore ("Sur..."), hymne à la résistance','Aimé Césaire "Cahier" (1939) : Négritude, surréalisme, anti-colonialisme','Senghor "Chants d\'Ombre" (1945) : lyrisme africain, rythme et image-analogie'] },
      { id: 'fr3', title: 'Esthétique des Genres Littéraires',
        summary: 'La littérature se divise en trois grands genres depuis Aristote : la poésie (expression du moi et du monde), le roman (récit en prose) et le théâtre (représentation sur scène). Chaque genre possède des codes spécifiques que le candidat doit maîtriser pour l\'analyse et la production de textes.\n\nLa tragédie (Corneille, Racine) obéit à des règles strictes : unités de temps (24h), de lieu et d\'action, personnages nobles, conflit entre devoir et passion, fin malheureuse et catharsis. La comédie (Molière) vise le rire et la critique sociale avec des personnages ordinaires. Le drame romantique (Hugo, XIXe s.) mélange tragique et comique, brise les unités classiques et met en scène le peuple. Le roman réaliste (Balzac, Zola) prétend représenter fidèlement la réalité sociale.',
        keyPoints: ['Trois genres : poésie (lyrisme), roman (récit), théâtre (représentation)','Tragédie : règle des 3 unités, personnages nobles, catharsis, fin malheureuse','Comédie : personnages ordinaires, satire des mœurs, dénouement heureux','Drame romantique (Hugo) : mélange des genres, liberté créatrice','Roman réaliste (Balzac/Zola) : tableau social, personnages représentatifs','Figures clés : métaphore, comparaison, anaphore, oxymore, hyperbole'] },
      { id: 'fr4', title: 'Dissertation, Commentaire et Synthèse',
        summary: 'La dissertation littéraire et philosophique est l\'exercice central du baccalauréat. Elle consiste à répondre à une question ouverte en développant une argumentation rigoureuse sur 4 à 6 pages. La structure dialectique (thèse / antithèse / synthèse) est la plus courante, mais la structure analytique (3 aspects du même problème) est aussi acceptée.\n\nL\'introduction comporte une accroche (citation, paradoxe, exemple), la présentation du sujet et de sa problématique, et l\'annonce du plan. Chaque partie s\'ouvre sur un argument, développé avec des exemples littéraires précis, et se ferme sur une transition. La conclusion reprend la réponse à la problématique et peut ouvrir sur une question plus large. Le commentaire littéraire analyse méthodiquement un texte : situation, axes de lecture, étude des procédés stylistiques et de leurs effets.',
        keyPoints: ['Dissertation : accroche → problématique → plan → thèse/antithèse/synthèse → conclusion','Introduction : accroche + problématique + annonce du plan (≠ résumé)','Exemples littéraires : toujours nommer auteur + œuvre + passage précis','Commentaire : situation + 2–3 axes + analyse procédés + conclusion','Figures de style : métaphore, comparaison, anaphore, oxymore, gradation','Registres : lyrique, épique, comique, tragique, polémique, didactique'],
        fiche: 'PLAN DE DISSERTATION\n\nI. Introduction\n   → Accroche (citation / paradoxe)\n   → Problématique\n   → Annonce du plan\n\nII. Développement (3 parties)\n   → Argument + exemple littéraire\n   → Transition\n\nIII. Conclusion\n   → Réponse à la problématique\n   → Ouverture' },
    ],
    flashcards: [
      { question: 'Qui fonde le Surréalisme et en quelle année ?', answer: 'André Breton — Manifeste du Surréalisme en 1924 à Paris' },
      { question: 'Qu\'est-ce que la Négritude ?', answer: 'Mouvement littéraire des années 30 fondé par Césaire, Senghor et Damas : revendication de l\'identité africaine et résistance au colonialisme' },
      { question: 'Quel est le recueil majeur d\'Apollinaire (1913) ?', answer: '"Alcools" — rupture typographique (sans ponctuation), images insolites, fondement de la poésie moderne' },
      { question: 'Qu\'est-ce que la catharsis dans la tragédie (Aristote) ?', answer: 'La purification des passions (pitié et crainte) que le spectateur éprouve face aux malheurs du héros tragique' },
      { question: 'Comment construire une introduction de dissertation ?', answer: 'Accroche (citation/paradoxe) → présentation du sujet → problématique → annonce du plan (jamais de résumé)' },
      { question: 'Quel est le titre de l\'œuvre fondatrice de la Négritude par Césaire ?', answer: '"Cahier d\'un retour au pays natal" (1939) — long poème en prose mêlant surréalisme et dénonciation du colonialisme' },
    ],
    quiz: [
      { question: 'Quel poète a écrit "Cahier d\'un retour au pays natal" ?', options: ['Léopold Sédar Senghor','Paul Éluard','Aimé Césaire','Louis Aragon'], correct: 2, explanation: 'Aimé Césaire (1913–2008), poète et homme politique martiniquais, a écrit cette œuvre fondatrice de la Négritude en 1939.' },
      { question: 'Qu\'est-ce que la catharsis dans la tragédie ?', options: ['La morale de la pièce','La purification des passions (pitié et crainte)','Le dénouement heureux','Le monologue final du héros'], correct: 1, explanation: 'Aristote définit la catharsis comme la purification émotionnelle ressentie par le spectateur, qui vit par procuration les souffrances du héros.' },
      { question: 'Qui a publié "Alcools" en 1913 ?', options: ['Louis Aragon','Paul Éluard','Guillaume Apollinaire','André Breton'], correct: 2, explanation: '"Alcools" (1913) de Guillaume Apollinaire inaugure la modernité poétique française : suppression de la ponctuation, images insolites, mélange de tradition et rupture.' },
      { question: 'Quelle figure de style est l\'anaphore ?', options: ['Répétition d\'un même mot en début de vers/phrase','Comparaison avec "comme"','Opposition entre deux termes contraires','Exagération pour souligner une idée'], correct: 0, explanation: 'L\'anaphore est la répétition d\'un mot ou groupe de mots au début de vers ou phrases successifs (ex: "Sur mes cahiers d\'écolier / Sur mon pupitre et les arbres..." dans "Liberté" d\'Éluard).' },
      { question: 'Quelle est la règle des 3 unités dans la tragédie classique ?', options: ['3 actes, 3 personnages, 3 scènes','Unité de temps (24h), de lieu et d\'action','3 conflits, 3 revirements, 3 chœurs','3 parties : prologue, nœud, dénouement'], correct: 1, explanation: 'La règle des 3 unités (codifiée par Boileau) exige : 1 seule action principale, en 1 seul lieu, sur 24 heures maximum. Elle vise la vraisemblance et la concentration dramatique.' },
      { question: 'Quel registre domine dans "Liberté" d\'Éluard ?', options: ['Ironique','Épique','Lyrique','Polémique'], correct: 2, explanation: 'Le registre lyrique (expression des sentiments personnels, ici l\'amour de la liberté) domine dans "Liberté" (1942), avec l\'anaphore répétée et l\'élan émotionnel du poème.' },
    ]
  },
  anglais: {
    label: 'Anglais', icon: '🇬🇧', color: '#1ABC9C',
    chapters: [
      { id: 'an1', title: 'Grammar: Advanced Structures',
        summary: 'At Terminal level, mastering complex grammatical structures is essential. The three conditional types cover all situations: Type 1 (real/possible: "If it rains, I will stay") uses present + will; Type 2 (hypothetical present: "If I were rich, I would travel") uses past + would; Type 3 (impossible past: "If I had studied, I would have passed") uses past perfect + would have. Mixed conditionals combine elements from different types.\n\nModal verbs express nuance: must/have to (obligation), should/ought to (advice), can/could (ability/possibility), may/might (permission/low probability), need not/must not (absence of obligation vs prohibition). The passive voice (be + past participle) shifts focus from agent to action. Reported speech requires systematic tense shifts: present → past, will → would, can → could, present perfect → past perfect.',
        keyPoints: ['Type 1 conditional: If + present, will + V (real possibility)','Type 2: If + past, would + V (unreal present/future)','Type 3: If + past perfect, would have + V (impossible past)','Modal verbs: must (obligation), should (advice), might (possibility)','Passive: be + past participle — focus on action, not agent','Reported speech: tense shifts (present→past, will→would, can→could)'] },
      { id: 'an2', title: 'Essay Writing and Comprehension',
        summary: 'Effective essay writing requires a clear structure: an introduction (hook + background + thesis statement), body paragraphs (topic sentence + evidence + analysis + link), and a conclusion (restate thesis + broader implication). Each body paragraph must develop one central idea, signposted by a topic sentence. Cohesion is achieved through connectives (however, moreover, consequently, in contrast), pronoun reference, and synonyms.\n\nReading comprehension requires identifying the main idea (often in the first/last sentence of each paragraph), understanding implicit meaning (reading between the lines), deducing word meaning from context, and recognizing the author\'s tone and purpose (informative, persuasive, ironic, critical). Questions often ask to "explain in your own words", requiring paraphrase rather than direct quotation.',
        keyPoints: ['Essay structure: Introduction (hook+thesis) → Body (3 paras) → Conclusion','Topic sentence: first sentence of each paragraph — states main idea','Cohesive devices: however, moreover, on the other hand, consequently','Comprehension: main idea, implicit meaning, tone, purpose, vocabulary in context','"Explain in your own words": paraphrase, not direct quotation','Formal register: no contractions, no slang, complex sentence structures'] },
      { id: 'an3', title: 'Contemporary World: Africa & Globalization',
        summary: 'The BAC Anglais tests thematic vocabulary around contemporary global issues. Globalization refers to the increasing interconnection of economies, cultures and peoples worldwide: multinational corporations, free trade agreements, global supply chains, and cultural homogenization. While it has raised living standards in emerging economies, it has also widened inequalities and threatened local cultures.\n\nAfrica is home to the world\'s fastest-growing economies and its youngest population. Key themes include: the digital revolution (mobile banking, fintech, e-commerce), the brain drain challenge (educated Africans emigrating to Europe/USA), the entrepreneurship boom (African tech hubs: Lagos, Nairobi, Dakar), climate change impacts (Sahel desertification, coastal flooding), and access to education and healthcare. Senegal\'s economy is increasingly driven by petroleum resources, tourism, and its strategic geographic position.',
        keyPoints: ['Globalization: interconnected markets, multinationals, cultural exchange','Climate change: global warming, carbon footprint, renewable energy, COP','Africa: youngest continent (60% under 25), fastest-growing economies','Brain drain: educated Africans leaving for Europe/USA — development challenge','Mobile banking/fintech: Africa leads in mobile money (M-Pesa, Wave)','Vocabulary: sustainable, inequality, empowerment, diaspora, entrepreneurship'] },
    ],
    flashcards: [
      { question: 'When do we use the 3rd conditional ?', answer: 'For impossible/unreal situations in the past: If + past perfect, would have + past participle.\nEx: "If I had studied harder, I would have passed the exam"' },
      { question: 'What is the passive voice and when is it used ?', answer: 'Structure: be + past participle. Used to focus on the action/object rather than the agent.\nEx: "The report was written by the team"' },
      { question: 'What is a "topic sentence" ?', answer: 'The first sentence of a paragraph that states its main idea and guides the reader about what the paragraph will discuss' },
      { question: 'Give 3 linking words expressing contrast.', answer: 'However / On the other hand / Nevertheless / Yet / Although / In contrast / Despite' },
      { question: 'What does "brain drain" mean ?', answer: 'The emigration of educated/skilled people from developing countries (e.g. Africa) to wealthier ones — a development challenge' },
      { question: 'What tense shift occurs in reported speech: "I will come tomorrow" ?', answer: '"He said he would come the next day" — will → would, tomorrow → the next day' },
    ],
    quiz: [
      { question: '"If I _____ harder, I would have passed." Correct form:', options: ['study','studied','had studied','have studied'], correct: 2, explanation: '3rd conditional (impossible past): If + past perfect, would have + past participle. "If I had studied harder, I would have passed" — but I didn\'t study, so I didn\'t pass.' },
      { question: 'Which sentence is in the PASSIVE voice ?', options: ['She wrote the essay','The essay was written by her','She had written the essay','She is writing the essay'], correct: 1, explanation: '"The essay was written by her" = passive (was + past participle). The focus is on the essay, not on who wrote it.' },
      { question: 'What does "brain drain" refer to ?', options: ['A type of pollution','Medical condition affecting memory','Emigration of skilled/educated people from developing countries','Mental exhaustion from studying'], correct: 2, explanation: 'Brain drain is the large-scale emigration of educated and talented people from developing countries to wealthier ones, depriving their home countries of human capital.' },
      { question: 'Report: "I can speak French." She said she _____ speak French.', options: ['can','will','could','must'], correct: 2, explanation: 'In reported speech: can → could, will → would, may → might, must → had to. "She said she could speak French."' },
      { question: 'Which is a DEFINING relative clause ?', options: ['"My brother, who lives in Paris, is a doctor"','"The book that I borrowed was excellent"','"Dakar, which is in Senegal, is a vibrant city"','"My mother, whose car is red, is a teacher"'], correct: 1, explanation: '"The book that I borrowed was excellent" is a defining clause — it identifies which book. It has no commas. Non-defining clauses (with commas) add extra info about an already identified noun.' },
      { question: 'What is the correct structure of a Type 2 conditional ?', options: ['If + present simple, will + V','If + past simple, would + V','If + past perfect, would have + V','If + present perfect, will have + V'], correct: 1, explanation: 'Type 2 (hypothetical present/future): "If + past simple, would + infinitive". Ex: "If I had more time, I would travel more" — but I don\'t have time.' },
    ]
  }
}

const examBlanc: ExamSubject[] = [
  { subject: 'Histoire-Géographie', duration: '4h', questions: [
    'PARTIE A — HISTOIRE (10 pts)\n\n1. Définissez la Guerre Froide et expliquez ses principales caractéristiques. (4 pts)\n2. Analysez les causes et les formes de la décolonisation en Afrique noire. (6 pts)',
    'PARTIE B — GÉOGRAPHIE (10 pts)\n\n1. Décrivez le système-monde en vous appuyant sur des exemples précis. (4 pts)\n2. Présentez les atouts et les défis du développement du Sénégal. (6 pts)'
  ]},
  { subject: 'Philosophie', duration: '4h', questions: [
    'Sujet 1 — DISSERTATION\n"L\'homme est-il libre ?"\nDéveloppez une argumentation philosophique structurée (thèse/antithèse/synthèse) en vous appuyant sur les auteurs étudiés (Sartre, Spinoza, Kant, Rousseau).',
    'Sujet 2 — EXPLICATION DE TEXTE\n"Je ne suis pas libre de ne pas être libre. Ce que je dois être, j\'ai à l\'être." (Sartre)\n\n1. Dégagez l\'idée directrice du texte. (3 pts)\n2. Analysez les arguments du philosophe. (7 pts)\n3. Discutez cette position. (3 pts) + expression écrite (2 pts)'
  ]},
  { subject: 'Mathématiques (L)', duration: '3h', questions: [
    'Exercice 1 — ALGÈBRE (8 pts)\nSoit P(x) = 2x³ – 5x² – 4x + 3.\n1. Montrer que x = 3 est racine de P. (1 pt)\n2. Factoriser P(x) par Hörner. (3 pts)\n3. Résoudre P(x) = 0. (2 pts)\n4. Signe de P(x) sur ℝ. (2 pts)',
    'Exercice 2 — PROBABILITÉS (12 pts)\nUrne : 4 rouges, 6 bleues. Tirage de 3 boules avec remise.\n1. P(3 rouges) ? (2 pts)\n2. Loi de X = "nb de boules rouges". (2 pts)\n3. Calculer E(X) et V(X). (4 pts)\n4. P(X ≥ 2). (4 pts)'
  ]},
  { subject: 'Français', duration: '4h', questions: [
    'TEXTE : Extrait du "Cahier d\'un retour au pays natal" (Aimé Césaire)\n\n"Ma bouche sera la bouche des malheurs qui n\'ont point de bouche, ma voix, la liberté de celles qui s\'affaissent au cachot du désespoir."\n\nQUESTIONS (8 pts)\n1. Registre dominant ? Justifiez avec 2 exemples. (3 pts)\n2. Identifiez et nommez 2 figures de style. (3 pts)\n3. Vision du poète sur sa mission. (2 pts)',
    'PRODUCTION ÉCRITE — Choisissez UN sujet (12 pts)\n\nSujet A — DISSERTATION : "La littérature peut-elle changer le monde ?"\nArgumentation structurée appuyée sur des œuvres littéraires précises.\n\nSujet B — COMMENTAIRE : Comment Césaire exprime-t-il son engagement pour la Négritude dans cet extrait ?'
  ]},
]

const conseilsBac = [
  { icon: '📅', title: 'Planification', tip: 'Établissez un rétroplanning sur 3 mois. Révisez 2 matières/jour maximum. Alternez sujets abstraits (philo, maths) et concrets (histoire, SVT).' },
  { icon: '🧠', title: 'Mémorisation active', tip: 'Utilisez les flashcards, le mind mapping, et expliquez à voix haute. Méthode Feynman : enseigner le cours à quelqu\'un d\'autre pour consolider.' },
  { icon: '✍️', title: 'Entraînement', tip: 'Faites 2 examens blancs par matière minimum. Chronométrez-vous. Travaillez sur des sujets officiels des 5 dernières années.' },
  { icon: '💤', title: 'Sommeil & santé', tip: '8h de sommeil minimum. Le cerveau consolide les apprentissages la nuit. Pas d\'écrans 1h avant le coucher. Mangez équilibré.' },
  { icon: '🎯', title: 'Stratégie le jour J', tip: 'Lisez tout le sujet avant de commencer. Commencez par ce que vous maîtrisez. Calculez le ratio points/temps disponible.' },
  { icon: '📝', title: 'Présentation des copies', tip: 'Soignez l\'écriture et la mise en page. Introduction et conclusion complètes et aérées. Un correcteur apprécie une copie lisible et structurée.' },
  { icon: '🤝', title: 'Groupes de révision', tip: 'Révisez en groupes de 3–4. Interrogez-vous mutuellement. Expliquer à quelqu\'un renforce vos propres connaissances.' },
  { icon: '🏃', title: 'Activité physique', tip: '30 min de sport/jour améliorent la concentration et réduisent le stress. Une marche après une session d\'étude aide à consolider la mémoire.' },
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
    background: active ? '#E8651A' : 'rgba(30,27,46,0.06)',
    color: active ? '#fff' : 'rgba(30,27,46,0.60)',
    borderBottom: active ? '2px solid #E8651A' : '2px solid transparent',
  })

  const pillStyle = (active: boolean, color: string): React.CSSProperties => ({
    padding: '0.42rem 1rem',
    borderRadius: '20px',
    border: `1px solid ${active ? color : 'rgba(30,27,46,0.12)'}`,
    cursor: 'pointer',
    fontSize: '0.82rem',
    fontWeight: 600,
    fontFamily: "'Syne', sans-serif",
    background: active ? color + '20' : 'transparent',
    color: active ? color : 'rgba(30,27,46,0.60)',
    transition: 'all 0.2s',
  })

  const cardStyle: React.CSSProperties = {
    background: '#F8F6FF',
    borderRadius: '12px',
    padding: '1.2rem 1.5rem',
    marginBottom: '0.7rem',
    border: '1px solid rgba(30,27,46,0.10)',
    cursor: 'pointer',
    transition: 'all 0.2s',
  }

  const sectionStyle: React.CSSProperties = {
    background: '#FFFFFF',
    borderRadius: '14px',
    padding: '1.75rem',
    marginBottom: '1.5rem',
    border: '1px solid rgba(232,101,26,0.12)',
    boxShadow: '0 2px 12px rgba(30,27,46,0.04)',
  }

  const flippedCount = Object.values(flippedCards).filter(Boolean).length

  return (
    <div style={{ minHeight: '100vh', background: '#F7F5FF', color: '#1E1B2E', fontFamily: "'Syne', sans-serif", paddingBottom: '3rem' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #FFFFFF 0%, #EDE8FF 100%)', padding: '2rem 2.5rem 0', borderBottom: '1px solid rgba(108,41,255,0.15)' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#1E1B2E', margin: 0 }}>🎓 Mon Pass&apos;BAC</h1>
        <p style={{ color: 'rgba(30,27,46,0.50)', fontSize: '0.88rem', marginTop: '0.3rem', marginBottom: '1.5rem' }}>
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
                  <div key={ch.id} style={{ ...cardStyle, borderLeft: `3px solid ${subj.color}50` }}
                    onClick={() => setSelectedChapter(ch.id)}>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1E1B2E' }}>{ch.title}</div>
                    <div style={{ color: 'rgba(30,27,46,0.45)', fontSize: '0.78rem', marginTop: '0.3rem' }}>
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
                  {chapter.summary.split('\n\n').map((para, i) => (
                    <p key={i} style={{ color: 'rgba(30,27,46,0.85)', lineHeight: 1.8, fontSize: '0.93rem', marginBottom: '1rem' }}>{para}</p>
                  ))}
                  <div style={{ borderTop: '1px solid rgba(30,27,46,0.08)', paddingTop: '1.25rem', marginTop: '0.5rem' }}>
                    <h3 style={{ color: '#E8651A', fontSize: '0.92rem', fontWeight: 700, marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Points clés à retenir</h3>
                    <ul style={{ paddingLeft: '1.25rem', margin: 0 }}>
                      {chapter.keyPoints.map((pt, i) => (
                        <li key={i} style={{ color: 'rgba(30,27,46,0.85)', marginBottom: '0.5rem', fontSize: '0.88rem', lineHeight: 1.65 }}>{pt}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* FICHES MÉMO — Design premium engageant */}
        {activeTab === 'fiches' && (
          <div>
            {/* Header avec stats */}
            <div style={{
              background: `linear-gradient(135deg, ${subj.color}18 0%, ${subj.color}08 100%)`,
              border: `1.5px solid ${subj.color}30`,
              borderRadius: '16px',
              padding: '1.25rem 1.5rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
            }}>
              <div style={{
                width: '52px', height: '52px', borderRadius: '14px', flexShrink: 0,
                background: subj.color, display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: '24px',
                boxShadow: `0 4px 16px ${subj.color}40`,
              }}>
                {subj.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: '1rem', color: '#1E1B2E', marginBottom: '4px' }}>
                  Fiches Mémo — {subj.label}
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {[
                    [`${subj.chapters.filter(ch => ch.fiche).length} fiches`, '📄'],
                    [`${subj.chapters.filter(ch => ch.keyPoints).reduce((a, c) => a + (c.keyPoints?.length ?? 0), 0)} points clés`, '🎯'],
                    ['Révision express', '⚡'],
                  ].map(([label, icon]) => (
                    <span key={label as string} style={{
                      background: `${subj.color}18`, border: `1px solid ${subj.color}30`,
                      borderRadius: '20px', padding: '3px 10px',
                      fontSize: '11px', fontWeight: 700, color: subj.color,
                    }}>{icon} {label}</span>
                  ))}
                </div>
              </div>
            </div>

            {subj.chapters.filter(ch => ch.fiche).length === 0 ? (
              <div style={{
                background: '#fff', borderRadius: '18px', padding: '3rem 2rem',
                textAlign: 'center', border: `1.5px dashed ${subj.color}40`,
                boxShadow: '0 2px 12px rgba(30,27,46,0.04)',
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📌</div>
                <div style={{ fontWeight: 800, fontSize: '1rem', color: '#1E1B2E', marginBottom: '8px' }}>
                  Fiches bientôt disponibles
                </div>
                <p style={{ color: 'rgba(30,27,46,0.45)', fontSize: '0.88rem', maxWidth: '260px', margin: '0 auto' }}>
                  Les fiches mémo de {subj.label} seront ajoutées très prochainement.
                </p>
              </div>
            ) : subj.chapters.filter(ch => ch.fiche).map((ch, idx) => (
              <div key={ch.id} style={{
                background: '#fff',
                borderRadius: '18px',
                marginBottom: '1.25rem',
                border: '1px solid rgba(30,27,46,0.08)',
                boxShadow: '0 4px 20px rgba(30,27,46,0.06)',
                overflow: 'hidden',
              }}>
                {/* Card header */}
                <div style={{
                  background: `linear-gradient(135deg, ${subj.color} 0%, ${subj.color}CC 100%)`,
                  padding: '0.9rem 1.5rem',
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                }}>
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '8px',
                    background: 'rgba(255,255,255,0.22)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '13px', fontWeight: 900, color: '#fff', flexShrink: 0,
                  }}>{idx + 1}</div>
                  <h3 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 800, color: '#fff', flex: 1 }}>
                    {ch.title}
                  </h3>
                  <span style={{ fontSize: '10px', background: 'rgba(255,255,255,0.18)', color: '#fff', borderRadius: '6px', padding: '2px 8px', fontWeight: 700 }}>
                    FICHE
                  </span>
                </div>

                {/* Card body */}
                <div style={{ padding: '1.25rem 1.5rem' }}>
                  {/* Summary paragraphs */}
                  {ch.summary && (
                    <div style={{ marginBottom: '1rem' }}>
                      {ch.summary.split('\n\n').map((para: string, pi: number) => (
                        <p key={pi} style={{
                          color: 'rgba(30,27,46,0.80)', fontSize: '0.875rem',
                          lineHeight: 1.75, margin: '0 0 0.65rem', fontWeight: 400,
                        }}>{para}</p>
                      ))}
                    </div>
                  )}
                  {!ch.summary && ch.fiche && (
                    <p style={{
                      color: 'rgba(30,27,46,0.75)', fontSize: '0.875rem',
                      lineHeight: 1.75, margin: '0 0 1rem', fontWeight: 400,
                    }}>{ch.fiche.split('\n')[0]}</p>
                  )}

                  {/* Key points */}
                  {ch.keyPoints && ch.keyPoints.length > 0 && (
                    <div>
                      <div style={{
                        fontSize: '10px', fontWeight: 800, textTransform: 'uppercase',
                        letterSpacing: '1.5px', color: 'rgba(30,27,46,0.35)', marginBottom: '10px',
                      }}>🎯 Points clés à retenir</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                        {ch.keyPoints.map((kp: string, ki: number) => (
                          <div key={ki} style={{
                            display: 'flex', gap: '10px', alignItems: 'flex-start',
                            padding: '8px 12px',
                            background: `${subj.color}08`,
                            borderRadius: '10px',
                            border: `1px solid ${subj.color}18`,
                          }}>
                            <span style={{
                              width: '20px', height: '20px', borderRadius: '6px', flexShrink: 0,
                              background: subj.color, color: '#fff',
                              fontSize: '10px', fontWeight: 900,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>{ki + 1}</span>
                            <span style={{ fontSize: '0.83rem', color: '#1E1B2E', lineHeight: 1.5, fontWeight: 500 }}>
                              {kp}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Footer mémo pill */}
                  <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
                    <span style={{
                      fontSize: '11px', fontWeight: 700, color: subj.color,
                      background: `${subj.color}12`, border: `1px solid ${subj.color}25`,
                      borderRadius: '20px', padding: '4px 12px',
                    }}>
                      ✓ Mémorisé ? Passe aux flashcards →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* FLASHCARDS — Design amélioré avec flip 3D */}
        {activeTab === 'flashcards' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ color: subj.color, fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
                  {subj.icon} Flashcards — {subj.label}
                </h2>
                <p style={{ color: 'rgba(30,27,46,0.45)', fontSize: '0.82rem', margin: '0.3rem 0 0' }}>Cliquez sur une carte pour révéler la réponse</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ background: subj.color + '15', border: `1px solid ${subj.color}30`, borderRadius: '20px', padding: '0.35rem 0.9rem', fontSize: '0.8rem', fontWeight: 700, color: subj.color }}>
                  {flippedCount}/{subj.flashcards.length} retournées
                </div>
                <button onClick={() => setFlippedCards({})}
                  style={{ background: 'rgba(30,27,46,0.06)', border: '1px solid rgba(30,27,46,0.12)', borderRadius: '20px', padding: '0.35rem 0.9rem', fontSize: '0.8rem', fontWeight: 600, color: 'rgba(30,27,46,0.55)', cursor: 'pointer', fontFamily: "'Syne', sans-serif" }}>
                  ↺ Réinitialiser
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
              {subj.flashcards.map((fc, i) => {
                const isFlipped = !!flippedCards[i]
                return (
                  <div key={i} style={{ perspective: '1200px', height: '190px', cursor: 'pointer' }}
                    onClick={() => setFlippedCards(prev => ({ ...prev, [i]: !prev[i] }))}>
                    <div style={{
                      position: 'relative',
                      width: '100%',
                      height: '100%',
                      transformStyle: 'preserve-3d',
                      transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                      transition: 'transform 0.55s cubic-bezier(0.4, 0.2, 0.2, 1)',
                    }}>
                      {/* RECTO — Question */}
                      <div style={{
                        position: 'absolute', width: '100%', height: '100%',
                        backfaceVisibility: 'hidden',
                        background: 'linear-gradient(135deg, #F8F6FF 0%, #EDE8FF 100%)',
                        borderRadius: '16px',
                        border: `2px solid ${subj.color}25`,
                        boxShadow: '0 4px 20px rgba(108,41,255,0.08)',
                        display: 'flex', flexDirection: 'column', padding: '1.5rem',
                        boxSizing: 'border-box',
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                          <span style={{ background: subj.color, color: '#fff', borderRadius: '8px', padding: '0.2rem 0.6rem', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.04em' }}>
                            #{i + 1}
                          </span>
                          <span style={{ fontSize: '0.7rem', color: 'rgba(30,27,46,0.35)', fontWeight: 600 }}>❓ QUESTION</span>
                        </div>
                        <p style={{ color: '#1E1B2E', fontSize: '0.9rem', lineHeight: 1.6, margin: 0, flex: 1 }}>
                          {fc.question}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.75rem' }}>
                          <div style={{ height: '2px', flex: 1, background: `linear-gradient(90deg, ${subj.color}40, transparent)`, borderRadius: '2px' }} />
                          <span style={{ fontSize: '0.68rem', color: 'rgba(30,27,46,0.30)', fontWeight: 600 }}>Cliquer pour répondre</span>
                        </div>
                      </div>

                      {/* VERSO — Réponse */}
                      <div style={{
                        position: 'absolute', width: '100%', height: '100%',
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                        background: `linear-gradient(135deg, ${subj.color}12 0%, ${subj.color}22 100%)`,
                        borderRadius: '16px',
                        border: `2px solid ${subj.color}50`,
                        boxShadow: `0 4px 20px ${subj.color}20`,
                        display: 'flex', flexDirection: 'column', padding: '1.5rem',
                        boxSizing: 'border-box',
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                          <span style={{ background: subj.color, color: '#fff', borderRadius: '8px', padding: '0.2rem 0.6rem', fontSize: '0.7rem', fontWeight: 800 }}>
                            #{i + 1}
                          </span>
                          <span style={{ fontSize: '0.7rem', color: subj.color, fontWeight: 700 }}>✅ RÉPONSE</span>
                        </div>
                        <p style={{ color: '#1E1B2E', fontSize: '0.88rem', lineHeight: 1.65, margin: 0, flex: 1, fontWeight: 500 }}>
                          {fc.answer}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.75rem' }}>
                          <div style={{ height: '2px', flex: 1, background: `linear-gradient(90deg, ${subj.color}, transparent)`, borderRadius: '2px' }} />
                          <span style={{ fontSize: '0.68rem', color: subj.color, fontWeight: 700 }}>Mémorisé ✓</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* QUIZ */}
        {activeTab === 'quiz' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <h2 style={{ color: subj.color, fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
                {subj.icon} Quiz Interactif — {subj.label}
              </h2>
              <span style={{ background: subj.color + '15', border: `1px solid ${subj.color}30`, borderRadius: '20px', padding: '0.3rem 0.85rem', fontSize: '0.8rem', fontWeight: 700, color: subj.color }}>
                {subj.quiz.length} questions
              </span>
            </div>
            {subj.quiz.map((q, qi) => (
              <div key={qi} style={sectionStyle}>
                <p style={{ color: '#1E1B2E', fontWeight: 700, marginBottom: '1rem', fontSize: '0.93rem', margin: '0 0 1rem' }}>
                  <span style={{ color: subj.color, fontWeight: 800 }}>Q{qi + 1}.</span> {q.question}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '0.5rem' }}>
                  {q.options.map((opt, oi) => {
                    const selected = quizAnswers[qi] === oi
                    const isCorrect = q.correct === oi
                    let bg = 'rgba(30,27,46,0.03)'
                    let border = 'rgba(30,27,46,0.10)'
                    let color = 'rgba(30,27,46,0.70)'
                    let icon = ''
                    if (quizSubmitted) {
                      if (isCorrect) { bg = 'rgba(39,174,96,0.12)'; border = '#27AE60'; color = '#1A6B3A'; icon = ' ✅' }
                      else if (selected && !isCorrect) { bg = 'rgba(231,76,60,0.12)'; border = '#E74C3C'; color = '#9B2335'; icon = ' ❌' }
                    } else if (selected) {
                      bg = subj.color + '15'; border = subj.color; color = subj.color
                    }
                    return (
                      <button key={oi}
                        onClick={() => !quizSubmitted && setQuizAnswers(prev => ({ ...prev, [qi]: oi }))}
                        style={{ background: bg, border: `1.5px solid ${border}`, borderRadius: '10px', padding: '0.75rem 1rem', cursor: quizSubmitted ? 'default' : 'pointer', textAlign: 'left' as const, color, fontSize: '0.87rem', fontFamily: "'Syne', sans-serif", transition: 'all 0.18s', fontWeight: selected || (quizSubmitted && isCorrect) ? 600 : 400 }}>
                        <span style={{ fontWeight: 700, marginRight: '0.5rem', opacity: 0.7 }}>{String.fromCharCode(65 + oi)}.</span>{opt}{icon}
                      </button>
                    )
                  })}
                </div>
                {quizSubmitted && (
                  <div style={{ marginTop: '1rem', padding: '0.85rem 1rem', background: 'rgba(108,41,255,0.05)', borderRadius: '10px', border: '1px solid rgba(108,41,255,0.12)', color: 'rgba(30,27,46,0.80)', fontSize: '0.84rem', lineHeight: 1.65 }}>
                    💡 <strong>Explication :</strong> {q.explanation}
                  </div>
                )}
              </div>
            ))}
            {!quizSubmitted ? (
              <button
                onClick={() => setQuizSubmitted(true)}
                disabled={Object.keys(quizAnswers).length < subj.quiz.length}
                style={{ background: Object.keys(quizAnswers).length < subj.quiz.length ? 'rgba(108,41,255,0.25)' : '#E8651A', color: '#fff', border: 'none', borderRadius: '12px', padding: '0.9rem 2.5rem', fontWeight: 700, fontSize: '0.93rem', cursor: Object.keys(quizAnswers).length < subj.quiz.length ? 'not-allowed' : 'pointer', fontFamily: "'Syne', sans-serif", boxShadow: Object.keys(quizAnswers).length < subj.quiz.length ? 'none' : '0 4px 16px rgba(232,101,26,0.3)' }}>
                ✅ Valider mes réponses ({Object.keys(quizAnswers).length}/{subj.quiz.length})
              </button>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' as const }}>
                <div style={{ background: '#F8F6FF', borderRadius: '14px', padding: '1.25rem 1.75rem', border: `2px solid ${quizScore === subj.quiz.length ? '#27AE60' : quizScore >= Math.ceil(subj.quiz.length / 2) ? '#E8651A' : '#E74C3C'}`, textAlign: 'center' as const }}>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#1E1B2E' }}>{quizScore}/{subj.quiz.length}</div>
                  <div style={{ fontSize: '1.4rem', margin: '0.2rem 0' }}>{quizScore === subj.quiz.length ? '🎉' : quizScore >= Math.ceil(subj.quiz.length / 2) ? '👍' : '📚'}</div>
                  <div style={{ fontSize: '0.8rem', color: 'rgba(30,27,46,0.50)', fontWeight: 600 }}>
                    {quizScore === subj.quiz.length ? 'Parfait !' : quizScore >= Math.ceil(subj.quiz.length / 2) ? 'Bien !' : 'À retravailler'}
                  </div>
                </div>
                <button onClick={() => { setQuizAnswers({}); setQuizSubmitted(false) }}
                  style={{ background: 'rgba(30,27,46,0.06)', color: '#1E1B2E', border: '1px solid rgba(30,27,46,0.12)', borderRadius: '12px', padding: '0.85rem 1.75rem', fontWeight: 600, fontSize: '0.88rem', cursor: 'pointer', fontFamily: "'Syne', sans-serif" }}>
                  ↺ Recommencer
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
                <h3 style={{ color: '#E8651A', margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>
                  📋 {examBlanc[selectedExam].subject}
                </h3>
                <span style={{ background: 'rgba(232,101,26,0.12)', color: '#E8651A', padding: '0.22rem 0.75rem', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 700 }}>
                  ⏱ {examBlanc[selectedExam].duration}
                </span>
              </div>
              {examBlanc[selectedExam].questions.map((q, qi) => (
                <div key={qi} style={{ background: '#F7F5FF', borderRadius: '10px', padding: '1.25rem', marginBottom: '1rem', border: '1px solid rgba(30,27,46,0.08)' }}>
                  <pre style={{ whiteSpace: 'pre-wrap', fontFamily: "'Syne', sans-serif", fontSize: '0.87rem', lineHeight: 1.8, color: 'rgba(30,27,46,0.85)', margin: 0 }}>
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
            <p style={{ color: 'rgba(30,27,46,0.45)', fontSize: '0.84rem', marginBottom: '1.75rem' }}>
              Méthodes, organisation et stratégies pour maximiser tes résultats
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              {conseilsBac.map((c, i) => (
                <div key={i} style={{ background: '#FFFFFF', borderRadius: '16px', padding: '1.5rem', border: '1px solid rgba(232,101,26,0.10)', boxShadow: '0 2px 12px rgba(30,27,46,0.04)' }}>
                  <div style={{ fontSize: '1.85rem', marginBottom: '0.65rem' }}>{c.icon}</div>
                  <h3 style={{ color: '#E8651A', fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.45rem', margin: '0 0 0.45rem' }}>{c.title}</h3>
                  <p style={{ color: 'rgba(30,27,46,0.65)', fontSize: '0.86rem', lineHeight: 1.7, margin: 0 }}>{c.tip}</p>
                </div>
              ))}
            </div>
            <div style={sectionStyle}>
              <h3 style={{ color: '#E8651A', fontWeight: 800, marginBottom: '1rem', fontSize: '1rem', margin: '0 0 1rem' }}>📅 Calendrier BAC Sénégal (indicatif)</h3>
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
                  <div key={i} style={{ background: '#F7F5FF', borderRadius: '10px', padding: '0.85rem 1rem', border: '1px solid rgba(30,27,46,0.08)' }}>
                    <div style={{ color: '#E8651A', fontWeight: 700, fontSize: '0.88rem' }}>{e.mat}</div>
                    <div style={{ color: 'rgba(30,27,46,0.45)', fontSize: '0.76rem', marginTop: '0.2rem' }}>{e.info}</div>
                    <div style={{ color: 'rgba(30,27,46,0.30)', fontSize: '0.74rem' }}>Durée : {e.duree}</div>
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
