import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Bienvenue — ETAGIA Académie',
  description: 'Configurez votre profil pour une expérience personnalisée',
}

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return children
}
