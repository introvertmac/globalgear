import { useRouter } from 'next/router'
import Header from './Header'
import Footer from './Footer'
import { useCart } from '@/context/CartContext'
import CartDrawer from '../cart/CartDrawer'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const { state, dispatch } = useCart()
  const router = useRouter()

  const closeCart = () => {
    dispatch({ type: 'CLOSE_CART' })
  }

  const isCheckoutPage = router.pathname === '/checkout'

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
      <Footer />
      {!isCheckoutPage && <CartDrawer isOpen={state.isCartOpen} onClose={closeCart} />}
    </div>
  )
}