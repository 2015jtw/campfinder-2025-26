export const runtime = 'nodejs'
export const revalidate = 60 // ISR is fine for public list

import { prisma } from '@/lib/prisma'
import { Campground } from '@/types'

export default async function HomePage() {
  const campgrounds: (Campground & {
    images: { url: string }[]
    reviews: { rating: number }[]
  })[] = await prisma.campground.findMany({
    take: 8,
    orderBy: { createdAt: 'desc' },
    include: {
      images: { take: 1, orderBy: { createdAt: 'asc' } },
      reviews: { select: { rating: true } },
    },
  })

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">Featured Campgrounds</h1>
    </main>
  )
}
