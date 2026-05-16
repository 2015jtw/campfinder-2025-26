import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { withRetry } from '@/lib/db'
import { Badge } from '@/components/ui/badge'
import { deleteBlogPost } from '@/app/blog/actions'

export const dynamic = 'force-dynamic'

type PostRow = {
  id: number
  slug: string
  title: string
  status: string
  publishedAt: Date | null
  createdAt: Date
  readingTime: number | null
}

export default async function MyBlogPostsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const posts: PostRow[] = await withRetry(() =>
    prisma.blogPost.findMany({
      where: { authorId: user.id },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        slug: true,
        title: true,
        status: true,
        publishedAt: true,
        createdAt: true,
        readingTime: true,
      },
    })
  ).catch(() => [])

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                Your Blog Posts
              </h1>
              <p className="mt-2 text-slate-600 dark:text-slate-400">
                Manage your articles and drafts
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

          <section className="rounded-xl bg-white dark:bg-slate-800 p-8 shadow-lg border border-slate-200 dark:border-slate-700">
            {posts.length === 0 ? (
              <div className="text-center py-12">
                <svg
                  className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-slate-900 dark:text-slate-100">
                  No posts yet
                </h3>
                <p className="mt-2 text-slate-600 dark:text-slate-400">
                  Share your camping stories with the community.
                </p>
                <div className="mt-6">
                  <Link
                    href="/blog/new"
                    className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 px-4 py-2 text-sm font-medium text-white transition-colors"
                  >
                    Write Your First Post
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {posts.map((post) => (
                  <div
                    key={post.id}
                    className="flex items-center gap-4 p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge
                          variant={post.status === 'published' ? 'default' : 'secondary'}
                          className={
                            post.status === 'published'
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300'
                              : ''
                          }
                        >
                          {post.status === 'published' ? 'Published' : 'Draft'}
                        </Badge>
                        {post.readingTime && (
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {post.readingTime} min read
                          </span>
                        )}
                      </div>
                      <h3 className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                        {post.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {post.status === 'published' && post.publishedAt
                          ? `Published ${new Date(post.publishedAt).toLocaleDateString()}`
                          : `Created ${new Date(post.createdAt).toLocaleDateString()}`}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {post.status === 'published' && (
                        <Link
                          href={`/blog/${post.slug}`}
                          className="text-sm text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors px-2 py-1"
                        >
                          View
                        </Link>
                      )}
                      <Link
                        href={`/blog/${post.slug}/edit`}
                        className="text-sm text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors px-2 py-1"
                      >
                        Edit
                      </Link>
                      <form
                        action={async () => {
                          'use server'
                          await deleteBlogPost(post.id)
                        }}
                      >
                        <button
                          type="submit"
                          className="text-sm text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors px-2 py-1"
                        >
                          Delete
                        </button>
                      </form>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
