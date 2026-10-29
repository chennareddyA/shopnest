import { Link } from 'react-router-dom'
import { useCart } from '../store/cart'
import { formatPrice } from '../lib/format'
import QuantityInput from '../components/QuantityInput'
import OrderSummary from '../components/OrderSummary'
import { EmptyState } from '../components/States'
import { BagIcon, TrashIcon } from '../components/Icons'

export default function CartPage() {
  const items = useCart((s) => s.items)
  const setQuantity = useCart((s) => s.setQuantity)
  const remove = useCart((s) => s.remove)

  if (items.length === 0) {
    return (
      <EmptyState
        icon={<BagIcon />}
        title="Your cart is empty"
        text="Browse the shop and add something you like."
        action={{ label: 'Start shopping', to: '/' }}
      />
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-extrabold tracking-tight">Your cart</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <ul className="divide-y divide-line rounded-3xl border border-line bg-white">
          {items.map((item) => (
            <li key={item.id} className="flex gap-4 p-4 sm:p-5">
              <Link to={`/product/${item.id}`} className="shrink-0">
                <img src={item.thumbnail} alt="" className="size-24 rounded-2xl bg-stone-100 object-contain p-2 sm:size-28" />
              </Link>
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-start justify-between gap-3">
                  <Link to={`/product/${item.id}`} className="line-clamp-2 font-semibold hover:text-accent">{item.title}</Link>
                  <p className="shrink-0 font-bold">{formatPrice(item.price * item.quantity)}</p>
                </div>
                <p className="mt-1 text-sm text-muted">{formatPrice(item.price)} each</p>
                <div className="mt-auto flex items-center justify-between gap-3 pt-3">
                  <QuantityInput value={item.quantity} max={item.stock} onChange={(n) => setQuantity(item.id, n)} label={`Quantity of ${item.title}`} />
                  <button type="button" onClick={() => remove(item.id)} className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm text-muted hover:bg-stone-100 hover:text-red-700">
                    <TrashIcon className="size-4" /> Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <OrderSummary items={items}>
          <Link to="/checkout" className="grid h-12 place-items-center rounded-full bg-accent font-bold text-white hover:bg-accent-dark">
            Go to checkout
          </Link>
          <Link to="/" className="mt-3 block text-center text-sm font-semibold text-muted hover:text-ink">
            Continue shopping
          </Link>
        </OrderSummary>
      </div>
    </div>
  )
}
