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
  slug: string
  title: string
  location: string
  price: number
  images: { url: string }[]
  _count?: { reviews: number }
  _avgRating?: number | null
}

export type BlogPostCard = {
  id: number
  slug: string
  title: string
  excerpt: string | null
  featuredImage: string | null
  publishedAt: Date | null
  readingTime: number | null
  author: { displayName: string | null; avatarUrl: string | null }
  categories: { category: { name: string; slug: string } }[]
}

export type BlogPostFull = Omit<BlogPostCard, 'categories'> & {
  content: string
  status: 'draft' | 'published' | 'archived'
  authorId: string
  createdAt: Date
  updatedAt: Date
  categories: { category: { id: number; name: string; slug: string } }[]
}

export type BlogCategory = {
  id: number
  name: string
  slug: string
  description: string | null
}
