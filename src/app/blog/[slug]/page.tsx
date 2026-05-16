export const revalidate = 60

import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { withRetry } from '@/lib/db'
import BlogPostContent from '@/components/blog/BlogPostContent'
import { Badge } from '@/components/ui/badge'

function formatDate(date: Date | null): string {
  if (!date) return ''
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date))
}

async function fetchPost(slug: string) {
  return withRetry(() =>
    prisma.blogPost.findFirst({
      where: { slug, status: 'published' },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        content: true,
        featuredImage: true,
        publishedAt: true,
        readingTime: true,
        authorId: true,
        author: { select: { displayName: true, avatarUrl: true } },
        categories: {
          select: { category: { select: { id: true, name: true, slug: true } } },
        },
      },
    })
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await fetchPost(slug)
  if (!post) return { title: 'Post not found – CampFinder' }
  return {
    title: `${post.title} – CampFinder Blog`,
    description: post.excerpt ?? undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt ?? undefined,
      images: post.featuredImage ? [post.featuredImage] : [],
    },
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await fetchPost(slug)
  if (!post) notFound()

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const isAuthor = user?.id === post.authorId

  return (
    <main className="container mx-auto px-4 py-12">
      <article className="max-w-3xl mx-auto">
        {/* Featured image */}
        {post.featuredImage && (
          <div className="relative aspect-video w-full overflow-hidden rounded-xl mb-8 bg-slate-100 dark:bg-slate-800">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.featuredImage}
              alt={post.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        )}

        {/* Categories */}
        {post.categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.categories.map(({ category }) => (
              <Badge
                key={category.slug}
                variant="secondary"
                className="text-xs"
              >
                {category.name}
              </Badge>
            ))}
          </div>
        )}

        {/* Title */}
        <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 leading-tight mb-4">
          {post.title}
        </h1>

        {/* Meta */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            {post.author.avatarUrl ? (
              <Image
                src={post.author.avatarUrl}
                alt={post.author.displayName ?? 'Author'}
                width={36}
                height={36}
                className="rounded-full"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-900 grid place-items-center">
                <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                  {(post.author.displayName ?? 'A')[0].toUpperCase()}
                </span>
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                {post.author.displayName ?? 'Anonymous'}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {formatDate(post.publishedAt)}
                {post.readingTime && ` · ${post.readingTime} min read`}
              </p>
            </div>
          </div>

          {isAuthor && (
            <Link
              href={`/blog/${post.slug}/edit`}
              className="text-sm text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              Edit post
            </Link>
          )}
        </div>

        {/* Content */}
        <BlogPostContent content={post.content} />

        {/* Back link */}
        <div className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-700">
          <Link
            href="/blog"
            className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
          >
            Back to Blog
          </Link>
        </div>
      </article>
    </main>
  )
}
