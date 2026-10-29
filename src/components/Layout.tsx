import { Suspense, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import Toaster from './Toaster'

// Scroll to the top when moving to another page or another page of results
function ScrollToTop() {
  const { pathname, search } = useLocation()
  const page = new URLSearchParams(search).get('page')
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [pathname, page])
  return null
}

function PageLoader() {
  return (
    <div className="grid min-h-[40vh] place-items-center" role="status">
      <span className="size-8 animate-spin rounded-full border-4 border-stone-200 border-t-accent" />
      <span className="sr-only">Loading</span>
    </div>
  )
}

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-white">
        Skip to content
      </a>
      <Header />
      <main id="main" className="mx-auto w-full max-w-7xl flex-1 px-4 pt-8 sm:px-6">
        {/* Header and footer stay visible while a lazy page loads */}
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <Toaster />
    </div>
  )
}
