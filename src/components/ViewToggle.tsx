'use client'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { cn } from '@/utils/cn'

// Icons
function List({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 6h16M4 10h16M4 14h16M4 18h16"
      />
    </svg>
  )
}

function Grid3x3({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
      />
    </svg>
  )
}

export default function ViewToggle({ view }: { view: 'grid' | 'list' }) {
  const router = useRouter()
  const pathname = usePathname()
  const sp = useSearchParams()

  const setView = (next: 'grid' | 'list') => {
    const params = new URLSearchParams(sp?.toString())
    params.set('view', next)
    params.set('page', '1')
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="inline-flex items-center gap-2">
      <span className="text-sm font-medium text-neutral-700">View</span>
      <div className="inline-flex rounded-lg border border-neutral-300 p-1 bg-white shadow-sm">
        <button
          onClick={() => setView('list')}
          className={cn(
            'flex cursor-pointer items-center gap-2 px-3 py-2 text-sm rounded-md font-medium transition-all duration-200',
            view === 'list'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
          )}
          aria-pressed={view === 'list'}
          aria-label="List view"
        >
          <List className="w-4 h-4" />
          <span className="hidden sm:inline">List</span>
        </button>
        <button
          onClick={() => setView('grid')}
          className={cn(
            'flex cursor-pointer items-center gap-2 px-3 py-2 text-sm rounded-md font-medium transition-all duration-200',
            view === 'grid'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
          )}
          aria-pressed={view === 'grid'}
          aria-label="Grid view"
        >
          <Grid3x3 className="w-4 h-4" />
          <span className="hidden sm:inline">Grid</span>
        </button>
      </div>
    </div>
  )
}
