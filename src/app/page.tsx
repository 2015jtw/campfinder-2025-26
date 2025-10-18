export const runtime = 'nodejs'
export const revalidate = 60 // ISR is fine for public list

import { prisma } from '@/lib/prisma'
import { withRetry } from '@/lib/db'
import Link from 'next/link'
import HeroSection from '@/components/HeroSection'
import FeaturedCarousel from '@/components/campground/FeaturedCarousel'

type FeaturedCampground = {
  id: string
  slug: string
  title: string
  location: string
  description: string
  images: { url: string }[]
  price: number | null
  _avgRating: number | null
  _reviewsCount: number
}

export default async function HomePage() {
  let featured: FeaturedCampground[] = []

  try {
    const raw = (await withRetry(() =>
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
          reviews: { select: { rating: true } },
        },
      })
    )) as any[]

    featured = raw.map((r) => {
      const avgRating =
        r.reviews.length > 0
          ? r.reviews.reduce((sum: number, review: { rating: number }) => sum + review.rating, 0) /
            r.reviews.length
          : null

      return {
        id: String(r.id),
        slug: r.slug,
        title: r.title,
        location: r.location,
        description: r.description,
        images: r.images,
        price: r.price === null ? null : Number(r.price), // ✅ Decimal -> number
        _avgRating: avgRating,
        _reviewsCount: r._count.reviews,
      }
    })
  } catch (error) {
    console.error('Failed to fetch featured campgrounds:', error)
    // featured remains empty array, page will still render
  }

  return (
    <>
      <HeroSection />
      <main className="container mx-auto px-4 py-8 space-y-8">
        <section aria-labelledby="featured">
          <h2 id="featured" className="text-lg font-medium text-center">
            Featured Campgrounds
          </h2>
          {featured.length > 0 ? (
            <FeaturedCarousel
              items={featured.map((item) => ({
                ...item,
                id: Number(item.id),
                price: item.price != null ? Number(item.price) : 0,
              }))}
            />
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">
                {featured.length === 0
                  ? 'No featured campgrounds available at the moment.'
                  : 'Loading featured campgrounds...'}
              </p>
            </div>
          )}
        </section>
      </main>
    </>
  )
}
