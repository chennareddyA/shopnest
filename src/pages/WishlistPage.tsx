import { fetchCatalog } from '../lib/api'
import { useAsync } from '../hooks/useAsync'
import { useWishlist } from '../store/wishlist'
import ProductCard, { ProductCardSkeleton } from '../components/ProductCard'
import { EmptyState, ErrorState } from '../components/States'
import { HeartIcon } from '../components/Icons'

export default function WishlistPage() {
  const ids = useWishlist((s) => s.ids)
  const { data, error, retry } = useAsync(() => fetchCatalog(), [])

  if (ids.length === 0) {
    return <EmptyState icon={<HeartIcon />} title="Your wishlist is empty" text="Tap the heart on any product to save it for later." action={{ label: 'Browse products', to: '/' }} />
  }
  if (error) return <ErrorState message={error} onRetry={retry} />

  const products = data ? ids.map((id) => data.find((p) => p.id === id)).filter((p) => p !== undefined) : []

  return (
    <div>
      <h1 className="text-3xl font-extrabold tracking-tight">Wishlist</h1>
      <p className="mt-1 text-muted">{ids.length} saved {ids.length === 1 ? 'item' : 'items'}</p>
      <ul className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
        {data
          ? products.map((p) => <li key={p.id} className="flex"><ProductCard product={p} /></li>)
          : ids.map((id) => <li key={id}><ProductCardSkeleton /></li>)}
      </ul>
    </div>
  )
}
