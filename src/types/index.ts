// Re-export Prisma types for easier access
export type { Campground, Image, Review, Profile, AuthUser } from '@prisma/client'

// Use Prisma's generated types for specific query shapes
export type CampgroundWithBasicInfo = import('@prisma/client').Prisma.CampgroundGetPayload<{
  include: {
    images: { select: { url: true } }
    owner: { select: { id: true; displayName: true } }
    reviews: { select: { rating: true } }
  }
}>

// Add computed fields for UI components
export type CampgroundCardData = CampgroundWithBasicInfo & {
  _avgRating?: number | null
  _reviewsCount?: number
}

// Type for the campgrounds page data
export type CampgroundsPageData = {
  rows: CampgroundCardData[]
  total: number
}

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
