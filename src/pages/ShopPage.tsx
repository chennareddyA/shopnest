import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { fetchCatalog, fetchCategories } from '../lib/api'
import { parseQuery, queryCatalog } from '../lib/catalog'
import SortMenu from '../components/SortMenu'
import { useAsync } from '../hooks/useAsync'
import ProductCard, { ProductCardSkeleton } from '../components/ProductCard'
import Filters from '../components/Filters'
import Pagination from '../components/Pagination'
import { EmptyState, ErrorState } from '../components/States'
import { CloseIcon, FilterIcon, SearchIcon } from '../components/Icons'

export default function ShopPage() {
  const [params, setParams] = useSearchParams()
  const query = parseQuery(params)
  const [showFilters, setShowFilters] = useState(false)

  const { data, error, loading, retry } = useAsync(
    () => Promise.all([fetchCatalog(), fetchCategories()]),
    [],
  )

  const result = useMemo(() => (data ? queryCatalog(data[0], query) : null), [data, params])
  const categories = data?.[1] ?? []
  const categoryName = categories.find((c) => c.slug === query.category)?.name

  /** Updates filters in the URL. Any filter change goes back to page 1. */
  function update(changes: Record<string, string | null>) {
    const next = new URLSearchParams(params)
    for (const [key, value] of Object.entries(changes)) {
      if (value === null || value === '') next.delete(key)
      else next.set(key, value)
    }
    if (!('page' in changes)) next.delete('page')
    setParams(next)
  }

  const activeFilters = [
    query.q && { key: 'q', label: `“${query.q}”` },
    categoryName && { key: 'category', label: categoryName },
    query.min !== null && { key: 'min', label: `From $${query.min}` },
    query.max !== null && { key: 'max', label: `Up to $${query.max}` },
    query.inStock && { key: 'inStock', label: 'In stock' },
  ].filter(Boolean) as { key: string; label: string }[]

  const title = query.q ? `Results for “${query.q}”` : (categoryName ?? 'All products')

  return (
    <div className="lg:grid lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-10">
      {/* Filters: sidebar on desktop, collapsible panel on mobile */}
      <aside aria-label="Filters" className={`${showFilters ? 'block' : 'hidden'} mb-8 rounded-2xl border border-line bg-white p-5 lg:sticky lg:top-24 lg:mb-0 lg:block lg:self-start lg:border-0 lg:bg-transparent lg:p-0`}>
        <div className="mb-4 flex items-center justify-between lg:hidden">
          <p className="text-lg font-bold">Filters</p>
          <button type="button" onClick={() => setShowFilters(false)} aria-label="Close filters" className="rounded-full p-2 hover:bg-stone-100">
            <CloseIcon />
          </button>
        </div>
        {loading && !data ? (
          <div className="animate-pulse space-y-3" aria-hidden="true">
            {Array.from({ length: 8 }, (_, i) => <div key={i} className="h-8 rounded-full bg-stone-200" />)}
          </div>
        ) : (
          <Filters categories={categories} query={query} onChange={update} />
        )}
      </aside>

      <section aria-labelledby="results-title">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 id="results-title" className="text-3xl font-extrabold tracking-tight">{title}</h1>
            <p className="mt-1 text-muted" aria-live="polite">
              {result ? `${result.total} ${result.total === 1 ? 'product' : 'products'}` : 'Loading products…'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowFilters((v) => !v)}
              aria-expanded={showFilters}
              className="inline-flex h-11 items-center gap-2 rounded-full border border-line bg-white px-4 text-sm font-semibold lg:hidden"
            >
              <FilterIcon /> Filters {activeFilters.length > 0 && `(${activeFilters.length})`}
            </button>
            <SortMenu value={query.sort} onChange={(v) => update({ sort: v === 'featured' ? null : v })} />
          </div>
        </div>

        {activeFilters.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {activeFilters.map((f) => (
              <button key={f.key} type="button" onClick={() => update({ [f.key]: null })} className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-3 py-1.5 text-sm font-medium text-accent-dark hover:bg-orange-100">
                {f.label} <CloseIcon className="size-3.5" />
                <span className="sr-only">Remove filter</span>
              </button>
            ))}
            <button type="button" onClick={() => setParams(new URLSearchParams())} className="text-sm font-semibold text-muted underline-offset-4 hover:text-ink hover:underline">
              Clear all
            </button>
          </div>
        )}

        <div className="mt-6">
          {error ? (
            <ErrorState message={error} onRetry={retry} />
          ) : !result ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }, (_, i) => <ProductCardSkeleton key={i} />)}
            </div>
          ) : result.total === 0 ? (
            <EmptyState
              icon={<SearchIcon className="size-6" />}
              title="No products found"
              text="Try a different search term or remove some filters."
              action={{ label: 'Show all products', to: '/' }}
            />
          ) : (
            <>
              <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
                {result.items.map((p) => (
                  <li key={p.id} className="flex">
                    <ProductCard product={p} />
                  </li>
                ))}
              </ul>
              <Pagination page={result.page} pageCount={result.pageCount} onPage={(p) => update({ page: p === 1 ? null : String(p) })} />
            </>
          )}
        </div>
      </section>
    </div>
  )
}
