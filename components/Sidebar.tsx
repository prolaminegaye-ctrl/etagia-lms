'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navApprenant = [
  { href: '/dashboard', icon: '▦', label: 'Dashboard' },
  { href: '/cours', icon: '◈', label: 'Mes cours' },
  { href: '/tutor', icon: '✦', label: 'AI Tutor', badge: 'IA' },
  { href: '/apprenant/adaptive', icon: '🧠', label: 'Parcours adaptatif' },
  { href: '/apprenant/diagnostic', icon: '📋', label: 'Évaluation diago.' },
  { href: '/apprenant/satisfaction', icon: '⭐', label: 'Satisfaction' },
  { href: '/profil', icon: '◉', label: 'Profil' },
]
const navFormateur = [
  { href: '/formateur', icon: '▦', label: 'Dashboard' },
  { href: '/formateur/ia-cours', icon: '✦', label: 'Créer avec l\'IA', badge: 'NEW' },
  { href: '/formateur/cours', icon: '◈', label: 'Mes cours' },
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
  { href: '/admin/export', icon: '📊', label: 'Export CSV' },
]

export default function Sidebar({ role = 'apprenant' }: { role?: string }) {
  const path = usePathname()
  const nav = role === 'formateur' ? navFormateur : role === 'admin' ? navAdmin : navApprenant

  return (
    <aside style={{
      width: '240px', minHeight: '100vh',
      background: '#0A0F1C',
      borderRight: '1px solid rgba(255,255,255,0.06)',
      display: 'flex', flexDirection: 'column',
      padding: '0', flexShrink: 0,
      position: 'fixed', top: 0, left: 0, zIndex: 10,
      boxShadow: '4px 0 32px rgba(0,0,0,0.5)'
    }}>
      {/* Logo */}
      <div style={{ padding: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <Link href="/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="/logo.png" alt="ETAGIA" style={{ height: '38px', width: 'auto' }} />
        </Link>
        <div style={{ marginTop: '6px', fontSize: '10px', color: 'rgba(255,255,255,0.25)', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
          EdTech · Afrique francophone
        </div>
      </div>

      {/* Role switcher */}
      <div style={{ padding: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <div style={{ display: 'flex', gap: '3px', background: 'rgba(0,0,0,0.4)', borderRadius: '10px', padding: '3px' }}>
          {[
            { r: 'apprenant', label: 'Apprenant', href: '/dashboard' },
            { r: 'formateur', label: 'Formateur', href: '/formateur' },
            { r: 'admin', label: 'Admin', href: '/admin' },
          ].map(({ r, label, href }) => (
            <Link key={r} href={href} style={{
              flex: 1, textAlign: 'center', padding: '6px 3px', borderRadius: '7px',
              fontSize: '10px', fontWeight: '700', textDecoration: 'none', transition: 'all .15s',
              background: role === r ? 'linear-gradient(135deg, #5B8DEF 0%, #22D4A8 100%)' : 'transparent',
              color: role === r ? '#fff' : 'rgba(255,255,255,0.3)',
            }}>{label}</Link>
          ))}
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '0.5rem 0.625rem', overflowY: 'auto' }}>
        <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.2)', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', padding: '10px 10px 4px' }}>
          Navigation
        </div>
        {nav.map(item => {
          const active = path === item.href || (item.href.length > 8 && path.startsWith(item.href))
          return (
            <Link key={item.href} href={item.href} style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '9px 10px', borderRadius: '10px', marginBottom: '2px',
              background: active ? 'rgba(91,141,239,0.15)' : 'transparent',
              color: active ? '#5B8DEF' : 'rgba(255,255,255,0.45)',
              textDecoration: 'none', fontSize: '13.5px', fontWeight: active ? '600' : '400',
              transition: 'all .15s',
              borderLeft: active ? '2px solid #5B8DEF' : '2px solid transparent',
            }}>
              <span style={{ fontSize: '15px', opacity: active ? 1 : 0.6 }}>{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {(item as any).badge && (
                <span style={{
                  fontSize: '9px',
                  background: (item as any).badge === 'NEW' ? 'rgba(240,180,41,0.2)' : 'rgba(34,212,168,0.15)',
                  color: (item as any).badge === 'NEW' ? '#F0B429' : '#22D4A8',
                  borderRadius: '4px', padding: '2px 5px', fontWeight: '800', letterSpacing: '0.5px'
                }}>{(item as any).badge}</span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* User */}
      <div style={{ padding: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '34px', height: '34px', borderRadius: '50%', flexShrink: 0, background: 'linear-gradient(135deg, #5B8DEF 0%, #22D4A8 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '800', color: '#fff', fontFamily: 'var(--font-display)' }}>LG</div>
          <div>
            <div style={{ fontWeight: '600', fontSize: '13px', color: '#E8EEFF' }}>Lamine Gaye</div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.25)', textTransform: 'capitalize' }}>{role}{role === 'apprenant' ? ' · 🔥 7j streak' : ''}</div>
          </div>
        </div>
      </div>
    </aside>
  )
}
