'use client'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'

const kpis = [
  { label: 'Utilisateurs',    value: '1 284', bg: '#E8EAFF', color: '#4255FF', icon: '👥', delta: '+12 ce mois' },
  { label: 'Cours actifs',    value: '94',    bg: '#C9F0F0', color: '#0F766E', icon: '📚', delta: '+3 cette semaine' },
  { label: 'Revenus',         value: '4.2M',  bg: '#FFBF80', color: '#C2410C', icon: '💰', delta: '+18% vs mois préc.', sub: ' FCFA' },
  { label: 'Satisfaction',    value: '4.7/5', bg: '#CCFBDC', color: '#16A34A', icon: '⭐', delta: 'Excellent' },
  { label: 'Sessions live',   value: '38',    bg: '#FFD6FD', color: '#9333EA', icon: '🎥', delta: 'Ce mois' },
  { label: 'Certifications',  value: '217',   bg: '#FEF3C7', color: '#D97706', icon: '🏅', delta: 'Délivrées' },
]

const adminLinks = [
  { label: 'Utilisateurs',   href: '/admin/users',       bg: '#E8EAFF', color: '#4255FF', icon: '◎' },
  { label: 'Marketplace',    href: '/admin/market',      bg: '#C9F0F0', color: '#0F766E', icon: '🏪' },
  { label: 'Analytics',      href: '/admin/analytics',   bg: '#FFD6FD', color: '#9333EA', icon: '〜' },
  { label: 'White Label',    href: '/admin/white-label', bg: '#FFBF80', color: '#C2410C', icon: '🏷' },
  { label: 'Mon Équipe',     href: '/admin/team',        bg: '#CCFBDC', color: '#16A34A', icon: '👥' },
  { label: 'Export CSV',     href: '/admin/export',      bg: '#FEF3C7', color: '#D97706', icon: '📊' },
  { label: 'Plugins & LTI', href: '/admin/plugins',     bg: '#EDE9FE', color: '#6B52D4', icon: '🔌' },
  { label: 'Classes live',   href: '/live',              bg: '#FFE4E4', color: '#DC2626', icon: '🎥' },
]

const recentUsers = [
  { name: 'Aminata Diallo',  role: 'Apprenante', country: '🇸🇳', status: 'Actif',   color: '#4255FF' },
  { name: 'Kofi Mensah',     role: 'Formateur',  country: '🇨🇮', status: 'Actif',   color: '#0F766E' },
  { name: 'Fatou Ba',        role: 'Apprenante', country: '🇬🇳', status: 'En attente', color: '#D97706' },
  { name: 'Ibrahim Traoré',  role: 'Admin',      country: '🇨🇲', status: 'Actif',   color: '#6B52D4' },
]

export default function AdminPage() {
  const router = useRouter()
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F6F7FB' }}>
      <Sidebar role="admin" />
      <main style={{ marginLeft: '248px', flex: 1, padding: '2rem', maxWidth: '1200px' }}>

        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ fontSize: '11px', fontWeight: '700', color: '#4255FF', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '4px' }}>Administration</div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '900', color: '#2E3856', letterSpacing: '-0.5px' }}>Vue d'ensemble</h1>
          <p style={{ color: '#586380', fontSize: '14px', marginTop: '4px' }}>Gérez la plateforme ETAGIA LMS depuis ce tableau de bord.</p>
        </div>

        {/* KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {kpis.map(({ label, value, bg, color, icon, delta, sub }) => (
            <div key={label} style={{ background: '#fff', border: '1px solid #D9DBE9', borderRadius: '16px', padding: '1.25rem', boxShadow: '0 2px 8px rgba(46,56,86,0.07)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div style={{ width: 40, height: 40, borderRadius: '12px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>{icon}</div>
                <span style={{ fontSize: '10px', background: bg, color, padding: '3px 9px', borderRadius: '99px', fontWeight: '700' }}>{delta}</span>
              </div>
              <div style={{ fontSize: '22px', fontWeight: '900', color: '#2E3856', letterSpacing: '-0.5px' }}>{value}<span style={{ fontSize: '11px', color: '#939BB4' }}>{sub}</span></div>
              <div style={{ fontSize: '12px', color: '#939BB4', marginTop: '3px' }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Admin actions grid */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ fontSize: '11px', fontWeight: '700', color: '#4255FF', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '12px' }}>Accès rapide</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '10px' }}>
            {adminLinks.map(({ label, href, bg, color, icon }) => (
              <button key={label} onClick={() => router.push(href)} style={{
                padding: '1.125rem', borderRadius: '16px', border: 'none', cursor: 'pointer',
                background: bg, color, fontWeight: '700', fontSize: '13px',
                display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '8px',
                transition: 'transform .15s', textAlign: 'left',
              }}
              onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)'}
              onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'}
              >
                <span style={{ fontSize: '22px' }}>{icon}</span>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Recent users */}
        <div style={{ background: '#fff', border: '1px solid #D9DBE9', borderRadius: '20px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(46,56,86,0.07)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <div style={{ fontSize: '11px', fontWeight: '700', color: '#4255FF', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '3px' }}>Derniers inscrits</div>
              <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#2E3856' }}>Utilisateurs récents</h3>
            </div>
            <button onClick={() => router.push('/admin/users')} style={{ fontSize: '12px', color: '#4255FF', background: '#E8EAFF', border: 'none', borderRadius: '8px', padding: '6px 14px', cursor: 'pointer', fontWeight: '700' }}>Gérer →</button>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Utilisateur', 'Rôle', 'Pays', 'Statut'].map(h => (
                  <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: '11px', fontWeight: '700', color: '#939BB4', letterSpacing: '0.8px', textTransform: 'uppercase', borderBottom: '2px solid #ECEEF5' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentUsers.map(({ name, role, country, status, color }) => (
                <tr key={name}>
                  <td style={{ padding: '12px', borderBottom: '1px solid #ECEEF5' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '800', color, flexShrink: 0 }}>{name[0]}</div>
                      <span style={{ fontWeight: '600', fontSize: '13px', color: '#2E3856' }}>{name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #ECEEF5', fontSize: '13px', color: '#586380' }}>{role}</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #ECEEF5', fontSize: '16px' }}>{country}</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #ECEEF5' }}>
                    <span style={{ fontSize: '11px', fontWeight: '700', padding: '3px 9px', borderRadius: '99px', background: status === 'Actif' ? '#CCFBDC' : '#FEF3C7', color: status === 'Actif' ? '#16A34A' : '#D97706' }}>{status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}
