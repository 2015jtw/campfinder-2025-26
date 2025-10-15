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
      <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-12 text-center">
        <div className="mx-auto max-w-sm space-y-2">
          <svg
            className="mx-auto h-12 w-12 text-neutral-400"
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
          <p className="text-sm font-medium text-neutral-600">No featured campgrounds yet</p>
          <p className="text-xs text-neutral-500">Check back soon for featured locations</p>
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
          className="hidden sm:block absolute -left-14 top-1/2 -translate-y-1/2 z-10 rounded-full border border-neutral-300 bg-white px-3 py-3 shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200 hover:border-neutral-400"
        >
          <svg
            className="w-5 h-5 text-neutral-700"
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
          const img = cg.images?.[0]?.url
          const reviewCount = cg._count?.reviews ?? 0

          return (
            <Link
              key={cg.id}
              href={`/campgrounds/${cg.id}`}
              data-card
              className="group snap-start shrink-0 w-64 rounded-xl border border-neutral-200 bg-white hover:shadow-xl hover:border-neutral-300 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-xl bg-gradient-to-br from-neutral-100 to-neutral-200">
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
                  <div className="h-full w-full grid place-items-center text-neutral-400">
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

                {/* Review badge */}
                {reviewCount > 0 && (
                  <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-white/95 backdrop-blur-sm px-2.5 py-1 shadow-sm">
                    <svg className="w-3.5 h-3.5 text-yellow-500 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-xs font-semibold text-neutral-700">{reviewCount}</span>
                  </div>
                )}
              </div>

              <div className="p-4 space-y-2">
                <h3 className="font-semibold text-neutral-900 line-clamp-1 group-hover:text-neutral-700 transition-colors">
                  {cg.title}
                </h3>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-neutral-600">
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
                      {reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}
                    </span>
                  </div>

                  {cg.price != null && (
                    <div className="font-bold text-neutral-900">
                      <span className="text-sm">$</span>
                      <span className="text-lg">{cg.price}</span>
                      <span className="text-xs text-neutral-600 font-normal">/night</span>
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
          className="hidden sm:block absolute -right-14 top-1/2 -translate-y-1/2 z-10 rounded-full border border-neutral-300 bg-white px-3 py-3 shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200 hover:border-neutral-400"
        >
          <svg
            className="w-5 h-5 text-neutral-700"
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
