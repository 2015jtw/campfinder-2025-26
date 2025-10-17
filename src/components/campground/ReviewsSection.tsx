'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Star, Plus } from 'lucide-react'
import Review from './Review'
import CreateReviewForm from './CreateReviewForm'

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
}

interface ReviewsSectionProps {
  campgroundId: number
  reviews: Review[]
  isAuthenticated: boolean
}

export default function ReviewsSection({
  campgroundId,
  reviews,
  isAuthenticated,
}: ReviewsSectionProps) {
  const [showAddReview, setShowAddReview] = useState(false)

  const handleReviewSuccess = () => {
    setShowAddReview(false)
    // Refresh the page to show the new review
    window.location.reload()
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
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Reviews</h2>
          {reviews.length > 0 && (
            <div className="flex items-center mt-1">
              <div className="flex items-center mr-2">
                {renderStars(Math.round(Number(averageRating)))}
              </div>
              <span className="text-sm text-gray-600">
                {averageRating} ({reviews.length} review{reviews.length !== 1 ? 's' : ''})
              </span>
            </div>
          )}
        </div>

        {isAuthenticated && (
          <Button
            onClick={() => setShowAddReview(!showAddReview)}
            size="sm"
            className="flex items-center"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Review
          </Button>
        )}
      </div>

      {/* Add Review Form */}
      {showAddReview && (
        <CreateReviewForm
          campgroundId={campgroundId}
          onSuccess={handleReviewSuccess}
          onCancel={() => setShowAddReview(false)}
        />
      )}

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Star className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="text-lg font-medium mb-1">No reviews yet</p>
          <p className="text-sm">Be the first to share your experience!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Review
              key={review.id}
              review={review}
              currentUserId={undefined}
              onDelete={undefined}
            />
          ))}
        </div>
      )}

      {/* Login Prompt for Non-Authenticated Users */}
      {!isAuthenticated && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center text-blue-700 text-sm">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Sign in to leave a review</span>
          </div>
        </div>
      )}
    </div>
  )
}
