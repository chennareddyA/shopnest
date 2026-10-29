import type { Product } from '../types'
import { finalPrice } from './format'

export type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'discount'

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'rating', label: 'Top rated' },
  { value: 'discount', label: 'Biggest discount' },
]

export const PAGE_SIZE = 12

export type CatalogQuery = {
  q: string
  category: string
  sort: SortKey
  min: number | null
  max: number | null
  inStock: boolean
  page: number
}

/** Reads the shop filters from URL search params, ignoring invalid values */
export function parseQuery(params: URLSearchParams): CatalogQuery {
  const num = (key: string) => {
    const raw = params.get(key)
    if (raw === null || raw === '') return null
    const n = Number(raw)
    return Number.isFinite(n) && n >= 0 ? n : null
  }
  const sort = params.get('sort') as SortKey | null
  const page = Math.floor(Number(params.get('page')))
  return {
    q: params.get('q')?.trim() ?? '',
    category: params.get('category') ?? '',
    sort: SORT_OPTIONS.some((o) => o.value === sort) ? (sort as SortKey) : 'featured',
    min: num('min'),
    max: num('max'),
    inStock: params.get('inStock') === '1',
    page: Number.isFinite(page) && page > 0 ? page : 1,
  }
}

/** Filters, sorts and paginates the catalog. Pure function, so it is easy to test. */
export function queryCatalog(products: Product[], query: CatalogQuery) {
  const q = query.q.toLowerCase()

  const filtered = products.filter((p) => {
    const price = finalPrice(p.price, p.discountPercentage)
    if (q && !`${p.title} ${p.brand ?? ''} ${p.category}`.toLowerCase().includes(q)) return false
    if (query.category && p.category !== query.category) return false
    if (query.min !== null && price < query.min) return false
    if (query.max !== null && price > query.max) return false
    if (query.inStock && p.stock <= 0) return false
    return true
  })

  const sorted = [...filtered]
  const priceOf = (p: Product) => finalPrice(p.price, p.discountPercentage)
  switch (query.sort) {
    case 'price-asc':
      sorted.sort((a, b) => priceOf(a) - priceOf(b))
      break
    case 'price-desc':
      sorted.sort((a, b) => priceOf(b) - priceOf(a))
      break
    case 'rating':
      sorted.sort((a, b) => b.rating - a.rating)
      break
    case 'discount':
      sorted.sort((a, b) => b.discountPercentage - a.discountPercentage)
      break
  }

  const total = sorted.length
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const page = Math.min(query.page, pageCount)
  const items = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return { items, total, page, pageCount }
}
