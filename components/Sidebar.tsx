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
  NEW:   { bg: 'var(--gold-soft)',  color: 'var(--gold)' },
  LIVE:  { bg: 'var(--red-soft)',   color: 'var(--red-deep)' },
  IA:    { bg: 'var(--sage-soft)',  color: 'var(--ink-mut)' },
  BAC:   { bg: 'var(--gold-soft)',  color: 'var(--gold)' },
  ADMIN: { bg: 'var(--red-soft)',   color: 'var(--red-deep)' },
  PRO:   { bg: 'var(--green-soft)', color: 'var(--green)' },
}

export default function Sidebar({ role = 'apprenant' }: { role?: string }) {
  const path = usePathname()
  const nav = role === 'formateur' ? navFormateur : role === 'admin' ? navAdmin : navApprenant

  return (
    <aside style={{
      width: '220px', minHeight: '100vh',
      background: 'var(--card)',
      borderRight: '1px solid var(--line-strong)',
      display: 'flex', flexDirection: 'column',
      position: 'fixed', top: 0, left: 0, zIndex: 10,
    }}>

      {/* Logo */}
      <div style={{ padding: '22px 22px 18px', borderBottom: '1px solid var(--line)' }}>
        <Link href="/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 'var(--r-md)',
            background: 'var(--ink)', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontFamily: 'var(--serif)', fontSize: 20, color: 'var(--paper)', fontWeight: 700, lineHeight: 1 }}>E</span>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--serif)', fontSize: 18, fontWeight: 600, color: 'var(--ink)', letterSpacing: '-0.02em', lineHeight: 1 }}>ETAGIA</div>
            <div style={{ fontFamily: 'var(--sans)', fontSize: 9, color: 'var(--ink-soft)', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 700, marginTop: 3 }}>Académie</div>
          </div>
        </Link>
      </div>

      {/* Role switcher */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--line-hair)' }}>
        <div style={{ display: 'flex', gap: 4 }}>
          {[
            { r: 'apprenant', label: 'Appr.', href: '/dashboard' },
            { r: 'formateur', label: 'Form.',  href: '/formateur' },
            { r: 'admin',     label: 'Admin',  href: '/admin' },
          ].map(({ r, label, href }) => (
            <Link key={r} href={href} style={{
              flex: 1, textAlign: 'center', padding: '6px 4px',
              borderRadius: 'var(--r-xs)',
              fontFamily: 'var(--sans)', fontSize: 10, fontWeight: 700,
              letterSpacing: '0.05em', textTransform: 'uppercase',
              textDecoration: 'none', transition: 'all .15s',
              ...(role === r
                ? { background: 'var(--ink)', color: 'var(--paper)' }
                : { color: 'var(--ink-soft)', background: 'transparent' }),
            }}>{label}</Link>
          ))}
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '8px 0', overflowY: 'auto' }}>
        {nav.map(({ href, label, badge }) => {
          const active = path === href || (href !== '/' && path.startsWith(href + '/'))
          const bs = badge ? BADGE_TONES[badge] : null
          return (
            <Link key={href} href={href} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '10px 22px',
              borderBottom: '1px solid var(--line-hair)',
              textDecoration: 'none', transition: 'background .12s',
              background: active ? 'var(--red-soft)' : 'transparent',
            }}
            onMouseEnter={e => { if (!active) (e.currentTarget as HTMLAnchorElement).style.background = 'var(--card-2)' }}
            onMouseLeave={e => { if (!active) (e.currentTarget as HTMLAnchorElement).style.background = 'transparent' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {active && <span className="dot" />}
                {!active && <span style={{ width: 7, display: 'inline-block' }} />}
                <span style={{
                  fontFamily: 'var(--serif)', fontSize: 14,
                  fontWeight: active ? 600 : 500,
                  color: active ? 'var(--red-deep)' : 'var(--ink-mut)',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase' as const,
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
            width: 32, height: 32, borderRadius: 'var(--r-sm)',
            background: 'var(--ink)', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontFamily: 'var(--serif)', fontSize: 15, color: 'var(--paper)', fontWeight: 600 }}>L</span>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: 'var(--sans)', fontSize: 12, fontWeight: 600, color: 'var(--ink)' }}>Lamine Gaye</div>
            <div style={{ fontFamily: 'var(--sans)', fontSize: 10, color: 'var(--ink-soft)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Admin</div>
          </div>
        </div>
      </div>
    </aside>
  )
}
