'use client'

import { useFormStatus } from 'react-dom'
import { updateCampgroundAction } from '@/app/campgrounds/actions'
import { useTransition, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import type { UpdateCampgroundActionResult } from '@/lib/validations/campground'
import UploadImages, { type UploadedImage } from '@/components/campground/UploadImages'
import MapPinSelector from '@/components/maps/MapPinSelector'
import { createClient } from '@/lib/supabase/client'
import { patterns, effects, interactive, darkMode } from '@/lib/design-tokens'
import { LoadingSpinner, LoadingOverlay } from '@/components/ui/loading-spinner'

type Campground = {
  id: number // Changed from string to number to match database schema
  title: string
  description: string
  location: string
  price: number
  images: string[] // Array of URLs that will be converted to newline-separated string
  latitude?: number | null
  longitude?: number | null
}

export default function UpdateCampgroundForm({ campground }: { campground: Campground }) {
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

  // Convert existing URLs to UploadedImage format (with unique paths for existing images)
  const existingImages: UploadedImage[] = (campground.images ?? []).map((url, index) => ({
    url: normalizeUrl(url),
    path: `existing-${campground.id}-${index}`, // Unique identifier for existing images
  }))

  const [images, setImages] = useState<UploadedImage[]>(existingImages)
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(
    campground.latitude && campground.longitude
      ? { lat: campground.latitude, lng: campground.longitude }
      : null
  )
  const [isPending, startTransition] = useTransition()
  const [geocodingStatus, setGeocodingStatus] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (formData: FormData) => {
    // Add current images URLs to form data (as newline-separated string)
    const imageUrls = images.map((img) => img.url)
    formData.set('images', imageUrls.join('\n'))

    // Add coordinates if manually set
    if (coordinates) {
      formData.set('latitude', coordinates.lat.toString())
      formData.set('longitude', coordinates.lng.toString())
      formData.set('useManualCoordinates', 'true')
    } else {
      setGeocodingStatus('🗺️ Checking location for updates...')
    }

    startTransition(async () => {
      const result: UpdateCampgroundActionResult = await updateCampgroundAction(formData)

      setGeocodingStatus(null)

      if (result.ok) {
        toast.success('Campground updated successfully!')
        router.push(`/campgrounds/${result.slug}`)
      } else {
        toast.error(result.error || 'Failed to update campground')
      }
    })
  }

  const handleImagesChange = useCallback((newImages: UploadedImage[]) => {
    setImages(newImages)
  }, [])

  return (
    <LoadingOverlay isLoading={isPending} loadingText={geocodingStatus || 'Updating campground...'}>
      <form
        action={handleSubmit}
        className={`space-y-4 rounded-2xl border ${darkMode.bg.primary} ${darkMode.border.default} p-4`}
      >
        <input type="hidden" name="id" value={campground.id} />

        <div>
          <label className={`block text-sm font-medium ${darkMode.text.primary}`}>Title</label>
          <input
            name="title"
            defaultValue={campground.title}
            className={`mt-1 w-full rounded-xl border px-3 py-2 ${darkMode.bg.primary} ${darkMode.border.default} ${darkMode.text.primary} focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20`}
            required
          />
        </div>

        <div>
          <label className={`block text-sm font-medium ${darkMode.text.primary}`}>
            Description
          </label>
          <textarea
            name="description"
            defaultValue={campground.description}
            className={`mt-1 w-full rounded-xl border px-3 py-2 ${darkMode.bg.primary} ${darkMode.border.default} ${darkMode.text.primary} focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20`}
            rows={5}
            required
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={`block text-sm font-medium ${darkMode.text.primary}`}>Location</label>
            <input
              name="location"
              defaultValue={campground.location}
              className={`mt-1 w-full rounded-xl border px-3 py-2 ${darkMode.bg.primary} ${darkMode.border.default} ${darkMode.text.primary} focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20`}
              required
            />
            {geocodingStatus && (
              <p className={`text-sm text-blue-600 dark:text-blue-400 mt-1`}>{geocodingStatus}</p>
            )}
          </div>
          <div>
            <label className={`block text-sm font-medium ${darkMode.text.primary}`}>
              Price (per night)
            </label>
            <input
              name="price"
              type="number"
              min={0}
              step="0.01"
              defaultValue={campground.price}
              className={`mt-1 w-full rounded-xl border px-3 py-2 ${darkMode.bg.primary} ${darkMode.border.default} ${darkMode.text.primary} focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20`}
              required
            />
          </div>
        </div>

        {/* Map Pin Selector */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${darkMode.text.primary}`}>
            Pin Location on Map
          </label>
          <MapPinSelector
            latitude={coordinates?.lat}
            longitude={coordinates?.lng}
            onCoordinatesChange={(lat, lng) => setCoordinates({ lat, lng })}
            onClear={() => setCoordinates(null)}
            height={350}
          />
          {campground.latitude !== null &&
            campground.latitude !== undefined &&
            campground.longitude !== null &&
            campground.longitude !== undefined &&
            !coordinates && (
              <p className={`text-xs ${darkMode.text.muted} mt-2`}>
                📍 Original coordinates: {campground.latitude.toFixed(6)},{' '}
                {campground.longitude.toFixed(6)}
              </p>
            )}
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${darkMode.text.primary}`}>
            Images
          </label>
          <UploadImages
            campgroundId={campground.id.toString()}
            images={images}
            onChange={handleImagesChange}
            onComplete={(completedItems) => {
              console.log('Upload completed:', completedItems)
            }}
            autoRecord={false} // Don't record in DB, we handle it in the form submission
            maxImages={10}
          />
          {/* Keep server action happy with hidden input */}
          <input type="hidden" name="images" value={images.map((i) => i.url).join('\n')} />
        </div>

        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={() => router.back()}
            className={`bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold px-6 py-2 rounded-lg cursor-pointer transition-all duration-200`}
          >
            Cancel
          </button>
          <SubmitButton isPending={isPending} geocodingStatus={geocodingStatus}>
            Save changes
          </SubmitButton>
        </div>
      </form>
    </LoadingOverlay>
  )
}

function SubmitButton({
  children,
  isPending,
  geocodingStatus,
}: {
  children: React.ReactNode
  isPending: boolean
  geocodingStatus?: string | null
}) {
  return (
    <button
      type="submit"
      disabled={isPending}
      className={`${patterns.button.primary} ${interactive.disabled}`}
    >
      {isPending ? (
        <div className="flex items-center gap-2">
          <LoadingSpinner size="sm" />
          <span>{geocodingStatus ? 'Geocoding & Saving…' : 'Saving…'}</span>
        </div>
      ) : (
        children
      )}
    </button>
  )
}
