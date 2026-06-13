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
  chapitres?: string[]
  niveau?: string
  duree?: string
}

const fmt = (c: number) => `${(c / 100).toLocaleString('fr-FR')} FCFA`

const emptyProduct = (): Omit<Product, 'id'> => ({
  type: 'cours', title: '', author: 'ETAGIA', price: 9900,
  cover: '📦', desc: '', longDesc: '', rating: 4.5, sales: 0,
  tags: [], status: 'draft', createdAt: Date.now(), updatedAt: Date.now(),
  fileSize: '', pages: undefined,
})

const COVERS = ['📘','📗','📙','📔','📊','🔍','🎨','🚀','🗣️','🛠️','🖼️','📈','🎯','❓','📋','📦','💡','🎓','🏆','⚡','🌟','💼','🔧','📱','🎵','🎬','📐','🧪','💎','🌍']
const TYPES: { id: ProductType; label: string }[] = [
  { id: 'livre', label: '📚 Livre' },
  { id: 'cours', label: '📄 Cours PDF' },
  { id: 'logiciel', label: '💾 Logiciel' },
  { id: 'ressource', label: '🎁 Ressource' },
]

// ─── Merge catalogue ETAGIA dans localStorage (sans écraser les modifs admin) ───
function mergeWithCatalog(stored: Product[]): Product[] {
  const catalog = ETAGIA_CATALOG as any[]
  const storedIds = new Set(stored.map(p => p.id))
  const newItems = catalog.filter(c => !storedIds.has(c.id))
  return [...stored, ...newItems]
}

