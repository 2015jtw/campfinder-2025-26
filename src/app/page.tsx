export const runtime = 'nodejs'
export const revalidate = 60 // ISR is fine for public list
export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import { Campground } from '@/types'
import { withRetry } from '@/lib/db'
import Link from 'next/link'
import FeaturedCarousel from '@/components/FeaturedCarousel'

export default async function HomePage() {
  const featured = await withRetry(() =>
    prisma.campground.findMany({
      take: 12, // adjust as you wish
      orderBy: { reviews: { _count: 'desc' } },
      include: {
        images: { select: { url: true }, take: 1 },
        owner: { select: { id: true, displayName: true } },
        _count: { select: { reviews: true } },
      },
    })
  )

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
          items={featured.map((item) => ({ ...item, price: Number(item.price) }))}
        />
      </section>
    </main>
  )
}
