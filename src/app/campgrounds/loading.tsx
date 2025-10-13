import { CampgroundCardSkeleton } from '@/components/CampgroundCardSkeleton'

export default function Loading() {
  return (
    <section className="container mx-auto px-4 py-6 space-y-6">
      {/* Header Skeleton */}
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="h-8 w-48 bg-neutral-200 rounded animate-pulse" />
        <div className="flex items-center gap-3">
          {/* Filter Select Skeleton */}
          <div className="flex items-center gap-2.5">
            <div className="w-4 h-4 bg-neutral-200 rounded animate-pulse" />
            <div className="h-4 w-12 bg-neutral-200 rounded animate-pulse" />
            <div className="h-10 w-48 bg-neutral-200 rounded-lg animate-pulse" />
          </div>
          {/* View Toggle Skeleton */}
          <div className="flex items-center gap-2">
            <div className="h-4 w-12 bg-neutral-200 rounded animate-pulse" />
            <div className="h-10 w-32 bg-neutral-200 rounded-lg animate-pulse" />
          </div>
        </div>
      </header>

      {/* Content Skeleton - Grid View */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 12 }).map((_, i) => (
          <CampgroundCardSkeleton key={i} variant="grid" />
        ))}
      </div>

      {/* Pagination Skeleton */}
      <div className="flex items-center justify-center gap-2">
        <div className="h-8 w-16 bg-neutral-200 rounded animate-pulse" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-8 w-8 bg-neutral-200 rounded animate-pulse" />
        ))}
        <div className="h-8 w-16 bg-neutral-200 rounded animate-pulse" />
      </div>
    </section>
  )
}
