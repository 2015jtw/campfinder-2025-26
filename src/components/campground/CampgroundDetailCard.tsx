'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { MapPin, Calendar, User } from 'lucide-react'
import { DeleteCampgroundButton } from './DeleteCampgroundButton'

interface CampgroundDetailCardProps {
  campground: {
    id: number
    slug: string
    title: string
    description: string
    price: number
    location: string
    latitude: number | null
    longitude: number | null
    createdAt: Date
    owner: {
      id: string
      displayName: string | null
      avatarUrl: string | null
    }
    images: Array<{
      id: number
      url: string
      sortOrder: number
    }>
  }
  isOwner: boolean
}

export default function CampgroundDetailCard({ campground, isOwner }: CampgroundDetailCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date)
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev === campground.images.length - 1 ? 0 : prev + 1))
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? campground.images.length - 1 : prev - 1))
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Image Carousel */}
      {campground.images.length > 0 && (
        <div className="relative h-96 bg-gray-100">
          <Image
            src={campground.images[currentImageIndex].url}
            alt={campground.title}
            fill
            className="object-cover"
            priority
          />

          {/* Carousel Controls */}
          {campground.images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                aria-label="Previous image"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                aria-label="Next image"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>

              {/* Image Indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                {campground.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>

              {/* Image Counter */}
              <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                {currentImageIndex + 1} / {campground.images.length}
              </div>
            </>
          )}
        </div>
      )}

      {/* Campground Details */}
      <div className="p-6">
        {/* Header with Title and Price */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{campground.title}</h1>
            <div className="flex items-center text-gray-600 mb-2">
              <MapPin className="w-4 h-4 mr-1" />
              <span>{campground.location}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-green-600">{formatPrice(campground.price)}</div>
            <div className="text-sm text-gray-500">per night</div>
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <p className="text-gray-700 leading-relaxed">{campground.description}</p>
        </div>

        {/* Owner Info */}
        <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-3">
              {campground.owner.avatarUrl ? (
                <Image
                  src={campground.owner.avatarUrl}
                  alt={campground.owner.displayName || 'Owner'}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              ) : (
                <User className="w-5 h-5 text-gray-600" />
              )}
            </div>
            <div>
              <div className="font-medium text-gray-900">
                {campground.owner.displayName || 'Anonymous'}
              </div>
              <div className="text-sm text-gray-500">Campground Owner</div>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            <Calendar className="w-4 h-4 inline mr-1" />
            Listed {formatDate(campground.createdAt)}
          </div>
        </div>

        {/* Owner Actions */}
        {isOwner && (
          <div className="flex space-x-4 pt-4 border-t">
            <Link href={`/campgrounds/${campground.slug}/edit`}>
              <Button variant="outline" className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Edit Campground
              </Button>
            </Link>
            <DeleteCampgroundButton id={campground.id} />
          </div>
        )}
      </div>
    </div>
  )
}
