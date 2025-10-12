import Image from 'next/image'
import Link from 'next/link'

function money(price: number) {
  return `$${price.toFixed(0)}`
}

export default function CampgroundCard({ variant = 'grid' }: { variant?: 'grid' | 'list' }) {
  if (variant === 'list') {
    return (
      <div className="flex gap-4 rounded-lg border p-3 hover:shadow-sm transition">
        <div className="relative w-40 h-28 shrink-0 bg-neutral-100 rounded-md overflow-hidden">
          <div className="w-full h-full flex items-center justify-center text-neutral-400">
            No image
          </div>
        </div>
        <div className="flex-1">
          <div className="font-medium">Sample Campground</div>
          <div className="text-sm text-neutral-500">Sample Location</div>
          <div className="mt-2 text-sm">
            <span className="font-semibold">$50</span> / night
            <span className="ml-3">⭐ 4.5 (10)</span>
          </div>
        </div>
      </div>
    )
  }

  // grid
  return (
    <div className="rounded-lg border overflow-hidden hover:shadow-sm transition">
      <div className="relative w-full h-48 bg-neutral-100">
        <div className="w-full h-full flex items-center justify-center text-neutral-400">
          No image
        </div>
      </div>
      <div className="p-3">
        <div className="font-medium line-clamp-1">Sample Campground</div>
        <div className="text-sm text-neutral-500 line-clamp-1">Sample Location</div>
        <div className="mt-2 text-sm">
          <span className="font-semibold">$50</span> / night
          <span className="ml-3">⭐ 4.5 (10)</span>
        </div>
      </div>
    </div>
  )
}
