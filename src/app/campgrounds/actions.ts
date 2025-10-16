'use server'

import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import {
  CreateCampgroundSchema,
  slugify,
  type CreateCampgroundActionResult,
  type UpdateCampgroundActionResult,
} from '@/lib/validations/campground'

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

  const raw = {
    title: String(formData.get('title') ?? ''),
    description: String(formData.get('description') ?? ''),
    price: String(formData.get('price') ?? ''),
    location: String(formData.get('location') ?? ''),
    latitude: formData.get('latitude') ? Number(formData.get('latitude')) : undefined,
    longitude: formData.get('longitude') ? Number(formData.get('longitude')) : undefined,
    images: (() => {
      const json = String(formData.get('images') ?? '[]')
      try {
        return JSON.parse(json)
      } catch {
        return []
      }
    })(),
  }

  const parsed = CreateCampgroundSchema.safeParse(raw)
  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors
    return { ok: false, errors: fieldErrors }
  }

  const data = parsed.data

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
        latitude: data.latitude ?? 0.0,
        longitude: data.longitude ?? 0.0,
        userId: user.id,
        images: {
          create: data.images.map((img: { url: string }, index: number) => ({
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
    select: { userId: true },
  })

  if (!cg) {
    return { ok: false, error: 'Campground not found' }
  }
  if (cg.userId !== user.id) {
    return { ok: false, error: 'Forbidden - you can only edit your own campgrounds' }
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
