export const runtime = 'nodejs'
export const revalidate = 60 // ISR is fine for public list

import { prisma } from '@/lib/prisma'

export default async function HomePage() {
  const campgrounds = await prisma.campground.findMany({
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
      <div className="space-y-4">
        {campgrounds.map((campground) => (
          <div key={campground.id} className="border p-4 rounded">
            <h2 className="text-xl font-semibold">{campground.title}</h2>
            <p className="text-gray-600">{campground.location}</p>
            {/* <p className="text-green-600 font-semibold">${campground.price}</p> */}
            <p className="text-sm text-gray-500">{campground.description}</p>
            {campground.images[0] && (
              <img
                src={campground.images[0].url}
                alt={campground.title}
                className="w-32 h-32 object-cover rounded mt-2"
              />
            )}
            <p className="text-sm text-gray-500 mt-2">Reviews: {campground.reviews.length}</p>
          </div>
        ))}
      </div>
    </main>
  )
}
