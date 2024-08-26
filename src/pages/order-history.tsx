import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '@/components/layout/Layout'
import { useWallet } from '@/context/WalletContext'
import { Loader } from '@/components/common/Loader'

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  size?: string;
}

interface Order {
  orderId: string;
  date: string;
  total: number;
  items: OrderItem[];
}

export default function OrderHistory() {
  const { address, isConnected } = useWallet()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (!isConnected) {
      router.push('/')
    }
  }, [isConnected, router])

  useEffect(() => {
    const fetchOrders = async () => {
      if (address) {
        try {
          const response = await fetch(`/api/getOrders?walletAddress=${address}`)
          if (response.ok) {
            const data = await response.json()
            setOrders(data.orders)
          } else {
            console.error('Failed to fetch orders')
          }
        } catch (error) {
          console.error('Error fetching orders:', error)
        } finally {
          setIsLoading(false)
        }
      }
    }

    if (isConnected) {
      fetchOrders()
    }
  }, [address, isConnected])

  if (!isConnected) {
    return null // or a loading state if you prefer
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <Loader />
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Order History</h1>
        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => (
              <div key={order.orderId} className="bg-white shadow rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Order #{order.orderId}</h2>
                  <p className="text-sm text-gray-500">{order.date}</p>
                </div>
                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div key={`${item.id}-${item.size}`} className="flex justify-between items-center">
                      <span>{item.name} {item.size ? `(${item.size})` : ''} x {item.quantity}</span>
                      <span>{item.price * item.quantity} PYUSD</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t flex justify-between items-center">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold">{order.total} PYUSD</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}