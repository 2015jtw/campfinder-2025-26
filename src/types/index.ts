// Keep only the Prisma namespace if you need it elsewhere
export type { Prisma } from '@prisma/client'

// If you want to share common include/select configs, export them as consts:
export const campgroundBasicInclude = {
  images: { select: { url: true } },
  owner: { select: { id: true, displayName: true } },
  reviews: { select: { rating: true } },
} as const

// Type for search params
export type CampgroundsSearchParams = {
  page?: string
  view?: 'grid' | 'list'
  sort?: 'alpha-asc' | 'alpha-desc' | 'rating-desc' | 'price-desc' | 'price-asc'
}

// Type for featured carousel items
export type FeaturedCarouselItem = {
  id: number
  title: string
  price: number
  images: { url: string }[]
  _count?: { reviews: number }
}
