import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Order } from '../types'

type OrdersState = {
  orders: Order[]
  addOrder: (order: Order) => void
}

export const useOrders = create<OrdersState>()(
  persist(
    (set) => ({
      orders: [],
      addOrder: (order) => set((s) => ({ orders: [order, ...s.orders].slice(0, 20) })),
    }),
    { name: 'shopnest-orders' },
  ),
)
