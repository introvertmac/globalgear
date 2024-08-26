import Link from 'next/link'
import { useRouter } from 'next/router'
import WalletConnection from '../wallet/WalletConnection'
import { useCart } from '@/context/CartContext'
import { ShoppingCart, Menu } from 'lucide-react'
import { useState } from 'react'

export default function Header() {
  const { state, dispatch } = useCart()
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleCartClick = () => {
    dispatch({ type: 'OPEN_CART' })
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const isCheckoutPage = router.pathname === '/checkout'

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex flex-wrap justify-between items-center">
        <Link href="/" className="text-xl sm:text-2xl font-bold text-[#3e71f8]">
          GlobalGear
        </Link>
        
        <button
          className="sm:hidden"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <Menu size={24} className="text-[#3e71f8]" />
        </button>

        <div className={`${isMenuOpen ? 'block' : 'hidden'} sm:flex items-center w-full sm:w-auto mt-4 sm:mt-0`}>
          {!isCheckoutPage && (
            <button
              onClick={handleCartClick}
              className="mr-4 relative"
              aria-label="Shopping cart"
            >
              <ShoppingCart size={24} className="text-[#3e71f8]" />
              {state.items.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {state.items.length}
                </span>
              )}
            </button>
          )}
          <WalletConnection />
        </div>
      </div>
    </header>
  )
}