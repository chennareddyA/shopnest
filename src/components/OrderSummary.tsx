import type { ReactNode } from 'react'
import type { CartItem, DeliveryOption } from '../types'
import { formatPrice } from '../lib/format'
import { cartSubtotal, FREE_SHIPPING_FROM, shippingCost } from '../lib/pricing'

type Props = { items: CartItem[]; delivery?: DeliveryOption; showItems?: boolean; children?: ReactNode }

export default function OrderSummary({ items, delivery = 'standard', showItems = false, children }: Props) {
  const subtotal = cartSubtotal(items)
  const shipping = shippingCost(subtotal, delivery)
  const remaining = FREE_SHIPPING_FROM - subtotal

  return (
    <aside aria-label="Order summary" className="rounded-3xl border border-line bg-white p-6 lg:sticky lg:top-24">
      <h2 className="text-lg font-extrabold">Order summary</h2>

      {showItems && (
        <ul className="mt-4 space-y-3 border-b border-line pb-4">
          {items.map((i) => (
            <li key={i.id} className="flex items-center gap-3 text-sm">
              <span className="relative">
                <img src={i.thumbnail} alt="" className="size-14 rounded-xl bg-stone-100 object-contain p-1" />
                <span className="absolute -top-1.5 -right-1.5 grid size-5 place-items-center rounded-full bg-ink text-[11px] font-bold text-white">{i.quantity}</span>
              </span>
              <span className="line-clamp-2 flex-1">{i.title}</span>
              <span className="font-semibold">{formatPrice(i.price * i.quantity)}</span>
            </li>
          ))}
        </ul>
      )}

      <dl className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted">Subtotal</dt>
          <dd className="font-semibold">{formatPrice(subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted">Shipping</dt>
          <dd className="font-semibold">{shipping === 0 ? 'Free' : formatPrice(shipping)}</dd>
        </div>
        <div className="flex justify-between border-t border-line pt-3 text-base">
          <dt className="font-bold">Total</dt>
          <dd className="font-extrabold">{formatPrice(subtotal + shipping)}</dd>
        </div>
      </dl>

      {delivery === 'standard' && remaining > 0 && subtotal > 0 && (
        <div className="mt-4">
          <p className="text-sm text-muted">
            Add <span className="font-semibold text-ink">{formatPrice(remaining)}</span> more for free shipping.
          </p>
          <div className="mt-2 h-1.5 rounded-full bg-stone-100">
            <div className="h-full rounded-full bg-accent" style={{ width: `${Math.min((subtotal / FREE_SHIPPING_FROM) * 100, 100)}%` }} />
          </div>
        </div>
      )}

      {children && <div className="mt-6">{children}</div>}
    </aside>
  )
}
