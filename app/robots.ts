import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin',
          '/admin/',
          '/dashboard',
          '/dashboard/',
          '/profil',
          '/profil/',
          '/onboarding',
          '/auth',
        ],
      },
    ],
    sitemap: 'https://etagia-academie.com/sitemap.xml',
    host: 'https://etagia-academie.com',
  }
}
