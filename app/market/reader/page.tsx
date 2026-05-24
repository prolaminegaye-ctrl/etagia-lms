'use client'
import { Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { ETAGIA_CATALOG } from '@/lib/market-catalog'

/* ───────────────────────────────────────────────────────
   Charge le produit depuis localStorage (admin a pu
   attacher un PDF) ou fallback sur ETAGIA_CATALOG
─────────────────────────────────────────────────────── */
function getProduct(id: string): any | null {
  if (typeof window === 'undefined') return ETAGIA_CATALOG.find(p => p.id === id) || null
  try {
    const stored = localStorage.getItem('etagia_market_products')
    if (stored) {
      const list: any[] = JSON.parse(stored)
      const found = list.find(p => p.id === id)
      if (found) return found
    }
  } catch {}
  return ETAGIA_CATALOG.find(p => p.id === id) || null
}

function ReaderContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const id = searchParams.get('id') || ''
  const [hasAccess, setHasAccess] = useState<boolean | null>(null)
  const [product, setProduct] = useState<any>(null)
  const [fontSize, setFontSize] = useState(15)
  const [pdfMode, setPdfMode] = useState<'embed' | 'text'>('embed')
  const [toast, setToast] = useState('')

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  useEffect(() => {
    const p = getProduct(id)
    setProduct(p)
    try {
      const purchases: string[] = JSON.parse(localStorage.getItem('etagia_purchases') || '[]')
      setHasAccess(purchases.includes(id))
    } catch { setHasAccess(false) }
  }, [id])

  // ─── TÉLÉCHARGEMENT ───
  const handleDownload = () => {
    if (!product) return
    if (product.fileDataUrl) {
      const a = document.createElement('a')
      a.href = product.fileDataUrl
      a.download = product.fileName || `ETAGIA-${product.title.replace(/[^a-zA-Z0-9]/g, '-')}.pdf`
      a.click()
      showToast(`✅ Téléchargement PDF de "${product.title}" lancé`)
    } else {
      const chapitres = product.chapitres
        ? `\nCHAPITRES :\n${product.chapitres.map((c: string, i: number) => `  ${i + 1}. ${c}`).join('\n')}\n`
        : ''
      const content = [
        `╔${'═'.repeat(58)}╗`,
        `║  ETAGIA ACADÉMIE — MODULE OFFICIEL`,
        `║  ${product.title}`,
        `╚${'═'.repeat(58)}╝`,
        '',
        `Auteur  : ${product.author}`,
        `Niveau  : ${product.niveau || 'Intermédiaire'}`,
        `Durée   : ${product.duree || 'À votre rythme'}`,
        `Prix    : ${(product.price / 100).toLocaleString('fr')} FCFA`,
        `Acheté  : ${new Date().toLocaleDateString('fr-FR')}`,
        '',
        '─'.repeat(60),
        'DESCRIPTION',
        '─'.repeat(60),
        product.desc,
        '',
        '─'.repeat(60),
        'CONTENU DÉTAILLÉ',
        '─'.repeat(60),
        product.longDesc || product.desc,
        chapitres,
        '',
        '─'.repeat(60),
        '© ETAGIA — Licence accordée à l\'acheteur uniquement.',
      ].join('\n')
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `ETAGIA-${product.title.replace(/[^a-zA-Z0-9]/g, '-')}.txt`
      a.click()
      URL.revokeObjectURL(url)
      showToast(`✅ Fichier texte de "${product.title}" téléchargé`)
    }
  }

  // ─── STATES ───
  if (!product) return (
    <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
      <div style={{ fontSize: '48px', marginBottom: '1rem' }}>❓</div>
      <p>Module introuvable</p>
      <button onClick={() => router.push('/market')} style={backBtn}>← Retour à la marketplace</button>
    </div>
  )

  if (hasAccess === null) return (
    <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
      <div style={{ fontSize: '32px', marginBottom: '1rem', animation: 'spin 1s linear infinite', display: 'inline-block' }}>⚙️</div>
      <p>Vérification de votre accès...</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )

  // ─── PAS D'ACCÈS → PAYWALL ───
  if (!hasAccess) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ textAlign: 'center', maxWidth: '480px', width: '100%' }}>
        <div style={{ fontSize: '72px', marginBottom: '1rem' }}>🔒</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', margin: '0 0 12px' }}>Accès restreint</h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.5rem', fontSize: '14px' }}>
          Ce module est réservé aux acheteurs.<br />
          Débloquez-le sur la marketplace pour accéder au PDF complet.
        </p>
        {/* Aperçu produit */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '48px', marginBottom: '10px' }}>{product.cover}</div>
          <div style={{ fontWeight: '800', fontSize: '16px', fontFamily: 'var(--font-display)', marginBottom: '6px' }}>{product.title}</div>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px' }}>{product.desc}</div>
          {product.chapitres && product.chapitres.length > 0 && (
            <div style={{ textAlign: 'left', background: 'var(--bg-secondary)', borderRadius: '10px', padding: '10px 12px', marginBottom: '12px' }}>
              <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>📋 Contenu inclus</div>
              {product.chapitres.slice(0, 4).map((c: string, i: number) => (
                <div key={i} style={{ fontSize: '12px', color: 'var(--text-secondary)', padding: '3px 0', display: 'flex', gap: '8px' }}>
                  <span style={{ color: 'var(--accent)', fontWeight: '700', minWidth: '16px' }}>{i + 1}.</span>{c}
                </div>
              ))}
              {product.chapitres.length > 4 && (
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', fontStyle: 'italic' }}>
                  + {product.chapitres.length - 4} chapitres supplémentaires...
                </div>
              )}
            </div>
          )}
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px' }}>
            {product.niveau && <span>🎓 {product.niveau}</span>}
            {product.duree && <span>⏱ {product.duree}</span>}
            {product.pages && <span>📄 {product.pages} pages</span>}
            <span>⭐ {product.rating}/5</span>
          </div>
          <div style={{ fontSize: '24px', fontWeight: '900', color: 'var(--accent)', fontFamily: 'var(--font-display)' }}>
            {(product.price / 100).toLocaleString('fr')} FCFA
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button onClick={() => router.push('/market')} style={{ background: 'var(--accent)', border: 'none', borderRadius: '10px', padding: '12px 28px', color: '#fff', fontWeight: '700', fontSize: '14px', cursor: 'pointer', fontFamily: 'var(--font-display)' }}>
            🛒 Acheter & Débloquer
          </button>
          <button onClick={() => router.back()} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '10px', padding: '12px 20px', color: 'var(--text-secondary)', fontWeight: '500', fontSize: '14px', cursor: 'pointer' }}>
            Retour
          </button>
        </div>
      </div>
    </div>
  )

  const hasPdf = !!product.fileDataUrl

  // ─── CONTENU DÉBLOQUÉ ───
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column' }}>
      {/* TOAST */}
      {toast && (
        <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 9999, background: 'var(--bg-card)', border: '1px solid rgba(74,127,245,0.4)', borderRadius: '12px', padding: '12px 20px', fontSize: '14px', fontWeight: '600', boxShadow: '0 8px 32px rgba(0,0,0,0.4)', color: 'var(--text-primary)' }}>
          {toast}
        </div>
      )}

      {/* Sticky header */}
      <div style={{ padding: '0.9rem 2rem', borderBottom: '1px solid var(--border)', background: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={() => router.push('/market')} style={backBtn}>← Marketplace</button>
          <span style={{ fontSize: '22px' }}>{product.cover}</span>
          <div>
            <div style={{ fontWeight: '700', fontSize: '14px', fontFamily: 'var(--font-display)' }}>{product.title}</div>
            <div style={{ fontSize: '11px', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#4ADE80', fontWeight: '600' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ADE80', display: 'inline-block' }} />
                Contenu débloqué
              </span>
              {hasPdf && <span style={{ color: 'rgba(74,222,128,0.7)' }}>· PDF disponible</span>}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {/* Toggle lecture text / PDF embed */}
          {hasPdf && (
            <div style={{ display: 'flex', background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border)', overflow: 'hidden' }}>
              <button onClick={() => setPdfMode('embed')} style={{ padding: '6px 12px', fontSize: '11px', fontWeight: '600', cursor: 'pointer', border: 'none', background: pdfMode === 'embed' ? 'var(--accent)' : 'transparent', color: pdfMode === 'embed' ? '#fff' : 'var(--text-muted)' }}>
                📄 PDF
              </button>
              <button onClick={() => setPdfMode('text')} style={{ padding: '6px 12px', fontSize: '11px', fontWeight: '600', cursor: 'pointer', border: 'none', background: pdfMode === 'text' ? 'var(--accent)' : 'transparent', color: pdfMode === 'text' ? '#fff' : 'var(--text-muted)' }}>
                📝 Texte
              </button>
            </div>
          )}
          {/* Taille police (mode texte seulement) */}
          {(!hasPdf || pdfMode === 'text') && (
            <>
              <button onClick={() => setFontSize(s => Math.max(12, s - 1))} style={sizeBtn}>A−</button>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)', minWidth: '22px', textAlign: 'center' }}>{fontSize}</span>
              <button onClick={() => setFontSize(s => Math.min(22, s + 1))} style={sizeBtn}>A+</button>
            </>
          )}
          <button onClick={handleDownload} style={{ background: 'var(--accent)', border: 'none', borderRadius: '8px', padding: '7px 16px', color: '#fff', fontSize: '12px', fontWeight: '700', cursor: 'pointer', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            {hasPdf ? '⬇️ PDF' : '⬇️ Fichier'}
          </button>
        </div>
      </div>

      {/* ── MODE PDF EMBED ── */}
      {hasPdf && pdfMode === 'embed' ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '1.5rem', gap: '1rem' }}>
          {/* Info bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', fontSize: '12px', color: 'var(--text-muted)' }}>
              {product.pages && <span>📄 {product.pages} pages</span>}
              {product.fileSize && <span>💾 {product.fileSize}</span>}
              {product.chapitres && <span>📋 {product.chapitres.length} chapitres</span>}
              {product.niveau && <span>🎓 {product.niveau}</span>}
            </div>
            <button onClick={handleDownload} style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.3)', borderRadius: '8px', padding: '6px 14px', color: '#4ADE80', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>
              ⬇️ Télécharger le PDF
            </button>
          </div>
          {/* PDF iframe */}
          <div style={{ flex: 1, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
            <iframe
              src={product.fileDataUrl}
              style={{ width: '100%', height: '100%', minHeight: '75vh', border: 'none' }}
              title={product.title}
            />
          </div>
        </div>
      ) : (
        /* ── MODE TEXTE ── */
        <div style={{ flex: 1, maxWidth: '820px', margin: '0 auto', width: '100%', padding: '2.5rem 2rem' }}>

          {/* Hero */}
          <div style={{ textAlign: 'center', marginBottom: '3rem', paddingBottom: '2.5rem', borderBottom: '1px solid var(--border)' }}>
            <div style={{ width: '90px', height: '90px', borderRadius: '20px', background: 'linear-gradient(135deg, rgba(74,127,245,0.15), rgba(32,212,168,0.1))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px', margin: '0 auto 1.2rem' }}>
              {product.cover}
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: '900', margin: '0 0 10px', lineHeight: 1.25 }}>{product.title}</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: '0 0 1.2rem', lineHeight: 1.6 }}>{product.desc}</p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <span style={metaChip}>📖 ETAGIA Académie</span>
              {product.pages && <span style={metaChip}>📄 {product.pages} pages</span>}
              {product.niveau && <span style={metaChip}>🎓 {product.niveau}</span>}
              {product.duree && <span style={metaChip}>⏱ {product.duree}</span>}
              <span style={metaChip}>⭐ {product.rating}/5</span>
              <span style={{ ...metaChip, background: 'rgba(74,127,245,0.1)', color: '#4A7FF5', border: '1px solid rgba(74,127,245,0.25)' }}>✅ Accès illimité</span>
            </div>
          </div>

          {/* Chapitres (si disponibles) */}
          {product.chapitres && product.chapitres.length > 0 && (
            <div style={{ marginBottom: '2rem', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '1.25rem' }}>
              <div style={{ fontSize: '13px', fontWeight: '800', letterSpacing: '0.5px', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '12px' }}>📋 Chapitres inclus</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '8px' }}>
                {product.chapitres.map((c: string, i: number) => (
                  <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', padding: '8px 10px', background: 'var(--bg-secondary)', borderRadius: '8px' }}>
                    <span style={{ fontWeight: '800', color: 'var(--accent)', fontSize: '13px', minWidth: '22px' }}>{i + 1}.</span>
                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{c}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Body content */}
          <div style={{ fontSize: `${fontSize}px`, lineHeight: 1.95, color: 'var(--text-primary)', whiteSpace: 'pre-wrap', fontFamily: 'var(--font-body)', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '2rem' }}>
            {product.longDesc}
          </div>

          {/* Download CTA */}
          <div style={{ marginTop: '2.5rem', padding: '1.75rem', background: 'linear-gradient(135deg, rgba(74,127,245,0.07), rgba(32,212,168,0.04))', border: '1px solid rgba(74,127,245,0.2)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontWeight: '700', fontSize: '16px', marginBottom: '4px' }}>
                {hasPdf ? '⬇️ Télécharger le PDF complet' : '⬇️ Télécharger le cours complet'}
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                {hasPdf
                  ? `PDF · ${product.fileSize || 'Fichier complet'} · Accès permanent · Licence personnelle`
                  : 'Fichier texte · Accès permanent · Licence personnelle'}
              </div>
            </div>
            <button onClick={handleDownload} style={{ background: 'linear-gradient(135deg, var(--accent), #D4A017)', border: 'none', borderRadius: '10px', padding: '12px 28px', color: '#fff', fontWeight: '700', fontSize: '14px', cursor: 'pointer', fontFamily: 'var(--font-display)', whiteSpace: 'nowrap' }}>
              {hasPdf ? '⬇️ Télécharger le PDF' : '⬇️ Télécharger maintenant'}
            </button>
          </div>

          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <button onClick={() => router.push('/market')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '13px', cursor: 'pointer', textDecoration: 'underline' }}>
              ← Retour à la marketplace
            </button>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}

export default function MarketReaderPage() {
  return (
    <Suspense fallback={
      <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
        <div style={{ fontSize: '32px', marginBottom: '1rem' }}>⏳</div>Chargement...
      </div>
    }>
      <ReaderContent />
    </Suspense>
  )
}

const backBtn: React.CSSProperties = {
  background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '8px',
  padding: '7px 14px', color: 'var(--text-secondary)', fontSize: '12px', cursor: 'pointer',
  fontFamily: 'var(--font-display)', fontWeight: '500',
}
const sizeBtn: React.CSSProperties = {
  background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '6px',
  padding: '4px 9px', color: 'var(--text-secondary)', fontSize: '11px', cursor: 'pointer', fontWeight: '600',
}
const metaChip: React.CSSProperties = {
  background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '6px',
  padding: '4px 10px', fontSize: '12px', color: 'var(--text-muted)',
}
