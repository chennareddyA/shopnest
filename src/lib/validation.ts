import type { ShippingDetails } from '../types'

export type Errors<T> = Partial<Record<keyof T, string>>

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function validateShipping(v: ShippingDetails): Errors<ShippingDetails> {
  const e: Errors<ShippingDetails> = {}
  if (v.fullName.trim().length < 2) e.fullName = 'Enter your full name.'
  if (!EMAIL.test(v.email.trim())) e.email = 'Enter a valid email address.'
  const digits = v.phone.replace(/\D/g, '')
  if (digits.length < 10 || digits.length > 15) e.phone = 'Enter a phone number with 10 to 15 digits.'
  if (v.address.trim().length < 5) e.address = 'Enter your street address.'
  if (v.city.trim().length < 2) e.city = 'Enter your city.'
  if (!/^[A-Za-z0-9 -]{3,10}$/.test(v.postalCode.trim())) e.postalCode = 'Enter a valid postal code.'
  if (!v.country) e.country = 'Choose a country.'
  return e
}

export type PaymentDetails = { cardName: string; cardNumber: string; expiry: string; cvc: string }

/** Luhn checksum, the standard check digit used by card numbers */
export function isValidCardNumber(input: string) {
  const digits = input.replace(/\s/g, '')
  if (!/^\d{13,19}$/.test(digits)) return false
  let sum = 0
  let double = false
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = Number(digits[i])
    if (double) {
      d *= 2
      if (d > 9) d -= 9
    }
    sum += d
    double = !double
  }
  return sum % 10 === 0
}

/** MM/YY that is not in the past */
export function isValidExpiry(input: string, now = new Date()) {
  const m = /^(\d{2})\/(\d{2})$/.exec(input.trim())
  if (!m) return false
  const month = Number(m[1])
  const year = 2000 + Number(m[2])
  if (month < 1 || month > 12) return false
  const endOfMonth = new Date(year, month, 0, 23, 59, 59)
  return endOfMonth >= now
}

export function validatePayment(v: PaymentDetails, now = new Date()): Errors<PaymentDetails> {
  const e: Errors<PaymentDetails> = {}
  if (v.cardName.trim().length < 2) e.cardName = 'Enter the name on the card.'
  if (!isValidCardNumber(v.cardNumber)) e.cardNumber = 'Enter a valid card number.'
  if (!isValidExpiry(v.expiry, now)) e.expiry = 'Enter a valid expiry date (MM/YY).'
  if (!/^\d{3,4}$/.test(v.cvc)) e.cvc = 'Enter the 3 or 4 digit security code.'
  return e
}

/** "4242424242424242" -> "4242 4242 4242 4242" */
export const formatCardNumber = (input: string) =>
  input.replace(/\D/g, '').slice(0, 19).replace(/(\d{4})(?=\d)/g, '$1 ')

/** "1228" -> "12/28" */
export function formatExpiry(input: string) {
  const d = input.replace(/\D/g, '').slice(0, 4)
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d
}
