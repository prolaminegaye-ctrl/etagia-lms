import Sidebar from '@/components/Sidebar'
import { AdminGuard } from '@/components/admin/AdminGuard'

/**
 * Toutes les pages d'administration passent par cette garde : elle
 * couvre les 17 écrans d'un coup, y compris ceux qui seront ajoutés
 * plus tard — on ne peut pas oublier de protéger une nouvelle page.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--canvas)' }}>
      <Sidebar role="admin" />
      <main style={{ marginLeft: '240px', flex: 1, padding: '2rem 2.5rem' }}>
        <AdminGuard>{children}</AdminGuard>
      </main>
    </div>
  )
}
