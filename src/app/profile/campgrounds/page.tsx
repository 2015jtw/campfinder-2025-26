import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const select = {
  id: true,
  title: true,
  location: true,
  createdAt: true,
  images: { select: { url: true }, take: 1 },
} as const

// Element type for one row returned by this query:
type CampgroundRow = Prisma.Result<
  typeof prisma.campground,
  { select: typeof select },
  'findMany'
>[number]

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
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Your Campgrounds</h1>
          <p className="mt-2 text-gray-600">Manage your campground listings</p>
        </div>
        <Link
          href="/create"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Campground
        </Link>
      </div>

      <section className="rounded-xl bg-white p-8 shadow-sm border">
        {campgrounds.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
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
            <h3 className="mt-4 text-lg font-medium text-gray-900">No campgrounds yet</h3>
            <p className="mt-2 text-gray-600">
              Get started by creating your first campground listing.
            </p>
            <div className="mt-6">
              <Link
                href="/create"
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {campgrounds.map((cg: CampgroundRow) => (
              <Link key={cg.id} href={`/campgrounds/${cg.id}`} className="group">
                <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
                  {cg.images[0]?.url ? (
                    <div className="relative h-48 w-full bg-gray-100">
                      <Image
                        src={cg.images[0].url}
                        alt={cg.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                  ) : (
                    <div className="flex h-48 w-full items-center justify-center bg-gray-100">
                      <svg
                        className="h-12 w-12 text-gray-400"
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
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {cg.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">{cg.location}</p>
                    <p className="mt-2 text-xs text-gray-500">
                      Created {new Date(cg.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
