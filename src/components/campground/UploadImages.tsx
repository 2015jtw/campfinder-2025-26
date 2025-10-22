'use client'
import { useCallback, useMemo, useRef, useState, useEffect } from 'react'
import type { DragEvent } from 'react'
import { createClient } from '@/lib/supabase/client'

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
  onComplete,
  onFilesChange,
  autoRecord = true, // hit /api/images/record after upload
  maxImages = MAX_FILES,
}: {
  campgroundId?: string
  images?: UploadedImage[]
  onChange?: (images: UploadedImage[]) => void
  onComplete?: (items: UploadItem[]) => void
  onFilesChange?: (files: File[]) => void
  autoRecord?: boolean
  maxImages?: number
}) {
  const [items, setItems] = useState<UploadItem[]>([])
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const supabase = useMemo(() => createClient(), [])
  const imagesRef = useRef<UploadedImage[]>(images)
  const uploadedSetRef = useRef<Set<string>>(new Set())
  const queuedFilesRef = useRef<Set<string>>(new Set())
  const startedUploadsRef = useRef<Set<string>>(new Set())

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

  const validate = (f: File): string | null => {
    if (!ACCEPTED.includes(f.type)) return 'Unsupported file type'
    if (f.size > MAX_SIZE_MB * 1024 * 1024) return `File too large (> ${MAX_SIZE_MB} MB)`
    return null
  }

  const addFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return

      // Validate files first
      const validFiles: File[] = []
      for (let i = 0; i < files.length && validFiles.length < remainingSlots; i++) {
        const file = files[i]
        const err = validate(file)
        if (!err) {
          validFiles.push(file)
        }
      }

      if (validFiles.length > 0 && onChange) {
        // Use the new concurrent upload approach
        handleChosenFiles(validFiles, images, onChange, supabase, maxImages, campgroundId)
      }
    },
    [remainingSlots, images, onChange, supabase, maxImages, campgroundId]
  )

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

  const signUrl = async (originalName: string) => {
    if (!campgroundId) {
      throw new Error('Campground ID is required for file upload')
    }
    const res = await fetch('/api/images/sign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ campgroundId, originalName }),
    })
    if (!res.ok) throw new Error(await res.text())
    return res.json() as Promise<{ signedUrl: string; path: string; fullUrl: string }>
  }

  // PUT with progress (XHR so we get progress events reliably)
  const uploadToSignedUrl = (signedUrl: string, file: File, onProgress: (pct: number) => void) =>
    new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.open('PUT', signedUrl)
      xhr.setRequestHeader('Content-Type', file.type)
      xhr.upload.onprogress = (evt) => {
        if (evt.lengthComputable) onProgress(Math.round((evt.loaded / evt.total) * 100))
      }
      xhr.onload = () =>
        xhr.status >= 200 && xhr.status < 300
          ? resolve()
          : reject(new Error(`Upload failed (${xhr.status})`))
      xhr.onerror = () => reject(new Error('Network error during upload'))
      xhr.send(file)
    })

  const recordImage = async (path: string, alt?: string) => {
    if (!autoRecord || !campgroundId) return
    await fetch('/api/images/record', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ campgroundId, path, alt }),
    })
  }

  const uploadSingleItem = useCallback(
    async (itemIndex: number) => {
      if (!campgroundId) {
        console.error('Cannot upload: campgroundId is required')
        return
      }

      // Get current item
      const currentItems = items
      const currentItem = currentItems[itemIndex]
      if (!currentItem || currentItem.status !== 'queued' || currentItem.error) return

      // Mark as uploading
      setItems((prev) => {
        const next = [...prev]
        if (next[itemIndex]) {
          next[itemIndex].status = 'uploading'
        }
        emitFiles(next)
        return next
      })

      try {
        const fileKey = `${currentItem.file.name}|${currentItem.file.size}|${currentItem.file.lastModified}`
        if (startedUploadsRef.current.has(fileKey)) return
        startedUploadsRef.current.add(fileKey)

        const { signedUrl, path, fullUrl } = await signUrl(currentItem.file.name)

        await uploadToSignedUrl(signedUrl, currentItem.file, (pct) => {
          setItems((prev) => {
            const next = [...prev]
            if (next[itemIndex]) {
              next[itemIndex].progress = pct
            }
            emitFiles(next)
            return next
          })
        })

        // Immediately remove completed item from local state to avoid UI confusion
        setItems((prev) => {
          const next = prev.filter((_, idx) => idx !== itemIndex)
          emitFiles(next)
          return next
        })

        await recordImage(path, currentItem.file.name)

        // Update parent component with new image (strong dedupe by path)
        if (onChange) {
          const newImage: UploadedImage = { url: fullUrl, path }
          if (uploadedSetRef.current.has(path)) {
            // already processed
          } else {
            uploadedSetRef.current.add(path)
            onChange([...images, newImage])
          }
        }

        // Call onComplete for this single item
        const completedItem: UploadItem = {
          ...currentItem,
          status: 'done',
          path,
          url: fullUrl,
          progress: 100,
        }
        onComplete?.([completedItem])

        // Item already removed above
      } catch (e: any) {
        setItems((prev) => {
          const next = [...prev]
          if (next[itemIndex]) {
            next[itemIndex].status = 'error'
            next[itemIndex].error = e?.message || 'Upload failed'
          }
          emitFiles(next)
          return next
        })
      }
    },
    [campgroundId, images, onChange, onComplete]
  )

  const removeItem = (i: number) => {
    setItems((prev) => {
      const next = [...prev]
      const [removed] = next.splice(i, 1)
      if (removed?.preview) URL.revokeObjectURL(removed.preview)
      emitFiles(next) // <-- and emit here
      return next
    })
  }

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
                <img
                  src={img.url}
                  alt={`Current image ${i + 1}`}
                  loading="lazy"
                  className="h-32 w-full object-cover"
                />
                <div className="absolute left-0 right-0 bottom-0">
                  <div className="text-[10px] bg-green-600 text-white px-2 py-1">Current</div>
                </div>
                <button
                  type="button"
                  onClick={() => removeExistingImage(img.path)}
                  className="absolute top-1 right-1 rounded-full bg-white/90 hover:bg-white px-2 py-1 text-xs shadow"
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
