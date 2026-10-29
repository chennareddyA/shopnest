import { describe, expect, it } from 'vitest'
import { formatCardNumber, formatExpiry, isValidCardNumber, isValidExpiry, validateShipping } from './validation'

describe('card helpers', () => {
  it('accepts valid card numbers using the Luhn check', () => {
    expect(isValidCardNumber('4242 4242 4242 4242')).toBe(true)
    expect(isValidCardNumber('4242 4242 4242 4241')).toBe(false)
    expect(isValidCardNumber('1234')).toBe(false)
  })

  it('rejects expired or malformed dates', () => {
    const now = new Date(2026, 9, 15) // 15 Oct 2026
    expect(isValidExpiry('10/26', now)).toBe(true) // valid until the end of the month
    expect(isValidExpiry('09/26', now)).toBe(false)
    expect(isValidExpiry('13/30', now)).toBe(false)
    expect(isValidExpiry('1230', now)).toBe(false)
  })

  it('formats input as the user types', () => {
    expect(formatCardNumber('4242424242424242')).toBe('4242 4242 4242 4242')
    expect(formatExpiry('1228')).toBe('12/28')
  })
})

describe('validateShipping', () => {
  it('returns an error per invalid field', () => {
    const errors = validateShipping({ fullName: 'A', email: 'nope', phone: '123', address: '', city: '', postalCode: '!', country: '' })
    expect(Object.keys(errors).sort()).toEqual(['address', 'city', 'country', 'email', 'fullName', 'phone', 'postalCode'])
  })

  it('passes complete details', () => {
    const errors = validateShipping({
      fullName: 'Chenna Reddy',
      email: 'chenna@example.com',
      phone: '+91 98765 43210',
      address: '12 Main Road',
      city: 'Hyderabad',
      postalCode: '500001',
      country: 'India',
    })
    expect(errors).toEqual({})
  })
})
