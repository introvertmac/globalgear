import React, { useState, useRef, useEffect } from 'react'
import { Button } from '../common/Button'
import { useWallet } from '@/context/WalletContext'
import { Copy, RefreshCw, ChevronDown, ClipboardList } from 'lucide-react'
import { useRouter } from 'next/router'

export default function WalletConnection() {
  const { isConnected, address, balance, connect, disconnect, refreshBalance, isLoading, isCreatingWallet } = useWallet()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleCopyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
        .then(() => {
          setIsCopied(true)
          setTimeout(() => setIsCopied(false), 2000)
        })
        .catch(err => console.error('Failed to copy address:', err))
    }
  }

  const handleRefreshBalance = async () => {
    await refreshBalance()
  }

  const handleConnect = async () => {
    try {
      await connect()
    } catch (error) {
      console.error('Failed to connect wallet:', error)
    }
  }

  const handleViewOrderHistory = () => {
    setIsDropdownOpen(false)
    router.push('/order-history')
  }

  if (isLoading) {
    return (
      <div className="bg-white border border-[#3e71f8] rounded-full py-2 px-4 text-sm flex items-center">
        <RefreshCw size={16} className="animate-spin mr-2 text-[#3e71f8]" />
        <span className="text-[#535a6c]">
          {isCreatingWallet ? 'Creating wallet...' : 'Connecting to Portal wallet...'}
        </span>
      </div>
    )
  }

  if (isConnected && address) {
    return (
      <div className="relative" ref={dropdownRef}>
        <div
          className="bg-white border border-[#3e71f8] rounded-full py-2 px-4 text-sm flex items-center cursor-pointer"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <span className="font-medium mr-2 text-black">{address.slice(0, 4)}...{address.slice(-4)}</span>
          <span className="text-black font-bold mr-2">{balance} PYUSD</span>
          <ChevronDown size={16} className="text-black" />
        </div>
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
            <div className="py-1">
              <button
                onClick={handleCopyAddress}
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
              >
                <Copy size={16} className="mr-2" />
                {isCopied ? 'Copied!' : 'Copy Address'}
              </button>
              <button
                onClick={handleRefreshBalance}
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
              >
                <RefreshCw size={16} className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh Balance
              </button>
              <button
                onClick={handleViewOrderHistory}
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
              >
                <ClipboardList size={16} className="mr-2" />
                Order History
              </button>
              <button
                onClick={disconnect}
                className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
              >
                Disconnect
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <Button onClick={handleConnect} disabled={isLoading}>
      Connect Wallet
    </Button>
  )
}
