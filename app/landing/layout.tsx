import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "EtagIA — La plateforme LMS conçue pour l'Afrique francophone",
  description:
    "Découvrez EtagIA : AI Tutor en français 24/7, cours certifiants, classes live et parcours adaptatifs. La plateforme d'apprentissage pensée pour l'Afrique, pas adaptée à l'Afrique.",
  alternates: { canonical: '/landing' },
}

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return children
}
