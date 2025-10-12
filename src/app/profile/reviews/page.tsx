import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function ReviewsPage() {
  // Auth is handled by the layout
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const reviews = await prisma.review.findMany({
    where: { userId: user!.id },
    orderBy: { createdAt: 'desc' },
    take: 10,
    select: {
      id: true,
      rating: true,
      comment: true,
      createdAt: true,
      campground: { select: { id: true, title: true } },
    },
  })

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Your Reviews</h1>
          <p className="mt-2 text-gray-600">Reviews you've written for campgrounds</p>
        </div>
      </div>

      <section className="rounded-xl bg-white p-8 shadow-sm border">
        {reviews.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No reviews yet</h3>
            <p className="mt-2 text-gray-600">
              Start exploring campgrounds and share your experiences.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((rv) => (
              <div key={rv.id} className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`h-4 w-4 ${i < rv.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-sm font-medium text-gray-900">{rv.rating}/5</span>
                    </div>
                    <Link
                      href={`/campgrounds/${rv.campground.id}`}
                      className="mt-1 block text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                      {rv.campground.title}
                    </Link>
                    {rv.comment && <p className="mt-2 text-sm text-gray-700">{rv.comment}</p>}
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(rv.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
