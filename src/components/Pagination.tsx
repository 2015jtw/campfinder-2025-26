'use client'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

export default function Pagination({
  page,
  total,
  pageSize,
}: {
  page: number
  total: number
  pageSize: number
}) {
  const pages = Math.max(1, Math.ceil(total / pageSize))
  const router = useRouter()
  const pathname = usePathname()
  const sp = useSearchParams()

  function go(p: number) {
    const params = new URLSearchParams(sp.toString())
    params.set('page', String(p))
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex items-center justify-between mt-6">
      <button
        className="px-3 py-1.5 rounded-md border text-sm disabled:opacity-50"
        onClick={() => go(Math.max(1, page - 1))}
        disabled={page <= 1}
      >
        Previous
      </button>
      <div className="text-sm text-neutral-600">
        Page {page} of {pages}
      </div>
      <button
        className="px-3 py-1.5 rounded-md border text-sm disabled:opacity-50"
        onClick={() => go(Math.min(pages, page + 1))}
        disabled={page >= pages}
      >
        Next
      </button>
    </div>
  )
}
