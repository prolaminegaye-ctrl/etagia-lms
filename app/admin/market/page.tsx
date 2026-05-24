'use client'
import { useState, useEffect, useRef } from 'react'
import { ETAGIA_CATALOG } from '@/lib/market-catalog'

type ProductType = 'livre' | 'cours' | 'logiciel' | 'ressource'
type ProductStatus = 'published' | 'draft'

interface Product {
  id: string
  type: ProductType
  title: string
  author: string
  price: number
  cover: string
  desc: string
  longDesc: string
  rating: number
  sales: number
  fileSize?: string
  pages?: number
  new?: boolean
  bestseller?: boolean
  tags: string[]
  status: ProductStatus
  fileDataUrl?: string
  fileName?: string
  createdAt: number
  updatedAt: number
  featured?: boolean
}

const DEFAULT_PRODUCTS: Product[] = [
  { id:'l1', type:'livre', title:'La Vente Consultative', author:'ETAGIA Éditions', price:14900, cover:'📘', rating:4.8, sales:342, pages:180, bestseller:true, status:'published', tags:['vente','négociation'], desc:'Maîtrisez l\'art de vendre par la valeur.', longDesc:'180 pages de méthodes éprouvées.', createdAt:1700000000000, updatedAt:1700000000000 },
  { id:'l2', type:'livre', title:'Management Nouvelle Ère', author:'ETAGIA Éditions', price:12900, cover:'📗', rating:4.6, sales:218, pages:220, status:'published', tags:['management'], desc:'Leadership et gestion des talents.', longDesc:'Culture d\'entreprise en Afrique.', createdAt:1700000000000, updatedAt:1700000000000 },
  { id:'l3', type:'livre', title:'L\'Art de la Négociation', author:'ETAGIA Éditions', price:9900, cover:'📙', rating:4.7, sales:456, pages:150, new:true, status:'published', tags:['négociation'], desc:'Techniques éprouvées.', longDesc:'40 techniques et cas pratiques.', createdAt:1700000000000, updatedAt:1700000000000 },
  { id:'l4', type:'livre', title:'Entrepreneuriat en Afrique', author:'ETAGIA Éditions', price:16900, cover:'📔', rating:4.9, sales:891, pages:260, bestseller:true, status:'published', tags:['entrepreneuriat'], desc:'Guide complet entrepreneurs.', longDesc:'Business model, financement, scaling.', createdAt:1700000000000, updatedAt:1700000000000 },
  { id:'c1', type:'cours', title:'Formation Excel Avancé', author:'ETAGIA', price:19900, cover:'📊', rating:4.9, sales:892, fileSize:'28 MB', bestseller:true, status:'published', tags:['excel','bureautique'], desc:'45 fiches pratiques PDF.', longDesc:'TCD, VBA, Power Query.', createdAt:1700000000000, updatedAt:1700000000000 },
  { id:'c2', type:'cours', title:'SEO & Référencement Pro', author:'ETAGIA', price:24900, cover:'🔍', rating:4.7, sales:634, fileSize:'42 MB', status:'published', tags:['SEO','digital'], desc:'De débutant à expert SEO.', longDesc:'Checklist 120 points.', createdAt:1700000000000, updatedAt:1700000000000 },
  { id:'c3', type:'cours', title:'Canva Maîtrise Totale', author:'ETAGIA', price:15900, cover:'🎨', rating:4.8, sales:723, fileSize:'35 MB', new:true, status:'published', tags:['design','canva'], desc:'60 tutoriels PDF.', longDesc:'Templates + techniques pro.', createdAt:1700000000000, updatedAt:1700000000000 },
  { id:'c4', type:'cours', title:'Gestion de Projet Agile', author:'ETAGIA', price:22900, cover:'🚀', rating:4.6, sales:389, fileSize:'38 MB', status:'published', tags:['agile','projet'], desc:'Scrum, Kanban, Jira.', longDesc:'Méthodes agiles complètes.', createdAt:1700000000000, updatedAt:1700000000000 },
  { id:'c5', type:'cours', title:'Formation en Communication', author:'ETAGIA', price:18900, cover:'🗣️', rating:4.7, sales:512, fileSize:'22 MB', status:'published', tags:['communication'], desc:'Prise de parole, écoute active.', longDesc:'Intelligence émotionnelle.', createdAt:1700000000000, updatedAt:1700000000000 },
  { id:'s1', type:'logiciel', title:'Kit Formation SCORM', author:'ETAGIA', price:34900, cover:'🛠️', rating:4.9, sales:156, fileSize:'120 MB', bestseller:true, status:'published', tags:['SCORM','LMS'], desc:'Templates SCORM 1.2 & 2004.', longDesc:'Compatible tous LMS.', createdAt:1700000000000, updatedAt:1700000000000 },
  { id:'s2', type:'logiciel', title:'Pack Slides Formation Pro', author:'ETAGIA', price:8900, cover:'🖼️', rating:4.5, sales:512, fileSize:'85 MB', status:'published', tags:['présentation'], desc:'50 templates PowerPoint.', longDesc:'Dark + Light + animations.', createdAt:1700000000000, updatedAt:1700000000000 },
  { id:'s3', type:'logiciel', title:'Dashboard RH Excel', author:'ETAGIA', price:18900, cover:'📈', rating:4.7, sales:234, fileSize:'12 MB', status:'published', tags:['RH','KPI'], desc:'Suivi KPI automatisé.', longDesc:'Dashboard RH complet.', createdAt:1700000000000, updatedAt:1700000000000 },
  { id:'r1', type:'ressource', title:'Pack 500 Icônes EdTech', author:'ETAGIA', price:4900, cover:'🎯', rating:4.8, sales:1205, fileSize:'18 MB', bestseller:true, status:'published', tags:['icônes','design'], desc:'500 icônes vectorielles.', longDesc:'SVG + PNG + Figma.', createdAt:1700000000000, updatedAt:1700000000000 },
  { id:'r2', type:'ressource', title:'Bibliothèque Quiz Ready', author:'ETAGIA', price:7900, cover:'❓', rating:4.6, sales:678, fileSize:'8 MB', status:'published', tags:['quiz','QCM'], desc:'1000 questions QCM.', longDesc:'JSON + Excel SCORM-ready.', createdAt:1700000000000, updatedAt:1700000000000 },
  { id:'r3', type:'ressource', title:'Templates Fiches Pédagogiques', author:'ETAGIA', price:5900, cover:'📋', rating:4.5, sales:334, fileSize:'6 MB', new:true, status:'published', tags:['pédagogie','templates'], desc:'30 modèles Word/PDF.', longDesc:'100% personnalisables.', createdAt:1700000000000, updatedAt:1700000000000 },
]

