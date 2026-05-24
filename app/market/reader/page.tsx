'use client'
import { Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { ETAGIA_CATALOG } from '@/lib/market-catalog'

function ReaderContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const id = searchParams.get('id') || ''
  const [hasAccess, setHasAccess] = useState<boolean | null>(null)
  const [fontSize, setFontSize] = useState(15)

  const product = ETAGIA_CATALOG.find(p => p.id === id) as any

  useEffect(() => {
    try {
      const purchases: string[] = JSON.parse(localStorage.getItem('etagia_purchases') || '[]')
      setHasAccess(purchases.includes(id))
    } catch { setHasAccess(false) }
  }, [id])

  if (!product) return (
    <div style={{ textAlign:'center', padding:'4rem', color:'var(--text-muted)' }}>
      <div style={{ fontSize:'48px', marginBottom:'1rem' }}>❓</div>
      <p>Produit introuvable</p>
      <button onClick={() => router.push('/market')} style={backBtn}>← Retour au marché</button>
    </div>
  )

  if (hasAccess === null) return (
    <div style={{ textAlign:'center', padding:'4rem', color:'var(--text-muted)' }}>
      <div style={{ fontSize:'32px', marginBottom:'1rem', animation:'spin 1s linear infinite', display:'inline-block' }}>⚙️</div>
      <p>Vérification de votre accès...</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )

  if (!hasAccess) return (
    <div style={{ minHeight:'100vh', background:'var(--bg-primary)', display:'flex', alignItems:'center', justifyContent:'center', padding:'2rem' }}>
      <div style={{ textAlign:'center', maxWidth:'440px' }}>
        <div style={{ fontSize:'72px', marginBottom:'1rem' }}>🔒</div>
        <h2 style={{ fontFamily:'var(--font-display)', fontSize:'24px', margin:'0 0 12px' }}>Accès restreint</h2>
        <p style={{ color:'var(--text-secondary)', lineHeight:1.7, marginBottom:'1.5rem', fontSize:'14px' }}>
          Ce cours est réservé aux acheteurs de <strong>{product.title}</strong>.<br/>
          Débloquez-le sur la marketplace pour y accéder.
        </p>
        <div style={{ background:'rgba(74,127,245,0.07)', border:'1px solid rgba(74,127,245,0.2)', borderRadius:'12px', padding:'12px', marginBottom:'1.5rem' }}>
          <div style={{ fontSize:'28px', marginBottom:'4px' }}>{product.cover}</div>
          <div style={{ fontWeight:'700', fontSize:'14px' }}>{product.title}</div>
          <div style={{ fontSize:'16px', color:'var(--accent)', fontWeight:'800', marginTop:'4px' }}>
            {(product.price/100).toLocaleString('fr')} FCFA
          </div>
        </div>
        <div style={{ display:'flex', gap:'10px', justifyContent:'center' }}>
          <button onClick={() => router.push('/market')} style={{ background:'var(--accent)', border:'none', borderRadius:'10px', padding:'11px 24px', color:'#fff', fontWeight:'700', fontSize:'14px', cursor:'pointer', fontFamily:'var(--font-display)' }}>
            🛒 Acheter maintenant
          </button>
          <button onClick={() => router.back()} style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'10px', padding:'11px 20px', color:'var(--text-secondary)', fontWeight:'500', fontSize:'14px', cursor:'pointer' }}>
            Retour
          </button>
        </div>
      </div>
    </div>
  )

  const handleDownload = () => {
    const content = `ETAGIA ACADÉMIE\n${product.title}\n${'═'.repeat(50)}\n\n${product.longDesc}\n`
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ETAGIA-${product.title.replace(/[^a-zA-Z0-9]/g,'-').replace(/-+/g,'-')}.txt`
    a.click(); URL.revokeObjectURL(url)
  }

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg-primary)', display:'flex', flexDirection:'column' }}>
      {/* Sticky header */}
      <div style={{ padding:'0.9rem 2rem', borderBottom:'1px solid var(--border)', background:'var(--bg-card)', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'10px', position:'sticky', top:0, zIndex:10 }}>
        <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
          <button onClick={() => router.push('/market')} style={backBtn}>← Marketplace</button>
          <span style={{ fontSize:'22px' }}>{product.cover}</span>
          <div>
            <div style={{ fontWeight:'700', fontSize:'14px', fontFamily:'var(--font-display)' }}>{product.title}</div>
            <div style={{ fontSize:'11px', display:'flex', alignItems:'center', gap:'4px', color:'#4ADE80', fontWeight:'600' }}>
              <span style={{ width:'6px', height:'6px', borderRadius:'50%', background:'#4ADE80', display:'inline-block' }} />
              Contenu débloqué · ETAGIA Académie
            </div>
          </div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
          <span style={{ fontSize:'11px', color:'var(--text-muted)' }}>Police :</span>
          <button onClick={() => setFontSize(s => Math.max(12, s-1))} style={sizeBtn}>A−</button>
          <span style={{ fontSize:'11px', color:'var(--text-secondary)', minWidth:'22px', textAlign:'center' }}>{fontSize}</span>
          <button onClick={() => setFontSize(s => Math.min(22, s+1))} style={sizeBtn}>A+</button>
          <button onClick={handleDownload} style={{ background:'var(--accent)', border:'none', borderRadius:'8px', padding:'7px 14px', color:'#fff', fontSize:'12px', fontWeight:'700', cursor:'pointer', fontFamily:'var(--font-display)' }}>
            ⬇️ Télécharger
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex:1, maxWidth:'820px', margin:'0 auto', width:'100%', padding:'2.5rem 2rem' }}>

        {/* Hero */}
        <div style={{ textAlign:'center', marginBottom:'3rem', paddingBottom:'2.5rem', borderBottom:'1px solid var(--border)' }}>
          <div style={{ width:'90px', height:'90px', borderRadius:'20px', background:'linear-gradient(135deg, rgba(74,127,245,0.15), rgba(32,212,168,0.1))', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'48px', margin:'0 auto 1.2rem' }}>
            {product.cover}
          </div>
          <h1 style={{ fontFamily:'var(--font-display)', fontSize:'26px', fontWeight:'900', margin:'0 0 10px', lineHeight:1.25 }}>{product.title}</h1>
          <p style={{ color:'var(--text-secondary)', fontSize:'14px', margin:'0 0 1.2rem', lineHeight:1.6 }}>{product.desc}</p>
          <div style={{ display:'flex', gap:'10px', justifyContent:'center', flexWrap:'wrap' }}>
            <span style={metaChip}>📖 ETAGIA Académie</span>
            {product.pages && <span style={metaChip}>📄 {product.pages} pages</span>}
            <span style={metaChip}>⭐ {product.rating}/5</span>
            <span style={{ ...metaChip, background:'rgba(74,127,245,0.1)', color:'#4A7FF5', border:'1px solid rgba(74,127,245,0.25)' }}>✅ Accès illimité</span>
            {product.tags?.slice(0,3).map((t: string) => <span key={t} style={metaChip}>#{t}</span>)}
          </div>
        </div>

        {/* Body */}
        <div style={{
          fontSize:`${fontSize}px`, lineHeight:1.95, color:'var(--text-primary)',
          whiteSpace:'pre-wrap', fontFamily:'var(--font-body)',
          background:'var(--bg-card)', border:'1px solid var(--border)',
          borderRadius:'16px', padding:'2rem',
        }}>
          {product.longDesc}
        </div>

        {/* Download CTA */}
        <div style={{ marginTop:'2.5rem', padding:'1.75rem', background:'linear-gradient(135deg, rgba(74,127,245,0.07), rgba(32,212,168,0.04))', border:'1px solid rgba(74,127,245,0.2)', borderRadius:'16px', display:'flex', alignItems:'center', justifyContent:'space-between', gap:'1rem', flexWrap:'wrap' }}>
          <div>
            <div style={{ fontWeight:'700', fontSize:'16px', marginBottom:'4px' }}>⬇️ Télécharger le cours complet</div>
            <div style={{ color:'var(--text-muted)', fontSize:'13px' }}>Fichier texte · Accès permanent · Licence personnelle</div>
          </div>
          <button onClick={handleDownload} style={{ background:'linear-gradient(135deg, var(--accent), #D4A017)', border:'none', borderRadius:'10px', padding:'12px 28px', color:'#fff', fontWeight:'700', fontSize:'14px', cursor:'pointer', fontFamily:'var(--font-display)', whiteSpace:'nowrap' }}>
            ⬇️ Télécharger maintenant
          </button>
        </div>

        {/* Back to marketplace */}
        <div style={{ textAlign:'center', marginTop:'2rem' }}>
          <button onClick={() => router.push('/market')} style={{ background:'none', border:'none', color:'var(--text-muted)', fontSize:'13px', cursor:'pointer', textDecoration:'underline' }}>
            ← Retour à la marketplace
          </button>
        </div>
      </div>
    </div>
  )
}

export default function MarketReaderPage() {
  return (
    <Suspense fallback={
      <div style={{ textAlign:'center', padding:'4rem', color:'var(--text-muted)' }}>
        <div style={{ fontSize:'32px', marginBottom:'1rem' }}>⏳</div>Chargement...
      </div>
    }>
      <ReaderContent />
    </Suspense>
  )
}

const backBtn: React.CSSProperties = {
  background:'var(--bg-secondary)', border:'1px solid var(--border)', borderRadius:'8px',
  padding:'7px 14px', color:'var(--text-secondary)', fontSize:'12px', cursor:'pointer',
  fontFamily:'var(--font-display)', fontWeight:'500',
}
const sizeBtn: React.CSSProperties = {
  background:'var(--bg-secondary)', border:'1px solid var(--border)', borderRadius:'6px',
  padding:'4px 9px', color:'var(--text-secondary)', fontSize:'11px', cursor:'pointer', fontWeight:'600',
}
const metaChip: React.CSSProperties = {
  background:'var(--bg-secondary)', border:'1px solid var(--border)', borderRadius:'6px',
  padding:'4px 10px', fontSize:'12px', color:'var(--text-muted)',
}
