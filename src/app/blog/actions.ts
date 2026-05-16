'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { withRetry } from '@/lib/db'
import { generateSlug, calculateReadingTime } from '@/lib/blog-utils'

export async function createBlogPost(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const title = formData.get('title') as string
  const excerpt = (formData.get('excerpt') as string) || null
  const content = formData.get('content') as string
  const featuredImage = (formData.get('featuredImage') as string) || null
  const status = formData.get('status') as 'draft' | 'published'
  const categoryIds = formData.getAll('categories').map(Number).filter(Boolean)

  let slug = generateSlug(title)
  const existing = await prisma.blogPost.findUnique({ where: { slug } })
  if (existing) slug = `${slug}-${Date.now()}`

  const readingTime = calculateReadingTime(content)
  const publishedAt = status === 'published' ? new Date() : null

  const post = await withRetry(() =>
    prisma.blogPost.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        featuredImage,
        status,
        publishedAt,
        readingTime,
        authorId: user.id,
        categories: {
          create: categoryIds.map((id) => ({ categoryId: id })),
        },
      },
    })
  )

  revalidatePath('/blog')
  revalidatePath('/')
  redirect(`/blog/${post.slug}`)
}

export async function updateBlogPost(id: number, formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const existing = await prisma.blogPost.findUnique({ where: { id } })
  if (!existing || existing.authorId !== user.id) redirect('/blog')

  const title = formData.get('title') as string
  const excerpt = (formData.get('excerpt') as string) || null
  const content = formData.get('content') as string
  const featuredImage = (formData.get('featuredImage') as string) || null
  const status = formData.get('status') as 'draft' | 'published'
  const categoryIds = formData.getAll('categories').map(Number).filter(Boolean)

  const readingTime = calculateReadingTime(content)
  const publishedAt =
    status === 'published' ? (existing.publishedAt ?? new Date()) : null

  await withRetry(() =>
    prisma.blogPost.update({
      where: { id },
      data: {
        title,
        excerpt,
        content,
        featuredImage,
        status,
        publishedAt,
        readingTime,
        categories: {
          deleteMany: {},
          create: categoryIds.map((cid) => ({ categoryId: cid })),
        },
      },
    })
  )

  revalidatePath('/blog')
  revalidatePath(`/blog/${existing.slug}`)
  revalidatePath('/')
  redirect(`/blog/${existing.slug}`)
}

export async function deleteBlogPost(id: number) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const existing = await prisma.blogPost.findUnique({ where: { id } })
  if (!existing || existing.authorId !== user.id) redirect('/blog')

  await withRetry(() => prisma.blogPost.delete({ where: { id } }))

  revalidatePath('/blog')
  revalidatePath('/')
  redirect('/profile/blog-posts')
}
