import type { Metadata } from 'next'
import Sidebar from '@/components/Sidebar'
import { MarketplaceGuard } from '@/components/access/MarketplaceGuard'

export const metadata: Metadata = {
  title: 'Marketplace de formations certifiantes — EtagIA',
  description:
    "Explorez le catalogue de formations certifiantes EtagIA : Data Science, Marketing Digital, Leadership et bien plus, pensées pour l'Afrique francophone.",
  alternates: { canonical: '/market' },
}

export default function MarketLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--canvas)' }}>
      <Sidebar role="apprenant" />
      <main style={{ marginLeft: '240px', flex: 1, padding: '2rem 2.5rem', minHeight: '100vh' }}>
        <MarketplaceGuard>{children}</MarketplaceGuard>
      </main>
    </div>
  )
}
