import { useEffect, useState, type FormEvent } from 'react'
import { Link, NavLink, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useCart } from '../store/cart'
import { useWishlist } from '../store/wishlist'
import { cartCount } from '../lib/pricing'
import { BagIcon, HeartIcon, SearchIcon } from './Icons'

function Badge({ count }: { count: number }) {
  if (count === 0) return null
  return (
    <span className="absolute -top-1 -right-1 grid min-w-5 place-items-center rounded-full bg-accent px-1 text-[11px] leading-5 font-bold text-white">
      {count > 99 ? '99+' : count}
    </span>
  )
}

export default function Header() {
  const count = useCart((s) => cartCount(s.items))
  const saved = useWishlist((s) => s.ids.length)
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [params] = useSearchParams()
  const [term, setTerm] = useState(params.get('q') ?? '')

  // Keep the box in sync when the search changes elsewhere (e.g. "Clear filters")
  useEffect(() => {
    if (pathname === '/') setTerm(params.get('q') ?? '')
  }, [params, pathname])

  function onSearch(e: FormEvent) {
    e.preventDefault()
    const next = new URLSearchParams(pathname === '/' ? params : undefined)
    if (term.trim()) next.set('q', term.trim())
    else next.delete('q')
    next.delete('page')
    navigate({ pathname: '/', search: next.toString() })
  }

  const iconLink = 'relative grid size-11 place-items-center rounded-full text-ink transition-colors hover:bg-stone-100'

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Link to="/" className="flex shrink-0 items-center gap-2" aria-label="ShopNest home">
          <img src="/favicon.svg" alt="" className="size-9" />
          <span className="hidden text-xl font-extrabold tracking-tight sm:inline">ShopNest</span>
        </Link>

        <form onSubmit={onSearch} role="search" className="relative mx-auto w-full max-w-xl">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted" />
          <input
            type="search"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Search products, brands…"
            aria-label="Search products"
            className="h-11 w-full rounded-full border border-line bg-stone-50 pr-4 pl-11 text-sm outline-none focus:border-ink focus:bg-white"
          />
        </form>

        <nav aria-label="Account" className="flex shrink-0 items-center gap-1">
          <NavLink to="/wishlist" className={iconLink} aria-label={`Wishlist, ${saved} ${saved === 1 ? "item" : "items"}`}>
            <HeartIcon className="size-6" />
            <Badge count={saved} />
          </NavLink>
          <NavLink to="/cart" className={iconLink} aria-label={`Cart, ${count} ${count === 1 ? "item" : "items"}`}>
            <BagIcon className="size-6" />
            <Badge count={count} />
          </NavLink>
        </nav>
      </div>
    </header>
  )
}
