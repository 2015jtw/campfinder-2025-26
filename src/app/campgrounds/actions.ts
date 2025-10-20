'use server'

import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { randomUUID } from 'crypto'
import {
  CreateCampgroundSchema,
  slugify,
  type CreateCampgroundActionResult,
  type UpdateCampgroundActionResult,
} from '@/lib/validations/campground'

// Review validation schemas
const CreateReviewSchema = z.object({
  campgroundId: z.coerce.number().int().positive(),
  rating: z.coerce.number().int().min(1).max(5),
  title: z.string().optional(),
  comment: z.string().min(1, 'Comment is required'),
})

type CreateReviewActionResult = { ok: true; id: number } | { ok: false; error: string }

type DeleteReviewActionResult = { ok: true } | { ok: false; error: string }

// Geocoding helper function
async function geocodeLocation(
  location: string
): Promise<{ latitude: number; longitude: number } | null> {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
  if (!token) {
    console.warn('Missing NEXT_PUBLIC_MAPBOX_TOKEN for geocoding')
    return null
  }

  try {
    const query = encodeURIComponent(location)
    const url = `https://api.mapbox.com/search/geocode/v6/forward?q=${query}&access_token=${token}&limit=1`

    const res = await fetch(url)
    if (!res.ok) {
      console.error('Geocoding failed:', res.status)
      return null
    }

    const json = await res.json()
    const feature = json?.features?.[0]
    if (!feature?.geometry?.coordinates) {
      console.error('No coordinates found for location:', location)
      return null
    }

    const [longitude, latitude] = feature.geometry.coordinates
    return { latitude, longitude }
  } catch (error) {
    console.error('Geocoding error:', error)
    return null
  }
}

export async function createCampgroundAction(
  formData: FormData
): Promise<CreateCampgroundActionResult> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Parse images JSON (array of { url }) coming from client
  let uploadedImages: { url: string }[] = []
  try {
    const imagesJson = String(formData.get('images') ?? '[]')
    const parsedImages = JSON.parse(imagesJson)
    if (Array.isArray(parsedImages)) {
      uploadedImages = parsedImages.filter((i) => i && typeof i.url === 'string')
    }
  } catch (e) {
    return { ok: false, errors: { images: ['Invalid image data'] } }
  }

  // NOTE: Do not accept raw files via server actions to avoid body size limits (413).

  const raw = {
    title: String(formData.get('title') ?? ''),
    description: String(formData.get('description') ?? ''),
    price: String(formData.get('price') ?? ''),
    location: String(formData.get('location') ?? ''),
    latitude: formData.get('latitude') ? Number(formData.get('latitude')) : undefined,
    longitude: formData.get('longitude') ? Number(formData.get('longitude')) : undefined,
    images: uploadedImages,
  }

  const parsed = CreateCampgroundSchema.safeParse(raw)
  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors
    return { ok: false, errors: fieldErrors }
  }

  const data = parsed.data

  // Check if manual coordinates were provided (from map pin)
  const useManualCoordinates = formData.get('useManualCoordinates') === 'true'
  let latitude = data.latitude
  let longitude = data.longitude

  if (useManualCoordinates && latitude !== undefined && longitude !== undefined) {
    // User dropped a pin on the map - use these coordinates as source of truth
    console.log('✅ Using manual coordinates from map pin:', { latitude, longitude })
  } else if ((!latitude || !longitude) && data.location) {
    // No manual coordinates - fall back to geocoding the location
    console.log('🗺️ Geocoding location:', data.location)
    const coords = await geocodeLocation(data.location)
    if (coords) {
      latitude = coords.latitude
      longitude = coords.longitude
      console.log('✅ Geocoded coordinates:', latitude, longitude)
    } else {
      console.warn('⚠️ Geocoding failed, creating campground without coordinates')
    }
  }

  // Generate unique slug from title
  const slug = slugify(data.title)
  let uniqueSlug = slug
  let counter = 1

  // Check for existing slugs and make it unique
  while (await prisma.campground.findUnique({ where: { slug: uniqueSlug } })) {
    uniqueSlug = `${slug}-${counter}`
    counter++
  }

  try {
    const created = await prisma.campground.create({
      data: {
        title: data.title,
        slug: uniqueSlug,
        description: data.description,
        price: data.price, // Prisma handles Decimal conversion from string
        location: data.location,
        latitude: latitude ?? null,
        longitude: longitude ?? null,
        userId: user.id,
        images: {
          create: (data.images || []).map((img: { url: string }, index: number) => ({
            url: img.url,
            sortOrder: index,
          })),
        },
      },
      select: { id: true, slug: true },
    })

    return { ok: true, id: created.id, slug: created.slug }
  } catch (e) {
    console.error(e)
    return { ok: false, errors: { _form: 'Unexpected error. Please try again.' } }
  }
}

