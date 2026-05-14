'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navApprenant = [
  { href: '/dashboard', icon: '▦', label: 'Dashboard' },
  { href: '/cours', icon: '◈', label: 'Mes cours' },
  { href: '/tutor', icon: '✦', label: 'AI Tutor', badge: 'IA' },
  { href: '/profil', icon: '◉', label: 'Profil' },
]
const navFormateur = [
  { href: '/formateur', icon: '▦', label: 'Dashboard' },
  { href: '/formateur/cours', icon: '◈', label: 'Mes cours' },
  { href: '/formateur/creer', icon: '＋', label: 'Créer un cours' },
  { href: '/formateur/import', icon: '↑', label: 'Importer SCORM/H5P' },
  { href: '/formateur/apprenants', icon: '◎', label: 'Apprenants' },
  { href: '/formateur/stats', icon: '〜', label: 'Statistiques' },
]
const navAdmin = [
  { href: '/admin', icon: '▦', label: 'Dashboard' },
  { href: '/admin/users', icon: '◎', label: 'Utilisateurs' },
  { href: '/admin/cours', icon: '◈', label: 'Cours' },
  { href: '/admin/orgs', icon: '⊞', label: 'Organisations' },
  { href: '/admin/analytics', icon: '〜', label: 'Analytics' },
]

export default function Sidebar({ role = 'apprenant' }: { role?: string }) {
  const path = usePathname()
  const nav = role === 'formateur' ? navFormateur : role === 'admin' ? navAdmin : navApprenant

  return (
    <aside style={{
      width: '240px', minHeight: '100vh',
      background: 'linear-gradient(180deg, #111827 0%, #0F1219 100%)',
      borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column',
      padding: '0', flexShrink: 0,
      position: 'fixed', top: 0, left: 0, zIndex: 10,
      boxShadow: '4px 0 24px rgba(0,0,0,0.4)'
    }}>
      {/* Logo area */}
      <div style={{ padding: '1.5rem 1.25rem 1rem', borderBottom: '1px solid var(--border)' }}>
        <Link href="/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="/logo.png" alt="ETAGIA LMS" style={{ height: '40px', width: 'auto' }} />
        </Link>
        <div style={{ marginTop: '8px', fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '1px', textTransform: 'uppercase' }}>
          Plateforme EdTech · Afrique
        </div>
      </div>

      {/* Role switcher */}
      <div style={{ padding: '1rem 1rem 0.5rem' }}>
        <div style={{ display: 'flex', gap: '3px', background: 'rgba(0,0,0,0.3)', borderRadius: '10px', padding: '3px' }}>
          {[
            { r: 'apprenant', label: 'Apprenant', href: '/dashboard' },
            { r: 'formateur', label: 'Formateur', href: '/formateur' },
            { r: 'admin', label: 'Admin', href: '/admin' },
          ].map(({ r, label, href }) => (
            <Link key={r} href={href} style={{
              flex: 1, textAlign: 'center', padding: '5px 3px', borderRadius: '7px',
              fontSize: '10.5px', fontWeight: '600', textDecoration: 'none', transition: 'all .15s',
              background: role === r ? 'var(--gradient-accent)' : 'transparent',
              color: role === r ? '#fff' : 'var(--text-muted)',
            }}>{label}</Link>
          ))}
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '0.5rem 0.75rem', overflowY: 'auto' }}>
        <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase', padding: '8px 12px 4px', marginBottom: '4px' }}>
          Navigation
        </div>
        {nav.map(item => {
          const active = path === item.href || (item.href.length > 8 && path.startsWith(item.href))
          return (
            <Link key={item.href} href={item.href} style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '10px 12px', borderRadius: '10px', marginBottom: '2px',
              background: active ? 'var(--accent-muted)' : 'transparent',
              color: active ? 'var(--accent)' : 'var(--text-secondary)',
              textDecoration: 'none', fontSize: '14px', fontWeight: active ? '600' : '400',
              transition: 'all .15s',
              borderLeft: active ? '2px solid var(--accent)' : '2px solid transparent',
            }}>
              <span style={{ fontSize: '16px', opacity: active ? 1 : 0.5 }}>{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {(item as any).badge && (
                <span style={{
                  fontSize: '9px', background: 'var(--teal-muted)', color: 'var(--teal)',
                  borderRadius: '4px', padding: '2px 6px', fontWeight: '700', letterSpacing: '0.5px'
                }}>{(item as any).badge}</span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* User card */}
      <div style={{ padding: '1rem', borderTop: '1px solid var(--border)' }}>
        <div style={{
          background: 'var(--bg-card)', borderRadius: '12px', padding: '12px',
          border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '10px'
        }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0,
            background: 'var(--gradient-accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '14px', fontWeight: '700', color: '#fff', fontFamily: 'var(--font-display)'
          }}>LG</div>
          <div>
            <div style={{ fontWeight: '600', fontSize: '13px' }}>Lamine Gaye</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{role} {role === 'apprenant' ? '· 🔥 7j' : ''}</div>
          </div>
        </div>
      </div>
    </aside>
  )
}
