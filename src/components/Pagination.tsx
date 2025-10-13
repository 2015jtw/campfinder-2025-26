import Link from 'next/link'
import { Suspense } from 'react'

function pageHref(page: number, search: string) {
  const params = new URLSearchParams(search)
  params.set('page', String(page))
  return `?${params.toString()}`
}

export default function Pagination({
  currentPage,
  totalPages,
}: {
  currentPage: number
  totalPages: number
}) {
  const search = typeof window === 'undefined' ? '' : window.location.search.substring(1)
  const prev = Math.max(1, currentPage - 1)
  const next = Math.min(totalPages, currentPage + 1)

  const pages = Array.from({ length: totalPages })
    .map((_, i) => i + 1)
    .slice(0, 7) // clamp to 7

  return (
    <nav className="flex items-center justify-center gap-2" aria-label="Pagination">
      <Link
        className="px-3 py-1.5 rounded border"
        href={pageHref(prev, search)}
        aria-disabled={currentPage === 1}
      >
        Prev
      </Link>
      {pages.map((p) => (
        <Link
          key={p}
          href={pageHref(p, search)}
          className={`px-3 py-1.5 rounded border ${p === currentPage ? 'bg-gray-900 text-white' : 'hover:bg-gray-100'}`}
        >
          {p}
        </Link>
      ))}
      <Link
        className="px-3 py-1.5 rounded border"
        href={pageHref(next, search)}
        aria-disabled={currentPage === totalPages}
      >
        Next
      </Link>
    </nav>
  )
}
