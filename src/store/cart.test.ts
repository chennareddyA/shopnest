import { describe, expect, it } from 'vitest'
import { addItem, setItemQuantity } from './cart'
import { cartCount, cartSubtotal, shippingCost } from '../lib/pricing'

const phone = { id: 1, title: 'Phone', thumbnail: '', price: 49.99, stock: 3 }

describe('cart rules', () => {
  it('adds items and merges duplicates without exceeding stock', () => {
    let items = addItem([], phone, 2)
    items = addItem(items, phone, 5)
    expect(items).toHaveLength(1)
    expect(items[0].quantity).toBe(3)
  })

  it('removes an item when quantity drops to zero', () => {
    const items = setItemQuantity(addItem([], phone), 1, 0)
    expect(items).toEqual([])
  })

  it('calculates totals and shipping', () => {
    const items = addItem([], phone, 3)
    expect(cartCount(items)).toBe(3)
    expect(cartSubtotal(items)).toBe(149.97)
    expect(shippingCost(149.97, 'standard')).toBe(0) // free over $100
    expect(shippingCost(49.99, 'standard')).toBe(9.99)
    expect(shippingCost(149.97, 'express')).toBe(19.99)
  })
})
