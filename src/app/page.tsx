export const runtime = 'nodejs'
export const revalidate = 60 // ISR is fine for public list
export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import { Campground } from '@/types'
import { withRetry } from '@/lib/db'
import Link from 'next/link'
import FeaturedCarousel from '@/components/FeaturedCarousel'

export default async function HomePage() {
  const raw = await withRetry(() =>
    prisma.campground.findMany({
      take: 12, // adjust as you wish
      orderBy: { reviews: { _count: 'desc' } },
      select: {
        id: true,
        slug: true,
        title: true,
        location: true,
        description: true,
        price: true,
        images: { select: { url: true }, take: 1 },
        _count: { select: { reviews: true } },
      },
    })
  )

  const featured = raw.map((r) => ({
    id: String(r.id),
    slug: r.slug,
    title: r.title,
    location: r.location,
    description: r.description,
    images: r.images,
    price: r.price === null ? null : Number(r.price), // ✅ Decimal -> number
    _avgRating: null, // or your computed value
    _reviewsCount: r._count.reviews,
  }))

  return (
    <main className="container mx-auto px-4 py-8 space-y-8">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Home</h1>
      </header>

      {/* Featured campgrounds */}
      <section aria-labelledby="featured">
        <h2 id="featured" className="text-lg font-medium text-center">
          Featured Campgrounds
        </h2>
        <FeaturedCarousel
          items={featured.map((item) => ({
            ...item,
            id: Number(item.id),
            price: Number(item.price),
          }))}
        />
      </section>
    </main>
  )
}
