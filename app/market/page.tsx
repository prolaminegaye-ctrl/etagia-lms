'use client'
import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
const MarketChatbot = dynamic(() => import('@/components/MarketChatbot'), { ssr: false })
import { ETAGIA_CATALOG, EtProduct } from '@/lib/market-catalog'

type ProductType = 'livre' | 'cours' | 'logiciel' | 'ressource'

const CATS = [
  { id: 'all', label: 'Tous', icon: '🛒' },
  { id: 'livre', label: 'Livres', icon: '📚' },
  { id: 'cours', label: 'Cours PDF', icon: '📄' },
  { id: 'logiciel', label: 'Logiciels', icon: '💾' },
  { id: 'ressource', label: 'Ressources', icon: '🎁' },
]

const fmt = (c: number) => `${(c / 100).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} FCFA`

/* ═══════════════════════════════════════════════
   COMPOSANT PRINCIPAL
═══════════════════════════════════════════════ */
export default function MarketPage() {
  const router = useRouter()
  const [cat, setCat] = useState('all')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<'pop' | 'price_asc' | 'price_desc' | 'new'>('pop')
  const [purchases, setPurchases] = useState<string[]>([])
  const [modal, setModal] = useState<EtProduct | null>(null)
  const [buyStep, setBuyStep] = useState<'form' | 'loading' | 'success'>('form')
  const [detail, setDetail] = useState<EtProduct | null>(null)
  const [toast, setToast] = useState('')
  const [userProfile, setUserProfile] = useState<any>(null)
  const [catalogProducts, setCatalogProducts] = useState<EtProduct[]>(ETAGIA_CATALOG)
  const [highlightId, setHighlightId] = useState<string>('')

  // ─── Charger catalogue (localStorage + ETAGIA_CATALOG mergé) ───
  useEffect(() => {
    try { setPurchases(JSON.parse(localStorage.getItem('etagia_purchases') || '[]')) } catch {}
    try {
      const stored = localStorage.getItem('etagia_market_products')
      if (stored) {
        // Merger : priorité aux données admin (qui peuvent avoir les fileDataUrl uploadés)
        const adminProducts: EtProduct[] = JSON.parse(stored)
        const adminIds = new Set(adminProducts.map((p: EtProduct) => p.id))
        // Ajouter les items du catalogue qui ne sont pas encore dans admin
        const catalogOnly = ETAGIA_CATALOG.filter(c => !adminIds.has(c.id))
        const all = [...adminProducts, ...catalogOnly].filter((x: any) => x.status === 'published')
        setCatalogProducts(all)
      } else {
        setCatalogProducts(ETAGIA_CATALOG.filter(p => p.status === 'published'))
      }
    } catch { setCatalogProducts(ETAGIA_CATALOG) }
    try { setUserProfile(JSON.parse(localStorage.getItem('etagia_user_profile') || 'null')) } catch {}
  }, [])

  const isPurchased = (id: string) => purchases.includes(id)

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3200)
  }

  // ─── ACHAT ───
  const startBuy = (p: EtProduct) => { setModal(p); setBuyStep('form') }
  const confirmBuy = async () => {
    setBuyStep('loading')
    await new Promise(r => setTimeout(r, 2200))
    const updated = [...purchases, modal!.id]
    setPurchases(updated)
    localStorage.setItem('etagia_purchases', JSON.stringify(updated))
    if (modal!.type === 'cours') addToMyCourses(modal!)
    setBuyStep('success')
  }

  const addToMyCourses = (p: EtProduct) => {
    try {
      const existing = JSON.parse(localStorage.getItem('etagia_courses') || '[]')
      if (existing.find((c: any) => c.id === `market_${p.id}`)) return
      const course = {
        id: `market_${p.id}`, title: p.title, level: p.niveau || 'Intermédiaire',
        status: 'published', createdAt: Date.now(), updatedAt: Date.now(),
        modules: [{ id: 'm1', title: 'Contenu principal', blocks: [
          { id: 'b1', type: 'text', content: `**${p.title}**\n\n${p.longDesc || p.desc}\n\n_Ce contenu a été acheté sur la marketplace ETAGIA._` }
        ]}],
        fromMarket: true, marketProductId: p.id,
        fileDataUrl: (p as any).fileDataUrl,
        fileName: (p as any).fileName,
      }
      localStorage.setItem('etagia_courses', JSON.stringify([...existing, course]))
    } catch {}
  }

  // ─── TÉLÉCHARGEMENT ───
  // Si le produit a un vrai PDF (fileDataUrl), on le télécharge directement
  // Sinon, on génère un document texte de substitution
  const handleDownload = (p: EtProduct) => {
    const fileDataUrl = (p as any).fileDataUrl
    if (fileDataUrl) {
      const a = document.createElement('a')
      a.href = fileDataUrl
      a.download = (p as any).fileName || `ETAGIA-${p.title.replace(/[^a-zA-Z0-9]/g, '-')}.pdf`
      a.click()
      showToast(`✅ Téléchargement de "${p.title}" lancé`)
    } else {
      // Fallback texte enrichi
      const chapitres = p.chapitres ? `\nCHAPITRES :\n${p.chapitres.map((c, i) => `  ${i + 1}. ${c}`).join('\n')}\n` : ''
      const content = [
        `╔${'═'.repeat(58)}╗`,
        `║  ETAGIA ACADÉMIE — MODULE OFFICIEL`,
        `║  ${p.title}`,
        `╚${'═'.repeat(58)}╝`,
        '',
        `Auteur  : ${p.author}`,
        `Niveau  : ${p.niveau || 'Intermédiaire'}`,
        `Durée   : ${p.duree || 'À votre rythme'}`,
        `Prix    : ${fmt(p.price)}`,
        `Acheté  : ${new Date().toLocaleDateString('fr-FR')}`,
        '',
        '─'.repeat(60),
        'DESCRIPTION',
        '─'.repeat(60),
        p.desc,
        '',
        '─'.repeat(60),
        'CONTENU DÉTAILLÉ',
        '─'.repeat(60),
        p.longDesc || p.desc,
        chapitres,
        '',
        '─'.repeat(60),
        '© ETAGIA — Licence accordée à l\'acheteur uniquement.',
        'Toute reproduction sans autorisation est interdite.',
      ].join('\n')
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `ETAGIA-${p.title.replace(/[^a-zA-Z0-9]/g, '-')}.txt`
      a.click()
      URL.revokeObjectURL(url)
      showToast(`✅ Fichier texte de "${p.title}" téléchargé`)
    }
  }

  const handleRead = (p: EtProduct) => {
    router.push(`/market/reader?id=${p.id}`)
  }

  const handleAddCourse = (p: EtProduct) => {
    addToMyCourses(p)
    showToast(`✅ "${p.title}" ajouté à vos cours`)
  }

  // ─── FILTRAGE & TRI ───
  const filtered = useMemo(() => {
    let list = catalogProducts
    if (cat !== 'all') list = list.filter(p => p.type === cat)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(p => p.title.toLowerCase().includes(q) || p.tags?.some(t => t.includes(q)))
    }
    if (sort === 'pop') list = [...list].sort((a, b) => b.sales - a.sales)
    if (sort === 'price_asc') list = [...list].sort((a, b) => a.price - b.price)
    if (sort === 'price_desc') list = [...list].sort((a, b) => b.price - a.price)
    if (sort === 'new') list = [...list].sort((a, b) => (b.new ? 1 : 0) - (a.new ? 1 : 0))
    return list
  }, [cat, search, sort, catalogProducts])

  const purchasedCount = purchases.length
  const totalSpent = catalogProducts.filter(p => purchases.includes(p.id)).reduce((s, p) => s + p.price, 0)

  return (
    <div style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-body)' }}>

      {/* ── TOAST */}
      {toast && (
        <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 9999, background: 'linear-gradient(135deg,#1C1714,#2a2118)', border: '1px solid rgba(74,127,245,0.4)', borderRadius: '12px', padding: '12px 20px', fontSize: '14px', fontWeight: '600', boxShadow: '0 8px 32px rgba(0,0,0,0.4)', animation: 'slideUp .3s ease', color: 'var(--text-primary)' }}>
          {toast}
        </div>
      )}

      {/* ── HEADER */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '800', fontFamily: 'var(--font-display)', margin: 0 }}>
              🛒 Marketplace ETAGIA
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '6px' }}>
              Modules professionnels certifiés · Contexte africain francophone
            </p>
          </div>
          {purchasedCount > 0 && (
            <div style={{ background: 'rgba(74,127,245,0.1)', border: '1px solid rgba(74,127,245,0.25)', borderRadius: '12px', padding: '10px 18px', textAlign: 'center' }}>
              <div style={{ fontSize: '18px', fontWeight: '800', color: 'var(--accent)' }}>{purchasedCount} achat{purchasedCount > 1 ? 's' : ''}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{fmt(totalSpent)} dépensés</div>
            </div>
          )}
        </div>

        {/* STATS BAND */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px', marginTop: '1.5rem' }}>
          {[
            { icon: '📦', val: `${catalogProducts.length} modules`, sub: 'catalogue officiel' },
            { icon: '⭐', val: '4.7 / 5', sub: 'note moyenne' },
            { icon: '🔒', val: 'Achat sécurisé', sub: 'paiement protégé' },
            { icon: '♾️', val: 'Accès à vie', sub: 'PDF téléchargeable' },
          ].map(s => (
            <div key={s.val} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '22px' }}>{s.icon}</span>
              <div>
                <div style={{ fontSize: '13px', fontWeight: '700' }}>{s.val}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{s.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── FILTERS */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '1', minWidth: '220px' }}>
          <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '14px' }}>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un module..."
            style={{ width: '100%', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '10px', padding: '9px 12px 9px 34px', color: 'var(--text-primary)', fontSize: '13px', outline: 'none', fontFamily: 'var(--font-body)', boxSizing: 'border-box' }} />
        </div>
        <select value={sort} onChange={e => setSort(e.target.value as any)}
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '10px', padding: '9px 12px', color: 'var(--text-secondary)', fontSize: '13px', outline: 'none', cursor: 'pointer' }}>
          <option value="pop">Les plus populaires</option>
          <option value="price_asc">Prix croissant</option>
          <option value="price_desc">Prix décroissant</option>
          <option value="new">Nouveautés</option>
        </select>
      </div>

      {/* ── CATEGORY TABS */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {CATS.map(c => (
          <button key={c.id} onClick={() => setCat(c.id)} style={{
            background: cat === c.id ? 'var(--accent)' : 'var(--bg-card)',
            border: `1px solid ${cat === c.id ? 'var(--accent)' : 'var(--border)'}`,
            borderRadius: '20px', padding: '7px 16px', color: cat === c.id ? '#fff' : 'var(--text-secondary)',
            fontSize: '13px', fontWeight: cat === c.id ? '700' : '400',
            cursor: 'pointer', fontFamily: 'var(--font-display)', transition: 'all .15s',
            display: 'flex', alignItems: 'center', gap: '6px',
          }}>
            <span>{c.icon}</span>{c.label}
            <span style={{ fontSize: '11px', opacity: .7 }}>
              {c.id === 'all' ? catalogProducts.length : catalogProducts.filter(p => p.type === c.id).length}
            </span>
          </button>
        ))}
      </div>

      {/* ── PRODUCT GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(290px,1fr))', gap: '16px' }}>
        {filtered.map(p => {
          const bought = isPurchased(p.id)
          const hasPdf = !!(p as any).fileDataUrl
          return (
            <div key={p.id} id={`product-${p.id}`} style={{
              background: 'var(--bg-card)', border: `1px solid ${bought ? 'rgba(74,127,245,0.35)' : 'var(--border)'}`,
              borderRadius: '16px', overflow: 'hidden', transition: 'transform .18s, box-shadow .18s',
              position: 'relative',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 12px 40px rgba(0,0,0,0.3)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = ''; (e.currentTarget as HTMLDivElement).style.boxShadow = '' }}
            >
              {/* Badges */}
              <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', gap: '5px', zIndex: 2, flexWrap: 'wrap' }}>
                {p.bestseller && <span style={{ background: 'linear-gradient(135deg,#E8651A,#D4A017)', color: '#fff', fontSize: '9px', fontWeight: '800', padding: '3px 7px', borderRadius: '5px', letterSpacing: '1px' }}>BESTSELLER</span>}
                {p.new && <span style={{ background: 'rgba(32,212,168,0.9)', color: '#0a0a0a', fontSize: '9px', fontWeight: '800', padding: '3px 7px', borderRadius: '5px', letterSpacing: '1px' }}>NOUVEAU</span>}
                {bought && <span style={{ background: 'rgba(74,127,245,0.9)', color: '#fff', fontSize: '9px', fontWeight: '800', padding: '3px 7px', borderRadius: '5px', letterSpacing: '1px' }}>✓ ACHETÉ</span>}
              </div>

              {/* Cover */}
              <div style={{ height: '140px', background: 'linear-gradient(135deg,rgba(74,127,245,0.08),rgba(32,212,168,0.05))', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <span style={{ fontSize: '56px' }}>{p.cover}</span>
                {!bought && (
                  <div style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'rgba(0,0,0,0.5)', borderRadius: '6px', padding: '3px 7px', fontSize: '11px', color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    🔒 Verrouillé
                  </div>
                )}
                {bought && (
                  <div style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'rgba(74,127,245,0.2)', borderRadius: '6px', padding: '3px 7px', fontSize: '11px', color: '#4A7FF5', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    🔓 Débloqué
                  </div>
                )}
                {/* Badge PDF disponible */}
                {bought && hasPdf && (
                  <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(74,222,128,0.2)', borderRadius: '6px', padding: '3px 7px', fontSize: '10px', color: '#4ADE80', border: '1px solid rgba(74,222,128,0.4)' }}>
                    📄 PDF
                  </div>
                )}
              </div>

              {/* Info */}
              <div style={{ padding: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '6px' }}>
                  <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '700', fontFamily: 'var(--font-display)', lineHeight: 1.3 }}>{p.title}</h3>
                  <span style={{ fontSize: '10px', background: 'rgba(255,255,255,0.07)', borderRadius: '5px', padding: '2px 6px', whiteSpace: 'nowrap', color: 'var(--text-muted)', flexShrink: 0 }}>
                    {CATS.find(c => c.id === p.type)?.icon} {CATS.find(c => c.id === p.type)?.label}
                  </span>
                </div>
                <p style={{ margin: '0 0 8px', fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.5 }}>{p.desc}</p>

                {/* Chapitres preview */}
                {p.chapitres && p.chapitres.length > 0 && (
                  <div style={{ marginBottom: '8px', fontSize: '11px', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.03)', borderRadius: '6px', padding: '6px 8px' }}>
                    📋 {p.chapitres.length} chapitres · {p.niveau || 'Intermédiaire'} {p.duree ? `· ${p.duree}` : ''}
                  </div>
                )}

                {/* Meta */}
                <div style={{ display: 'flex', gap: '10px', marginBottom: '12px', fontSize: '11px', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                  <span>⭐ {p.rating}</span>
                  <span>📦 {p.sales.toLocaleString('fr')} ventes</span>
                  {p.fileSize && <span>💾 {p.fileSize}</span>}
                  {p.pages && <span>📄 {p.pages} pages</span>}
                </div>

                {/* Price + CTA */}
                {!bought ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: '18px', fontWeight: '800', color: 'var(--accent)', fontFamily: 'var(--font-display)' }}>{fmt(p.price)}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button onClick={() => setDetail(p)} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '8px', padding: '8px 10px', color: 'var(--text-secondary)', fontSize: '12px', cursor: 'pointer' }}>Détails</button>
                      <button onClick={() => startBuy(p)} style={{ background: 'var(--accent)', border: 'none', borderRadius: '8px', padding: '8px 14px', color: '#fff', fontWeight: '700', fontSize: '12px', cursor: 'pointer', fontFamily: 'var(--font-display)' }}>
                        🛒 Acheter
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontSize: '11px', color: 'rgba(74,127,245,0.8)', marginBottom: '8px', fontWeight: '600' }}>
                      🎉 Contenu débloqué {hasPdf ? '· PDF disponible' : ''}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '5px' }}>
                      <button onClick={() => handleDownload(p)} style={actionBtn('#4ADE80')}>
                        {hasPdf ? '⬇️ PDF' : '⬇️ Fichier'}
                      </button>
                      <button onClick={() => handleAddCourse(p)} style={actionBtn('#20D4A8')}>📚 Cours</button>
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
        <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '48px', marginBottom: '1rem' }}>🔍</div>
          <p style={{ fontSize: '16px' }}>Aucun module trouvé pour &quot;{search}&quot;</p>
        </div>
      )}

      {/* ══════════════════════════════════════
          MODAL DÉTAIL
      ══════════════════════════════════════ */}
      {detail && (
        <div style={overlay} onClick={() => setDetail(null)}>
          <div style={{ ...modalBox, maxWidth: '520px' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.2rem' }}>
              <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '800', fontFamily: 'var(--font-display)' }}>{detail.title}</h2>
              <button onClick={() => setDetail(null)} style={closeBtn}>✕</button>
            </div>
            <div style={{ textAlign: 'center', fontSize: '60px', margin: '1rem 0' }}>{detail.cover}</div>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>{detail.shortLongDesc || detail.desc}</p>

            {/* Chapitres */}
            {detail.chapitres && detail.chapitres.length > 0 && (
              <div style={{ background: 'var(--bg-secondary)', borderRadius: '10px', padding: '12px', marginBottom: '1rem' }}>
                <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>📋 Chapitres inclus</div>
                {detail.chapitres.map((c, i) => (
                  <div key={i} style={{ fontSize: '13px', color: 'var(--text-secondary)', padding: '4px 0', display: 'flex', gap: '8px' }}>
                    <span style={{ color: 'var(--accent)', fontWeight: '700', minWidth: '20px' }}>{i + 1}.</span>{c}
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px', marginBottom: '1.2rem', flexWrap: 'wrap' }}>
              <span style={chip}>⭐ {detail.rating}/5</span>
              <span style={chip}>📦 {detail.sales.toLocaleString('fr')} ventes</span>
              {detail.fileSize && <span style={chip}>💾 {detail.fileSize}</span>}
              {detail.pages && <span style={chip}>📄 {detail.pages} pages</span>}
              {detail.niveau && <span style={chip}>🎓 {detail.niveau}</span>}
              {detail.duree && <span style={chip}>⏱ {detail.duree}</span>}
              {detail.tags?.slice(0, 4).map(t => <span key={t} style={chip}>#{t}</span>)}
            </div>
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '24px', fontWeight: '800', color: 'var(--accent)', fontFamily: 'var(--font-display)' }}>{fmt(detail.price)}</span>
              <button onClick={() => { setDetail(null); startBuy(detail) }} style={{ background: 'var(--accent)', border: 'none', borderRadius: '10px', padding: '11px 24px', color: '#fff', fontWeight: '700', fontSize: '14px', cursor: 'pointer', fontFamily: 'var(--font-display)' }}>
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
          <div style={{ ...modalBox, maxWidth: '440px' }} onClick={e => e.stopPropagation()}>

            {buyStep === 'form' && (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '800', fontFamily: 'var(--font-display)' }}>Finaliser l&apos;achat</h2>
                  <button onClick={() => setModal(null)} style={closeBtn}>✕</button>
                </div>
                {/* Product recap */}
                <div style={{ background: 'var(--bg-secondary)', borderRadius: '12px', padding: '12px', marginBottom: '1.5rem', display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <span style={{ fontSize: '36px' }}>{modal.cover}</span>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '14px' }}>{modal.title}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{modal.author}</div>
                    {modal.chapitres && <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>📋 {modal.chapitres.length} chapitres inclus</div>}
                    <div style={{ fontSize: '18px', fontWeight: '800', color: 'var(--accent)', marginTop: '3px' }}>{fmt(modal.price)}</div>
                  </div>
                </div>

                {/* Ce que l'acheteur obtient */}
                <div style={{ background: 'rgba(74,127,245,0.06)', border: '1px solid rgba(74,127,245,0.15)', borderRadius: '10px', padding: '10px 12px', marginBottom: '1.5rem' }}>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: '#4A7FF5', marginBottom: '6px' }}>✅ Ce que vous obtenez</div>
                  {[
                    `📄 Module PDF complet "${modal.title}"`,
                    '♾️ Accès et téléchargement illimités',
                    '📚 Ajout automatique à vos cours',
                    '▶️ Lecture en ligne dans le player',
                  ].map(item => (
                    <div key={item} style={{ fontSize: '12px', color: 'var(--text-secondary)', padding: '3px 0' }}>{item}</div>
                  ))}
                </div>

                {/* Fake payment form */}
                <div style={{ marginBottom: '1rem' }}>
                  <label style={labelS}>Nom sur la carte</label>
                  <input defaultValue="Lamine Gaye" style={inputS} />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={labelS}>Numéro de carte</label>
                  <input defaultValue="4242 4242 4242 4242" style={inputS} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '1.5rem' }}>
                  <div>
                    <label style={labelS}>Expiration</label>
                    <input defaultValue="12/27" style={inputS} />
                  </div>
                  <div>
                    <label style={labelS}>CVV</label>
                    <input defaultValue="•••" style={inputS} type="password" />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                  {['🔒 SSL sécurisé', '💳 Visa / MC', '📱 Orange Money', '🏦 Wave'].map(b => (
                    <span key={b} style={{ fontSize: '11px', color: 'var(--text-muted)', background: 'var(--bg-secondary)', borderRadius: '5px', padding: '3px 8px' }}>{b}</span>
                  ))}
                </div>
                <button onClick={confirmBuy} style={{ width: '100%', background: 'linear-gradient(135deg,var(--accent),#D4A017)', border: 'none', borderRadius: '10px', padding: '13px', color: '#fff', fontWeight: '800', fontSize: '15px', cursor: 'pointer', fontFamily: 'var(--font-display)' }}>
                  ✓ Confirmer l&apos;achat — {fmt(modal.price)}
                </button>
              </>
            )}

            {buyStep === 'loading' && (
              <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <div style={{ fontSize: '48px', marginBottom: '1rem', animation: 'spin 1s linear infinite', display: 'inline-block' }}>⚙️</div>
                <div style={{ fontWeight: '700', fontSize: '16px', marginBottom: '8px' }}>Traitement en cours...</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Vérification du paiement</div>
                <div style={{ marginTop: '1.5rem', height: '4px', background: 'var(--bg-secondary)', borderRadius: '99px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: '100%', background: 'linear-gradient(90deg,var(--accent),var(--teal))', animation: 'progress 2.2s ease forwards', borderRadius: '99px' }} />
                </div>
              </div>
            )}

            {buyStep === 'success' && (
              <div style={{ textAlign: 'center', padding: '1rem' }}>
                <div style={{ fontSize: '64px', marginBottom: '1rem' }}>🎉</div>
                <h2 style={{ fontFamily: 'var(--font-display)', margin: '0 0 8px', fontSize: '22px' }}>Achat confirmé !</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '1.5rem' }}>
                  <strong>{modal.title}</strong> est maintenant débloqué dans votre espace.
                </p>
                <div style={{ background: 'rgba(74,127,245,0.08)', border: '1px solid rgba(74,127,245,0.2)', borderRadius: '12px', padding: '12px', marginBottom: '1.5rem', textAlign: 'left' }}>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: '#4A7FF5', marginBottom: '8px' }}>Vos 3 options d&apos;accès :</div>
                  {[
                    `⬇️ Télécharger le PDF complet`,
                    '📚 Ajouté à "Mes cours" automatiquement',
                    '▶️ Lire directement dans le player',
                  ].map(o => <div key={o} style={{ fontSize: '13px', color: 'var(--text-secondary)', padding: '4px 0' }}>{o}</div>)}
                </div>
                <button onClick={() => setModal(null)} style={{ width: '100%', background: 'var(--accent)', border: 'none', borderRadius: '10px', padding: '12px', color: '#fff', fontWeight: '700', fontSize: '14px', cursor: 'pointer', fontFamily: 'var(--font-display)' }}>
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
        @keyframes highlight { 0%,100% { box-shadow:none } 50% { box-shadow: 0 0 0 3px rgba(74,127,245,0.5) } }
      `}</style>

      {/* ── CHATBOT */}
      <MarketChatbot
        products={catalogProducts as any}
        userProfile={userProfile}
        onProductClick={(id) => {
          setHighlightId(id)
          const el = document.getElementById(`product-${id}`)
          if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'center' }); el.style.animation = 'highlight 1.5s ease 3' }
          setTimeout(() => setHighlightId(''), 5000)
        }}
      />
    </div>
  )
}

/* ─── Styles helpers ─── */
const overlay: React.CSSProperties = {
  position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', zIndex: 1000,
  display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
  backdropFilter: 'blur(4px)',
}
const modalBox: React.CSSProperties = {
  background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '20px',
  padding: '1.75rem', width: '100%', maxHeight: '90vh', overflowY: 'auto',
  boxShadow: '0 32px 80px rgba(0,0,0,0.5)',
}
const closeBtn: React.CSSProperties = {
  background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '8px',
  width: '32px', height: '32px', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '14px',
  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
}
const chip: React.CSSProperties = {
  background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '6px',
  padding: '3px 8px', fontSize: '11px', color: 'var(--text-muted)',
}
const labelS: React.CSSProperties = { fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }
const inputS: React.CSSProperties = {
  width: '100%', background: 'var(--bg-secondary)', border: '1px solid var(--border)',
  borderRadius: '8px', padding: '9px 12px', color: 'var(--text-primary)', fontSize: '13px',
  outline: 'none', fontFamily: 'var(--font-body)', boxSizing: 'border-box',
}
const actionBtn = (color: string): React.CSSProperties => ({
  background: `${color}18`, border: `1px solid ${color}40`,
  borderRadius: '7px', padding: '6px 4px', color, fontWeight: '700', fontSize: '10px',
  cursor: 'pointer', textAlign: 'center', transition: 'all .15s',
})
