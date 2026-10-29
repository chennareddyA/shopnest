import { useEffect, useState } from 'react'
import type { Category } from '../types'
import type { CatalogQuery } from '../lib/catalog'

type Props = {
  categories: Category[]
  query: CatalogQuery
  onChange: (changes: Record<string, string | null>) => void
}

export default function Filters({ categories, query, onChange }: Props) {
  // Price inputs are applied on "Apply" so the URL doesn't change on every keystroke
  const [min, setMin] = useState(query.min?.toString() ?? '')
  const [max, setMax] = useState(query.max?.toString() ?? '')
  useEffect(() => {
    setMin(query.min?.toString() ?? '')
    setMax(query.max?.toString() ?? '')
  }, [query.min, query.max])

  const chip = (active: boolean) =>
    `rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
      active ? 'border-ink bg-ink text-white' : 'border-line bg-white text-ink hover:border-ink'
    }`

  return (
    <div className="space-y-8">
      <fieldset>
        <legend className="mb-3 font-bold">Category</legend>
        <div className="flex flex-wrap gap-2">
          <button type="button" className={chip(!query.category)} onClick={() => onChange({ category: null })} aria-pressed={!query.category}>
            All
          </button>
          {categories.map((c) => (
            <button
              key={c.slug}
              type="button"
              className={chip(query.category === c.slug)}
              aria-pressed={query.category === c.slug}
              onClick={() => onChange({ category: query.category === c.slug ? null : c.slug })}
            >
              {c.name}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-3 font-bold">Price</legend>
        <form
          className="flex items-end gap-2"
          onSubmit={(e) => {
            e.preventDefault()
            onChange({ min: min || null, max: max || null })
          }}
        >
          <label className="flex-1 text-sm text-muted">
            Min
            <input type="number" min={0} inputMode="decimal" value={min} onChange={(e) => setMin(e.target.value)} placeholder="$0" className="mt-1 h-10 w-full rounded-xl border border-line bg-white px-3 text-ink outline-none focus:border-ink" />
          </label>
          <label className="flex-1 text-sm text-muted">
            Max
            <input type="number" min={0} inputMode="decimal" value={max} onChange={(e) => setMax(e.target.value)} placeholder="Any" className="mt-1 h-10 w-full rounded-xl border border-line bg-white px-3 text-ink outline-none focus:border-ink" />
          </label>
          <button type="submit" className="h-10 rounded-xl bg-ink px-4 text-sm font-semibold text-white hover:bg-black">
            Apply
          </button>
        </form>
      </fieldset>

      <label className="flex cursor-pointer items-center gap-3 font-semibold">
        <input
          type="checkbox"
          checked={query.inStock}
          onChange={(e) => onChange({ inStock: e.target.checked ? '1' : null })}
          className="size-5 accent-[#ea580c]"
        />
        In stock only
      </label>
    </div>
  )
}
