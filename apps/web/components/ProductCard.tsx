'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { StarIcon, FireIcon, ShoppingCartIcon, HeartIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'
import { apiUrl } from '../lib/api'
import { normalizeImageUrl } from '../lib/images'

interface ProductCardProps {
  product: any
  index: number
}

export default function ProductCard({ product, index }: ProductCardProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [adding, setAdding] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [message, setMessage] = useState('')

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!session) {
      router.push('/login')
      return
    }

    setAdding(true)
    setMessage('')
    
    try {
const res = await fetch(apiUrl('/api/cart'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          productId: product.id, 
          quantity: 1 
        })
      })
      
      if (res.ok) {
        setMessage('âœ“ Added!')
        // notify header to refresh cart count
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('cart:updated'))
        }
        setTimeout(() => setMessage(''), 2000)
      } else {
        setMessage('Failed')
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
      setMessage('Failed')
    } finally {
      setAdding(false)
    }
  }

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!session) {
      router.push('/login')
      return
    }
    
    try {
      if (isWishlisted) {
const res = await fetch(apiUrl(`/api/wishlist?productId=${product.id}`), {
          method: 'DELETE'
        })
        if (res.ok) {
          setIsWishlisted(false)
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('wishlist:updated'))
          }
        }
      } else {
const res = await fetch(apiUrl('/api/wishlist'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: product.id })
        })
        if (res.ok) {
          setIsWishlisted(true)
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('wishlist:updated'))
          }
        }
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error)
    }
  }

  const discount = product.compareAt && Number(product.compareAt) > Number(product.price)
    ? Math.round(((Number(product.compareAt) - Number(product.price)) / Number(product.compareAt)) * 100)
    : 0

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow group relative">
      <Link href={`/shop/${product.slug}`}>
        <div className="relative">
          <img
            src={normalizeImageUrl(product.images[0]?.url) || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop'}
            alt={product.images[0]?.alt || product.name}
            className="h-40 md:h-48 w-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Wishlist button */}
          <button
            onClick={handleWishlistToggle}
            className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md hover:scale-110 transition-transform z-10"
          >
            {isWishlisted ? (
              <HeartIconSolid className="w-4 h-4 text-red-500" />
            ) : (
              <HeartIcon className="w-4 h-4 text-gray-600" />
            )}
          </button>
          
          {/* Discount badge */}
          {discount > 0 && (
            <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              -{discount}%
            </div>
          )}
          
          {/* Flash sale badge for some products */}
          {index < 2 && (
            <div className="absolute top-10 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
              <FireIcon className="w-3 h-3" />
              Flash
            </div>
          )}
          
          {/* Low stock indicator */}
          {product.inventory && product.inventory.quantity <= product.inventory.threshold && (
            <div className="absolute bottom-2 left-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              Only {product.inventory.quantity} left
            </div>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="text-sm font-bold text-gray-800 mb-2 line-clamp-2 h-10">
            {product.name}
          </h3>
          
          {/* Price */}
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-lg font-bold text-orange-500">
              ₦{Number(product.price).toLocaleString()}
            </span>
            {product.compareAt && Number(product.compareAt) > Number(product.price) && (
              <span className="text-xs text-gray-500 line-through">
                ₦{Number(product.compareAt).toLocaleString()}
              </span>
            )}
          </div>
          
          {/* Rating and sold */}
          <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
            <div className="flex items-center">
              <StarIcon className="w-3 h-3 text-yellow-500 fill-current" />
              <StarIcon className="w-3 h-3 text-yellow-500 fill-current" />
              <StarIcon className="w-3 h-3 text-yellow-500 fill-current" />
              <StarIcon className="w-3 h-3 text-yellow-500 fill-current" />
              <StarIcon className="w-3 h-3 text-gray-300 fill-current" />
              <span className="ml-1">(4.2)</span>
            </div>
          </div>
          
          {/* Category and Add to Cart */}
          <div className="flex items-center justify-between gap-2">
            <span className="bg-orange-100 text-orange-600 text-xs px-2 py-1 rounded-full line-clamp-1 flex-1">
              {product.category.name}
            </span>
          </div>
        </div>
      </Link>
      
      {/* Add to Cart button - outside Link to prevent navigation */}
      <div className="px-4 pb-4">
        {message && (
          <div className={`text-xs text-center mb-2 font-medium ${
            message.includes('✓') ? 'text-green-600' : 'text-red-600'
          }`}>
            {message}
          </div>
        )}
        <button
          onClick={handleAddToCart}
          disabled={adding}
          className="w-full bg-orange-500 text-white text-xs px-3 py-2 rounded-md hover:bg-orange-600 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {adding ? (
            <>
              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Adding...
            </>
          ) : (
            <>
              <ShoppingCartIcon className="w-4 h-4" />
              Add to Cart
            </>
          )}
        </button>
      </div>
    </div>
  )
}
