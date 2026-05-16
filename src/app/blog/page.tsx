export const revalidate = 60

import type { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { withRetry } from '@/lib/db'
import BlogGrid from '@/components/blog/BlogGrid'
import type { BlogPostCard } from '@/types'

export const metadata: Metadata = {
  title: 'Blog – CampFinder',
  description:
    'Tips, gear reviews, trip reports, and camping stories from the CampFinder community.',
}

const PAGE_SIZE = 9

async function fetchPosts(page: number): Promise<{ posts: BlogPostCard[]; total: number }> {
  try {
    const [posts, total] = await Promise.all([
      withRetry(() =>
        prisma.blogPost.findMany({
          where: { status: 'published' },
          orderBy: { publishedAt: 'desc' },
          skip: (page - 1) * PAGE_SIZE,
          take: PAGE_SIZE,
          select: {
            id: true,
            slug: true,
            title: true,
            excerpt: true,
            featuredImage: true,
            publishedAt: true,
            readingTime: true,
            author: { select: { displayName: true, avatarUrl: true } },
            categories: {
              select: { category: { select: { name: true, slug: true } } },
            },
          },
        })
      ),
      withRetry(() => prisma.blogPost.count({ where: { status: 'published' } })),
    ])
    return { posts, total }
  } catch {
    return { posts: [], total: 0 }
  }
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const params = await searchParams
  const page = Math.max(1, Number(params.page) || 1)
  const { posts, total } = await fetchPosts(page)
  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Blog</h1>
            <p className="mt-1 text-slate-600 dark:text-slate-400">
              Camping tips, gear reviews, and trip reports from the community
            </p>
          </div>
          <Link
            href="/blog/new"
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 px-4 py-2 text-sm font-medium text-white transition-colors"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Write a Post
          </Link>
        </div>

        <BlogGrid posts={posts} />

        {totalPages > 1 && (
          <div className="flex justify-center gap-2">
            {page > 1 && (
              <Link
                href={`/blog?page=${page - 1}`}
                className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300 hover:border-emerald-500 transition-colors"
              >
                Previous
              </Link>
            )}
            <span className="px-4 py-2 text-sm text-slate-500 dark:text-slate-400">
              Page {page} of {totalPages}
            </span>
            {page < totalPages && (
              <Link
                href={`/blog?page=${page + 1}`}
                className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300 hover:border-emerald-500 transition-colors"
              >
                Next
              </Link>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
