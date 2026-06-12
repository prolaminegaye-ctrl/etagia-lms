import type { Metadata } from 'next'
import { Newsreader, Hanken_Grotesk } from 'next/font/google'
import './globals.css'

const newsreader = Newsreader({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
})

const hankenGrotesk = Hanken_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'EtagIA — LMS Intelligent',
  description: "Plateforme EdTech intelligente pour l'Afrique francophone",
  icons: { icon: '/favicon.ico' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${newsreader.variable} ${hankenGrotesk.variable}`}>
      <body>{children}</body>
    </html>
  )
}
