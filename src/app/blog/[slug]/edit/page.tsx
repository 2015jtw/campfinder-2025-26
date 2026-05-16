import { redirect, notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { withRetry } from '@/lib/db'
import BlogPostForm from '@/components/blog/BlogPostForm'
import type { BlogCategory, BlogPostFull } from '@/types'

export const metadata: Metadata = { title: 'Edit Post – CampFinder' }

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [rawPost, categories] = await Promise.all([
    withRetry(() =>
      prisma.blogPost.findUnique({
        where: { slug },
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          content: true,
          featuredImage: true,
          status: true,
          publishedAt: true,
          readingTime: true,
          authorId: true,
          createdAt: true,
          updatedAt: true,
          author: { select: { displayName: true, avatarUrl: true } },
          categories: {
            select: { category: { select: { id: true, name: true, slug: true } } },
          },
        },
      })
    ).catch(() => null),
    withRetry(() =>
      prisma.blogCategory.findMany({ orderBy: { name: 'asc' } })
    ).catch<BlogCategory[]>(() => []),
  ])

  if (!rawPost) notFound()
  if (rawPost.authorId !== user.id) redirect(`/blog/${slug}`)

  const post: BlogPostFull = {
    ...rawPost,
    status: rawPost.status as 'draft' | 'published' | 'archived',
  }

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-8">Edit Post</h1>
        <BlogPostForm categories={categories} post={post} />
      </div>
    </main>
  )
}