const COVERS = ['📘','📗','📙','📔','📊','🔍','🎨','🚀','🗣️','🛠️','🖼️','📈','🎯','❓','📋','📦','💡','🎓','🏆','⚡','🌟','💼','🔧','📱','🎵','🎬','📐','🧪','💎','🌍']
const TYPES: { id: ProductType; label: string }[] = [
  { id:'livre', label:'📚 Livre' },
  { id:'cours', label:'📄 Cours PDF' },
  { id:'logiciel', label:'💾 Logiciel' },
  { id:'ressource', label:'🎁 Ressource' },
]
const fmt = (c: number) => `${(c/100).toLocaleString('fr-FR')} FCFA`

const emptyProduct = (): Omit<Product,'id'> => ({
  type: 'cours', title: '', author: 'ETAGIA', price: 9900,
  cover: '📦', desc: '', longDesc: '', rating: 4.5, sales: 0,
  tags: [], status: 'draft', createdAt: Date.now(), updatedAt: Date.now(),
  fileSize: '', pages: undefined,
})

export default function AdminMarketPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [view, setView] = useState<'list'|'form'>('list')
  const [editing, setEditing] = useState<Product | null>(null)
  const [form, setForm] = useState<Omit<Product,'id'>>(emptyProduct())
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [search, setSearch] = useState('')
  const [toast, setToast] = useState('')
  const [confirmDel, setConfirmDel] = useState<string|null>(null)
  const [tagInput, setTagInput] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  // Load from localStorage or defaults
  useEffect(() => {
    try {
      const stored = localStorage.getItem('etagia_market_products')
      if (stored) setProducts(JSON.parse(stored))
      else { const all = [...ETAGIA_CATALOG] as any[]; setProducts(all); localStorage.setItem('etagia_market_products', JSON.stringify(all)) }
    } catch { setProducts([...ETAGIA_CATALOG] as any) }
  }, [])

  const save = (list: Product[]) => {
    setProducts(list)
    localStorage.setItem('etagia_market_products', JSON.stringify(list))
  }

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  const openNew = () => { setEditing(null); setForm(emptyProduct()); setTagInput(''); setView('form') }
  const openEdit = (p: Product) => { setEditing(p); setForm({ ...p }); setTagInput(''); setView('form') }

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      setForm(f => ({ ...f, fileDataUrl: ev.target?.result as string, fileName: file.name, fileSize: `${(file.size/1024/1024).toFixed(1)} MB` }))
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = () => {
    if (!form.title.trim()) { showToast('❌ Le titre est requis'); return }
    if (form.price <= 0) { showToast('❌ Le prix doit être supérieur à 0'); return }
    const now = Date.now()
    if (editing) {
      const updated = products.map(p => p.id === editing.id ? { ...form, id: editing.id, updatedAt: now } as Product : p)
      save(updated); showToast('✅ Produit mis à jour')
    } else {
      const newP: Product = { ...form, id: `p_${now}`, createdAt: now, updatedAt: now }
      save([...products, newP]); showToast('✅ Produit créé et publié')
    }
    setView('list')
  }

  const handleDelete = (id: string) => {
    save(products.filter(p => p.id !== id))
    setConfirmDel(null); showToast('🗑️ Produit supprimé')
  }

  const toggleStatus = (id: string) => {
    save(products.map(p => p.id === id ? { ...p, status: p.status === 'published' ? 'draft' : 'published', updatedAt: Date.now() } : p))
  }

  const toggleFeatured = (id: string) => {
    save(products.map(p => p.id === id ? { ...p, featured: !p.featured, updatedAt: Date.now() } : p))
  }

  const addTag = () => {
    const t = tagInput.trim().toLowerCase()
    if (t && !form.tags.includes(t)) { setForm(f => ({ ...f, tags: [...f.tags, t] })); setTagInput('') }
  }

  // Stats
  const totalRevenue = products.reduce((s,p) => s + p.price * p.sales, 0)
  const published = products.filter(p => p.status === 'published').length
  const totalSales = products.reduce((s,p) => s + p.sales, 0)

  // Filtered list
  const filtered = products
    .filter(p => filterType === 'all' || p.type === filterType)
    .filter(p => filterStatus === 'all' || p.status === filterStatus)
    .filter(p => !search || p.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a,b) => b.updatedAt - a.updatedAt)

  /* ── FORM VIEW ── */
  if (view === 'form') return (
    <div style={{ color:'var(--text-primary)' }}>
      <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'2rem' }}>
        <button onClick={() => setView('list')} style={btnSec}>← Retour</button>
        <h2 style={{ margin:0, fontSize:'22px', fontWeight:'800', fontFamily:'var(--font-display)' }}>
          {editing ? '✏️ Modifier le produit' : '➕ Nouveau produit'}
        </h2>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'24px', maxWidth:'900px' }}>
        {/* LEFT */}
        <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
          <Card>
            <SectionTitle>Informations générales</SectionTitle>
            <Field label="Titre du produit *">
              <input value={form.title} onChange={e => setForm(f=>({...f,title:e.target.value}))} placeholder="Ex: Formation Management Avancé" style={inp} />
            </Field>
            <Field label="Auteur / Éditeur">
              <input value={form.author} onChange={e => setForm(f=>({...f,author:e.target.value}))} style={inp} />
            </Field>
            <Field label="Description courte">
              <textarea value={form.desc} onChange={e => setForm(f=>({...f,desc:e.target.value}))} rows={2} style={{ ...inp, resize:'vertical' }} placeholder="1-2 phrases accrocheuses" />
            </Field>
            <Field label="Description complète (modal / reader)">
              <textarea value={form.longDesc} onChange={e => setForm(f=>({...f,longDesc:e.target.value}))} rows={5} style={{ ...inp, resize:'vertical' }} placeholder="Contenu détaillé, chapitres, objectifs..." />
            </Field>
          </Card>

          <Card>
            <SectionTitle>Tags</SectionTitle>
            <div style={{ display:'flex', gap:'8px', marginBottom:'8px' }}>
              <input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => e.key==='Enter' && (e.preventDefault(), addTag())} placeholder="Ajouter un tag..." style={{ ...inp, flex:1 }} />
              <button onClick={addTag} style={btnAcc}>+</button>
            </div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:'6px' }}>
              {form.tags.map(t => (
                <span key={t} style={{ background:'rgba(74,127,245,0.15)', border:'1px solid rgba(74,127,245,0.3)', borderRadius:'5px', padding:'3px 8px', fontSize:'12px', color:'#4A7FF5', display:'flex', alignItems:'center', gap:'4px' }}>
                  #{t} <button onClick={() => setForm(f=>({...f,tags:f.tags.filter(x=>x!==t)}))} style={{ background:'none', border:'none', cursor:'pointer', color:'#4A7FF5', padding:0, fontSize:'12px' }}>✕</button>
                </span>
              ))}
            </div>
          </Card>
        </div>

        {/* RIGHT */}
        <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
          <Card>
            <SectionTitle>Type & Visuel</SectionTitle>
            <Field label="Catégorie">
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'6px' }}>
                {TYPES.map(t => (
                  <button key={t.id} onClick={() => setForm(f=>({...f,type:t.id}))} style={{ ...typeBtn, background: form.type===t.id ? 'rgba(232,101,26,0.15)' : 'var(--bg-secondary)', border:`1px solid ${form.type===t.id ? '#E8651A' : 'var(--border)'}`, color: form.type===t.id ? '#E8651A' : 'var(--text-secondary)' }}>
                    {t.label}
                  </button>
                ))}
              </div>
            </Field>
            <Field label="Émoji cover">
              <div style={{ display:'flex', flexWrap:'wrap', gap:'6px' }}>
                {COVERS.map(c => (
                  <button key={c} onClick={() => setForm(f=>({...f,cover:c}))} style={{ fontSize:'20px', padding:'4px', borderRadius:'6px', border:`2px solid ${form.cover===c ? 'var(--accent)' : 'transparent'}`, background: form.cover===c ? 'rgba(74,127,245,0.1)' : 'transparent', cursor:'pointer' }}>{c}</button>
                ))}
              </div>
            </Field>
          </Card>

          <Card>
            <SectionTitle>Prix & Métadonnées</SectionTitle>
            <Field label="Prix (en FCFA)">
              <div style={{ position:'relative' }}>
                <input type="number" value={form.price/100} onChange={e => setForm(f=>({...f,price:Math.round(parseFloat(e.target.value||'0')*100)})) } style={{ ...inp, paddingRight:'60px' }} min="0" step="100" />
                <span style={{ position:'absolute', right:'12px', top:'50%', transform:'translateY(-50%)', fontSize:'11px', color:'var(--text-muted)' }}>FCFA</span>
              </div>
              <div style={{ fontSize:'12px', color:'var(--accent)', marginTop:'4px', fontWeight:'600' }}>{fmt(form.price)}</div>
            </Field>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px' }}>
              <Field label="Pages (livres)">
                <input type="number" value={form.pages || ''} onChange={e => setForm(f=>({...f,pages:parseInt(e.target.value)||undefined}))} style={inp} placeholder="Ex: 180" />
              </Field>
              <Field label="Taille fichier">
                <input value={form.fileSize || ''} onChange={e => setForm(f=>({...f,fileSize:e.target.value}))} style={inp} placeholder="Ex: 28 MB" />
              </Field>
            </div>
            <Field label="Note (0-5)">
              <input type="number" value={form.rating} onChange={e => setForm(f=>({...f,rating:parseFloat(e.target.value)||4.5}))} style={inp} min="0" max="5" step="0.1" />
            </Field>
          </Card>

          <Card>
            <SectionTitle>Fichier & Statut</SectionTitle>
            <Field label="Fichier du produit">
              <div style={{ border:'2px dashed var(--border)', borderRadius:'10px', padding:'16px', textAlign:'center', cursor:'pointer', background:'var(--bg-secondary)' }} onClick={() => fileRef.current?.click()}>
                {form.fileName ? (
                  <div>
                    <div style={{ fontSize:'20px', marginBottom:'4px' }}>📎</div>
                    <div style={{ fontSize:'13px', fontWeight:'600', color:'var(--accent)' }}>{form.fileName}</div>
                    <div style={{ fontSize:'11px', color:'var(--text-muted)' }}>{form.fileSize}</div>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontSize:'28px', marginBottom:'6px' }}>⬆️</div>
                    <div style={{ fontSize:'13px', color:'var(--text-muted)' }}>Cliquer pour uploader</div>
                    <div style={{ fontSize:'11px', color:'var(--text-muted)', marginTop:'2px' }}>PDF, ZIP, H5P, Excel...</div>
                  </div>
                )}
              </div>
              <input ref={fileRef} type="file" style={{ display:'none' }} onChange={handleFile} accept=".pdf,.zip,.h5p,.xlsx,.pptx,.docx" />
            </Field>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'8px', marginTop:'4px' }}>
              {([['new','Nouveau','🆕'],['bestseller','Bestseller','🏆'],['featured','Mis en avant','⭐']] as [string,string,string][]).map(([key,label,icon]) => (
                <label key={key} style={{ display:'flex', alignItems:'center', gap:'6px', cursor:'pointer', padding:'8px', background:'var(--bg-secondary)', borderRadius:'8px', border:`1px solid ${(form as any)[key] ? 'var(--accent)' : 'var(--border)'}` }}>
                  <input type="checkbox" checked={!!(form as any)[key]} onChange={e => setForm(f=>({...f,[key]:e.target.checked}))} style={{ accentColor:'var(--accent)' }} />
                  <span style={{ fontSize:'12px' }}>{icon} {label}</span>
                </label>
              ))}
            </div>
            <Field label="Statut" style={{ marginTop:'12px' }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px' }}>
                {(['published','draft'] as ProductStatus[]).map(s => (
                  <button key={s} onClick={() => setForm(f=>({...f,status:s}))} style={{ padding:'9px', borderRadius:'8px', border:`1px solid ${form.status===s ? (s==='published'?'#4ADE80':'#E8651A') : 'var(--border)'}`, background: form.status===s ? (s==='published'?'rgba(74,222,128,0.1)':'rgba(232,101,26,0.1)') : 'var(--bg-secondary)', color: form.status===s ? (s==='published'?'#4ADE80':'#E8651A') : 'var(--text-muted)', cursor:'pointer', fontSize:'13px', fontWeight:'600' }}>
                    {s === 'published' ? '✅ Publié' : '⏸ Brouillon'}
                  </button>
                ))}
              </div>
            </Field>
          </Card>
        </div>
      </div>

      {/* Save button */}
      <div style={{ marginTop:'1.5rem', display:'flex', gap:'10px' }}>
        <button onClick={handleSubmit} style={{ ...btnAcc, padding:'12px 32px', fontSize:'15px' }}>
          {editing ? '💾 Sauvegarder les modifications' : '🚀 Créer le produit'}
        </button>
        <button onClick={() => setView('list')} style={btnSec}>Annuler</button>
      </div>
    </div>
  )

  /* ── LIST VIEW ── */
  return (
    <div style={{ color:'var(--text-primary)' }}>
      {toast && (
        <div style={{ position:'fixed', bottom:'2rem', right:'2rem', zIndex:9999, background:'var(--bg-card)', border:'1px solid rgba(74,127,245,0.4)', borderRadius:'12px', padding:'12px 20px', fontSize:'14px', fontWeight:'600', boxShadow:'0 8px 32px rgba(0,0,0,0.4)' }}>{toast}</div>
      )}

      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.5rem', flexWrap:'wrap', gap:'1rem' }}>
        <div>
          <h1 style={{ margin:0, fontSize:'26px', fontWeight:'800', fontFamily:'var(--font-display)' }}>🏪 Gestion Marketplace</h1>
          <p style={{ color:'var(--text-secondary)', fontSize:'13px', marginTop:'4px' }}>Gérez vos produits, prix et fichiers en toute autonomie</p>
        </div>
        <button onClick={openNew} style={{ ...btnAcc, padding:'11px 24px', fontSize:'14px', display:'flex', alignItems:'center', gap:'8px' }}>
          ➕ Nouveau produit
        </button>
      </div>

      {/* KPI Cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'12px', marginBottom:'1.5rem' }}>
        {[
          { icon:'📦', label:'Produits total', val:products.length, sub:`${published} publiés` },
          { icon:'💰', label:'Revenus estimés', val:fmt(totalRevenue), sub:'basé sur les ventes' },
          { icon:'📊', label:'Ventes totales', val:totalSales.toLocaleString('fr'), sub:'toutes catégories' },
          { icon:'⭐', label:'Note moyenne', val:(products.reduce((s,p)=>s+p.rating,0)/products.length||0).toFixed(1), sub:'sur 5.0' },
        ].map(k => (
          <div key={k.label} style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'12px', padding:'14px 16px' }}>
            <div style={{ fontSize:'22px', marginBottom:'6px' }}>{k.icon}</div>
            <div style={{ fontSize:'20px', fontWeight:'800', fontFamily:'var(--font-display)' }}>{k.val}</div>
            <div style={{ fontSize:'11px', color:'var(--text-muted)', marginTop:'2px' }}>{k.label}</div>
            <div style={{ fontSize:'10px', color:'var(--text-muted)', opacity:.7 }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display:'flex', gap:'10px', marginBottom:'1.2rem', flexWrap:'wrap', alignItems:'center' }}>
        <div style={{ position:'relative', flex:'1', minWidth:'200px' }}>
          <span style={{ position:'absolute', left:'10px', top:'50%', transform:'translateY(-50%)', fontSize:'13px' }}>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un produit..." style={{ ...inp, paddingLeft:'30px', width:'100%', boxSizing:'border-box' }} />
        </div>
        <select value={filterType} onChange={e=>setFilterType(e.target.value)} style={selStyle}>
          <option value="all">Tous les types</option>
          <option value="livre">Livres</option>
          <option value="cours">Cours PDF</option>
          <option value="logiciel">Logiciels</option>
          <option value="ressource">Ressources</option>
        </select>
        <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)} style={selStyle}>
          <option value="all">Tous statuts</option>
          <option value="published">Publiés</option>
          <option value="draft">Brouillons</option>
        </select>
      </div>

      {/* Table */}
      <div style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'16px', overflow:'hidden' }}>
        <div style={{ display:'grid', gridTemplateColumns:'40px 1fr 100px 110px 80px 90px 130px', gap:'0', padding:'10px 16px', borderBottom:'1px solid var(--border)', fontSize:'11px', fontWeight:'700', color:'var(--text-muted)', letterSpacing:'0.5px', textTransform:'uppercase' }}>
          <span></span><span>Produit</span><span>Type</span><span>Prix</span><span>Ventes</span><span>Statut</span><span>Actions</span>
        </div>
        {filtered.length === 0 && (
          <div style={{ textAlign:'center', padding:'3rem', color:'var(--text-muted)' }}>Aucun produit trouvé</div>
        )}
        {filtered.map((p, i) => (
          <div key={p.id} style={{ display:'grid', gridTemplateColumns:'40px 1fr 100px 110px 80px 90px 130px', gap:'0', padding:'12px 16px', borderBottom: i < filtered.length-1 ? '1px solid rgba(255,255,255,0.04)' : 'none', alignItems:'center', transition:'background .15s' }}
            onMouseEnter={e=>(e.currentTarget as HTMLDivElement).style.background='rgba(255,255,255,0.02)'}
            onMouseLeave={e=>(e.currentTarget as HTMLDivElement).style.background=''}>
            <span style={{ fontSize:'22px' }}>{p.cover}</span>
            <div>
              <div style={{ fontWeight:'600', fontSize:'13px', display:'flex', alignItems:'center', gap:'5px' }}>
                {p.title}
                {p.bestseller && <span style={{ fontSize:'9px', background:'rgba(232,101,26,0.2)', color:'#E8651A', padding:'1px 5px', borderRadius:'3px', fontWeight:'800' }}>TOP</span>}
                {p.featured && <span style={{ fontSize:'9px', background:'rgba(212,160,23,0.2)', color:'#D4A017', padding:'1px 5px', borderRadius:'3px', fontWeight:'800' }}>⭐</span>}
                {p.new && <span style={{ fontSize:'9px', background:'rgba(32,212,168,0.2)', color:'#20D4A8', padding:'1px 5px', borderRadius:'3px', fontWeight:'800' }}>NEW</span>}
              </div>
              <div style={{ fontSize:'11px', color:'var(--text-muted)', marginTop:'2px' }}>{p.author} · ⭐{p.rating} · {p.fileSize || (p.pages ? `${p.pages}p` : '—')}</div>
            </div>
            <span style={{ fontSize:'12px', color:'var(--text-muted)' }}>
              {p.type === 'livre' ? '📚 Livre' : p.type === 'cours' ? '📄 Cours' : p.type === 'logiciel' ? '💾 Logiciel' : '🎁 Ressource'}
            </span>
            <span style={{ fontSize:'13px', fontWeight:'700', color:'var(--accent)' }}>{fmt(p.price)}</span>
            <span style={{ fontSize:'13px' }}>{p.sales.toLocaleString('fr')}</span>
            <button onClick={() => toggleStatus(p.id)} style={{ fontSize:'11px', padding:'4px 8px', borderRadius:'6px', border:'none', cursor:'pointer', fontWeight:'700', background: p.status==='published' ? 'rgba(74,222,128,0.15)' : 'rgba(255,255,255,0.07)', color: p.status==='published' ? '#4ADE80' : 'var(--text-muted)' }}>
              {p.status==='published' ? '● Publié' : '○ Brouillon'}
            </button>
            <div style={{ display:'flex', gap:'5px' }}>
              <button onClick={() => toggleFeatured(p.id)} title="Mettre en avant" style={{ ...iconBtn, color: p.featured ? '#D4A017' : 'var(--text-muted)' }}>⭐</button>
              <button onClick={() => openEdit(p)} title="Modifier" style={{ ...iconBtn }}>✏️</button>
              <button onClick={() => setConfirmDel(p.id)} title="Supprimer" style={{ ...iconBtn, color:'#EF4444' }}>🗑️</button>
            </div>
          </div>
        ))}
      </div>

      {/* Delete confirmation */}
      {confirmDel && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <div style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'16px', padding:'2rem', maxWidth:'380px', width:'100%', textAlign:'center' }}>
            <div style={{ fontSize:'40px', marginBottom:'1rem' }}>⚠️</div>
            <h3 style={{ fontFamily:'var(--font-display)', margin:'0 0 8px' }}>Confirmer la suppression</h3>
            <p style={{ color:'var(--text-secondary)', fontSize:'13px', marginBottom:'1.5rem' }}>Cette action est irréversible.</p>
            <div style={{ display:'flex', gap:'10px', justifyContent:'center' }}>
              <button onClick={() => handleDelete(confirmDel)} style={{ background:'#EF4444', border:'none', borderRadius:'10px', padding:'10px 24px', color:'#fff', fontWeight:'700', cursor:'pointer' }}>Supprimer</button>
              <button onClick={() => setConfirmDel(null)} style={btnSec}>Annuler</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ── Helpers ── */
