import { useRef, useState, type FormEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useCart } from '../store/cart'
import { useOrders } from '../store/orders'
import { cartSubtotal, DELIVERY, shippingCost } from '../lib/pricing'
import { formatPrice } from '../lib/format'
import {
  formatCardNumber,
  formatExpiry,
  validatePayment,
  validateShipping,
  type Errors,
  type PaymentDetails,
} from '../lib/validation'
import type { CartItem, DeliveryOption, ShippingDetails } from '../types'
import Field from '../components/Field'
import OrderSummary from '../components/OrderSummary'
import { CheckIcon } from '../components/Icons'

const STEPS = ['Shipping', 'Delivery', 'Payment'] as const
const COUNTRIES = ['India', 'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'United Arab Emirates', 'Singapore']

const emptyShipping: ShippingDetails = { fullName: '', email: '', phone: '', address: '', city: '', postalCode: '', country: 'India' }
const emptyPayment: PaymentDetails = { cardName: '', cardNumber: '', expiry: '', cvc: '' }

/** Moves keyboard focus to the first field with an error */
function focusFirstError(errors: Record<string, string | undefined>, order: string[]) {
  const first = order.find((key) => errors[key])
  if (first) document.getElementById(first)?.focus()
}

export default function CheckoutPage() {
  const cartItems = useCart((s) => s.items)
  const clearCart = useCart((s) => s.clear)
  // "Buy now" passes a single item in the navigation state; otherwise we check out the whole cart
  const buyNowItem = (useLocation().state as { buyNow?: CartItem } | null)?.buyNow
  const items = buyNowItem ? [buyNowItem] : cartItems
  const addOrder = useOrders((s) => s.addOrder)
  const navigate = useNavigate()

  const [step, setStep] = useState(0)
  const [shipping, setShipping] = useState(emptyShipping)
  const [delivery, setDelivery] = useState<DeliveryOption>('standard')
  const [payment, setPayment] = useState(emptyPayment)
  const [shippingErrors, setShippingErrors] = useState<Errors<ShippingDetails>>({})
  const [paymentErrors, setPaymentErrors] = useState<Errors<PaymentDetails>>({})
  const [placing, setPlacing] = useState(false)
  const placed = useRef(false)

  if (items.length === 0 && !placed.current) return <Navigate to="/cart" replace />

  const subtotal = cartSubtotal(items)

  function setShip<K extends keyof ShippingDetails>(key: K, value: string) {
    setShipping((s) => ({ ...s, [key]: value }))
    if (shippingErrors[key]) setShippingErrors((e) => ({ ...e, [key]: undefined }))
  }
  function setPay<K extends keyof PaymentDetails>(key: K, value: string) {
    setPayment((p) => ({ ...p, [key]: value }))
    if (paymentErrors[key]) setPaymentErrors((e) => ({ ...e, [key]: undefined }))
  }

  function submitShipping(e: FormEvent) {
    e.preventDefault()
    const errors = validateShipping(shipping)
    setShippingErrors(errors)
    if (Object.keys(errors).length) return focusFirstError(errors, Object.keys(emptyShipping))
    setStep(1)
  }

  async function placeOrder(e: FormEvent) {
    e.preventDefault()
    const errors = validatePayment(payment)
    setPaymentErrors(errors)
    if (Object.keys(errors).length) return focusFirstError(errors, Object.keys(emptyPayment))

    setPlacing(true)
    await new Promise((r) => setTimeout(r, 900)) // simulate the payment request
    const cost = shippingCost(subtotal, delivery)
    const id = `SN-${Date.now().toString(36).toUpperCase()}`
    addOrder({
      id,
      createdAt: new Date().toISOString(),
      items,
      shipping,
      delivery,
      cardLast4: payment.cardNumber.replace(/\s/g, '').slice(-4),
      subtotal,
      shippingCost: cost,
      total: Math.round((subtotal + cost) * 100) / 100,
    })
    placed.current = true
    if (!buyNowItem) clearCart()
    navigate(`/order/${id}`, { replace: true })
  }

  return (
    <div>
      <h1 className="text-3xl font-extrabold tracking-tight">Checkout</h1>
      {buyNowItem && cartItems.length > 0 && (
        <p className="mt-2 text-sm text-muted">You’re buying this item now. Your cart is saved for later.</p>
      )}

      <ol className="mt-6 flex items-center gap-2 text-sm font-semibold sm:gap-4" aria-label="Checkout steps">
        {STEPS.map((label, i) => (
          <li key={label} className="flex items-center gap-2 sm:gap-4" aria-current={i === step ? 'step' : undefined}>
            <span className={`grid size-8 place-items-center rounded-full ${i < step ? 'bg-ink text-white' : i === step ? 'bg-accent text-white' : 'bg-stone-200 text-muted'}`}>
              {i < step ? <CheckIcon className="size-4" /> : i + 1}
            </span>
            <span className={i === step ? 'text-ink' : 'text-muted'}>{label}</span>
            {i < STEPS.length - 1 && <span className="h-px w-6 bg-line sm:w-12" aria-hidden="true" />}
          </li>
        ))}
      </ol>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="rounded-3xl border border-line bg-white p-6 sm:p-8">
          {step === 0 && (
            <form onSubmit={submitShipping} noValidate>
              <h2 className="text-xl font-extrabold">Shipping details</h2>
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <Field id="fullName" label="Full name" autoComplete="name" value={shipping.fullName} onChange={(e) => setShip('fullName', e.target.value)} error={shippingErrors.fullName} className="sm:col-span-2" />
                <Field id="email" label="Email" type="email" autoComplete="email" value={shipping.email} onChange={(e) => setShip('email', e.target.value)} error={shippingErrors.email} />
                <Field id="phone" label="Phone" type="tel" autoComplete="tel" value={shipping.phone} onChange={(e) => setShip('phone', e.target.value)} error={shippingErrors.phone} />
                <Field id="address" label="Street address" autoComplete="street-address" value={shipping.address} onChange={(e) => setShip('address', e.target.value)} error={shippingErrors.address} className="sm:col-span-2" />
                <Field id="city" label="City" autoComplete="address-level2" value={shipping.city} onChange={(e) => setShip('city', e.target.value)} error={shippingErrors.city} />
                <Field id="postalCode" label="Postal code" autoComplete="postal-code" value={shipping.postalCode} onChange={(e) => setShip('postalCode', e.target.value)} error={shippingErrors.postalCode} />
                <div className="sm:col-span-2">
                  <label htmlFor="country" className="text-sm font-semibold">Country</label>
                  <select id="country" autoComplete="country-name" value={shipping.country} onChange={(e) => setShip('country', e.target.value)} className="mt-1.5 h-12 w-full rounded-xl border border-line bg-white px-4 outline-none focus:border-ink">
                    {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <button type="submit" className="mt-8 h-12 w-full rounded-full bg-ink font-bold text-white hover:bg-black sm:w-auto sm:px-10">
                Continue to delivery
              </button>
            </form>
          )}

          {step === 1 && (
            <form onSubmit={(e) => { e.preventDefault(); setStep(2) }}>
              <fieldset>
                <legend className="text-xl font-extrabold">Delivery method</legend>
                <div className="mt-6 space-y-3">
                  {(Object.keys(DELIVERY) as DeliveryOption[]).map((key) => {
                    const option = DELIVERY[key]
                    const cost = shippingCost(subtotal, key)
                    return (
                      <label key={key} className={`flex cursor-pointer items-center gap-4 rounded-2xl border-2 p-4 ${delivery === key ? 'border-ink' : 'border-line hover:border-stone-300'}`}>
                        <input type="radio" name="delivery" value={key} checked={delivery === key} onChange={() => setDelivery(key)} className="size-5 accent-[#ea580c]" />
                        <span className="flex-1">
                          <span className="block font-bold">{option.label}</span>
                          <span className="text-sm text-muted">{option.detail}</span>
                        </span>
                        <span className="font-bold">{cost === 0 ? 'Free' : formatPrice(cost)}</span>
                      </label>
                    )
                  })}
                </div>
              </fieldset>
              <p className="mt-6 text-sm text-muted">
                Shipping to <span className="font-semibold text-ink">{shipping.fullName}, {shipping.address}, {shipping.city} {shipping.postalCode}, {shipping.country}</span>
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button type="button" onClick={() => setStep(0)} className="h-12 rounded-full border border-line px-6 font-semibold hover:border-ink">Back</button>
                <button type="submit" className="h-12 rounded-full bg-ink px-10 font-bold text-white hover:bg-black">Continue to payment</button>
              </div>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={placeOrder} noValidate>
              <h2 className="text-xl font-extrabold">Payment</h2>
              <p className="mt-2 rounded-xl bg-orange-50 px-4 py-3 text-sm text-accent-dark">
                Demo checkout: no real payment is taken. Use test card <span className="font-bold">4242 4242 4242 4242</span> with any future date.
              </p>
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <Field id="cardName" label="Name on card" autoComplete="cc-name" value={payment.cardName} onChange={(e) => setPay('cardName', e.target.value)} error={paymentErrors.cardName} className="sm:col-span-2" />
                <Field id="cardNumber" label="Card number" inputMode="numeric" autoComplete="cc-number" placeholder="1234 5678 9012 3456" value={payment.cardNumber} onChange={(e) => setPay('cardNumber', formatCardNumber(e.target.value))} error={paymentErrors.cardNumber} className="sm:col-span-2" />
                <Field id="expiry" label="Expiry date" inputMode="numeric" autoComplete="cc-exp" placeholder="MM/YY" value={payment.expiry} onChange={(e) => setPay('expiry', formatExpiry(e.target.value))} error={paymentErrors.expiry} />
                <Field id="cvc" label="Security code" inputMode="numeric" autoComplete="cc-csc" placeholder="123" maxLength={4} value={payment.cvc} onChange={(e) => setPay('cvc', e.target.value.replace(/\D/g, ''))} error={paymentErrors.cvc} />
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <button type="button" onClick={() => setStep(1)} disabled={placing} className="h-12 rounded-full border border-line px-6 font-semibold hover:border-ink">Back</button>
                <button type="submit" disabled={placing} className="h-12 flex-1 rounded-full bg-accent px-10 font-bold text-white hover:bg-accent-dark disabled:opacity-60 sm:flex-none">
                  {placing ? 'Placing order…' : `Pay ${formatPrice(subtotal + shippingCost(subtotal, delivery))}`}
                </button>
              </div>
            </form>
          )}
        </div>

        <OrderSummary items={items} delivery={delivery} showItems />
      </div>
    </div>
  )
}
