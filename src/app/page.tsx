export const runtime = 'nodejs'
export const revalidate = 60 // ISR is fine for public list

import { prisma } from '@/lib/prisma'
import { withRetry } from '@/lib/db'
import Link from 'next/link'
import FeaturedCarousel from '@/components/campground/FeaturedCarousel'
import MainMap from '@/components/maps/MainMap'

export default async function HomePage() {
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

  const featured = raw.map((r) => {
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

  const allCampgrounds = (await withRetry(() =>
    prisma.campground.findMany({
      where: {
        AND: [{ latitude: { not: null } }, { longitude: { not: null } }],
      },
      select: {
        id: true,
        slug: true,
        title: true,
        location: true,
        latitude: true,
        longitude: true,
        price: true,
        images: { select: { url: true }, take: 1 },
        _count: { select: { reviews: true } },
        reviews: { select: { rating: true } },
      },
    })
  )) as any[]

  const mapCampgrounds = allCampgrounds.map((c) => {
    const avgRating =
      c.reviews.length > 0
        ? c.reviews.reduce((sum: number, review: { rating: number }) => sum + review.rating, 0) /
          c.reviews.length
        : null

    return {
      id: c.id,
      slug: c.slug,
      title: c.title,
      location: c.location,
      latitude: Number(c.latitude),
      longitude: Number(c.longitude),
      price: c.price === null ? null : Number(c.price),
      image: c.images[0]?.url || null,
      avgRating,
      reviewsCount: c._count.reviews,
    }
  })

  return (
    <>
      <MainMap
        campgrounds={mapCampgrounds}
        zoom={4}
        height={720}
        latitude={mapCampgrounds[0]?.latitude ?? 39.5}
        longitude={mapCampgrounds[0]?.longitude ?? -98.35}
      />
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Featured campgrounds */}
        <section aria-labelledby="featured">
          <h2 id="featured" className="text-lg font-medium text-center">
            Featured Campgrounds
          </h2>
          <FeaturedCarousel
            items={featured.map((item) => ({
              ...item,
              id: Number(item.id),
              price: item.price != null ? Number(item.price) : 0,
            }))}
          />
        </section>
      </main>
    </>
  )
}
