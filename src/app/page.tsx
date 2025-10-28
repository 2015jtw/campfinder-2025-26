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

async function fetchCampgroundsByCriteria(
  orderBy: any,
  take: number = 8
): Promise<FeaturedCampground[]> {
  try {
    const raw = (await withRetry(() =>
      prisma.campground.findMany({
        take,
        orderBy,
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

    return raw.map((r) => {
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
        price: r.price === null ? null : Number(r.price),
        _avgRating: avgRating,
        _reviewsCount: r._count.reviews,
      }
    })
  } catch (error) {
    console.error('Failed to fetch campgrounds:', error)
    return []
  }
}

export default async function HomePage() {
  // Fetch three different sets of campgrounds
  const [mostReviewed, newest, budgetFriendly] = await Promise.all([
    fetchCampgroundsByCriteria({ reviews: { _count: 'desc' } }, 8),
    fetchCampgroundsByCriteria({ createdAt: 'desc' }, 8),
    fetchCampgroundsByCriteria({ price: 'asc' }, 8),
  ])

  return (
    <>
      <HeroSection />
      <main className="container mx-auto px-4 py-12 space-y-12">
        {/* Most Reviewed Overall */}
        <section aria-labelledby="most-reviewed">
          <h2 id="most-reviewed" className="text-2xl font-bold text-center mb-6">
            Most Reviewed Overall
          </h2>
          {mostReviewed.length > 0 ? (
            <FeaturedCarousel
              items={mostReviewed.map((item) => ({
                ...item,
                id: Number(item.id),
                price: item.price != null ? Number(item.price) : 0,
              }))}
            />
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No reviewed campgrounds available at the moment.</p>
            </div>
          )}
        </section>

        {/* Newest Additions */}
        <section aria-labelledby="newest">
          <h2 id="newest" className="text-2xl font-bold text-center mb-6">
            Newest Additions
          </h2>
          {newest.length > 0 ? (
            <FeaturedCarousel
              items={newest.map((item) => ({
                ...item,
                id: Number(item.id),
                price: item.price != null ? Number(item.price) : 0,
              }))}
            />
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No new campgrounds available at the moment.</p>
            </div>
          )}
        </section>

        {/* Budget-Friendly Picks */}
        <section aria-labelledby="budget-friendly">
          <h2 id="budget-friendly" className="text-2xl font-bold text-center mb-6">
            Budget-Friendly Picks
          </h2>
          {budgetFriendly.length > 0 ? (
            <FeaturedCarousel
              items={budgetFriendly.map((item) => ({
                ...item,
                id: Number(item.id),
                price: item.price != null ? Number(item.price) : 0,
              }))}
            />
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">
                No budget-friendly campgrounds available at the moment.
              </p>
            </div>
          )}
        </section>
      </main>
    </>
  )
}
