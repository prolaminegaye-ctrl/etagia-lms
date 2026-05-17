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
  { href: '/formateur/creer', icon: '✦', label: "Créer un cours", badge: 'IA' },
  { href: '/formateur/import', icon: '↑', label: 'Importer SCORM/H5P' },
  { href: '/formateur/cours', icon: '◈', label: 'Mes cours' },
  { href: '/formateur/viewer', icon: '👁', label: 'Visualiseur' },
  { href: '/formateur/apprenants', icon: '◎', label: 'Apprenants' },
  { href: '/formateur/edugears', icon: '🤖', label: 'EduGears AI', badge: 'IA' },
  { href: '/formateur/stats', icon: '〜', label: 'Statistiques' },
]
const navAdmin = [
  { href: '/admin', icon: '⊞', label: 'Dashboard' },
  { href: '/admin/users', icon: '◎', label: 'Utilisateurs' },
  { href: '/admin/cours', icon: '◈', label: 'Cours' },
  { href: '/admin/orgs', icon: '▦', label: 'Organisations' },
  { href: '/admin/analytics', icon: '〜', label: 'Analytics' },
  { href: '/admin/export', icon: '📊', label: 'Export CSV' },
  { href: '/admin/plugins', icon: '🔌', label: 'Plugins & LTI' },
]

export default function Sidebar({ role = 'apprenant' }: { role?: string }) {
  const path = usePathname()
  const nav = role === 'formateur' ? navFormateur : role === 'admin' ? navAdmin : navApprenant

  return (
    <aside style={{
      width: '240px', minHeight: '100vh',
      background: '#FFFFFF',
      borderRight: '1px solid rgba(107,78,255,0.10)',
      display: 'flex', flexDirection: 'column',
      position: 'fixed', top: 0, left: 0, zIndex: 10,
      boxShadow: '2px 0 20px rgba(107,78,255,0.06)'
    }}>
      <div style={{ padding: '1.25rem', borderBottom: '1px solid rgba(107,78,255,0.08)' }}>
        <Link href="/dashboard">
          <img src="/logo.svg" alt="ETAGIA LMS" style={{ height: '42px', width: 'auto' }} />
        </Link>
        <div style={{ marginTop: '6px', fontSize: '9px', color: '#C0B8E0', letterSpacing: '2px', textTransform: 'uppercase' }}>EdTech · Afrique francophone</div>
      </div>

      <div style={{ padding: '0.75rem', borderBottom: '1px solid rgba(107,78,255,0.06)' }}>
        <div style={{ display: 'flex', gap: '2px', background: '#F4F2FF', borderRadius: '10px', padding: '3px' }}>
          {[
            { r: 'apprenant', label: 'Apprenant', href: '/dashboard' },
            { r: 'formateur', label: 'Formateur', href: '/formateur' },
            { r: 'admin', label: 'Admin', href: '/admin' },
          ].map(({ r, label, href }) => (
            <Link key={r} href={href} style={{
              flex: 1, textAlign: 'center', padding: '6px 2px', borderRadius: '7px',
              fontSize: '10px', fontWeight: '700', transition: 'all .15s',
              background: role === r ? 'linear-gradient(135deg,#6B4EFF,#D63384)' : 'transparent',
              color: role === r ? '#fff' : '#9B8EC0',
              textDecoration: 'none',
            }}>{label}</Link>
          ))}
        </div>
      </div>

      <nav style={{ flex: 1, padding: '0.5rem 0.625rem', overflowY: 'auto' }}>
        <div style={{ fontSize: '9px', color: '#C0B8E0', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', padding: '8px 10px 4px' }}>Navigation</div>
        {nav.map(item => {
          const active = path === item.href || (item.href.length > 8 && path.startsWith(item.href))
          return (
            <Link key={item.href} href={item.href} style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '9px 10px', borderRadius: '10px', marginBottom: '2px',
              background: active ? '#EBE7FF' : 'transparent',
              color: active ? '#6B4EFF' : '#6B5EA8',
              fontSize: '13.5px', fontWeight: active ? '600' : '400',
              transition: 'all .15s',
              borderLeft: active ? '2px solid #6B4EFF' : '2px solid transparent',
              textDecoration: 'none',
            }}>
              <span style={{ fontSize: '15px' }}>{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {(item as any).badge && (
                <span style={{ fontSize: '9px', borderRadius: '4px', padding: '2px 5px', fontWeight: '800', background: active ? 'rgba(107,78,255,0.15)' : '#EBE7FF', color: '#6B4EFF' }}>{(item as any).badge}</span>
              )}
            </Link>
          )
        })}
      </nav>

      <div style={{ padding: '0.75rem', borderTop: '1px solid rgba(107,78,255,0.08)' }}>
        <div style={{ background: '#F4F2FF', border: '1px solid rgba(107,78,255,0.12)', borderRadius: '12px', padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '34px', height: '34px', borderRadius: '50%', flexShrink: 0, background: 'linear-gradient(135deg,#6B4EFF,#D63384)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '800', color: '#fff' }}>LG</div>
          <div>
            <div style={{ fontWeight: '600', fontSize: '13px', color: '#1A1550' }}>Lamine Gaye</div>
            <div style={{ fontSize: '11px', color: '#9B8EC0', textTransform: 'capitalize' }}>{role}{role === 'apprenant' ? ' · 🔥 7j' : ''}</div>
          </div>
        </div>
      </div>
    </aside>
  )
}
