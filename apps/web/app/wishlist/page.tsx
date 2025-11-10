'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { HeartIcon, XMarkIcon, ShoppingCartIcon } from '@heroicons/react/24/outline'
import { useCart } from '../../components/CartProvider'

interface WishlistItem {
  id: string
  product: {
    id: number
    name: string
    slug: string
    price: number
    images?: { url: string; alt?: string }[]
  }
}

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart()

  const load = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/wishlist', { cache: 'no-store' })
      if (res.ok) {
        const data = await res.json()
        setItems(Array.isArray(data) ? data : [])
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const remove = async (productId: number) => {
    const res = await fetch(`/api/wishlist?productId=${productId}`, { method: 'DELETE' })
    if (res.ok) {
      window.dispatchEvent(new CustomEvent('wishlist:updated'))
      load()
    }
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
          <p className="mt-4 text-gray-600">Loading your wishlist...</p>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <HeartIcon className="w-16 h-16 mx-auto text-gray-300" />
        <h2 className="text-2xl font-bold mt-4">Your wishlist is empty</h2>
        <p className="text-gray-600 mt-2">Browse products and add your favorites here</p>
        <Link href="/shop" className="inline-block mt-6 bg-orange-500 text-white px-6 py-3 rounded-md hover:bg-orange-600">
          Explore Products
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-black mb-6">My Wishlist</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((w) => (
          <div key={w.id} className="bg-white border rounded-lg p-4 flex gap-4 items-center">
            <Link href={`/shop/${w.product.slug}`}>
              <img
                src={w.product.images?.[0]?.url || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop'}
                alt={w.product.images?.[0]?.alt || w.product.name}
                className="w-20 h-20 object-cover rounded"
              />
            </Link>
            <div className="flex-1 min-w-0">
              <Link href={`/shop/${w.product.slug}`} className="font-semibold hover:text-orange-600 line-clamp-1">
                {w.product.name}
              </Link>
              <div className="text-orange-600 font-bold">₦{Number(w.product.price).toLocaleString()}</div>
              <div className="mt-2 flex gap-2">
                <button
                  onClick={async () => { await addToCart(w.product.id, 1) }}
                  className="inline-flex items-center gap-1 bg-orange-500 text-white text-xs px-3 py-1 rounded hover:bg-orange-600"
                >
                  <ShoppingCartIcon className="w-4 h-4" /> Add to cart
                </button>
                <button
                  onClick={() => remove(w.product.id)}
                  className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded border hover:bg-gray-50"
                >
                  <XMarkIcon className="w-4 h-4" /> Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
