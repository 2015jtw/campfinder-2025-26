import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const select = {
  id: true,
  slug: true,
  title: true,
  location: true,
  createdAt: true,
  images: { select: { url: true }, take: 1 },
} as const

// Element type for one row returned by this query:
type CampgroundRow = {
  id: number
  slug: string
  title: string
  location: string
  createdAt: Date
  images: { url: string }[]
}

export default async function CampgroundsPage() {
  // Auth is handled by the layout
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const campgrounds: CampgroundRow[] = await prisma.campground.findMany({
    where: { userId: user!.id },
    orderBy: { createdAt: 'desc' },
    take: 10,
    select,
  })

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                  Your Campgrounds
                </h1>
                <p className="mt-2 text-slate-600 dark:text-slate-400">
                  Manage your campground listings
                </p>
              </div>
              <Link
                href="/create"
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
                New Campground
              </Link>
            </div>

            <section className="rounded-xl bg-white dark:bg-slate-800 p-8 shadow-lg border border-slate-200 dark:border-slate-700">
              {campgrounds.length === 0 ? (
                <div className="text-center py-12">
                  <svg
                    className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                  <h3 className="mt-4 text-lg font-medium text-slate-900 dark:text-slate-100">
                    No campgrounds yet
                  </h3>
                  <p className="mt-2 text-slate-600 dark:text-slate-400">
                    Get started by creating your first campground listing.
                  </p>
                  <div className="mt-6">
                    <Link
                      href="/create"
                      className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 px-4 py-2 text-sm font-medium text-white transition-colors"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      Create Your First Campground
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 flex flex-col gap-4">
                  {campgrounds.map((cg: CampgroundRow) => (
                    <Link key={cg.id} href={`/campgrounds/${cg.slug}`} className="group">
                      <div className="flex items-center gap-4 p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm transition-all hover:shadow-md hover:border-emerald-300 dark:hover:border-emerald-600">
                        {/* Image */}
                        <div className="flex-shrink-0">
                          {(() => {
                            const raw = cg.images[0]?.url
                            let img = raw
                            if (typeof raw === 'string') {
                              const s = raw.trim()
                              if (s.startsWith('[') && s.endsWith(']')) {
                                try {
                                  const parsed = JSON.parse(s)
                                  if (
                                    Array.isArray(parsed) &&
                                    parsed.length > 0 &&
                                    typeof parsed[0] === 'string'
                                  ) {
                                    img = parsed[0]
                                  }
                                } catch {}
                              }
                            }
                            return img
                          })() ? (
                            <div className="relative w-20 h-20 bg-slate-100 dark:bg-slate-700 rounded-lg overflow-hidden">
                              <Image
                                src={(() => {
                                  const raw = cg.images[0]?.url
                                  if (!raw) return ''
                                  const s = raw.trim()
                                  if (s.startsWith('[') && s.endsWith(']')) {
                                    try {
                                      const parsed = JSON.parse(s)
                                      if (
                                        Array.isArray(parsed) &&
                                        parsed.length > 0 &&
                                        typeof parsed[0] === 'string'
                                      ) {
                                        return parsed[0]
                                      }
                                    } catch {}
                                  }
                                  return raw
                                })()}
                                alt={cg.title}
                                fill
                                className="object-cover transition-transform group-hover:scale-105"
                              />
                            </div>
                          ) : (
                            <div className="flex w-20 h-20 items-center justify-center bg-slate-100 dark:bg-slate-700 rounded-lg">
                              <svg
                                className="h-8 w-8 text-slate-400 dark:text-slate-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors truncate">
                            {cg.title}
                          </h3>
                          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 truncate">
                            {cg.location}
                          </p>
                          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            Created {new Date(cg.createdAt).toLocaleDateString()}
                          </p>
                        </div>

                        {/* Arrow indicator */}
                        <div className="flex-shrink-0">
                          <svg
                            className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
