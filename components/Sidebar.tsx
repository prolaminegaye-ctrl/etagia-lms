'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navApprenant = [
  { href: '/dashboard',              icon: '⊞',  label: 'Dashboard' },
  { href: '/market',                 icon: '🛒',  label: 'Marketplace',     badge: 'NEW' },
  { href: '/cours',                  icon: '◈',   label: 'Mes cours' },
  { href: '/live',                   icon: '🎥',  label: 'Classes en direct', badge: 'LIVE' },
  { href: '/tutor',                  icon: '✦',   label: 'AI Tutor',          badge: 'IA' },
  { href: '/apprenant/adaptive',     icon: '🧠',  label: 'Parcours adaptatif' },
  { href: '/apprenant/diagnostic',   icon: '📋',  label: 'Éval. diagnostic' },
  { href: '/apprenant/satisfaction', icon: '⭐',  label: 'Satisfaction' },
  { href: '/profil',                 icon: '◉',   label: 'Profil' },
  { href: '/apprenant/passbac',      icon: '🎓',  label: "Mon Pass'BAC",      badge: 'BAC' },
  { href: '/guide',                  icon: '📖',  label: 'Guide utilisateur' },
]
const navFormateur = [
  { href: '/formateur',              icon: '⊞',  label: 'Dashboard' },
  { href: '/market',                 icon: '🛒',  label: 'Marketplace',     badge: 'NEW' },
  { href: '/formateur/creer',        icon: '✦',   label: 'Créer un cours',   badge: 'IA' },
  { href: '/formateur/import',       icon: '↑',   label: 'Importer SCORM/H5P' },
  { href: '/formateur/cours',        icon: '◈',   label: 'Mes cours' },
  { href: '/live',                   icon: '🎥',  label: 'Classes en direct', badge: 'LIVE' },
  { href: '/formateur/viewer',       icon: '👁',  label: 'Visualiseur' },
  { href: '/formateur/apprenants',   icon: '◎',   label: 'Apprenants' },
  { href: '/formateur/edugears',     icon: '🤖',  label: 'EduGears AI',       badge: 'IA' },
  { href: '/formateur/stats',        icon: '〜',  label: 'Statistiques' },
  { href: '/formateur/calendrier',   icon: '📅',  label: 'Planning' },
  { href: '/formateur/notes',        icon: '📓',  label: 'Bloc-note' },
  { href: '/guide',                  icon: '📖',  label: 'Guide utilisateur' },
]
const navAdmin = [
  { href: '/admin',                  icon: '⊞',  label: 'Dashboard' },
  { href: '/admin/users',            icon: '◎',   label: 'Utilisateurs' },
  { href: '/admin/cours',            icon: '◈',   label: 'Cours' },
  { href: '/admin/market',           icon: '🏪',  label: 'Marketplace',     badge: 'ADMIN' },
  { href: '/live',                   icon: '🎥',  label: 'Classes en direct', badge: 'LIVE' },
  { href: '/admin/orgs',             icon: '▦',   label: 'Organisations' },
  { href: '/admin/analytics',        icon: '〜',  label: 'Analytics' },
  { href: '/admin/export',           icon: '📊',  label: 'Export CSV' },
  { href: '/admin/white-label',      icon: '🏷',  label: 'White Label',       badge: 'PRO' },
  { href: '/admin/team',             icon: '👥',  label: 'Mon Équipe' },
  { href: '/admin/plugins',          icon: '🔌',  label: 'Plugins & LTI' },
]

const BADGES: Record<string, { bg: string; color: string }> = {
  NEW:   { bg: '#E8EAFF', color: '#4255FF' },
  LIVE:  { bg: '#FFE4E4', color: '#DC2626' },
  IA:    { bg: '#EDE9FE', color: '#6B52D4' },
  BAC:   { bg: '#FEF3C7', color: '#D97706' },
  ADMIN: { bg: '#FFF3EE', color: '#F4591F' },
  PRO:   { bg: '#CCFBDC', color: '#16A34A' },
}

