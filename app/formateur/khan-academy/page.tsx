'use client'
import { useState, useMemo } from 'react'

/* ─────────────────────────────────────────────────────────────
   Khan Academy — Page Formateur
   Design : charte ETAGIA (canvas crème, or, orange, turquoise)
───────────────────────────────────────────────────────────── */

type ContentType = 'video' | 'exercice'

interface KAItem {
  id:        string
  type:      ContentType
  matiere:   string
  niveau:    string
  titre:     string
  desc:      string
  duree?:    string
  questions?: number
  youtubeId?: string
  kaUrl:     string
  tags:      string[]
}

const CATALOGUE: KAItem[] = [
  /* ── MATHÉMATIQUES ── */
  { id:'v-frac',   type:'video',    matiere:'Maths',        niveau:'Collège',    titre:'Introduction aux fractions',           desc:"Comprendre numérateur et dénominateur avec des exemples concrets du quotidien.",                 duree:'8 min',  youtubeId:'yg2MfKVeGOk', kaUrl:'https://fr.khanacademy.org/math/arithmetic/fraction-arithmetic',                                                              tags:['fractions','numérateur','dénominateur'] },
  { id:'v-eq1',    type:'video',    matiere:'Maths',        niveau:'Lycée',      titre:'Équations du 1er degré',               desc:"Méthode pas-à-pas pour isoler l'inconnue et résoudre ax + b = c.",                             duree:'12 min', youtubeId:'l3XzepN03KQ', kaUrl:'https://fr.khanacademy.org/math/algebra/linear-equations-and-inequalitie',                                               tags:['algèbre','équations','1er degré'] },
  { id:'v-pyth',   type:'video',    matiere:'Maths',        niveau:'Collège',    titre:'Théorème de Pythagore',                desc:"Démonstration visuelle et applications dans des triangles rectangles.",                          duree:'14 min', youtubeId:'aa6yjc9DMXM', kaUrl:'https://fr.khanacademy.org/math/basic-geo/basic-geometry-pythagorean-theorem',                                          tags:['géométrie','pythagore','triangle'] },
  { id:'v-deriv',  type:'video',    matiere:'Maths',        niveau:'Lycée',      titre:'Introduction aux dérivées',            desc:"Comprendre le taux de variation instantané et le concept fondamental de dérivée.",              duree:'18 min', youtubeId:'viaPc8zDcRI', kaUrl:'https://fr.khanacademy.org/math/calculus-1/cs1-derivatives-definition-and-basic-rules',                                  tags:['calcul','dérivées','analyse'] },
  { id:'v-proba',  type:'video',    matiere:'Maths',        niveau:'Lycée',      titre:'Probabilités — Fondements',            desc:"Espaces d'événements, complémentaires et calcul de probabilités simples.",                      duree:'11 min', youtubeId:'uzkc-qNVoOk', kaUrl:'https://fr.khanacademy.org/math/statistics-probability/probability-library',                                            tags:['probabilités','statistiques'] },
  { id:'v-matx',   type:'video',    matiere:'Maths',        niveau:'Université', titre:'Matrices et systèmes linéaires',       desc:"Opérations matricielles, rang et résolution de systèmes avec la méthode de Gauss.",             duree:'22 min', youtubeId:'kqtD5dpn9C8', kaUrl:'https://fr.khanacademy.org/math/linear-algebra',                                                                    tags:['algèbre linéaire','matrices','université'] },
  { id:'ex-frac',  type:'exercice', matiere:'Maths',        niveau:'Collège',    titre:'Exercices : Additionner des fractions',desc:"Série d'exercices interactifs pour maîtriser l'addition et la soustraction de fractions.",     questions:12,                         kaUrl:'https://fr.khanacademy.org/math/arithmetic/fraction-arithmetic/arith-review-add-frac-w-unlike-den/e/adding_fractions',    tags:['fractions','addition','pratique'] },
  { id:'ex-eq1',   type:'exercice', matiere:'Maths',        niveau:'Lycée',      titre:'Exercices : Équations 1er degré',      desc:"Entraînement progressif sur la résolution d'équations à une inconnue.",                        questions:20,                         kaUrl:'https://fr.khanacademy.org/math/algebra/one-variable-linear-equations/alg1-one-step-add-sub-equations/e',                tags:['équations','algèbre','pratique'] },

  /* ── SCIENCES ── */
  { id:'v-atome',  type:'video',    matiere:'Sciences',     niveau:'Lycée',      titre:"Structure de l'atome",                 desc:"Protons, neutrons et électrons — la structure fondamentale de la matière.",                    duree:'10 min', youtubeId:'FkwADdv1FGo', kaUrl:'https://fr.khanacademy.org/science/chemistry/atomic-structure-and-properties',                                          tags:['chimie','atome','structure'] },
  { id:'v-cell',   type:'video',    matiere:'Sciences',     niveau:'Collège',    titre:"La cellule — unité du vivant",          desc:"Organites, leurs rôles, différence cellule animale / végétale.",                              duree:'13 min', youtubeId:'URUJD5NEXC8', kaUrl:'https://fr.khanacademy.org/science/ap-biology/cell-structure-and-function',                                           tags:['biologie','cellule','organites'] },
  { id:'v-newton', type:'video',    matiere:'Sciences',     niveau:'Lycée',      titre:'Les 3 lois de Newton',                 desc:"Inertie, dynamique et action-réaction — exemples du monde réel.",                             duree:'16 min', youtubeId:'k_B2pBTEFBY', kaUrl:'https://fr.khanacademy.org/science/physics/forces-newtons-laws',                                                   tags:['physique','newton','forces'] },
  { id:'ex-atome', type:'exercice', matiere:'Sciences',     niveau:'Lycée',      titre:'Exercices : Atomes et électrons',      desc:"Identifier protons, neutrons et électrons — quiz interactifs corrigés.",                      questions:15,                         kaUrl:'https://fr.khanacademy.org/science/chemistry/atomic-structure-and-properties/names-and-formulas-of-ionic-compounds/e',  tags:['chimie','atome','pratique'] },

  /* ── INFORMATIQUE ── */
  { id:'v-algo',   type:'video',    matiere:'Informatique', niveau:'Lycée',      titre:"Qu'est-ce qu'un algorithme ?",         desc:"Introduction au raisonnement algorithmique, boucles et conditions.",                           duree:'9 min',  youtubeId:'CvSOaYi89B4', kaUrl:'https://fr.khanacademy.org/computing/computer-science/algorithms',                                                    tags:['algorithme','logique','programmation'] },
  { id:'v-bin',    type:'video',    matiere:'Informatique', niveau:'Lycée',      titre:'Le système binaire',                   desc:"Convertir entre binaire et décimal — comment l'ordinateur stocke l'information.",              duree:'7 min',  youtubeId:'ku4KOFQ-bB4', kaUrl:'https://fr.khanacademy.org/computing/computers-and-internet/xcae6f4a7ff015e7d:digital-information/xcae6f4a7ff015e7d:binary-numbers/v/binary-numbers', tags:['binaire','bases numériques'] },
  { id:'v-html',   type:'video',    matiere:'Informatique', niveau:'Lycée',      titre:'HTML & CSS — Introduction',            desc:"Créer sa première page web avec les balises HTML fondamentales et le style CSS.",              duree:'15 min', youtubeId:'zHZRFwWQt2w', kaUrl:'https://fr.khanacademy.org/computing/computer-programming/html-css',                                                 tags:['HTML','CSS','web'] },
  { id:'ex-algo',  type:'exercice', matiere:'Informatique', niveau:'Lycée',      titre:'Exercices : Algorithmes de tri',       desc:"Comprendre et appliquer le tri par sélection et par insertion.",                              questions:8,                          kaUrl:'https://fr.khanacademy.org/computing/computer-science/algorithms/sorting-algorithms/e',                                   tags:['algorithmes','tri','pratique'] },

  /* ── ÉCONOMIE ── */
  { id:'v-offre',  type:'video',    matiere:'Économie',     niveau:'Lycée',      titre:'Offre et demande',                     desc:"Comment les marchés fixent les prix — modèle classique illustré.",                            duree:'11 min', youtubeId:'g9aDizJpd_s', kaUrl:'https://fr.khanacademy.org/economics-finance-domain/ap-microeconomics/basic-economic-concepts',                         tags:['microéconomie','marché','prix'] },
  { id:'v-pib',    type:'video',    matiere:'Économie',     niveau:'Université', titre:'Le Produit Intérieur Brut (PIB)',       desc:"Définition, calcul et limites du PIB comme indicateur de la richesse nationale.",             duree:'13 min', youtubeId:'4pB3B0HI7KE', kaUrl:'https://fr.khanacademy.org/economics-finance-domain/macroeconomics/gdp-topic',                                          tags:['macroéconomie','PIB','croissance'] },
  { id:'ex-offre', type:'exercice', matiere:'Économie',     niveau:'Lycée',      titre:'Exercices : Offre et demande',         desc:"Analyser des graphiques et prévoir les variations d'équilibre de marché.",                    questions:10,                         kaUrl:'https://fr.khanacademy.org/economics-finance-domain/ap-microeconomics/unit-2-supply-and-demand/supply-and-demand/e',    tags:['microéconomie','marché','pratique'] },

  /* ── HISTOIRE ── */
  { id:'v-revfr',  type:'video',    matiere:'Histoire',     niveau:'Lycée',      titre:'La Révolution française — Origines',   desc:"Les crises politiques, sociales et économiques qui ont conduit à 1789.",                      duree:'17 min', youtubeId:'PBn7iCQRKlQ', kaUrl:'https://fr.khanacademy.org/humanities/world-history/1600s-1800s/french-revolution-tutorial/v',                          tags:['révolution','1789','France'] },
  { id:'v-deco',   type:'video',    matiere:'Histoire',     niveau:'Lycée',      titre:'Décolonisation en Afrique',            desc:"Processus de décolonisation, indépendances et enjeux pour l'Afrique contemporaine.",           duree:'20 min', youtubeId:'B5pjjVpS8FI', kaUrl:'https://fr.khanacademy.org/humanities/world-history/euro-hist/cold-war-decolonization/v',                              tags:['décolonisation','Afrique','indépendances'] },
]

