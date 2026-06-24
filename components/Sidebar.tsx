'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

/* ─────────────────────────────────────────────
   ETAGIA Sidebar — Design système chaud
   Or · Orange · Turquoise · Fond crème
   ───────────────────────────────────────────── */

const navApprenant = [
  { href: '/dashboard',                icon: '⊞',  label: 'Dashboard' },
  { href: '/cours',                    icon: '◈',  label: 'Mes cours' },
  { href: '/tutor',                    icon: '✦',  label: 'AI Tutor',           badge: 'IA',   badgeColor: '#0FB6CC' },
  { href: '/apprenant/khan-academy',   icon: '🎓', label: 'Khan Academy',       badge: '🆓' },
  { href: '/apprenant/passbac',        icon: '🏆', label: 'Mon Pass Bac' },
  { href: '/apprenant/adaptive',       icon: '🧠', label: 'Parcours adaptatif' },
  { href: '/apprenant/diagnostic',     icon: '📋', label: 'Éval. diagnostic' },
  { href: '/live',                     icon: '📡', label: 'Visio / Live',        badge: 'LIVE', badgeColor: '#C94908' },
  { href: '/market',                   icon: '🛒', label: 'Marketplace' },
  { href: '/apprenant/satisfaction',   icon: '⭐', label: 'Satisfaction' },
  { href: '/profil',                   icon: '◉',  label: 'Profil' },
]

const navFormateur = [
  { href: '/formateur',                icon: '⊞',  label: 'Dashboard' },
  { href: '/formateur/creer',          icon: '✦',  label: 'Créer un cours',     badge: 'IA',   badgeColor: '#0FB6CC' },
  { href: '/formateur/import',         icon: '↑',  label: 'Importer SCORM/H5P' },
  { href: '/formateur/cours',          icon: '◈',  label: 'Mes cours' },
  { href: '/formateur/viewer',         icon: '👁',  label: 'Visualiseur' },
  { href: '/formateur/calendrier',     icon: '📅', label: 'Calendrier' },
  { href: '/formateur/apprenants',     icon: '◎',  label: 'Apprenants' },
  { href: '/formateur/edugears',       icon: '🤖', label: 'EduGears AI',        badge: 'IA',   badgeColor: '#0FB6CC' },
  { href: '/formateur/khan-academy',   icon: '🎓', label: 'Khan Academy',       badge: '🆓' },
  { href: '/formateur/notes',          icon: '📝', label: 'Notes de cours' },
  { href: '/formateur/stats',          icon: '〜', label: 'Statistiques' },
]

const navAdmin = [
  { href: '/admin',              icon: '⊞',  label: 'Dashboard' },
  { href: '/admin/users',        icon: '◎',  label: 'Utilisateurs' },
  { href: '/admin/cours',        icon: '◈',  label: 'Cours' },
  { href: '/admin/orgs',         icon: '▦',  label: 'Organisations' },
  { href: '/admin/crm',          icon: '🤝', label: 'CRM' },
  { href: '/admin/market',       icon: '🛒', label: 'Marketplace' },
  { href: '/admin/analytics',    icon: '〜', label: 'Analytics' },
  { href: '/admin/revenus',      icon: '📈', label: 'Revenus' },
  { href: '/admin/factures',     icon: '💰', label: 'Facturation' },
  { href: '/admin/team',         icon: '👥', label: 'Équipe' },
  { href: '/admin/export',       icon: '📊', label: 'Export CSV' },
  { href: '/admin/plugins',      icon: '🔌', label: 'Plugins & LTI' },
  { href: '/admin/white-label',  icon: '🎨', label: 'White Label' },
]

/* ── Couleurs rôles — système chaud ETAGIA ── */
const ROLE_META: Record<string, { color: string; bg: string; label: string; href: string }> = {
  apprenant: { color: '#C28705', bg: 'linear-gradient(125deg,#F6B829 0%,#F0894A 52%,#DD5E3A 100%)', label: 'Apprenant', href: '/dashboard' },
  formateur: { color: '#0A8797', bg: 'linear-gradient(118deg,#0FB6CC 0%,#16C4BC 52%,#12A596 100%)', label: 'Formateur', href: '/formateur' },
  admin:     { color: '#C94908', bg: 'linear-gradient(118deg,#FB6514 0%,#C94908 100%)',              label: 'Admin',     href: '/admin' },
}

