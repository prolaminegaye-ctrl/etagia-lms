'use client'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import PageHero from '@/components/PageHero'

const kpis = [
  { label: 'Utilisateurs',    value: '1 284', bg: 'var(--turq-50)', color: 'var(--turq-700)', icon: '👥', delta: '+12 ce mois' },
  { label: 'Cours actifs',    value: '94',    bg: 'var(--turq-50)', color: 'var(--turq-700)', icon: '📚', delta: '+3 cette semaine' },
  { label: 'Revenus',         value: '4.2M',  bg: 'var(--orange-50)', color: 'var(--orange-700)', icon: '💰', delta: '+18% vs mois préc.', sub: ' FCFA' },
  { label: 'Satisfaction',    value: '4.7/5', bg: 'var(--turq-50)', color: 'var(--turq-700)', icon: '⭐', delta: 'Excellent' },
  { label: 'Sessions live',   value: '38',    bg: 'var(--violet-50)', color: 'var(--violet)', icon: '🎥', delta: 'Ce mois' },
  { label: 'Certifications',  value: '217',   bg: 'var(--gold-50)', color: 'var(--gold-700)', icon: '🏅', delta: 'Délivrées' },
]

const adminLinks = [
  { label: 'Utilisateurs',   href: '/admin/users',       bg: 'var(--turq-50)', color: 'var(--turq-700)', icon: '◎' },
  { label: 'Marketplace',    href: '/admin/market',      bg: 'var(--turq-50)', color: 'var(--turq-700)', icon: '🏪' },
  { label: 'Analytics',      href: '/admin/analytics',   bg: 'var(--violet-50)', color: 'var(--violet)', icon: '〜' },
  { label: 'White Label',    href: '/admin/white-label', bg: 'var(--orange-50)', color: 'var(--orange-700)', icon: '🏷' },
  { label: 'Mon Équipe',     href: '/admin/team',        bg: 'var(--turq-50)', color: 'var(--turq-700)', icon: '👥' },
  { label: 'Export CSV',     href: '/admin/export',      bg: 'var(--gold-50)', color: 'var(--gold-700)', icon: '📊' },
  { label: 'Plugins & LTI', href: '/admin/plugins',     bg: 'var(--violet-50)', color: 'var(--violet)', icon: '🔌' },
  { label: 'Classes live',   href: '/live',              bg: 'var(--orange-50)', color: 'var(--orange)', icon: '🎥' },
]

const recentUsers = [
  { name: 'Aminata Diallo',  role: 'Apprenante', country: '🇸🇳', status: 'Actif',   color: 'var(--turq-700)' },
  { name: 'Kofi Mensah',     role: 'Formateur',  country: '🇨🇮', status: 'Actif',   color: 'var(--turq-700)' },
  { name: 'Fatou Ba',        role: 'Apprenante', country: '🇬🇳', status: 'En attente', color: 'var(--gold-700)' },
  { name: 'Ibrahim Traoré',  role: 'Admin',      country: '🇨🇲', status: 'Actif',   color: 'var(--violet)' },
]

export default function AdminPage() {
  const router = useRouter()
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--canvas)' }}>
      <Sidebar role="admin" />
      <main style={{ marginLeft: '248px', flex: 1, padding: '2rem', maxWidth: '1200px' }}>

        <PageHero
          eyebrow="Administration"
          title="Vue d'ensemble"
          subtitle="Gérez la plateforme ETAGIA LMS depuis ce tableau de bord central."
          stats={[{value:'1 284',label:'Utilisateurs'},{value:'94',label:'Cours actifs'},{value:'4.2M',label:'FCFA revenus'},{value:'4.7/5',label:'Satisfaction'}]}
        />

        {/* KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {kpis.map(({ label, value, bg, color, icon, delta, sub }) => (
            <div key={label} style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px', padding: '1.25rem', boxShadow: '0 2px 8px rgba(46,56,86,0.07)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div style={{ width: 40, height: 40, borderRadius: '12px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>{icon}</div>
                <span style={{ fontSize: '10px', background: bg, color, padding: '3px 9px', borderRadius: '99px', fontWeight: '700' }}>{delta}</span>
              </div>
              <div style={{ fontSize: '22px', fontWeight: '900', color: 'var(--ink)', letterSpacing: '-0.5px' }}>{value}<span style={{ fontSize: '11px', color: 'var(--ink-soft)' }}>{sub}</span></div>
              <div style={{ fontSize: '12px', color: 'var(--ink-soft)', marginTop: '3px' }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Admin actions grid */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--turq-700)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '12px' }}>Accès rapide</div>
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
        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '20px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(46,56,86,0.07)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--turq-700)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '3px' }}>Derniers inscrits</div>
              <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--ink)' }}>Utilisateurs récents</h3>
            </div>
            <button onClick={() => router.push('/admin/users')} style={{ fontSize: '12px', color: 'var(--turq-700)', background: 'var(--turq-50)', border: 'none', borderRadius: '8px', padding: '6px 14px', cursor: 'pointer', fontWeight: '700' }}>Gérer →</button>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Utilisateur', 'Rôle', 'Pays', 'Statut'].map(h => (
                  <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: '11px', fontWeight: '700', color: 'var(--ink-soft)', letterSpacing: '0.8px', textTransform: 'uppercase', borderBottom: '2px solid #ECEEF5' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentUsers.map(({ name, role, country, status, color }) => (
                <tr key={name}>
                  <td style={{ padding: '12px', borderBottom: '1px solid #ECEEF5' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '800', color, flexShrink: 0 }}>{name[0]}</div>
                      <span style={{ fontWeight: '600', fontSize: '13px', color: 'var(--ink)' }}>{name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #ECEEF5', fontSize: '13px', color: 'var(--ink-mut)' }}>{role}</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #ECEEF5', fontSize: '16px' }}>{country}</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #ECEEF5' }}>
                    <span style={{ fontSize: '11px', fontWeight: '700', padding: '3px 9px', borderRadius: '99px', background: status === 'Actif' ? 'var(--turq-50)' : 'var(--gold-50)', color: status === 'Actif' ? 'var(--turq-700)' : 'var(--gold-700)' }}>{status}</span>
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
