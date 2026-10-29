import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { fetchCatalog, fetchProduct } from '../lib/api'
import { finalPrice, formatPrice, titleCase } from '../lib/format'
import { estimatedDelivery, formatDeliveryDate } from '../lib/delivery'
import { FREE_SHIPPING_FROM } from '../lib/pricing'
import { useAsync } from '../hooks/useAsync'
import { useCart } from '../store/cart'
import { useWishlist } from '../store/wishlist'
import { useToast } from '../store/toast'
import Rating from '../components/Rating'
import QuantityInput from '../components/QuantityInput'
import ProductCard from '../components/ProductCard'
import { ErrorState, EmptyState } from '../components/States'
import { AwardIcon, CalendarIcon, CardIcon, HeartIcon, LockIcon, ReturnIcon, TruckIcon } from '../components/Icons'
import type { CartItem, Product } from '../types'

function Gallery({ product }: { product: Product }) {
  const images = product.images.length ? product.images : [product.thumbnail]
  const [active, setActive] = useState(0)
  return (
    <div>
      <div className="aspect-square overflow-hidden rounded-3xl border border-line bg-stone-100">
        <img src={images[active]} alt={product.title} className="size-full object-contain p-8" />
      </div>
      {images.length > 1 && (
        <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show image ${i + 1} of ${images.length}`}
              aria-pressed={i === active}
              className={`size-20 shrink-0 overflow-hidden rounded-2xl border-2 bg-stone-100 ${i === active ? 'border-ink' : 'border-transparent hover:border-line'}`}
            >
              <img src={src} alt="" className="size-full object-contain p-2" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

/** Amazon-style price block: discount, final price, list price and savings */
function PriceBlock({ product }: { product: Product }) {
  const now = finalPrice(product.price, product.discountPercentage)
  const hasDiscount = product.discountPercentage >= 1
  return (
    <div>
      <p className="flex items-baseline gap-3">
        {hasDiscount && <span className="text-3xl font-light text-red-600">−{Math.round(product.discountPercentage)}%</span>}
        <span className="text-4xl font-extrabold tracking-tight">{formatPrice(now)}</span>
      </p>
      {hasDiscount && (
        <p className="mt-1 text-sm text-muted">
          List price: <span className="line-through">{formatPrice(product.price)}</span>
          <span className="ml-3 font-semibold text-emerald-700">You save {formatPrice(product.price - now)}</span>
        </p>
      )}
      <p className="mt-1 text-sm text-muted">Inclusive of all taxes</p>
    </div>
  )
}

/** Offer cards and service highlights, built from the product's own data */
function Highlights({ product }: { product: Product }) {
  const now = finalPrice(product.price, product.discountPercentage)
  const freeDelivery = now >= FREE_SHIPPING_FROM
  const arrives = formatDeliveryDate(estimatedDelivery(product.shippingInformation))
  const offers = [
    now >= 50 && { icon: CardIcon, title: 'No Cost EMI', text: `From ${formatPrice(now / 6)}/month for 6 months, no interest.` },
    {
      icon: CalendarIcon,
      title: freeDelivery ? 'FREE delivery' : 'Delivery',
      text: freeDelivery ? `Arrives by ${arrives}.` : `Arrives by ${arrives}. Free on orders over ${formatPrice(FREE_SHIPPING_FROM)}.`,
    },
  ].filter(Boolean) as { icon: typeof CardIcon; title: string; text: string }[]

  const noReturns = (product.returnPolicy ?? '').toLowerCase().startsWith('no')
  const services = [
    { icon: TruckIcon, label: freeDelivery ? 'Free delivery' : product.shippingInformation ?? 'Fast shipping' },
    { icon: ReturnIcon, label: noReturns ? 'Non-returnable' : product.returnPolicy?.replace(' return policy', ' returns') ?? '30 days returns' },
    { icon: AwardIcon, label: product.warrantyInformation ?? 'Brand warranty' },
    { icon: LockIcon, label: 'Secure transaction' },
  ]

  return (
    <div className="mt-8 space-y-6">
      <section aria-labelledby="offers-title">
        <h2 id="offers-title" className="font-bold">Offers</h2>
        <ul className="mt-3 grid gap-3 sm:grid-cols-2">
          {offers.map(({ icon: Icon, title, text }) => (
            <li key={title} className="rounded-2xl border border-line bg-white p-4">
              <p className="flex items-center gap-2 font-bold"><Icon className="size-5 text-accent" /> {title}</p>
              <p className="mt-1 text-sm text-muted">{text}</p>
            </li>
          ))}
        </ul>
      </section>
      <ul aria-label="Services" className="grid grid-cols-2 gap-4 border-y border-line py-5 sm:grid-cols-4">
        {services.map(({ icon: Icon, label }) => (
          <li key={label} className="flex flex-col items-center gap-2 text-center text-xs font-medium text-stone-700">
            <span className="grid size-11 place-items-center rounded-full bg-orange-50 text-accent"><Icon /></span>
            {label}
          </li>
        ))}
      </ul>
    </div>
  )
}

function ProductSkeleton() {
  return (
    <div className="grid animate-pulse gap-10 lg:grid-cols-2" aria-hidden="true">
      <div className="aspect-square rounded-3xl bg-stone-200" />
      <div className="space-y-4">
        <div className="h-4 w-1/4 rounded bg-stone-200" />
        <div className="h-9 w-3/4 rounded bg-stone-200" />
        <div className="h-8 w-1/3 rounded bg-stone-200" />
        <div className="h-24 rounded bg-stone-200" />
        <div className="h-12 w-2/3 rounded-full bg-stone-200" />
      </div>
    </div>
  )
}

export default function ProductPage() {
  const { id = '' } = useParams()
  const { data: product, error, loading, retry } = useAsync((signal) => fetchProduct(id, signal), [id])
  const { data: catalog } = useAsync(() => fetchCatalog(), [])
  const [quantity, setQuantity] = useState(1)

  const add = useCart((s) => s.add)
  const inCart = useCart((s) => s.items.find((i) => i.id === product?.id)?.quantity ?? 0)
  const saved = useWishlist((s) => (product ? s.ids.includes(product.id) : false))
  const toggleWishlist = useWishlist((s) => s.toggle)
  const toast = useToast((s) => s.show)
  const navigate = useNavigate()

  useEffect(() => setQuantity(1), [id])
  useEffect(() => {
    if (product) document.title = `${product.title} | ShopNest`
    return () => {
      document.title = 'ShopNest | React E-commerce Storefront'
    }
  }, [product])

  if (loading) return <ProductSkeleton />
  if (error === 'Not found' || (!product && !error)) {
    return <EmptyState title="Product not found" text="This product may have been removed." action={{ label: 'Back to shop', to: '/' }} />
  }
  if (error || !product) return <ErrorState message={error} onRetry={retry} />

  const available = Math.max(product.stock - inCart, 0)
  const related = (catalog ?? []).filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4)

  function addToCart() {
    if (!product) return
    add(
      { id: product.id, title: product.title, thumbnail: product.thumbnail, price: finalPrice(product.price, product.discountPercentage), stock: product.stock },
      quantity,
    )
    toast(`${quantity} × ${product.title} added to cart`, { label: 'View cart', to: '/cart' })
    setQuantity(1)
  }

  /** Checks out only this product, leaving the cart as it is (like Amazon's Buy Now) */
  function buyNow() {
    if (!product) return
    const item: CartItem = {
      id: product.id,
      title: product.title,
      thumbnail: product.thumbnail,
      price: finalPrice(product.price, product.discountPercentage),
      stock: product.stock,
      quantity: Math.min(quantity, product.stock),
    }
    navigate('/checkout', { state: { buyNow: item } })
  }

  return (
    <div>
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted">
        <ol className="flex flex-wrap items-center gap-2">
          <li><Link to="/" className="hover:text-ink">Shop</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link to={`/?category=${product.category}`} className="hover:text-ink">{titleCase(product.category)}</Link></li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="truncate font-medium text-ink">{product.title}</li>
        </ol>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
        <Gallery key={product.id} product={product} />

        <div>
          {product.brand && <p className="text-sm font-bold tracking-wide text-accent uppercase">{product.brand}</p>}
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">{product.title}</h1>
          <div className="mt-3">
            <Rating value={product.rating} count={product.reviews?.length} />
          </div>
          <div className="mt-6">
            <PriceBlock product={product} />
          </div>
          <p className={`mt-2 text-sm font-semibold ${product.stock > 10 ? 'text-emerald-700' : product.stock > 0 ? 'text-amber-700' : 'text-red-700'}`}>
            {product.stock > 10 ? 'In stock' : product.stock > 0 ? `Only ${product.stock} left` : 'Out of stock'}
          </p>
          <p className="mt-6 leading-relaxed text-muted">{product.description}</p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            {available > 0 && <QuantityInput value={Math.min(quantity, available)} max={available} onChange={setQuantity} label="Quantity to add" />}
            <button
              type="button"
              onClick={addToCart}
              disabled={available === 0}
              className="h-12 flex-1 rounded-full border-2 border-ink px-7 font-bold transition-colors hover:bg-ink hover:text-white disabled:cursor-not-allowed disabled:border-stone-300 disabled:text-stone-400 disabled:hover:bg-transparent sm:flex-none"
            >
              {product.stock === 0 ? 'Out of stock' : available === 0 ? 'All stock is in your cart' : 'Add to cart'}
            </button>
            {product.stock > 0 && (
              <button
                type="button"
                onClick={buyNow}
                className="h-12 flex-1 rounded-full bg-accent px-8 font-bold text-white transition-colors hover:bg-accent-dark sm:flex-none"
              >
                Buy now
              </button>
            )}
            <button
              type="button"
              onClick={() => toggleWishlist(product.id)}
              aria-pressed={saved}
              aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'}
              className={`grid size-12 place-items-center rounded-full border border-line bg-white ${saved ? 'text-accent' : 'hover:text-accent'}`}
            >
              <HeartIcon filled={saved} />
            </button>
          </div>
          {inCart > 0 && (
            <p className="mt-3 text-sm text-muted">
              {inCart} in your cart. <Link to="/cart" className="font-semibold text-ink underline underline-offset-4">View cart</Link>
            </p>
          )}

          <Highlights product={product} />
        </div>
      </div>

      {product.reviews && product.reviews.length > 0 && (
        <section aria-labelledby="reviews-title" className="mt-16">
          <h2 id="reviews-title" className="text-2xl font-extrabold">Customer reviews</h2>
          <ul className="mt-6 grid gap-4 md:grid-cols-3">
            {product.reviews.map((r) => (
              <li key={`${r.reviewerName}-${r.date}`} className="rounded-2xl border border-line bg-white p-5">
                <Rating value={r.rating} />
                <p className="mt-3">“{r.comment}”</p>
                <p className="mt-3 text-sm text-muted">
                  {r.reviewerName} · {new Date(r.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {related.length > 0 && (
        <section aria-labelledby="related-title" className="mt-16">
          <h2 id="related-title" className="text-2xl font-extrabold">You may also like</h2>
          <ul className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            {related.map((p) => (
              <li key={p.id} className="flex"><ProductCard product={p} /></li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
