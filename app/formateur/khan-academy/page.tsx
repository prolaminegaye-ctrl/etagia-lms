'use client'
import { useState, useMemo } from 'react'

/* ─────────────────────────────────────────────────────────────────────────────
   Khan Academy — Page Formateur ETAGIA
   Catalogue 100 % en FRANÇAIS — vidéos depuis KhanAcademyFrancophone (YouTube)
   IDs YouTube vérifiés sur la chaîne officielle UCxJOha9_0qZHuGf1d4imhyQ
──────────────────────────────────────────────────────────────────────────── */

type ContentType = 'video' | 'exercice'

interface KAItem {
  id:         string
  type:       ContentType
  matiere:    string
  niveau:     string
  titre:      string
  desc:       string
  duree?:     string
  questions?: number
  youtubeId?: string        // seulement si vidéo FR vérifiée
  kaUrl:      string
  tags:       string[]
}

/* ── CATALOGUE 100 % FRANÇAIS ────────────────────────────────────────────── */
const CATALOGUE: KAItem[] = [

  /* ── MATHÉMATIQUES ── */
  { id:'m-sin-per',  type:'video',    matiere:'Maths',        niveau:'Lycée',      titre:'Période de la fonction Sinus',          desc:"Comprendre la période, l'amplitude et les transformations de la fonction sinus sur le cercle trigonométrique.",                           duree:'9 min',  youtubeId:'qovO0euEsOk', kaUrl:'https://fr.khanacademy.org/math/trigonometry/trig-function-graphs/trig-period-amplitude/v/period-of-sinusoidal-functions',                        tags:['trigonométrie','sinus','période'] },
  { id:'m-sin-amp',  type:'video',    matiere:'Maths',        niveau:'Lycée',      titre:'Décalage vertical et amplitude',        desc:"Comment l'amplitude et le décalage vertical modifient le graphe des fonctions sinusoïdales.",                                              duree:'11 min', youtubeId:'2GrykOW_j6k', kaUrl:'https://fr.khanacademy.org/math/trigonometry/trig-function-graphs/trig-period-amplitude/v/we-1-midline-and-amplitude',                          tags:['trigonométrie','amplitude','fonctions'] },
  { id:'m-deriv-c',  type:'video',    matiere:'Maths',        niveau:'Terminale',  titre:'Dérivée d\'une fonction composée',       desc:"Règle de dérivation des fonctions composées — méthode pas-à-pas avec exemples polynomiaux et trigonométriques.",                             duree:'12 min', youtubeId:'RyGXGSCAJlY', kaUrl:'https://fr.khanacademy.org/math/calculus-1/cs1-derivatives-chain-rule-and-other-advanced-topics/cs1-chain-rule/v/chain-rule-introduction',    tags:['calcul','dérivées','règle chaîne'] },
  { id:'m-frac-v',   type:'video',    matiere:'Maths',        niveau:'Collège',    titre:'Fractions — Introduction',              desc:"Numérateur, dénominateur et représentation visuelle des fractions : comprendre les fondamentaux avec des exemples concrets.",               duree:'8 min',                           kaUrl:'https://fr.khanacademy.org/math/arithmetic/fraction-arithmetic',                                                                                       tags:['fractions','arithmétique'] },
  { id:'m-eq1-v',    type:'video',    matiere:'Maths',        niveau:'Collège',    titre:'Équations du 1er degré',                desc:"Isoler l'inconnue et résoudre ax + b = c — méthode équilibre illustrée étape par étape.",                                                 duree:'13 min',                          kaUrl:'https://fr.khanacademy.org/math/algebra/one-variable-linear-equations',                                                                               tags:['algèbre','équations'] },
  { id:'m-pyth-v',   type:'video',    matiere:'Maths',        niveau:'Collège',    titre:'Théorème de Pythagore',                 desc:"Démonstration visuelle et applications dans des triangles rectangles — cas classiques et variantes.",                                    duree:'14 min',                          kaUrl:'https://fr.khanacademy.org/math/basic-geo/basic-geometry-pythagorean-theorem',                                                                         tags:['géométrie','pythagore'] },
  { id:'m-proba-v',  type:'video',    matiere:'Maths',        niveau:'Lycée',      titre:'Probabilités — Fondements',             desc:"Espaces d'événements, complémentaires, probabilités conditionnelles — bases solides pour le lycée et au-delà.",                           duree:'11 min',                          kaUrl:'https://fr.khanacademy.org/math/statistics-probability/probability-library',                                                                           tags:['probabilités','statistiques'] },
  { id:'m-matx-v',   type:'video',    matiere:'Maths',        niveau:'Université', titre:'Matrices et systèmes linéaires',        desc:"Opérations matricielles, rang et résolution par la méthode de Gauss — algèbre linéaire de niveau universitaire.",                        duree:'22 min',                          kaUrl:'https://fr.khanacademy.org/math/linear-algebra',                                                                                                       tags:['algèbre linéaire','matrices'] },
  { id:'m-frac-ex',  type:'exercice', matiere:'Maths',        niveau:'Collège',    titre:'Exercices : Fractions — Opérations',   desc:"Série interactive : addition, soustraction et simplification de fractions avec corrigés automatiques.",                                    questions:15,                            kaUrl:'https://fr.khanacademy.org/math/arithmetic/fraction-arithmetic/arith-review-add-frac-w-unlike-den/e/adding_fractions',                                  tags:['fractions','pratique'] },
  { id:'m-eq1-ex',   type:'exercice', matiere:'Maths',        niveau:'Collège',    titre:'Exercices : Équations 1er degré',      desc:"Entraînement progressif sur la résolution d'équations à une inconnue — 20 niveaux de difficulté.",                                       questions:20,                            kaUrl:'https://fr.khanacademy.org/math/algebra/one-variable-linear-equations/alg1-one-step-add-sub-equations/e',                                              tags:['équations','pratique'] },
  { id:'m-pyth-ex',  type:'exercice', matiere:'Maths',        niveau:'Collège',    titre:'Exercices : Théorème de Pythagore',    desc:"Calculer des hypoténuses et des côtés manquants — applications dans des figures géométriques variées.",                                    questions:12,                            kaUrl:'https://fr.khanacademy.org/math/basic-geo/basic-geometry-pythagorean-theorem/pythagorean-theorem-basic/e/pythagorean-theorem-1',                        tags:['géométrie','pratique'] },
  { id:'m-trig-ex',  type:'exercice', matiere:'Maths',        niveau:'Lycée',      titre:'Exercices : Trigonométrie',           desc:"Sin, cos, tan dans les triangles rectangles — exercices interactifs du collège au lycée.",                                                   questions:18,                            kaUrl:'https://fr.khanacademy.org/math/trigonometry',                                                                                                         tags:['trigonométrie','pratique'] },

  /* ── PHYSIQUE ── */
  { id:'ph-ref-v',   type:'video',    matiere:'Physique',     niveau:'Lycée',      titre:'Introduction à la notion de référentiel', desc:"Qu'est-ce qu'un référentiel ? Référentiel terrestre, géocentrique et héliocentrique — bases de la mécanique.",                              duree:'10 min', youtubeId:'F4DEO8Q8oj4', kaUrl:'https://fr.khanacademy.org/science/physics/one-dimensional-motion',                                                                              tags:['mécanique','référentiel','physique'] },
  { id:'ph-gaz-v',   type:'video',    matiere:'Physique',     niveau:'Terminale',  titre:'Théorie cinétique des gaz',             desc:"Les lois des gaz parfaits, pression, volume et température — du modèle microscopique aux lois macroscopiques.",                          duree:'16 min', youtubeId:'syCNKCML5PQ', kaUrl:'https://fr.khanacademy.org/science/chemistry/ideal-gas-laws',                                                                                 tags:['thermodynamique','gaz','physique'] },
  { id:'ph-new-ex',  type:'exercice', matiere:'Physique',     niveau:'Lycée',      titre:'Exercices : Lois de Newton',           desc:"Appliquer les trois lois de Newton à des situations concrètes — force, masse, accélération.",                                             questions:14,                            kaUrl:'https://fr.khanacademy.org/science/physics/forces-newtons-laws',                                                                                       tags:['newton','forces','pratique'] },
  { id:'ph-ener-ex', type:'exercice', matiere:'Physique',     niveau:'Lycée',      titre:'Exercices : Énergie et travail',       desc:"Calculer l'énergie cinétique, potentielle et le travail d'une force — exercices progressifs avec correction.",                             questions:10,                            kaUrl:'https://fr.khanacademy.org/science/physics/work-and-energy',                                                                                           tags:['énergie','travail','pratique'] },

  /* ── CHIMIE ── */
  { id:'ch-elec-v',  type:'video',    matiere:'Chimie',       niveau:'Lycée',      titre:'Électronégativité et liaisons',         desc:"Comment l'électronégativité détermine le type de liaison chimique — covalente, ionique, polaire.",                                        duree:'12 min', youtubeId:'R8sYtR5Dk4c', kaUrl:'https://fr.khanacademy.org/science/chemistry/chemical-bonds',                                                                                  tags:['chimie','liaisons','électronégativité'] },
  { id:'ch-mass-v',  type:'video',    matiere:'Chimie',       niveau:'Lycée',      titre:'Calculer le pourcentage massique',      desc:"Méthode pratique pour calculer la composition massique d'un composé — avec un exemple guidé pas à pas.",                                 duree:'9 min',  youtubeId:'DZUsOwL3V9Y', kaUrl:'https://fr.khanacademy.org/science/chemistry/atomic-structure-and-properties',                                                                 tags:['chimie','composition','calcul'] },
  { id:'ch-dil-v',   type:'video',    matiere:'Chimie',       niveau:'Lycée',      titre:'Les dilutions en chimie',               desc:"Calculer la concentration d'une solution diluée — formule C₁V₁ = C₂V₂ expliquée et appliquée.",                                          duree:'8 min',  youtubeId:'w_1xpZdyOdo', kaUrl:'https://fr.khanacademy.org/science/chemistry/reactions-stoichiometry',                                                                         tags:['chimie','dilution','concentration'] },
  { id:'ch-atm-ex',  type:'exercice', matiere:'Chimie',       niveau:'Lycée',      titre:'Exercices : Structure de l\'atome',    desc:"Protons, neutrons, électrons — identifier la structure atomique et la configuration électronique.",                                          questions:15,                            kaUrl:'https://fr.khanacademy.org/science/chemistry/atomic-structure-and-properties',                                                                              tags:['atome','chimie','pratique'] },
  { id:'ch-reac-ex', type:'exercice', matiere:'Chimie',       niveau:'Terminale',  titre:'Exercices : Stœchiométrie',           desc:"Calculer les quantités de matière dans des réactions chimiques — exercices progressifs avec bilan.",                                       questions:12,                            kaUrl:'https://fr.khanacademy.org/science/chemistry/reactions-stoichiometry',                                                                                     tags:['stœchiométrie','réactions','pratique'] },

  /* ── BIOLOGIE ── */
  { id:'bi-bio-v',   type:'video',    matiere:'Biologie',     niveau:'Lycée',      titre:'Biodiversité',                          desc:"Explorer la diversité du vivant — espèces, gènes, écosystèmes et enjeux de la conservation.",                                             duree:'13 min', youtubeId:'Iu52lXbgmmU', kaUrl:'https://fr.khanacademy.org/science/biology/ecology/biodiversity-and-conservation/v/biodiversity',                                               tags:['biologie','biodiversité','écologie'] },
  { id:'bi-mer-v',   type:'video',    matiere:'Biologie',     niveau:'Université', titre:'Les tissus méristématiques',            desc:"Comprendre les cellules méristématiques des végétaux — croissance primaire, secondaire et différenciation cellulaire.",                   duree:'11 min', youtubeId:'3-BeXmnjds0', kaUrl:'https://fr.khanacademy.org/science/ap-biology/cell-structure-and-function',                                                                   tags:['biologie','végétaux','tissus'] },
  { id:'bi-per-v',   type:'video',    matiere:'Biologie',     niveau:'Université', titre:'Tissus permanents simples',             desc:"Parenchyme, collenchyme, sclérenchyme — caractéristiques, rôles et contribution à la structure des plantes.",                             duree:'14 min', youtubeId:'hXZO_5nn9EM', kaUrl:'https://fr.khanacademy.org/science/ap-biology/cell-structure-and-function',                                                                   tags:['biologie','tissus','végétaux'] },
  { id:'bi-mut-v',   type:'video',    matiere:'Biologie',     niveau:'Terminale',  titre:'Les mutations comme source de variation', desc:"Types de mutations, leurs causes et leurs conséquences sur la diversité génétique et l'évolution.",                                      duree:'10 min', youtubeId:'xgH8DMrOkFM', kaUrl:'https://fr.khanacademy.org/science/biology/molecular-genetics/mutations/v/mutations',                                                    tags:['génétique','mutations','évolution'] },
  { id:'bi-cell-ex', type:'exercice', matiere:'Biologie',     niveau:'Collège',    titre:'Exercices : La cellule',               desc:"Identifier les organites cellulaires et leurs fonctions — quiz interactifs sur cellule animale et végétale.",                               questions:14,                            kaUrl:'https://fr.khanacademy.org/science/ap-biology/cell-structure-and-function/cell-structures-and-their-functions/e/cell-organelles',                      tags:['cellule','organites','pratique'] },
  { id:'bi-gen-ex',  type:'exercice', matiere:'Biologie',     niveau:'Terminale',  titre:'Exercices : Génétique mendélienne',   desc:"Tableaux de croisement, dominance et récessivité — exercices interactifs sur l'hérédité.",                                                  questions:10,                            kaUrl:'https://fr.khanacademy.org/science/biology/classical-genetics',                                                                                        tags:['génétique','hérédité','pratique'] },

  /* ── ÉCONOMIE ── */
  { id:'ec-pib1-v',  type:'video',    matiere:'Économie',     niveau:'Lycée',      titre:'Décryptage du Produit Intérieur Brut',  desc:"Comprendre ce que mesure le PIB et ses composantes — une introduction claire à la macroéconomie.",                                        duree:'11 min', youtubeId:'JV8F9NsD3XU', kaUrl:'https://fr.khanacademy.org/economics-finance-domain/macroeconomics/macro-economic-indicators-and-the-business-cycle',                  tags:['macroéconomie','PIB','indicateurs'] },
  { id:'ec-flux-v',  type:'video',    matiere:'Économie',     niveau:'Lycée',      titre:'Flux circulaires revenus et dépenses',  desc:"Introduction générale aux domaines de la micro et macroéconomie — le modèle des flux circulaires.",                                         duree:'9 min',  youtubeId:'CcxLOiiV9hQ', kaUrl:'https://fr.khanacademy.org/economics-finance-domain/macroeconomics/macro-basic-economics-concepts',                                   tags:['macroéconomie','flux','économie'] },
  { id:'ec-inv-v',   type:'video',    matiere:'Économie',     niveau:'Lycée',      titre:'Investissement et consommation',        desc:"La différence entre investissement économique et consommation — composante du PIB réel expliquée.",                                         duree:'10 min', youtubeId:'ap1vDGMZlfg', kaUrl:'https://fr.khanacademy.org/economics-finance-domain/macroeconomics/macro-economic-indicators-and-the-business-cycle',                  tags:['macroéconomie','investissement','PIB'] },
  { id:'ec-pib2-v',  type:'video',    matiere:'Économie',     niveau:'Lycée',      titre:'Contributions finales au PIB',          desc:"Comment le PIB prend en compte les biens intermédiaires — valeur ajoutée et double comptage.",                                             duree:'12 min', youtubeId:'9p43c3vlwEw', kaUrl:'https://fr.khanacademy.org/economics-finance-domain/macroeconomics/macro-economic-indicators-and-the-business-cycle',                  tags:['macroéconomie','PIB','valeur ajoutée'] },
  { id:'ec-off-ex',  type:'exercice', matiere:'Économie',     niveau:'Lycée',      titre:'Exercices : Offre et demande',         desc:"Analyser des graphiques et prévoir les variations d'équilibre de marché — exercices interactifs.",                                          questions:10,                            kaUrl:'https://fr.khanacademy.org/economics-finance-domain/ap-microeconomics/unit-2-supply-and-demand/supply-and-demand/e',                                    tags:['microéconomie','marché','pratique'] },
  { id:'ec-fin-ex',  type:'exercice', matiere:'Économie',     niveau:'Université', titre:'Exercices : Finance personnelle',      desc:"Budgets, épargne, intérêts composés et planification financière — exercices pratiques applicables immédiatement.",                         questions:8,                             kaUrl:'https://fr.khanacademy.org/economics-finance-domain/core-finance/interest-tutorial',                                                                       tags:['finance','épargne','pratique'] },

  /* ── INFORMATIQUE ── */
  { id:'it-algo-ex', type:'exercice', matiere:'Informatique', niveau:'Lycée',      titre:'Exercices : Algorithmes de tri',       desc:"Tri par sélection, insertion, fusion — comprendre et appliquer les grands algorithmes de tri.",                                             questions:8,                             kaUrl:'https://fr.khanacademy.org/computing/computer-science/algorithms',                                                                                     tags:['algorithmes','tri','pratique'] },
  { id:'it-html-ex', type:'exercice', matiere:'Informatique', niveau:'Lycée',      titre:'Exercices : HTML & CSS',              desc:"Créer et styliser des pages web — exercices interactifs guidés avec résultat visible en temps réel.",                                        questions:20,                            kaUrl:'https://fr.khanacademy.org/computing/computer-programming/html-css',                                                                                   tags:['HTML','CSS','web','pratique'] },
  { id:'it-py-ex',   type:'exercice', matiere:'Informatique', niveau:'Lycée',      titre:'Exercices : Programmation JavaScript', desc:"Variables, boucles, fonctions — apprendre la programmation pas à pas avec des projets interactifs.",                                       questions:25,                            kaUrl:'https://fr.khanacademy.org/computing/computer-programming/programming',                                                                               tags:['programmation','JavaScript','pratique'] },
  { id:'it-bin-ex',  type:'exercice', matiere:'Informatique', niveau:'Lycée',      titre:'Exercices : Système binaire',         desc:"Convertir entre binaire, décimal et hexadécimal — exercices progressifs sur les bases numériques.",                                         questions:12,                            kaUrl:'https://fr.khanacademy.org/computing/computers-and-internet/xcae6f4a7ff015e7d:digital-information',                                                    tags:['binaire','bases','pratique'] },
  { id:'it-sql-ex',  type:'exercice', matiere:'Informatique', niveau:'Université', titre:'Exercices : Requêtes SQL',            desc:"SELECT, WHERE, JOIN, GROUP BY — apprendre SQL en pratiquant sur des bases de données interactives.",                                        questions:18,                            kaUrl:'https://fr.khanacademy.org/computing/computer-programming/sql',                                                                                       tags:['SQL','bases de données','pratique'] },

  /* ── HISTOIRE ── */
  { id:'hi-rev-ex',  type:'exercice', matiere:'Histoire',     niveau:'Lycée',      titre:'La Révolution française',             desc:"Causes, grandes étapes et conséquences de la Révolution de 1789 — quiz et ressources interactives.",                                        questions:12,                            kaUrl:'https://fr.khanacademy.org/humanities/world-history/1600s-1800s/french-revolution-tutorial',                                                          tags:['révolution','1789','France'] },
  { id:'hi-deco-ex', type:'exercice', matiere:'Histoire',     niveau:'Lycée',      titre:'Décolonisation en Afrique',           desc:"Processus de décolonisation, indépendances et enjeux pour l'Afrique contemporaine — ressources et quiz.",                                  questions:10,                            kaUrl:'https://fr.khanacademy.org/humanities/world-history/euro-hist/cold-war-decolonization',                                                               tags:['décolonisation','Afrique','histoire'] },
  { id:'hi-ww2-ex',  type:'exercice', matiere:'Histoire',     niveau:'Lycée',      titre:'La Seconde Guerre mondiale',         desc:"Contexte, grandes batailles et conséquences de la Seconde Guerre mondiale — ressources visuelles et quiz.",                                   questions:14,                            kaUrl:'https://fr.khanacademy.org/humanities/world-history/euro-hist/wwii-the-war',                                                                          tags:['WW2','histoire','guerre'] },
]

