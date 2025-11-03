'use client'
import { useCallback, useMemo, useRef, useState, useEffect } from 'react'
import type { DragEvent } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { BLUR_DATA_URLS } from '@/lib/image-utils'

export type UploadedImage = {
  url: string
  path: string
}

// Helper function to dedupe by path
function dedupeByPath(arr: UploadedImage[]) {
  const seen = new Set<string>()
  return arr.filter((x) => (seen.has(x.path) ? false : (seen.add(x.path), true)))
}

// Handle multiple file uploads concurrently
async function handleChosenFiles(
  files: FileList | File[],
  images: UploadedImage[],
  onImagesChange: (next: UploadedImage[]) => void,
  supabase: ReturnType<typeof createClient>,
  max: number,
  campgroundId?: string
) {
  // respect remaining slots
  const remaining = Math.max(0, max - images.length)
  const fileArr = Array.from(files).slice(0, remaining)

  if (!fileArr.length) return

  // Upload all concurrently
  const results = await Promise.allSettled(
    fileArr.map(async (file) => {
      const ext = (file.name.split('.').pop() || 'jpg').toLowerCase()
      const path =
        campgroundId === 'new'
          ? `temp/${crypto.randomUUID()}.${ext}`
          : `campgrounds/${campgroundId}/${crypto.randomUUID()}.${ext}`

      const { error } = await supabase.storage.from('campground-images').upload(path, file, {
        upsert: false,
        contentType: file.type || undefined,
      })
      if (error) throw error

      const { data } = supabase.storage.from('campground-images').getPublicUrl(path)
      return { url: data.publicUrl, path } satisfies UploadedImage
    })
  )

  const successes = results
    .filter((r): r is PromiseFulfilledResult<UploadedImage> => r.status === 'fulfilled')
    .map((r) => r.value)

  if (successes.length) {
    onImagesChange(dedupeByPath([...images, ...successes]))
  }
}

type UploadItem = {
  file: File
  preview: string
  progress: number // 0..100
  status: 'queued' | 'uploading' | 'done' | 'error'
  error?: string
  path?: string // storage path
  url?: string // public URL
}

const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp', 'image/avif']
const MAX_SIZE_MB = 8
const MAX_FILES = 12

export default function UploadImages({
  campgroundId,
  images = [],
  onChange,
  onFilesChange,
  maxImages = MAX_FILES,
}: {
  campgroundId?: string
  images?: UploadedImage[]
  onChange?: (images: UploadedImage[]) => void
  onFilesChange?: (files: File[]) => void
  maxImages?: number
}) {
  const [items, setItems] = useState<UploadItem[]>([])
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const supabase = useMemo(() => createClient(), [])
  const imagesRef = useRef<UploadedImage[]>(images)
  const uploadedSetRef = useRef<Set<string>>(new Set())

  // Keep imagesRef in sync with images prop
  useEffect(() => {
    imagesRef.current = images
    // Keep a set of known paths to avoid duplicates
    const next = new Set<string>()
    for (const im of images) {
      if (im.path) next.add(im.path)
    }
    uploadedSetRef.current = next
  }, [images])

  // Helper to emit PENDING files (queued or uploading)
  const emitFiles = useCallback(
    (list: UploadItem[]) => {
      if (onFilesChange) {
        // Use setTimeout to avoid setState during render
        setTimeout(() => {
          const pending = list.filter((i) => i.status === 'queued' || i.status === 'uploading')
          onFilesChange(pending.map((i) => i.file))
        }, 0)
      }
    },
    [onFilesChange]
  )

  // Clean up any stuck items periodically
  useEffect(() => {
    const cleanup = () => {
      setItems((prev) => {
        const cleaned = prev.filter((item) => {
          // Remove items that have been done for more than 1 second
          if (item.status === 'done') {
            return false
          }
          return true
        })
        if (cleaned.length !== prev.length) {
          emitFiles(cleaned)
        }
        return cleaned
      })
    }

    const interval = setInterval(cleanup, 1000)
    return () => clearInterval(interval)
  }, [emitFiles])

  const remainingSlots = useMemo(() => {
    // Only count items that are actually pending (queued or uploading)
    const pendingCount = items.filter(
      (i) => i.status === 'queued' || i.status === 'uploading'
    ).length
    return Math.max(0, maxImages - images.length - pendingCount)
  }, [maxImages, images.length, items])

  const onDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault()
      setDragOver(false)
      if (e.dataTransfer?.files && onChange) {
        handleChosenFiles(e.dataTransfer.files, images, onChange, supabase, maxImages, campgroundId)
      }
    },
    [images, onChange, supabase, maxImages, campgroundId]
  )

  const chooseFiles = () => inputRef.current?.click()

  const removeExistingImage = (path: string) => {
    if (onChange) {
      const updatedImages = images.filter((img) => img.path !== path)
      onChange(updatedImages)
    }
  }

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={[
          'w-full rounded-2xl border-2 border-dashed p-6 cursor-pointer transition',
          dragOver ? 'border-emerald-500 bg-emerald-50' : 'border-gray-300 hover:border-gray-400',
          remainingSlots === 0 ? 'opacity-50 cursor-not-allowed' : '',
        ].join(' ')}
        onClick={remainingSlots > 0 ? chooseFiles : undefined}
        aria-label="Upload images"
      >
        <div className="text-center">
          <div className="font-medium">
            {remainingSlots > 0 ? 'Drag & drop images here' : 'Maximum images reached'}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            {remainingSlots > 0
              ? `or click to choose (JPEG, PNG, WebP, AVIF • up to ${MAX_SIZE_MB}MB • max ${maxImages} files)`
              : `${images.length + items.length}/${maxImages} images selected`}
          </div>
        </div>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ACCEPTED.join(',')}
          className="hidden"
          onChange={(e) => {
            if (e.target.files && onChange) {
              handleChosenFiles(e.target.files, images, onChange, supabase, maxImages, campgroundId)
              // Clear the input so users can select the same files again
              e.target.value = ''
            }
          }}
          disabled={remainingSlots === 0}
        />
      </div>

      {/* Existing images grid */}
      {images.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Current Images</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {images.map((img, i) => (
              <div key={`existing-${i}`} className="relative overflow-hidden rounded-xl border">
                <Image
                  src={img.url}
                  alt={`Current image ${i + 1}`}
                  width={128}
                  height={128}
                  className="h-32 w-full object-cover"
                  sizes="(max-width: 640px) 50vw, 25vw"
                  placeholder="blur"
                  blurDataURL={BLUR_DATA_URLS.default}
                  quality={75}
                />
                <div className="absolute left-0 right-0 bottom-0">
                  <div className="text-[10px] bg-green-600 text-white px-2 py-1">Current</div>
                </div>
                <button
                  type="button"
                  onClick={() => removeExistingImage(img.path)}
                  className="absolute top-1 right-1 rounded-full bg-white cursor-pointer hover:bg-gray-100 text-black px-2 py-1 text-xs shadow-lg transition-colors duration-200 flex items-center justify-center w-6 h-6"
                  aria-label="Remove image"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {remainingSlots > 0 && (
        <div className="text-sm text-gray-500 text-center">{remainingSlots} slots remaining</div>
      )}
    </div>
  )
}
