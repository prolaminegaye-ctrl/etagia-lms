import Sidebar from '@/components/Sidebar'
export default function FormateurLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Sidebar role="formateur" />
      <main style={{ marginLeft: '220px', flex: 1, padding: '2rem 2.5rem', minHeight: '100vh' }}>
        {children}
      </main>
    </div>
  )
}
