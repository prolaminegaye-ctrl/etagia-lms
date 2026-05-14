'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const nav = [
  { href: '/dashboard', icon: '⊞', label: 'Dashboard' },
  { href: '/cours', icon: '◈', label: 'Mes cours' },
  { href: '/tutor', icon: '✦', label: 'AI Tutor' },
  { href: '/profil', icon: '◉', label: 'Profil' },
]

export default function Sidebar() {
  const path = usePathname()
  return (
    <aside style={{
      width: '220px', minHeight: '100vh', background: 'var(--bg-card)',
      borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column',
      padding: '1.5rem 0', flexShrink: 0, position: 'fixed', top: 0, left: 0, zIndex: 10
    }}>
      <div style={{ padding: '0 1.25rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '8px',
            background: 'linear-gradient(135deg, var(--accent) 0%, var(--teal) 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '14px', fontWeight: '800', fontFamily: 'var(--font-display)', color: '#fff'
          }}>E</div>
          <span style={{ fontSize: '18px', fontWeight: '700', fontFamily: 'var(--font-display)' }}>ETAGIA</span>
        </div>
      </div>

      <nav style={{ flex: 1, padding: '0 0.75rem' }}>
        {nav.map(item => {
          const active = path === item.href
          return (
            <Link key={item.href} href={item.href} style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '9px 12px', borderRadius: '10px', marginBottom: '2px',
              background: active ? 'var(--accent-muted)' : 'transparent',
              color: active ? 'var(--accent)' : 'var(--text-secondary)',
              textDecoration: 'none', fontSize: '14px', fontWeight: active ? '500' : '400',
              transition: 'all .15s', letterSpacing: '0.1px'
            }}>
              <span style={{ fontSize: '16px', opacity: active ? 1 : 0.6 }}>{item.icon}</span>
              {item.label}
              {item.label === 'AI Tutor' && (
                <span style={{
                  marginLeft: 'auto', fontSize: '10px', background: 'var(--teal-muted)',
                  color: 'var(--teal)', borderRadius: '4px', padding: '2px 6px', fontWeight: '600'
                }}>IA</span>
              )}
            </Link>
          )
        })}
      </nav>

      <div style={{ padding: '0 1.25rem', marginTop: 'auto' }}>
        <div style={{
          background: 'var(--bg-secondary)', border: '1px solid var(--border)',
          borderRadius: '12px', padding: '12px'
        }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Apprenant</div>
          <div style={{ fontWeight: '500', fontSize: '13px' }}>Lamine Gaye</div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>🔥 7 jours streak</div>
        </div>
      </div>
    </aside>
  )
}
