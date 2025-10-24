'use client'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'

export type SortOption =
  | 'alpha-asc'
  | 'alpha-desc'
  | 'price-asc'
  | 'price-desc'
  | 'rating-desc'
  | 'newest'
  | 'oldest'

// Icons
function SortAsc({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 4h13M3 8h9m-9 4h6m4 0l3-3m0 0l3 3m-3-3v12"
      />
    </svg>
  )
}

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  )
}

const OPTIONS: { value: SortOption; label: string; icon?: string }[] = [
  { value: 'alpha-asc', label: 'Alphabetical (A-Z)', icon: '🔡' },
  { value: 'alpha-desc', label: 'Alphabetical (Z-A)', icon: '🔤' },
  { value: 'price-asc', label: 'Price: Low to High', icon: '💵' },
  { value: 'price-desc', label: 'Price: High to Low', icon: '💰' },
  { value: 'rating-desc', label: 'Highest Rated', icon: '⭐' },
  { value: 'newest', label: 'Newest First', icon: '🆕' },
  { value: 'oldest', label: 'Oldest First', icon: '📅' },
]

export default function FilterSelect({ current }: { current: SortOption }) {
  const router = useRouter()
  const pathname = usePathname()
  const sp = useSearchParams()

  const onChange = (value: string) => {
    const params = new URLSearchParams(sp?.toString())
    params.set('sort', value)
    params.set('page', '1')
    router.push(`${pathname}?${params.toString()}`)
  }

  const currentOption = OPTIONS.find((o) => o.value === current)

  return (
    <div className="relative">
      <label className="inline-flex items-center gap-2.5 group">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-white">
          <SortAsc className="w-4 h-4 text-slate-500 dark:text-slate-300" />
          <span>Sort by</span>
        </div>
        <div className="relative">
          <select
            className="appearance-none rounded-lg border border-slate-300 dark:border-slate-600 pl-4 pr-10 py-2.5 text-sm bg-white dark:bg-slate-800 hover:border-slate-400 dark:hover:border-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none transition-all cursor-pointer font-medium text-slate-900 dark:text-white shadow-sm"
            value={current}
            onChange={(e) => onChange(e.target.value)}
          >
            {OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.icon} {o.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 dark:text-slate-300 pointer-events-none" />
        </div>
      </label>
    </div>
  )
}
