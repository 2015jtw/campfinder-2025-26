import Image from 'next/image'
import Link from 'next/link'
import { Star, MapPin } from 'lucide-react'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { patterns, colors, effects, interactive } from '@/lib/design-tokens'
import { BLUR_DATA_URLS } from '@/lib/image-utils'

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

function normalizeUrl(possiblyArrayString: string | undefined): string | undefined {
  if (!possiblyArrayString) return undefined
  const s = possiblyArrayString.trim()
  if (s.startsWith('[') && s.endsWith(']')) {
    try {
      const parsed = JSON.parse(s)
      if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === 'string') {
        return parsed[0]
      }
    } catch {}
  }
  return possiblyArrayString
}

export default function CampgroundCard({
  data,
  layout = 'grid',
}: {
  data: CampgroundCardData
  layout?: 'grid' | 'list'
}) {
  const imageUrl = normalizeUrl(data.images[0]?.url)
  const rating = data._avgRating
  const reviewCount = data._reviewsCount

  if (layout === 'list') {
    return (
      <Link
        href={`/campgrounds/${data.slug}`}
        className={`group cursor-pointer flex gap-6 ${patterns.card} p-5`}
      >
        <div className="flex-1 flex flex-col justify-between py-1">
          <div>
            <h3
              className={`font-semibold text-xl text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 ${effects.transition.colors} mb-2`}
            >
              {data.title}
            </h3>
            <div className={`flex items-center gap-1.5 mb-2 text-slate-600 dark:text-slate-400`}>
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{data.location}</span>
            </div>
            {data.description && (
              <p className={`text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-2`}>
                {data.description}
              </p>
            )}
            <div className={`text-sm text-slate-500 dark:text-slate-400`}>
              {reviewCount && reviewCount > 0 ? (
                <>
                  {reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}
                </>
              ) : (
                'No Reviews'
              )}
            </div>
          </div>

          <div className="flex items-baseline gap-1 mt-3">
            <span className={`text-2xl font-bold text-slate-900 dark:text-slate-100`}>
              {money(data.price)}
            </span>
            <span className={`text-sm text-slate-500 dark:text-slate-400`}>/ night</span>
          </div>
        </div>

        <div className="w-[500px] shrink-0">
          <AspectRatio
            ratio={2 / 1}
            className={`bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-lg overflow-hidden`}
          >
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={data.title}
                width={512}
                height={256}
                loading="lazy"
                className={`object-cover ${patterns.image.hover}`}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                placeholder="blur"
                blurDataURL={BLUR_DATA_URLS.campground}
                quality={85}
              />
            ) : (
              <div
                className={`w-full h-full flex items-center justify-center text-slate-400 dark:text-slate-500`}
              >
                <div className="text-center">
                  <div className="text-4xl mb-1">🏕️</div>
                  <div className="text-xs">No image</div>
                </div>
              </div>
            )}
            {rating && rating > 0 && (
              <div
                className={`absolute top-3 right-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm px-2.5 py-1.5 rounded-md shadow-sm flex items-center gap-1`}
              >
                <div className="flex items-center">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${i < Math.round(rating) ? patterns.rating.filled : patterns.rating.empty}`}
                    />
                  ))}
                </div>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 ml-1">
                  {rating.toFixed(1)}
                </span>
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
      className={`group cursor-pointer ${patterns.card} overflow-hidden`}
    >
      <AspectRatio
        ratio={4 / 3}
        className={`bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 overflow-hidden`}
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={data.title}
            width={512}
            height={384}
            loading="lazy"
            className={`object-cover ${patterns.image.hoverStrong}`}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            placeholder="blur"
            blurDataURL={BLUR_DATA_URLS.campground}
            quality={85}
          />
        ) : (
          <div
            className={`w-full h-full flex items-center justify-center text-slate-400 dark:text-slate-500`}
          >
            <div className="text-center">
              <div className="text-5xl mb-2">🏕️</div>
              <div className="text-sm">No image</div>
            </div>
          </div>
        )}
        {rating && rating > 0 && (
          <div
            className={`absolute top-3 right-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm px-2.5 py-1.5 rounded-lg shadow-md flex items-center gap-1`}
          >
            <div className="flex items-center">
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${i < Math.round(rating) ? patterns.rating.filled : patterns.rating.empty}`}
                />
              ))}
            </div>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 ml-1">
              {rating.toFixed(1)}
            </span>
          </div>
        )}
      </AspectRatio>

      <div className="p-4">
        <h3
          className={`font-semibold text-lg text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 ${effects.transition.colors} line-clamp-1`}
        >
          {data.title}
        </h3>
        <div className={`flex items-center gap-1.5 mt-1.5 text-slate-600 dark:text-slate-400`}>
          <MapPin className="w-4 h-4" />
          <span className="text-sm line-clamp-1">{data.location}</span>
        </div>

        <div
          className={`mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between`}
        >
          <div className="flex items-baseline gap-1">
            <span className={`text-xl font-bold text-slate-900 dark:text-slate-100`}>
              {money(data.price)}
            </span>
            <span className={`text-xs text-slate-500 dark:text-slate-400`}>/ night</span>
          </div>
          <div className={`text-xs text-slate-500 dark:text-slate-400`}>
            {reviewCount && reviewCount > 0 ? (
              <>
                {reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}
              </>
            ) : (
              'No Reviews'
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
