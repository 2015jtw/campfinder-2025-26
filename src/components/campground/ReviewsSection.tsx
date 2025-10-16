'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Star, User, Plus } from 'lucide-react'

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

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date)
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
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-3">Write a Review</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
              <div className="flex space-x-1">
                {Array.from({ length: 5 }, (_, i) => (
                  <button key={i} className="text-gray-300 hover:text-yellow-400 transition-colors">
                    <Star className="w-6 h-6" />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title (optional)
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Summarize your experience"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
              <textarea
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Share your experience with other campers"
              />
            </div>
            <div className="flex space-x-2">
              <Button size="sm">Submit Review</Button>
              <Button size="sm" variant="outline" onClick={() => setShowAddReview(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
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
            <div key={review.id} className="border-b border-gray-200 pb-4 last:border-b-0">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                    {review.user.avatarUrl ? (
                      <Image
                        src={review.user.avatarUrl}
                        alt={review.user.displayName || 'User'}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    ) : (
                      <User className="w-4 h-4 text-gray-600" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {review.user.displayName || 'Anonymous'}
                    </div>
                    <div className="flex items-center">
                      <div className="flex items-center mr-2">{renderStars(review.rating)}</div>
                      <span className="text-sm text-gray-500">{formatDate(review.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {review.title && <h4 className="font-medium text-gray-900 mb-2">{review.title}</h4>}

              {review.comment && <p className="text-gray-700 leading-relaxed">{review.comment}</p>}
            </div>
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
