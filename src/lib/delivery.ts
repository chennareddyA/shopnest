/** Turns DummyJSON's shipping text ("Ships in 2 weeks", "Ships overnight") into a number of days */
export function shippingDays(info?: string): number {
  const text = (info ?? '').toLowerCase()
  if (text.includes('overnight')) return 1
  const n = Number(/(\d+)/.exec(text)?.[1] ?? 1)
  if (text.includes('month')) return n * 30
  if (text.includes('week')) return n * 7
  if (text.includes('day')) return n
  return 5
}

/** Estimated arrival: dispatch time plus 2 days in transit */
export function estimatedDelivery(info?: string, from = new Date()) {
  const date = new Date(from)
  date.setDate(date.getDate() + shippingDays(info) + 2)
  return date
}

export const formatDeliveryDate = (d: Date) => d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })
