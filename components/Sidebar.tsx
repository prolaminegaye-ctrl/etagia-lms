'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navApprenant = [
  { href: '/dashboard',              label: 'Tableau de bord' },
  { href: '/market',                 label: 'Marketplace',        badge: 'NEW' },
  { href: '/cours',                  label: 'Mes cours' },
  { href: '/live',                   label: 'Classes en direct',  badge: 'LIVE' },
  { href: '/tutor',                  label: 'AI Tutor',           badge: 'IA' },
  { href: '/apprenant/adaptive',     label: 'Parcours adaptatif' },
  { href: '/apprenant/diagnostic',   label: 'Éval. diagnostic' },
  { href: '/apprenant/satisfaction', label: 'Satisfaction' },
  { href: '/profil',                 label: 'Profil' },
  { href: '/apprenant/passbac',      label: "Mon Pass'BAC",       badge: 'BAC' },
  { href: '/guide',                  label: 'Guide utilisateur' },
]
const navFormateur = [
  { href: '/formateur',              label: 'Dashboard' },
  { href: '/market',                 label: 'Marketplace',        badge: 'NEW' },
  { href: '/formateur/creer',        label: 'Créer un cours',     badge: 'IA' },
  { href: '/formateur/import',       label: 'Importer SCORM/H5P' },
  { href: '/formateur/cours',        label: 'Mes cours' },
  { href: '/live',                   label: 'Classes en direct',  badge: 'LIVE' },
  { href: '/formateur/viewer',       label: 'Visualiseur' },
  { href: '/formateur/apprenants',   label: 'Apprenants' },
  { href: '/formateur/edugears',     label: 'EduGears AI',        badge: 'IA' },
  { href: '/formateur/stats',        label: 'Statistiques' },
  { href: '/formateur/calendrier',   label: 'Planning' },
  { href: '/formateur/notes',        label: 'Bloc-note' },
  { href: '/guide',                  label: 'Guide' },
]
const navAdmin = [
  { href: '/admin',                  label: 'Dashboard' },
  { href: '/admin/users',            label: 'Utilisateurs' },
  { href: '/admin/cours',            label: 'Cours' },
  { href: '/admin/market',           label: 'Marketplace',        badge: 'ADMIN' },
  { href: '/live',                   label: 'Classes en direct',  badge: 'LIVE' },
  { href: '/admin/orgs',             label: 'Organisations' },
  { href: '/admin/analytics',        label: 'Analytics' },
  { href: '/admin/export',           label: 'Export CSV' },
  { href: '/admin/white-label',      label: 'White Label',        badge: 'PRO' },
  { href: '/admin/team',             label: 'Mon Équipe' },
  { href: '/admin/plugins',          label: 'Plugins & LTI' },
]

const BADGE_TONES: Record<string, { bg: string; color: string }> = {
  NEW:   { bg: 'var(--gold-50)',   color: 'var(--gold-700)' },
  LIVE:  { bg: 'var(--orange-50)', color: 'var(--orange-700)' },
  IA:    { bg: 'var(--turq-50)',   color: 'var(--turq-700)' },
  BAC:   { bg: 'var(--violet-50)', color: 'var(--violet-700)' },
  ADMIN: { bg: 'var(--orange-50)', color: 'var(--orange-700)' },
  PRO:   { bg: 'var(--gold-50)',   color: 'var(--gold-700)' },
}

const LogoSVG = () => (
  <svg viewBox="0 0 64 64" width="40" height="40" role="img" aria-label="EtagIA" style={{ flexShrink: 0 }}>
    <defs>
      <linearGradient id="eg-sig" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0"   stopColor="#F9C75A"/>
        <stop offset=".5"  stopColor="#F0894A"/>
        <stop offset="1"   stopColor="#DD5E3A"/>
      </linearGradient>
    </defs>
    <rect width="64" height="64" rx="18" fill="url(#eg-sig)"/>
    <g fill="#fff">
      <rect x="16" y="20" width="7"  height="28" rx="3.5"/>
      <rect x="16" y="20" width="25" height="7"  rx="3.5"/>
      <rect x="16" y="30.5" width="19" height="7" rx="3.5"/>
      <rect x="16" y="41" width="25" height="7"  rx="3.5"/>
    </g>
    <g fill="#fff" stroke="#fff">
      <circle cx="47" cy="16" r="4.2" stroke="none"/>
      <g strokeWidth="2.2" strokeLinecap="round">
        <line x1="47" y1="6"    x2="47" y2="8.4"/>
        <line x1="47" y1="23.6" x2="47" y2="26"/>
        <line x1="37.4" y1="16" x2="39.8" y2="16"/>
        <line x1="54.2" y1="16" x2="56.6" y2="16"/>
        <line x1="40.2" y1="9.2"  x2="41.9" y2="10.9"/>
        <line x1="52.1" y1="21.1" x2="53.8" y2="22.8"/>
        <line x1="53.8" y1="9.2"  x2="52.1" y2="10.9"/>
        <line x1="41.9" y1="21.1" x2="40.2" y2="22.8"/>
      </g>
    </g>
  </svg>
)

export default function Sidebar({ role = 'apprenant' }: { role?: string }) {
  const path = usePathname()
  const nav = role === 'formateur' ? navFormateur : role === 'admin' ? navAdmin : navApprenant

  return (
    <aside style={{
      width: '224px', minHeight: '100vh',
      background: 'var(--surface)',
      borderRight: '1px solid rgba(42,33,24,.12)',
      display: 'flex', flexDirection: 'column',
      position: 'fixed', top: 0, left: 0, zIndex: 10,
    }}>

      {/* Logo */}
      <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid var(--line)' }}>
        <Link href="/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12 }}>
          <LogoSVG />
          <div>
            <div style={{
              fontFamily: 'var(--serif)', fontSize: 20, fontWeight: 600,
              color: 'var(--ink)', letterSpacing: '-0.03em', lineHeight: 1,
            }}>EtagIA</div>
            <div style={{
              fontFamily: 'var(--sans)', fontSize: 9, color: 'var(--ink-soft)',
              letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 800, marginTop: 3,
            }}>ACADÉMIE</div>
          </div>
        </Link>
      </div>

      {/* Role switcher */}
      <div style={{ padding: '10px 14px', borderBottom: '1px solid rgba(42,33,24,.05)' }}>
        <div style={{ display: 'flex', gap: 3, background: 'var(--surface-2)', borderRadius: 'var(--r-sm)', padding: '3px' }}>
          {[
            { r: 'apprenant', label: 'Appr.', href: '/dashboard' },
            { r: 'formateur', label: 'Form.',  href: '/formateur' },
            { r: 'admin',     label: 'Admin',  href: '/admin' },
          ].map(({ r, label, href }) => (
            <Link key={r} href={href} style={{
              flex: 1, textAlign: 'center', padding: '5px 4px',
              borderRadius: 'var(--r-xs)',
              fontFamily: 'var(--sans)', fontSize: 10, fontWeight: 700,
              letterSpacing: '0.05em', textTransform: 'uppercase',
              textDecoration: 'none', transition: 'all .15s',
              ...(role === r
                ? { background: 'var(--grad-signature)', color: '#fff', boxShadow: '0 2px 6px rgba(240,137,74,.30)' }
                : { color: 'var(--ink-soft)', background: 'transparent' }),
            }}>{label}</Link>
          ))}
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '6px 0', overflowY: 'auto' }}>
        {nav.map(({ href, label, badge }) => {
          const active = path === href || (href !== '/' && path.startsWith(href + '/'))
          const bs = badge ? BADGE_TONES[badge] : null
          return (
            <Link key={href} href={href} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '9px 20px',
              borderBottom: '1px solid rgba(42,33,24,.04)',
              textDecoration: 'none', transition: 'background .12s',
              background: active ? 'var(--gold-50)' : 'transparent',
            }}
            onMouseEnter={e => { if (!active) (e.currentTarget as HTMLAnchorElement).style.background = 'var(--surface-2)' }}
            onMouseLeave={e => { if (!active) (e.currentTarget as HTMLAnchorElement).style.background = 'transparent' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                {active
                  ? <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--orange)', flexShrink: 0, display: 'inline-block' }} />
                  : <span style={{ width: 7, display: 'inline-block' }} />
                }
                <span style={{
                  fontFamily: 'var(--sans)', fontSize: 13,
                  fontWeight: active ? 700 : 500,
                  color: active ? 'var(--gold-700)' : 'var(--ink-mut)',
                  letterSpacing: active ? '0.01em' : '0',
                }}>{label}</span>
              </div>
              {bs && (
                <span style={{
                  fontSize: 9, fontWeight: 700, padding: '3px 7px',
                  borderRadius: 999, background: bs.bg, color: bs.color,
                  letterSpacing: '0.04em',
                }}>{badge}</span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer user */}
      <div style={{ padding: '14px 16px', borderTop: '1px solid var(--line)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 'var(--r-sm)',
            background: 'var(--grad-energie)', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(244,176,30,.3)',
          }}>
            <span style={{ fontFamily: 'var(--serif)', fontSize: 16, color: '#fff', fontWeight: 700 }}>L</span>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: 'var(--sans)', fontSize: 12, fontWeight: 700, color: 'var(--ink)' }}>Lamine Gaye</div>
            <div style={{ fontFamily: 'var(--sans)', fontSize: 10, color: 'var(--gold-700)', letterSpacing: '0.07em', textTransform: 'uppercase', fontWeight: 700 }}>Admin</div>
          </div>
        </div>
      </div>
    </aside>
  )
}
