'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navApprenant = [
  { href: '/dashboard', icon: '⊞', label: 'Dashboard' },
  { href: '/market', icon: '🛒', label: 'Marketplace', badge: 'NEW' },
  { href: '/cours', icon: '◈', label: 'Mes cours' },
  { href: '/live', icon: '🎥', label: 'Classes en direct', badge: 'LIVE' },
  { href: '/tutor', icon: '✦', label: 'AI Tutor', badge: 'IA' },
  { href: '/apprenant/adaptive', icon: '🧠', label: 'Parcours adaptatif' },
  { href: '/apprenant/diagnostic', icon: '📋', label: 'Éval. diagnostic' },
  { href: '/apprenant/satisfaction', icon: '⭐', label: 'Satisfaction' },
  { href: '/profil', icon: '◉', label: 'Profil' },
  { href: '/apprenant/passbac', icon: '🎓', label: "Mon Pass'BAC", badge: 'BAC' },
  { href: '/guide', icon: '📖', label: 'Guide utilisateur' },
]
const navFormateur = [
  { href: '/formateur', icon: '⊞', label: 'Dashboard' },
  { href: '/market', icon: '🛒', label: 'Marketplace', badge: 'NEW' },
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
  { href: '/guide', icon: '📖', label: 'Guide utilisateur' },
]
const navAdmin = [
  { href: '/admin', icon: '⊞', label: 'Dashboard' },
  { href: '/admin/users', icon: '◎', label: 'Utilisateurs' },
  { href: '/admin/cours', icon: '◈', label: 'Cours' },
  { href: '/admin/market', icon: '🏪', label: 'Marketplace', badge: 'ADMIN' },
  { href: '/live', icon: '🎥', label: 'Classes en direct', badge: 'LIVE' },
  { href: '/admin/orgs', icon: '▦', label: 'Organisations' },
  { href: '/admin/analytics', icon: '〜', label: 'Analytics' },
  { href: '/admin/export', icon: '📊', label: 'Export CSV' },
  { href: '/admin/white-label', icon: '🏷', label: 'White Label', badge: 'PRO' },
  { href: '/admin/team', icon: '👥', label: 'Mon Équipe' },
  { href: '/admin/plugins', icon: '🔌', label: 'Plugins & LTI' },
]

const badgeColors: Record<string, { bg: string; color: string }> = {
  NEW:  { bg: '#EFF6FF', color: '#1565C0' },
  LIVE: { bg: '#FFF0F0', color: '#E53E3E' },
  IA:   { bg: '#F5F3FF', color: '#7C3AED' },
  BAC:  { bg: '#FFFBEB', color: '#D97706' },
  ADMIN:{ bg: '#FFF3EE', color: '#F4591F' },
  PRO:  { bg: '#F0FDF4', color: '#16A34A' },
}

export default function Sidebar({ role = 'apprenant' }: { role?: string }) {
  const path = usePathname()
  const nav = role === 'formateur' ? navFormateur : role === 'admin' ? navAdmin : navApprenant

  return (
    <aside style={{
      width: '248px', minHeight: '100vh',
      background: '#FFFFFF',
      borderRight: '1px solid #E2E8F0',
      display: 'flex', flexDirection: 'column',
      position: 'fixed', top: 0, left: 0, zIndex: 10,
      boxShadow: '1px 0 12px rgba(15,23,42,0.06)',
    }}>

      {/* Logo */}
      <div style={{ padding: '1.25rem 1.25rem 1rem', borderBottom: '1px solid #F1F5F9' }}>
        <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #1565C0 0%, #F4591F 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '16px', flexShrink: 0,
          }}>🎓</div>
          <div>
            <div style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A', letterSpacing: '-0.3px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              ETAGIA
            </div>
            <div style={{ fontSize: '9px', color: '#94A3B8', letterSpacing: '1.5px', textTransform: 'uppercase', fontWeight: '600' }}>
              LMS · Afrique
            </div>
          </div>
        </Link>
      </div>

      {/* Role switcher */}
      <div style={{ padding: '0.75rem 0.875rem', borderBottom: '1px solid #F1F5F9' }}>
        <div style={{ display: 'flex', gap: '3px', background: '#F1F5F9', borderRadius: '10px', padding: '3px' }}>
          {[
            { r: 'apprenant', label: 'Apprenant', href: '/dashboard' },
            { r: 'formateur', label: 'Formateur', href: '/formateur' },
            { r: 'admin',     label: 'Admin',     href: '/admin' },
          ].map(({ r, label, href }) => (
            <Link key={r} href={href} style={{
              flex: 1, textAlign: 'center', padding: '5px 2px', borderRadius: '7px',
              fontSize: '9.5px', fontWeight: '700', transition: 'all .15s',
              textDecoration: 'none',
              ...(role === r
                ? { background: '#FFFFFF', color: '#1565C0', boxShadow: '0 1px 4px rgba(15,23,42,0.08)' }
                : { color: '#94A3B8' }),
            }}>{label}</Link>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '0.75rem 0.75rem', overflowY: 'auto' }}>
        {nav.map(({ href, icon, label, badge }) => {
          const active = path === href || path.startsWith(href + '/')
          const badgeStyle = badge ? badgeColors[badge] : null
          return (
            <Link key={href} href={href} style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '8px 10px', borderRadius: '10px',
              marginBottom: '2px',
              textDecoration: 'none',
              transition: 'all .15s',
              ...(active ? {
                background: '#EFF6FF',
                color: '#1565C0',
              } : {
                color: '#475569',
              }),
            }}
            onMouseEnter={e => { if (!active) (e.currentTarget as HTMLAnchorElement).style.background = '#F8FAFB' }}
            onMouseLeave={e => { if (!active) (e.currentTarget as HTMLAnchorElement).style.background = 'transparent' }}
            >
              <span style={{ fontSize: '14px', width: '18px', textAlign: 'center', flexShrink: 0 }}>{icon}</span>
              <span style={{ flex: 1, fontSize: '13px', fontWeight: active ? '600' : '500' }}>{label}</span>
              {badge && badgeStyle && (
                <span style={{
                  fontSize: '9px', fontWeight: '700', padding: '1px 6px',
                  borderRadius: '99px', flexShrink: 0,
                  background: badgeStyle.bg, color: badgeStyle.color,
                  letterSpacing: '0.3px',
                }}>{badge}</span>
              )}
              {active && (
                <span style={{
                  width: '4px', height: '4px', borderRadius: '50%',
                  background: '#1565C0', flexShrink: 0,
                }} />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div style={{
        padding: '0.875rem 1rem',
        borderTop: '1px solid #F1F5F9',
      }}>
        {/* BBB status */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '8px 10px', borderRadius: '10px',
          background: '#F0FDF4', marginBottom: '8px',
        }}>
          <span style={{ fontSize: '11px' }}>🟢</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '11px', fontWeight: '600', color: '#16A34A' }}>BigBlueButton</div>
            <div style={{ fontSize: '10px', color: '#86EFAC', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Connecté</div>
          </div>
        </div>

        {/* User pill */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '8px 10px', borderRadius: '10px',
          background: '#F8FAFB', cursor: 'pointer',
        }}>
          <div style={{
            width: '30px', height: '30px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #1565C0, #F4591F)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '12px', color: '#FFF', fontWeight: '700', flexShrink: 0,
          }}>L</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Lamine Gaye</div>
            <div style={{ fontSize: '10px', color: '#94A3B8' }}>Admin</div>
          </div>
          <span style={{ fontSize: '10px', color: '#94A3B8' }}>⚙</span>
        </div>
      </div>
    </aside>
  )
}
