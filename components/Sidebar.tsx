'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navApprenant = [
  { href: '/dashboard', icon: '⊞', label: 'Dashboard' },
  { href: '/cours', icon: '◈', label: 'Mes cours' },
  { href: '/live', icon: '🎥', label: 'Classes en direct', badge: 'LIVE' },
  { href: '/tutor', icon: '✦', label: 'AI Tutor', badge: 'IA' },
  { href: '/apprenant/adaptive', icon: '🧠', label: 'Parcours adaptatif' },
  { href: '/apprenant/diagnostic', icon: '📋', label: 'Éval. diagnostic' },
  { href: '/apprenant/satisfaction', icon: '⭐', label: 'Satisfaction' },
  { href: '/profil', icon: '◉', label: 'Profil' },
]
const navFormateur = [
  { href: '/formateur', icon: '⊞', label: 'Dashboard' },
  { href: '/formateur/creer', icon: '✦', label: 'Créer un cours', badge: 'IA' },
  { href: '/formateur/import', icon: '↑', label: 'Importer SCORM/H5P' },
  { href: '/formateur/cours', icon: '◈', label: 'Mes cours' },
  { href: '/live', icon: '🎥', label: 'Classes en direct', badge: 'LIVE' },
  { href: '/formateur/viewer', icon: '👁', label: 'Visualiseur' },
  { href: '/formateur/apprenants', icon: '◎', label: 'Apprenants' },
  { href: '/formateur/edugears', icon: '🤖', label: 'EduGears AI', badge: 'IA' },
  { href: '/formateur/stats', icon: '〜', label: 'Statistiques' },
  { href: '/formateur/calendrier', icon: '📅', label: 'Planning' },
  { href: '/formateur/notes', icon: '📓', label: 'Bloc-note' },
]
const navAdmin = [
  { href: '/admin', icon: '⊞', label: 'Dashboard' },
  { href: '/admin/users', icon: '◎', label: 'Utilisateurs' },
  { href: '/admin/cours', icon: '◈', label: 'Cours' },
  { href: '/live', icon: '🎥', label: 'Classes en direct', badge: 'LIVE' },
  { href: '/admin/orgs', icon: '▦', label: 'Organisations' },
  { href: '/admin/analytics', icon: '〜', label: 'Analytics' },
  { href: '/admin/export', icon: '📊', label: 'Export CSV' },
  { href: '/admin/white-label', icon: '🏷', label: 'White Label', badge: 'PRO' },
  { href: '/admin/plugins', icon: '🔌', label: 'Plugins & LTI' },
]

export default function Sidebar({ role = 'apprenant' }: { role?: string }) {
  const path = usePathname()
  const nav = role === 'formateur' ? navFormateur : role === 'admin' ? navAdmin : navApprenant

  return (
    <aside style={{
      width: '248px', minHeight: '100vh',
      background: 'linear-gradient(180deg,#12100E 0%,#1C1714 100%)',
      borderRight: '1px solid rgba(255,255,255,0.06)',
      display: 'flex', flexDirection: 'column',
      position: 'fixed', top: 0, left: 0, zIndex: 10,
      boxShadow: '4px 0 24px rgba(0,0,0,0.18)'
    }}>
      {/* Logo */}
      <div style={{ padding: '1.25rem 1.25rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <Link href="/dashboard">
          <img src="/logo.svg" alt="ETAGIA LMS" style={{ height: '44px', width: 'auto' }} />
        </Link>
        <div style={{ marginTop: '6px', fontSize: '9px', color: 'rgba(245,240,232,0.30)', letterSpacing: '2px', textTransform: 'uppercase' }}>
          EdTech · Afrique francophone
        </div>
      </div>

      {/* Role switcher */}
      <div style={{ padding: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <div style={{ display: 'flex', gap: '2px', background: 'rgba(255,255,255,0.06)', borderRadius: '10px', padding: '3px' }}>
          {[
            { r: 'apprenant', label: 'Apprenant', href: '/dashboard' },
            { r: 'formateur', label: 'Formateur', href: '/formateur' },
            { r: 'admin',     label: 'Admin',     href: '/admin' },
          ].map(({ r, label, href }) => (
            <Link key={r} href={href} style={{
              flex: 1, textAlign: 'center', padding: '6px 2px', borderRadius: '7px',
              fontSize: '10px', fontWeight: '700', transition: 'all .15s',
              background: role === r ? 'linear-gradient(135deg,#E8651A,#D4A017)' : 'transparent',
              color: role === r ? '#fff' : 'rgba(245,240,232,0.40)',
              textDecoration: 'none',
            }}>{label}</Link>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '0.5rem 0.625rem', overflowY: 'auto' }}>
        <div style={{ fontSize: '9px', color: 'rgba(245,240,232,0.25)', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', padding: '8px 10px 4px' }}>
          Navigation
        </div>
        {nav.map(item => {
          const active = path === item.href || (item.href.length > 8 && path.startsWith(item.href))
          const isLive = (item as any).badge === 'LIVE'
          return (
            <Link key={item.href} href={item.href} style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '9px 10px', borderRadius: '10px', marginBottom: '2px',
              background: active ? 'rgba(232,101,26,0.14)' : 'transparent',
              color: active ? '#EB7035' : 'rgba(245,240,232,0.55)',
              fontSize: '13.5px', fontWeight: active ? '700' : '400',
              transition: 'all .15s',
              borderLeft: active ? '2.5px solid #E8651A' : '2.5px solid transparent',
              textDecoration: 'none',
            }}>
              <span style={{ fontSize: '15px' }}>{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {(item as any).badge && (
                <span style={{
                  fontSize: '9px', borderRadius: '4px', padding: '2px 5px', fontWeight: '800',
                  background: isLive
                    ? (active ? 'rgba(239,68,68,0.25)' : 'rgba(239,68,68,0.15)')
                    : (active ? 'rgba(232,101,26,0.25)' : 'rgba(232,101,26,0.15)'),
                  color: isLive ? '#EF4444' : '#E8651A',
                }}>
                  {isLive && active ? '● ' : ''}{(item as any).badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Streak banner */}
      <div style={{ margin: '0 0.625rem 0.5rem', padding: '8px 12px', borderRadius: '10px',
        background: 'rgba(232,101,26,0.12)', border: '1px solid rgba(232,101,26,0.20)',
        display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '16px' }}>🔥</span>
        <div>
          <div style={{ fontSize: '11px', fontWeight: '800', color: '#EB7035' }}>7 jours de streak !</div>
          <div style={{ fontSize: '10px', color: 'rgba(245,240,232,0.40)' }}>Continuez comme ça</div>
        </div>
      </div>

      {/* User card */}
      <div style={{ padding: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '12px', padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '34px', height: '34px', borderRadius: '50%', flexShrink: 0, position: 'relative',
            background: 'linear-gradient(135deg,#E8651A,#D4A017)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '13px', fontWeight: '800', color: '#fff' }}>
            LG
            <div style={{ position: 'absolute', bottom: 0, right: 0, width: '9px', height: '9px',
              borderRadius: '50%', background: '#4ADE80', border: '2px solid #12100E' }} />
          </div>
          <div>
            <div style={{ fontWeight: '600', fontSize: '13px', color: 'rgba(245,240,232,0.92)' }}>Lamine Gaye</div>
            <div style={{ fontSize: '11px', color: 'rgba(245,240,232,0.35)', textTransform: 'capitalize' }}>
              {role}
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
