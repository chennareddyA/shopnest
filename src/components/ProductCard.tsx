import { Link } from 'react-router-dom'
import type { Product } from '../types'
import { finalPrice, titleCase } from '../lib/format'
import { useCart } from '../store/cart'
import { useWishlist } from '../store/wishlist'
import { useToast } from '../store/toast'
import Price from './Price'
import Rating from './Rating'
import { HeartIcon } from './Icons'

export default function ProductCard({ product }: { product: Product }) {
  const add = useCart((s) => s.add)
  const saved = useWishlist((s) => s.ids.includes(product.id))
  const toggleWishlist = useWishlist((s) => s.toggle)
  const toast = useToast((s) => s.show)
  const outOfStock = product.stock <= 0

  function addToCart() {
    add({
      id: product.id,
      title: product.title,
      thumbnail: product.thumbnail,
      price: finalPrice(product.price, product.discountPercentage),
      stock: product.stock,
    })
    toast(`${product.title} added to cart`, { label: 'View cart', to: '/cart' })
  }

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-white transition-shadow hover:shadow-lg hover:shadow-stone-200/70">
      <div className="relative aspect-square bg-stone-100">
        <img
          src={product.thumbnail}
          alt=""
          loading="lazy"
          className="size-full object-contain p-6 transition-transform duration-300 group-hover:scale-105"
        />
        {product.discountPercentage >= 10 && (
          <span className="absolute top-3 left-3 rounded-full bg-accent px-2.5 py-1 text-xs font-bold text-white">
            −{Math.round(product.discountPercentage)}%
          </span>
        )}
        <button
          type="button"
          onClick={() => toggleWishlist(product.id)}
          aria-pressed={saved}
          aria-label={saved ? `Remove ${product.title} from wishlist` : `Save ${product.title} to wishlist`}
          className={`absolute top-3 right-3 z-10 grid size-9 place-items-center rounded-full bg-white/90 shadow-sm transition-colors ${
            saved ? 'text-accent' : 'text-ink hover:text-accent'
          }`}
        >
          <HeartIcon className="size-5" filled={saved} />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-semibold tracking-wide text-muted uppercase">{product.brand ?? titleCase(product.category)}</p>
        <h3 className="mt-1 line-clamp-2 min-h-[2.75rem] font-semibold leading-snug">
          {/* The link covers the card, so the whole card is clickable */}
          <Link to={`/product/${product.id}`} className="after:absolute after:inset-0 hover:text-accent">
            {product.title}
          </Link>
        </h3>
        <div className="mt-2">
          <Rating value={product.rating} />
        </div>
        <div className="mt-3 flex flex-1 items-end justify-between gap-2">
          <Price price={product.price} discount={product.discountPercentage} />
        </div>
        <button
          type="button"
          onClick={addToCart}
          disabled={outOfStock}
          className="relative z-10 mt-4 h-11 rounded-full bg-ink text-sm font-semibold text-white transition-colors hover:bg-black disabled:cursor-not-allowed disabled:bg-stone-300"
        >
          {outOfStock ? 'Out of stock' : 'Add to cart'}
        </button>
      </div>
    </article>
  )
}

export function ProductCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-line bg-white" aria-hidden="true">
      <div className="aspect-square bg-stone-100" />
      <div className="space-y-3 p-4">
        <div className="h-3 w-1/3 rounded bg-stone-200" />
        <div className="h-4 w-4/5 rounded bg-stone-200" />
        <div className="h-4 w-1/2 rounded bg-stone-200" />
        <div className="h-11 rounded-full bg-stone-200" />
      </div>
    </div>
  )
}
