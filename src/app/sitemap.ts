import { prisma } from '@/lib/prisma'

export const revalidate = 3600 // regenerate every hour

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://campfinder.app'

  const campgrounds = await prisma.campground.findMany({
    select: { slug: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
  })

  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 1 },
    {
      url: `${baseUrl}/campgrounds`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about-us`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact-us`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.4,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
  ]

  const campgroundPages = campgrounds.map((cg) => ({
    url: `${baseUrl}/campgrounds/${cg.slug}`,
    lastModified: cg.createdAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [...staticPages, ...campgroundPages]
}
