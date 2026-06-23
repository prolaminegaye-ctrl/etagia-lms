'use client'
import { useState, useEffect, useCallback } from 'react'

/* ─────────────────────────────────────────────────────────────────────────────
   Khan Academy × Kolibri — Page Formateur ETAGIA
   Charge le contenu dynamiquement depuis le serveur Kolibri (Hostinger).
   Si Kolibri n'est pas encore configuré → affiche le catalogue de démo FR.
──────────────────────────────────────────────────────────────────────────── */

interface KolibriNode {
  id:          string
  title:       string
  description: string
  kind:        'video' | 'exercise' | 'topic' | 'document'
  lang:        string
  duration:    string | null
  questions:   number | null
  thumbnail:   string | null
  videoUrl:    string | null
  streamUrl:   string
  kaUrl:       string
}

/* ── Catalogue de démo (utilisé quand Kolibri n'est pas encore installé) ── */
const DEMO_NODES: KolibriNode[] = [
  { id:'demo-01', kind:'video',    title:'Période de la fonction Sinus',          description:"Comprendre la période, l'amplitude et les transformations de la fonction sinus.",                       lang:'Français', duration:'9 min',  questions:null, thumbnail:null, videoUrl:`https://www.youtube.com/embed/qovO0euEsOk`, streamUrl:'', kaUrl:'https://fr.khanacademy.org/math/trigonometry/trig-function-graphs' },
  { id:'demo-02', kind:'video',    title:'Dérivée d\'une fonction composée',       description:"Règle de dérivation des fonctions composées — méthode pas-à-pas.",                                    lang:'Français', duration:'12 min', questions:null, thumbnail:null, videoUrl:`https://www.youtube.com/embed/RyGXGSCAJlY`, streamUrl:'', kaUrl:'https://fr.khanacademy.org/math/calculus-1/cs1-derivatives-chain-rule-and-other-advanced-topics' },
  { id:'demo-03', kind:'video',    title:'Décryptage du PIB',                      description:"Comprendre ce que mesure le Produit Intérieur Brut et ses composantes.",                               lang:'Français', duration:'11 min', questions:null, thumbnail:null, videoUrl:`https://www.youtube.com/embed/JV8F9NsD3XU`,  streamUrl:'', kaUrl:'https://fr.khanacademy.org/economics-finance-domain/macroeconomics' },
  { id:'demo-04', kind:'video',    title:'Flux circulaires revenus et dépenses',   description:"Introduction à la microéconomie et macroéconomie — le modèle des flux.",                              lang:'Français', duration:'9 min',  questions:null, thumbnail:null, videoUrl:`https://www.youtube.com/embed/CcxLOiiV9hQ`,  streamUrl:'', kaUrl:'https://fr.khanacademy.org/economics-finance-domain/macroeconomics/macro-basic-economics-concepts' },
  { id:'demo-05', kind:'video',    title:'Investissement et consommation',          description:"Différence entre investissement économique et consommation — composante du PIB.",                     lang:'Français', duration:'10 min', questions:null, thumbnail:null, videoUrl:`https://www.youtube.com/embed/ap1vDGMZlfg`,  streamUrl:'', kaUrl:'https://fr.khanacademy.org/economics-finance-domain/macroeconomics' },
  { id:'demo-06', kind:'video',    title:'Introduction à la notion de référentiel', description:"Référentiel terrestre, géocentrique et héliocentrique — bases de la mécanique.",                     lang:'Français', duration:'10 min', questions:null, thumbnail:null, videoUrl:`https://www.youtube.com/embed/F4DEO8Q8oj4`,  streamUrl:'', kaUrl:'https://fr.khanacademy.org/science/physics/one-dimensional-motion' },
  { id:'demo-07', kind:'video',    title:'Électronégativité et types de liaisons',  description:"Comment l'électronégativité détermine le type de liaison chimique.",                                  lang:'Français', duration:'12 min', questions:null, thumbnail:null, videoUrl:`https://www.youtube.com/embed/R8sYtR5Dk4c`,  streamUrl:'', kaUrl:'https://fr.khanacademy.org/science/chemistry/chemical-bonds' },
  { id:'demo-08', kind:'video',    title:'Les mutations comme source de variation', description:"Types de mutations, leurs causes et conséquences sur la diversité génétique.",                        lang:'Français', duration:'10 min', questions:null, thumbnail:null, videoUrl:`https://www.youtube.com/embed/xgH8DMrOkFM`,  streamUrl:'', kaUrl:'https://fr.khanacademy.org/science/biology/molecular-genetics/mutations' },
  { id:'demo-09', kind:'video',    title:'Théorie cinétique des gaz',               description:"Les lois des gaz parfaits — du modèle microscopique aux lois macroscopiques.",                       lang:'Français', duration:'16 min', questions:null, thumbnail:null, videoUrl:`https://www.youtube.com/embed/syCNKCML5PQ`,  streamUrl:'', kaUrl:'https://fr.khanacademy.org/science/chemistry/ideal-gas-laws' },
  { id:'demo-10', kind:'video',    title:'Biodiversité',                            description:"Explorer la diversité du vivant — espèces, gènes, écosystèmes et conservation.",                    lang:'Français', duration:'13 min', questions:null, thumbnail:null, videoUrl:`https://www.youtube.com/embed/Iu52lXbgmmU`,  streamUrl:'', kaUrl:'https://fr.khanacademy.org/science/biology/ecology' },
  { id:'demo-11', kind:'exercise', title:'Exercices : Fractions',                   description:"Addition, soustraction et simplification de fractions — 15 exercices interactifs avec corrigés.",    lang:'Français', duration:null,     questions:15,   thumbnail:null, videoUrl:null, streamUrl:'', kaUrl:'https://fr.khanacademy.org/math/arithmetic/fraction-arithmetic/arith-review-add-frac-w-unlike-den/e' },
  { id:'demo-12', kind:'exercise', title:'Exercices : Équations 1er degré',         description:"Résolution d'équations à une inconnue — 20 niveaux progressifs.",                                   lang:'Français', duration:null,     questions:20,   thumbnail:null, videoUrl:null, streamUrl:'', kaUrl:'https://fr.khanacademy.org/math/algebra/one-variable-linear-equations/alg1-one-step-add-sub-equations/e' },
  { id:'demo-13', kind:'exercise', title:'Exercices : Théorème de Pythagore',       description:"Calculer hypoténuses et côtés — applications dans des figures géométriques variées.",                lang:'Français', duration:null,     questions:12,   thumbnail:null, videoUrl:null, streamUrl:'', kaUrl:'https://fr.khanacademy.org/math/basic-geo/basic-geometry-pythagorean-theorem/pythagorean-theorem-basic/e' },
  { id:'demo-14', kind:'exercise', title:'Exercices : HTML & CSS',                  description:"Créer et styliser des pages web — exercices interactifs guidés avec résultat en temps réel.",       lang:'Français', duration:null,     questions:20,   thumbnail:null, videoUrl:null, streamUrl:'', kaUrl:'https://fr.khanacademy.org/computing/computer-programming/html-css' },
  { id:'demo-15', kind:'exercise', title:'Exercices : SQL',                         description:"SELECT, WHERE, JOIN, GROUP BY — apprendre SQL sur des bases de données interactives.",              lang:'Français', duration:null,     questions:18,   thumbnail:null, videoUrl:null, streamUrl:'', kaUrl:'https://fr.khanacademy.org/computing/computer-programming/sql' },
]

