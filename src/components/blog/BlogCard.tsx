import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import type { BlogPostCard } from '@/types'

function formatDate(date: Date | null): string {
  if (!date) return ''
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date))
}

export default function BlogCard({ post }: { post: BlogPostCard }) {
  const category = post.categories[0]?.category

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:shadow-xl hover:border-slate-300 dark:hover:border-slate-600 hover:-translate-y-1 transition-all duration-300"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700">
        {post.featuredImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.featuredImage}
            alt={post.title}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="h-full w-full grid place-items-center text-slate-400 dark:text-slate-500">
            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
        )}
        {category && (
          <div className="absolute top-3 left-3">
            <Badge
              variant="secondary"
              className="bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-200 backdrop-blur-sm text-xs"
            >
              {category.name}
            </Badge>
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 p-4 space-y-2">
        <h3 className="font-semibold text-slate-900 dark:text-slate-100 line-clamp-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 flex-1">
            {post.excerpt}
          </p>
        )}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400">
          <span>{post.author.displayName ?? 'Anonymous'}</span>
          <div className="flex items-center gap-3">
            {post.readingTime && <span>{post.readingTime} min read</span>}
            {post.publishedAt && <span>{formatDate(post.publishedAt)}</span>}
          </div>
        </div>
      </div>
    </Link>
  )
}
