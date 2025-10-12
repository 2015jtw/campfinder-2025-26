import { CampgroundCardSkeleton } from '@/components/CampgroundCardSkeleton'

export default function Loading() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex items-center justify-between mb-4">
        <div className="h-7 w-48 bg-neutral-200 rounded" />
        <div className="h-8 w-32 bg-neutral-200 rounded" />
      </div>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <CampgroundCardSkeleton key={i} />
        ))}
      </div>
    </main>
  )
}
