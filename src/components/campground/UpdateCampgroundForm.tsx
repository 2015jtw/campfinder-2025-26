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
    <form action={handleSubmit} className="space-y-4 rounded-2xl border bg-white p-4">
      <input type="hidden" name="id" value={campground.id} />

      <div>
        <label className="block text-sm font-medium">Title</label>
        <input
          name="title"
          defaultValue={campground.title}
          className="mt-1 w-full rounded-xl border px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Description</label>
        <textarea
          name="description"
          defaultValue={campground.description}
          className="mt-1 w-full rounded-xl border px-3 py-2"
          rows={5}
          required
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium">Location</label>
          <input
            name="location"
            defaultValue={campground.location}
            className="mt-1 w-full rounded-xl border px-3 py-2"
            required
          />
          {geocodingStatus && <p className="text-sm text-blue-600 mt-1">{geocodingStatus}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium">Price (per night)</label>
          <input
            name="price"
            type="number"
            min={0}
            step="0.01"
            defaultValue={campground.price}
            className="mt-1 w-full rounded-xl border px-3 py-2"
            required
          />
        </div>
      </div>

      {/* Map Pin Selector */}
      <div>
        <label className="block text-sm font-medium mb-2">Pin Location on Map</label>
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
            <p className="text-xs text-gray-500 mt-2">
              📍 Original coordinates: {campground.latitude.toFixed(6)},{' '}
              {campground.longitude.toFixed(6)}
            </p>
          )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Images</label>
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
          className="rounded-xl bg-gray-200 hover:bg-gray-300 px-4 py-2 text-gray-700 transition-colors"
        >
          Cancel
        </button>
        <SubmitButton isPending={isPending} geocodingStatus={geocodingStatus}>
          Save changes
        </SubmitButton>
      </div>
    </form>
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
      className="rounded-xl bg-black px-4 py-2 text-white disabled:opacity-60"
    >
      {isPending ? (geocodingStatus ? 'Geocoding & Saving…' : 'Saving…') : children}
    </button>
  )
}
