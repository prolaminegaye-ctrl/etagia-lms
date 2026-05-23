'use client'
import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'

/* ═══════════════════════════════════════════════
   CATALOGUE PRODUITS
═══════════════════════════════════════════════ */
type ProductType = 'livre' | 'cours' | 'logiciel' | 'ressource'

interface Product {
  id: string
  type: ProductType
  title: string
  author: string
  price: number          // centimes
  cover: string
  desc: string
  longDesc?: string
  rating: number
  sales: number
  fileSize?: string
  pages?: number
  new?: boolean
  bestseller?: boolean
  tags?: string[]
}

const PRODUCTS: Product[] = [
  // ── LIVRES
  {
    id:'l1', type:'livre', title:'La Vente Consultative', author:'ETAGIA Éditions', price:14900,
    cover:'📘', rating:4.8, sales:342, pages:180, bestseller:true,
    desc:'Maîtrisez l\'art de vendre par la valeur.',
    longDesc:'180 pages de méthodes éprouvées sur le terrain en Afrique francophone. Exercices pratiques, scripts de vente, objections traitées.',
    tags:['vente','négociation','commercial'],
  },
  {
    id:'l2', type:'livre', title:'Management Nouvelle Ère', author:'ETAGIA Éditions', price:12900,
    cover:'📗', rating:4.6, sales:218, pages:220,
    desc:'Leadership et gestion des talents en Afrique.',
    longDesc:'Culture d\'entreprise, management situationnel, gestion des générations. Adapté aux réalités africaines.',
    tags:['management','leadership','RH'],
  },
  {
    id:'l3', type:'livre', title:'L\'Art de la Négociation', author:'ETAGIA Éditions', price:9900,
    cover:'📙', rating:4.7, sales:456, pages:150, new:true,
    desc:'Techniques éprouvées pour négocier dans tout contexte.',
    longDesc:'De la préparation à la conclusion, un guide opérationnel avec 40 techniques et cas pratiques réels.',
    tags:['négociation','communication','vente'],
  },
  {
    id:'l4', type:'livre', title:'Entrepreneuriat en Afrique', author:'ETAGIA Éditions', price:16900,
    cover:'📔', rating:4.9, sales:891, pages:260, bestseller:true,
    desc:'De l\'idée à la croissance — guide complet pour entrepreneurs africains.',
    longDesc:'Business model, financement, marché local, scaling. 30 témoignages d\'entrepreneurs africains à succès.',
    tags:['entrepreneuriat','business','startup'],
  },
  // ── COURS PDF
  {
    id:'c1', type:'cours', title:'Formation Excel Avancé', author:'ETAGIA', price:19900,
    cover:'📊', rating:4.9, sales:892, fileSize:'28 MB', bestseller:true,
    desc:'Tableaux croisés, macros VBA, Power Query — 45 fiches.',
    longDesc:'45 fiches pratiques PDF ultra-détaillées. Niveau intermédiaire → expert. Exercices corrigés inclus.',
    tags:['excel','bureautique','data'],
  },
  {
    id:'c2', type:'cours', title:'SEO & Référencement Pro', author:'ETAGIA', price:24900,
    cover:'🔍', rating:4.7, sales:634, fileSize:'42 MB',
    desc:'De débutant à expert SEO. Checklist, templates et outils.',
    longDesc:'Référencement naturel, technique, local. Audit SEO, link building, contenu optimisé. Checklist de 120 points.',
    tags:['SEO','digital','marketing'],
  },
  {
    id:'c3', type:'cours', title:'Canva Maîtrise Totale', author:'ETAGIA', price:15900,
    cover:'🎨', rating:4.8, sales:723, fileSize:'35 MB', new:true,
    desc:'Créer des visuels pro sans designer. 60 tutoriels PDF.',
    longDesc:'60 tutoriels pas-à-pas, 20 templates offerts, techniques pro de mise en page, charte graphique.',
    tags:['design','canva','communication'],
  },
  {
    id:'c4', type:'cours', title:'Gestion de Projet Agile', author:'ETAGIA', price:22900,
    cover:'🚀', rating:4.6, sales:389, fileSize:'38 MB',
    desc:'Scrum, Kanban, Jira — méthodes agiles appliquées terrain.',
    longDesc:'Méthodes agiles complètes avec études de cas. Sprint planning, rétrospectives, OKR, roadmaps.',
    tags:['agile','management','projet'],
  },
  {
    id:'c5', type:'cours', title:'Formation en Communication', author:'ETAGIA', price:18900,
    cover:'🗣️', rating:4.7, sales:512, fileSize:'22 MB',
    desc:'Prise de parole, écoute active, feedback constructif.',
    longDesc:'Communication interpersonnelle, gestion des conflits, art du feedback, intelligence émotionnelle.',
    tags:['communication','soft skills','management'],
  },
  // ── LOGICIELS & TEMPLATES
  {
    id:'s1', type:'logiciel', title:'Kit Formation SCORM', author:'ETAGIA', price:34900,
    cover:'🛠️', rating:4.9, sales:156, fileSize:'120 MB', bestseller:true,
    desc:'Templates SCORM 1.2 & 2004 prêts à l\'emploi.',
    longDesc:'10 templates SCORM complets + documentation. Compatible Moodle, ETAGIA LMS, Talent LMS, 360Learning.',
    tags:['SCORM','LMS','e-learning'],
  },
  {
    id:'s2', type:'logiciel', title:'Pack Slides Formation Pro', author:'ETAGIA', price:8900,
    cover:'🖼️', rating:4.5, sales:512, fileSize:'85 MB',
    desc:'50 templates PowerPoint/Keynote pour vos formations.',
    longDesc:'50 slides dark + light + couleur. Animation intégrée, icônes incluses, charte ETAGIA et neutre.',
    tags:['présentation','PowerPoint','formation'],
  },
  {
    id:'s3', type:'logiciel', title:'Dashboard RH Excel', author:'ETAGIA', price:18900,
    cover:'📈', rating:4.7, sales:234, fileSize:'12 MB',
    desc:'Suivi KPI, présences, performances — tout automatisé.',
    longDesc:'Tableau de bord RH clés en main. Présences, congés, formations, performances. Formules avancées + macros.',
    tags:['RH','excel','KPI'],
  },
  // ── RESSOURCES
  {
    id:'r1', type:'ressource', title:'Pack 500 Icônes EdTech', author:'ETAGIA', price:4900,
    cover:'🎯', rating:4.8, sales:1205, fileSize:'18 MB', bestseller:true,
    desc:'500 icônes vectorielles thème éducation/formation.',
    longDesc:'SVG + PNG 2x + fichier Figma. Thèmes: éducation, digital, RH, management, communication.',
    tags:['icônes','design','ressources'],
  },
  {
    id:'r2', type:'ressource', title:'Bibliothèque Quiz Ready', author:'ETAGIA', price:7900,
    cover:'❓', rating:4.6, sales:678, fileSize:'8 MB',
    desc:'1000 questions QCM par thématiques.',
    longDesc:'Management, Vente, RH, Digital, Communication. Format Excel + JSON compatible SCORM. Réponses incluses.',
    tags:['quiz','QCM','formation'],
  },
  {
    id:'r3', type:'ressource', title:'Templates Fiches Pédagogiques', author:'ETAGIA', price:5900,
    cover:'📋', rating:4.5, sales:334, fileSize:'6 MB', new:true,
    desc:'30 modèles de fiches pédagogiques Word/PDF.',
    longDesc:'Fiches de cours, évaluations, plans de formation, feuilles de présence, synthèses. 100% personnalisables.',
    tags:['pédagogie','templates','formation'],
  },
]