const Card = ({ children }: { children: React.ReactNode }) => (
  <div style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'14px', padding:'1.25rem' }}>{children}</div>
)
const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <div style={{ fontSize:'12px', fontWeight:'800', letterSpacing:'1px', textTransform:'uppercase', color:'var(--text-muted)', marginBottom:'12px' }}>{children}</div>
)
const Field = ({ label, children, style }: { label: string; children: React.ReactNode; style?: React.CSSProperties }) => (
  <div style={{ marginBottom:'12px', ...style }}>
    <label style={{ fontSize:'12px', color:'var(--text-secondary)', display:'block', marginBottom:'5px' }}>{label}</label>
    {children}
  </div>
)
const inp: React.CSSProperties = { width:'100%', background:'var(--bg-secondary)', border:'1px solid var(--border)', borderRadius:'8px', padding:'9px 12px', color:'var(--text-primary)', fontSize:'13px', outline:'none', fontFamily:'var(--font-body)', boxSizing:'border-box' }
const btnAcc: React.CSSProperties = { background:'var(--accent)', border:'none', borderRadius:'10px', padding:'9px 18px', color:'#fff', fontWeight:'700', fontSize:'13px', cursor:'pointer', fontFamily:'var(--font-display)' }
const btnSec: React.CSSProperties = { background:'var(--bg-secondary)', border:'1px solid var(--border)', borderRadius:'10px', padding:'9px 18px', color:'var(--text-secondary)', fontWeight:'500', fontSize:'13px', cursor:'pointer', fontFamily:'var(--font-display)' }
const iconBtn: React.CSSProperties = { background:'var(--bg-secondary)', border:'1px solid var(--border)', borderRadius:'7px', width:'30px', height:'30px', cursor:'pointer', fontSize:'13px', display:'flex', alignItems:'center', justifyContent:'center' }
const selStyle: React.CSSProperties = { background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'8px', padding:'8px 12px', color:'var(--text-secondary)', fontSize:'13px', outline:'none', cursor:'pointer' }
const typeBtn: React.CSSProperties = { borderRadius:'8px', padding:'8px', cursor:'pointer', fontSize:'12px', fontWeight:'600', fontFamily:'var(--font-display)', transition:'all .15s' }
