import Layout from '@/components/layout/Layout'
import ProductGrid from '@/components/product/ProductGrid'
import { products } from '@/config/products'

export default function Home() {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Welcome to GlobalGear</h1>
        <ProductGrid products={products} />
      </div>
    </Layout>
  )
}