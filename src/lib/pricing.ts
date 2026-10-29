import type { CartItem, DeliveryOption } from '../types'

export const FREE_SHIPPING_FROM = 100

export const DELIVERY = {
  standard: { label: 'Standard delivery', detail: '4 to 6 business days', price: 9.99, days: 6 },
  express: { label: 'Express delivery', detail: '1 to 2 business days', price: 19.99, days: 2 },
} as const

const round = (n: number) => Math.round(n * 100) / 100

export const cartSubtotal = (items: CartItem[]) => round(items.reduce((sum, i) => sum + i.price * i.quantity, 0))

export const cartCount = (items: CartItem[]) => items.reduce((sum, i) => sum + i.quantity, 0)

/** Standard delivery is free above the threshold; express is always charged */
export function shippingCost(subtotal: number, option: DeliveryOption) {
  if (subtotal === 0) return 0
  if (option === 'standard' && subtotal >= FREE_SHIPPING_FROM) return 0
  return DELIVERY[option].price
}
