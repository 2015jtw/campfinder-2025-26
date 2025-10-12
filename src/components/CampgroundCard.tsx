import Image from 'next/image'
import Link from 'next/link'
import { CampgroundCardDTO } from '@/lib/campgrounds'

function money(price: number) {
  return `$${price.toFixed(0)}`
}

export default function CampgroundCard({
  cg,
  variant = 'grid',
}: {
  cg: CampgroundCardDTO
  variant?: 'grid' | 'list'
}) {
  if (variant === 'list') {
    return (
      <Link
        href={`/campgrounds/${cg.slug}`}
        className="flex gap-4 rounded-lg border p-3 hover:shadow-sm transition"
      >
        <div className="relative w-40 h-28 shrink-0 bg-neutral-100 rounded-md overflow-hidden">
          {cg.imageUrl && (
            <Image src={cg.imageUrl} alt={cg.name} fill sizes="160px" className="object-cover" />
          )}
        </div>
        <div className="flex-1">
          <div className="font-medium">{cg.name}</div>
          <div className="text-sm text-neutral-500">{cg.location}</div>
          <div className="mt-2 text-sm">
            <span className="font-semibold">{money(cg.price)}</span> / night
            {cg.avgRating ? (
              <span className="ml-3">
                ⭐ {cg.avgRating.toFixed(1)} ({cg.reviewCount})
              </span>
            ) : null}
          </div>
        </div>
      </Link>
    )
  }

  // grid
  return (
    <Link
      href={`/campgrounds/${cg.slug}`}
      className="rounded-lg border overflow-hidden hover:shadow-sm transition"
    >
      <div className="relative w-full h-48 bg-neutral-100">
        {cg.imageUrl && (
          <Image
            src={cg.imageUrl}
            alt={cg.name}
            fill
            sizes="(min-width: 768px) 33vw, 100vw"
            className="object-cover"
          />
        )}
      </div>
      <div className="p-3">
        <div className="font-medium line-clamp-1">{cg.name}</div>
        <div className="text-sm text-neutral-500 line-clamp-1">{cg.location}</div>
        <div className="mt-2 text-sm">
          <span className="font-semibold">{money(cg.price)}</span> / night
          {cg.avgRating ? (
            <span className="ml-3">
              ⭐ {cg.avgRating.toFixed(1)} ({cg.reviewCount})
            </span>
          ) : null}
        </div>
      </div>
    </Link>
  )
}
