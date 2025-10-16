import { z } from 'zod'

// Utility function to create URL-friendly slugs
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}

// Zod schema for validation
export const CreateCampgroundSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z
    .string()
    .min(1, 'Price is required')
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
      message: 'Price must be a valid positive number',
    }),
  location: z.string().min(1, 'Location is required'),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  images: z
    .array(
      z.object({
        url: z.string().url(),
      })
    )
    .min(1, 'At least one image is required'),
})

export type CreateCampgroundInput = z.infer<typeof CreateCampgroundSchema>

export type CreateCampgroundActionResult =
  | { ok: true; id: number; slug: string }
  | { ok: false; errors: Record<string, string[]> | { _form?: string } }

export type UpdateCampgroundActionResult = { ok: true; slug: string } | { ok: false; error: string }
