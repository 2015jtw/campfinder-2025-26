'use client'

import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FeaturedCarouselItem } from '@/types'

const SCROLL_THRESHOLD = 10
const CARD_GAP = 16 // Should match gap-4 class (1rem = 16px)
const FALLBACK_CARD_WIDTH = 300

export default function FeaturedCarousel({ items }: { items: FeaturedCarouselItem[] }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScrollButtons = () => {
    const el = trackRef.current
    if (!el) return

    setCanScrollLeft(el.scrollLeft > 0)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - SCROLL_THRESHOLD)
  }

  useEffect(() => {
    checkScrollButtons()
    const el = trackRef.current
    if (el) {
      el.addEventListener('scroll', checkScrollButtons)
      return () => el.removeEventListener('scroll', checkScrollButtons)
    }
  }, [items])

  const scrollByCards = (dir: 'left' | 'right') => {
    const el = trackRef.current
    if (!el) return
    const card = el.querySelector<HTMLElement>('[data-card]')
    const cardWidth = card ? card.offsetWidth + CARD_GAP : FALLBACK_CARD_WIDTH
    el.scrollBy({ left: (dir === 'left' ? -1 : 1) * cardWidth * 2, behavior: 'smooth' })
  }

  if (!items.length) {
    return (
      <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-12 text-center">
        <div className="mx-auto max-w-sm space-y-2">
          <svg
            className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
            No featured campgrounds yet
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Check back soon for featured locations
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Left arrow */}
      {canScrollLeft && (
        <button
          type="button"
          aria-label="Previous"
          onClick={() => scrollByCards('left')}
          className="hidden sm:block absolute -left-14 top-1/2 -translate-y-1/2 z-10 rounded-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-3 shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200 hover:border-slate-400 dark:hover:border-slate-500 cursor-pointer"
        >
          <svg
            className="w-5 h-5 text-slate-700 dark:text-slate-200"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      )}

      {/* Track */}
      <div
        ref={trackRef}
        className="scrollbar-none flex gap-4 overflow-x-auto snap-x snap-mandatory py-6"
      >
        {items.map((cg) => {
          const raw = cg.images?.[0]?.url
          let img = raw
          if (typeof raw === 'string') {
            const s = raw.trim()
            if (s.startsWith('[') && s.endsWith(']')) {
              try {
                const parsed = JSON.parse(s)
                if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === 'string') {
                  img = parsed[0]
                }
              } catch {}
            }
          }
          const reviewCount = cg._count?.reviews ?? 0
          const avgRating = cg._avgRating

          return (
            <Link
              key={cg.id}
              href={`/campgrounds/${cg.slug}`}
              data-card
              className="group snap-start shrink-0 w-64 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:shadow-xl hover:border-slate-300 dark:hover:border-slate-600 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700">
                {img ? (
                  <>
                    <Image
                      src={img}
                      alt={cg.title}
                      width={512}
                      height={384}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </>
                ) : (
                  <div className="h-full w-full grid place-items-center text-slate-400 dark:text-slate-500">
                    <svg
                      className="w-12 h-12"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                )}

                {/* Rating badge */}
                {avgRating && avgRating > 0 ? (
                  <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm px-2.5 py-1 shadow-sm">
                    <svg className="w-3.5 h-3.5 text-yellow-500 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                      {avgRating.toFixed(1)}
                    </span>
                  </div>
                ) : reviewCount > 0 ? (
                  <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm px-2.5 py-1 shadow-sm">
                    <svg className="w-3.5 h-3.5 text-yellow-500 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                      {reviewCount}
                    </span>
                  </div>
                ) : null}
              </div>

              <div className="p-4 space-y-2">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 line-clamp-1 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors">
                  {cg.title}
                </h3>

                {/* Location */}
                <div className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span className="line-clamp-1">{cg.location}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                      />
                    </svg>
                    <span>
                      {reviewCount > 0 ? (
                        <>
                          {reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}
                        </>
                      ) : (
                        'No Reviews'
                      )}
                    </span>
                  </div>

                  {cg.price != null && (
                    <div className="font-bold text-slate-900 dark:text-slate-100">
                      <span className="text-sm">$</span>
                      <span className="text-lg">{cg.price}</span>
                      <span className="text-xs text-slate-600 dark:text-slate-400 font-normal">
                        /night
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Right arrow */}
      {canScrollRight && (
        <button
          type="button"
          aria-label="Next"
          onClick={() => scrollByCards('right')}
          className="hidden sm:block absolute -right-14 top-1/2 -translate-y-1/2 z-10 rounded-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-3 shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200 hover:border-slate-400 dark:hover:border-slate-500 cursor-pointer"
        >
          <svg
            className="w-5 h-5 text-slate-700 dark:text-slate-200"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </div>
  )
}