export default function Sidebar({ role = 'apprenant' }: { role?: string }) {
  const path = usePathname()
  const nav = role === 'formateur' ? navFormateur : role === 'admin' ? navAdmin : navApprenant

  return (
    <aside style={{
      width: '248px', minHeight: '100vh',
      background: '#FFFFFF',
      borderRight: '1px solid #D9DBE9',
      display: 'flex', flexDirection: 'column',
      position: 'fixed', top: 0, left: 0, zIndex: 10,
      boxShadow: '2px 0 12px rgba(46,56,86,0.05)',
    }}>

      {/* Logo ETAGIA */}
      <div style={{ padding: '1.25rem 1.25rem 1rem', borderBottom: '1px solid #ECEEF5' }}>
        <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{
            width: '38px', height: '38px', borderRadius: '11px',
            background: 'linear-gradient(135deg, #4255FF 0%, #F4591F 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '18px', flexShrink: 0, boxShadow: '0 2px 8px rgba(66,85,255,0.3)',
          }}>🎓</div>
          <div>
            <div style={{ fontSize: '16px', fontWeight: '900', color: '#2E3856', letterSpacing: '-0.4px' }}>ETAGIA</div>
            <div style={{ fontSize: '9px', color: '#939BB4', letterSpacing: '1.5px', textTransform: 'uppercase', fontWeight: '700' }}>LMS · Afrique</div>
          </div>
        </Link>
      </div>

      {/* Role switcher */}
      <div style={{ padding: '0.75rem 0.875rem', borderBottom: '1px solid #ECEEF5' }}>
        <div style={{ display: 'flex', background: '#F6F7FB', borderRadius: '10px', padding: '3px', gap: '2px' }}>
          {[
            { r: 'apprenant', label: 'Apprenant', href: '/dashboard' },
            { r: 'formateur', label: 'Formateur', href: '/formateur' },
            { r: 'admin',     label: 'Admin',     href: '/admin' },
          ].map(({ r, label, href }) => (
            <Link key={r} href={href} style={{
              flex: 1, textAlign: 'center', padding: '5px 2px', borderRadius: '7px',
              fontSize: '9.5px', fontWeight: '700', transition: 'all .15s', textDecoration: 'none',
              ...(role === r
                ? { background: '#4255FF', color: '#FFFFFF', boxShadow: '0 2px 6px rgba(66,85,255,0.3)' }
                : { color: '#939BB4' }),
            }}>{label}</Link>
          ))}
        </div>
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, padding: '0.625rem 0.75rem', overflowY: 'auto' }}>
        {nav.map(({ href, icon, label, badge }) => {
          const active = path === href || (href !== '/' && path.startsWith(href + '/'))
          const bs = badge ? BADGES[badge] : null
          return (
            <Link key={href} href={href} style={{
              display: 'flex', alignItems: 'center', gap: '9px',
              padding: '8px 10px', borderRadius: '10px', marginBottom: '1px',
              textDecoration: 'none', transition: 'all .15s',
              ...(active
                ? { background: '#E8EAFF', color: '#4255FF' }
                : { color: '#586380' }),
            }}
            onMouseEnter={e => { if (!active) (e.currentTarget as HTMLAnchorElement).style.background = '#F6F7FB' }}
            onMouseLeave={e => { if (!active) (e.currentTarget as HTMLAnchorElement).style.background = 'transparent' }}
            >
              <span style={{ fontSize: '14px', width: '18px', textAlign: 'center', flexShrink: 0 }}>{icon}</span>
              <span style={{ flex: 1, fontSize: '13px', fontWeight: active ? '700' : '500' }}>{label}</span>
              {bs && (
                <span style={{ fontSize: '9px', fontWeight: '700', padding: '2px 7px', borderRadius: '99px', background: bs.bg, color: bs.color, flexShrink: 0 }}>{badge}</span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div style={{ padding: '0.75rem', borderTop: '1px solid #ECEEF5' }}>
        {/* BBB pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '7px 10px', borderRadius: '10px', background: '#CCFBDC', marginBottom: '6px' }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#16A34A', flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '11px', fontWeight: '700', color: '#15803D' }}>BigBlueButton connecté</div>
          </div>
        </div>
        {/* User */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '9px', padding: '8px 10px', borderRadius: '10px', background: '#F6F7FB', cursor: 'pointer' }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #4255FF, #F4591F)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', color: '#fff', fontWeight: '800', flexShrink: 0 }}>L</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '12px', fontWeight: '700', color: '#2E3856', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Lamine Gaye</div>
            <div style={{ fontSize: '10px', color: '#939BB4' }}>Admin</div>
          </div>
          <span style={{ fontSize: '11px', color: '#939BB4' }}>⚙</span>
        </div>
      </div>
    </aside>
  )
}
