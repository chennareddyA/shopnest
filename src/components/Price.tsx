import { finalPrice, formatPrice } from '../lib/format'

export default function Price({ price, discount, large = false }: { price: number; discount: number; large?: boolean }) {
  const now = finalPrice(price, discount)
  const showDiscount = discount >= 1
  return (
    <span className="inline-flex flex-wrap items-baseline gap-x-2">
      <span className={`font-bold text-ink ${large ? 'text-3xl' : 'text-lg'}`}>{formatPrice(now)}</span>
      {showDiscount && (
        <>
          <span className={`text-muted line-through ${large ? 'text-lg' : 'text-sm'}`}>{formatPrice(price)}</span>
          {large && <span className="text-sm font-semibold text-accent">Save {Math.round(discount)}%</span>}
        </>
      )}
    </span>
  )
}
