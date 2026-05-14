'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navApprenant = [
  { href: '/dashboard', icon: '⊞', label: 'Dashboard' },
  { href: '/cours', icon: '◈', label: 'Mes cours' },
  { href: '/tutor', icon: '✦', label: 'AI Tutor', badge: 'IA' },
  { href: '/profil', icon: '◉', label: 'Profil' },
]

const navFormateur = [
  { href: '/formateur', icon: '⊞', label: 'Dashboard' },
  { href: '/formateur/cours', icon: '◈', label: 'Mes cours' },
  { href: '/formateur/creer', icon: '＋', label: 'Créer un cours' },
  { href: '/formateur/import', icon: '↑', label: 'Importer SCORM/H5P' },
  { href: '/formateur/apprenants', icon: '◎', label: 'Apprenants' },
  { href: '/formateur/stats', icon: '▦', label: 'Statistiques' },
]

const navAdmin = [
  { href: '/admin', icon: '⊞', label: 'Dashboard' },
  { href: '/admin/users', icon: '◎', label: 'Utilisateurs' },
  { href: '/admin/cours', icon: '◈', label: 'Cours' },
  { href: '/admin/orgs', icon: '▦', label: 'Organisations' },
  { href: '/admin/analytics', icon: '✦', label: 'Analytics' },
]

export default function Sidebar({ role = 'apprenant' }: { role?: string }) {
  const path = usePathname()
  const nav = role === 'formateur' ? navFormateur : role === 'admin' ? navAdmin : navApprenant

  return (
    <aside style={{
      width: '230px', minHeight: '100vh',
      background: '#FFFFFF',
      borderRight: '1px solid var(--border)',
      boxShadow: '1px 0 8px rgba(0,0,0,0.04)',
      display: 'flex', flexDirection: 'column',
      padding: '1.25rem 0', flexShrink: 0,
      position: 'fixed', top: 0, left: 0, zIndex: 10
    }}>
      {/* Logo */}
      <div style={{ padding: '0 1.25rem', marginBottom: '1.5rem' }}>
        <Link href="/dashboard" style={{ textDecoration: 'none', display: 'block' }}>
          <img src="/logo.png" alt="ETAGIA LMS" style={{ height: '44px', width: 'auto', borderRadius: '8px' }} />
        </Link>
      </div>

      {/* Role switcher */}
      <div style={{ padding: '0 0.75rem', marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', gap: '3px', background: 'var(--bg-secondary)', borderRadius: '8px', padding: '3px' }}>
          {[
            { r: 'apprenant', label: '👤 Apprenant', href: '/dashboard' },
            { r: 'formateur', label: '🎓 Formateur', href: '/formateur' },
            { r: 'admin', label: '⚙️ Admin', href: '/admin' },
          ].map(({ r, label, href }) => (
            <Link key={r} href={href} style={{
              flex: 1, textAlign: 'center', padding: '4px 2px', borderRadius: '6px',
              fontSize: '10px', fontWeight: '600', textDecoration: 'none', transition: 'all .15s',
              background: role === r ? 'var(--accent)' : 'transparent',
              color: role === r ? '#fff' : 'var(--text-secondary)',
              whiteSpace: 'nowrap'
            }}>{label}</Link>
          ))}
        </div>
      </div>

      <nav style={{ flex: 1, padding: '0 0.75rem' }}>
        {nav.map(item => {
          const active = path === item.href || (item.href.length > 6 && path.startsWith(item.href))
          return (
            <Link key={item.href} href={item.href} style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '9px 12px', borderRadius: '10px', marginBottom: '2px',
              background: active ? 'var(--accent-muted)' : 'transparent',
              color: active ? 'var(--accent)' : 'var(--text-secondary)',
              textDecoration: 'none', fontSize: '14px', fontWeight: active ? '600' : '400',
              transition: 'all .15s', borderLeft: active ? '3px solid var(--accent)' : '3px solid transparent'
            }}>
              <span style={{ fontSize: '15px' }}>{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {(item as any).badge && (
                <span style={{
                  fontSize: '10px', background: 'var(--teal-muted)', color: 'var(--teal)',
                  borderRadius: '4px', padding: '2px 5px', fontWeight: '700'
                }}>{(item as any).badge}</span>
              )}
            </Link>
          )
        })}
      </nav>

      <div style={{ padding: '0 1rem', marginTop: 'auto' }}>
        <div style={{ background: 'var(--bg-secondary)', borderRadius: '12px', padding: '12px' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {role === 'formateur' ? 'Formateur' : role === 'admin' ? 'Admin' : 'Apprenant'}
          </div>
          <div style={{ fontWeight: '600', fontSize: '13px', color: 'var(--text-primary)' }}>Lamine Gaye</div>
          {role === 'apprenant' && <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>🔥 7 jours streak</div>}
        </div>
      </div>
    </aside>
  )
}
