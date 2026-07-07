import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Guide EtagIA — Prendre en main votre plateforme d'apprentissage",
  description:
    "Le guide complet pour démarrer sur EtagIA : cours, AI Tutor, classes live, certifications et parcours adaptatifs.",
  alternates: { canonical: '/guide' },
}

export default function GuideLayout({ children }: { children: React.ReactNode }) {
  return children
}
