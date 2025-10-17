'use client'

import { useFormStatus } from 'react-dom'
import { updateCampgroundAction } from '@/app/campgrounds/actions'
import { useTransition, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import type { UpdateCampgroundActionResult } from '@/lib/validations/campground'
import UploadImages, { type UploadedImage } from '@/components/campground/UploadImages'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'

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
  // Convert existing URLs to UploadedImage format (with unique paths for existing images)
  const existingImages: UploadedImage[] = (campground.images ?? []).map((url, index) => ({
    url,
    path: `existing-${index}`, // Unique identifier for existing images
  }))

  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>(existingImages)
  const [isPending, startTransition] = useTransition()
  const [geocodingStatus, setGeocodingStatus] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (formData: FormData) => {
    // Add current images URLs to form data
    const imageUrls = uploadedImages.map((img) => img.url)
    formData.set('images', imageUrls.join('\n'))

    startTransition(async () => {
      setGeocodingStatus('🗺️ Checking location for updates...')

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

  const handleImagesChange = (newImages: UploadedImage[]) => {
    setUploadedImages(newImages)
  }

  // Custom remove handler that doesn't try to delete existing images from storage
  const customRemove = async (path: string) => {
    if (path.startsWith('existing-')) {
      // This is an existing image, just remove from state (don't delete from storage)
      const next = uploadedImages.filter((i) => i.path !== path)
      setUploadedImages(next)
    } else {
      // This is a newly uploaded image, remove from both storage and state
      const { error } = await supabase.storage.from('campground-images').remove([path])
      if (error) {
        console.error('Error removing file:', error)
        toast.error('Failed to remove image')
        return
      }

      const next = uploadedImages.filter((i) => i.path !== path)
      setUploadedImages(next)
    }
  }

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
          {campground.latitude && campground.longitude && (
            <p className="text-xs text-gray-500 mt-1">
              📍 Current coordinates: {campground.latitude.toFixed(6)}, {campground.longitude.toFixed(6)}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium">Price (per night)</label>
          <input
            name="price"
            type="number"
            min={0}
            defaultValue={campground.price}
            className="mt-1 w-full rounded-xl border px-3 py-2"
            required
          />
        </div>
      </div>

      <div>
        <UpdateImageManager
          images={uploadedImages}
          onChange={handleImagesChange}
          onRemove={customRemove}
          maxImages={10}
        />
      </div>

      <SubmitButton isPending={isPending} geocodingStatus={geocodingStatus}>
        Save changes
      </SubmitButton>
    </form>
  )
}

function UpdateImageManager({
  images,
  onChange,
  onRemove,
  maxImages,
}: {
  images: UploadedImage[]
  onChange: (images: UploadedImage[]) => void
  onRemove: (path: string) => Promise<void>
  maxImages: number
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    if (images.length + files.length > maxImages) {
      setError(`You can only upload up to ${maxImages} images`)
      return
    }

    setLoading(true)
    setError(null)

    const uploads: UploadedImage[] = []

    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) {
        console.warn(`Skipping non-image file: ${file.name}`)
        continue
      }

      const maxSize = 5 * 1024 * 1024 // 5MB
      if (file.size > maxSize) {
        setError(`File ${file.name} is too large. Maximum size is 5MB.`)
        continue
      }

      const ext = file.name.split('.').pop()?.toLowerCase()
      const path = `${crypto.randomUUID()}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('campground-images')
        .upload(path, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (uploadError) {
        console.error('Upload error:', uploadError)
        setError(`Failed to upload ${file.name}`)
        continue
      }

      const { data } = supabase.storage.from('campground-images').getPublicUrl(path)
      uploads.push({ url: data.publicUrl, path })
    }

    if (uploads.length > 0) {
      const next = [...images, ...uploads]
      onChange(next)
    }

    setLoading(false)
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Images ({images.length}/{maxImages})
        </label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => handleFiles(e.target.files)}
          disabled={loading || images.length >= maxImages}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
        />
      </div>

      {loading && (
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <p className="text-sm text-gray-600">Uploading images...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-sm text-red-600">{error}</p>
          <button
            type="button"
            onClick={() => setError(null)}
            className="text-xs text-red-500 hover:text-red-700 mt-1"
          >
            Dismiss
          </button>
        </div>
      )}

      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {images.map((img, index) => (
            <div key={`${img.path}-${index}`} className="relative group">
              <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={img.url}
                  alt={`Image ${index + 1}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-200"
                />
              </div>
              <button
                type="button"
                onClick={() => onRemove(img.path)}
                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg"
                title="Remove image"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {images.length === 0 && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p className="mt-2 text-sm text-gray-600">Click the upload button above to add images</p>
        </div>
      )}
    </div>
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
