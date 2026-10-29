const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

export const formatPrice = (value: number) => money.format(value)

/** Price the customer pays after the product's discount, rounded to cents */
export const finalPrice = (price: number, discountPercentage: number) =>
  Math.round(price * (1 - discountPercentage / 100) * 100) / 100

export const titleCase = (s: string) => s.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
