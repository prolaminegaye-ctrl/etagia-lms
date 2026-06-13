import Sidebar from '@/components/Sidebar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--canvas)' }}>
      <Sidebar />
      <main style={{ marginLeft: "240px", flex: 1, padding: '2rem 2.5rem', minHeight: '100vh' }}>
        {children}
      </main>
    </div>
  )
}
