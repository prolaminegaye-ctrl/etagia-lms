'use client'
import { useRouter } from 'next/navigation'

export default function GuidePage() {
  const router = useRouter()
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '1rem 2rem', borderBottom: '1px solid var(--border)', background: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, var(--accent) 0%, var(--teal) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '17px', fontWeight: '800', color: '#fff' }}>E</div>
          <span style={{ fontSize: '20px', fontWeight: '700', fontFamily: 'var(--font-display)' }}>Guide utilisateur</span>
        </div>
        <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>📖 Guide complet de la plateforme ETAGIA LMS</span>
        <button onClick={() => router.back()} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '10px', padding: '8px 18px', color: 'var(--text-secondary)', fontWeight: '500', fontSize: '14px', cursor: 'pointer', fontFamily: 'var(--font-display)' }}>
          ← Retour
        </button>
      </div>
      <iframe src="/guide.html" style={{ flex: 1, border: 'none', width: '100%', minHeight: 'calc(100vh - 70px)' }} title="Guide utilisateur ETAGIA" />
    </div>
  )
}
