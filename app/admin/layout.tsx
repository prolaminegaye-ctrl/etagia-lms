import Sidebar from '@/components/Sidebar'
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Sidebar role="admin" />
      <main style={{ marginLeft: '230px', flex: 1, padding: '2rem 2.5rem' }}>{children}</main>
    </div>
  )
}