export default function AdminMarketPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [view, setView] = useState<'list' | 'form'>('list')
  const [editing, setEditing] = useState<Product | null>(null)
  const [form, setForm] = useState<Omit<Product, 'id'>>(emptyProduct())
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [search, setSearch] = useState('')
  const [toast, setToast] = useState('')
  const [confirmDel, setConfirmDel] = useState<string | null>(null)
  const [tagInput, setTagInput] = useState('')
  const [pdfPreview, setPdfPreview] = useState<{ url: string; name: string } | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const rowFileRef = useRef<HTMLInputElement>(null)
  const [rowFileTarget, setRowFileTarget] = useState<string | null>(null)

  // ─── Load & merge au démarrage ───
  useEffect(() => {
    try {
      const stored = localStorage.getItem('etagia_market_products')
      if (stored) {
        const parsed: Product[] = JSON.parse(stored)
        const merged = mergeWithCatalog(parsed)
        setProducts(merged)
        // Sauvegarder la version mergée si elle a grandi
        if (merged.length > parsed.length) {
          localStorage.setItem('etagia_market_products', JSON.stringify(merged))
        }
      } else {
        const all = ETAGIA_CATALOG as any[]
        setProducts(all)
        localStorage.setItem('etagia_market_products', JSON.stringify(all))
      }
    } catch {
      setProducts(ETAGIA_CATALOG as any)
    }
  }, [])

  const save = (list: Product[]) => {
    setProducts(list)
    localStorage.setItem('etagia_market_products', JSON.stringify(list))
  }

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  // ─── Sync forcé depuis le catalogue ───
  const syncFromCatalog = () => {
    const catalogIds = new Set((ETAGIA_CATALOG as any[]).map((c: any) => c.id))
    const adminOnly = products.filter(p => !catalogIds.has(p.id))
    const merged = [...(ETAGIA_CATALOG as any[]), ...adminOnly]
    save(merged)
    showToast(`✅ Catalogue synchronisé — ${merged.length} produits au total`)
  }

  const openNew = () => { setEditing(null); setForm(emptyProduct()); setTagInput(''); setView('form') }
  const openEdit = (p: Product) => { setEditing(p); setForm({ ...p }); setTagInput(''); setView('form') }

  // ─── Upload PDF dans le formulaire ───
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      setForm(f => ({ ...f, fileDataUrl: ev.target?.result as string, fileName: file.name, fileSize: `${(file.size / 1024 / 1024).toFixed(1)} MB` }))
    }
    reader.readAsDataURL(file)
  }

  // ─── Upload PDF directement depuis la liste ───
  const handleRowFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!rowFileTarget) return
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      const updated = products.map(p =>
        p.id === rowFileTarget
          ? { ...p, fileDataUrl: ev.target?.result as string, fileName: file.name, fileSize: `${(file.size / 1024 / 1024).toFixed(1)} MB`, updatedAt: Date.now() }
          : p
      )
      save(updated)
      showToast(`✅ PDF attaché à "${products.find(p => p.id === rowFileTarget)?.title}"`)
      setRowFileTarget(null)
      if (rowFileRef.current) rowFileRef.current.value = ''
    }
    reader.readAsDataURL(file)
  }

  // ─── Télécharger le PDF d'un produit ───
  const downloadPdf = (p: Product) => {
    if (!p.fileDataUrl) return
    const a = document.createElement('a')
    a.href = p.fileDataUrl
    a.download = p.fileName || `${p.title.replace(/\s+/g, '_')}.pdf`
    a.click()
    showToast(`⬇️ Téléchargement de "${p.title}" lancé`)
  }

  // ─── Prévisualiser le PDF ───
  const previewPdf = (p: Product) => {
    if (!p.fileDataUrl) return
    setPdfPreview({ url: p.fileDataUrl, name: p.title })
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
  const totalRevenue = products.reduce((s, p) => s + p.price * p.sales, 0)
  const published = products.filter(p => p.status === 'published').length
  const totalSales = products.reduce((s, p) => s + p.sales, 0)
  const withPdf = products.filter(p => !!p.fileDataUrl).length
  const avgRating = products.length ? (products.reduce((s, p) => s + p.rating, 0) / products.length) : 0

  // Filtered list
  const filtered = products
    .filter(p => filterType === 'all' || p.type === filterType)
    .filter(p => filterStatus === 'all' || p.status === filterStatus)
    .filter(p => !search || p.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => b.updatedAt - a.updatedAt)

  /* ── FORM VIEW ── */
  if (view === 'form') return (
    <div style={{ color: '#1C1917', background: 'transparent' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2rem' }}>
        <button onClick={() => setView('list')} style={{ background: 'rgba(28,25,23,0.06)', border: '1px solid rgba(28,25,23,0.12)', borderRadius: '10px', padding: '9px 18px', color: '#57534E', fontWeight: '600', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '6px' }}>← Retour</button>
        <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '800', fontFamily: 'var(--font-display)' }}>
          {editing ? '✏️ Modifier le produit' : '➕ Nouveau produit'}
        </h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', maxWidth: '900px' }}>
        {/* LEFT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Card>
            <SectionTitle>Informations générales</SectionTitle>
            <Field label="Titre du produit *">
              <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Ex: Formation Management Avancé" style={inp} />
            </Field>
            <Field label="Auteur / Éditeur">
              <input value={form.author} onChange={e => setForm(f => ({ ...f, author: e.target.value }))} style={inp} />
            </Field>
            <Field label="Description courte">
              <textarea value={form.desc} onChange={e => setForm(f => ({ ...f, desc: e.target.value }))} rows={2} style={{ ...inp, resize: 'vertical' }} placeholder="1-2 phrases accrocheuses" />
            </Field>
            <Field label="Description complète">
              <textarea value={form.longDesc} onChange={e => setForm(f => ({ ...f, longDesc: e.target.value }))} rows={5} style={{ ...inp, resize: 'vertical' }} placeholder="Contenu détaillé, chapitres, objectifs..." />
            </Field>
          </Card>

          <Card>
            <SectionTitle>Tags</SectionTitle>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())} placeholder="Ajouter un tag..." style={{ ...inp, flex: 1 }} />
              <button onClick={addTag} style={btnAcc}>+</button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {form.tags.map(t => (
                <span key={t} style={{ background: 'rgba(74,127,245,0.15)', border: '1px solid rgba(74,127,245,0.3)', borderRadius: '5px', padding: '3px 8px', fontSize: '12px', color: '#4A7FF5', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  #{t} <button onClick={() => setForm(f => ({ ...f, tags: f.tags.filter(x => x !== t) }))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4A7FF5', padding: 0, fontSize: '12px' }}>✕</button>
                </span>
              ))}
            </div>
          </Card>
        </div>

        {/* RIGHT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Card>
            <SectionTitle>Type & Visuel</SectionTitle>
            <Field label="Catégorie">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                {TYPES.map(t => (
                  <button key={t.id} onClick={() => setForm(f => ({ ...f, type: t.id }))} style={{ ...typeBtn, background: form.type === t.id ? 'rgba(232,101,26,0.15)' : 'var(--bg-secondary)', border: `1px solid ${form.type === t.id ? '#E8651A' : 'var(--line)'}`, color: form.type === t.id ? '#E8651A' : 'var(--ink-mut)' }}>
                    {t.label}
                  </button>
                ))}
              </div>
            </Field>
            <Field label="Émoji cover">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {COVERS.map(c => (
                  <button key={c} onClick={() => setForm(f => ({ ...f, cover: c }))} style={{ fontSize: '20px', padding: '4px', borderRadius: '6px', border: `2px solid ${form.cover === c ? 'var(--orange)' : 'transparent'}`, background: form.cover === c ? 'rgba(74,127,245,0.1)' : 'transparent', cursor: 'pointer' }}>{c}</button>
                ))}
              </div>
            </Field>
          </Card>

          <Card>
            <SectionTitle>Prix & Métadonnées</SectionTitle>
            <Field label="Prix (en FCFA)">
              <div style={{ position: 'relative' }}>
                <input type="number" value={form.price / 100} onChange={e => setForm(f => ({ ...f, price: Math.round(parseFloat(e.target.value || '0') * 100) }))} style={{ ...inp, paddingRight: '60px' }} min="0" step="100" />
                <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '11px', color: 'var(--text-muted)' }}>FCFA</span>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--orange)', marginTop: '4px', fontWeight: '600' }}>{fmt(form.price)}</div>
            </Field>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <Field label="Pages (livres)">
                <input type="number" value={form.pages || ''} onChange={e => setForm(f => ({ ...f, pages: parseInt(e.target.value) || undefined }))} style={inp} placeholder="Ex: 180" />
              </Field>
              <Field label="Taille fichier">
                <input value={form.fileSize || ''} onChange={e => setForm(f => ({ ...f, fileSize: e.target.value }))} style={inp} placeholder="Ex: 28 MB" />
              </Field>
            </div>
            <Field label="Note (0-5)">
              <input type="number" value={form.rating} onChange={e => setForm(f => ({ ...f, rating: parseFloat(e.target.value) || 4.5 }))} style={inp} min="0" max="5" step="0.1" />
            </Field>
          </Card>

          <Card>
            <SectionTitle>Fichier PDF & Statut</SectionTitle>
            <Field label="Fichier du module (PDF recommandé)">
              <div style={{ border: '2px dashed var(--line)', borderRadius: '10px', padding: '16px', textAlign: 'center', cursor: 'pointer', background: 'var(--bg-secondary)' }} onClick={() => fileRef.current?.click()}>
                {form.fileName ? (
                  <div>
                    <div style={{ fontSize: '24px', marginBottom: '4px' }}>📄</div>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: '#4ADE80' }}>{form.fileName}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{form.fileSize} · Cliquer pour changer</div>
                    {form.fileDataUrl && (
                      <div style={{ marginTop: '8px', display: 'flex', gap: '6px', justifyContent: 'center' }}>
                        <button onClick={e => { e.stopPropagation(); window.open(form.fileDataUrl) }} style={{ ...btnAcc, fontSize: '11px', padding: '4px 10px', background: 'rgba(74,127,245,0.15)', color: '#4A7FF5' }}>👁 Prévisualiser</button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <div style={{ fontSize: '28px', marginBottom: '6px' }}>⬆️</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Cliquer pour uploader le PDF</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>PDF, ZIP, H5P, Excel...</div>
                  </div>
                )}
              </div>
              <input ref={fileRef} type="file" style={{ display: 'none' }} onChange={handleFile} accept=".pdf,.zip,.h5p,.xlsx,.pptx,.docx" />
            </Field>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginTop: '4px' }}>
              {([['new', 'Nouveau', '🆕'], ['bestseller', 'Bestseller', '🏆'], ['featured', 'Mis en avant', '⭐']] as [string, string, string][]).map(([key, label, icon]) => (
                <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', padding: '8px', background: 'var(--bg-secondary)', borderRadius: '8px', border: `1px solid ${(form as any)[key] ? 'var(--orange)' : 'var(--line)'}` }}>
                  <input type="checkbox" checked={!!(form as any)[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.checked }))} style={{ accentColor: 'var(--orange)' }} />
                  <span style={{ fontSize: '12px' }}>{icon} {label}</span>
                </label>
              ))}
            </div>
            <Field label="Statut" style={{ marginTop: '12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {(['published', 'draft'] as ProductStatus[]).map(s => (
                  <button key={s} onClick={() => setForm(f => ({ ...f, status: s }))} style={{ padding: '9px', borderRadius: '8px', border: `1px solid ${form.status === s ? (s === 'published' ? '#4ADE80' : '#E8651A') : 'var(--line)'}`, background: form.status === s ? (s === 'published' ? 'rgba(74,222,128,0.1)' : 'rgba(232,101,26,0.1)') : 'var(--bg-secondary)', color: form.status === s ? (s === 'published' ? '#4ADE80' : '#E8651A') : 'var(--text-muted)', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>
                    {s === 'published' ? '✅ Publié' : '⏸ Brouillon'}
                  </button>
                ))}
              </div>
            </Field>
          </Card>
        </div>
      </div>

      <div style={{ marginTop: '2rem', marginBottom: '2rem', display: 'flex', gap: '12px', alignItems: 'center', padding: '1.25rem', background: 'var(--surface)', borderRadius: '14px', border: '1px solid rgba(28,25,23,0.10)', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
        <button onClick={handleSubmit} style={{
          background: 'linear-gradient(135deg, #E8651A 0%, #D4A017 100%)',
          border: 'none', borderRadius: '12px', padding: '13px 32px',
          color: '#fff', fontWeight: '800', fontSize: '15px', cursor: 'pointer',
          fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '8px',
          boxShadow: '0 4px 20px rgba(232,101,26,0.35)',
          transition: 'transform .15s, box-shadow .15s',
        }}>
          {editing ? '💾 Sauvegarder les modifications' : '🚀 Créer le produit'}
        </button>
        <button onClick={() => setView('list')} style={{
          background: 'transparent', border: '1.5px solid rgba(28,25,23,0.15)',
          borderRadius: '12px', padding: '13px 24px',
          color: '#57534E', fontWeight: '600', fontSize: '14px', cursor: 'pointer',
          fontFamily: 'inherit',
        }}>Annuler</button>
        <span style={{ fontSize: '12px', color: 'rgba(28,25,23,0.35)', marginLeft: '4px' }}>
          {editing ? `Modification de : ${(editing as any).title?.slice(0, 40)}…` : 'Nouveau produit'}
        </span>
      </div>
    </div>
  )

  /* ── LIST VIEW ── */
  return (
    <div style={{ color: 'var(--ink)' }}>
      {toast && (
        <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 9999, background: 'var(--surface)', border: '1px solid rgba(74,127,245,0.4)', borderRadius: '12px', padding: '12px 20px', fontSize: '14px', fontWeight: '600', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>{toast}</div>
      )}

      {/* Hidden input pour upload rapide en ligne */}
      <input ref={rowFileRef} type="file" style={{ display: 'none' }} onChange={handleRowFile} accept=".pdf,.zip,.h5p,.xlsx,.pptx,.docx" />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '26px', fontWeight: '800', fontFamily: 'var(--font-display)' }}>🏪 Gestion Marketplace</h1>
          <p style={{ color: 'var(--ink-mut)', fontSize: '13px', marginTop: '4px' }}>Gérez vos produits, PDFs et prix — {products.length} modules au total</p>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button onClick={syncFromCatalog} style={{ ...btnSec, display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
            🔄 Sync catalogue
          </button>
          <button onClick={openNew} style={{ ...btnAcc, padding: '11px 24px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            ➕ Nouveau produit
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '12px', marginBottom: '1.5rem' }}>
        {[
          { icon: '📦', label: 'Produits total', val: products.length, sub: `${published} publiés` },
          { icon: '📄', label: 'PDFs attachés', val: `${withPdf}/${products.length}`, sub: 'fichiers uploadés' },
          { icon: '💰', label: 'Revenus estimés', val: fmt(totalRevenue), sub: 'basé sur les ventes' },
          { icon: '📊', label: 'Ventes totales', val: totalSales.toLocaleString('fr'), sub: 'toutes catégories' },
          { icon: '⭐', label: 'Note moyenne', val: avgRating.toFixed(1), sub: 'sur 5.0' },
        ].map(k => (
          <div key={k.label} style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '14px 16px' }}>
            <div style={{ fontSize: '22px', marginBottom: '6px' }}>{k.icon}</div>
            <div style={{ fontSize: '18px', fontWeight: '800', fontFamily: 'var(--font-display)' }}>{k.val}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{k.label}</div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', opacity: .7 }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '1.2rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: '1', minWidth: '200px' }}>
          <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '13px' }}>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un produit..." style={{ ...inp, paddingLeft: '30px', width: '100%', boxSizing: 'border-box' }} />
        </div>
        <select value={filterType} onChange={e => setFilterType(e.target.value)} style={selStyle}>
          <option value="all">Tous les types</option>
          <option value="livre">Livres</option>
          <option value="cours">Cours PDF</option>
          <option value="logiciel">Logiciels</option>
          <option value="ressource">Ressources</option>
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={selStyle}>
          <option value="all">Tous statuts</option>
          <option value="published">Publiés</option>
          <option value="draft">Brouillons</option>
        </select>
      </div>

      {/* Table */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '36px 1fr 90px 110px 70px 70px 90px 150px', gap: '0', padding: '10px 16px', borderBottom: '1px solid var(--line)', fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
          <span></span><span>Produit</span><span>Type</span><span>Prix</span><span>Ventes</span><span>Fichier</span><span>Statut</span><span>Actions</span>
        </div>
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Aucun produit trouvé</div>
        )}
        {filtered.map((p, i) => (
          <div key={p.id} style={{ display: 'grid', gridTemplateColumns: '36px 1fr 90px 110px 70px 70px 90px 150px', gap: '0', padding: '12px 16px', borderBottom: i < filtered.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', alignItems: 'center', transition: 'background .15s' }}
            onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.02)'}
            onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = ''}>
            <span style={{ fontSize: '20px' }}>{p.cover}</span>
            <div>
              <div style={{ fontWeight: '600', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '5px', flexWrap: 'wrap' }}>
                {p.title}
                {p.bestseller && <span style={{ fontSize: '9px', background: 'rgba(232,101,26,0.2)', color: '#E8651A', padding: '1px 5px', borderRadius: '3px', fontWeight: '800' }}>TOP</span>}
                {p.featured && <span style={{ fontSize: '9px', background: 'rgba(212,160,23,0.2)', color: '#D4A017', padding: '1px 5px', borderRadius: '3px', fontWeight: '800' }}>⭐</span>}
                {p.new && <span style={{ fontSize: '9px', background: 'rgba(32,212,168,0.2)', color: '#20D4A8', padding: '1px 5px', borderRadius: '3px', fontWeight: '800' }}>NEW</span>}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                {p.author} · ⭐{p.rating}
                {p.chapitres ? ` · ${p.chapitres.length} chapitres` : ''}
                {p.niveau ? ` · ${p.niveau}` : ''}
              </div>
            </div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              {p.type === 'livre' ? '📚' : p.type === 'cours' ? '📄' : p.type === 'logiciel' ? '💾' : '🎁'} {p.type}
            </span>
            <div>
              <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--orange)' }}>{fmt(p.price)}</span>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{(p.price / 100).toLocaleString('fr')} FCFA</div>
            </div>
            <span style={{ fontSize: '13px' }}>{p.sales.toLocaleString('fr')}</span>

            {/* Colonne PDF */}
            <div>
              {p.fileDataUrl ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <button onClick={() => downloadPdf(p)} title="Télécharger" style={{ ...iconBtn, background: 'rgba(74,222,128,0.1)', color: '#4ADE80', borderColor: 'rgba(74,222,128,0.3)', fontSize: '11px', width: 'auto', padding: '3px 7px' }}>⬇️ PDF</button>
                  <button onClick={() => previewPdf(p)} title="Prévisualiser" style={{ ...iconBtn, fontSize: '10px', width: 'auto', padding: '2px 6px', color: 'var(--text-muted)' }}>👁 Voir</button>
                </div>
              ) : (
                <button onClick={() => { setRowFileTarget(p.id); rowFileRef.current?.click() }} title="Attacher un PDF" style={{ ...iconBtn, fontSize: '10px', width: 'auto', padding: '3px 7px', color: 'var(--text-muted)', borderStyle: 'dashed' }}>⬆️ PDF</button>
              )}
            </div>

            <button onClick={() => toggleStatus(p.id)} style={{ fontSize: '11px', padding: '4px 8px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: '700', background: p.status === 'published' ? 'rgba(74,222,128,0.15)' : 'rgba(255,255,255,0.07)', color: p.status === 'published' ? '#4ADE80' : 'var(--text-muted)' }}>
              {p.status === 'published' ? '● Publié' : '○ Brouillon'}
            </button>
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
              <button onClick={() => toggleFeatured(p.id)} title="Mettre en avant" style={{ ...iconBtn, color: p.featured ? '#D4A017' : 'var(--text-muted)' }}>⭐</button>
              <button onClick={() => openEdit(p)} title="Modifier" style={{ ...iconBtn }}>✏️</button>
              <button onClick={() => setConfirmDel(p.id)} title="Supprimer" style={{ ...iconBtn, color: '#EF4444' }}>🗑️</button>
            </div>
          </div>
        ))}
      </div>

      {/* Delete confirmation */}
      {confirmDel && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px', padding: '2rem', maxWidth: '380px', width: '100%', textAlign: 'center' }}>
            <div style={{ fontSize: '40px', marginBottom: '1rem' }}>⚠️</div>
            <h3 style={{ fontFamily: 'var(--font-display)', margin: '0 0 8px' }}>Confirmer la suppression</h3>
            <p style={{ color: 'var(--ink-mut)', fontSize: '13px', marginBottom: '1.5rem' }}>Cette action est irréversible.</p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button onClick={() => handleDelete(confirmDel)} style={{ background: '#EF4444', border: 'none', borderRadius: '10px', padding: '10px 24px', color: '#fff', fontWeight: '700', cursor: 'pointer' }}>Supprimer</button>
              <button onClick={() => setConfirmDel(null)} style={btnSec}>Annuler</button>
            </div>
          </div>
        </div>
      )}

      {/* PDF Preview Modal */}
      {pdfPreview && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 2000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px', width: '100%', maxWidth: '900px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid var(--line)' }}>
              <span style={{ fontWeight: '700', fontSize: '14px' }}>📄 {pdfPreview.name}</span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <a href={pdfPreview.url} download style={{ ...btnAcc, fontSize: '12px', padding: '6px 14px', textDecoration: 'none' }}>⬇️ Télécharger</a>
                <button onClick={() => setPdfPreview(null)} style={{ ...btnSec, padding: '6px 12px', fontSize: '12px' }}>✕ Fermer</button>
              </div>
            </div>
            <iframe src={pdfPreview.url} style={{ flex: 1, border: 'none', minHeight: '600px' }} title="PDF Preview" />
          </div>
        </div>
      )}
    </div>
  )
}