const MATIERES = ['Tout','Maths','Physique','Chimie','Biologie','Économie','Informatique','Histoire']
const NIVEAUX  = ['Tout','Collège','Lycée','Terminale','Université']
const TYPES    = ['Tout','Vidéos','Exercices']
const MAT_ICONS: Record<string,string> = {
  Maths:'📐', Physique:'⚡', Chimie:'🧪', Biologie:'🔬',
  Économie:'📊', Informatique:'💻', Histoire:'🏛️'
}

const KA      = '#14BF96'
const KA_L    = '#E3F9F4'
const KA_DARK = '#0D8C6E'

function pill(active: boolean, color: string): React.CSSProperties {
  return {
    padding: '5px 14px', borderRadius: 999, border: 'none',
    cursor: 'pointer', fontSize: 12, fontWeight: active ? 700 : 500,
    fontFamily: 'var(--sans)', transition: 'all .15s',
    background: active ? color : 'var(--surface-2)',
    color: active ? '#fff' : 'var(--ink-soft)',
  }
}

export default function KhanAcademyPage() {
  const [matiere,    setMatiere]    = useState('Tout')
  const [niveau,     setNiveau]     = useState('Tout')
  const [typeFilter, setTypeFilter] = useState('Tout')
  const [search,     setSearch]     = useState('')
  const [selected,   setSelected]   = useState<string | null>(null)
  const [copied,     setCopied]     = useState<string | null>(null)

  const filtered = useMemo(() => CATALOGUE.filter(c => {
    const m = matiere    === 'Tout' || c.matiere === matiere
    const n = niveau     === 'Tout' || c.niveau  === niveau
    const t = typeFilter === 'Tout'
      || (typeFilter === 'Vidéos'    && c.type === 'video')
      || (typeFilter === 'Exercices' && c.type === 'exercice')
    const s = search === ''
      || c.titre.toLowerCase().includes(search.toLowerCase())
      || c.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
      || c.matiere.toLowerCase().includes(search.toLowerCase())
    return m && n && t && s
  }), [matiere, niveau, typeFilter, search])

  const preview = CATALOGUE.find(c => c.id === selected) ?? null

  function copy(text: string, key: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key)
      setTimeout(() => setCopied(null), 1800)
    })
  }

  const nbVideos    = CATALOGUE.filter(c => c.type === 'video').length
  const nbExercices = CATALOGUE.filter(c => c.type === 'exercice').length
  const nbMatieres  = new Set(CATALOGUE.map(c => c.matiere)).size

  return (
    <div style={{ animation: 'fadeIn .25s ease' }}>

      {/* ── HEADER ── */}
      <div style={{
        marginBottom: '2rem', padding: '1.5rem',
        background: KA_L, border: `1px solid ${KA}33`,
        borderRadius: 20, display: 'flex', alignItems: 'center', gap: '1.25rem',
      }}>
        <div style={{ width:52, height:52, borderRadius:14, background: KA, display:'flex', alignItems:'center', justifyContent:'center', fontSize:26, flexShrink:0, boxShadow:`0 6px 20px ${KA}40` }}>
          🎓
        </div>
        <div style={{ flex:1 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4, flexWrap:'wrap' }}>
            <h1 style={{ fontFamily:'var(--serif)', fontSize:22, fontWeight:600, color:'var(--ink)', letterSpacing:'-0.03em', margin:0 }}>Khan Academy</h1>
            <span style={{ fontSize:10, background:KA, color:'#fff', borderRadius:999, padding:'3px 10px', fontWeight:700, fontFamily:'var(--sans)' }}>GRATUIT</span>
            <span style={{ fontSize:10, background:'#fff3', color:KA_DARK, border:`1px solid ${KA}55`, borderRadius:999, padding:'3px 10px', fontWeight:700, fontFamily:'var(--sans)' }}>🇫🇷 ENTIÈREMENT EN FRANÇAIS</span>
          </div>
          <p style={{ color:'var(--ink-mut)', fontSize:13, fontFamily:'var(--sans)', margin:0, lineHeight:1.5 }}>
            Vidéos depuis la chaîne officielle <strong>KhanAcademyFrancophone</strong> · Exercices interactifs sur fr.khanacademy.org · Contenu 100 % en français
          </p>
        </div>
        <a href="https://fr.khanacademy.org" target="_blank" rel="noopener noreferrer"
          style={{ background:KA, color:'#fff', borderRadius:10, padding:'10px 18px', fontFamily:'var(--sans)', fontSize:13, fontWeight:700, textDecoration:'none', whiteSpace:'nowrap', flexShrink:0 }}>
          fr.khanacademy.org ↗
        </a>
      </div>

      {/* ── KPIs ── */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'1rem', marginBottom:'2rem' }}>
        {[
          { v:`${nbMatieres}`,   l:'Matières',            c:KA              },
          { v:`${nbVideos}`,     l:'Vidéos en français',  c:'var(--orange)' },
          { v:`${nbExercices}`,  l:'Séries d\'exercices', c:'var(--turq)'   },
          { v:`${CATALOGUE.length}`, l:'Ressources totales', c:'var(--gold)' },
        ].map(k => (
          <div key={k.l} style={{ background:'var(--surface)', border:'1px solid var(--line)', borderRadius:16, padding:'1.25rem', position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:k.c, borderRadius:'16px 16px 0 0' }} />
            <div style={{ fontFamily:'var(--serif)', fontSize:26, fontWeight:600, color:k.c, marginBottom:4, marginTop:4 }}>{k.v}</div>
            <div style={{ fontSize:11.5, color:'var(--ink-soft)', fontFamily:'var(--sans)' }}>{k.l}</div>
          </div>
        ))}
      </div>

      {/* ── FILTRES ── */}
      <div style={{ background:'var(--surface)', border:'1px solid var(--line)', borderRadius:16, padding:'1.25rem', marginBottom:'1.5rem' }}>
        <input
          type="text"
          placeholder="🔍  Rechercher par titre, matière, notion…"
          value={search}
          onChange={e => { setSearch(e.target.value); setSelected(null) }}
          style={{
            width:'100%', padding:'10px 14px', borderRadius:10,
            border:'1px solid rgba(42,33,24,.18)', fontFamily:'var(--sans)',
            fontSize:13.5, color:'var(--ink)', background:'var(--surface-2)',
            marginBottom:'1rem', display:'block',
          }}
        />
        <div style={{ display:'flex', gap:'2rem', flexWrap:'wrap' }}>
          <div>
            <div style={{ fontSize:10, color:'var(--ink-soft)', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:8, fontFamily:'var(--sans)' }}>Matière</div>
            <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
              {MATIERES.map(m => (
                <button key={m} onClick={() => { setMatiere(m); setSelected(null) }} style={pill(matiere===m, KA)}>
                  {m!=='Tout' && MAT_ICONS[m] ? `${MAT_ICONS[m]} ` : ''}{m}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize:10, color:'var(--ink-soft)', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:8, fontFamily:'var(--sans)' }}>Niveau</div>
            <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
              {NIVEAUX.map(n => (
                <button key={n} onClick={() => { setNiveau(n); setSelected(null) }} style={pill(niveau===n, 'var(--orange)')}>
                  {n}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize:10, color:'var(--ink-soft)', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:8, fontFamily:'var(--sans)' }}>Type</div>
            <div style={{ display:'flex', gap:6 }}>
              {TYPES.map(tp => (
                <button key={tp} onClick={() => { setTypeFilter(tp); setSelected(null) }} style={pill(typeFilter===tp, 'var(--turq)')}>
                  {tp}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div style={{ marginTop:'0.75rem', fontSize:12, color:'var(--ink-soft)', fontFamily:'var(--sans)' }}>
          {filtered.length} ressource{filtered.length>1?'s':''} · Toutes en français 🇫🇷
        </div>
      </div>

      {/* ── CONTENU ── */}
      <div style={{ display:'grid', gridTemplateColumns: preview ? '1fr 1.45fr' : '1fr', gap:'1.5rem', alignItems:'start' }}>

        {/* LISTE */}
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign:'center', padding:'3rem', background:'var(--surface)', border:'1px solid var(--line)', borderRadius:16 }}>
              <div style={{ fontSize:36, marginBottom:12 }}>🔍</div>
              <div style={{ fontFamily:'var(--serif)', fontSize:16, color:'var(--ink)', marginBottom:6 }}>Aucun résultat</div>
              <div style={{ fontSize:13, color:'var(--ink-soft)', fontFamily:'var(--sans)' }}>Modifiez vos filtres.</div>
            </div>
          ) : filtered.map(item => {
            const sel = selected === item.id
            const hasFrVideo = item.type === 'video' && !!item.youtubeId
            return (
              <div
                key={item.id}
                onClick={() => setSelected(sel ? null : item.id)}
                style={{
                  background:'var(--surface)', border:`1px solid ${sel ? (item.type==='video'?`${KA}55`:'var(--orange)') : 'var(--line)'}`,
                  borderRadius:14, padding:'1.1rem 1.25rem', cursor:'pointer', transition:'all .18s',
                  boxShadow: sel ? (item.type==='video'?`0 4px 20px ${KA}18`:'0 4px 20px rgba(251,101,20,.10)') : 'none',
                }}
              >
                <div style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
                  <div style={{ width:42, height:42, borderRadius:11, background:item.type==='video'?KA_L:'var(--orange-50)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>
                    {item.type==='video'?'▶️':'✏️'}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:'flex', gap:5, marginBottom:5, flexWrap:'wrap' }}>
                      <span style={{ fontSize:9.5, borderRadius:999, padding:'2px 8px', fontWeight:700, fontFamily:'var(--sans)', background:item.type==='video'?KA_L:'var(--orange-50)', color:item.type==='video'?KA_DARK:'var(--orange-700)' }}>
                        {item.type==='video'?'▶ Vidéo':'✏ Exercice'}
                      </span>
                      {/* Badge FR vidéo confirmée */}
                      {hasFrVideo && (
                        <span style={{ fontSize:9.5, borderRadius:999, padding:'2px 8px', fontWeight:700, fontFamily:'var(--sans)', background:'#fff3cd', color:'#856404' }}>
                          🇫🇷 Vidéo FR
                        </span>
                      )}
                      {item.type==='video' && !item.youtubeId && (
                        <span style={{ fontSize:9.5, borderRadius:999, padding:'2px 8px', fontWeight:600, fontFamily:'var(--sans)', background:'var(--turq-50)', color:'var(--turq-700)' }}>
                          🔗 Lien KA
                        </span>
                      )}
                      <span style={{ fontSize:9.5, borderRadius:999, padding:'2px 8px', fontWeight:600, fontFamily:'var(--sans)', background:'var(--surface-2)', color:'var(--ink-soft)' }}>
                        {MAT_ICONS[item.matiere]} {item.matiere}
                      </span>
                      <span style={{ fontSize:9.5, borderRadius:999, padding:'2px 8px', fontWeight:600, fontFamily:'var(--sans)', background:'var(--surface-2)', color:'var(--ink-soft)' }}>
                        {item.niveau}
                      </span>
                      {item.duree && (
                        <span style={{ fontSize:9.5, borderRadius:999, padding:'2px 8px', fontWeight:600, fontFamily:'var(--sans)', background:'var(--gold-50)', color:'var(--gold-700)' }}>⏱ {item.duree}</span>
                      )}
                      {item.questions && (
                        <span style={{ fontSize:9.5, borderRadius:999, padding:'2px 8px', fontWeight:600, fontFamily:'var(--sans)', background:'var(--turq-50)', color:'var(--turq-700)' }}>{item.questions} questions</span>
                      )}
                    </div>
                    <div style={{ fontWeight:700, fontSize:14, color:'var(--ink)', fontFamily:'var(--sans)', marginBottom:4 }}>{item.titre}</div>
                    <p style={{ fontSize:12.5, color:'var(--ink-mut)', lineHeight:1.55, margin:0, fontFamily:'var(--sans)' }}>{item.desc}</p>
                  </div>
                  <div style={{ color:'var(--ink-soft)', fontSize:18, flexShrink:0, transition:'transform .18s', transform:sel?'rotate(90deg)':'none' }}>›</div>
                </div>
              </div>
            )
          })}
        </div>

        {/* ── PREVIEW PANEL ── */}
        {preview && (
          <div style={{ background:'var(--surface)', border:'1px solid var(--line)', borderRadius:16, padding:'1.5rem', position:'sticky', top:'1.5rem', animation:'fadeIn .2s ease' }}>
            {/* Header */}
            <div style={{ display:'flex', alignItems:'flex-start', gap:10, marginBottom:'1.25rem', paddingBottom:'1rem', borderBottom:'1px solid var(--line)' }}>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:'var(--serif)', fontWeight:600, fontSize:16, color:'var(--ink)', letterSpacing:'-0.02em', marginBottom:4 }}>{preview.titre}</div>
                <div style={{ fontSize:11, color:'var(--ink-soft)', fontFamily:'var(--sans)' }}>
                  {preview.type==='video'?'▶ Vidéo':'✏ Exercice'} · {preview.matiere} · {preview.niveau} · 🇫🇷 Français
                </div>
              </div>
              <button onClick={() => setSelected(null)} style={{ background:'var(--surface-2)', border:'none', borderRadius:8, padding:'6px 10px', cursor:'pointer', fontSize:14, color:'var(--ink-soft)' }}>✕</button>
            </div>

            {/* Embed YouTube (uniquement si ID FR confirmé) */}
            {preview.type==='video' && preview.youtubeId && (
              <div style={{ marginBottom:'1.25rem', borderRadius:12, overflow:'hidden', border:`1px solid ${KA}33` }}>
                <div style={{ background:KA_L, padding:'6px 12px', display:'flex', alignItems:'center', gap:6, fontSize:11, color:KA_DARK, fontWeight:700, fontFamily:'var(--sans)' }}>
                  🇫🇷 Vidéo en français · KhanAcademyFrancophone
                </div>
                <iframe
                  width="100%" height="200"
                  src={`https://www.youtube.com/embed/${preview.youtubeId}`}
                  title={preview.titre}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ display:'block', border:'none' }}
                />
              </div>
            )}

            {/* Card "Lien KA" pour vidéos sans ID confirmé */}
            {preview.type==='video' && !preview.youtubeId && (
              <div style={{ marginBottom:'1.25rem', background:'var(--surface-2)', border:'1px solid var(--line)', borderRadius:12, padding:'1.5rem', textAlign:'center' }}>
                <div style={{ fontSize:36, marginBottom:10 }}>🎬</div>
                <div style={{ fontFamily:'var(--serif)', fontSize:14, fontWeight:600, color:'var(--ink)', marginBottom:6 }}>Vidéo disponible sur Khan Academy</div>
                <div style={{ fontSize:12, color:'var(--ink-soft)', fontFamily:'var(--sans)', lineHeight:1.5 }}>
                  Cliquez "Ouvrir" pour regarder cette vidéo en français directement sur fr.khanacademy.org
                </div>
              </div>
            )}

            {/* Card exercice */}
            {preview.type==='exercice' && (
              <div style={{ marginBottom:'1.25rem', background:'var(--orange-50)', border:'1px solid rgba(251,101,20,.15)', borderRadius:12, padding:'1.75rem', textAlign:'center' }}>
                <div style={{ fontSize:36, marginBottom:10 }}>✏️</div>
                <div style={{ fontFamily:'var(--serif)', fontSize:15, fontWeight:600, color:'var(--orange-700)', marginBottom:4 }}>{preview.questions} questions interactives</div>
                <div style={{ fontSize:12, color:'var(--ink-soft)', fontFamily:'var(--sans)', lineHeight:1.5 }}>Corrigé automatique · En français · Progression suivie sur KA</div>
              </div>
            )}

            <p style={{ fontSize:13, color:'var(--ink-mut)', lineHeight:1.6, fontFamily:'var(--sans)', marginBottom:'1.25rem' }}>{preview.desc}</p>

            {/* Actions */}
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              <a href={preview.kaUrl} target="_blank" rel="noopener noreferrer"
                style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:6, background:KA, color:'#fff', borderRadius:10, padding:'11px 16px', fontFamily:'var(--sans)', fontSize:13, fontWeight:700, textDecoration:'none' }}>
                🎓 Ouvrir sur fr.khanacademy.org ↗
              </a>
              <button
                onClick={() => copy(preview.kaUrl, 'link')}
                style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:6, background:copied==='link'?KA:'var(--surface-2)', color:copied==='link'?'#fff':'var(--ink-mut)', border:'none', borderRadius:10, padding:'11px 16px', fontFamily:'var(--sans)', fontSize:13, fontWeight:600, cursor:'pointer', transition:'all .15s' }}>
                {copied==='link'?'✓ Lien copié !':'🔗 Copier le lien pour mon cours'}
              </button>
              {preview.type==='video' && preview.youtubeId && (
                <button
                  onClick={() => copy(`<iframe width="560" height="315" src="https://www.youtube.com/embed/${preview.youtubeId}" title="${preview.titre}" frameborder="0" allowfullscreen></iframe>`,'embed')}
                  style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:6, background:copied==='embed'?KA:'var(--turq-50)', color:copied==='embed'?'#fff':'var(--turq-700)', border:'none', borderRadius:10, padding:'11px 16px', fontFamily:'var(--sans)', fontSize:13, fontWeight:600, cursor:'pointer', transition:'all .15s' }}>
                  {copied==='embed'?'✓ Code copié !':'</> Copier le code embed YouTube (FR)'}
                </button>
              )}
            </div>

            {/* Tip */}
            <div style={{ marginTop:'1.25rem', padding:12, background:'var(--gold-50)', border:'1px solid rgba(244,176,30,.3)', borderRadius:10, fontSize:11.5, color:'var(--ink)', fontFamily:'var(--sans)', lineHeight:1.5 }}>
              💡 <strong>Intégrer dans un cours :</strong> collez le lien dans votre module ETAGIA (bloc "Ressource externe") ou utilisez le code embed pour un affichage inline.
            </div>
          </div>
        )}
      </div>

      {/* ── FOOTER ── */}
      <div style={{ marginTop:'2rem', padding:'1.25rem 1.5rem', background:KA_L, border:`1px solid ${KA}22`, borderRadius:16, display:'flex', alignItems:'center', gap:12 }}>
        <span style={{ fontSize:24 }}>ℹ️</span>
        <div>
          <div style={{ fontWeight:700, fontSize:13, color:KA_DARK, fontFamily:'var(--sans)', marginBottom:3 }}>
            Khan Academy Francophone — Contenu 100 % en français
          </div>
          <div style={{ fontSize:12, color:'var(--ink-soft)', fontFamily:'var(--sans)', lineHeight:1.5 }}>
            Les vidéos sont hébergées sur la chaîne officielle <strong>KhanAcademyFrancophone</strong> (YouTube).
            Les exercices redirigent vers <strong>fr.khanacademy.org</strong>. Organisation à but non lucratif — contenu gratuit pour tous.
          </div>
        </div>
      </div>

    </div>
  )
}
