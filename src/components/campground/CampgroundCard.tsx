import Image from 'next/image'
import Link from 'next/link'
import { Star, MapPin } from 'lucide-react'
import { AspectRatio } from '@/components/ui/aspect-ratio'

// Use the same DTO type as the page
type CampgroundCardData = {
  id: string
  slug: string
  title: string
  location: string
  description?: string | null
  price: number | null
  images: { url: string }[]
  _avgRating?: number | null
  _reviewsCount?: number
}

function money(price: number | null) {
  if (price == null) return 'Price TBD'
  return `$${price.toFixed(0)}`
}

export default function CampgroundCard({
  data,
  layout = 'grid',
}: {
  data: CampgroundCardData
  layout?: 'grid' | 'list'
}) {
  const imageUrl = data.images[0]?.url
  const rating = data._avgRating
  const reviewCount = data._reviewsCount

  if (layout === 'list') {
    return (
      <Link
        href={`/campgrounds/${data.slug}`}
        className="group cursor-pointer flex gap-6 rounded-xl border border-neutral-200 bg-white p-5 hover:shadow-lg hover:border-neutral-300 transition-all duration-300"
      >
        <div className="flex-1 flex flex-col justify-between py-1">
          <div>
            <h3 className="font-semibold text-xl text-neutral-900 group-hover:text-emerald-700 transition-colors mb-2">
              {data.title}
            </h3>
            <div className="flex items-center gap-1.5 mb-2 text-neutral-600">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{data.location}</span>
            </div>
            {data.description && (
              <p className="text-sm text-neutral-600 line-clamp-2 mb-2">{data.description}</p>
            )}
            {reviewCount && reviewCount > 0 && (
              <div className="text-sm text-neutral-500">
                {reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}
              </div>
            )}
          </div>

          <div className="flex items-baseline gap-1 mt-3">
            <span className="text-2xl font-bold text-neutral-900">{money(data.price)}</span>
            <span className="text-sm text-neutral-500">/ night</span>
          </div>
        </div>

        <div className="w-[500px] shrink-0">
          <AspectRatio
            ratio={2 / 1}
            className="bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-lg overflow-hidden"
          >
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={data.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-neutral-400">
                <div className="text-center">
                  <div className="text-4xl mb-1">🏕️</div>
                  <div className="text-xs">No image</div>
                </div>
              </div>
            )}
            {rating && (
              <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2.5 py-1.5 rounded-md shadow-sm flex items-center gap-1">
                <div className="flex items-center">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${i < Math.round(rating) ? 'text-amber-400 fill-current' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
              </div>
            )}
          </AspectRatio>
        </div>
      </Link>
    )
  }

  // Grid layout
  return (
    <Link
      href={`/campgrounds/${data.slug}`}
      className="group cursor-pointer rounded-xl border border-neutral-200 bg-white overflow-hidden hover:shadow-xl hover:border-neutral-300 transition-all duration-300"
    >
      <AspectRatio
        ratio={4 / 3}
        className="bg-gradient-to-br from-neutral-100 to-neutral-200 overflow-hidden"
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={data.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-400">
            <div className="text-center">
              <div className="text-5xl mb-2">🏕️</div>
              <div className="text-sm">No image</div>
            </div>
          </div>
        )}
        {rating && (
          <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2.5 py-1.5 rounded-lg shadow-md flex items-center gap-1">
            <div className="flex items-center">
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${i < Math.round(rating) ? 'text-amber-400 fill-current' : 'text-gray-300'}`}
                />
              ))}
            </div>
          </div>
        )}
      </AspectRatio>

      <div className="p-4">
        <h3 className="font-semibold text-lg text-neutral-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
          {data.title}
        </h3>
        <div className="flex items-center gap-1.5 mt-1.5 text-neutral-600">
          <MapPin className="w-4 h-4" />
          <span className="text-sm line-clamp-1">{data.location}</span>
        </div>

        <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between">
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-neutral-900">{money(data.price)}</span>
            <span className="text-xs text-neutral-500">/ night</span>
          </div>
          {reviewCount && reviewCount > 0 && (
            <div className="text-xs text-neutral-500">
              {reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
