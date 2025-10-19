'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { CreateCampgroundSchema, type CreateCampgroundInput } from '@/lib/validations/campground'
import { useState, useEffect, useCallback } from 'react'
import UploadImages, { type UploadedImage } from '@/components/campground/UploadImages'
import MapPinSelector from '@/components/maps/MapPinSelector'
import { createCampgroundAction } from '@/app/campgrounds/actions'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

// shadcn/ui
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'

export default function NewCampgroundForm() {
  const router = useRouter()
  const [images, setImages] = useState<UploadedImage[]>([])
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)
  const [geocodingStatus, setGeocodingStatus] = useState<string | null>(null)
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null)

  const form = useForm<CreateCampgroundInput>({
    resolver: zodResolver(CreateCampgroundSchema),
    defaultValues: {
      title: '',
      description: '',
      price: '',
      location: '',
      images: [],
    },
    mode: 'onChange',
  })

  // Handle hydration mismatch from browser extensions
  useEffect(() => {
    setIsHydrated(true)
  }, [])

  // Stable callback identity prevents extra re-renders
  const handleFilesChange = useCallback((files: File[]) => {
    setImageFiles(files)
  }, [])

  // Show loading skeleton during hydration
  if (!isHydrated) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-2 w-16"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-2 w-20"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-2 w-24"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-2 w-16"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-2 w-24"></div>
          <div className="h-24 bg-gray-200 rounded"></div>
        </div>
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded w-32 ml-auto"></div>
        </div>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form
        className="space-y-6"
        suppressHydrationWarning
        action={async (formData: FormData) => {
          setIsSubmitting(true)

          // Add form values to FormData
          const formValues = form.getValues()
          formData.set('title', formValues.title)
          formData.set('description', formValues.description)
          formData.set('price', formValues.price)
          formData.set('location', formValues.location)
          // For new campgrounds, append the actual files to FormData
          imageFiles.forEach((file, index) => {
            formData.append(`imageFile_${index}`, file);
          });
          formData.set('imageCount', imageFiles.length.toString());

          // Add coordinates if manually set (these take precedence over geocoding)
          if (coordinates) {
            formData.set('latitude', coordinates.lat.toString())
            formData.set('longitude', coordinates.lng.toString())
            formData.set('useManualCoordinates', 'true')
          } else {
            setGeocodingStatus('🗺️ Geocoding location...')
          }

          const res = await createCampgroundAction(formData)
          setGeocodingStatus(null)

          if (res.ok) {
            toast.success('Campground created successfully!')
            router.push(`/campgrounds/${res.slug}`)
          } else {
            // Handle validation errors
            if (res.errors) {
              Object.entries(res.errors).forEach(([key, value]) => {
                if (key === '_form') {
                  // Global form error
                  form.setError('root', {
                    type: 'server',
                    message: typeof value === 'string' ? value : 'An error occurred',
                  })
                } else {
                  // Field-specific errors
                  form.setError(key as keyof CreateCampgroundInput, {
                    type: 'server',
                    message: Array.isArray(value) ? value[0] : String(value),
                  })
                }
              })
            }
            toast.error('Failed to create campground. Please check the form and try again.')
          }

          setIsSubmitting(false)
        }}
      >
        {/* Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Yosemite Valley" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Location & Price row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="Arlington, Virginia" {...field} />
                </FormControl>
                <FormMessage />
                {geocodingStatus && <p className="text-sm text-blue-600 mt-1">{geocodingStatus}</p>}
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price per night</FormLabel>
                <FormControl>
                  <Input
                    placeholder="25.00"
                    inputMode="decimal"
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value.replace(/[^0-9.]/g, ''))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Map Pin Selector */}
        <FormItem>
          <FormLabel>Pin Location on Map (Optional)</FormLabel>
          <MapPinSelector
            latitude={coordinates?.lat}
            longitude={coordinates?.lng}
            onCoordinatesChange={(lat, lng) => setCoordinates({ lat, lng })}
            onClear={() => setCoordinates(null)}
            height={400}
          />
          <FormDescription>
            Drop a pin on the map for precise coordinates, or leave empty to geocode the location
            automatically
          </FormDescription>
        </FormItem>

        {/* Images */}
        <FormItem>
          <FormLabel>Images</FormLabel>
          <UploadImages
            campgroundId="new" // temporary ID for new campgrounds
            images={images}
            onChange={(imgs) => {
              setImages(imgs)
              form.setValue(
                'images',
                imgs.map((img) => ({ url: img.url })),
                { shouldValidate: true }
              )
            }}
            onFilesChange={handleFilesChange}
            onComplete={(completedItems) => {
              console.log('Upload completed:', completedItems)
            }}
            autoRecord={false} // Don't record in DB until campground is created
            maxImages={10}
          />
          {form.formState.errors.images && (
            <FormMessage>{form.formState.errors.images.message}</FormMessage>
          )}
        </FormItem>

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea rows={6} placeholder="Tell campers about this spot…" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Global form errors */}
        {form.formState.errors.root && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-sm text-red-600">{form.formState.errors.root.message}</p>
          </div>
        )}

        <div className="flex justify-end">
          <Button 
            type="submit" 
            disabled={
              isSubmitting || 
              !form.watch('title') || 
              !form.watch('description') || 
              !form.watch('price') || 
              !form.watch('location')
            }
          >
            {isSubmitting
              ? geocodingStatus
                ? 'Geocoding & Creating...'
                : 'Creating...'
              : 'Create Campground'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
