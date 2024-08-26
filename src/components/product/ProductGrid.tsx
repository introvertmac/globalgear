import { Product } from '@/config/products'
import ProductCard from './ProductCard'

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      {products.slice(0, 6).map((product, index) => (
        <ProductCard 
          key={product.id} 
          product={product} 
          priority={index === 0}
        />
      ))}
    </div>
  )
}