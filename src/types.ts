export type Review = {
  rating: number
  comment: string
  date: string
  reviewerName: string
}

export type Product = {
  id: number
  title: string
  description: string
  category: string
  price: number
  discountPercentage: number
  rating: number
  stock: number
  brand?: string
  thumbnail: string
  images: string[]
  availabilityStatus?: string
  warrantyInformation?: string
  shippingInformation?: string
  returnPolicy?: string
  reviews?: Review[]
}

export type Category = { slug: string; name: string }

export type CartItem = {
  id: number
  title: string
  thumbnail: string
  price: number // price after discount
  quantity: number
  stock: number
}

export type ShippingDetails = {
  fullName: string
  email: string
  phone: string
  address: string
  city: string
  postalCode: string
  country: string
}

export type DeliveryOption = 'standard' | 'express'

export type Order = {
  id: string
  createdAt: string
  items: CartItem[]
  shipping: ShippingDetails
  delivery: DeliveryOption
  cardLast4: string
  subtotal: number
  shippingCost: number
  total: number
}
