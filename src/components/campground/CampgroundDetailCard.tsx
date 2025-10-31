'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { MapPin, Calendar, User } from 'lucide-react'
import { DeleteCampgroundButton } from './DeleteCampgroundButton'
import { patterns, effects, interactive, darkMode } from '@/lib/design-tokens'
import { BLUR_DATA_URLS } from '@/lib/image-utils'

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

  // Helper function to normalize URL (handle both string and JSON array)
  const normalizeUrl = (url: string): string => {
    // If it looks like a JSON array, parse it and get the first item
    if (url.startsWith('[') && url.endsWith(']')) {
      try {
        const parsed = JSON.parse(url)
        return Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : url
      } catch {
        return url
      }
    }
    return url
  }

  // Helper function to ensure proper Supabase URL
  const getImageUrl = (url: string): string => {
    const normalizedUrl = normalizeUrl(url)

    // If it's already a full URL, return as is
    if (normalizedUrl.startsWith('http://') || normalizedUrl.startsWith('https://')) {
      return normalizedUrl
    }

    // If it's just a filename, construct the Supabase public URL
    // Format: https://[supabase-project-id].supabase.co/storage/v1/object/public/campground-images/[filename]
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    if (supabaseUrl) {
      return `${supabaseUrl}/storage/v1/object/public/campground-images/${normalizedUrl}`
    }

    return normalizedUrl
  }

  // Helper function to validate URL
  const isValidUrl = (url: string): boolean => {
    try {
      const fullUrl = getImageUrl(url)
      new URL(fullUrl)
      return true
    } catch {
      return false
    }
  }

  // Filter out invalid URLs and construct proper URLs
  const validImages = campground.images
    .filter((img) => img.url && isValidUrl(img.url))
    .map((img) => ({
      ...img,
      url: getImageUrl(img.url),
    }))
  const currentImage = validImages[currentImageIndex] || null

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
    setCurrentImageIndex((prev) => (prev === validImages.length - 1 ? 0 : prev + 1))
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? validImages.length - 1 : prev - 1))
  }

  return (
    <div
      className={`${darkMode.bg.primary} rounded-lg shadow-lg overflow-hidden ${darkMode.border.default} border-2`}
    >
      {/* Image Carousel */}
      {validImages.length > 0 && currentImage && (
        <div className={`relative h-96 ${darkMode.bg.secondary}`}>
          <Image
            src={currentImage.url}
            alt={campground.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
            placeholder="blur"
            blurDataURL={BLUR_DATA_URLS.campground}
            quality={90}
          />

          {/* Carousel Controls */}
          {validImages.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className={`absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full ${effects.transition.colors} cursor-pointer`}
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
                className={`absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full ${effects.transition.colors} cursor-pointer`}
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
                    className={`w-2 h-2 rounded-full ${effects.transition.colors} cursor-pointer ${
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
        <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4 gap-4 md:gap-0">
          <div className="flex-1">
            <h1 className={`text-3xl font-bold ${darkMode.text.primary} mb-2`}>
              {campground.title}
            </h1>
            <div className={`flex items-center ${darkMode.text.secondary} mb-2`}>
              <MapPin className="w-4 h-4 mr-1" />
              <span>{campground.location}</span>
            </div>
          </div>
          <div className="text-left md:text-right">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
              {formatPrice(campground.price)}
            </div>
            <div className={`text-sm ${darkMode.text.muted}`}>per night</div>
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <p className={`${darkMode.text.secondary} leading-relaxed`}>{campground.description}</p>
        </div>

        {/* Owner Info */}
        <div
          className={`flex flex-col md:flex-row md:items-center md:justify-between mb-6 p-4 gap-4 md:gap-0 ${darkMode.bg.secondary} rounded-lg`}
        >
          <div className="flex items-center">
            <div
              className={`w-10 h-10 ${darkMode.bg.muted} rounded-full flex items-center justify-center mr-3 flex-shrink-0`}
            >
              {campground.owner.avatarUrl ? (
                <Image
                  src={campground.owner.avatarUrl}
                  alt={campground.owner.displayName || 'Owner'}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              ) : (
                <User className={`w-5 h-5 ${darkMode.text.muted}`} />
              )}
            </div>
            <div>
              <div className={`font-medium ${darkMode.text.primary}`}>
                {campground.owner.displayName || 'Anonymous'}
              </div>
              <div className={`text-sm ${darkMode.text.muted}`}>Campground Owner</div>
            </div>
          </div>
          <div className={`text-sm ${darkMode.text.muted} flex items-center md:ml-4`}>
            <Calendar className="w-4 h-4 mr-1 flex-shrink-0" />
            <span>Listed {formatDate(campground.createdAt)}</span>
          </div>
        </div>

        {/* Owner Actions */}
        {isOwner && (
          <div className={`flex space-x-4 pt-4 ${darkMode.border.default} border-t`}>
            <Link href={`/campgrounds/${campground.slug}/edit`}>
              <Button
                variant="outline"
                className={`${patterns.button.outline} flex items-center ${darkMode.text.primary} ${darkMode.border.default} hover:${darkMode.bg.secondary}`}
              >
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
