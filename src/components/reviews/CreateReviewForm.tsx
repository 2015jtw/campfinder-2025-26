'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createReviewAction } from '@/app/campgrounds/actions'
import { patterns, effects, interactive, darkMode } from '@/lib/design-tokens'

interface CreateReviewFormProps {
  campgroundId: number
  onSuccess?: () => void
  onCancel?: () => void
}

export default function CreateReviewForm({
  campgroundId,
  onSuccess,
  onCancel,
}: CreateReviewFormProps) {
  const [rating, setRating] = useState(5)
  const [title, setTitle] = useState('')
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('campgroundId', campgroundId.toString())
      formData.append('rating', rating.toString())
      formData.append('title', title)
      formData.append('comment', comment)

      const result = await createReviewAction(formData)

      if (result.ok) {
        setTitle('')
        setComment('')
        setRating(5)
        onSuccess?.()
      } else {
        setError(result.error || 'Failed to create review')
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStars = (currentRating: number, interactive = true) => {
    return Array.from({ length: 5 }, (_, i) => (
      <button
        key={i}
        type="button"
        disabled={!interactive}
        onClick={() => interactive && setRating(i + 1)}
        className={`${effects.transition.default} ${
          i < currentRating ? patterns.rating.filled : patterns.rating.empty
        } ${interactive ? `cursor-pointer hover:scale-110` : 'cursor-default'}`}
      >
        <Star className={`w-6 h-6 ${i < currentRating ? 'fill-current' : ''}`} />
      </button>
    ))
  }

  return (
    <div className={`mb-6 p-6 ${darkMode.bg.secondary} rounded-lg ${darkMode.border.default}`}>
      <h3 className={`font-semibold ${darkMode.text.primary} mb-4 text-lg`}>Write a Review</h3>
      <form onSubmit={handleSubmit} className={patterns.form}>
        {error && (
          <div className={`p-3 ${patterns.badge.error} rounded-md`}>
            <p className={`text-sm text-red-600 dark:text-red-400`}>{error}</p>
          </div>
        )}

        <div>
          <label className={`block text-sm font-medium ${darkMode.text.primary} mb-2`}>
            Rating *
          </label>
          <div className="flex space-x-1 mb-1">{renderStars(rating)}</div>
          <p className={`text-xs ${darkMode.text.muted}`}>Click on a star to rate (1-5 stars)</p>
        </div>

        <div>
          <label className={`block text-sm font-medium ${darkMode.text.primary} mb-2`}>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`${patterns.input}`}
            placeholder="Summarize your experience"
          />
        </div>

        <div>
          <label className={`block text-sm font-medium ${darkMode.text.primary} mb-2`}>
            Comment *
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            className={`${patterns.input} resize-none`}
            placeholder="Share your experience with other campers"
            required
          />
        </div>

        <div className="flex space-x-3 pt-2">
          <Button type="submit" disabled={isSubmitting} className={`${patterns.button.primary}`}>
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className={`${patterns.button.outline}`}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
