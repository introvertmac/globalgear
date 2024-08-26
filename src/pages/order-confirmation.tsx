import { useState, useEffect } from 'react'
import Layout from '@/components/layout/Layout'
import { Button } from '@/components/common/Button'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { useWallet } from '@/context/WalletContext'
import { Loader } from '@/components/common/Loader'
import { useRouter } from 'next/router'

interface OrderDetails {
  items: Array<{
    id: number;
    name: string;
    price: number;
    quantity: number;
    size?: string;
  }>;
  total: number;
  shippingAddress: {
    fullName: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  email: string;
}

const shortenHash = (hash: string) => {
  return `${hash.slice(0, 6)}...${hash.slice(-6)}`;
};

const getExplorerLink = (hash: string) => {
  return `https://explorer.solana.com/tx/${hash}?cluster=devnet`;
};

export default function OrderConfirmation() {
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null)
  const [txnHash, setTxnHash] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const { dispatch } = useCart()
  const { isConnected, connect, refreshBalance, address } = useWallet()
  const router = useRouter()

  useEffect(() => {
    if (!isConnected) {
      router.push('/')
    }
  }, [isConnected, router])

  useEffect(() => {
    const initializeOrderConfirmation = async () => {
      if (isInitialized || !isConnected) return;

      const orderDetailsString = localStorage.getItem('orderDetails')
      const storedTxnHash = localStorage.getItem('txnHash')

      if (orderDetailsString) {
        setOrderDetails(JSON.parse(orderDetailsString))
      }

      if (storedTxnHash) {
        setTxnHash(storedTxnHash)
      }

      dispatch({ type: 'CLEAR_CART' })

      // Ensure wallet is connected
      if (!isConnected) {
        await connect()
      }

      // Refresh balance only if there's a transaction hash (indicating a recent transaction)
      if (storedTxnHash) {
        // Add a delay before refreshing balance
        setTimeout(() => {
          refreshBalance()
        }, 12000) // 9 second delay
      }

      localStorage.removeItem('orderDetails')
      localStorage.removeItem('txnHash')

      setIsInitialized(true)
    }

    if (isConnected) {
      initializeOrderConfirmation()
    }
  }, [dispatch, refreshBalance, isConnected, connect, isInitialized])

  useEffect(() => {
    const submitOrderToAirtable = async () => {
      if (orderDetails && txnHash && !isSubmitting) {
        setIsSubmitting(true);
        setSubmitError(null);

        try {
          const response = await fetch('/api/submitOrder', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ orderDetails, txnHash, walletAddress: address }),
          });

          if (!response.ok) {
            throw new Error('Failed to submit order to Airtable');
          }

          // Order submitted successfully
        } catch (error) {
          console.error('Error submitting order:', error);
          setSubmitError('Failed to save order details. Please contact support.');
        } finally {
          setIsSubmitting(false);
        }
      }
    };

    submitOrderToAirtable();
  }, [orderDetails, txnHash, address, isSubmitting]);

  if (isSubmitting) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6">Submitting Order</h1>
          <Loader />
        </div>
      </Layout>
    )
  }

  if (!isConnected) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6">Connecting Wallet</h1>
          <p className="text-lg sm:text-xl mb-8">Please wait while we connect to your wallet...</p>
          <Loader />
        </div>
      </Layout>
    )
  }

  if (!orderDetails || !txnHash) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6">Order Not Found</h1>
          <p className="text-lg sm:text-xl mb-8">We couldn&apos;t find your order details. Please try placing your order again.</p>
          <Link href="/" passHref>
            <Button>Return to Home</Button>
          </Link>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6">Thank You for Your Order!</h1>
        <p className="text-lg sm:text-xl mb-8">Your payment was successful and your order is being processed.</p>
        
        {submitError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{submitError}</span>
          </div>
        )}

        <div className="mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4">Transaction Details</h2>
          <p className="break-all text-sm sm:text-base">
            Transaction Hash: {' '}
            <a 
              href={getExplorerLink(txnHash)} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              {shortenHash(txnHash)}
            </a>
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4">Order Summary</h2>
          {orderDetails.items.map((item) => (
            <div key={`${item.id}-${item.size}`} className="flex justify-between items-center mb-2 text-sm sm:text-base">
              <span>{item.name} {item.size ? `(${item.size})` : ''} x {item.quantity}</span>
              <span>{(item.price * item.quantity).toFixed(2)} PYUSD</span>
            </div>
          ))}
          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between items-center font-bold text-base sm:text-lg">
              <span>Total</span>
              <span>{orderDetails.total.toFixed(2)} PYUSD</span>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-lg sm:text-xl font-semibold mb-2">Shipping Address</h3>
          <p className="text-sm sm:text-base">{orderDetails.shippingAddress.fullName}</p>
          <p className="text-sm sm:text-base">{orderDetails.shippingAddress.street}</p>
          <p className="text-sm sm:text-base">{orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.state} {orderDetails.shippingAddress.zipCode}</p>
          <p className="text-sm sm:text-base">{orderDetails.shippingAddress.country}</p>
        </div>

        <div className="flex justify-center mt-8">
          <Link href="/" passHref>
            <Button className="w-full sm:w-auto px-8">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    </Layout>
  )
}