/* ── Helpers ── */
const Card = ({ children }: { children: React.ReactNode }) => (
  <div style={{ background: 'var(--surface)', border: '1px solid rgba(28,25,23,0.10)', borderRadius: '14px', padding: '1.25rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>{children}</div>
)
const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <div style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '1.5px', textTransform: 'uppercase', color: 'rgba(28,25,23,0.45)', marginBottom: '12px' }}>{children}</div>
)
const Field = ({ label, children, style }: { label: string; children: React.ReactNode; style?: React.CSSProperties }) => (
  <div style={{ marginBottom: '12px', ...style }}>
    <label style={{ fontSize: '12px', color: '#57534E', fontWeight: '600', display: 'block', marginBottom: '5px' }}>{label}</label>
    {children}
  </div>
)
const inp: React.CSSProperties = { width: '100%', background: '#FAF9F7', border: '1px solid rgba(28,25,23,0.12)', borderRadius: '8px', padding: '9px 12px', color: '#1C1917', fontSize: '13px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }
const btnAcc: React.CSSProperties = { background: 'var(--orange)', border: 'none', borderRadius: '10px', padding: '9px 18px', color: '#fff', fontWeight: '700', fontSize: '13px', cursor: 'pointer', fontFamily: 'var(--font-display)' }
const btnSec: React.CSSProperties = { background: 'var(--bg-secondary)', border: '1px solid var(--line)', borderRadius: '10px', padding: '9px 18px', color: 'var(--ink-mut)', fontWeight: '500', fontSize: '13px', cursor: 'pointer', fontFamily: 'var(--font-display)' }
const iconBtn: React.CSSProperties = { background: 'var(--bg-secondary)', border: '1px solid var(--line)', borderRadius: '7px', width: '30px', height: '30px', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center' }
const selStyle: React.CSSProperties = { background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '8px', padding: '8px 12px', color: 'var(--ink-mut)', fontSize: '13px', outline: 'none', cursor: 'pointer' }
const typeBtn: React.CSSProperties = { borderRadius: '8px', padding: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: '600', fontFamily: 'inherit', transition: 'all .15s' }
