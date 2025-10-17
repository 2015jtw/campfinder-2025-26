'use client'

import Image from 'next/image'
import { Star, User, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ReviewProps {
  review: {
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
  currentUserId?: string
  onDelete?: (reviewId: number) => void
}

export default function Review({ review, currentUserId, onDelete }: ReviewProps) {
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

  const isOwner = currentUserId === review.user.id

  return (
    <div className="border-b border-gray-200 pb-4 last:border-b-0">
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

        {isOwner && onDelete && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(review.id)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>

      {review.title && <h4 className="font-medium text-gray-900 mb-2">{review.title}</h4>}

      {review.comment && <p className="text-gray-700 leading-relaxed">{review.comment}</p>}
    </div>
  )
}
