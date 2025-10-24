'use client'

import { useState, useMemo } from 'react'
import Review from '@/components/reviews/Review'
import { deleteReviewAction } from '@/app/campgrounds/actions'
import { Star, Search } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

interface Review {
  id: number
  rating: number
  title: string | null
  comment: string | null
  createdAt: Date
  user: {
    id: string
    displayName: string | null
    avatarUrl: string | null
  }
  campground: {
    id: number
    title: string
    slug: string
  }
}

interface UserReviewsClientProps {
  reviews: Review[]
  currentUserId: string
}

export default function UserReviewsClient({
  reviews: initialReviews,
  currentUserId,
}: UserReviewsClientProps) {
  const [reviews, setReviews] = useState(initialReviews)
  const [searchQuery, setSearchQuery] = useState('')

  const handleDeleteReview = async (reviewId: number) => {
    try {
      const formData = new FormData()
      formData.append('reviewId', reviewId.toString())

      const result = await deleteReviewAction(formData)

      if (result.ok) {
        setReviews((prev) => prev.filter((review) => review.id !== reviewId))
        toast.success('Review deleted successfully!')
      } else {
        toast.error(result.error || 'Failed to delete review')
      }
    } catch (error) {
      toast.error('An unexpected error occurred')
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-slate-300 dark:text-slate-600'}`}
      />
    ))
  }

  // Filter reviews based on search query
  const filteredReviews = useMemo(() => {
    if (!searchQuery.trim()) return reviews

    return reviews.filter(
      (review) =>
        review.campground.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.comment?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [reviews, searchQuery])

  const averageRating =
    filteredReviews.length > 0
      ? (
          filteredReviews.reduce((sum, review) => sum + review.rating, 0) / filteredReviews.length
        ).toFixed(1)
      : 0

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                  My Reviews
                </h1>
                {filteredReviews.length > 0 && (
                  <div className="flex items-center mt-3">
                    <div className="flex items-center mr-2">
                      {renderStars(Math.round(Number(averageRating)))}
                    </div>
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      {averageRating} average rating ({filteredReviews.length} review
                      {filteredReviews.length !== 1 ? 's' : ''})
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Search functionality */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search reviews by campground name, title, or comment..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>

            {reviews.length === 0 ? (
              <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                <Star className="w-16 h-16 mx-auto mb-4 text-slate-300 dark:text-slate-600" />
                <h3 className="text-lg font-medium mb-2 text-slate-900 dark:text-slate-100">
                  No reviews yet
                </h3>
                <p className="text-sm mb-4 text-slate-600 dark:text-slate-400">
                  Start exploring campgrounds and share your experiences!
                </p>
                <Link
                  href="/campgrounds"
                  className="inline-flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition-colors cursor-pointer"
                >
                  Browse Campgrounds
                </Link>
              </div>
            ) : filteredReviews.length === 0 ? (
              <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                <Search className="w-16 h-16 mx-auto mb-4 text-slate-300 dark:text-slate-600" />
                <h3 className="text-lg font-medium mb-2 text-slate-900 dark:text-slate-100">
                  No reviews found
                </h3>
                <p className="text-sm mb-4 text-slate-600 dark:text-slate-400">
                  Try adjusting your search terms to find reviews.
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {(() => {
                  // Group reviews by campground
                  const groupedReviews = filteredReviews.reduce(
                    (acc, review) => {
                      const campgroundId = review.campground.id
                      if (!acc[campgroundId]) {
                        acc[campgroundId] = {
                          campground: review.campground,
                          reviews: [],
                        }
                      }
                      acc[campgroundId].reviews.push(review)
                      return acc
                    },
                    {} as Record<number, { campground: any; reviews: any[] }>
                  )

                  return Object.values(groupedReviews).map((group) => (
                    <div
                      key={group.campground.id}
                      className="border border-slate-200 dark:border-slate-700 rounded-lg p-6 bg-slate-50 dark:bg-slate-900"
                    >
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <Link
                            href={`/campgrounds/${group.campground.slug}`}
                            className="text-xl font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 hover:underline cursor-pointer"
                          >
                            {group.campground.title}
                          </Link>
                          <div className="mt-2">
                            <span className="text-sm text-slate-500 dark:text-slate-400">
                              {group.reviews.length} review{group.reviews.length !== 1 ? 's' : ''}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {group.reviews
                          .sort(
                            (a, b) =>
                              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                          )
                          .map((review) => (
                            <div
                              key={review.id}
                              className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700"
                            >
                              <Review
                                review={review}
                                currentUserId={currentUserId}
                                onDelete={handleDeleteReview}
                              />
                            </div>
                          ))}
                      </div>
                    </div>
                  ))
                })()}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
