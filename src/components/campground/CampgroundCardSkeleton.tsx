export function CampgroundCardSkeleton({ variant = 'grid' }: { variant?: 'grid' | 'list' }) {
  if (variant === 'list') {
    return (
      <div className="flex gap-4 rounded-lg border p-4 animate-pulse">
        <div className="w-40 h-28 shrink-0 bg-neutral-200 rounded-md" />
        <div className="flex-1 space-y-2">
          <div className="h-5 w-3/4 bg-neutral-200 rounded" />
          <div className="h-4 w-1/2 bg-neutral-200 rounded" />
          <div className="flex items-center gap-3 mt-3">
            <div className="h-4 w-16 bg-neutral-200 rounded" />
            <div className="h-4 w-20 bg-neutral-200 rounded" />
          </div>
        </div>
      </div>
    )
  }

  // Grid variant
  return (
    <div className="rounded-lg border overflow-hidden animate-pulse">
      <div className="w-full h-48 bg-neutral-200" />
      <div className="p-3 space-y-2">
        <div className="h-5 w-3/4 bg-neutral-200 rounded" />
        <div className="h-4 w-1/2 bg-neutral-200 rounded" />
        <div className="flex items-center gap-3 mt-2">
          <div className="h-4 w-16 bg-neutral-200 rounded" />
          <div className="h-4 w-20 bg-neutral-200 rounded" />
        </div>
      </div>
    </div>
  )
}
