export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const revalidate = 0

import { prisma } from '@/lib/prisma'

export default async function CampgroundsPage() {
  const campgrounds = await prisma.campground.findMany({
    include: {
      images: { take: 1, orderBy: { createdAt: 'asc' } },
      reviews: { select: { rating: true } },
    },
  })

  console.log('Campgrounds:', campgrounds)

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">All Campgrounds</h1>
      <div className="space-y-4">
        {campgrounds.map((cg) => (
          <div key={cg.id} className="border p-4 rounded">
            <h2 className="text-xl font-semibold">{cg.title}</h2>
            <p className="text-gray-600">{cg.location}</p>
            {/* <p className="text-green-600 font-semibold">${cg.price}</p> */}
            <p className="text-sm text-gray-500">{cg.description}</p>
            {cg.images[0] && (
              <img
                src={cg.images[0].url}
                alt={cg.title}
                className="w-32 h-32 object-cover rounded mt-2"
              />
            )}
            <p className="text-sm text-gray-500 mt-2">Reviews: {cg.reviews.length}</p>
          </div>
        ))}
      </div>
    </main>
  )
}
