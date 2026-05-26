import type { Metadata, Viewport } from 'next'

export const metadata: Metadata = {
  title: 'Pass\'BAC — ETAGIA',
  description: 'Préparez votre Baccalauréat avec ETAGIA — quiz, fiches et examens blancs sur mobile',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function PassBacMiniLayout({ children }: { children: React.ReactNode }) {
  return children
}
