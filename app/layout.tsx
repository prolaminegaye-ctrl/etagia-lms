import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ETAGIA — LMS Intelligent',
  description: 'Plateforme EdTech intelligente pour l\'Afrique francophone',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}
