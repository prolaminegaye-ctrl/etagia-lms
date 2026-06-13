import Sidebar from '@/components/Sidebar'
export default function PassBacLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--canvas)' }}>
      <Sidebar role="apprenant" />
      <main style={{ marginLeft: '248px', flex: 1, padding: '0', minHeight: '100vh' }}>
        {children}
      </main>
    </div>
  )
}
