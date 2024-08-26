import { useState, useEffect, ChangeEvent, FormEvent } from 'react'
import { useRouter } from 'next/router'
import Layout from '@/components/layout/Layout'
import { useCart } from '@/context/CartContext'
import { usePortal } from '@/context/PortalContext'
import { Button } from '@/components/common/Button'
import { Loader } from '@/components/common/Loader'

interface ShippingAddress {
  fullName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

const RECIPIENT_ADDRESS = 'CRKViCKjQ6hpPmf7tJq29kjw3BTGCRjL5xsytzFzSgGL';
const PYUSD_TOKEN_ADDRESS = 'CXk2AMBfi3TwaEL2468s6zP8xq9NxTXjp9gjMgzeUynM';

export default function Checkout() {
  const { state: cartState, dispatch } = useCart()
  const { sendTokensOnSolana, isLoading: isPortalLoading } = usePortal()
  const [isProcessing, setIsProcessing] = useState(false)
  const router = useRouter()
  const [address, setAddress] = useState<ShippingAddress>({
    fullName: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  })
  const [email, setEmail] = useState('')

  useEffect(() => {
    if (cartState.items.length === 0) {
      router.push('/')
    }
  }, [cartState.items, router])

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name === 'email') {
      setEmail(value)
    } else {
      setAddress(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleCheckout = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (cartState.items.length === 0) {
      alert('Your cart is empty')
      return
    }

    setIsProcessing(true)
    try {
      const txnHash = await sendTokensOnSolana(
        RECIPIENT_ADDRESS,
        PYUSD_TOKEN_ADDRESS,
        cartState.total
      )

      localStorage.setItem('txnHash', txnHash)
      localStorage.setItem('orderDetails', JSON.stringify({
        items: cartState.items,
        total: cartState.total,
        shippingAddress: address,
        email
      }))

      // Clear the cart after successful order
      dispatch({ type: 'CLEAR_CART' })

      router.push('/order-confirmation')
    } catch (error) {
      console.error('Checkout failed:', error)
      alert('Checkout failed. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  if (isPortalLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <Loader />
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Checkout</h1>
        <form onSubmit={handleCheckout}>
          <div className="space-y-4 mb-6">
            <input
              type="text"
              name="fullName"
              value={address.fullName}
              onChange={handleInputChange}
              placeholder="Full Name"
              required
              className="w-full p-2 border rounded"
            />
            <input
              type="email"
              name="email"
              value={email}
              onChange={handleInputChange}
              placeholder="Email"
              required
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              name="street"
              value={address.street}
              onChange={handleInputChange}
              placeholder="Street Address"
              required
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              name="city"
              value={address.city}
              onChange={handleInputChange}
              placeholder="City"
              required
              className="w-full p-2 border rounded"
            />
            <div className="flex space-x-4">
              <input
                type="text"
                name="state"
                value={address.state}
                onChange={handleInputChange}
                placeholder="State"
                required
                className="w-1/2 p-2 border rounded"
              />
              <input
                type="text"
                name="zipCode"
                value={address.zipCode}
                onChange={handleInputChange}
                placeholder="ZIP Code"
                required
                className="w-1/2 p-2 border rounded"
              />
            </div>
            <input
              type="text"
              name="country"
              value={address.country}
              onChange={handleInputChange}
              placeholder="Country"
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            {cartState.items.map((item) => (
              <div key={`${item.id}-${item.size}`} className="flex justify-between items-center mb-2">
                <span>{item.name} {item.size ? `(${item.size})` : ''} x {item.quantity}</span>
                <span>{(item.price * item.quantity).toFixed(2)} PYUSD</span>
              </div>
            ))}
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between items-center font-bold">
                <span>Total</span>
                <span>{cartState.total.toFixed(2)} PYUSD</span>
              </div>
            </div>
          </div>
          <Button
            type="submit"
            disabled={isProcessing || cartState.items.length === 0}
            className="w-full"
          >
            {isProcessing ? 'Processing...' : 'Place Order'}
          </Button>
        </form>
      </div>
    </Layout>
  )
}