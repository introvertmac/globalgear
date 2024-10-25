import React from 'react'
import Link from 'next/link'
import Layout from '@/components/layout/Layout'
import { Button } from '@/components/common/Button'

export default function Custom404() {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
        <h1 className="text-6xl font-bold text-black mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Oops! Page not found</h2>
        <p className="text-gray-500 mb-8">The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
        <Link href="/" passHref>
          <Button>
            Go to Homepage
          </Button>
        </Link>
      </div>
    </Layout>
    
  )
}
