import Link from 'next/link'

function pageHref(page: number, searchParams: Record<string, string>) {
  const params = new URLSearchParams(searchParams)
  params.set('page', String(page))
  return `?${params.toString()}`
}

export default function Pagination({
  currentPage,
  totalPages,
  searchParams = {},
}: {
  currentPage: number
  totalPages: number
  searchParams?: Record<string, string>
}) {
  const prev = Math.max(1, currentPage - 1)
  const next = Math.min(totalPages, currentPage + 1)

  const pages = Array.from({ length: totalPages })
    .map((_, i) => i + 1)
    .slice(0, 7) // clamp to 7

  return (
    <nav className="flex items-center justify-center gap-2" aria-label="Pagination">
      <Link
        className="px-3 py-1.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer transition-colors"
        href={pageHref(prev, searchParams)}
        aria-disabled={currentPage === 1}
      >
        Prev
      </Link>
      {pages.map((p) => (
        <Link
          key={p}
          href={pageHref(p, searchParams)}
          className={`px-3 py-1.5 rounded border cursor-pointer transition-colors ${
            p === currentPage
              ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border-slate-900 dark:border-slate-100'
              : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'
          }`}
        >
          {p}
        </Link>
      ))}
      <Link
        className="px-3 py-1.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer transition-colors"
        href={pageHref(next, searchParams)}
        aria-disabled={currentPage === totalPages}
      >
        Next
      </Link>
    </nav>
  )
}
