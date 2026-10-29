import { describe, expect, it } from 'vitest'
import { parseQuery, queryCatalog, PAGE_SIZE } from './catalog'
import type { Product } from '../types'

const product = (id: number, over: Partial<Product> = {}): Product => ({
  id,
  title: `Product ${id}`,
  description: '',
  category: 'beauty',
  price: 10 * id,
  discountPercentage: 0,
  rating: 4,
  stock: 5,
  thumbnail: '',
  images: [],
  ...over,
})

describe('parseQuery', () => {
  it('reads valid params and ignores invalid ones', () => {
    const q = parseQuery(new URLSearchParams('q=%20phone%20&sort=bogus&min=-5&max=200&page=0&inStock=1'))
    expect(q).toMatchObject({ q: 'phone', sort: 'featured', min: null, max: 200, page: 1, inStock: true })
  })
})

describe('queryCatalog', () => {
  const products = [
    product(1, { title: 'Red Lipstick', brand: 'Essence' }),
    product(2, { category: 'laptops', title: 'Apple MacBook', brand: 'Apple', rating: 4.9 }),
    product(3, { price: 100, discountPercentage: 50, stock: 0 }), // final price 50
  ]
  const base = parseQuery(new URLSearchParams())

  it('searches title, brand and category', () => {
    expect(queryCatalog(products, { ...base, q: 'apple' }).items.map((p) => p.id)).toEqual([2])
    expect(queryCatalog(products, { ...base, q: 'essence' }).items.map((p) => p.id)).toEqual([1])
  })

  it('filters by one or several categories', () => {
    expect(queryCatalog(products, { ...base, categories: ['laptops'] }).total).toBe(1)
    expect(queryCatalog(products, { ...base, categories: ['laptops', 'beauty'] }).total).toBe(3)
    expect(parseQuery(new URLSearchParams('category=laptops,beauty')).categories).toEqual(['laptops', 'beauty'])
  })

  it('filters by discounted price range and stock', () => {
    expect(queryCatalog(products, { ...base, min: 40, max: 60 }).items.map((p) => p.id)).toEqual([3])
    expect(queryCatalog(products, { ...base, inStock: true }).items.map((p) => p.id)).toEqual([1, 2])
  })

  it('sorts by final price and rating', () => {
    expect(queryCatalog(products, { ...base, sort: 'price-desc' }).items.map((p) => p.id)).toEqual([3, 2, 1])
    expect(queryCatalog(products, { ...base, sort: 'rating' }).items[0].id).toBe(2)
  })

  it('paginates and clamps the page number', () => {
    const many = Array.from({ length: PAGE_SIZE * 2 + 3 }, (_, i) => product(i + 1))
    const last = queryCatalog(many, { ...base, page: 99 })
    expect(last.pageCount).toBe(3)
    expect(last.page).toBe(3)
    expect(last.items).toHaveLength(3)
  })
})
