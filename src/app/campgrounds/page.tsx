export const runtime = 'nodejs'
export const dynamic = 'force-dynamic' // avoid caching searchParams navigation
export const revalidate = 0

import CampgroundCard from '@/components/CampgroundCard'
import { getCampgroundCards } from '@/lib/campgrounds'
import Pagination from '@/components/Pagination'
import ViewToggle from '@/components/ViewToggle'

export default async function CampgroundsPage({
  searchParams,
}: {
  searchParams: { page?: string; view?: string }
}) {
  const pageSize = 12
  const page = Math.max(1, Number(searchParams.page ?? '1'))
  const view = searchParams.view === 'list' ? 'list' : 'grid'

  const { items, total } = await getCampgroundCards({ page, pageSize })

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">All Campgrounds</h1>
        <ViewToggle />
      </div>

      {view === 'grid' ? (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((cg) => (
            <CampgroundCard key={cg.id} cg={cg} variant="grid" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((cg) => (
            <CampgroundCard key={cg.id} cg={cg} variant="list" />
          ))}
        </div>
      )}

      <Pagination page={page} total={total} pageSize={pageSize} />
    </main>
  )
}
