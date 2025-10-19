'use client'
import { useCallback, useMemo, useRef, useState, useEffect } from 'react'

export type UploadedImage = {
  url: string
  path: string
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

  // Helper to emit files only when user adds/removes files (not on progress updates)
  const emitFiles = useCallback(
    (list: UploadItem[]) => {
      if (onFilesChange) {
        // Use setTimeout to avoid setState during render
        setTimeout(() => {
          onFilesChange(list.filter((i) => i.status !== 'error').map((i) => i.file))
        }, 0)
      }
    },
    [onFilesChange]
  )

  const remainingSlots = useMemo(
    () => Math.max(0, maxImages - images.length - items.length),
    [maxImages, images.length, items.length]
  )

  const validate = (f: File): string | null => {
    if (!ACCEPTED.includes(f.type)) return 'Unsupported file type'
    if (f.size > MAX_SIZE_MB * 1024 * 1024) return `File too large (> ${MAX_SIZE_MB} MB)`
    return null
  }

  const startUploadsForNewItems = useCallback(
    async (newItems: UploadItem[]) => {
      if (!campgroundId || campgroundId === 'new') {
        console.log('Skipping upload for new campground - will upload after campground is created')
        // For new campgrounds, just keep items in "queued" state for now
        // They'll be uploaded after the campground is created
        return
      }

      // Process each new item for upload
      for (let i = 0; i < newItems.length; i++) {
        const newItem = newItems[i]
        if (newItem.error) continue

        // Find the index of this item in the current items array and upload
        setTimeout(() => {
          setItems((currentItems) => {
            const itemIndex = currentItems.findIndex(
              (item) => item.file === newItem.file && item.status === 'queued'
            )
            if (itemIndex >= 0) {
              uploadSingleItem(itemIndex)
            }
            return currentItems
          })
        }, i * 100) // Stagger uploads slightly
      }
    },
    [campgroundId]
  )

  const addFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return
      const toAdd: UploadItem[] = []
      const limit = Math.min(files.length, remainingSlots)
      for (let i = 0; i < limit; i++) {
        const file = files[i]
        const err = validate(file)
        toAdd.push({
          file,
          preview: URL.createObjectURL(file),
          progress: 0,
          status: err ? 'error' : 'queued',
          error: err ?? undefined,
        })
      }
      setItems((prev) => {
        const next = [...prev, ...toAdd]
        emitFiles(next) // <-- emit here only
        // Automatically start upload for newly added valid files
        setTimeout(() => startUploadsForNewItems(toAdd.filter((item) => !item.error)), 100)
        return next
      })
    },
    [remainingSlots, startUploadsForNewItems]
  )

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragOver(false)
      addFiles(e.dataTransfer.files)
    },
    [addFiles]
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
        return next
      })

      try {
        const { signedUrl, path, fullUrl } = await signUrl(currentItem.file.name)

        await uploadToSignedUrl(signedUrl, currentItem.file, (pct) => {
          setItems((prev) => {
            const next = [...prev]
            if (next[itemIndex]) {
              next[itemIndex].progress = pct
            }
            return next
          })
        })

        setItems((prev) => {
          const next = [...prev]
          if (next[itemIndex]) {
            next[itemIndex].status = 'done'
            next[itemIndex].path = path
            next[itemIndex].url = fullUrl
            next[itemIndex].progress = 100
          }
          return next
        })

        await recordImage(path, currentItem.file.name)

        // Update parent component with new image
        if (onChange) {
          const newImage: UploadedImage = { url: fullUrl, path }
          onChange([...images, newImage])
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

        // Remove completed item from local state after a short delay
        setTimeout(() => {
          setItems((prev) => prev.filter((_, idx) => idx !== itemIndex))
        }, 1500)
      } catch (e: any) {
        setItems((prev) => {
          const next = [...prev]
          if (next[itemIndex]) {
            next[itemIndex].status = 'error'
            next[itemIndex].error = e?.message || 'Upload failed'
          }
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
          onChange={(e) => addFiles(e.target.files)}
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

      {/* New upload items grid */}
      {items.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">New Uploads</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {items.map((it, i) => (
              <div key={i} className="relative overflow-hidden rounded-xl border">
                {/* Preview (lazy) */}
                <img
                  src={it.preview}
                  alt={it.file.name}
                  loading="lazy"
                  className="h-32 w-full object-cover"
                />
                {/* Status / progress */}
                <div className="absolute left-0 right-0 bottom-0">
                  {it.status === 'uploading' && (
                    <div className="h-1 bg-gray-200">
                      <div
                        className="h-1 bg-emerald-500 transition-all"
                        style={{ width: `${it.progress}%` }}
                      />
                    </div>
                  )}
                  {it.status === 'error' && (
                    <div className="text-xs bg-red-50 text-red-600 px-2 py-1">{it.error}</div>
                  )}
                  {it.status === 'done' && (
                    <div className="text-[10px] bg-emerald-600 text-white px-2 py-1">Uploaded</div>
                  )}
                  {it.status === 'queued' && (
                    <div className="text-[10px] bg-blue-600 text-white px-2 py-1">Ready</div>
                  )}
                </div>
                {/* Remove */}
                {it.status !== 'uploading' && (
                  <button
                    type="button"
                    onClick={() => removeItem(i)}
                    className="absolute top-1 right-1 rounded-full bg-white/90 hover:bg-white px-2 py-1 text-xs shadow"
                  >
                    ✕
                  </button>
                )}
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