const UpdateCampgroundSchema = z.object({
  id: z.coerce.number().int().positive(),
  title: z.string().min(1),
  description: z.string().min(1),
  location: z.string().min(1),
  price: z.coerce.number().int().nonnegative(),
  images: z.string().transform((s) =>
    s
      .split(/\r?\n/)
      .map((x) => x.trim())
      .filter(Boolean)
  ),
})

/** UPDATE CAMPGROUND */
export async function updateCampgroundAction(
  formData: FormData
): Promise<UpdateCampgroundActionResult> {
  let parsed
  try {
    parsed = UpdateCampgroundSchema.parse({
      id: formData.get('id'),
      title: formData.get('title'),
      description: formData.get('description'),
      location: formData.get('location'),
      price: formData.get('price'),
      images: formData.get('images') ?? '',
    })
  } catch (e: any) {
    return { ok: false, error: 'Invalid form data: ' + (e?.message ?? 'Validation failed') }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { ok: false, error: 'Please log in to continue' }
  }

  // Check if campground exists and verify ownership
  const cg = await prisma.campground.findUnique({
    where: { id: parsed.id },
    select: { userId: true, location: true, latitude: true, longitude: true },
  })

  if (!cg) {
    return { ok: false, error: 'Campground not found' }
  }
  if (cg.userId !== user.id) {
    return { ok: false, error: 'Forbidden - you can only edit your own campgrounds' }
  }

  // Determine coordinates with priority: manual > existing > geocoding
  const useManualCoordinates = formData.get('useManualCoordinates') === 'true'
  const manualLat = formData.get('latitude')
  const manualLng = formData.get('longitude')

  let latitude = cg.latitude
  let longitude = cg.longitude

  if (useManualCoordinates && manualLat && manualLng) {
    // User dropped a pin on the map - use these coordinates as source of truth
    latitude = parseFloat(manualLat as string)
    longitude = parseFloat(manualLng as string)
    console.log('✅ Using manual coordinates from map pin:', { latitude, longitude })
  } else if (parsed.location !== cg.location && parsed.location) {
    // Location text changed and no manual coordinates - geocode the new location
    console.log('🗺️ Location changed, geocoding new location:', parsed.location)
    const coords = await geocodeLocation(parsed.location)
    if (coords) {
      latitude = coords.latitude
      longitude = coords.longitude
      console.log('✅ Updated coordinates via geocoding:', latitude, longitude)
    } else {
      console.warn('⚠️ Geocoding failed, keeping existing coordinates')
      // Keep existing coordinates on geocoding failure
    }
  } else {
    console.log('ℹ️ Keeping existing coordinates:', { latitude, longitude })
  }

  let updatedCampground
  try {
    updatedCampground = await prisma.campground.update({
      where: { id: parsed.id },
      data: {
        title: parsed.title,
        description: parsed.description,
        location: parsed.location,
        price: parsed.price,
        latitude,
        longitude,
        images: {
          deleteMany: {}, // Delete existing images
          create: parsed.images.map((url, index) => ({
            url,
            sortOrder: index,
          })),
        },
      },
      select: { slug: true },
    })
  } catch (e: any) {
    return { ok: false, error: 'Database update failed: ' + (e?.message ?? 'Update failed') }
  }

  revalidatePath(`/campgrounds/${updatedCampground.slug}`)

  return { ok: true, slug: updatedCampground.slug }
}

/** DELETE CAMPGROUND */
export async function DeleteCampground(_prev: unknown, formData: FormData) {
  try {
    const id = Number(formData.get('id'))
    if (!Number.isFinite(id)) return { error: 'Invalid id' }

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return { error: 'Unauthorized' }

    // Ownership check
    const cg = await prisma.campground.findUnique({
      where: { id },
      select: { userId: true },
    })
    if (!cg) return { error: 'Campground not found' }
    if (cg.userId !== user.id)
      return { error: 'Forbidden - you can only delete your own campgrounds' }

    // Delete dependents then the campground in a transaction
    await prisma.$transaction([
      prisma.image.deleteMany({ where: { campgroundId: id } }),
      prisma.review.deleteMany({ where: { campgroundId: id } }),
      prisma.campground.delete({ where: { id } }),
    ])

    // Revalidate pages
    revalidatePath('/campgrounds')
    revalidatePath('/')

    // Return success state instead of redirect (for useActionState)
    return { success: true }
  } catch (e: any) {
    return { error: e?.message ?? 'Delete failed' }
  }
}

