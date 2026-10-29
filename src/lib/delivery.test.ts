import { describe, expect, it } from 'vitest'
import { estimatedDelivery, shippingDays } from './delivery'

describe('shippingDays', () => {
  it('parses the shipping text from the API', () => {
    expect(shippingDays('Ships overnight')).toBe(1)
    expect(shippingDays('Ships in 3-5 business days')).toBe(3)
    expect(shippingDays('Ships in 2 weeks')).toBe(14)
    expect(shippingDays('Ships in 1 month')).toBe(30)
    expect(shippingDays(undefined)).toBe(5)
  })

  it('adds transit time to the dispatch time', () => {
    const from = new Date(2026, 9, 1)
    expect(estimatedDelivery('Ships overnight', from).getDate()).toBe(4)
  })
})
