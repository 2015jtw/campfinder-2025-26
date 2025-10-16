'use server'

import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import {
  CreateCampgroundSchema,
  slugify,
  type CreateCampgroundActionResult,
} from '@/lib/validations/campground'

export async function createCampgroundAction(
  formData: FormData
): Promise<CreateCampgroundActionResult> {
  const supabase = await createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
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
        userId: session.user.id,
        images: {
          create: data.images.map((img: { url: string }, index: number) => ({
            url: img.url,
            sortOrder: index,
          })),
        },
      },
      select: { id: true },
    })

    return { ok: true, id: created.id }
  } catch (e) {
    console.error(e)
    return { ok: false, errors: { _form: 'Unexpected error. Please try again.' } }
  }
}
