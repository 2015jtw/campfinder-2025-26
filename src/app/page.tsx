export const runtime = 'nodejs'
export const revalidate = 60 // ISR is fine for public list

import CampgroundCard from '@/components/CampgroundCard'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function HomePage() {
  const rows = await prisma.campground.findMany({
    take: 8,
    orderBy: { createdAt: 'desc' },
    include: {
      images: { take: 1, orderBy: { sortOrder: 'asc' } },
      reviews: { select: { rating: true } },
    },
  })

  const items = rows.map((cg) => {
    const ratings = cg.reviews.map((r) => r.rating)
    const avg = ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : null
    return {
      id: cg.id,
      slug: cg.slug,
      name: cg.title,
      location: cg.location,
      imageUrl: cg.images[0]?.url ?? null,
      price: Number(cg.price),
      avgRating: avg,
      reviewCount: ratings.length,
    }
  })

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">Featured Campgrounds</h1>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((cg) => (
          <CampgroundCard key={cg.id} cg={cg} />
        ))}
      </div>
    </main>
  )
}
