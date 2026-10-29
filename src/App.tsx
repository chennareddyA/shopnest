import { lazy } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import ShopPage from './pages/ShopPage'

// Less-visited pages load on demand
const ProductPage = lazy(() => import('./pages/ProductPage'))
const CartPage = lazy(() => import('./pages/CartPage'))
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'))
const OrderPage = lazy(() => import('./pages/OrderPage'))
const WishlistPage = lazy(() => import('./pages/WishlistPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route element={<Layout />}>
            <Route index element={<ShopPage />} />
            <Route path="product/:id" element={<ProductPage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="order/:orderId" element={<OrderPage />} />
            <Route path="wishlist" element={<WishlistPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
      </Routes>
    </BrowserRouter>
  )
}
