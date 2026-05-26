import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Connexion — ETAGIA Académie',
  description: 'Accédez à votre espace de formation ETAGIA',
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return children
}
