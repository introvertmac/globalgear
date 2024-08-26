import Image from 'next/image'
import { Button } from '../common/Button'
import { ShoppingCart } from 'lucide-react'
import { Product } from '@/config/products'
import { useCart } from '@/context/CartContext'
import { useState } from 'react'

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  const { dispatch } = useCart()
  const [selectedSize, setSelectedSize] = useState(product.sizes ? product.sizes[0] : undefined)
  const [imageLoaded, setImageLoaded] = useState(false)

  const handleAddToCart = () => {
    dispatch({ 
      type: 'ADD_TO_CART', 
      payload: product.sizes ? { ...product, size: selectedSize } : product
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105 flex flex-col h-full">
      <div className="relative w-full pt-[100%]">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
        )}
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
          style={{ objectFit: 'cover' }}
          priority={priority}
          onLoad={() => setImageLoaded(true)}
          className={`transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
        />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h2 className="text-base sm:text-lg font-semibold mb-2 text-black">{product.name}</h2>
        <p className="text-xs sm:text-sm text-gray-600 mb-4 flex-grow">{product.description}</p>
        <div className="mt-auto">
          <p className="text-[#3e71f8] font-bold mb-2 text-sm sm:text-base">{product.price} PYUSD</p>
          {product.sizes && (
            <div className="mb-2">
              <label htmlFor={`size-${product.id}`} className="sr-only">Size</label>
              <select
                id={`size-${product.id}`}
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-[#3e71f8] focus:border-[#3e71f8] text-xs sm:text-sm"
              >
                {product.sizes.map((size) => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>
          )}
          <Button 
            onClick={handleAddToCart} 
            className="w-full active:scale-95 transition-transform duration-150 text-xs sm:text-sm"
          >
            <ShoppingCart size={16} className="mr-2" />
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  )
}