const MATIERES = ['Tout','Maths','Sciences','Informatique','Économie','Histoire']
const NIVEAUX  = ['Tout','Collège','Lycée','Université']
const TYPES    = ['Tout','Vidéos','Exercices']
const MAT_ICONS: Record<string,string> = { Maths:'📐', Sciences:'🔬', Informatique:'💻', Économie:'📊', Histoire:'🏛️' }

/* ── Styles inline partagés ── */
const KA = '#14BF96'
const KA_L = '#E3F9F4'

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
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:4 }}>
            <h1 style={{ fontFamily:'var(--serif)', fontSize:22, fontWeight:600, color:'var(--ink)', letterSpacing:'-0.03em', margin:0 }}>Khan Academy</h1>
            <span style={{ fontSize:10, background:KA, color:'#fff', borderRadius:999, padding:'3px 10px', fontWeight:700, fontFamily:'var(--sans)' }}>GRATUIT</span>
            <span style={{ fontSize:10, background:'var(--turq-50)', color:'var(--turq-700)', borderRadius:999, padding:'3px 10px', fontWeight:700, fontFamily:'var(--sans)' }}>180+ pays</span>
          </div>
          <p style={{ color:'var(--ink-mut)', fontSize:13, fontFamily:'var(--sans)', margin:0 }}>
            Vidéos &amp; exercices interactifs gratuits à intégrer dans vos modules · Contenus en français · Méthode socratique
          </p>
        </div>
        <a href="https://fr.khanacademy.org" target="_blank" rel="noopener noreferrer"
          style={{ background:KA, color:'#fff', borderRadius:10, padding:'10px 18px', fontFamily:'var(--sans)', fontSize:13, fontWeight:700, textDecoration:'none', whiteSpace:'nowrap', flexShrink:0 }}>
          Ouvrir KA ↗
        </a>
      </div>

      {/* ── KPIs ── */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'1rem', marginBottom:'2rem' }}>
        {[
          { v:'5',          l:'Matières',             c:KA              },
          { v:`${nbVideos}`,l:'Vidéos disponibles',   c:'var(--orange)' },
          { v:`${nbExercices}`,l:'Exercices interactifs',c:'var(--turq)'},
          { v:'3',          l:'Niveaux scolaires',    c:'var(--gold)'   },
        ].map(k => (
          <div key={k.l} style={{ background:'var(--surface)', border:'1px solid var(--line)', borderRadius:16, padding:'1.25rem', boxShadow:'var(--sh-1)', position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:k.c, borderRadius:'16px 16px 0 0' }} />
            <div style={{ fontFamily:'var(--serif)', fontSize:26, fontWeight:600, color:k.c, marginBottom:4, marginTop:4 }}>{k.v}</div>
            <div style={{ fontSize:11.5, color:'var(--ink-soft)', fontFamily:'var(--sans)' }}>{k.l}</div>
          </div>
        ))}
      </div>

      {/* ── FILTRES ── */}
      <div style={{ background:'var(--surface)', border:'1px solid var(--line)', borderRadius:16, padding:'1.25rem', marginBottom:'1.5rem', boxShadow:'var(--sh-1)' }}>
        {/* Recherche */}
        <input
          type="text"
          placeholder="🔍  Rechercher un cours, une notion, un tag…"
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
          {/* Matière */}
          <div>
            <div style={{ fontSize:10, color:'var(--ink-soft)', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:8, fontFamily:'var(--sans)' }}>Matière</div>
            <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
              {MATIERES.map(m => (
                <button key={m} onClick={() => { setMatiere(m); setSelected(null) }} style={pill(matiere===m, KA)}>
                  {m!=='Tout' ? `${MAT_ICONS[m]} ` : ''}{m}
                </button>
              ))}
            </div>
          </div>
          {/* Niveau */}
          <div>
            <div style={{ fontSize:10, color:'var(--ink-soft)', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:8, fontFamily:'var(--sans)' }}>Niveau</div>
            <div style={{ display:'flex', gap:6 }}>
              {NIVEAUX.map(n => (
                <button key={n} onClick={() => { setNiveau(n); setSelected(null) }} style={pill(niveau===n, 'var(--orange)')}>
                  {n}
                </button>
              ))}
            </div>
          </div>
          {/* Type */}
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
        <div style={{ marginTop:'1rem', fontSize:12, color:'var(--ink-soft)', fontFamily:'var(--sans)' }}>
          {filtered.length} ressource{filtered.length>1?'s':''} trouvée{filtered.length>1?'s':''}
        </div>
      </div>

      {/* ── CONTENU ── */}
      <div style={{ display:'grid', gridTemplateColumns: preview ? '1fr 1.45fr' : '1fr', gap:'1.5rem', alignItems:'start' }}>

        {/* Liste */}
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign:'center', padding:'3rem', background:'var(--surface)', border:'1px solid var(--line)', borderRadius:16 }}>
              <div style={{ fontSize:36, marginBottom:12 }}>🔍</div>
              <div style={{ fontFamily:'var(--serif)', fontSize:16, color:'var(--ink)', marginBottom:6 }}>Aucun résultat</div>
              <div style={{ fontSize:13, color:'var(--ink-soft)', fontFamily:'var(--sans)' }}>Modifiez vos filtres ou votre recherche.</div>
            </div>
          ) : filtered.map(item => {
            const sel = selected === item.id
            return (
              <div
                key={item.id}
                onClick={() => setSelected(sel ? null : item.id)}
                style={{
                  background:'var(--surface)', border:`1px solid ${sel ? (item.type==='video'?`${KA}55`:'var(--orange)') : 'var(--line)'}`,
                  borderRadius:14, padding:'1.1rem 1.25rem', cursor:'pointer', transition:'all .18s',
                  boxShadow: sel ? (item.type==='video'?`0 4px 20px ${KA}18`:'0 4px 20px rgba(251,101,20,.10)') : 'var(--sh-1)',
                }}
              >
                <div style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
                  {/* Icone */}
                  <div style={{ width:42, height:42, borderRadius:11, background:item.type==='video'?KA_L:'var(--orange-50)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>
                    {item.type==='video'?'▶️':'✏️'}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    {/* Badges */}
                    <div style={{ display:'flex', gap:5, marginBottom:5, flexWrap:'wrap' }}>
                      <span style={{ fontSize:9.5, borderRadius:999, padding:'2px 8px', fontWeight:700, fontFamily:'var(--sans)', background:item.type==='video'?KA_L:'var(--orange-50)', color:item.type==='video'?'#0D8C6E':'var(--orange-700)' }}>
                        {item.type==='video'?'▶ Vidéo':'✏ Exercice'}
                      </span>
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
                    <div style={{ display:'flex', gap:4, marginTop:8, flexWrap:'wrap' }}>
                      {item.tags.map(t => (
                        <span key={t} style={{ fontSize:10, color:'var(--ink-soft)', background:'var(--canvas)', borderRadius:4, padding:'2px 6px', fontFamily:'var(--sans)' }}>#{t}</span>
                      ))}
                    </div>
                  </div>
                  <div style={{ color:'var(--ink-soft)', fontSize:18, flexShrink:0, transition:'transform .18s', transform:sel?'rotate(90deg)':'none' }}>›</div>
                </div>
              </div>
            )
          })}
        </div>

        {/* ── PREVIEW ── */}
        {preview && (
          <div style={{ background:'var(--surface)', border:'1px solid var(--line)', borderRadius:16, padding:'1.5rem', position:'sticky', top:'1.5rem', boxShadow:'var(--sh-2)', animation:'fadeIn .2s ease' }}>
            {/* Header */}
            <div style={{ display:'flex', alignItems:'flex-start', gap:10, marginBottom:'1.25rem', paddingBottom:'1rem', borderBottom:'1px solid var(--line)' }}>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:'var(--serif)', fontWeight:600, fontSize:16, color:'var(--ink)', letterSpacing:'-0.02em', marginBottom:4 }}>{preview.titre}</div>
                <div style={{ fontSize:11, color:'var(--ink-soft)', fontFamily:'var(--sans)' }}>
                  {preview.type==='video'?'▶ Vidéo':'✏ Exercice'} · {preview.matiere} · {preview.niveau}
                </div>
              </div>
              <button onClick={() => setSelected(null)} style={{ background:'var(--surface-2)', border:'none', borderRadius:8, padding:'6px 10px', cursor:'pointer', fontSize:14, color:'var(--ink-soft)' }}>✕</button>
            </div>

            {/* Embed vidéo */}
            {preview.type==='video' && preview.youtubeId && (
              <div style={{ marginBottom:'1.25rem', borderRadius:12, overflow:'hidden' }}>
                <iframe
                  width="100%" height="210"
                  src={`https://www.youtube.com/embed/${preview.youtubeId}`}
                  title={preview.titre}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ display:'block', border:'none' }}
                />
              </div>
            )}

            {/* Illus exercice */}
            {preview.type==='exercice' && (
              <div style={{ marginBottom:'1.25rem', background:'var(--orange-50)', border:'1px solid rgba(251,101,20,.15)', borderRadius:12, padding:'2rem', textAlign:'center' }}>
                <div style={{ fontSize:40, marginBottom:10 }}>✏️</div>
                <div style={{ fontFamily:'var(--serif)', fontSize:15, fontWeight:600, color:'var(--orange-700)', marginBottom:4 }}>{preview.questions} questions interactives</div>
                <div style={{ fontSize:12, color:'var(--ink-soft)', fontFamily:'var(--sans)' }}>Corrigé automatique · Progression suivie</div>
              </div>
            )}

            <p style={{ fontSize:13, color:'var(--ink-mut)', lineHeight:1.6, fontFamily:'var(--sans)', marginBottom:'1.25rem' }}>{preview.desc}</p>

            {/* Actions */}
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              <a href={preview.kaUrl} target="_blank" rel="noopener noreferrer"
                style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:6, background:KA, color:'#fff', borderRadius:10, padding:'11px 16px', fontFamily:'var(--sans)', fontSize:13, fontWeight:700, textDecoration:'none' }}>
                🎓 Ouvrir sur Khan Academy ↗
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
                  {copied==='embed'?'✓ Code copié !':'</> Copier le code embed YouTube'}
                </button>
              )}
            </div>

            {/* Tip */}
            <div style={{ marginTop:'1.25rem', padding:12, background:'var(--gold-50)', border:'1px solid rgba(244,176,30,.3)', borderRadius:10, fontSize:11.5, color:'var(--gold-900)', fontFamily:'var(--sans)', lineHeight:1.5 }}>
              💡 <strong>Comment l'intégrer ?</strong> Copiez le lien ou le code embed et collez-le dans l'éditeur de votre cours — bloc {preview.type==='video'?'"Vidéo"':'"Ressource externe"'}.
            </div>
          </div>
        )}
      </div>

      {/* ── FOOTER ── */}
      <div style={{ marginTop:'2rem', padding:'1.25rem 1.5rem', background:KA_L, border:`1px solid ${KA}22`, borderRadius:16, display:'flex', alignItems:'center', gap:12 }}>
        <span style={{ fontSize:24 }}>ℹ️</span>
        <div>
          <div style={{ fontWeight:700, fontSize:13, color:'#0D8C6E', fontFamily:'var(--sans)', marginBottom:3 }}>À propos de Khan Academy</div>
          <div style={{ fontSize:12, color:'var(--ink-soft)', fontFamily:'var(--sans)', lineHeight:1.5 }}>
            Organisation à but non lucratif fondée en 2006. Contenus gratuits en 30+ langues dont le français, dans 180 pays. Les vidéos sont embedées via YouTube. Les exercices redirigent vers khanacademy.org.
          </div>
        </div>
      </div>

    </div>
  )
}
