import { CampgroundCardSkeleton } from '@/components/CampgroundCardSkeleton'

export default function Loading() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <CampgroundCardSkeleton key={i} />
        ))}
      </div>
    </main>
  )
}
