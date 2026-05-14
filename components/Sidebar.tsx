'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navApprenant = [
  { href: '/dashboard', icon: '⊞', label: 'Dashboard' },
  { href: '/cours', icon: '◈', label: 'Mes cours' },
  { href: '/tutor', icon: '✦', label: 'AI Tutor', badge: 'IA' },
  { href: '/apprenant/adaptive', icon: '🧠', label: 'Parcours adaptatif' },
  { href: '/apprenant/diagnostic', icon: '📋', label: 'Éval. diagnostic' },
  { href: '/apprenant/satisfaction', icon: '⭐', label: 'Satisfaction' },
  { href: '/profil', icon: '◉', label: 'Profil' },
]
const navFormateur = [
  { href: '/formateur', icon: '⊞', label: 'Dashboard' },
  { href: '/formateur/ia-cours', icon: '✦', label: "Créer avec l'IA", badge: 'NEW' },
  { href: '/formateur/cours', icon: '◈', label: 'Mes cours' },
  { href: '/formateur/import', icon: '↑', label: 'Importer SCORM/H5P' },
  { href: '/formateur/apprenants', icon: '◎', label: 'Apprenants' },
  { href: '/formateur/stats', icon: '〜', label: 'Statistiques' },
]
const navAdmin = [
  { href: '/admin', icon: '⊞', label: 'Dashboard' },
  { href: '/admin/users', icon: '◎', label: 'Utilisateurs' },
  { href: '/admin/cours', icon: '◈', label: 'Cours' },
  { href: '/admin/orgs', icon: '▦', label: 'Organisations' },
  { href: '/admin/analytics', icon: '〜', label: 'Analytics' },
  { href: '/admin/export', icon: '📊', label: 'Export CSV' },
]

export default function Sidebar({ role = 'apprenant' }: { role?: string }) {
  const path = usePathname()
  const nav = role === 'formateur' ? navFormateur : role === 'admin' ? navAdmin : navApprenant

  return (
    <aside style={{
      width: '240px', minHeight: '100vh',
      background: 'linear-gradient(180deg, #0A0F1C 0%, #070B14 100%)',
      borderRight: '1px solid rgba(255,255,255,0.05)',
      display: 'flex', flexDirection: 'column',
      position: 'fixed', top: 0, left: 0, zIndex: 10,
      boxShadow: '4px 0 40px rgba(0,0,0,0.6)'
    }}>
      {/* Logo */}
      <div style={{ padding: '1.25rem 1.25rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <Link href="/dashboard">
          <img src="/logo.svg" alt="ETAGIA LMS" style={{ height: '42px', width: 'auto' }} />
        </Link>
        <div style={{ marginTop: '6px', fontSize: '9px', color: 'rgba(255,255,255,0.2)', letterSpacing: '2px', textTransform: 'uppercase' }}>EdTech · Afrique francophone</div>
      </div>

      {/* Role switcher */}
      <div style={{ padding: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <div style={{ display: 'flex', gap: '2px', background: 'rgba(0,0,0,0.5)', borderRadius: '10px', padding: '3px' }}>
          {[
            { r: 'apprenant', label: 'Apprenant', href: '/dashboard' },
            { r: 'formateur', label: 'Formateur', href: '/formateur' },
            { r: 'admin', label: 'Admin', href: '/admin' },
          ].map(({ r, label, href }) => (
            <Link key={r} href={href} style={{
              flex: 1, textAlign: 'center', padding: '6px 2px', borderRadius: '7px',
              fontSize: '10px', fontWeight: '700', transition: 'all .15s',
              background: role === r ? 'linear-gradient(135deg,#5B8DEF,#22D4A8)' : 'transparent',
              color: role === r ? '#fff' : 'rgba(255,255,255,0.25)',
            }}>{label}</Link>
          ))}
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '0.5rem 0.625rem', overflowY: 'auto' }}>
        <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.15)', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', padding: '8px 10px 4px' }}>Navigation</div>
        {nav.map(item => {
          const active = path === item.href || (item.href.length > 8 && path.startsWith(item.href))
          return (
            <Link key={item.href} href={item.href} style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '9px 10px', borderRadius: '10px', marginBottom: '2px',
              background: active ? 'linear-gradient(135deg,rgba(91,141,239,0.2),rgba(34,212,168,0.08))' : 'transparent',
              color: active ? '#5B8DEF' : 'rgba(255,255,255,0.4)',
              fontSize: '13.5px', fontWeight: active ? '600' : '400',
              transition: 'all .15s',
              borderLeft: active ? '2px solid #5B8DEF' : '2px solid transparent',
            }}>
              <span style={{ fontSize: '15px' }}>{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {(item as any).badge && (
                <span style={{
                  fontSize: '9px', borderRadius: '4px', padding: '2px 5px', fontWeight: '800',
                  background: (item as any).badge === 'NEW' ? 'rgba(240,180,41,0.2)' : 'rgba(34,212,168,0.15)',
                  color: (item as any).badge === 'NEW' ? '#F0B429' : '#22D4A8',
                }}>{(item as any).badge}</span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* User card */}
      <div style={{ padding: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ background: 'linear-gradient(135deg,rgba(91,141,239,0.08),rgba(34,212,168,0.04))', border: '1px solid rgba(91,141,239,0.2)', borderRadius: '12px', padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '34px', height: '34px', borderRadius: '50%', flexShrink: 0, background: 'linear-gradient(135deg,#5B8DEF,#22D4A8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '800', color: '#fff' }}>LG</div>
          <div>
            <div style={{ fontWeight: '600', fontSize: '13px', color: '#F0F4FF' }}>Lamine Gaye</div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.25)', textTransform: 'capitalize' }}>{role}{role === 'apprenant' ? ' · 🔥 7j' : ''}</div>
          </div>
        </div>
      </div>
    </aside>
  )
}
