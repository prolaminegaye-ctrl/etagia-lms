'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navApprenant = [
  { href: '/dashboard',                  icon: '⊞', label: 'Dashboard' },
  { href: '/cours',                      icon: '◈', label: 'Mes cours' },
  { href: '/tutor',                      icon: '✦', label: 'AI Tutor',          badge: 'IA' },
  { href: '/apprenant/khan-academy',     icon: '🎓', label: 'Khan Academy',     badge: '🆓' },
  { href: '/apprenant/adaptive',         icon: '🧠', label: 'Parcours adaptatif' },
  { href: '/apprenant/diagnostic',       icon: '📋', label: 'Éval. diagnostic' },
  { href: '/apprenant/satisfaction',     icon: '⭐', label: 'Satisfaction' },
  { href: '/profil',                     icon: '◉', label: 'Profil' },
]
const navFormateur = [
  { href: '/formateur',                  icon: '⊞', label: 'Dashboard' },
  { href: '/formateur/creer',            icon: '✦', label: 'Créer un cours',    badge: 'IA' },
  { href: '/formateur/import',           icon: '↑', label: 'Importer SCORM/H5P' },
  { href: '/formateur/cours',            icon: '◈', label: 'Mes cours' },
  { href: '/formateur/viewer',           icon: '👁', label: 'Visualiseur' },
  { href: '/formateur/apprenants',       icon: '◎', label: 'Apprenants' },
  { href: '/formateur/edugears',         icon: '🤖', label: 'EduGears AI',      badge: 'IA' },
  { href: '/formateur/khan-academy',     icon: '🎓', label: 'Khan Academy',     badge: '🆓' },
  { href: '/formateur/stats',            icon: '〜', label: 'Statistiques' },
]
const navAdmin = [
  { href: '/admin',           icon: '⊞', label: 'Dashboard' },
  { href: '/admin/users',     icon: '◎', label: 'Utilisateurs' },
  { href: '/admin/cours',     icon: '◈', label: 'Cours' },
  { href: '/admin/orgs',      icon: '▦', label: 'Organisations' },
  { href: '/admin/analytics', icon: '〜', label: 'Analytics' },
  { href: '/admin/export',    icon: '📊', label: 'Export CSV' },
  { href: '/admin/plugins',   icon: '🔌', label: 'Plugins & LTI' },
]

const roleColors: Record<string, string> = {
  apprenant: '#6C29FF',
  formateur: '#00B89C',
  admin:     '#D63384',
}

export default function Sidebar({ role = 'apprenant' }: { role?: string }) {
  const path = usePathname()
  const nav  = role === 'formateur' ? navFormateur : role === 'admin' ? navAdmin : navApprenant
  const rc   = roleColors[role] ?? '#6C29FF'

  return (
    <aside style={{
      width: '248px',
      minHeight: '100vh',
      background: '#FFFFFF',
      borderRight: '1px solid #EAE7F3',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      top: 0, left: 0,
      zIndex: 10,
      boxShadow: '2px 0 12px rgba(108,41,255,0.05)',
    }}>

      {/* ── Logo ── */}
      <div style={{ padding: '1.25rem 1.25rem 1rem', borderBottom: '1px solid #F0EEF8' }}>
        <Link href="/dashboard" style={{ textDecoration: 'none', display: 'block' }}>
          <div style={{
            fontFamily: 'Unbounded, sans-serif',
            fontWeight: '800',
            fontSize: '18px',
            color: '#6C29FF',
            letterSpacing: '-0.03em',
            lineHeight: 1,
          }}>
            ETAGIA
            <span style={{ color: '#121212' }}>.</span>
          </div>
          <div style={{
            fontFamily: 'Unbounded, sans-serif',
            fontWeight: '500',
            fontSize: '9px',
            color: '#C7C3D3',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            marginTop: '3px',
          }}>
            Académie · EdTech Afrique
          </div>
        </Link>
      </div>

      {/* ── Sélecteur de rôle ── */}
      <div style={{ padding: '0.875rem 0.875rem 0.75rem', borderBottom: '1px solid #F0EEF8' }}>
        <div style={{
          display: 'flex', gap: '2px',
          background: '#F7F6FB',
          borderRadius: '10px',
          padding: '3px',
          border: '1px solid #EAE7F3',
        }}>
          {[
            { r: 'apprenant', label: 'Apprenant', href: '/dashboard' },
            { r: 'formateur', label: 'Formateur', href: '/formateur' },
            { r: 'admin',     label: 'Admin',     href: '/admin' },
          ].map(({ r, label, href }) => (
            <Link key={r} href={href} style={{
              flex: 1,
              textAlign: 'center',
              padding: '6px 2px',
              borderRadius: '7px',
              fontSize: '9.5px',
              fontWeight: '700',
              fontFamily: 'DM Sans, sans-serif',
              letterSpacing: '0.02em',
              transition: 'all .15s',
              background: role === r ? roleColors[r] : 'transparent',
              color:      role === r ? '#F9F8FC' : '#625E6E',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
            }}>
              {label}
            </Link>
          ))}
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav style={{ flex: 1, padding: '0.75rem 0.75rem', overflowY: 'auto' }}>
        <div style={{
          fontSize: '9px',
          color: '#C7C3D3',
          fontWeight: '700',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          fontFamily: 'DM Sans, sans-serif',
          padding: '4px 8px 8px',
        }}>
          Navigation
        </div>

        {nav.map(item => {
          const active = path === item.href || (item.href.length > 8 && path.startsWith(item.href))
          return (
            <Link key={item.href} href={item.href} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '9px 10px',
              borderRadius: '10px',
              marginBottom: '2px',
              background: active ? '#EDE8FF' : 'transparent',
              color:      active ? '#6C29FF' : '#625E6E',
              fontSize:   '13.5px',
              fontFamily: 'DM Sans, sans-serif',
              fontWeight: active ? '600' : '400',
              transition: 'all .15s',
              textDecoration: 'none',
            }}
            onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = '#F7F6FB' }}
            onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
            >
              <span style={{ fontSize: '15px', flexShrink: 0 }}>{item.icon}</span>
              <span style={{ flex: 1, lineHeight: 1.3 }}>{item.label}</span>
              {(item as any).badge && (
                <span style={{
                  fontSize: '9px',
                  borderRadius: '20px',
                  padding: '2px 6px',
                  fontWeight: '800',
                  background: active ? '#6C29FF' : '#EDE8FF',
                  color:      active ? '#F9F8FC' : '#6C29FF',
                  letterSpacing: '0.04em',
                }}>
                  {(item as any).badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* ── Profil utilisateur ── */}
      <div style={{ padding: '0.875rem', borderTop: '1px solid #F0EEF8' }}>
        <div style={{
          background: '#F7F6FB',
          border: '1px solid #EAE7F3',
          borderRadius: '12px',
          padding: '10px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}>
          <div style={{
            width: '34px', height: '34px',
            borderRadius: '50%',
            flexShrink: 0,
            background: rc,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '12px', fontWeight: '800',
            color: '#F9F8FC',
            fontFamily: 'Unbounded, sans-serif',
          }}>
            LG
          </div>
          <div>
            <div style={{
              fontWeight: '600',
              fontSize: '13px',
              color: '#121212',
              fontFamily: 'DM Sans, sans-serif',
            }}>
              Lamine Gaye
            </div>
            <div style={{
              fontSize: '11px',
              color: '#625E6E',
              textTransform: 'capitalize',
              fontFamily: 'DM Sans, sans-serif',
            }}>
              {role}{role === 'apprenant' ? ' · 🔥 7j' : ''}
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
