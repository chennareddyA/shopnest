import { Link, useParams } from 'react-router-dom'
import { useOrders } from '../store/orders'
import { DELIVERY } from '../lib/pricing'
import { formatPrice } from '../lib/format'
import { EmptyState } from '../components/States'
import { CheckIcon } from '../components/Icons'

export default function OrderPage() {
  const { orderId } = useParams()
  const order = useOrders((s) => s.orders.find((o) => o.id === orderId))

  if (!order) return <EmptyState title="Order not found" text="We couldn’t find that order on this device." action={{ label: 'Back to shop', to: '/' }} />

  const eta = new Date(order.createdAt)
  eta.setDate(eta.getDate() + DELIVERY[order.delivery].days)

  return (
    <div className="mx-auto max-w-2xl">
      <div className="text-center">
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-emerald-100 text-emerald-700">
          <CheckIcon className="size-8" />
        </span>
        <h1 className="mt-5 text-3xl font-extrabold tracking-tight">Thank you for your order!</h1>
        <p className="mt-2 text-muted">
          Order <span className="font-bold text-ink">{order.id}</span> is confirmed. A receipt was sent to {order.shipping.email}.
        </p>
      </div>

      <div className="mt-10 rounded-3xl border border-line bg-white p-6 sm:p-8">
        <div className="grid gap-6 border-b border-line pb-6 sm:grid-cols-2">
          <div>
            <p className="text-sm font-semibold text-muted">Estimated delivery</p>
            <p className="mt-1 font-bold">{eta.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
            <p className="text-sm text-muted">{DELIVERY[order.delivery].label}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-muted">Shipping to</p>
            <p className="mt-1 font-bold">{order.shipping.fullName}</p>
            <p className="text-sm text-muted">{order.shipping.address}, {order.shipping.city} {order.shipping.postalCode}, {order.shipping.country}</p>
          </div>
        </div>

        <ul className="divide-y divide-line">
          {order.items.map((i) => (
            <li key={i.id} className="flex items-center gap-4 py-4">
              <img src={i.thumbnail} alt="" className="size-16 rounded-xl bg-stone-100 object-contain p-1" />
              <div className="flex-1">
                <p className="font-semibold">{i.title}</p>
                <p className="text-sm text-muted">Qty {i.quantity}</p>
              </div>
              <p className="font-semibold">{formatPrice(i.price * i.quantity)}</p>
            </li>
          ))}
        </ul>

        <dl className="space-y-2 border-t border-line pt-4 text-sm">
          <div className="flex justify-between"><dt className="text-muted">Subtotal</dt><dd>{formatPrice(order.subtotal)}</dd></div>
          <div className="flex justify-between"><dt className="text-muted">Shipping</dt><dd>{order.shippingCost === 0 ? 'Free' : formatPrice(order.shippingCost)}</dd></div>
          <div className="flex justify-between text-base font-extrabold"><dt>Total paid</dt><dd>{formatPrice(order.total)}</dd></div>
          <div className="flex justify-between"><dt className="text-muted">Payment</dt><dd>Card ending {order.cardLast4}</dd></div>
        </dl>
      </div>

      <div className="mt-8 text-center">
        <Link to="/" className="inline-block rounded-full bg-ink px-8 py-3 font-bold text-white hover:bg-black">Continue shopping</Link>
      </div>
    </div>
  )
}
