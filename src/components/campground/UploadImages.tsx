'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'

export interface UploadedImage {
  url: string
  path: string
}

interface UploadImagesProps {
  images: UploadedImage[]
  onChange: (images: UploadedImage[]) => void
  maxImages?: number
}

export default function UploadImages({ images, onChange, maxImages = 10 }: UploadImagesProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const supabase = createClient()
  const bucket = 'campground-images'

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setIsAuthenticated(!!session)
    }
    checkAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    
    // Check authentication first
    if (!isAuthenticated) {
      setError('You must be logged in to upload images')
      return
    }
    
    // Check if adding these files would exceed the limit
    if (images.length + files.length > maxImages) {
      setError(`You can only upload up to ${maxImages} images`)
      return
    }

    setLoading(true)
    setError(null)

    const uploads: UploadedImage[] = []
    
    for (const file of Array.from(files)) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        console.warn(`Skipping non-image file: ${file.name}`)
        continue
      }

      // Validate file size (e.g., 5MB limit)
      const maxSize = 5 * 1024 * 1024 // 5MB
      if (file.size > maxSize) {
        setError(`File ${file.name} is too large. Maximum size is 5MB.`)
        continue
      }

      const ext = file.name.split('.').pop()?.toLowerCase()
      const path = `${crypto.randomUUID()}.${ext}`
      
      // Ensure we have a valid session before uploading
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      if (sessionError || !session) {
        setError('Authentication required for file upload')
        continue
      }
      
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(path, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (uploadError) {
        console.error('Upload error:', uploadError)
        setError(`Failed to upload ${file.name}`)
        continue
      }

      const { data } = supabase.storage.from(bucket).getPublicUrl(path)
      uploads.push({ url: data.publicUrl, path })
    }

    if (uploads.length > 0) {
      const next = [...images, ...uploads]
      onChange(next)
    }

    setLoading(false)
  }

  async function remove(path: string) {
    // Remove from Supabase storage
    const { error } = await supabase.storage.from(bucket).remove([path])
    if (error) {
      console.error('Error removing file:', error)
      setError('Failed to remove image')
      return
    }

    // Remove from local state
    const next = images.filter((i) => i.path !== path)
    onChange(next)
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload Images ({images.length}/{maxImages})
        </label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => handleFiles(e.target.files)}
          disabled={loading || images.length >= maxImages || !isAuthenticated}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
        />
        {images.length >= maxImages && (
          <p className="text-sm text-amber-600 mt-1">
            Maximum number of images reached
          </p>
        )}
        {!isAuthenticated && (
          <p className="text-sm text-red-600 mt-1">
            Please log in to upload images
          </p>
        )}
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
            <div key={img.path} className="relative group">
              <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={img.url}
                  alt={`Upload ${index + 1}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-200"
                />
              </div>
              <button
                type="button"
                onClick={() => remove(img.path)}
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
          <p className="mt-2 text-sm text-gray-600">
            Click the upload button above to add images
          </p>
        </div>
      )}
    </div>
  )
}
