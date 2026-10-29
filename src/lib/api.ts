import type { Category, Product } from '../types'

const BASE = 'https://dummyjson.com'

async function getJson<T>(path: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { signal })
  if (!res.ok) throw new Error(res.status === 404 ? 'Not found' : `Request failed (${res.status})`)
  return res.json() as Promise<T>
}

// The full catalog (~200 products) is small, so it is loaded once and cached.
// Search, filtering, sorting and paging then happen instantly in the browser.
let catalogPromise: Promise<Product[]> | null = null

export function fetchCatalog(): Promise<Product[]> {
  catalogPromise ??= getJson<{ products: Product[] }>('/products?limit=0')
    .then((d) => d.products)
    .catch((err) => {
      catalogPromise = null // allow a retry after a failure
      throw err
    })
  return catalogPromise
}

let categoriesPromise: Promise<Category[]> | null = null

export function fetchCategories(): Promise<Category[]> {
  categoriesPromise ??= getJson<Category[]>('/products/categories').catch((err) => {
    categoriesPromise = null
    throw err
  })
  return categoriesPromise
}

export function fetchProduct(id: string, signal?: AbortSignal): Promise<Product> {
  return getJson<Product>(`/products/${encodeURIComponent(id)}`, signal)
}
