import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export type CampgroundCardDTO = {
  id: number
  slug: string
  name: string
  location: string
  imageUrl: string | null
  price: number
  avgRating: number | null
  reviewCount: number
}

export async function getCampgroundCards(params: {
  page: number
  pageSize: number
}): Promise<{ items: CampgroundCardDTO[]; total: number }> {
  const { page, pageSize } = params
  const skip = (page - 1) * pageSize

  const [total, rows] = await Promise.all([
    prisma.campground.count(),
    prisma.campground.findMany({
      skip,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
      include: {
        images: { take: 1, orderBy: { sortOrder: 'asc' } },
        reviews: { select: { rating: true } },
      },
    }),
  ])

  const items: CampgroundCardDTO[] = rows.map((cg) => {
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

  return { items, total }
}