export default function Sidebar({ role = 'apprenant' }: { role?: string }) {
  const path = usePathname()
  const nav  = role === 'formateur' ? navFormateur : role === 'admin' ? navAdmin : navApprenant
  const meta = ROLE_META[role] ?? ROLE_META.apprenant

  return (
    <aside style={{
      width: '220px',
      minHeight: '100vh',
      background: '#FFFFFF',
      borderRight: '1px solid rgba(42,33,24,.10)',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      top: 0, left: 0,
      zIndex: 10,
      boxShadow: '2px 0 16px rgba(74,48,28,.06)',
    }}>

      {/* ── Logo ── */}
      <div style={{ padding: '1.1rem 1rem .85rem', borderBottom: '1px solid rgba(42,33,24,.07)' }}>
        <Link href="/dashboard" style={{ textDecoration: 'none', display: 'block' }}>
          <div style={{
            fontFamily: "'Unbounded', sans-serif",
            fontWeight: '800',
            fontSize: '17px',
            background: 'linear-gradient(125deg,#F6B829 0%,#F0894A 52%,#DD5E3A 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '-0.03em',
            lineHeight: 1,
          }}>
            ETAGIA<span style={{ WebkitTextFillColor: '#2A2118', color: '#2A2118' }}>.</span>
          </div>
          <div style={{
            fontFamily: "'Hanken Grotesk', sans-serif",
            fontWeight: '600',
            fontSize: '8.5px',
            color: '#AB9E8C',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            marginTop: '3px',
          }}>
            Académie · EdTech Afrique
          </div>
        </Link>
      </div>

      {/* ── Sélecteur de rôle ── */}
      <div style={{ padding: '10px 10px 8px', borderBottom: '1px solid rgba(42,33,24,.07)' }}>
        <div style={{
          display: 'flex', gap: '2px',
          background: '#F5EEDF',
          borderRadius: '10px',
          padding: '3px',
          border: '1px solid rgba(42,33,24,.10)',
        }}>
          {Object.entries(ROLE_META).map(([r, m]) => (
            <Link key={r} href={m.href} style={{
              flex: 1,
              textAlign: 'center',
              padding: '5px 2px',
              borderRadius: '7px',
              fontSize: '9px',
              fontWeight: '700',
              fontFamily: "'Hanken Grotesk', sans-serif",
              letterSpacing: '0.01em',
              transition: 'all .15s',
              background: role === r ? m.bg : 'transparent',
              color: role === r ? '#FFFFFF' : '#6E6155',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              boxShadow: role === r ? '0 1px 4px rgba(74,48,28,.18)' : 'none',
            }}>
              {m.label}
            </Link>
          ))}
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav style={{ flex: 1, padding: '8px', overflowY: 'auto' }}>
        <div style={{
          fontSize: '8.5px',
          color: '#AB9E8C',
          fontWeight: '700',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          fontFamily: "'Hanken Grotesk', sans-serif",
          padding: '4px 8px 6px',
        }}>
          Navigation
        </div>

        {nav.map((item: any) => {
          const active = path === item.href || (item.href.length > 8 && path.startsWith(item.href))
          return (
            <Link key={item.href} href={item.href} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '9px',
              padding: '7px 10px',
              borderRadius: '9px',
              marginBottom: '1px',
              background: active ? '#FFF7E2' : 'transparent',
              color:      active ? '#C28705' : '#6E6155',
              fontSize:   '12.5px',
              fontFamily: "'Hanken Grotesk', sans-serif",
              fontWeight: active ? '600' : '400',
              transition: 'all .15s',
              textDecoration: 'none',
              borderLeft: active ? '3px solid #F4B01E' : '3px solid transparent',
            }}
            onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = '#FAF6EE' }}
            onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
            >
              <span style={{ fontSize: '14px', flexShrink: 0, lineHeight: 1 }}>{item.icon}</span>
              <span style={{ flex: 1, lineHeight: 1.3 }}>{item.label}</span>
              {item.badge && (
                <span style={{
                  fontSize: '8px',
                  borderRadius: '20px',
                  padding: '2px 5px',
                  fontWeight: '800',
                  background: active
                    ? (item.badgeColor ?? '#C28705')
                    : (item.badgeColor ? item.badgeColor + '22' : '#FFF7E2'),
                  color: active ? '#FFFFFF' : (item.badgeColor ?? '#C28705'),
                  border: `1px solid ${item.badgeColor ?? '#F4B01E'}44`,
                  letterSpacing: '0.04em',
                }}>
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* ── Profil utilisateur ── */}
      <div style={{ padding: '10px', borderTop: '1px solid rgba(42,33,24,.08)' }}>
        <div style={{
          background: '#FAF6EE',
          border: '1px solid rgba(42,33,24,.10)',
          borderRadius: '12px',
          padding: '9px 11px',
          display: 'flex',
          alignItems: 'center',
          gap: '9px',
        }}>
          <div style={{
            width: '32px', height: '32px',
            borderRadius: '50%',
            flexShrink: 0,
            background: meta.bg,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '11px', fontWeight: '800',
            color: '#FFFFFF',
            fontFamily: "'Unbounded', sans-serif",
            boxShadow: '0 2px 6px rgba(74,48,28,.20)',
          }}>
            LG
          </div>
          <div>
            <div style={{
              fontWeight: '600',
              fontSize: '12.5px',
              color: '#2A2118',
              fontFamily: "'Hanken Grotesk', sans-serif",
            }}>
              Lamine Gaye
            </div>
            <div style={{
              fontSize: '10.5px',
              color: meta.color,
              textTransform: 'capitalize',
              fontFamily: "'Hanken Grotesk', sans-serif",
              fontWeight: '500',
            }}>
              {meta.label}{role === 'apprenant' ? ' · 🔥 7j' : ''}
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