const KA   = '#14BF96'
const KA_L = '#E3F9F4'
const KA_D = '#0D8C6E'

export default function KhanAcademyPage() {
  const [nodes,    setNodes]    = useState<KolibriNode[]>([])
  const [loading,  setLoading]  = useState(true)
  const [isDemo,   setIsDemo]   = useState(false)
  const [search,   setSearch]   = useState('')
  const [filter,   setFilter]   = useState<'all'|'video'|'exercise'>('all')
  const [selected, setSelected] = useState<KolibriNode | null>(null)
  const [copied,   setCopied]   = useState(false)
  const [progress, setProgress] = useState<Record<string, number>>({})

  /* ── Charger le contenu Kolibri ─────────────────────────────────────────── */
  const loadContent = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(
        '/api/kolibri/api/content/contentnode/?channel_id=9a3a615f0501427baf1f17b08f196fd2&lang_id=fr&limit=200&available=true',
        { cache: 'no-store' }
      )
      const data = await res.json()

      if (data.demo || data.error || !data.results?.length) {
        /* Kolibri pas encore configuré → mode démo */
        setNodes(DEMO_NODES)
        setIsDemo(true)
      } else {
        setNodes(data.results.filter((n: KolibriNode) => n.kind !== 'topic'))
        setIsDemo(false)
      }
    } catch {
      setNodes(DEMO_NODES)
      setIsDemo(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadContent() }, [loadContent])

  /* ── Marquer la progression ─────────────────────────────────────────────── */
  async function markProgress(nodeId: string, pct: number) {
    setProgress(p => ({ ...p, [nodeId]: pct }))
    await fetch('/api/kolibri/api/logger/contentsessionlog/', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ content_id: nodeId, progress: pct / 100 }),
    }).catch(() => {})
  }

  /* ── Filtrage ───────────────────────────────────────────────────────────── */
  const filtered = nodes.filter(n => {
    const q = search.toLowerCase()
    const matchSearch = !q || n.title.toLowerCase().includes(q) || n.description.toLowerCase().includes(q)
    const matchFilter = filter === 'all' || (filter === 'video' && n.kind === 'video') || (filter === 'exercise' && n.kind === 'exercise')
    return matchSearch && matchFilter
  })

  const nbVideos = nodes.filter(n => n.kind === 'video').length
  const nbExos   = nodes.filter(n => n.kind === 'exercise').length

  /* ── Render ─────────────────────────────────────────────────────────────── */
  return (
    <div style={{ animation: 'fadeIn .25s ease' }}>

      {/* ── HEADER ── */}
      <div style={{ marginBottom:'2rem', padding:'1.5rem', background:KA_L, border:`1px solid ${KA}33`, borderRadius:20, display:'flex', alignItems:'center', gap:'1.25rem', flexWrap:'wrap' }}>
        <div style={{ width:52, height:52, borderRadius:14, background:KA, display:'flex', alignItems:'center', justifyContent:'center', fontSize:26, flexShrink:0, boxShadow:`0 6px 20px ${KA}40` }}>🎓</div>
        <div style={{ flex:1 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4, flexWrap:'wrap' }}>
            <h1 style={{ fontFamily:'var(--serif)', fontSize:22, fontWeight:600, color:'var(--ink)', letterSpacing:'-0.03em', margin:0 }}>Khan Academy</h1>
            <span style={{ fontSize:10, background:KA, color:'#fff', borderRadius:999, padding:'3px 10px', fontWeight:700, fontFamily:'var(--sans)' }}>GRATUIT</span>
            <span style={{ fontSize:10, background:'#E8F5E9', color:'#2E7D32', border:'1px solid #81C784', borderRadius:999, padding:'3px 10px', fontWeight:700, fontFamily:'var(--sans)' }}>🇫🇷 ENTIÈREMENT EN FRANÇAIS</span>
            {isDemo && (
              <span style={{ fontSize:10, background:'var(--gold-50)', color:'var(--gold-700)', border:'1px solid var(--gold)', borderRadius:999, padding:'3px 10px', fontWeight:700, fontFamily:'var(--sans)' }}>
                ⚠ Mode démo — Kolibri non configuré
              </span>
            )}
          </div>
          <p style={{ color:'var(--ink-mut)', fontSize:13, fontFamily:'var(--sans)', margin:0 }}>
            {isDemo
              ? 'Aperçu du catalogue · Configurez Kolibri sur Hostinger pour accès offline complet'
              : `${nodes.length} ressources chargées depuis Kolibri · Contenu hébergé sur votre serveur`}
          </p>
        </div>
        {isDemo ? (
          <a href="https://learningequality.org/kolibri/" target="_blank" rel="noopener noreferrer"
            style={{ background:'var(--orange)', color:'#fff', borderRadius:10, padding:'10px 18px', fontFamily:'var(--sans)', fontSize:13, fontWeight:700, textDecoration:'none', whiteSpace:'nowrap', flexShrink:0 }}>
            Installer Kolibri ↗
          </a>
        ) : (
          <button onClick={loadContent} style={{ background:KA, color:'#fff', borderRadius:10, padding:'10px 18px', fontFamily:'var(--sans)', fontSize:13, fontWeight:700, border:'none', cursor:'pointer', flexShrink:0 }}>
            ↺ Rafraîchir
          </button>
        )}
      </div>

      {/* ── Bandeau setup Kolibri (mode démo) ── */}
      {isDemo && (
        <div style={{ marginBottom:'1.5rem', padding:'1.25rem 1.5rem', background:'#FFF9C4', border:'1px solid #F9A825', borderRadius:14, display:'flex', gap:12, alignItems:'flex-start' }}>
          <span style={{ fontSize:24, flexShrink:0 }}>🛠</span>
          <div>
            <div style={{ fontWeight:700, fontSize:13, color:'#E65100', marginBottom:6, fontFamily:'var(--sans)' }}>
              Pour activer le mode 100% intégré (sans redirect) :
            </div>
            <div style={{ fontSize:12.5, color:'#5D4037', fontFamily:'var(--sans)', lineHeight:1.7 }}>
              <strong>1.</strong> Connectez-vous à votre VPS Hostinger via SSH<br/>
              <strong>2.</strong> Copiez le dossier <code style={{ background:'#fff8e1', padding:'1px 5px', borderRadius:3 }}>kolibri-server/</code> sur le VPS<br/>
              <strong>3.</strong> Exécutez <code style={{ background:'#fff8e1', padding:'1px 5px', borderRadius:3 }}>./setup-kolibri.sh</code> (Docker requis)<br/>
              <strong>4.</strong> Ajoutez dans Vercel → Environment Variables :<br/>
              <code style={{ background:'#fff8e1', padding:'2px 8px', borderRadius:3, display:'inline-block', marginTop:4 }}>KOLIBRI_SERVER_URL=https://kolibri.etagia-academie.com</code>
            </div>
          </div>
        </div>
      )}

      {/* ── KPIs ── */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'1rem', marginBottom:'2rem' }}>
        {[
          { v: loading ? '…' : `${nodes.length}`, l:'Ressources totales',   c:KA              },
          { v: loading ? '…' : `${nbVideos}`,     l:'Vidéos françaises',    c:'var(--orange)' },
          { v: loading ? '…' : `${nbExos}`,       l:'Séries d\'exercices',  c:'var(--turq)'   },
          { v: Object.keys(progress).length > 0 ? `${Object.keys(progress).length}` : '—', l:'Ressources consultées', c:'var(--gold)' },
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
          placeholder="🔍  Rechercher par titre, notion, matière…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width:'100%', padding:'10px 14px', borderRadius:10, border:'1px solid rgba(42,33,24,.18)', fontFamily:'var(--sans)', fontSize:13.5, color:'var(--ink)', background:'var(--surface-2)', marginBottom:'1rem', display:'block' }}
        />
        <div style={{ display:'flex', gap:8 }}>
          {([['all','Tout',KA],['video','Vidéos','var(--orange)'],['exercise','Exercices','var(--turq)']] as const).map(([k,l,c]) => (
            <button key={k} onClick={() => setFilter(k)}
              style={{ padding:'6px 16px', borderRadius:999, border:'none', cursor:'pointer', fontFamily:'var(--sans)', fontSize:12.5, fontWeight:filter===k?700:500, background:filter===k?c:'var(--surface-2)', color:filter===k?'#fff':'var(--ink-soft)', transition:'all .15s' }}>
              {l}
            </button>
          ))}
          <span style={{ marginLeft:'auto', fontSize:12, color:'var(--ink-soft)', alignSelf:'center', fontFamily:'var(--sans)' }}>
            {filtered.length} résultat{filtered.length > 1 ? 's' : ''} · 🇫🇷
          </span>
        </div>
      </div>

      {/* ── CONTENU ── */}
      {loading ? (
        <div style={{ textAlign:'center', padding:'4rem', color:'var(--ink-soft)', fontFamily:'var(--sans)' }}>
          <div style={{ fontSize:36, marginBottom:16 }}>⏳</div>
          <div style={{ fontFamily:'var(--serif)', fontSize:16, color:'var(--ink)' }}>Chargement depuis Kolibri…</div>
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns: selected ? '1fr 1.45fr' : '1fr', gap:'1.5rem', alignItems:'start' }}>

          {/* LISTE */}
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {filtered.map(node => {
              const sel  = selected?.id === node.id
              const pct  = progress[node.id] ?? 0
              const isV  = node.kind === 'video'
              return (
                <div key={node.id} onClick={() => { setSelected(sel ? null : node); markProgress(node.id, pct || 5) }}
                  style={{ background:'var(--surface)', border:`1px solid ${sel ? (isV?`${KA}55`:'var(--orange)') : 'var(--line)'}`, borderRadius:14, padding:'1.1rem 1.25rem', cursor:'pointer', transition:'all .18s', boxShadow: sel ? `0 4px 20px ${isV?KA+'18':'rgba(251,101,20,.10)'}` : 'none', position:'relative', overflow:'hidden' }}>
                  {/* Barre de progression */}
                  {pct > 0 && (
                    <div style={{ position:'absolute', bottom:0, left:0, height:3, width:`${pct}%`, background:KA, borderRadius:'0 0 14px 14px', transition:'width .3s' }} />
                  )}
                  <div style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
                    <div style={{ width:42, height:42, borderRadius:11, background:isV?KA_L:'var(--orange-50)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>
                      {isV ? '▶️' : '✏️'}
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ display:'flex', gap:5, marginBottom:5, flexWrap:'wrap' }}>
                        <span style={{ fontSize:9.5, borderRadius:999, padding:'2px 8px', fontWeight:700, fontFamily:'var(--sans)', background:isV?KA_L:'var(--orange-50)', color:isV?KA_D:'var(--orange-700)' }}>
                          {isV ? '▶ Vidéo' : '✏ Exercice'}
                        </span>
                        <span style={{ fontSize:9.5, borderRadius:999, padding:'2px 8px', fontWeight:600, fontFamily:'var(--sans)', background:'#E8F5E9', color:'#2E7D32' }}>🇫🇷 FR</span>
                        {node.duration && (
                          <span style={{ fontSize:9.5, borderRadius:999, padding:'2px 8px', fontWeight:600, fontFamily:'var(--sans)', background:'var(--gold-50)', color:'var(--gold-700)' }}>⏱ {node.duration}</span>
                        )}
                        {node.questions && (
                          <span style={{ fontSize:9.5, borderRadius:999, padding:'2px 8px', fontWeight:600, fontFamily:'var(--sans)', background:'var(--turq-50)', color:'var(--turq-700)' }}>{node.questions} questions</span>
                        )}
                        {pct > 0 && (
                          <span style={{ fontSize:9.5, borderRadius:999, padding:'2px 8px', fontWeight:600, fontFamily:'var(--sans)', background:KA_L, color:KA_D }}>✓ {pct}% vu</span>
                        )}
                      </div>
                      <div style={{ fontWeight:700, fontSize:14, color:'var(--ink)', fontFamily:'var(--sans)', marginBottom:4 }}>{node.title}</div>
                      <p style={{ fontSize:12.5, color:'var(--ink-mut)', lineHeight:1.55, margin:0, fontFamily:'var(--sans)' }}>{node.description}</p>
                    </div>
                    <div style={{ color:'var(--ink-soft)', fontSize:18, flexShrink:0, transition:'transform .18s', transform:sel?'rotate(90deg)':'none' }}>›</div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* PREVIEW / LECTEUR */}
          {selected && (
            <div style={{ background:'var(--surface)', border:'1px solid var(--line)', borderRadius:16, padding:'1.5rem', position:'sticky', top:'1.5rem', animation:'fadeIn .2s ease' }}>
              <div style={{ display:'flex', alignItems:'flex-start', gap:10, marginBottom:'1.25rem', paddingBottom:'1rem', borderBottom:'1px solid var(--line)' }}>
                <div style={{ flex:1 }}>
                  <div style={{ fontFamily:'var(--serif)', fontWeight:600, fontSize:16, color:'var(--ink)', marginBottom:4 }}>{selected.title}</div>
                  <div style={{ fontSize:11, color:'var(--ink-soft)', fontFamily:'var(--sans)' }}>
                    {selected.kind === 'video' ? '▶ Vidéo' : '✏ Exercice'} · 🇫🇷 Français
                    {!isDemo && ' · Hébergé sur votre serveur Kolibri'}
                  </div>
                </div>
                <button onClick={() => setSelected(null)} style={{ background:'var(--surface-2)', border:'none', borderRadius:8, padding:'6px 10px', cursor:'pointer', fontSize:14, color:'var(--ink-soft)' }}>✕</button>
              </div>

              {/* Lecteur vidéo */}
              {selected.kind === 'video' && (
                <div style={{ marginBottom:'1.25rem', borderRadius:12, overflow:'hidden', border:`1px solid ${KA}33`, background:'#000' }}>
                  {!isDemo && selected.streamUrl ? (
                    /* Mode Kolibri : lecteur vidéo direct depuis le serveur */
                    <video
                      controls
                      width="100%"
                      style={{ display:'block', maxHeight:220 }}
                      onTimeUpdate={(e) => {
                        const v = e.currentTarget
                        if (v.duration > 0) markProgress(selected.id, Math.round((v.currentTime / v.duration) * 100))
                      }}
                    >
                      <source src={`/api/kolibri${selected.streamUrl}`} type="video/mp4" />
                      Votre navigateur ne supporte pas la lecture vidéo.
                    </video>
                  ) : (
                    /* Mode démo : embed YouTube FR */
                    <>
                      <div style={{ background:KA_L, padding:'5px 12px', fontSize:10, color:KA_D, fontWeight:700, fontFamily:'var(--sans)' }}>
                        🇫🇷 KhanAcademyFrancophone · Mode démo — vidéo hébergée sur YouTube
                      </div>
                      <iframe
                        width="100%" height="200"
                        src={selected.videoUrl ?? ''}
                        title={selected.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        style={{ display:'block', border:'none' }}
                      />
                    </>
                  )}
                </div>
              )}

              {/* Exercice */}
              {selected.kind === 'exercise' && (
                <div style={{ marginBottom:'1.25rem', background:'var(--orange-50)', border:'1px solid rgba(251,101,20,.15)', borderRadius:12, padding:'1.75rem', textAlign:'center' }}>
                  <div style={{ fontSize:36, marginBottom:10 }}>✏️</div>
                  <div style={{ fontFamily:'var(--serif)', fontSize:15, fontWeight:600, color:'var(--orange-700)', marginBottom:4 }}>
                    {selected.questions ? `${selected.questions} questions interactives` : 'Exercices interactifs'}
                  </div>
                  <div style={{ fontSize:12, color:'var(--ink-soft)', fontFamily:'var(--sans)', lineHeight:1.5 }}>
                    {isDemo ? 'Cliquez "Ouvrir" pour faire les exercices sur fr.khanacademy.org' : 'Exercices chargés depuis votre serveur Kolibri — progression suivie localement'}
                  </div>
                </div>
              )}

              <p style={{ fontSize:13, color:'var(--ink-mut)', lineHeight:1.6, fontFamily:'var(--sans)', marginBottom:'1.25rem' }}>{selected.description}</p>

              {/* Actions */}
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                <a href={selected.kaUrl} target="_blank" rel="noopener noreferrer"
                  style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:6, background:KA, color:'#fff', borderRadius:10, padding:'11px 16px', fontFamily:'var(--sans)', fontSize:13, fontWeight:700, textDecoration:'none' }}>
                  {isDemo ? '🎓 Ouvrir sur fr.khanacademy.org ↗' : '🎓 Ouvrir dans Kolibri ↗'}
                </a>
                <button onClick={() => { navigator.clipboard.writeText(selected.kaUrl); setCopied(true); setTimeout(() => setCopied(false), 1800) }}
                  style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:6, background:copied?KA:'var(--surface-2)', color:copied?'#fff':'var(--ink-mut)', border:'none', borderRadius:10, padding:'11px 16px', fontFamily:'var(--sans)', fontSize:13, fontWeight:600, cursor:'pointer', transition:'all .15s' }}>
                  {copied ? '✓ Lien copié !' : '🔗 Copier le lien pour mon cours'}
                </button>
                <button onClick={() => markProgress(selected.id, 100)}
                  style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:6, background:'var(--turq-50)', color:'var(--turq-700)', border:'none', borderRadius:10, padding:'11px 16px', fontFamily:'var(--sans)', fontSize:13, fontWeight:600, cursor:'pointer' }}>
                  ✓ Marquer comme terminé
                </button>
              </div>

              <div style={{ marginTop:'1.25rem', padding:12, background:'var(--gold-50)', border:'1px solid rgba(244,176,30,.3)', borderRadius:10, fontSize:11.5, color:'var(--ink)', fontFamily:'var(--sans)', lineHeight:1.5 }}>
                💡 <strong>Intégrer dans un cours :</strong> copiez le lien et collez-le dans votre module ETAGIA (bloc "Ressource externe") ou partagez-le directement avec vos apprenants.
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
