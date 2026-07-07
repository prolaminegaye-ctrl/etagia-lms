import type { MetadataRoute } from 'next'

const BASE_URL = 'https://etagia-academie.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const routes: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
    { path: '/', priority: 1.0, changeFrequency: 'weekly' },
    { path: '/landing', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/blog', priority: 0.9, changeFrequency: 'daily' },
    { path: '/guide', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/market', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/cours', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/passbac-mini', priority: 0.7, changeFrequency: 'weekly' },
    { path: '/formateur', priority: 0.6, changeFrequency: 'monthly' },
    { path: '/auth', priority: 0.4, changeFrequency: 'yearly' },
  ]

  return routes.map((route) => ({
    url: `${BASE_URL}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }))
}
