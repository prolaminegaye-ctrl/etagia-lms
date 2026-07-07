import type { Metadata } from 'next'
import Sidebar from '@/components/Sidebar'

export const metadata: Metadata = {
  title: 'Nos cours et formations en ligne — EtagIA',
  description:
    "Cours interactifs, classes en direct et évaluations certifiantes sur EtagIA, la plateforme LMS augmentée par l'IA pour l'Afrique francophone.",
  alternates: { canonical: '/cours' },
}

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
