import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem } from '../types'

// Pure helpers keep the rules testable without React
export function addItem(items: CartItem[], item: Omit<CartItem, 'quantity'>, quantity = 1): CartItem[] {
  const existing = items.find((i) => i.id === item.id)
  if (existing) {
    return items.map((i) => (i.id === item.id ? { ...i, quantity: Math.min(i.quantity + quantity, i.stock) } : i))
  }
  return [...items, { ...item, quantity: Math.min(quantity, item.stock) }]
}

export function setItemQuantity(items: CartItem[], id: number, quantity: number): CartItem[] {
  if (quantity <= 0) return items.filter((i) => i.id !== id)
  return items.map((i) => (i.id === id ? { ...i, quantity: Math.min(quantity, i.stock) } : i))
}

type CartState = {
  items: CartItem[]
  add: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void
  setQuantity: (id: number, quantity: number) => void
  remove: (id: number) => void
  clear: () => void
}

// Persisted to localStorage so the cart survives a refresh
export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      add: (item, quantity = 1) => set((s) => ({ items: addItem(s.items, item, quantity) })),
      setQuantity: (id, quantity) => set((s) => ({ items: setItemQuantity(s.items, id, quantity) })),
      remove: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      clear: () => set({ items: [] }),
    }),
    { name: 'shopnest-cart' },
  ),
)
