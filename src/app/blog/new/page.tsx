import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { withRetry } from '@/lib/db'
import BlogPostForm from '@/components/blog/BlogPostForm'
import type { BlogCategory } from '@/types'

export const metadata: Metadata = { title: 'Write a Post – CampFinder' }

export default async function NewBlogPostPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const categories: BlogCategory[] = await withRetry(() =>
    prisma.blogCategory.findMany({ orderBy: { name: 'asc' } })
  ).catch(() => [])

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-8">
          Write a Post
        </h1>
        <BlogPostForm categories={categories} />
      </div>
    </main>
  )
}
