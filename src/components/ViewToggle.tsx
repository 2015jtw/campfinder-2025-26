'use client'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

export default function ViewToggle() {
  const router = useRouter()
  const pathname = usePathname()
  const sp = useSearchParams()
  const view = sp.get('view') === 'list' ? 'list' : 'grid'

  function setView(v: 'grid' | 'list') {
    const params = new URLSearchParams(sp.toString())
    params.set('view', v)
    params.set('page', '1') // reset page
    router.push(`${pathname}?${params.toString()}`)
  }

  const base = 'px-3 py-1.5 rounded-md border text-sm'
  const active = 'bg-black text-white border-black'
  const passive = 'bg-white'

  return (
    <div className="flex gap-2">
      <button
        className={`${base} ${view === 'grid' ? active : passive}`}
        onClick={() => setView('grid')}
      >
        Grid
      </button>
      <button
        className={`${base} ${view === 'list' ? active : passive}`}
        onClick={() => setView('list')}
      >
        List
      </button>
    </div>
  )
}
