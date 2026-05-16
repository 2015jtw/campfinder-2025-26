import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { withRetry } from '@/lib/db'
import BlogGrid from './BlogGrid'
import type { BlogPostCard } from '@/types'

async function fetchLatestPosts(): Promise<BlogPostCard[]> {
  try {
    const posts = await withRetry(() =>
      prisma.blogPost.findMany({
        where: { status: 'published' },
        orderBy: { publishedAt: 'desc' },
        take: 3,
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
    )
    return posts
  } catch {
    return []
  }
}

export default async function LatestBlogPosts() {
  const posts = await fetchLatestPosts()

  return (
    <div className="space-y-6">
      <BlogGrid posts={posts} />
      {posts.length > 0 && (
        <div className="text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium text-sm transition-colors"
          >
            View all posts
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      )}
    </div>
  )
}
