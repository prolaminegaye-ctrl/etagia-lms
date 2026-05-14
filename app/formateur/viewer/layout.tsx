import Sidebar from '@/components/Sidebar'
export default function L({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary,#0D0A1A)' }}>
      <Sidebar role="formateur" />
      <main style={{ marginLeft: '240px', flex: 1, padding: '1.5rem 2rem', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>{children}</main>
    </div>
  )
}
