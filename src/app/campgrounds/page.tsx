export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const revalidate = 0

import { prisma } from '@/lib/prisma'
import { withRetry } from '@/lib/db'
import ViewToggle from '@/components/util/ViewToggle'
import FilterSelect, { SortOption } from '@/components/util/FilterSelect'
import Pagination from '@/components/util/Pagination'
import CampgroundCard from '@/components/campground/CampgroundCard'
import { CampgroundsSearchParams } from '@/types'
import CampgroundsMap from '@/components/maps/CampgroundsMap'

const PAGE_SIZE = 12

type ViewType = 'grid' | 'list'

// Drop the Prisma.Result dance entirely
type CampgroundCardData = {
  id: string // normalize to string for keys/links
  slug: string
  title: string
  location: string
  description?: string | null
  price: number | null // Decimal -> number
  images: { url: string }[]
  _avgRating?: number | null
  _reviewsCount?: number
}

type CampgroundMapData = {
  id: number
  slug: string
  title: string
  location: string
  latitude: number
  longitude: number
  price: number | null
  image: string | null
  avgRating: number | null
  reviewsCount: number
}

type CampgroundsPageData = {
  rows: CampgroundCardData[]
  mapData: CampgroundMapData[]
  total: number
}

function parseParams(searchParams: Record<string, string>) {
  const page = Math.max(1, parseInt(searchParams.page || '1', 10))
  const view = (searchParams.view as ViewType) || 'grid'
  const sort = (searchParams.sort as SortOption) || 'alpha-asc'

  return { page, view, sort }
}

// Helper function to normalize URL (handle both string and JSON array)
function normalizeImageUrl(url: string): string {
  // If it looks like a JSON array, parse it and get the first item
  if (url.startsWith('[') && url.endsWith(']')) {
    try {
      const parsed = JSON.parse(url)
      return Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : url
    } catch {
      return url
    }
  }
  return url
}

function orderByFromSort(sort: SortOption) {
  switch (sort) {
    case 'alpha-asc':
      return { title: 'asc' as const }
    case 'alpha-desc':
      return { title: 'desc' as const }
    case 'rating-desc':
      return { reviews: { _count: 'desc' as const } }
    case 'price-desc':
      return { price: 'desc' as const }
    case 'price-asc':
      return { price: 'asc' as const }
    case 'newest':
      return { createdAt: 'desc' as const }
    case 'oldest':
      return { createdAt: 'asc' as const }
    default:
      return { title: 'asc' as const }
  }
}

async function fetchCampgrounds(page: number, sort: SortOption): Promise<CampgroundsPageData> {
  const skip = (page - 1) * PAGE_SIZE

  const [rawRows, rawMapData, total] = (await Promise.all([
    withRetry(() =>
      prisma.campground.findMany({
        orderBy: orderByFromSort(sort),
        skip,
        take: PAGE_SIZE,
        select: {
          id: true,
          slug: true,
          title: true,
          location: true,
          description: true,
          price: true, // Prisma.Decimal | null
          images: { select: { url: true }, take: 1 },
          _count: { select: { reviews: true } },
          reviews: { select: { rating: true } },
        },
      })
    ),
    // Fetch all campgrounds for the map (with coordinates)
    withRetry(() =>
      prisma.campground.findMany({
        where: {
          latitude: { not: null },
          longitude: { not: null },
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
    ),
    withRetry(() => prisma.campground.count()),
  ])) as [any[], any[], number]

  const rows: CampgroundCardData[] = rawRows.map((r) => {
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
      price: r.price == null ? null : Number(r.price), // 🔁 Decimal -> number
      images: r.images,
      _avgRating: avgRating,
      _reviewsCount: r._count.reviews,
    }
  })

  const mapData: CampgroundMapData[] = rawMapData.map((r) => {
    const avgRating =
      r.reviews.length > 0
        ? r.reviews.reduce((sum: number, review: { rating: number }) => sum + review.rating, 0) /
          r.reviews.length
        : null

    return {
      id: r.id,
      slug: r.slug,
      title: r.title,
      location: r.location,
      latitude: Number(r.latitude),
      longitude: Number(r.longitude),
      price: r.price == null ? null : Number(r.price),
      image: r.images.length > 0 ? normalizeImageUrl(r.images[0].url) : null,
      avgRating,
      reviewsCount: r._count.reviews,
    }
  })

  return { rows, mapData, total }
}

export default async function CampgroundsPage({
  searchParams,
}: {
  searchParams?: Promise<CampgroundsSearchParams>
}) {
  const params = await searchParams
  const { page, view, sort } = parseParams(params ?? {})

  let rows: CampgroundCardData[] = []
  let mapData: CampgroundMapData[] = []
  let total = 0
  let totalPages = 1
  let error: string | null = null

  try {
    const result = await fetchCampgrounds(page, sort)
    rows = result.rows
    mapData = result.mapData
    total = result.total
    totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  } catch (err) {
    console.error('Failed to fetch campgrounds:', err)
    error = 'Failed to load campgrounds. Please check your database connection.'
  }

  return (
    <section className="container mx-auto px-4 py-6 space-y-6">
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Campgrounds</h1>
        <div className="flex items-center gap-3">
          <FilterSelect current={sort} />
          <ViewToggle view={view} />
        </div>
      </header>

      {/* Map Section */}
      {!error && mapData.length > 0 && (
        <div className="w-full">
          <CampgroundsMap
            latitude={39.8283} // Center of continental US
            longitude={-98.5795}
            zoom={3}
            height={825}
            campgrounds={mapData}
          />
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
          <div className="flex items-center justify-center mb-2">
            <svg
              className="w-6 h-6 text-red-500 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            <h3 className="text-lg font-semibold text-red-800">Database Connection Error</h3>
          </div>
          <p className="text-red-600">{error}</p>
          <p className="text-sm text-red-500 mt-2">
            Please check your .env file and ensure your database credentials are correct.
          </p>
        </div>
      )}

      {/* Empty State */}
      {!error && rows.length === 0 && (
        <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-12 text-center">
          <div className="flex items-center justify-center mb-4">
            <svg
              className="w-12 h-12 text-neutral-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-neutral-800 mb-2">No Campgrounds Found</h3>
          <p className="text-neutral-600">There are no campgrounds to display at the moment.</p>
        </div>
      )}

      {/* Content */}
      {!error && rows.length > 0 && (
        <>
          {/* List/Grid */}
          {view === 'list' ? (
            <ul className="divide-y rounded-lg border">
              {rows.map((cg) => (
                <li key={cg.id} className="p-4">
                  <CampgroundCard data={cg} layout="list" />
                </li>
              ))}
            </ul>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {rows.map((cg) => (
                <CampgroundCard key={cg.id} data={cg} layout="grid" />
              ))}
            </div>
          )}

          <Pagination currentPage={page} totalPages={totalPages} searchParams={params ?? {}} />
        </>
      )}
    </section>
  )
}
