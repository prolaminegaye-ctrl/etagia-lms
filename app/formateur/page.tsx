'use client'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'

const stats = [
  { label: 'Apprenants actifs', value: '127',  bg: '#C9F0F0', color: '#0F766E', icon: '👥' },
  { label: 'Cours publiés',     value: '8',    bg: '#E8EAFF', color: '#4255FF', icon: '📚' },
  { label: 'Taux completion',   value: '74%',  bg: '#CCFBDC', color: '#16A34A', icon: '✅' },
  { label: 'Revenu du mois',    value: '340K', bg: '#FFBF80', color: '#C2410C', icon: '💰', sub: 'FCFA' },
]

const actions = [
  { label: 'Créer un cours',       href: '/formateur/creer',     bg: '#4255FF', color: '#fff',    icon: '✦' },
  { label: 'Importer SCORM/H5P',   href: '/formateur/import',    bg: '#E8EAFF', color: '#4255FF', icon: '↑' },
  { label: 'Voir mes apprenants',  href: '/formateur/apprenants',bg: '#C9F0F0', color: '#0F766E', icon: '👥' },
  { label: 'EduGears AI',          href: '/formateur/edugears',  bg: '#FFD6FD', color: '#9333EA', icon: '🤖' },
  { label: 'Statistiques',         href: '/formateur/stats',     bg: '#CCFBDC', color: '#16A34A', icon: '〜' },
  { label: 'Planning',             href: '/formateur/calendrier',bg: '#FEF3C7', color: '#D97706', icon: '📅' },
]

const recentCourses = [
  { title: 'Techniques de Vente Avancées',   learners: 43, progress: 68, color: '#4255FF' },
  { title: 'Communication Commerciale',       learners: 31, progress: 52, color: '#6B52D4' },
  { title: 'Gestion des Stocks & Inventaire', learners: 28, progress: 81, color: '#0F766E' },
]

export default function FormateurPage() {
  const router = useRouter()
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F6F7FB' }}>
      <Sidebar role="formateur" />
      <main style={{ marginLeft: '248px', flex: 1, padding: '2rem', maxWidth: '1100px' }}>

        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ fontSize: '11px', fontWeight: '700', color: '#4255FF', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '4px' }}>Espace Formateur</div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '900', color: '#2E3856', letterSpacing: '-0.5px' }}>Tableau de bord</h1>
          <p style={{ color: '#586380', fontSize: '14px', marginTop: '4px' }}>Gérez vos cours et suivez la progression de vos apprenants.</p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {stats.map(({ label, value, bg, color, icon, sub }) => (
            <div key={label} style={{ background: '#fff', border: '1px solid #D9DBE9', borderRadius: '16px', padding: '1.25rem', boxShadow: '0 2px 8px rgba(46,56,86,0.07)' }}>
              <div style={{ width: 40, height: 40, borderRadius: '12px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', marginBottom: '12px' }}>{icon}</div>
              <div style={{ fontSize: '24px', fontWeight: '900', color: '#2E3856', letterSpacing: '-0.5px' }}>{value}<span style={{ fontSize: '12px', color: '#939BB4', marginLeft: '3px' }}>{sub}</span></div>
              <div style={{ fontSize: '12px', color: '#939BB4', marginTop: '3px' }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ fontSize: '11px', fontWeight: '700', color: '#4255FF', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '12px' }}>Actions rapides</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '10px' }}>
            {actions.map(({ label, href, bg, color, icon }) => (
              <button key={label} onClick={() => router.push(href)} style={{
                padding: '1rem', borderRadius: '16px', border: 'none', cursor: 'pointer',
                background: bg, color, fontWeight: '700', fontSize: '13px',
                display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '8px',
                transition: 'transform .15s', textAlign: 'left',
              }}
              onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)'}
              onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'}
              >
                <span style={{ fontSize: '20px' }}>{icon}</span>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Recent courses */}
        <div style={{ background: '#fff', border: '1px solid #D9DBE9', borderRadius: '20px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(46,56,86,0.07)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <div style={{ fontSize: '11px', fontWeight: '700', color: '#4255FF', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '3px' }}>Actifs</div>
              <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#2E3856' }}>Mes cours récents</h3>
            </div>
            <button onClick={() => router.push('/formateur/cours')} style={{ fontSize: '12px', color: '#4255FF', background: '#E8EAFF', border: 'none', borderRadius: '8px', padding: '6px 14px', cursor: 'pointer', fontWeight: '700' }}>Voir tout →</button>
          </div>
          {recentCourses.map(({ title, learners, progress, color }) => (
            <div key={title} style={{ padding: '1rem', borderRadius: '14px', border: '1px solid #ECEEF5', marginBottom: '10px', background: '#FAFBFD' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '14px', color: '#2E3856', marginBottom: '4px' }}>{title}</div>
                  <span style={{ fontSize: '11px', color: '#939BB4' }}>{learners} apprenants</span>
                </div>
                <div style={{ fontSize: '20px', fontWeight: '900', color, letterSpacing: '-0.5px' }}>{progress}%</div>
              </div>
              <div style={{ height: '6px', background: '#ECEEF5', borderRadius: '99px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${progress}%`, background: color, borderRadius: '99px' }} />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