/** CREATE REVIEW */
export async function createReviewAction(formData: FormData): Promise<CreateReviewActionResult> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { ok: false, error: 'Please log in to leave a review' }
  }

  const raw = {
    campgroundId: formData.get('campgroundId'),
    rating: formData.get('rating'),
    title: formData.get('title'),
    comment: formData.get('comment'),
  }

  const parsed = CreateReviewSchema.safeParse(raw)
  if (!parsed.success) {
    return { ok: false, error: 'Invalid form data' }
  }

  const data = parsed.data

  try {
    // Verify campground exists
    const campground = await prisma.campground.findUnique({
      where: { id: data.campgroundId },
      select: { id: true },
    })

    if (!campground) {
      return { ok: false, error: 'Campground not found' }
    }

    const review = await prisma.review.create({
      data: {
        campgroundId: data.campgroundId,
        userId: user.id,
        rating: data.rating,
        title: data.title || null,
        comment: data.comment,
      },
      select: { id: true },
    })

    // Revalidate the campground page
    const campgroundWithSlug = await prisma.campground.findUnique({
      where: { id: data.campgroundId },
      select: { slug: true },
    })

    if (campgroundWithSlug) {
      revalidatePath(`/campgrounds/${campgroundWithSlug.slug}`)
    }

    return { ok: true, id: review.id }
  } catch (e: any) {
    console.error('Create review error:', e)
    return { ok: false, error: 'Failed to create review' }
  }
}

/** DELETE REVIEW */
export async function deleteReviewAction(formData: FormData): Promise<DeleteReviewActionResult> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { ok: false, error: 'Please log in to delete a review' }
  }

  const reviewId = formData.get('reviewId')
  if (!reviewId) {
    return { ok: false, error: 'Review ID is required' }
  }

  try {
    // Check if review exists and user owns it
    const review = await prisma.review.findUnique({
      where: { id: Number(reviewId) },
      select: { id: true, userId: true, campgroundId: true },
    })

    if (!review) {
      return { ok: false, error: 'Review not found' }
    }

    if (review.userId !== user.id) {
      return { ok: false, error: 'You can only delete your own reviews' }
    }

    await prisma.review.delete({
      where: { id: review.id },
    })

    // Revalidate the campground page
    const campground = await prisma.campground.findUnique({
      where: { id: review.campgroundId },
      select: { slug: true },
    })

    if (campground) {
      revalidatePath(`/campgrounds/${campground.slug}`)
    }

    return { ok: true }
  } catch (e: any) {
    console.error('Delete review error:', e)
    return { ok: false, error: 'Failed to delete review' }
  }
}

export async function geocodeAllCampgrounds() {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
  if (!token) throw new Error('Missing NEXT_PUBLIC_MAPBOX_TOKEN')

  // Only geocode those missing coordinates
  const campgrounds = await prisma.campground.findMany({
    where: { OR: [{ latitude: null }, { longitude: null }] },
    select: { id: true, title: true, location: true },
  })

  let updated = 0
  const failed: { id: number; reason: string }[] = []

  for (const c of campgrounds) {
    if (!c.location) continue

    // Geocoding per Mapbox Search JS guide
    const query = encodeURIComponent(c.location)
    const url = `https://api.mapbox.com/search/geocode/v6/forward?q=${query}&access_token=${token}&limit=1`

    try {
      const res = await fetch(url)
      if (!res.ok) {
        failed.push({ id: c.id, reason: `HTTP ${res.status}` })
        continue
      }

      const json = await res.json()
      const feature = json?.features?.[0]
      if (!feature?.geometry?.coordinates) {
        failed.push({ id: c.id, reason: 'No coordinates found' })
        continue
      }

      const [longitude, latitude] = feature.geometry.coordinates

      await prisma.campground.update({
        where: { id: c.id },
        data: { latitude, longitude },
      })
      updated++
    } catch (e: any) {
      failed.push({ id: c.id, reason: e?.message || 'Request failed' })
    }

    // Respect API rate limits
    await new Promise((r) => setTimeout(r, 150))
  }

  return { total: campgrounds.length, updated, failed }
}
