import { useEffect, useState } from 'react'
import type { Category } from '../types'
import { PRICE_RANGES, type CatalogQuery } from '../lib/catalog'
import { CheckIcon } from './Icons'

type Props = {
  categories: Category[]
  query: CatalogQuery
  onChange: (changes: Record<string, string | null>) => void
}

const toText = (n: number | null) => (n === null ? '' : String(n))

export default function Filters({ categories, query, onChange }: Props) {
  // Typed prices apply automatically once the user stops typing; no Apply button needed
  const [min, setMin] = useState(toText(query.min))
  const [max, setMax] = useState(toText(query.max))

  // Keep the boxes in sync when filters change elsewhere (quick ranges, "Clear all")
  useEffect(() => {
    setMin(toText(query.min))
    setMax(toText(query.max))
  }, [query.min, query.max])

  useEffect(() => {
    if (min === toText(query.min) && max === toText(query.max)) return
    const t = window.setTimeout(() => {
      let lo = min === '' ? null : Number(min)
      let hi = max === '' ? null : Number(max)
      if (lo !== null && hi !== null && lo > hi) [lo, hi] = [hi, lo] // swap if entered backwards
      onChange({ min: lo === null ? null : String(lo), max: hi === null ? null : String(hi) })
    }, 600)
    return () => window.clearTimeout(t)
  }, [min, max, query.min, query.max, onChange])

  function toggleCategory(slug: string) {
    const next = query.categories.includes(slug) ? query.categories.filter((c) => c !== slug) : [...query.categories, slug]
    onChange({ category: next.length ? next.join(',') : null })
  }

  const chip = (active: boolean) =>
    `inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
      active ? 'border-ink bg-ink text-white' : 'border-line bg-white text-ink hover:border-ink'
    }`

  return (
    <div className="space-y-8">
      <fieldset>
        <legend className="mb-1 font-bold">Category</legend>
        <p className="mb-3 text-xs text-muted">Choose one or more</p>
        <div className="flex flex-wrap gap-2">
          <button type="button" className={chip(query.categories.length === 0)} aria-pressed={query.categories.length === 0} onClick={() => onChange({ category: null })}>
            All
          </button>
          {categories.map((c) => {
            const on = query.categories.includes(c.slug)
            return (
              <button key={c.slug} type="button" className={chip(on)} aria-pressed={on} onClick={() => toggleCategory(c.slug)}>
                {on && <CheckIcon className="size-3.5" />}
                {c.name}
              </button>
            )
          })}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-3 font-bold">Price</legend>
        <div className="flex flex-wrap gap-2">
          {PRICE_RANGES.map((r) => {
            const on = query.min === r.min && query.max === r.max
            return (
              <button
                key={r.label}
                type="button"
                className={chip(on)}
                aria-pressed={on}
                onClick={() => onChange(on ? { min: null, max: null } : { min: toText(r.min) || null, max: toText(r.max) || null })}
              >
                {r.label}
              </button>
            )
          })}
        </div>
        <div className="mt-4 flex items-end gap-2">
          <label className="flex-1 text-sm text-muted">
            Min
            <input type="number" min={0} inputMode="decimal" value={min} onChange={(e) => setMin(e.target.value)} placeholder="$0" className="mt-1 h-10 w-full rounded-xl border border-line bg-white px-3 text-ink outline-none focus:border-ink" />
          </label>
          <span className="pb-2.5 text-muted" aria-hidden="true">–</span>
          <label className="flex-1 text-sm text-muted">
            Max
            <input type="number" min={0} inputMode="decimal" value={max} onChange={(e) => setMax(e.target.value)} placeholder="Any" className="mt-1 h-10 w-full rounded-xl border border-line bg-white px-3 text-ink outline-none focus:border-ink" />
          </label>
        </div>
        <p className="mt-2 text-xs text-muted">Results update as you type.</p>
      </fieldset>

      <label className="flex cursor-pointer items-center gap-3 font-semibold">
        <input type="checkbox" checked={query.inStock} onChange={(e) => onChange({ inStock: e.target.checked ? '1' : null })} className="size-5 accent-[#ea580c]" />
        In stock only
      </label>
    </div>
  )
}
