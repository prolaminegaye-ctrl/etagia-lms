import Sidebar from '@/components/Sidebar'
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--canvas)' }}>
      <Sidebar role="formateur" />
      <main style={{ marginLeft: '240px', flex: 1, padding: '2rem 2.5rem' }}>{children}</main>
    </div>
  )
}
