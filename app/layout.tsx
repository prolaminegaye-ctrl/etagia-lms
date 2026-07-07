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

const SITE_URL = 'https://etagia-academie.com'
const SITE_NAME = 'EtagIA Académie'
const SITE_DESCRIPTION =
  "EtagIA est la plateforme LMS augmentée par intelligence artificielle conçue pour l'Afrique francophone : cours certifiants, classes en direct et AI Tutor en français disponible 24h/24."

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'EtagIA — LMS Intelligent pour l\'Afrique francophone | AI Tutor 24/7',
    template: '%s | EtagIA Académie',
  },
  description: SITE_DESCRIPTION,
  keywords: [
    'LMS Afrique francophone',
    'plateforme e-learning Afrique',
    'IA pour enseignants',
    'AI Tutor français',
    'digitalisation école Afrique',
    'formation professionnelle digitale',
    'EdTech Afrique francophone',
    'logiciel de gestion pédagogique',
    'formation en ligne certifiante Afrique',
    "Pass'BAC en ligne",
  ],
  authors: [{ name: 'EtagIA Académie' }],
  creator: 'EtagIA Académie',
  publisher: 'EtagIA Académie',
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: 'EtagIA — LMS Intelligent pour l\'Afrique francophone',
    description: SITE_DESCRIPTION,
    images: [
      {
        url: '/logo.png',
        width: 512,
        height: 512,
        alt: 'EtagIA Académie',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EtagIA — LMS Intelligent pour l\'Afrique francophone',
    description: SITE_DESCRIPTION,
    images: ['/logo.png'],
  },
  icons: { icon: '/favicon.ico' },
}

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  name: 'EtagIA Académie',
  alternateName: 'EtagIA',
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  description: SITE_DESCRIPTION,
  areaServed: [
    { '@type': 'Country', name: 'Sénégal' },
    { '@type': 'Country', name: "Côte d'Ivoire" },
    { '@type': 'Country', name: 'Mali' },
    { '@type': 'Country', name: 'Cameroun' },
    { '@type': 'Country', name: 'Burkina Faso' },
    { '@type': 'Country', name: 'République Démocratique du Congo' },
    { '@type': 'Country', name: 'Guinée' },
  ],
  sameAs: [],
}

const softwareJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'EtagIA',
  applicationCategory: 'EducationalApplication',
  operatingSystem: 'Web',
  description: SITE_DESCRIPTION,
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'XOF',
    description: 'Accès gratuit pour démarrer',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${newsreader.variable} ${hankenGrotesk.variable}`}>
      <body>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }}
        />
      </body>
    </html>
  )
}
