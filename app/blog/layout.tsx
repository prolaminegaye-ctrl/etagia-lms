import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Blog EtagIA — IA, EdTech et formation en Afrique francophone",
  description:
    "Articles, guides et études sur l'IA générative, la digitalisation des écoles et la formation professionnelle en Afrique francophone, par l'équipe EtagIA.",
  alternates: { canonical: '/blog' },
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children
}
