// ═══════════════════════════════════════════════════════════
// CATALOGUE OFFICIEL ETAGIA — 15 COURS PROFESSIONNELS
// Adapté pour le marché africain francophone
// ═══════════════════════════════════════════════════════════

export interface EtProduct {
  id: string; type: 'cours'|'livre'|'logiciel'|'ressource';
  title: string; author: string; price: number; cover: string;
  desc: string; longDesc: string; shortLongDesc: string;
  rating: number; sales: number; pages?: number;
  tags: string[]; status: 'published'|'draft';
  new?: boolean; bestseller?: boolean; featured?: boolean;
  fileSize?: string; fileDataUrl?: string; fileName?: string;
  createdAt: number; updatedAt: number;
}

export const ETAGIA_CATALOG: EtProduct[] = [
  {
    id: 'et_av01',
    type: 'cours',
    title: "Analyser un entretien de vente pour s'améliorer",
    author: 'ETAGIA Académie',
    price: 18900,
    cover: '🎙️',
    desc: "Décodez chaque entretien commercial pour extraire vos axes de progression.",
    longDesc: `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📚 COURS ETAGIA ACADÉMIE
ANALYSER UN ENTRETIEN DE VENTE POUR S'AMÉLIORER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Contexte
Améliorer sa technique de vente, c'est l'envie de tout commercial. Mais avant de savoir comment améliorer sa
technique, il faut d'abord savoir comment l'analyser, afin de pouvoir en extraire les axes d'amélioration. Le secret
réside notamment dans le fait de ne pas tenir compte uniquement de l'entretien de vente, mais également
d'autres éléments formant le contexte de la vente, qui ont un réel impact également.
Ainsi, dans un premier temps, nous déterminerons quels sont les éléments à analyser, puis comment les analyser
pour pouvoir s'améliorer par la suite.

A. Contexte
Avant, pendant et après lʼentretien
Un entretien de vente nʼest pas un moment isolé. Avant dʼen arriver là, le client a déjà perçu de nombreux éléments
depuis son entrée dans le point de vente. Et ce sont des éléments qui peuvent éventuellement avoir un impact sur
lʼentretien de vente. Il sʼagira donc dʼen tenir compte et de les intégrer dans lʼanalyse pour mieux comprendre le
déroulé de lʼentretien.
Tout peut potentiellement se transformer en quelque chose dʼirritant pour le client, et cela ressortira
systématiquement durant lʼentretien de vente. Le client sera moins disposé, agacé, irrité, fermé et cela compliquera
forcément les choses pour vous.
Quels sont ces éléments qui créent le contexte de la vente ?

Le rayon
Lʼétat marchand dʼun rayon (et de tout un point de vente dʼailleurs) devrait être impeccable. Pour quʼun client se
sente attendu, accueilli et respecté, cʼest une base indiscutable. Cʼest un peu comme si vous arriviez pour dîner chez
des amis, et que rien nʼétait prêt, préparé, le ménage non fait et quʼil nʼy avait rien à manger.

Quels éléments analyser ?

Ainsi, il est important que le rayon soit :
Accessible : autant que possible, tout rayon doit être dégagé de toute palette de marchandises, cartons, afin
que le client puisse circuler facilement.
Rangé : dès lʼouverture, le rayon doit être parfaitement rangé ; durant la journée, il est important que ce
rangement soit maintenu autant que possible. Retenez que le client du soir devrait pouvoir bénéficier du
même accueil que le premier client du matin.
Propre : cela semble évident, mais un rayon propre est un rayon accueillant, agréable, pour le client mais aussi
pour vous !
Éclairé : lʼéclairage du rayon nʼest pas un point à négliger, plus un rayon est sombre, plus il semble à lʼabandon,
mort, isolé.
Approvisionné : peut-être vous dites-vous quʼun rayon sans trop de stock obligera le client à se rapprocher
dʼun vendeur, donnant la possibilité de faire une vente plus importante ? Détrompez-vous, si un client avait
lʼintention de se débrouiller seul, cela lʼirritera fortement de devoir faire appel à vous pour le produit quʼil
aurait dû pouvoir trouver seul en rayon. Si en plus, il constate que vous essayez de lui vendre plus ou plus cher,
cela risque dʼêtre un échange diﬀicile pour vous.
Le personnel
Tout comme le rayon, le personnel en rayon se doit dʼêtre avenant avec le client. Cela implique :
Quʼil soit facilement identifiable pour le client : avec la tenue de lʼenseigne (propre évidemment), le port
dʼun badge avec le prénom et la fonction.
Quʼil soit disponible : on ne vous demande pas dʼattendre les bras croisés quʼun client arrive, mais dʼêtre
vigilant quant aux allées et venues des clients, afin de vous montrer disponible en cas de besoin, en saluant les
clients par exemple, en observant leur façon dʼêtre pour comprendre lorsquʼun client semble avoir besoin
dʼaide.
La préparation
Enfin, dernier point du contexte de lʼentretien de vente, il sʼagira de vous préparer à lʼentretien.
Tout dʼabord en vous intéressant à qui sont vos clients, non pas chaque client individuellement, mais en
connaissant les profils de clientèle qui viennent dans votre point de vente. Cela permet de vous préparer aux
demandes fréquentes que vous allez recevoir et à mieux comprendre vos clients.
Ensuite, bien évidemment, il sʼagira de connaitre vos produits mais également lʼensemble des process liés à la
vente. Rien de plus irritant pour la plupart des clients que de constater quʼun vendeur ne sait pas utiliser lʼordinateur
pour enregistrer une commande, vérifier lʼétat dʼun stock, éditer une facture, etc. Tout ceci sʼanticipe, afin que
lʼentretien de vente soit le plus fluide possible, pour conserver le client dans un état dʼesprit optimal.

B. Entretien de vente
Évaluer votre posture
Une fois lʼentretien de vente réalisé, il est important de prendre un temps de recul sur votre comportement durant
cette vente. Avez-vous été :
Chaleureux ?
Convaincant ?
Suﬀisamment à lʼécoute ?
Clair ?
Dynamique ?
Détendu ?

4

Exercice : Quizsolution

Sûr de vous ?
Évaluer votre connaissance du client
Un autre point à évaluer est de déterminer si votre découverte du client a été eﬀicace : avez-vous réussi à
comprendre son besoin, à déterminer ses motivations/ses freins ?
Évaluer le déroulé de la vente
Enfin, comment se sont passées les diﬀérentes étapes de la vente ? Avez-vous géré correctement la réponse aux
objections ? Avez-vous réussi à argumenter votre proposition ? Comment avez-vous vécu cette vente ?
Rappel

Les étapes dʼun entretien de vente

Exercice : Quiz

[solution n°1 p.13]

Question 1
Un rayon se doit dʼêtre, durant les heures dʼouverture : plein, propre, rangé et accessible.


Vrai



Faux

Question 2
Le contexte de lʼentretien de vente inclut :


Le rayon



Les vendeurs



La posture



La qualité des articles

Question 3
Mieux vaut un rayon vide en journée quʼun rayon peu accessible car encombré de palettes, cartons, etc.


Vrai



Faux

Question 4
Savoir réaliser un bon de commande à lʼordinateur fait partie du contexte de la vente.


Vrai



Faux

5

Comment les analyser ?

Question 5
Porter la tenue réglementaire du point de vente facilite lʼexpérience du 

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 ETAGIA ACADÉMIE — Formation professionnelle
Contexte Afrique francophone · Cas pratiques terrain
© ETAGIA — Licence accordée à l'acheteur uniquement
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    shortLongDesc: `Cours fondamental pour tout commercial souhaitant transformer chaque RDV client en leçon de maîtrise. Grille d'autoévaluation, analyse contextuelle, techniques de débrief incluses.`,
    rating: 4.8,
    sales: 0,
    pages: 45,
    fileSize: 'PDF · 45 pages',
    tags: ["vente", "entretien", "performance", "commercial"],
    status: 'published',
    new: true,
    createdAt: 1748200000000,
    updatedAt: 1748200000000,
  },
  {
    id: 'et_co02',
    type: 'cours',
    title: "Comparer objectifs et réalisations",
    author: 'ETAGIA Académie',
    price: 22900,
    cover: '🎯',
    desc: "Pilotez vos écarts entre objectifs fixés et résultats obtenus.",
    longDesc: `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📚 COURS ETAGIA ACADÉMIE
COMPARER OBJECTIFS ET RÉALISATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Contexte
Afin d'anticiper et de s'adapter aux besoins de la clientèle, l'unité commerciale doit identifier les comportements
d'achat et de consommation de la clientèle sur le marché et au sein de sa zone de chalandise, en menant des
études qualitatives et quantitatives.
L'unité commerciale doit savoir mener des études qualitatives et quantitatives qui lui permettront de caractériser
sa clientèle sur le marché local et national de façon à adapter l'oﬀre du point de vente aux besoins des diﬀérents
segments de clientèle.
Les études qualitatives permettent, d'une part, de déterminer les habitudes de consommation, les habitudes
d'achat, les facteurs culturels, sociaux et psychologiques qui influencent l'acte d'achat des consommateurs et
d'autre part, de segmenter le marché pour identifier plus précisément les cibles.
Les études quantitatives sont souvent réalisées par questionnaire auprès d'un échantillon de la population dont
les résultats chiﬀrés sont ensuite extrapolés à l'ensemble de la population étudiée. Celles-ci permettent de
redéfinir l'oﬀre ou l'une des variables du mix marketing de l'entreprise.
Objectifs
Connaître la stratégie commerciale et ses objectifs
Être capable de construire un tableau de bord
Analyser les écarts
Proposer un plan d'action
Suivre l'évolution et l'amélioration des résultats
L'analyse de la performance est nécessaire pour apprécier l'eﬀicacité commerciale d'un point de vente. Le manager
doit donc se doter d'outils pour la mesurer tels que le tableau de bord. Celui-ci va lui permettre d'avoir la
représentation de son activité, de détecter les dysfonctionnements, de l'aider dans le pilotage de son point de vente
et de bâtir un plan d'action.
De manière concrète, le tableau de bord permet de suivre l'activité du point de vente et d'eﬀectuer des comparatifs
par rapport à l'année précédente sur diﬀérents critères.

A. Concept du tableau du bord
Un tableau de bord permet au manager d'avoir une vision globale sur l'activité de ses vendeurs. Il lui permet de
piloter son activité, de prévoir et corriger les résultats de son équipe commerciale.
Pour construire le tableau de bord, il faut donc se procurer les données clés pour avoir une restitution fiable. La
collecte des données est une étape importante, car il faut s'assurer de sa fiabilité. Il faut donc interroger le CRM de
l'entreprise, extraire les données essentielles dans les bases de données. Aujourd'hui, les logiciels permettent
d'avoir des éditions de tableaux de bord automatiques.
Par exemple, le directeur d'un magasin peut éditer les chiﬀres des ventes, soit de la veille, à la semaine ou au mois
et peut établir des comparaisons avec l'année dernière.
Ces données sont ainsi historisées d'une année sur l'autre dans le système d'information et il est donc facile de
consulter les données journalières, hebdomadaires, mensuelles et annuelles sur :
Les produits (quantités vendues, marges, CA),
Les clients (nombre d'entrées dans le point de vente, nombre de passages en caisse).
Le tableau de bord contient des indicateurs jugés pertinents et en lien avec la nature de l'activité de l'entreprise. Il
existe des indicateurs d'ordre qualitatif et quantitatif, exprimés en nombre ou en pourcentage.

Construire un tableau de bord

Ces informations sont transmises essentiellement par les terminaux des caisses des points de vente puis transmises
au siège social de l'entreprise pour compiler les données et ainsi obtenir une vision globale de son activité.
Maintenant, il existe aussi des applications sur smartphone qui permettent la consultation de ces données de
manière sécurisée, en temps réel, et à distance.
Ces informations permettent de mettre en lumière la performance de l'entreprise et de cibler précisément les
dysfonctionnements et anomalies éventuels. Le manager peut ainsi prendre des décisions et mettre en place un
plan d'actions préventives ou correctives si besoin.
Un tableau de bord se matérialise comme suit :

Tableau de bord de l'équipe du secteur sud-ouest – juin 2019
Puis il peut être représenté graphiquement pour permettre de mettre en lumière les points positifs et les axes de
progrès de l'entreprise. Il peut être assorti de graphiques en courbes, camemberts, histogrammes, radars, etc.
Par exemple, le schéma ci-dessous donne une indication sur la nature de l'activité de l'entreprise et ses
performances. Un tableau de bord doit être simple à lire, avoir un rendu visuel agréable et accessible à toutes les
parties prenantes pour en faciliter la compréhension.

4

Construire un tableau de bord

Avant d'assurer la diﬀusion d'un tableau de bord, il faut donc en mesurer la pertinence, s'assurer de l'exactitude des
calculs, de la fiabilité des données, définir un responsable, le mode de diﬀusion, les personnes destinataires, le
caractère confidentiel ou non et la fréquence de diﬀusion.
Le tableau de bord doit être simple, adapté, vivant, mais surtout :
Utile → évaluer pour décider
Utilisable → synthèse facile
Utilisé → animation

B. Choix des indicateurs pertinents
Les indicateurs permettent de suivre et de mesurer l'activité commerciale d'un point de vente. Ils fournissent un
ordre de grandeur, des indications précises, des points d'appréciation sur l'état d'une situation à un instant T. Ils
doivent être fiables, pertinents, accessibles et compréhensibles.
Le choix d'un indicateur répond nécessairement aux points suivants :
Une représentation commune sans interprétation,
Ce qu'il est censé mesurer (nature, destinataire, objet, périodicité),
Comment cela est mesuré (modalités, origine, fréquence),
Comment cela est représenté,
Comment les résultats sont interprétés.
Les critères quantitatifs chiﬀrent les résultats des vendeurs en termes de coût, de rentabilité, d'activité.
Les critères qualitatifs évaluent la qualité du t

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 ETAGIA ACADÉMIE — Formation professionnelle
Contexte Afrique francophone · Cas pratiques terrain
© ETAGIA — Licence accordée à l'acheteur uniquement
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    shortLongDesc: `Apprenez à construire un tableau de bord pertinent, à identifier les dysfonctionnements et à mettre en place un plan d'action correctif structuré. Cas pratiques africains inclus.`,
    rating: 4.7,
    sales: 0,
    pages: 52,
    fileSize: 'PDF · 52 pages',
    tags: ["objectifs", "tableau de bord", "management", "KPI"],
    status: 'published',
    new: true,
    createdAt: 1748200000000,
    updatedAt: 1748200000000,
  },
  {
    id: 'et_cc03',
    type: 'cours',
    title: "Analyser et surveiller la concurrence",
    author: 'ETAGIA Académie',
    price: 19900,
    cover: '⚔️',
    desc: "Identifier, cartographier et exploiter la veille concurrentielle.",
    longDesc: `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📚 COURS ETAGIA ACADÉMIE
ANALYSER ET SURVEILLER LA CONCURRENCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Contexte
Pour apporter un conseil adapté aux demandes des prospects/clients et pour développer une argumentation
commerciale eﬀicace, le conseiller commercial actualise régulièrement ses connaissances sur les produits et
services de l'entreprise et de ses concurrents.
Pour cela, il va rechercher de l'information sur la concurrence et utiliser des outils d'analyse de la concurrence. Le
cours vise à définir ce qu'est la concurrence, distinguer la concurrence directe et indirecte, et comprendre les
enjeux pour le commercial et l'entreprise d'analyser la concurrence.

A. Objectifs du tableau de bord
Définition de la concurrence
Situation de marché dans laquelle des entreprises ou organisations proposent des oﬀres substituables en cherchant
à être préférées par les clients. (Source : MERCATOR PUBLICITOR1)
Lorsque l'on étudie la concurrence, il ne faut pas considérer que la concurrence physique. En eﬀet, la concurrence
virtuelle (provenant du commerce en ligne) joue un rôle grandissant.
C'est ainsi que parallèlement aux réseaux de banques traditionnelles que nous connaissons tels que la Ecobank ou la
SGBCI pour ne citer que ceux-là, des banques virtuelles ont fleuri comme Wave ou encore
Fortuneo Banque.
Distinguer la concurrence directe et indirecte
Concurrence directe : les concurrents directs ont la même activité, les mêmes clients et le même savoir-faire.
Concurrence indirecte : les concurrents indirects commercialisent des produits qui peuvent se substituer à ceux de
l'entreprise concernée.
Secteur d'activité

Concurrents directs

Concurrents indirects

Bricolage

Leroy Merlin et Castorama

Grande distribution :
ex. Score (rayon bricolage)

Accessoires automobiles

Feu Vert et Norauto

oscaro.com – site internet
spécialisé

Distinguer la concurrence directe et indirecte
Concurrence actuelle (ou eﬀective) : concurrence présente sur le marché aujourd'hui.
Concurrence potentielle : pressions exercées sur les entreprises en place par l'éventualité de l'entrée sur un
marché donné d'entreprises nouvelles ou existantes (concurrents potentiels).
Les concurrents potentiels représentent des entreprises qui ne sont pas présentes sur le marché aujourd'hui, mais
désireuses de s'y implanter (demain).

1 https://mercator-publicitor.fr/

Analyse de la concurrence

Repérer l'univers concurrentiel de l'entreprise
L'oﬀre de l'entreprise concernée se situe dans un univers de référence qu'il va falloir déterminer.
L'univers concurrentiel est constitué par l'ensemble des oﬀreurs sur le marché de l'entreprise.
Il comprend donc la concurrence actuelle, mais également la concurrence potentielle de l'entreprise.
L'univers concurrentiel ne comprend pas que les produits identiques à ceux de l'entreprise. Il comprend
également les produits de substitution.
Un produit de substitution est un produit qui satisfait le même besoin que le produit commercialisé par
l'entreprise. Ce produit correspond à une alternative pour le consommateur au produit vendu par l'entreprise.
Exemple

Oﬀres de substitution

Lorsqu'un particulier a besoin de lire un livre, plusieurs solutions s'oﬀrent à lui :
Acheter le livre dans une librairie,
Acheter le livre dans une grande surface traditionnelle,
Ou bien sur un site internet,
Il peut également le télécharger ou l'emprunter dans une bibliothèque.
Prenons l'exemple à présent du marché des transports, une nouvelle concurrence a vu le jour face aux moyens
traditionnels comme : la voiture, le train ou l'avion.
Celle de BlaBlaCar ou encore celle des bus Macron (Sociétés Ouibus ou Flixbus par exemple).
Étudier son univers concurrentiel de référence
Cela implique de connaître la stratégie des entreprises concurrentes, mais surtout d'anticiper leurs actions de
mercatique.
Il va falloir étudier les forces et les faiblesses de l'entreprise en comparaison avec la concurrence (diagnostic).
L'unité de mesure permettant de connaître le poids de chaque entreprise présente dans cet univers est la part de
marché.
Elle s'obtient en divisant le Chiﬀre d'Aﬀaires de l'entreprise concernée (ou quantité de produits vendus) par le
Chiﬀre d'aﬀaires global du secteur d'activité (ou quantité globale de produits vendus).
Analyser la concurrence
Utiliser les outils de veille concurrentielle :
La veille est une démarche organisée visant à améliorer la compétitivité de l'entreprise par la collecte, le traitement
d'informations et la diﬀusion de connaissances utiles à la maîtrise de son environnement et à la prise de décision.
La veille concurrentielle désigne, quant à elle, les méthodes d'analyse systématique et permanente des actions de
la concurrence.
(Source : MERCATOR PUBLICITOR1)
Utiliser le modèle des cinq forces de Porter :
Parmi les principaux apports de Michael Porter, professeur de stratégie d'entreprise à Harvard figure la matrice des
cinq forces. Il s'agit d'un outil d'analyse stratégique qui porte principalement sur la concurrence.

1 https://mercator-publicitor.fr/

4

Analyse de la concurrence

Michael Porter a défini cinq forces qui sont les suivantes :
Le pouvoir de négociation des clients,
Le pouvoir de négociation des fournisseurs,
La menace liée aux nouveaux entrants,
La menace représentée par les produits de substitution,
La rivalité des concurrents déjà présents.
L'entreprise évalue l'intensité de chacune de ses menaces qui peut s'avérer : Faible, Moyenne, Forte.
Cette étude permet donc à l'entreprise d'adapter sa stratégie ; si, par exemple, la menace des nouveaux entrants
est forte, elle peut mettre en place des programmes de fidélisation pour retenir ses clients.
Exemple :
En s'implantant sur le marché de la téléphonie mobile en 2012, Free a cassé les prix. Ce nouvel entrant a mis à mal
les opérateurs classiques de l'époque – Orange, SFR et Bouygues Télécom qui se sont vus dans l'obligation de revoi

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 ETAGIA ACADÉMIE — Formation professionnelle
Contexte Afrique francophone · Cas pratiques terrain
© ETAGIA — Licence accordée à l'acheteur uniquement
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    shortLongDesc: `De la définition de la concurrence directe/indirecte au tableau de bord concurrentiel. Méthodes de veille, outils d'analyse et argumentation commerciale face à la concurrence.`,
    rating: 4.6,
    sales: 0,
    pages: 48,
    fileSize: 'PDF · 48 pages',
    tags: ["concurrence", "veille", "stratégie", "marché"],
    status: 'published',
    new: true,
    createdAt: 1748200000000,
    updatedAt: 1748200000000,
  },
  {
    id: 'et_iv04',
    type: 'cours',
    title: "Indicateurs de gestion liés aux ventes",
    author: 'ETAGIA Académie',
    price: 16900,
    cover: '📈',
    desc: "Calculer et interpréter les KPIs clés de votre activité commerciale.",
    longDesc: `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📚 COURS ETAGIA ACADÉMIE
INDICATEURS DE GESTION LIÉS AUX VENTES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Contexte
Les indicateurs de gestion sont un outil précieux pour prévoir, suivre et analyser la performance du magasin.
Les indicateurs qui permettent de mesurer la performance du pôle vente du magasin feront lʼobjet de cette
séance. Nous eﬀectuerons également un rappel sur les indicateurs liés à la gestion des stocks. En eﬀet, avoir des
ruptures de stock peut fortement nuire au volume des ventes dʼun magasin.
Dans lʼexercice de votre futur métier dans le domaine de la vente, vous serez régulièrement amené à lire et à
interpréter ces indicateurs

A. Méthode de calcul
Rappel

Indicateurs

Selon le dictionnaire Le Larousse un indicateur est un « appareil, instrument servant à fournir des indications, des
renseignements sur la valeur d'une grandeur : indicateur de vitesse, de consommation d'essence. »
Le dictionnaire le Larousse utilise aussi le tableau de bord dʼune voiture pour expliquer ce quʼest un indicateur.
Lʼindicateur de vitesse est le compteur de vitesse : il donne lʼinformation de la vitesse à laquelle la voiture est en
train de se déplacer.
Pour une entreprise, les indicateurs fournissent également des informations comme le volume des ventes
(journalier, mensuel, annuel) ou encore la valeur du stock par exemple.
Les indicateurs dʼun tableau de bord ne sont pas toujours identiques.
En eﬀet, tout comme le tableau de bord dʼune voiture ne sera pas le même que le tableau de bord dʼun avion, le
tableau de bord dʼun commerce de proximité ne sera pas le même que celui dʼune grande surface par
exemple.
Méthode

Formules de calculs

Les indicateurs expriment le résultat dʼune opération mathématique.
Avant de commencer à présenter ces indicateurs, il est nécessaire de bien maîtriser ces notions mathématiques.
Voici un tableau regroupant les formules les plus couramment utilisées dans la construction des indicateurs :

Exercice

B. Exemples de calcul
Voici des exemples de calculs pour les 4 formules présentées précédemment :
Exemple

Taux ou Pourcentage

Soit une classe de 29 élèves dont 13 filles. Calculez le taux de filles dans cette classe.
Taux de filles dans la classe = (13 / 29) x 100 = 44.83 %
Il y a 44.83 % de filles dans cette classe.
Exemple

Taux dʼévolution

Soit un nombre dʼoﬀres dʼemploi de 1 250 oﬀres en juillet et 1 480 en Août, calculez le taux dʼévolution du
nombre dʼoﬀres dʼemploi entre juillet et août.
Taux dʼévolution = [(1 480 - 1 250) / 1 250] x 100 = + 18.4 %
Le nombre dʼoﬀres dʼemploi à augmenter de 18.4 % entre juillet et août.
Exemple

Moyenne

Soit 5 entreprises dans la zone étudiée de chacune 109, 25, 40, 4 et 54 salariés, calculez la moyenne du
nombre de salariés par entreprise.
Moyenne = (109 + 25 + 40 + 4 + 54) / 5 = 46
Il y a 46 employés en moyenne par entreprise du secteur étudié.
Exemple

Indice

Soit le nombre de demandeurs dʼemploi en Afrique francophone en 2020 (3.6 millions) et en 2021 (2.9 millions), et
lʼindice 100 qui est fixé à lʼannée 2020. Calculez lʼindice du nombre de demandeurs dʼemploi en 2021.
Indice (demandeur emploi 2021) = (2,9 / 3,6) x 100 = 80,55

II. Exercice
Question 1

[solution n°1 p.13]

Calculez le taux de réussite au baccalauréat sachant que 735 200 candidats étaient inscrits et que 689 000 ont
obtenu le diplôme.

Question 2

[solution n°2 p.13]

Calculez le taux dʼévolution du nombre de naissances en Afrique francophone entre 2020 (735 196 naissances) et 2021
(738 000 naissances).

4

Indicateurs de gestion

Question 3

[solution n°3 p.13]

Voici les superficies des pays du Maghreb.
Calculez la moyenne de la superficie des pays du Maghreb.
Superficie en millions de km2

Pays
Algérie

2,382 M km²

Libye

1,76 M km²

Maroc

0,710 M km²

Mauritanie

1,03 M km²

Tunisie

0,163 M km²

Question 4

[solution n°4 p.13]

Voici un tableau représentant la part du loyer en pourcentage dans le revenu des ménages tous les 10 ans
depuis 1980.

Sachant que lʼindice de référence (indice 100) est fixé en 1980, calculez lʼindice pour les années 1990 et 2020.

III. Indicateurs de gestion
A. Indicateurs : calculs et utilisations
Définition

Liste des principaux indicateurs liés à la vente

Ci-après une liste dʼindicateurs liés à la vente :
Indicateur

Calcul

Chiﬀre dʼAﬀaires
(CA)

Somme de toutes
les ventes dʼune
période

Marge
commerciale

Chiﬀre dʼaﬀaires
HT - Coût dʼachat
HT des
marchandises
vendues

Explication
Indicateur
primordial dans le
commerce.
Il sʼexprime en HT
dans les tableaux
de bord.
Complémentaire
au CA, cet
indicateur permet
de mesurer le
volume de marge
dégagé par le
commerce.

5

Indicateurs de gestion

Indicateur

Taux dʼévolution
du CA

Panier
moyen / ticket
moyen

Indice de vente

Taux de
réalisation de
lʼobjectif

Taux de
transformation

Rappel

Calcul

Explication

Entre 2 périodes
mai et avril par
exemple :

Permet de
constater
rapidement la
variation du CA
entre plusieurs
périodes.

(CA mai - CA
Avril) / CA
Avril x 100

CA / Nb de client
(ou de tickets)

Permet de
constater la
moyenne des
« caddies » des
clients. Le panier
moyen est en
principe exprimé
en TTC.

Nombre dʼarticles
vendus / Nombre
de transactions

Permet de
connaître la
quantité
moyenne achetée
par client, cʼest
un panier moyen
en quantité.

(Réalisé / objectif
) x 100

Ce taux de
réalisation peut
être utilisé pour
mesurer lʼatteinte
de lʼobjectif de
CA.

Nb de clients qui
ont eﬀectué un
achat / Nb de
clients qui sont
entrés dans le
magasin.

Permet de
mesurer la
performance de
la force de vente.
Cet indicateur est
très utilisé dans
les magasins de
prêt à porter par
exemple.

3 indicateurs liés à la gestion des stocks

La gestion des stocks est déterminante dans le bon déroulement dʼune journée de vente. Cʼest pour cela que
sont souvent associés des indicateurs de stocks aux indicateurs de ventes pour produire une analyse plus
pertinente de la situation.

6



━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 ETAGIA ACADÉMIE — Formation professionnelle
Contexte Afrique francophone · Cas pratiques terrain
© ETAGIA — Licence accordée à l'acheteur uniquement
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    shortLongDesc: `Méthodes de calcul des indicateurs de performance vente, formules, exemples chiffrés et exercices pratiques. Taux de transformation, panier moyen, CA/vendeur et plus.`,
    rating: 4.7,
    sales: 0,
    pages: 38,
    fileSize: 'PDF · 38 pages',
    tags: ["KPI", "vente", "indicateurs", "gestion"],
    status: 'published',
    new: true,
    createdAt: 1748200000000,
    updatedAt: 1748200000000,
  },
  {
    id: 'et_is05',
    type: 'cours',
    title: "Indicateurs de gestion des stocks",
    author: 'ETAGIA Académie',
    price: 17900,
    cover: '📦',
    desc: "Maîtrisez les indicateurs stocks pour éviter ruptures et surcoûts.",
    longDesc: `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📚 COURS ETAGIA ACADÉMIE
INDICATEURS DE GESTION DES STOCKS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Contexte
La gestion optimisée des stocks contribue à la rentabilité du point de vente.
En eﬀet, des ruptures de stock font chuter les ventes réalisées par le magasin et provoquent dans le pire des cas la
fuite des clients habituels vers des concurrents.
Inversement, stocker trop de marchandise coûte également à l'entreprise qui doit régler cette marchandise, la
stocker et prendre le risque quʼelle se détériore. Jeter de la marchandise est ce qui sʼappelle une perte sèche et
représente un coût financier non négligeable pour lʼentreprise.
En tant que membre de lʼéquipe, le vendeur participe à cet objectif dʼoptimisation des stocks et doit donc être
capable de surveiller les niveaux de stocks au travers des diﬀérents indicateurs dont il dispose.

A. Tableau de bord et les indicateurs
Définition

Tableau de bord

Selon le dictionnaire le Robert :
Tableau de bord (d'un avion, d'une voiture) : panneau où sont réunis les instruments de bord.
Les instruments de bords sont constitués de tous les témoins et les jauges qui nous permettent de surveiller le bon
état de fonctionnement dʼune voiture et de la conduire en sécurité
Pour une entreprise, le tableau de bord réunit également des instruments de mesure qui vont permettre aux
équipes dʼobtenir des informations sur « l'état de l'entreprise » et sur la façon dont ils peuvent la faire évoluer, la
conduire.
Définition

Indicateurs

Selon le dictionnaire Le Larousse :
Appareil, instrument servant à fournir des indications, des renseignements sur la valeur d'une grandeur : indicateur
de vitesse, de consommation d'essence.
Le dictionnaire le Larousse utilise aussi le tableau de bord dʼune voiture pour expliquer ce quʼest un indicateur.
Lʼindicateur de vitesse est le compteur de vitesse : il donne lʼinformation de la vitesse à laquelle la voiture est en
train de se déplacer.
Pour une entreprise, les indicateurs fournissent également des informations comme le volume des ventes
(journalier, mensuel, annuel) ou encore la valeur du stock par exemple.
Les indicateurs dʼun tableau de bord ne sont pas toujours identiques.
En eﬀet, tout comme le tableau de bord dʼune voiture ne sera pas le même que le tableau de bord dʼun avion, le
tableau de bord dʼun commerce de proximité ne sera pas le même que celui dʼune grande surface par exemple.
Tableau de bord de suivi de CA dʼune entreprise
Le tableau de bord est donc utile à lʼentreprise pour sʼassurer de son bon fonctionnement.
Le premier élément que toute entreprise suit, cʼest-à-dire le premier indicateur est le Chiﬀre dʼAﬀaires (CA) qui
représente le montant de lʼensemble des ventes réalisées par lʼentreprise.

Outils de suivi des stocks

Exemple
Voici un exemple de tableau de bord de suivi du chiﬀre dʼaﬀaires réalisé sur un semestre :

Lʼindicateur est le Chiﬀre dʼaﬀaires réalisé qui est comparé à l'objectif de chiﬀre dʼaﬀaires déterminé ainsi quʼau
chiﬀre dʼaﬀaires de lʼannée précédente.
Pour commenter les données dʼun tableau de bord, nous devons comparer les résultats réalisés par rapport
aux objectifs fixés.
Commentaire de la ligne du mois dʼavril par exemple :
Un CA de 21 509 € a été réalisé en Avril , cʼest 391 € de moins que lʼobjectif de 21 900 € qui avait été fixé.

B. Fiches de stocks
Définition

Fiche de stock

Chaque article possède sa propre fiche de stock.
Quʼelle soit manuelle ou informatisée, la fiche de stock retrace lʼhistorique des mouvements de stock qui sont
intervenus sur lʼarticle concerné.
Elle permet de connaître le stock en temps réel ainsi que lʼhistorique des mouvements (entrées et sorties) dʼun
article.
Définition

Stock initial / Stock final

La fiche de stock retrace les évènements qui se sont déroulés entre le stock initial et le stock final :
Cʼest la quantité d'articles en stock en début de
SI : Stock initial

SF : Stock Final

4

période, le 1er jour du mois si la fiche de stock est
mensuelle, le début de la semaine si la fiche est
hebdomadaire.
Cʼest la quantité d'articles en stock en fin de
période, le dernier jour du mois dans le cas de la
fiche de stock mensuelle, la fin de la semaine si la
fiche est hebdomadaire.

Outils de suivi des stocks

Les évènements qui ont eu lieu dans la période concernée par la fiche de stock sont soit des entrées, soit des sorties
de marchandises :
Entrée de
marchandises

Réception dʼun fournisseur (Bon de
réception = BR), retour dʼun client (Bon de retour
marchandise = BRM)

Sortie de marchandises

Livraison à un client (Bon de livraison = BL),
Marchandise détériorée (démarque)

Exemple
Voici la relation existante entre ces données et ces événements à travers lʼexemple dʼun stock dʼassiettes :
SI / SF / Entrées / Sorties

SF = SI - sorties + entrées

Exemple :
Stock initial en début de mois :
150

SF = 150 - 720 + 650

Entrées du mois : 650

SF = 50

Sorties du mois : 720
Stock final ?
Le stock final dʼassiettes est donc de 50 unités.
Exemple
Voici un extrait de la fiche de stock dʼun lampadaire de jardin « SunTop » :
Date

Document

Entrée

Sortie

50

Stock

01/09/N

SI

50

09/09/N

BL N°34

20

30

16/09/N

BL N°35

20

10

25/09/N

BR N°7

30/09/N

BL N°36

50

60
12

48

Le stock final du mois de septembre (48) est le stock calculé après le dernier mouvement de la fiche de stock, il
sera reporté en tant que stock initial sur la fiche de stock du mois suivant.
Ce volume de stock est déterminé par le calcul suivant :
Stock au 30/09 = 60 + 0 (aucune entrée) - 12 (volume des sorties) = 48
Document dʼétat des stocks
L'état des stocks est un autre document très utile en entreprise. Il regroupe toutes les dernières lignes des fiches de
stocks de chaque article et permet de connaître le stock des articles du magasin à un instant T (une date
précise). Ce document ne fera pas apparaître lʼhistorique des mouvements.
L'état des stocks est un document q

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 ETAGIA ACADÉMIE — Formation professionnelle
Contexte Afrique francophone · Cas pratiques terrain
© ETAGIA — Licence accordée à l'acheteur uniquement
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    shortLongDesc: `Fiches de stock, tableau de bord des stocks, taux de rotation, couverture de stock, point de commande. Tout pour piloter votre stock comme un expert en point de vente africain.`,
    rating: 4.8,
    sales: 0,
    pages: 42,
    fileSize: 'PDF · 42 pages',
    tags: ["stocks", "inventaire", "indicateurs", "logistique"],
    status: 'published',
    new: true,
    createdAt: 1748200000000,
    updatedAt: 1748200000000,
  },
  {
    id: 'et_in06',
    type: 'cours',
    title: "Maîtriser l'inventaire en point de vente",
    author: 'ETAGIA Académie',
    price: 14900,
    cover: '🗂️',
    desc: "Procédures, types d'inventaire, démarque et gestion des écarts.",
    longDesc: `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📚 COURS ETAGIA ACADÉMIE
MAÎTRISER L'INVENTAIRE EN POINT DE VENTE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Contexte
Dans l'exercice de votre métier, vous pouvez avoir à participer à des opérations d'inventaires. Également, vous
serez impliqué dans la lutte permanente du magasin contre les démarques.
À la fin de cette unité pédagogique, vous devez être capable de participer à un inventaire et d'être acteur dans la
lutte contre la démarque.

A. Objectif d'un inventaire
L'objectif d'un inventaire est de connaître le stock réel de quantité de marchandise ; il convient alors de le
comparer au stock théorique afin d'identifier les écarts de stock et de les analyser.
Le stock réel est le stock qui est compté lors de l'inventaire, c'est-à-dire lors du comptage physique des
marchandises.
Le stock théorique est le résultat du calcul suivant :
Définition
Stock Théorique = Stock Initial + Entrées - Sorties
Stock Initial : dernier stock physique connu (dernier comptage).
Entrées : livraisons et retours marchandises reçus depuis le dernier comptage.
Sorties : ventes et démarques connues depuis le dernier comptage (nous reviendrons sur le terme de démarque
connue dans la deuxième partie de ce cours).
Remarque
Aujourd'hui, on emploie souvent le terme de stock informatique, car ce stock est mis à jour en temps réel grâce
aux outils numériques. L'objectif de l'inventaire est donc de mettre à jour ce stock théorique. L'informatisation de
la gestion permet d'avoir un stock théorique disponible à chaque instant et pour chaque article. Cette
information nous permet de gérer le stock et les commandes sans avoir à recompter à chaque fois les articles
présents en réserve et en rayon.

B. Diﬀérents types d'inventaire
Fondamental

Les 4 types d'inventaire

On distingue 4 principaux types d'inventaire :
L'inventaire annuel
L'inventaire tournant
L'inventaire ponctuel
L'inventaire permanent
L'inventaire annuel
L'inventaire annuel est réalisé une fois par an en fin d'exercice comptable. C'est un inventaire qui permet de
renseigner la valeur du stock dans le bilan annuel de l'entreprise.
Cet inventaire est obligatoire et régi par le code du commerce.

Inventaires

Cet inventaire nécessite souvent la fermeture du point de vente afin de neutraliser les entrées et les sorties pendant
les opérations de comptage qui peuvent durer plusieurs jours selon la taille de l'entreprise.
Traditionnellement, on voit des panneaux accrochés sur les vitrines des magasins, avec écrit « Fermé pour
Inventaire ». Généralement, cela intervient entre le 31 décembre et le 2 janvier, car la plupart des entreprises ont un
exercice comptable qui suit l'année civile en commençant le 1er janvier pour finir le 31 décembre. Le stock à déclarer
sera donc le stock au 31 décembre de l'année concernée.
Texte légal

Art L123 – 12 du code du commerce

Toute personne physique ou morale ayant la qualité de commerçant doit procéder à l'enregistrement comptable
des mouvements aﬀectant le patrimoine de son entreprise. Ces mouvements sont enregistrés chronologiquement.
Elle doit contrôler par inventaire, au moins une fois tous les douze mois, l'existence et la valeur des éléments
actifs et passifs du patrimoine de l'entreprise.
Elle doit établir des comptes annuels à la clôture de l'exercice au vu des enregistrements comptables et de
l'inventaire. Ces comptes annuels comprennent le bilan, le compte de résultat et une annexe, qui forment un tout
indissociable.
L'inventaire tournant
L'inventaire tournant consiste à compter les stocks selon un planning prédéfini par l'entreprise.
L'inventaire tournant permet d'avoir un stock théorique au plus juste tout au long de l'année sans souﬀrir de la
lourdeur et du coût d'un inventaire complet des stocks.
Exemple

Organisation d'un inventaire tournant

Dans un magasin qui aurait par exemple 4 univers : Produits frais / Épicerie / Liquides / DPH (Droguerie
Parfumerie / Hygiène) l'organisation d'un inventaire tournant pourrait être la suivante :
Univers

Date de comptage (le 10 du mois de ...)

Produits frais

Janvier - Mai - Septembre

Épicerie

Février - Juin - Octobre

Liquides

Mars - Juillet - Novembre

DPH

Avril - Août - Décembre

L'inventaire ponctuel
L'inventaire ponctuel consiste à vérifier ponctuellement le stock de certains articles du magasin.
La décision des articles à compter peut-être prise au hasard ou venir d'une décision de gestion du magasin suite à
une commande importante par exemple.
L'inventaire permanent
L'inventaire permanent consiste à recompter le stock restant après chaque mouvement de stock, c'est-à-dire à
chaque entrée ou chaque sortie de marchandise.
Cette technique d'inventaire permet d'avoir un stock juste au quotidien, mais elle est très lourde à mettre en œuvre.
Elle peut être utilisée sur une sélection restreinte d'articles sensibles et onéreux d'un magasin.

4

Inventaires

C. Procédure de réalisation d'un inventaire
Fondamental

Les 3 phases de l'inventaire

On distingue 3 grandes phases dans le déroulement d'un inventaire : Avant - Pendant - Après :

Méthode

Phase 1 : La préparation de l'inventaire (Avant)

Un inventaire qui ne va pas être bien préparé ne pourra pas être eﬀicace et juste. Une bonne préparation permet
aussi de ne pas nuire à la rentabilité de l'entreprise.
Voici ce que l'on doit faire pour bien préparer un inventaire :
Communiquer nos éventuelles dates de fermeture à nos clients et à nos fournisseurs. Dans le cas d'un inventaire
annuel, nous éviterons de recevoir et de sortir de la marchandise pendant les opérations de comptage.
Ranger les stocks : chaque produit doit être au bon emplacement pour éviter les erreurs de comptages.
Également on va essayer de ranger les articles en piles comptables (en ligne de 10 par exemple ce qui nous
permettra de compter un nombre de lignes au lieu de compter chaque article.
Articles rangés en désordre et diﬀiciles à compter :

5

Exercice : Qui

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 ETAGIA ACADÉMIE — Formation professionnelle
Contexte Afrique francophone · Cas pratiques terrain
© ETAGIA — Licence accordée à l'acheteur uniquement
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    shortLongDesc: `Objectifs, types (tournant, annuel, surprise), procédures de réalisation, fiche d'inventaire, lutte contre la démarque connue et inconnue. Guide pratique terrain.`,
    rating: 4.6,
    sales: 0,
    pages: 36,
    fileSize: 'PDF · 36 pages',
    tags: ["inventaire", "stocks", "démarque", "magasin"],
    status: 'published',
    new: true,
    createdAt: 1748200000000,
    updatedAt: 1748200000000,
  },
  {
    id: 'et_pa07',
    type: 'cours',
    title: "Loi de Pareto appliquée en commerce",
    author: 'ETAGIA Académie',
    price: 15900,
    cover: '⚖️',
    desc: "Appliquer le principe 80/20 pour optimiser ventes, stocks et priorités.",
    longDesc: `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📚 COURS ETAGIA ACADÉMIE
LOI DE PARETO APPLIQUÉE EN COMMERCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Contexte
Dans le quotidien du métier de vendeur, vous serez amené à définir vos priorités afin dʼorganiser au mieux vos
journées et optimiser la rentabilité du point de vente.
Il est en eﬀet primordial de gérer ses priorités pour répondre à des problématiques du type :
Quels produits stocker en grande quantité ?
Quelle place accorder aux produits dans les linéaires ?
Quelles commandes sont à traiter en priorité ?
La loi de Pareto est un principe qui permet de définir les priorités du quotidien dans tous les domaines de la vie
personnelle et professionnelle.
Le commerce a su sʼapproprier le principe de cette loi pour optimiser ses eﬀorts et ses investissements tant sur le
plan matériel qu'humain.
Cette séance présente cette loi et diverses applications possibles en magasin.

II. Définition de la loi de Pareto
A. La loi de PARETO
Définition

La loi de PARETO

Vilfredo Pareto est un sociologue et économiste italien qui a vécu entre la fin du 19ème et le début du 20ème siècle.
À lʼorigine, Vilfredo Pareto a constaté quʼen Italie, 20% des personnes détenaient 80 % des richesses. Le fruit de
ses analyses a permis dʼétendre ce constat pour en émettre une loi qui explique que 20 % des eﬀorts produisent
80 % des résultats ou autrement énoncé que 20 % des causes produisent 80 % des eﬀets. Cʼest ainsi que la loi de
Pareto, également nommée la loi des 20/80, est née.

Définition de la loi de Pareto

Voici une illustration du principe de la loi de Pareto :

Exemple

La garde-robe

Un exemple qui permet dʼillustrer le principe de cette loi est la gestion de notre garde-robe.
En eﬀet, nous nous rendons compte assez facilement que nous ne portons pas souvent une grande partie des
aﬀaires qui sont stockées dans nos placards.
Selon la loi de Pareto, nous pouvons émettre l'aﬀirmation suivante :
20 % des vêtements permettent de se vêtir 80 % du temps.
Vous avez par exemple 100 articles dans votre garde-robe, alors 20 de ces articles sont particulièrement utilisés
(dans 80 % du temps). Les 80 autres articles ne sont utilisés que 20 % du temps restant.
Alors, si vous devez partir en voyage, ce sont ces 20 vêtements qui vous sembleront nécessaires à ranger dans
votre valise. Vous allez naturellement anticiper votre départ pour que ces habits soient propres et disponibles
pour constituer votre valise.
Exemple

Le niveau de bonheur

Toutes nos activités ne nous procurent pas le même niveau de bonheur, la même satisfaction.
Voici une liste dʼactivités (simplifiée) dʼune personne qui travaille dans le commerce sur une semaine :
Sphère professionnelle
Réception de marchandise
Mise en rayon
Nettoyage de la surface de vente
Conseil client
Réunions dʼéquipe

4

Définition de la loi de Pareto

Sphère personnelle
Tâches ménagères
Loisir sportif
Promenade
Lectures, visionnages de films ou séries
Courses
Tâches administratives
Nous ne tirons pas la même satisfaction de toutes ces activités, certaines sont réalisées par nécessité et dʼautres
par plaisir.
Le tableau ci-dessous les présente en indiquant pour chacune dʼentre elles le pourcentage de temps imparti et le
pourcentage de bonheur hebdomadaire quʼelles procurent.
Puis des colonnes présentent le pourcentage cumulé (de temps et de bonheur) qui doit nous permettre
dʼidentifier la loi de Pareto dans cet exemple.
Les activités ont été triées en fonction du pourcentage de bonheur procuré par chacune dʼentre elles.

Nous pouvons identifier la loi de Pareto sur la 4ème ligne de ce tableau (la ligne Lectures, visionnages, etc.).
En eﬀet la somme du pourcentage de bonheur procuré par les activités des quatre premières lignes du tableau
atteint 80 %. Sur cette même ligne, nous pouvons constater que le cumul de la durée de ces activités atteint 20 %.

5

Définition de la loi de Pareto

La loi de Pareto est donc vérifiée car 20 % des activités (les 4 premières lignes du tableau) sont à lʼorigine de 80 %
du bonheur ressenti.
Représentation graphique de la loi de PARETO
La loi de Pareto peut être représentée par ce graphique sous la forme dʼune fonction.
Nous constatons que 20 % des causes produisent 80 % des eﬀets. L'impact des causes suivantes est réduit en termes
dʼeﬀets et la courbe de mesure des eﬀets s'aplanit une fois les 20 % des causes principales identifiées atteintes.

La méthode ABC
La méthode ABC est une méthode dérivée du principe de Pareto. En eﬀet, il nʼest parfois pas suﬀisant de considérer
ce rapport 20/80 pour expliquer la proportionnalité de lʼimpact des causes sur les eﬀets.
La méthode ABC permet dʼaﬀiner cette relation de cause à eﬀet.
Les causes sont alors catégorisées en 3 classes : la classe A, B et C.
Classes

6

Incidence des causes sur les eﬀets

A

20 % des causes qui représentent 80 % des eﬀets

B

30 % des causes qui représentent 15 % des eﬀets

C

50 % des causes qui représentent 5 % des eﬀets

La loi de Pareto appliquée en magasin

B. Exercice : Quiz

[solution n°1 p.15]

Question 1
La loi de Pareto définit une relation entre :


Les eﬀorts et les résultats



Les causes et les conséquences



Les clients et les fournisseurs

Question 2
Quelle est la situation observée qui a permis de mettre en évidence le principe de la loi de Pareto ?


Lʼobservation des jours dʼensoleillement



Lʼobservation de la répartition des richesses en Italie



Lʼobservation de lʼutilisation des vêtements dans le quotidien des individus

Question 3
Comment est aussi appelée la loi de Pareto ?


La loi des 50/50



La loi des 10/90



La loi des 20/80

Question 4
La loi de Pareto sʼapplique aussi bien dans le domaine de la vie personnelle que professionnelle.


Vrai



Faux

Question 5
Quelle autre méthode permet dʼaﬀiner lʼanalyse proposée par le principe de la loi de Pareto.


La méthode de répartition



La méthode ABC



La méthode XY

III. La loi de Pa

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 ETAGIA ACADÉMIE — Formation professionnelle
Contexte Afrique francophone · Cas pratiques terrain
© ETAGIA — Licence accordée à l'acheteur uniquement
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    shortLongDesc: `De la définition mathématique à l'application terrain : 20% des articles = 80% du CA, gestion des priorités, classification ABC, optimisation des linéaires et des commandes.`,
    rating: 4.9,
    sales: 0,
    pages: 40,
    fileSize: 'PDF · 40 pages',
    tags: ["Pareto", "80/20", "priorités", "gestion", "optimisation"],
    status: 'published',
    new: true,
    createdAt: 1748200000000,
    updatedAt: 1748200000000,
  },
  {
    id: 'et_mp08',
    type: 'cours',
    title: "Mesurer la performance commerciale",
    author: 'ETAGIA Académie',
    price: 24900,
    cover: '🏆',
    desc: "Ratios, entonnoir de prospection, tableaux de bord et évaluation qualitative.",
    longDesc: `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📚 COURS ETAGIA ACADÉMIE
MESURER LA PERFORMANCE COMMERCIALE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Contexte
Le travail du commercial constitue une activité essentielle pour l'entreprise et représente un coût de
fonctionnement important (salaires, commissions, frais de déplacements, coût des actions commerciales mises
en place par l'entreprise, prospection, animations commerciales, moyens technologiques à disposition des
commerciaux, etc.).
Le manager commercial doit donc veiller à ce que ces frais soient couverts par un chiﬀre d'aﬀaires suﬀisant. En
eﬀet, ce dernier doit permettre d'absorber les charges fixes et les charges variables, tout en dégageant un résultat
positif. Le manager va donc devoir évaluer les résultats en termes de nouveaux clients, chiﬀre d'aﬀaires, marges,
volume de ventes, etc. Le rapport entre les coûts et les résultats obtenus correspond à la productivité.
L'outil privilégié du manager est le tableau de bord. Lorsque le tableau de bord est correctement rempli par les
commerciaux, cela permet au manager d'analyser les résultats et d'avoir une vision très précise de l'activité du
commercial. Le manager va donc essayer d'obtenir la meilleure productivité possible, en analysant les critères et
les pratiques qui peuvent amener à une eﬀicacité maximale.
Si les résultats ne sont pas atteints, le manager devra prendre des décisions et des mesures correctrices.
Définition
La performance est l'atteinte des objectifs qui ont été fixés, en cohérence avec les objectifs globaux de
l'entreprise. Dans la notion de performance, il faudra donc comparer les résultats et les objectifs.

A. Productivité
Définition
La productivité est le rapport mesurable entre une production donnée et l'ensemble des facteurs mis en œuvre
pour l'obtenir. C'est un indicateur d'eﬀicacité puisque le manager va rapprocher les moyens mis en œuvre avec
les résultats obtenus.
Pour mesurer de manière concrète l'activité du commercial, on peut calculer le ratio suivant :

On peut aussi calculer d'autres ratios plus spécifiques en se basant sur :
Pour les résultats obtenus :
Le nombre de ventes,
Le nombre de visites eﬀectuées,
Le nombre de nouveaux clients,
La marge réalisée,
Le nombre de rendez-vous pris.

Productivité de l'activité commerciale

Pour les moyens engagés par l'entreprise :
Le nombre de km parcourus,
Le nombre d'appels téléphoniques réalisés,
Le nombre de mailing ou de e-mailing envoyés.
Exemple
Un commercial a fait 4 ventes et a réalisé 90 visites.
On calcule le ratio suivant :
Nombre de ventes / nombre de visites réalisées = 4 / 90 = 0,0444 soit 4,44 %
Ce pourcentage signifie que lorsque le commercial fait 100 visites, il obtient à peu près 4,4 ventes.
Il faudra ensuite analyser le prix moyen de la commission, ainsi que la marge dégagée, afin de vérifier que
l'activité est rentable.

B. Secteurs concernés
Tous les domaines d'activité du commercial et du manager sont soumis à des contrôles budgétaires. Ces derniers
serviront à mesurer l'eﬀicacité du travail réalisé, que ce soit dans le domaine de la vente, de la mise en place
d'opérations marketing, du management, de la gestion du portefeuille client ou de l'organisation de l'activité.
Dans les secteurs de

On calcule la productivité liée
Aux visites

La prospection et la vente

À la prospection physique et téléphonique
(opérations de phoning et de mailing)
À l'activité globale du commercial
Aux actions de recrutement

Management

Aux actions de formations
Aux opérations de stimulation de la force de
vente
À une opération de promotion des ventes

Marketing

À une animation sur le lieu de vente
Aux échantillons remis aux clients

Gestion de clientèle

Au portefeuille client, c'est-à-dire de son
évolution
À la répartition des clients A, B ou C
Aux clients

La gestion du temps consacré

Aux tâches administratives
Aux déplacements
Aux opérations de prospection

4

Exercice : Quizsolution

Exercice : Quiz

[solution n°1 p.19]

Question 1
La productivité du commercial se mesure en faisant le ratio :



Vrai



Faux

Question 2
Le manager peut élaborer tous les ratios possibles en vue de mesurer la performance de l'équipe.


Vrai



Faux

Question 3
On peut mesurer la productivité d'une opération de publipostage.


Vrai



Faux

Question 4
Il est impossible de mesurer le temps consacré à une opération de prospection.


Vrai



Faux

Question 5
Mesurer la performance du commercial permet de comparer la productivité des commerciaux entre eux.


Vrai



Faux

III. Indicateurs
Définition
Un indicateur est avant tout une information choisie par le manager, qui est elle-même associée à un critère. Il
permettra d'analyser son évolution à des intervalles périodiques et réguliers.

5

Indicateurs

Les indicateurs délivrent une information pertinente à destination des dirigeants pour mesurer et évaluer les
résultats d'une action. Ils permettent également de suivre l'évolution de la performance et d'analyser une situation
présente, mais aussi de s'assurer que les axes décidés par la direction sont déclinés sur le terrain.
Ils permettront également, à titre individuel, d'observer l'évolution d'un commercial dans le temps, de comparer
ses résultats avec ceux des autres commerciaux et avec les objectifs.

A. Critères d'évaluation
Pour pouvoir évaluer correctement, il faut d'abord avoir de
bonnes sources d'information :
Les comptes rendus des commerciaux,
Quelles sont les sources
d'information ?

Les entretiens périodiques d'évaluation,
L'accompagnement terrain que fait le manager,
Les sources internes,
Le logiciel de l'entreprise.
Pour mesurer l'eﬀicacité,

Pourquoi évaluer ?

Pour piloter,
Pour faciliter la prise de décisions.

Que faut-il évaluer ?

L'activité,
Les résultats obtenus (CA, marges, nouveaux clients, etc.).
Le manager,

Qui doit évaluer ?

À quel moment faut-il
évaluer ?

Le commercial : il doit faire son auto-évaluation régulière
et se reme

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 ETAGIA ACADÉMIE — Formation professionnelle
Contexte Afrique francophone · Cas pratiques terrain
© ETAGIA — Licence accordée à l'acheteur uniquement
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    shortLongDesc: `Productivité commerciale, secteurs d'activité, critères d'évaluation, représentations graphiques, entonnoir de prospection, performances financières. Le cours complet du manager commercial.`,
    rating: 4.8,
    sales: 0,
    pages: 58,
    fileSize: 'PDF · 58 pages',
    tags: ["performance", "commercial", "ratios", "management"],
    status: 'published',
    new: true,
    createdAt: 1748200000000,
    updatedAt: 1748200000000,
  },
  {
    id: 'et_ac09',
    type: 'cours',
    title: "Mettre en place des actions correctives",
    author: 'ETAGIA Académie',
    price: 21900,
    cover: '🔧',
    desc: "Identifier les écarts et piloter vos plans d'action pour redresser les performances.",
    longDesc: `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📚 COURS ETAGIA ACADÉMIE
METTRE EN PLACE DES ACTIONS CORRECTIVES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Contexte
La mise en place d'actions correctives est une étape cruciale à votre activité commerciale. Elle va permettre de
mesurer l'écart entre vos objectifs et vos résultats. On évoque ici la notion d'indicateurs de performance
(KPI). Après cette analyse où il faudra prendre en compte les résultats par rapport aux objectifs ainsi que les
possibilités de résoudre cet écart. Des actions précises devront être mises en place. Diﬀérentes actions sont
possibles, on appelle cela le réajustement pour plus de performance. La prise en compte des chiﬀres est
importante mais les moyens pour les atteindre l'est aussi. Il permet d'améliorer sa stratégie commerciale. C'est
avant tout une réflexion qui oriente votre action future. On parle d'actions correctives car elles viennent après
l'analyse de vos actions. On peut aussi l'évoquer dans le cas de litiges et de non-satisfaction des clients. Si vous
possédez un logiciel de Gestion de la Relation Client (GRC) ou Customer Relationship Management (CRM), ces
indicateurs pourront être évalués très régulièrement et vous permettront d'être rapide.

A. Comment la mesurer ?
Définition
Un KPI (Key Performance Indicator) ou indicateur de performance est une mesure de la performance
commerciale dans une entreprise. L'indicateur est toujours associé à un objectif et un plan d'actions
commerciales. On évalue la performance pour réajuster sa stratégie.
Un réajustement commercial c'est faire évoluer ses actions commerciales en fonction d'un résultat précédent
dans le but de réaliser ses objectifs. Dans l'action de réajuster, il y a forcément une modification.
On peut évaluer la performance commerciale de diﬀérentes manières :
Par des indicateurs de performance (KPI)
Ce sont des taux exprimés en pourcentage. Ceux-ci seront calculés selon des éléments saisis dans la CRM/GRC
(Gestion de la Relation Clients) ou bien avec une base de données Excel/Access (tableurs). Ils sont souvent en lien
avec les actions des commerciaux ou bien du marketing digital. Ils peuvent être quantitatifs (une donnée chiﬀrée
concrète), ou qualitatifs (appréciations ou évaluations de la qualité du travail). Ils aident à la décision.
Par l'utilisation de tableaux de bord
Le tableau de bord est un outil d'analyse. Les chiﬀres qui vont permettre de calculer les indicateurs de
performance sont inscrits dans le tableau de bord. Chaque conseiller commercial pourra saisir ses chiﬀres ou bien
les extraire du logiciel de CRM/GRC.
Exemple

Par des données monétaires

Mesurer la performance commerciale

Définition
Chiﬀre d'aﬀaires : somme totale des ventes réalisées au cours d'un exercice comptable.
Panier moyen : montant dépensé par client sur un temps donné, en physique ou en ligne.
Cela concerne surtout le chiﬀre d'aﬀaires ou la rentabilité. On peut aussi évoquer le panier moyen.
Des quantités
On répond à la question de combien ? pour pouvoir évaluer la performance. En eﬀet combien d'appels pour un
rendez-vous ? combien de rendez-vous pour une vente ? Cette analyse permet de voir la qualité de son travail et de
mieux gérer son activité commerciale. Cette analyse doit permettre de diagnostiquer ces actions.

B. Performance commerciale est un baromètre
L'analyse de la performance agit comme un baromètre. Il permet de prendre la température du marché et de ses
actions commerciales.
Pour que votre analyse de la performance soit eﬀicace il faut dans un premier temps avoir :
Des objectifs bien choisis
En eﬀet, bien choisir son objectif c'est aussi le garant du résultat.
Exemple
Un objectif n'est pas uniquement la réalisation d'un chiﬀre d'aﬀaires. Dans la méthode SMART, on voit qu'il doit
être spécifique et réaliste. Un objectif qui ne prend pas en compte le contexte du marché et les moyens alloués
donnerait une analyse fausse. Et une impossibilité de mettre en place des actions correctives. Dans le cas du
contexte de la crise sanitaire et de l'impossibilité pour certains commerciaux de rencontrer leurs clients,
l'objectif doit être réajusté à la réalité.
Des budgets adaptés
Faire une analyse de la performance alors que le budget pour la mise en place est inexistant ou partiel est un risque.
En eﬀet, on analysera une performance à laquelle il a manqué des moyens financiers pour la réaliser. Cette analyse
sera fausse.
Une connaissance du potentiel du marché
Vous devez bien connaître votre marché. Ce marché est il performant par lui-même ou bien devez-vous le
conquérir ? L'analyse sera bien diﬀérente selon le contexte de celui-ci.
Une bonne image de marque
Votre image de marque est un élément essentiel à votre performance. Elle sera alors mesurée à l'aide d'indicateurs
qualitatifs, en fonction des avis clients ou de l'expérience utilisateur.

C. Indicateurs de performance par catégorie
Indicateurs de performance des réseaux sociaux (Facebook, Instagram, LinkedIn)
Visibilité : ce sont les nombres de vues sur la page ou le nombre de fois où la marque est citée par
exemple.
On parle ici de mesurer la notoriété de la marque. On peut aussi évaluer ce qui attire notre cible
notamment sur le contenu, afin de faire évoluer nos publications.
Acquisition : ce sont les nombres de membres à la suite d'une campagne digitale par exemple.

4

Mesurer la performance commerciale

On pourra évaluer les éléments déclencheurs à la démarche de s'abonner à la page de votre
entreprise. Soit sur le contenu des publications ou des campagnes ou bien à la suite d'un concours, une
promotion.
Recommandation : ce sont les nombres de partages des publications ou bien les nombres de
recommandations.
On pourra évaluer la réputation de la marque ou du produit. C'est aussi l'occasion de voir ce qui suscite
une réaction des prospects ou clients. Dans le cas d'un partage, il y a une action.
Cette action montre leur investissement vis-à-vis de la marq

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 ETAGIA ACADÉMIE — Formation professionnelle
Contexte Afrique francophone · Cas pratiques terrain
© ETAGIA — Licence accordée à l'acheteur uniquement
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    shortLongDesc: `Baromètre de performance, indicateurs par catégorie, actions suite à litiges/réclamations, amélioration de la force de vente. Méthode complète avec suivi opérationnel.`,
    rating: 4.7,
    sales: 0,
    pages: 50,
    fileSize: 'PDF · 50 pages',
    tags: ["actions correctives", "KPI", "management", "performance"],
    status: 'published',
    new: true,
    createdAt: 1748200000000,
    updatedAt: 1748200000000,
  },
  {
    id: 'et_ns10',
    type: 'cours',
    title: "Rédiger une note de synthèse efficace",
    author: 'ETAGIA Académie',
    price: 14900,
    cover: '📝',
    desc: "Méthode complète pour analyser, structurer et rédiger une note de synthèse.",
    longDesc: `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📚 COURS ETAGIA ACADÉMIE
RÉDIGER UNE NOTE DE SYNTHÈSE EFFICACE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Contexte
La note de synthèse est un exercice pratiqué dans tous les secteurs d'activité. Toutes les organisations du public
et du privé l'utilisent.
Pour accompagner des choix stratégiques, pour mettre en place des nouvelles procédures, pour établir des
règlements, pour conquérir des parts de marché, il faut au préalable comprendre l'environnement et se faire une
idée précise du contexte.
Il s'agit donc de rechercher des informations, les analyser et en extraire les aspects pertinents.
La note de synthèse est donc essentielle pour se représenter une situation, amorcer une réflexion, faire des choix
en toute connaissance de cause. Les responsables des organisations n'ont pas toujours le temps de s'y consacrer.
Un collaborateur eﬀicace, capable de réaliser cette mission à leur place, s'avère très apprécié !

A. Fondement de la note de synthèse
Comprendre le principe
Votre supérieur hiérarchique n'a pas le temps de dépouiller la documentation d'un sujet qui l'intéresse. Il vous
demande de rédiger une note de synthèse.
Définition

Comprendre le principe

La note de synthèse doit permettre l'information rapide sur une thématique donnée, cela peut être, par
exemple, un sujet commercial, social, politique, économique, législatif, etc.
La quantité d'informations disponibles est importante, la note de synthèse est élaborée à partir de plusieurs
documents.
Présentée de façon claire et structurée, elle fournit des informations ciblées qui répondent à la demande.
La note de synthèse est un document interne. Elle circule de façon ascendante.
Exemple
Exemple 1
Vous êtes attaché de direction dans une entreprise de transports. Celle-ci cherche à élargir son oﬀre et envisage
de se lancer dans le transport de matières dangereuses. On vous charge de réaliser une note de synthèse pour
faire le point sur les textes de loi qui régissent l'activité, les diverses autorisations à obtenir sur le plan national,
européen et international.
Exemple 2
Vous êtes secrétaire d'un syndicat professionnel. Une réunion inter syndicale est organisée dans une semaine afin
de faire le point sur la réforme des retraites. On vous demande de réaliser une note de synthèse sur les diﬀérents
régimes de retraite des salariés des pays européens.

B. Synthèse de documents
Rechercher l'information et la diﬀuser
Pour répondre à la problématique posée, il s'agit d'analyser plusieurs documents. Ceux-ci peuvent trouver leur
source en interne, en externe, ou les deux.
Ces documents peuvent être de nature diﬀérente : article de presse, dossiers, texte de loi, réglementation,
documentation diverse, contenus numériques.

Définition de la note de synthèse

À partir de l'analyse de ce corpus, la note de synthèse va s'appliquer à restituer brièvement l'essentiel de
l'information.
Fondamental
L'enjeu et la diﬀiculté de la note de synthèse repose sur le nombre important de documents à analyser, desquels il
faudra extraire les points les plus pertinents, puis les mettre en forme pour répondre à la question initialement
posée.

C. Destinataire de la note de synthèse
Vous devez rédiger votre note en réfléchissant à son destinataire : « à qui je m'adresse ? »
Réponse : à votre responsable hiérarchique, commanditaire de la note. Il a besoin des connaissances relatives à un
thème et n'a pas le temps de lire toute la documentation qui s'y réfère.
L'écriture de la note est concise et claire. Sa lecture doit être rapide. Sa présentation structurée et attractive.
Méthode

Vers une lecture rapide

D. Normes stylistiques et structurelles de la note de synthèse
Prenez garde à les respecter :
Neutralité : veillez à rester neutre et à rapporter les idées contenues dans votre documentation. Vous devez livrer
une information sans donner votre opinion. Le « je » est banni. La synthèse est objective.
Style : choisissez un vocabulaire accessible à tous. Si des termes techniques ou un jargon spécifique doivent êtes
utilisés, donnez une traduction entre parenthèses.
Vos phrases doivent être courtes et concises.
Présentation : la note de synthèse doit être présentée de manière à guider la lecture. Le titrage doit clairement
ressortir. Les paragraphes sont bien marqués.

4

Exercice : Quizsolution

Vous pouvez utiliser des graphiques ou des visuels : une image est parfois plus explicite qu'une longue explication.

Exercice : Quiz

[solution n°1 p.15]

Question 1
La note de synthèse est le résumé d'une documentation.


Vrai



Faux

Question 2
Les clients externes peuvent être les destinataires d'une note de synthèse.


Vrai



Faux

Question 3
Dans la note de synthèse, il est important de détailler l'information et de fournir des détails, pour se faire une
bonne idée de la question.


Vrai



Faux

Question 4
La note de synthèse va extraire les informations importantes provenant d'une documentation diverse.


Vrai



Faux

Question 5
Une présentation avec titres, sous-titres, couleurs, éventuellement graphiques et images, permet une meilleure
compréhension du sujet.


Vrai



Faux

III. Méthodologie rédactionnelle étape par étape
A. Comprendre l'enjeu et recueillir les modalités de la note de synthèse
Il est important d'identifier précisément le sujet, la problématique. N'hésitez pas à poser des questions au
commanditaire de la note. Reformulez la demande pour éviter tout malentendu, qui déboucherait sur une
information non pertinente.
Recueillez toutes les modalités de rendu de la note de synthèse.

5

Méthodologie rédactionnelle étape par étape

Méthode

Cahier des charges

D'un point de vue méthodologique, réalisez votre propre cahier des charges sous la forme d'un tableau, à adapter
au cas par cas.
Sujet à traiter

Problématique qui a déclenché la demande

Finalité de la note de synthèse

Recherche d'information ? Procédure à réaliser ?
Etc.

Sources existantes

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 ETAGIA ACADÉMIE — Formation professionnelle
Contexte Afrique francophone · Cas pratiques terrain
© ETAGIA — Licence accordée à l'acheteur uniquement
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    shortLongDesc: `Fondements, destinataires, normes stylistiques, méthodologie étape par étape : recherche documentaire, sélection des informations, construction du plan, rédaction et relecture.`,
    rating: 4.5,
    sales: 0,
    pages: 35,
    fileSize: 'PDF · 35 pages',
    tags: ["rédaction", "synthèse", "communication", "management"],
    status: 'published',
    new: true,
    createdAt: 1748200000000,
    updatedAt: 1748200000000,
  },
  {
    id: 'et_ob11',
    type: 'cours',
    title: "Fixer et piloter ses objectifs commerciaux",
    author: 'ETAGIA Académie',
    price: 19900,
    cover: '🎪',
    desc: "Méthodes SMART, négociation d'objectifs et suivi opérationnel terrain.",
    longDesc: `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📚 COURS ETAGIA ACADÉMIE
FIXER ET PILOTER SES OBJECTIFS COMMERCIAUX
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Contexte
Le conseiller commercial développe son activité en s'appuyant sur le plan d'action commerciale (PAC) et les
objectifs commerciaux qui lui ont été fixés. La définition des objectifs commerciaux et de la mesure de ces
derniers contribue fortement au développement de la performance de l'entreprise et au développement du
portefeuille du conseiller commercial. Ce cours vise à définir les types d'objectifs et leur application. Nous verrons
également comment négocier et suivre les objectifs et faciliter l'adhésion des collaborateurs.

A. Finalité des objectifs commerciaux
La mise place du plan d'action commerciale
Imaginez une entreprise où chaque commercial ferait ce qu'il voudrait, vendrait uniquement les produits qui lui
semblent être les meilleurs ou les plus lucratifs, ne ferait pas de prospection. Ce serait l'anarchie. Le rôle du
manager commercial est donc de piloter les objectifs par rapport aux objectifs fixés par la direction générale.
Les objectifs doivent être clairs et compréhensibles par tous. Ils découlent d'un processus complet qui implique
tous les niveaux de la hiérarchie.
Un manager doit savoir se poser les bonnes questions, telles que :
« Est-ce réaliste en termes de volumes, de temps, de moyens, de ressources, d'organisation et de compétence ?
Les environnements internes et externes sont-ils favorables ?
Le plan d'action mis en place est-il adapté à la réalisation des objectifs ? »
Définition du plan d'action
Nous pouvons déduire que de passer d'une logique de résultats à une logique de moyens est une des fonctions du
plan d'action. En eﬀet, les plans d'action sont des outils qui permettent de prendre des décisions, de fixer des
objectifs, d'y associer des moyens, des ressources, de déterminer des délais mais aussi d'évaluer les facteurs
de risques.
Ce plan d'action se construit sur la base d'éléments factuels et permet de mettre en place la meilleure organisation
pour atteindre les objectifs.
Le plan d'action augmente le taux de réussite des objectifs fixés, car il précise où aller, comment y aller, quand,
avec qui et pourquoi y aller.
Il met en évidence les activités que les collaborateurs doivent réaliser pour atteindre leurs objectifs. Il permet aussi
de prendre conscience du décalage qu'il peut y avoir entre les actions et les résultats. Il permet donc
d'anticiper ces derniers, de mieux fixer les objectifs.
Vous trouverez un grand nombre de matrices de plans d'action mais elles répondent pratiquement toutes aux
mêmes questions :
Le QQOQCP est une méthode simple et eﬀicace à laquelle il faut rajouter la question « Combien ? ». En eﬀet, les
lignes budgétaires sont les plus importantes à l'heure actuelle.
Les entreprises recherchent un bénéfice mesurable qui permettra d'en évaluer objectivement l'eﬀicacité. L'outil qui
leur permettra d'évaluer les résultats et de suivre les indicateurs est le tableau de bord.

Nécessité des objectifs commerciaux

La hiérarchie des objectifs commerciaux
Tous les ans à la même période, les entreprises déterminent leurs objectifs commerciaux pour l'année à venir.
La diﬀiculté pour le manager est qu'ils doivent être motivants et alignés sur la stratégie de l'entreprise. Ils
doivent aussi être simples et justes.
À partir des orientations de la direction générale, les diﬀérents niveaux hiérarchiques de l'entreprise vont
décomposer ces objectifs afin de pouvoir cibler de manière précise les activités du commercial.
On peut repérer 4 grands types d'objectifs :
Fondamental
Les objectifs généraux
Ils sont fixés à long terme par la direction générale. Ils correspondent aux choix stratégiques que fait
l'entreprise en termes de marchés et de produits.
Les objectifs commerciaux
Ils sont fixés par la direction commerciale à moyen et long terme. Ils découlent des objectifs généraux.
Ils correspondent à la mise en place du plan de marchéage (mix marketing) de l'entreprise : gamme de
produits, politique de prix, plan de communication, circuit de distribution.
Les objectifs de l'équipe de vente
Ils sont fixés par le manager et sont des objectifs à moyen terme qui impliquent chaque membre de l'équipe.
Ils déterminent les priorités commerciales et sont traduites en termes d'actions ou d'opérations
commerciales à mener sur le terrain : promotion des ventes, campagnes de prospection, découpage de
secteurs, répartition des eﬀorts de vente et des moyens à allouer.
Exemple : fixation d'un objectif d'agence avec rémunération liée au travail de tous.
Les quotas
Le manager répartit les objectifs de l'équipe entre ses commerciaux et leur attribue un objectif individuel à
court terme (à l'année, au mois).
Ces « quotas » sont négociés avec les commerciaux en fonction des informations du terrain (nombre de
clients, potentiel du secteur, évolution du marché).
L'utilité des objectifs commerciaux
Les objectifs commerciaux servent avant tout à motiver les commerciaux. Il faut donc que le manager réfléchisse
dans ce sens et se demande comment définir des objectifs qui soient une vraie source de motivation pour ces
derniers et non pas une source de stress négatif qui freinerait leur capacité d'action.
Les objectifs influencent presque toujours la rémunération du commercial mais ils ne jouent pas que sur la
motivation extrinsèque (qui vient d'un facteur extérieur : notion de punition, de récompense, etc.). Ils jouent aussi
sur la motivation intrinsèque, c'est-à-dire les leviers de motivation personnels du commercial (désir de
reconnaissance, de valeur donnée à son travail, etc.).
Les risques liés à l'absence de détermination des objectifs
À défaut, pour l'employeur, de fixer des objectifs, le commercial pourra demander en justice le versement d'une
part variable de sa rémunération.
Les juges détermineront alors le montant de la part variable au regard du montant versé les

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 ETAGIA ACADÉMIE — Formation professionnelle
Contexte Afrique francophone · Cas pratiques terrain
© ETAGIA — Licence accordée à l'acheteur uniquement
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    shortLongDesc: `Finalité des objectifs, plan d'action commerciale, méthodes de fixation (top-down, bottom-up, mixte), méthode SMART, objectifs quantitatifs et qualitatifs, suivi et réajustement.`,
    rating: 4.8,
    sales: 0,
    pages: 46,
    fileSize: 'PDF · 46 pages',
    tags: ["objectifs", "SMART", "commercial", "management", "pilotage"],
    status: 'published',
    new: true,
    createdAt: 1748200000000,
    updatedAt: 1748200000000,
  },
  {
    id: 'et_pl12',
    type: 'cours',
    title: "Panorama des logiciels de gestion de stock",
    author: 'ETAGIA Académie',
    price: 18900,
    cover: '💻',
    desc: "Comparer et choisir son logiciel WMS adapté à votre activité.",
    longDesc: `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📚 COURS ETAGIA ACADÉMIE
PANORAMA DES LOGICIELS DE GESTION DE STOCK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Contexte
Le stock désigne les marchandises quʼune entreprise a lʼintention de vendre dans le but de faire des profits. La
gestion de ce stock constitue un élément stratégique de la chaîne dʼapprovisionnement. Cela désigne le suivi des
marchandises, depuis le fournisseur jusquʼaux entrepôts, puis des entrepôts au point de vente. Le but de la
gestion des stocks est de mettre à la disposition des consommateurs les bons produits, au bon endroit et surtout
au bon moment. Pour cela, il faut avoir une idée du stock présent dans les entrepôts, mais aussi au niveau des
points de vente, afin de savoir quand passer une nouvelle commande.
Pour assurer une gestion optimale à tous ces niveaux, des entreprises tech ont développé un logiciel de gestion
des stocks. En eﬀet, le logiciel de gestion des stocks est un programme qui vous donne le contrôle des
marchandises stockées. Ses fonctionnalités de base sont lʼenregistrement des unités stockées, leurs
emplacements et lʼhistorique de toutes les entrées et sorties. En dehors de ces fonctions de base, le logiciel de
gestion de stock peut embarquer de nombreuses autres fonctionnalités.
Par ces fonctionnalités, ce programme sʼinvite comme un logiciel indispensable dans pratiquement toutes les
installations logistiques. Cela est dû au fait que la gestion manuelle augmente le risque dʼerreurs et réduit
lʼeﬀicacité. Pour cette raison, il est important dʼopter pour un logiciel de gestion des stocks.
Afin de commencer la gestion de stock, il est important de connaître les définitions suivantes.
Définition

Stock

Le stock représente lʼensemble des biens achetés, fabriqués ou en cours de fabrication qui sont destinés à la
vente. Il prend également en compte les biens défectueux qui peuvent être réparés ainsi que les matières
premières.
Définition

Stockage

Le stockage est défini comme le placement intelligent du stock, afin quʼil puisse facilement être retrouvé. Encore
appelé entreposage, le stockage répond à certaines règles afin de garantir le maintien de la marchandise en bon
état. Il aide aussi à optimiser lʼespace et à assurer la sécurité des salariés.
Lorsque le stockage est bien fait, vous pouvez connaître à tout moment la quantité de marchandise disponible et
mise à la vente.
Pourquoi gérer les stocks ?
La gestion des stocks présente de nombreux avantages dans une entreprise. En fonction des activités de votre
entreprise, cela est même indispensable.
En premier, elle aide à répondre à la demande. Une bonne gestion des stocks aide lʼentreprise à déterminer quand
sʼapprovisionner et les quantités à acheter. Cʼest une tâche indispensable pour répondre eﬀicacement aux attentes
des clients, puisquʼun stock doit contenir les articles demandés en quantité suﬀisante. Pour cela, les personnes
responsables des stocks doivent connaître les tendances du marché, les distributeurs, les demandes ainsi que les
délais de livraison.
De plus, avec une gestion optimisée des stocks, il est possible de faire des économies. Notez que le fait dʼavoir un
stock dans une entreprise a un coût dʼacquisition, de dévalorisation et de conservation.
Avoir une bonne gestion des stocks revient donc à éviter la rupture de stock et à minimiser les coûts.

Généralité sur la notion de gestion de stock

Installer un logiciel de gestion des stocks
Installer un logiciel de gestion des stocks représente une évolution dans la gestion de votre entreprise,
contrairement à la gestion manuelle sur papier. Cela présente également plusieurs avantages comparés aux outils
bureautiques standards comme Excel.
Grâce à un logiciel de gestion des stocks, vous améliorez lʼeﬀicacité des processus logistiques comme lʼentrée et la
sortie des stocks. De même, vous avez une meilleure visualisation sur lʼinventaire des stocks et les prévisions de la
quantité de stock requise à un moment donné.
Parmi les nombreux avantages des logiciels de gestion des stocks, on note :
Le logiciel de gestion de stock contrôle la traçabilité des produits en enregistrant les marchandises à la
réception et à lʼexpédition.
Il assure un suivi précis du niveau de stock, coordonne les comptages cycliques et détermine les paramètres
comme les points de commande ou le stock maximum par référence, selon la demande du marché et les
prévisions du responsable logistique.
En dehors de ces avantages, le logiciel de gestion de stock indique également les niveaux de stock en temps réel, ce
qui aide le responsable à connaître à tout moment le statut de chaque référence et la disponibilité du stock. Cet
avantage réduit le risque de rupture de stock sur les commandes pour raison d'indisponibilité du produit.
Complément

Gestion de stock avec une vision centralisée en temps réel

Si lʼentreprise possède plusieurs sites pour stocker les marchandises, le logiciel de gestion de stock vous permet
dʼavoir un aperçu sur lʼensemble de lʼarrière-boutique depuis un tableau de bord. Grâce à cette vision dʼensemble,
vous pourrez optimiser ce que vous possédez dans le magasin de stockage et réduire les coûts qui y sont liés.
Avec Internet qui devient un outil de plus en plus omniprésent dans toutes les activités, le logiciel de gestion de
stock permet de traiter les commandes clients venant de tous les points de vente à lʼaide dʼun seul et même
logiciel. Vous pouvez avoir une vision en temps réel de toutes les étapes depuis lʼexpédition, la préparation, etc.
Tout ceci est accompagné des documents de ventes comme le bon de livraison, la facture, le bon de commande,
la facture dʼavoir, etc.
Lʼun des avantages dʼopter pour un logiciel de gestion de stock est de pouvoir minimiser les erreurs.
Quelques fonctionnalités clés du logiciel de gestion des stocks
Diﬀérents logiciels de gestion des stocks ont été créés ces dernières années. Chaque tendance de consommation
interpelle 

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 ETAGIA ACADÉMIE — Formation professionnelle
Contexte Afrique francophone · Cas pratiques terrain
© ETAGIA — Licence accordée à l'acheteur uniquement
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    shortLongDesc: `Généralités sur la gestion de stock, fonctionnalités clés, tour d'horizon des solutions du marché africain : Odoo, Dolibarr, WMS spécialisés. Critères de choix et mise en œuvre.`,
    rating: 4.6,
    sales: 0,
    pages: 44,
    fileSize: 'PDF · 44 pages',
    tags: ["logiciel", "ERP", "stock", "digital", "informatique"],
    status: 'published',
    new: true,
    createdAt: 1748200000000,
    updatedAt: 1748200000000,
  },
  {
    id: 'et_rp13',
    type: 'cours',
    title: "Le reporting : analyser pour décider",
    author: 'ETAGIA Académie',
    price: 17900,
    cover: '📋',
    desc: "Construire des reportings actionnables et prendre les bonnes décisions de gestion.",
    longDesc: `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📚 COURS ETAGIA ACADÉMIE
LE REPORTING : ANALYSER POUR DÉCIDER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Contexte
On ne fait pas du reporting juste pour faire du reporting. Cʼest un travail indispensable pour garder un œil, en
temps réel, sur la situation de lʼentreprise, sur le travail réalisé et surtout, sur les mesures à prendre pour corriger
une trajectoire. Tout lʼart du reporting ne repose pas que sur le choix des indicateurs. Il implique également
lʼanalyse de ceux-ci permettant de décider sʼil faut agir ou non. Enfin, le choix de la présentation, sous forme de
tableau de bord, peut paraître purement esthétique, mais lʼenjeu est bien plus grand.

A. Définitions
Définition

Le reporting

Le reporting consiste à rendre compte, le plus souvent auprès de sa hiérarchie, de lʼactivité dʼune entreprise. Il
consiste à récupérer des informations, les compiler, les analyser, pour en extraire lʼessentiel et les tendances qui
se dessinent pour lʼactivité de lʼentreprise. Lʼactivité du reporting permet la prise de décision sur des données
objectives.
Exemple
La présentation des résultats dʼune entreprise à ses actionnaires est une activité de reporting.
Définition

Le reporting commercial

Le reporting commercial consiste à collecter et analyser les données issues de lʼactivité dʼune équipe
commerciale. En quoi le reporting est-il une activité indispensable ? Souvent considéré comme trop chronophage
et peu eﬀicace, le reporting reste malgré tout un aspect primordial dʼune activité commerciale. Il permet non
seulement dʼanalyser des données passées, mais également dʼextraire des tendances pour anticiper une
évolution à court terme.

B. Rappel sur les indicateurs et le tableau de bord
Définition

Les indicateurs

Un indicateur est une information qui permet à un décideur dʼévaluer une situation donnée.
Exemple
Si je vous dis quʼil fait 15 °C, cʼest une donnée. A-t-elle du sens ? Pas vraiment, car elle ne peut pas être analysée et
interprétée :
En intérieur ou en extérieur ?
Quelle est la saison ?
Telle quelle, cette donnée ne nous dit pas si cela signifie quʼil fait chaud, froid, que la température est normale,
trop basse, trop haute, etc.

Généralités

Indicateurs qualitatifs et quantitatifs
On classe les indicateurs en deux catégories : les indicateurs quantitatifs et les indicateurs qualitatifs.

Le rôle des indicateurs
Lʼindicateur est une déclinaison des objectifs fixés, il doit permettre dʼanalyser une situation pour suivre
lʼavancement des objectifs. Mais surtout, lʼindicateur doit entrainer une réaction du décideur :
Ne rien faire : ne rien faire est une réaction, si lʼindicateur signale que tout va bien.
Agir : si lʼindicateur signale quʼil y a un problème.

4

Généralités

La classification
On peut ainsi classer les indicateurs en trois catégories diﬀérentes :

Les indicateurs dʼalerte
Comme leur nom lʼindique, les indicateurs dʼalerte sont des alarmes pour mettre en lumière un dysfonctionnement,
un état anormal de la performance. Ils doivent ainsi entrainer une réaction rapide pour corriger cet état. Dans lʼidéal,
le niveau dʼalerte ne doit pas être trop tardif, mieux vaut tirer la sonnette dʼalarme suﬀisamment tôt pour apporter
une correction avant que les eﬀets ne soient trop diﬀiciles à corriger.
Exemple
Dans le cadre de la performance commerciale, il est possible de placer des alertes sur la marge, pour signaler au
manager que ses vendeurs concèdent trop de remises, par exemple.
Remarque
Pour lʼanecdote, au temps des mineurs, ceux-ci utilisaient un indicateur très fiable de la qualité de lʼair au fond de
la mine : le canari ! Bien plus sensible que lʼhomme à la qualité de lʼair, dès que son comportement se modifiait,
cela signifiait quʼil était temps de remonter à la surface, avant que les hommes eux-mêmes ne subissent les eﬀets
de lʼappauvrissement de lʼair. Le canari constituait un parfait indicateur dʼalerte qui anticipait suﬀisamment pour
apporter une action correctrice avant quʼil ne soit trop tard !
Les indicateurs dʼéquilibration
Ces indicateurs permettent surtout de porter un regard sur lʼavancement des objectifs et de réaliser des projections
pour déterminer si lʼobjectif fixé semble atteignable. En eﬀet, ce sont des indicateurs qui peuvent parfois mettre en
évidence les « mauvais » objectifs.

5

Exercice : Quizsolution

Exemple
Un indicateur dʼéquilibration pourrait être le taux dʼavancement de la réalisation dʼun objectif. Par exemple, vous
devez faire un chiﬀre dʼaﬀaires de 10 000 € dans le mois. Nous sommes le 15 du mois et le taux dʼavancement de la
réalisation de lʼobjectif est de 70 %, ce qui signifie quʼen 50 % de temps (la moitié du mois), vous avez réalisé 70 %
de lʼobjectif fixé. Ceci peut donc indiquer que lʼobjectif est éventuellement trop faible.
Les indicateurs dʼanticipation
Ces derniers indicateurs ont un rôle particulier puisquʼils concernent surtout la stratégie de lʼentreprise. En eﬀet, ces
indicateurs prennent le pouls de lʼenvironnement de lʼentreprise pour conforter ou corriger la stratégie adoptée.
Exemple
On peut, par exemple, avoir des indicateurs pour suivre les parts de marché des concurrents. Si un concurrent
gagne de plus en plus de parts de marché, lʼentreprise se devra de réagir et de contrer cette tendance (en faisant
une campagne publicitaire, par exemple).
Les indicateurs dʼanticipation sont généralement utilisés dans les niveaux supérieurs de la hiérarchie, du moins
dans les niveaux directement impliqués dans la mise en place de la stratégie de lʼentreprise.
Complément

Diﬀérence entre un indicateur et une donnée

Exercice : Quiz

[solution n°1 p.15]

Question 1
Lʼactivité de reporting consiste principalement :


À transmettre des objectifs du haut de la hiérarchie, vers le bas de la hiérarchie



À surveiller que les collaborateurs eﬀectuent leur travail



À rendre compte de lʼactivité de lʼentreprise

Question 2
Une donnée est un ind

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 ETAGIA ACADÉMIE — Formation professionnelle
Contexte Afrique francophone · Cas pratiques terrain
© ETAGIA — Licence accordée à l'acheteur uniquement
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    shortLongDesc: `Définitions, rappel sur indicateurs et tableaux de bord, choix des références, analyse comparative, passage à l'action. L'art du reporting ne repose pas que sur les chiffres.`,
    rating: 4.7,
    sales: 0,
    pages: 40,
    fileSize: 'PDF · 40 pages',
    tags: ["reporting", "analyse", "décision", "management", "pilotage"],
    status: 'published',
    new: true,
    createdAt: 1748200000000,
    updatedAt: 1748200000000,
  },
  {
    id: 'et_ro14',
    type: 'cours',
    title: "La rotation des produits en magasin",
    author: 'ETAGIA Académie',
    price: 13900,
    cover: '🔄',
    desc: "FIFO, DLC, DDM, taux de rotation : maîtrisez votre flux produits.",
    longDesc: `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📚 COURS ETAGIA ACADÉMIE
LA ROTATION DES PRODUITS EN MAGASIN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Contexte
Une bonne gestion des stocks est indispensable pour assurer la pérennité d'une entreprise et la rotation des
produits en est une notion essentielle, mais, en quoi consiste-t-elle ? Qu'est-ce qu'une bonne rotation, mais
également quelle peuvent être les conséquences d'une mauvaise surveillance de celle-ci ?
Très souvent une bonne rotation des produits est représentative d'une bonne gestion des stocks.

A. Rôle de la rotation des produits
Description de la rotation des produits et de la méthode FIFO
La rotation des produits exprime le renouvellement des produits sur les linéaires de vente. Un produit dit « à forte
rotation » reste peu de temps en rayon, c'est donc un produit très demandé qui devra être renouvelé fréquemment.
La technique FIFO (« First In First Out » ou « Premier Entré, Premier Sorti ») est fondée sur le principe selon lequel les
produits achetés en premier sont les premiers à sortir du stock. L'objectif final de la méthode FIFO est d'obtenir une
excellente rotation des marchandises en donnant la priorité à la sortie des produits qui sont stockés depuis plus
longtemps, et risquent de devenir périssables ou obsolètes.
Cette gestion des produits est utilisée quotidiennement dans les supermarchés et les établissements de grande
consommation.

Les enjeux
De façon générale, avoir des produits à forte rotation permet une meilleure rentabilité d'un point de vente, car :
Ils seront stockés moins longtemps, ce qui permet de réduire la charge financière du « stock mort » qu'ils
représentent tant qu'ils ne sont pas vendus.
Le besoin en fonds de roulement diminuera, car si les stocks sont faibles, l'entreprise aura besoin de moins de
ressources pour financer le stockage et la trésorerie s'améliorera.
Un produit à forte rotation est un produit qui se vend mieux, le chiﬀre d'aﬀaires sera donc plus important.
L'image de l'enseigne sera également valorisée du fait de proposer des produits frais avec des dates
cohérentes ce qui participera la fidélisation des clients.
Une rotation rapide est un bon signe, car elle signifie que l'entreprise a une bonne gestion de ses achats, de ses
approvisionnements et de ses stocks. Il faut néanmoins faire attention aux ruptures de stock et au surstockage.

B. Taux de rotation
Définition
Le taux de rotation des stocks mesure le nombre de fois où le stock se renouvelle entièrement au cours d'une
période définie (souvent une année civile).
Chaque entreprise est libre de choisir l'unité de mesure qui sera la plus pertinente en fonction de son activité :
Calcul en tenant compte d'une période d'un mois, d'un trimestre, d'une année, etc.
Calcul en prenant compte du nombre d'unités vendues ou du chiﬀre d'aﬀaires.

Description et enjeux d'une bonne rotation des produits

Méthode

Calcul du taux de rotation

Pour calculer notre taux de rotation des stocks, nous allons prendre le stock écoulé sur une période donnée que
nous allons diviser par le stock que nous possédons en moyenne.
La formule du taux de rotation est donc la suivante :
Taux de rotation = Stock vendu (sur une période donnée) / Stock moyen
Pour calculer le taux de rotation des stocks, il faut déjà calculer le stock moyen sur une période donnée ; pour cela
il suﬀit d'additionner le stock de début et de fin de cette période puis de le diviser par deux.
Le stock moyen se calcule grâce à la formule suivante :
Stock moyen = (Stock de début + Stock de fin) / 2

La couverture de stock
La durée de rotation des stocks ou couverture de stock se mesure en jour. C'est un indicateur très important pour le
point de vente. Il permet de savoir combien de jours il faut pour renouveler le stock moyen. C'est la vitesse
d'écoulement du stock moyen. L'objectif de tout point de vente est de baisser au maximum la durée de rotation des
stocks, car garder longtemps des produits en stock coûte cher. Le calcul est le suivant :
Durée de la période / Taux de rotation.
Si la période de référence est d'un an, la formule est : 360 jours / Taux de rotation,
Si la période de référence est d'un mois, la formule est : 30 jours / Taux de rotation,
Etc.
Exemple
Afin d'étudier la rotation d'un de ses produits, l'entreprise ProMag nous transmet les données suivantes pour
l'année N-1 :
Date

Quantité en
stock

Pour info

1er janvier

400

Stock initial

12 mars

250

7 avril

350

23 juillet

100

18 septembre

400

15 novembre

200

31 décembre

250

Stock final

Sur cette même année, le nombre de produits vendus était de 1 150 unités.

4

Exercice : Quizsolution

On commence par calculer notre stock moyen grâce à la formule vue précédemment :
Stock moyen = (Stock de début + Stock de fin)/ 2 = (400 + 250) / 2 = 325
On applique la formule du taux de rotation afin de déterminer celui-ci :
Taux de rotation = Stock vendu / Stock moyen = 1 150 / 325 = 3,54
On constate que le stock de ce produit a été renouvelé plus de trois fois au cours de cette année, et que nous
possédons en moyenne dans notre stock 325 unités de cette référence.
On détermine alors notre couverture de stock :
Jours de couverture = Durée de la période / Taux de rotation = 360 / 3,54 = 101,70
La durée moyenne de rotation du stock est donc de 101,70 jours. C'est le nombre de jours qu'il faut afin que le
stock soit entièrement renouvelé.
Complément

Qu'est-ce qu'un bon taux de rotation ?

Nous sommes maintenant capables de définir et calculer un taux de rotation, mais qu'est-ce qu'un bon taux de
rotation des stocks ?
Il n'y a pas de taux de rotation idéal, car celui-ci varie grandement selon le secteur d'activité, mais, plus le taux est
proche de 1, plus le modèle de gestion des stocks est à revoir. À l'inverse, un taux de rotation élevé témoigne
d'une logistique bien huilée et de faibles besoins en fonds de roulement.

Exercice : Quiz

[solution n°1 p.11]

Question 1
La ro

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 ETAGIA ACADÉMIE — Formation professionnelle
Contexte Afrique francophone · Cas pratiques terrain
© ETAGIA — Licence accordée à l'acheteur uniquement
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    shortLongDesc: `Rôle et calcul du taux de rotation, méthode FIFO, DLC et DDM, catégories de produits, risques d'une mauvaise rotation (pertes, ruptures, invendus) et techniques d'optimisation.`,
    rating: 4.6,
    sales: 0,
    pages: 32,
    fileSize: 'PDF · 32 pages',
    tags: ["rotation", "FIFO", "DLC", "stocks", "magasin"],
    status: 'published',
    new: true,
    createdAt: 1748200000000,
    updatedAt: 1748200000000,
  },
  {
    id: 'et_tb15',
    type: 'cours',
    title: "Construire et lire un tableau de bord",
    author: 'ETAGIA Académie',
    price: 19900,
    cover: '📊',
    desc: "Concevoir, interpréter et commenter un tableau de bord commercial.",
    longDesc: `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📚 COURS ETAGIA ACADÉMIE
CONSTRUIRE ET LIRE UN TABLEAU DE BORD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Contexte
Le tableau de bord est un outil précieux de gestion.
Ce tableau, qui synthétise lʼactivité dʼun service ou dʼune entreprise, permet une lecture rapide des éléments clés.
Il existe autant de tableaux de bord que de gestionnaires ; nous verrons donc dans cette séance leurs principales
formes de présentation ainsi que des exemples concrets dans diﬀérents types de commerce.
Dans lʼexercice de votre futur métier, vous aurez des tableaux de bords à lire et à interpréter. Cette séance vous
permettra dʼacquérir des techniques utiles à la bonne utilisation de ces tableaux de bord.

A. Qu'est-ce quʼun tableau de bord ?
Rappel

Indicateur

Un indicateur est une donnée chiﬀrée qui permet de mesurer la performance de lʼentreprise.
Il existe des indicateurs pour chacune des activités de lʼentreprise.
Concernant lʼactivité Vente, nous retrouvons 2 grands types dʼindicateurs :
Les indicateurs liés à la vente (taux d'atteinte de CA, taux de transformation, panier moyen, taux de marge,
taux de marque),
Les indicateurs liés à la gestion des stocks (stock moyen, taux de rupture de stock, taux de rotation des
stocks).
Définition

Tableau de bord

Selon le dictionnaire le Robert :
Tableau de bord (d'un avion, d'une voiture) : panneau où sont réunis les instruments de bord.
Les instruments de bord sont constitués de tous les témoins et des jauges qui nous permettent de surveiller le bon
état de fonctionnement dʼune voiture, nous permettant ainsi de la conduire en sécurité.
Dans l'entreprise, ces instruments de bords sont les indicateurs.
Pour une entreprise, le tableau de bord réunit également des instruments de mesures qui vont permettre aux
équipes dʼobtenir des informations sur « l'état de l'entreprise » et sur la façon dont ils peuvent la faire évoluer, la
conduire.

Tableau de bord

Méthode

Construction dʼun tableau de bord

Le tableau de bord est un tableau à double entrée composé de lignes et de colonnes.
Les indicateurs peuvent être positionnés sur des lignes comme ici :

Et ils peuvent également être positionnés sur des colonnes comme dans ce tableau :

Méthode

Choix des indicateurs

Le choix des indicateurs qui composent le tableau de bord est une décision qui appartient à la direction.
Les équipes de vente peuvent être intégrées à ce choix stratégique.
Lʼobjectif est de choisir des indicateurs pertinents qui puissent traduire lʼactivité et qui permettent dʼidentifier
les points forts et les points faibles.
Lʼobjectif du tableau de bord est de fournir un outil de pilotage aux gestionnaires.

4

Tableau de bord

B. Analyse et interprétation des chiﬀres du tableau de bord
Méthode

Détecter les écarts

Voici le tableau de bord de suivi du chiﬀre dʼaﬀaires de 5 univers dʼun supermarché concernant lʼactivité du mois
dʼavril écoulé.

Lʼobjectif du tableau de bord est de synthétiser les résultats de lʼactivité.
Un écart correspond à une diﬀérence entre une prévision (de chiﬀre d'aﬀaires, dʼindice des ventes, de tout
autres indicateurs) et lʼobjectif initialement fixé.
Dans le tableau qui est présenté ci-dessus, les écarts représentent la diﬀérence entre lʼobjectif de CA fixé et le CA
réalisé.
Certains écarts peuvent être positifs (en vert dans le tableau) et lʼobjectif est alors dépassé. Le % dʼatteinte
de lʼobjectif dépasse les 100 % comme pour le rayon épicerie du supermarché de notre exemple. (+ 103 %)
Dʼautres écarts sont négatifs (en rouge dans le tableau) et lʼobjectif nʼest alors pas atteint. Le pourcentage
dʼatteinte de lʼobjectif est en deçà des 100 %, 89 % en ce qui concerne le rayon Marée de notre supermarché.
Mise en place dʼun plan dʼaction
La mise en place dʼun plan dʼaction est la finalité de ce travail dʼanalyse qui conduit lʼentreprise à construire les
tableaux de bords.
En eﬀet, lʼanalyse des écarts qui ressortent du tableau de bord permet l'identification des forces et des faiblesses
du commerce.
Lʼobjectif du plan dʼaction est de :
Progresser sur les points faibles (les faiblesses),
Consolider les réussites (les forces).
Un plan dʼaction est une série de mesures visant à rétablir les indicateurs qui font ressortir les faiblesses du
commerce.

5

Exercice : Quizsolution

Dans lʼexemple de ce supermarché, nous identifions rapidement que lʼobjectif de CA est atteint dans le rayon
Épicerie, Frais et Surgelé.
Les rayons marée et boucherie nʼont pas atteint leur objectif.
L'objectif général de chiﬀre dʼaﬀaires est lui atteint à 97 %, il est également en deça de lʼobjectif.
Voici un exemple de plan dʼaction qui peut être mis en place :
Rayon
Marée

Boucherie

Plan dʼaction
Réimplanter le rayon marée et
changer les meubles qui sont
vieillissants.

Rendre le rayon plus
attractif pour augmenter le
CA

Visite hebdomadaire des
concurrents,

Fidéliser la clientèle et
attirer de nouveaux clients
pour augmenter le CA

Proposition dʼun produit
boucherie par semaine à un
prix toujours moins cher que la
concurrence.
Epicerie

Exercice : Quiz

Objectif

Travailler sur une amélioration de la
marge brute du rayon en
réimplantant les produits à fortes
marges au niveau des yeux et des
mains.

Augmenter la rentabilité de
ce rayon

[solution n°1 p.15]

Question 1
Le tableau de bord est utile :


Pour les clients



Pour lʼentreprise

Question 2

6

Exercice : Quizsolution

Quʼest-il nécessaire de détecter dans un tableau de bord ?


Des écarts



Des erreurs

Question 3
Les indicateurs du tableau de bord peuvent être positionnés.


En ligne



En colonne



En ligne ou en colonnes

Question 4
Le choix des indicateurs est fait en fonction :


Des performances à évaluer



Des périodes à analyser

Question 5
Que va-t-on mettre en place à la suite de lʼanalyse dʼun tableau de bord ?


Un plan dʼaction



Une nouvelle analyse

7

Commentaires de tableaux de bord

III. Commentaires de tableaux 

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 ETAGIA ACADÉMIE — Formation professionnelle
Contexte Afrique francophone · Cas pratiques terrain
© ETAGIA — Licence accordée à l'acheteur uniquement
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    shortLongDesc: `Définition et rôle d'un indicateur, structures d'un tableau de bord, analyse des chiffres, exemples concrets de TDB supermarché et boutique prêt-à-porter. Adapté au contexte africain.`,
    rating: 4.8,
    sales: 0,
    pages: 46,
    fileSize: 'PDF · 46 pages',
    tags: ["tableau de bord", "indicateurs", "gestion", "reporting", "pilotage"],
    status: 'published',
    new: true,
    createdAt: 1748200000000,
    updatedAt: 1748200000000,
  }
]
