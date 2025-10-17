'use client'

import { useState } from 'react'
import Review from '@/components/campground/Review'
import { deleteReviewAction } from '@/app/campgrounds/actions'
import { Star } from 'lucide-react'
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
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ))
  }

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
      : 0

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">My Reviews</h1>
                {reviews.length > 0 && (
                  <div className="flex items-center mt-2">
                    <div className="flex items-center mr-2">
                      {renderStars(Math.round(Number(averageRating)))}
                    </div>
                    <span className="text-sm text-gray-600">
                      {averageRating} average rating ({reviews.length} review
                      {reviews.length !== 1 ? 's' : ''})
                    </span>
                  </div>
                )}
              </div>
            </div>

            {reviews.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Star className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">No reviews yet</h3>
                <p className="text-sm mb-4">
                  Start exploring campgrounds and share your experiences!
                </p>
                <Link
                  href="/campgrounds"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Browse Campgrounds
                </Link>
              </div>
            ) : (
              <div className="space-y-8">
                {(() => {
                  // Group reviews by campground
                  const groupedReviews = reviews.reduce(
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
                      className="border border-gray-200 rounded-lg p-6"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <Link
                          href={`/campgrounds/${group.campground.slug}`}
                          className="text-xl font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                        >
                          {group.campground.title}
                        </Link>
                        <span className="text-sm text-gray-500">
                          {group.reviews.length} review{group.reviews.length !== 1 ? 's' : ''}
                        </span>
                      </div>

                      <div className="space-y-4">
                        {group.reviews
                          .sort(
                            (a, b) =>
                              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                          )
                          .map((review) => (
                            <div key={review.id} className="bg-gray-50 rounded-lg p-4">
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
