export function CampgroundCardSkeleton({ variant = 'grid' }: { variant?: 'grid' | 'list' }) {
  if (variant === 'list') {
    return (
      <div className="flex gap-4 rounded-lg border p-3 animate-pulse">
        <div className="w-40 h-28 rounded-md bg-neutral-200" />
        <div className="flex-1">
          <div className="h-4 w-2/3 bg-neutral-200 rounded mb-2" />
          <div className="h-3 w-1/2 bg-neutral-200 rounded mb-4" />
          <div className="h-3 w-1/3 bg-neutral-200 rounded" />
        </div>
      </div>
    )
  }
  return (
    <div className="rounded-lg border overflow-hidden animate-pulse">
      <div className="w-full h-48 bg-neutral-200" />
      <div className="p-3">
        <div className="h-4 w-2/3 bg-neutral-200 rounded mb-2" />
        <div className="h-3 w-1/2 bg-neutral-200 rounded mb-3" />
        <div className="h-3 w-1/3 bg-neutral-200 rounded" />
      </div>
    </div>
  )
}