const CATS: { id: string; label: string; icon: string }[] = [
  { id:'all', label:'Tous', icon:'🛒' },
  { id:'livre', label:'Livres', icon:'📚' },
  { id:'cours', label:'Cours PDF', icon:'📄' },
  { id:'logiciel', label:'Logiciels', icon:'💾' },
  { id:'ressource', label:'Ressources', icon:'🎁' },
]

const fmt = (c: number) => `${(c/100).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g,' ')} FCFA`

/* ═══════════════════════════════════════════════
   COMPOSANT PRINCIPAL
═══════════════════════════════════════════════ */
export default function MarketPage() {
  const router = useRouter()
  const [cat, setCat] = useState('all')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<'pop'|'price_asc'|'price_desc'|'new'>('pop')
  const [purchases, setPurchases] = useState<string[]>([])
  const [modal, setModal] = useState<Product | null>(null)
  const [buyStep, setBuyStep] = useState<'form'|'loading'|'success'>('form')
  const [detail, setDetail] = useState<Product | null>(null)
  const [toast, setToast] = useState('')

  // Load purchases
  useEffect(() => {
    try { setPurchases(JSON.parse(localStorage.getItem('etagia_purchases') || '[]')) } catch {}
  }, [])

  const isPurchased = (id: string) => purchases.includes(id)

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3200)
  }

  // ── FAKE PURCHASE
  const startBuy = (p: Product) => { setModal(p); setBuyStep('form') }
  const confirmBuy = async () => {
    setBuyStep('loading')
    await new Promise(r => setTimeout(r, 2200))
    const updated = [...purchases, modal!.id]
    setPurchases(updated)
    localStorage.setItem('etagia_purchases', JSON.stringify(updated))
    // Si c'est un cours → l'ajouter à etagia_courses
    if (modal!.type === 'cours') addToMyCourses(modal!)
    setBuyStep('success')
  }

  const addToMyCourses = (p: Product) => {
    try {
      const existing = JSON.parse(localStorage.getItem('etagia_courses') || '[]')
      const alreadyIn = existing.find((c: any) => c.id === `market_${p.id}`)
      if (alreadyIn) return
      const course = {
        id: `market_${p.id}`, title: p.title, level: 'Intermédiaire',
        status: 'published', createdAt: Date.now(), updatedAt: Date.now(),
        modules: [{ id: 'm1', title: 'Contenu principal', blocks: [
          { id: 'b1', type: 'text', content: `**${p.title}**\n\n${p.longDesc || p.desc}\n\n_Ce contenu a été acheté sur la marketplace ETAGIA._` }
        ]}],
        fromMarket: true, marketProductId: p.id,
      }
      localStorage.setItem('etagia_courses', JSON.stringify([...existing, course]))
    } catch {}
  }

  const handleDownload = (p: Product) => {
    // Simulated download — create a blob
    const content = `ETAGIA LMS — ${p.title}\n\nProduit acheté le ${new Date().toLocaleDateString('fr-FR')}\n\n${p.longDesc || p.desc}\n\n---\nCe fichier est protégé par les droits d'auteur ETAGIA.\nToute reproduction sans autorisation est interdite.\nLicence accordée à l'acheteur uniquement.\n`
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `${p.title.replace(/\s+/g,'-')}.txt`
    a.click(); URL.revokeObjectURL(url)
    showToast(`✅ Téléchargement de "${p.title}" lancé`)
  }

  const handleRead = (p: Product) => {
    router.push(`/market/reader?id=${p.id}`)
  }

  const handleAddCourse = (p: Product) => {
    addToMyCourses(p)
    showToast(`✅ "${p.title}" ajouté à vos cours`)
  }

  // ── FILTERED + SORTED
  const filtered = useMemo(() => {
    let list = PRODUCTS
    if (cat !== 'all') list = list.filter(p => p.type === cat)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(p => p.title.toLowerCase().includes(q) || p.tags?.some(t => t.includes(q)))
    }
    if (sort === 'pop') list = [...list].sort((a,b) => b.sales - a.sales)
    if (sort === 'price_asc') list = [...list].sort((a,b) => a.price - b.price)
    if (sort === 'price_desc') list = [...list].sort((a,b) => b.price - a.price)
    if (sort === 'new') list = [...list].sort((a,b) => (b.new ? 1:0) - (a.new ? 1:0))
    return list
  }, [cat, search, sort])

  const purchasedCount = purchases.length
  const totalSpent = PRODUCTS.filter(p => purchases.includes(p.id)).reduce((s,p) => s+p.price, 0)

  return (
    <div style={{ color:'var(--text-primary)', fontFamily:'var(--font-body)' }}>

      {/* ── TOAST */}
      {toast && (
        <div style={{ position:'fixed', bottom:'2rem', right:'2rem', zIndex:9999,
          background:'linear-gradient(135deg,#1C1714,#2a2118)', border:'1px solid rgba(74,127,245,0.4)',
          borderRadius:'12px', padding:'12px 20px', fontSize:'14px', fontWeight:'600',
          boxShadow:'0 8px 32px rgba(0,0,0,0.4)', animation:'slideUp .3s ease',
          color:'var(--text-primary)' }}>
          {toast}
        </div>
      )}

      {/* ── HEADER */}
      <div style={{ marginBottom:'2rem' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'1rem' }}>
          <div>
            <h1 style={{ fontSize:'28px', fontWeight:'800', fontFamily:'var(--font-display)', margin:0 }}>
              🛒 Marketplace ETAGIA
            </h1>
            <p style={{ color:'var(--text-secondary)', fontSize:'14px', marginTop:'6px' }}>
              Livres, cours PDF, logiciels et ressources pour votre montée en compétences
            </p>
          </div>
          {purchasedCount > 0 && (
            <div style={{ background:'rgba(74,127,245,0.1)', border:'1px solid rgba(74,127,245,0.25)',
              borderRadius:'12px', padding:'10px 18px', textAlign:'center' }}>
              <div style={{ fontSize:'18px', fontWeight:'800', color:'var(--accent)' }}>{purchasedCount} achat{purchasedCount>1?'s':''}</div>
              <div style={{ fontSize:'11px', color:'var(--text-muted)' }}>{fmt(totalSpent)} dépensés</div>
            </div>
          )}
        </div>

        {/* STATS BAND */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'12px', marginTop:'1.5rem' }}>
          {[
            { icon:'📦', val:`${PRODUCTS.length} produits`, sub:'catalogue officiel' },
            { icon:'⭐', val:'4.7 / 5', sub:'note moyenne' },
            { icon:'🔒', val:'Achat sécurisé', sub:'paiement protégé' },
            { icon:'♾️', val:'Accès à vie', sub:'après achat' },
          ].map(s => (
            <div key={s.val} style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'12px', padding:'12px 14px', display:'flex', alignItems:'center', gap:'10px' }}>
              <span style={{ fontSize:'22px' }}>{s.icon}</span>
              <div>
                <div style={{ fontSize:'13px', fontWeight:'700' }}>{s.val}</div>
                <div style={{ fontSize:'11px', color:'var(--text-muted)' }}>{s.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── FILTERS */}
      <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'1.5rem', flexWrap:'wrap' }}>
        {/* Search */}
        <div style={{ position:'relative', flex:'1', minWidth:'220px' }}>
          <span style={{ position:'absolute', left:'12px', top:'50%', transform:'translateY(-50%)', fontSize:'14px' }}>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un produit..."
            style={{ width:'100%', background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'10px',
              padding:'9px 12px 9px 34px', color:'var(--text-primary)', fontSize:'13px', outline:'none',
              fontFamily:'var(--font-body)', boxSizing:'border-box' }} />
        </div>
        {/* Sort */}
        <select value={sort} onChange={e => setSort(e.target.value as any)}
          style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'10px',
            padding:'9px 12px', color:'var(--text-secondary)', fontSize:'13px', outline:'none', cursor:'pointer' }}>
          <option value="pop">Les plus populaires</option>
          <option value="price_asc">Prix croissant</option>
          <option value="price_desc">Prix décroissant</option>
          <option value="new">Nouveautés</option>
        </select>
      </div>

      {/* ── CATEGORY TABS */}
      <div style={{ display:'flex', gap:'8px', marginBottom:'1.5rem', flexWrap:'wrap' }}>
        {CATS.map(c => (
          <button key={c.id} onClick={() => setCat(c.id)} style={{
            background: cat===c.id ? 'var(--accent)' : 'var(--bg-card)',
            border: `1px solid ${cat===c.id ? 'var(--accent)' : 'var(--border)'}`,
            borderRadius:'20px', padding:'7px 16px', color: cat===c.id ? '#fff' : 'var(--text-secondary)',
            fontSize:'13px', fontWeight: cat===c.id ? '700' : '400',
            cursor:'pointer', fontFamily:'var(--font-display)', transition:'all .15s',
            display:'flex', alignItems:'center', gap:'6px',
          }}>
            <span>{c.icon}</span>{c.label}
            <span style={{ fontSize:'11px', opacity:.7 }}>
              {c.id==='all' ? PRODUCTS.length : PRODUCTS.filter(p=>p.type===c.id).length}
            </span>
          </button>
        ))}
      </div>

      {/* ── PRODUCT GRID */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:'16px' }}>
        {filtered.map(p => {
          const bought = isPurchased(p.id)
          return (
            <div key={p.id} style={{
              background:'var(--bg-card)', border:`1px solid ${bought ? 'rgba(74,127,245,0.35)' : 'var(--border)'}`,
              borderRadius:'16px', overflow:'hidden', transition:'transform .18s, box-shadow .18s',
              position:'relative',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform='translateY(-3px)'; (e.currentTarget as HTMLDivElement).style.boxShadow='0 12px 40px rgba(0,0,0,0.3)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform=''; (e.currentTarget as HTMLDivElement).style.boxShadow='' }}
            >
              {/* Badges */}
              <div style={{ position:'absolute', top:'10px', left:'10px', display:'flex', gap:'5px', zIndex:2 }}>
                {p.bestseller && <span style={{ background:'linear-gradient(135deg,#E8651A,#D4A017)', color:'#fff', fontSize:'9px', fontWeight:'800', padding:'3px 7px', borderRadius:'5px', letterSpacing:'1px' }}>BESTSELLER</span>}
                {p.new && <span style={{ background:'rgba(32,212,168,0.9)', color:'#0a0a0a', fontSize:'9px', fontWeight:'800', padding:'3px 7px', borderRadius:'5px', letterSpacing:'1px' }}>NOUVEAU</span>}
                {bought && <span style={{ background:'rgba(74,127,245,0.9)', color:'#fff', fontSize:'9px', fontWeight:'800', padding:'3px 7px', borderRadius:'5px', letterSpacing:'1px' }}>✓ ACHETÉ</span>}
              </div>

              {/* Cover */}
              <div style={{ height:'140px', background:'linear-gradient(135deg,rgba(74,127,245,0.08),rgba(32,212,168,0.05))', display:'flex', alignItems:'center', justifyContent:'center', position:'relative' }}>
                <span style={{ fontSize:'56px', filter: bought ? 'none' : 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' }}>{p.cover}</span>
                {!bought && (
                  <div style={{ position:'absolute', bottom:'10px', right:'10px', background:'rgba(0,0,0,0.5)', borderRadius:'6px', padding:'3px 7px', fontSize:'11px', color:'rgba(255,255,255,0.6)', display:'flex', alignItems:'center', gap:'4px' }}>
                    🔒 Verrouillé
                  </div>
                )}
                {bought && (
                  <div style={{ position:'absolute', bottom:'10px', right:'10px', background:'rgba(74,127,245,0.2)', borderRadius:'6px', padding:'3px 7px', fontSize:'11px', color:'#4A7FF5', display:'flex', alignItems:'center', gap:'4px' }}>
                    🔓 Débloqué
                  </div>
                )}
              </div>

              {/* Info */}
              <div style={{ padding:'14px' }}>
                <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:'8px', marginBottom:'6px' }}>
                  <h3 style={{ margin:0, fontSize:'14px', fontWeight:'700', fontFamily:'var(--font-display)', lineHeight:1.3 }}>{p.title}</h3>
                  <span style={{ fontSize:'10px', background:'rgba(255,255,255,0.07)', borderRadius:'5px', padding:'2px 6px', whiteSpace:'nowrap', color:'var(--text-muted)', flexShrink:0 }}>
                    {CATS.find(c=>c.id===p.type)?.icon} {CATS.find(c=>c.id===p.type)?.label}
                  </span>
                </div>
                <p style={{ margin:'0 0 10px', fontSize:'12px', color:'var(--text-muted)', lineHeight:1.5 }}>{p.desc}</p>

                {/* Meta */}
                <div style={{ display:'flex', gap:'12px', marginBottom:'12px', fontSize:'11px', color:'var(--text-muted)' }}>
                  <span>⭐ {p.rating}</span>
                  <span>📦 {p.sales.toLocaleString('fr')} ventes</span>
                  {p.fileSize && <span>💾 {p.fileSize}</span>}
                  {p.pages && <span>📄 {p.pages} pages</span>}
                </div>

                {/* Price + CTA */}
                {!bought ? (
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                    <div>
                      <div style={{ fontSize:'18px', fontWeight:'800', color:'var(--accent)', fontFamily:'var(--font-display)' }}>{fmt(p.price)}</div>
                    </div>
                    <div style={{ display:'flex', gap:'6px' }}>
                      <button onClick={() => setDetail(p)} style={{ background:'var(--bg-secondary)', border:'1px solid var(--border)', borderRadius:'8px', padding:'8px 10px', color:'var(--text-secondary)', fontSize:'12px', cursor:'pointer' }}>Détails</button>
                      <button onClick={() => startBuy(p)} style={{ background:'var(--accent)', border:'none', borderRadius:'8px', padding:'8px 14px', color:'#fff', fontWeight:'700', fontSize:'12px', cursor:'pointer', fontFamily:'var(--font-display)' }}>Acheter</button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontSize:'11px', color:'rgba(74,127,245,0.8)', marginBottom:'8px', fontWeight:'600' }}>🎉 Contenu débloqué — 3 options disponibles</div>
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'5px' }}>
                      <button onClick={() => handleDownload(p)} style={actionBtn('#4A7FF5')}>⬇️ Télécharger</button>
                      <button onClick={() => handleAddCourse(p)} style={actionBtn('#20D4A8')}>📚 Mes cours</button>
                      <button onClick={() => handleRead(p)} style={actionBtn('#E8651A')}>▶️ Lire</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign:'center', padding:'4rem 2rem', color:'var(--text-muted)' }}>
          <div style={{ fontSize:'48px', marginBottom:'1rem' }}>🔍</div>
          <p style={{ fontSize:'16px' }}>Aucun produit trouvé pour &quot;{search}&quot;</p>
        </div>
      )}

      {/* ══════════════════════════════════════
          MODAL DÉTAIL
      ══════════════════════════════════════ */}
      {detail && (
        <div style={overlay} onClick={() => setDetail(null)}>
          <div style={{ ...modalBox, maxWidth:'500px' }} onClick={e => e.stopPropagation()}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'1.2rem' }}>
              <h2 style={{ margin:0, fontSize:'20px', fontWeight:'800', fontFamily:'var(--font-display)' }}>{detail.title}</h2>
              <button onClick={() => setDetail(null)} style={closeBtn}>✕</button>
            </div>
            <div style={{ textAlign:'center', fontSize:'60px', margin:'1rem 0' }}>{detail.cover}</div>
            <p style={{ color:'var(--text-secondary)', lineHeight:1.7, marginBottom:'1rem' }}>{detail.longDesc || detail.desc}</p>
            <div style={{ display:'flex', gap:'16px', marginBottom:'1.2rem', flexWrap:'wrap' }}>
              <span style={chip}>⭐ {detail.rating}/5</span>
              <span style={chip}>📦 {detail.sales.toLocaleString('fr')} ventes</span>
              {detail.fileSize && <span style={chip}>💾 {detail.fileSize}</span>}
              {detail.pages && <span style={chip}>📄 {detail.pages} pages</span>}
              {detail.tags?.map(t => <span key={t} style={chip}>#{t}</span>)}
            </div>
            <div style={{ borderTop:'1px solid var(--border)', paddingTop:'1rem', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <span style={{ fontSize:'24px', fontWeight:'800', color:'var(--accent)', fontFamily:'var(--font-display)' }}>{fmt(detail.price)}</span>
              <button onClick={() => { setDetail(null); startBuy(detail) }} style={{ background:'var(--accent)', border:'none', borderRadius:'10px', padding:'11px 24px', color:'#fff', fontWeight:'700', fontSize:'14px', cursor:'pointer', fontFamily:'var(--font-display)' }}>
                🛒 Acheter maintenant
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════
          MODAL ACHAT
      ══════════════════════════════════════ */}
      {modal && (
        <div style={overlay} onClick={() => buyStep !== 'loading' && setModal(null)}>
          <div style={{ ...modalBox, maxWidth:'440px' }} onClick={e => e.stopPropagation()}>

            {buyStep === 'form' && (
              <>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem' }}>
                  <h2 style={{ margin:0, fontSize:'18px', fontWeight:'800', fontFamily:'var(--font-display)' }}>Finaliser l&apos;achat</h2>
                  <button onClick={() => setModal(null)} style={closeBtn}>✕</button>
                </div>
                {/* Product recap */}
                <div style={{ background:'var(--bg-secondary)', borderRadius:'12px', padding:'12px', marginBottom:'1.5rem', display:'flex', gap:'12px', alignItems:'center' }}>
                  <span style={{ fontSize:'36px' }}>{modal.cover}</span>
                  <div>
                    <div style={{ fontWeight:'700', fontSize:'14px' }}>{modal.title}</div>
                    <div style={{ fontSize:'12px', color:'var(--text-muted)' }}>{modal.author}</div>
                    <div style={{ fontSize:'18px', fontWeight:'800', color:'var(--accent)', marginTop:'3px' }}>{fmt(modal.price)}</div>
                  </div>
                </div>
                {/* Fake payment form */}
                <div style={{ marginBottom:'1rem' }}>
                  <label style={labelS}>Nom sur la carte</label>
                  <input defaultValue="Lamine Gaye" style={inputS} />
                </div>
                <div style={{ marginBottom:'1rem' }}>
                  <label style={labelS}>Numéro de carte</label>
                  <input defaultValue="4242 4242 4242 4242" style={inputS} />
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px', marginBottom:'1.5rem' }}>
                  <div>
                    <label style={labelS}>Expiration</label>
                    <input defaultValue="12/27" style={inputS} />
                  </div>
                  <div>
                    <label style={labelS}>CVV</label>
                    <input defaultValue="•••" style={inputS} type="password" />
                  </div>
                </div>
                {/* Security badges */}
                <div style={{ display:'flex', gap:'8px', marginBottom:'1.5rem', justifyContent:'center', flexWrap:'wrap' }}>
                  {['🔒 SSL sécurisé','💳 Visa / Mastercard','🏦 Orange Money'].map(b => (
                    <span key={b} style={{ fontSize:'11px', color:'var(--text-muted)', background:'var(--bg-secondary)', borderRadius:'5px', padding:'3px 8px' }}>{b}</span>
                  ))}
                </div>
                <button onClick={confirmBuy} style={{ width:'100%', background:'linear-gradient(135deg,var(--accent),#D4A017)', border:'none', borderRadius:'10px', padding:'13px', color:'#fff', fontWeight:'800', fontSize:'15px', cursor:'pointer', fontFamily:'var(--font-display)' }}>
                  ✓ Confirmer l&apos;achat — {fmt(modal.price)}
                </button>
              </>
            )}

            {buyStep === 'loading' && (
              <div style={{ textAlign:'center', padding:'2rem 1rem' }}>
                <div style={{ fontSize:'48px', marginBottom:'1rem', animation:'spin 1s linear infinite', display:'inline-block' }}>⚙️</div>
                <div style={{ fontWeight:'700', fontSize:'16px', marginBottom:'8px' }}>Traitement en cours...</div>
                <div style={{ color:'var(--text-muted)', fontSize:'13px' }}>Vérification du paiement</div>
                <div style={{ marginTop:'1.5rem', height:'4px', background:'var(--bg-secondary)', borderRadius:'99px', overflow:'hidden' }}>
                  <div style={{ height:'100%', width:'100%', background:'linear-gradient(90deg,var(--accent),var(--teal))', animation:'progress 2.2s ease forwards', borderRadius:'99px' }} />
                </div>
              </div>
            )}

            {buyStep === 'success' && (
              <div style={{ textAlign:'center', padding:'1rem' }}>
                <div style={{ fontSize:'64px', marginBottom:'1rem' }}>🎉</div>
                <h2 style={{ fontFamily:'var(--font-display)', margin:'0 0 8px', fontSize:'22px' }}>Achat confirmé !</h2>
                <p style={{ color:'var(--text-secondary)', fontSize:'14px', marginBottom:'1.5rem' }}>
                  <strong>{modal.title}</strong> est maintenant débloqué dans votre espace.
                </p>
                <div style={{ background:'rgba(74,127,245,0.08)', border:'1px solid rgba(74,127,245,0.2)', borderRadius:'12px', padding:'12px', marginBottom:'1.5rem', textAlign:'left' }}>
                  <div style={{ fontSize:'12px', fontWeight:'700', color:'#4A7FF5', marginBottom:'8px' }}>Vos 3 options d&apos;accès :</div>
                  {[
                    '⬇️ Télécharger le fichier',
                    '📚 Ajouté à "Mes cours" automatiquement',
                    '▶️ Lire directement dans le player',
                  ].map(o => <div key={o} style={{ fontSize:'13px', color:'var(--text-secondary)', padding:'4px 0' }}>{o}</div>)}
                </div>
                <button onClick={() => setModal(null)} style={{ width:'100%', background:'var(--accent)', border:'none', borderRadius:'10px', padding:'12px', color:'#fff', fontWeight:'700', fontSize:'14px', cursor:'pointer', fontFamily:'var(--font-display)' }}>
                  Accéder au contenu →
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg) } }
        @keyframes progress { from { transform: scaleX(0); transform-origin: left } to { transform: scaleX(1) } }
        @keyframes slideUp { from { opacity:0; transform:translateY(10px) } to { opacity:1; transform:translateY(0) } }
      `}</style>
    </div>
  )
}

/* ─── Styles helpers ─── */
const overlay: React.CSSProperties = {
  position:'fixed', inset:0, background:'rgba(0,0,0,0.65)', zIndex:1000,
  display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem',
  backdropFilter:'blur(4px)',
}
const modalBox: React.CSSProperties = {
  background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'20px',
  padding:'1.75rem', width:'100%', maxHeight:'90vh', overflowY:'auto',
  boxShadow:'0 32px 80px rgba(0,0,0,0.5)',
}
const closeBtn: React.CSSProperties = {
  background:'var(--bg-secondary)', border:'1px solid var(--border)', borderRadius:'8px',
  width:'32px', height:'32px', cursor:'pointer', color:'var(--text-secondary)', fontSize:'14px',
  display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
}
const chip: React.CSSProperties = {
  background:'var(--bg-secondary)', border:'1px solid var(--border)', borderRadius:'6px',
  padding:'3px 8px', fontSize:'11px', color:'var(--text-muted)',
}
const labelS: React.CSSProperties = { fontSize:'12px', color:'var(--text-secondary)', display:'block', marginBottom:'5px' }
const inputS: React.CSSProperties = {
  width:'100%', background:'var(--bg-secondary)', border:'1px solid var(--border)',
  borderRadius:'8px', padding:'9px 12px', color:'var(--text-primary)', fontSize:'13px',
  outline:'none', fontFamily:'var(--font-body)', boxSizing:'border-box',
}
const actionBtn = (color: string): React.CSSProperties => ({
  background: `${color}18`, border:`1px solid ${color}40`,
  borderRadius:'7px', padding:'6px 4px', color, fontWeight:'700', fontSize:'10px',
  cursor:'pointer', textAlign:'center', transition:'all .15s',
})
