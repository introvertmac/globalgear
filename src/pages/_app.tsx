import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { CartProvider } from '@/context/CartContext'
import { WalletProvider } from '@/context/WalletContext'
import { PortalProvider } from '@/context/PortalContext'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <PortalProvider>
      <WalletProvider>
        <CartProvider>
          <Component {...pageProps} />
        </CartProvider>
      </WalletProvider>
    </PortalProvider>
  )
  
}

export default MyApp