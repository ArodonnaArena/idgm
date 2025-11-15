'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { 
  HeartIcon, 
  ShareIcon, 
  ShoppingCartIcon, 
  StarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckIcon,
  TruckIcon,
  ShieldCheckIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid, StarIcon as StarIconSolid } from '@heroicons/react/24/solid'
import { apiUrl } from '../../../../lib/api'
import { Price } from '../../../../components/Currency'
import { normalizeImageUrl } from '../../../../lib/images'

interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  compareAt?: number
  currency: string
  images: { url: string; alt?: string }[]
  category: { name: string; slug?: string }
  inventory: { quantity: number; threshold: number } | null
  attributes?: any
  sku: string
}

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [addingToCart, setAddingToCart] = useState(false)
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [cartMessage, setCartMessage] = useState('')
  const [wishlistMessage, setWishlistMessage] = useState('')

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(apiUrl(`/api/products/${String(params.slug)}`), { cache: 'no-store' })
        if (res.ok) {
          const data: any = await res.json()
          setProduct(data)
        }
      } catch (error) {
        console.error('Error fetching product:', error)
      } finally {
        setLoading(false)
      }
    }

    if (params.slug) {
      fetchProduct()
    }
  }, [params.slug])

  const handleAddToCart = async () => {
    if (!session) {
      router.push('/login')
      return
    }

    setAddingToCart(true)
    setCartMessage('')
    
    try {
      const res = await fetch(apiUrl('/api/cart'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          productId: product?.id, 
          quantity 
        })
      })
      
      if (res.ok) {
        setCartMessage('✓ Added to cart successfully!')
        setTimeout(() => setCartMessage(''), 3000)
      } else {
        setCartMessage('Failed to add to cart')
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
      setCartMessage('Failed to add to cart')
    } finally {
      setAddingToCart(false)
    }
  }

  const handleWishlistToggle = async () => {
    if (!session) {
      router.push('/login')
      return
    }

    setWishlistMessage('')
    
    try {
      if (isWishlisted) {
        // Remove from wishlist
        const res = await fetch(apiUrl(`/api/wishlist?productId=${product?.id}`), {
          method: 'DELETE'
        })
        
        if (res.ok) {
          setIsWishlisted(false)
          setWishlistMessage('Removed from wishlist')
          setTimeout(() => setWishlistMessage(''), 3000)
        }
      } else {
        // Add to wishlist
        const res = await fetch(apiUrl('/api/wishlist'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: product?.id })
        })
        
        if (res.ok) {
          setIsWishlisted(true)
          setWishlistMessage('✓ Added to wishlist!')
          setTimeout(() => setWishlistMessage(''), 3000)
        }
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error)
      setWishlistMessage('Failed to update wishlist')
    }
  }

  const nextImage = () => {
    if (product?.images) {
      setSelectedImage((prev) => (prev + 1) % product.images.length)
    }
  }

  const prevImage = () => {
    if (product?.images) {
      setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="relative">
          <div className="w-32 h-32 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <ShoppingCartIcon className="w-8 h-8 text-green-600" />
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4 mx-auto">
            <span className="text-2xl">😔</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
          <Link href="/shop/products" className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
            Back to Shop
          </Link>
        </div>
      </div>
    )
  }

  const discount = product.compareAt ? Math.round(((Number(product.compareAt) - Number(product.price)) / Number(product.compareAt)) * 100) : 0
  const inStock = product.inventory ? product.inventory.quantity > 0 : true
  const lowStock = product.inventory ? product.inventory.quantity <= product.inventory.threshold : false

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Breadcrumb */}
      <div className="bg-white/70 backdrop-blur-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-green-600 transition-colors">Home</Link>
            <span className="text-gray-400">/</span>
            <Link href="/shop/products" className="text-gray-500 hover:text-green-600 transition-colors">Shop</Link>
            <span className="text-gray-400">/</span>
            <Link href={`/shop/products?category=${product.category.slug}`} className="text-gray-500 hover:text-green-600 transition-colors">
              {product.category.name}
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button 
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-green-600 transition-colors mb-8 group"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Products
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-white rounded-2xl shadow-2xl overflow-hidden group">
              {product.images && product.images.length > 0 ? (
                <>
                  <img
                    src={normalizeImageUrl(product.images[selectedImage]?.url) || '/placeholder.jpg'}
                    alt={product.images[selectedImage]?.alt || product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {discount > 0 && (
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
                      -{discount}% OFF
                    </div>
                  )}
                  {product.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all hover:scale-110"
                      >
                        <ChevronLeftIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all hover:scale-110"
                      >
                        <ChevronRightIcon className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-300 rounded-full mb-4 mx-auto flex items-center justify-center">
                      <ShoppingCartIcon className="w-8 h-8 text-gray-500" />
                    </div>
                    <p className="text-gray-500">No image available</p>
                  </div>
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {product.images && product.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index ? 'border-green-500 ring-2 ring-green-200' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={normalizeImageUrl(image.url)}
                      alt={image.alt || product.name}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {product.category.name}
                </span>
                {lowStock && (
                  <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded-full animate-pulse">
                    Low Stock
                  </span>
                )}
              </div>
              <h1 className="text-4xl font-bold text-gray-900 leading-tight">{product.name}</h1>
              <p className="text-gray-600 mt-2">SKU: {product.sku}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <StarIconSolid key={star} className="w-5 h-5 text-yellow-400" />
              ))}
              <span className="text-gray-600 ml-2">(4.8 · 127 reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-4">
              <span className="text-4xl font-bold text-green-600">
                <Price amount={product.price} />
              </span>
              {product.compareAt && Number(product.compareAt) > Number(product.price) && (
                <span className="text-2xl text-gray-500 line-through">
                  <Price amount={product.compareAt as number} />
                </span>
              )}
            </div>

            {/* Description */}
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border">
              <h3 className="font-semibold text-gray-900 mb-3">Product Description</h3>
              <p className={`text-gray-700 leading-relaxed ${!showFullDescription ? 'line-clamp-3' : ''}`}>
                {product.description || 'No description available for this product.'}
              </p>
              {product.description && product.description.length > 150 && (
                <button
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="text-green-600 hover:text-green-700 font-medium mt-2 text-sm"
                >
                  {showFullDescription ? 'Show less' : 'Read more'}
                </button>
              )}
            </div>

            {/* Quantity & Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <label className="font-medium text-gray-900">Quantity:</label>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                    className="px-3 py-2 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="px-4 py-2 bg-gray-50 min-w-[60px] text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!inStock || (product.inventory && quantity >= product.inventory.quantity)}
                  >
                    +
                  </button>
                </div>
                {product.inventory && (
                  <span className="text-sm text-gray-600">
                    {product.inventory.quantity} available
                  </span>
                )}
              </div>

              {(cartMessage || wishlistMessage) && (
                <div className={`p-3 rounded-lg text-sm font-medium ${
                  cartMessage.includes('✓') || wishlistMessage.includes('✓') 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {cartMessage || wishlistMessage}
                </div>
              )}

              <div className="flex space-x-4">
                <button
                  onClick={handleAddToCart}
                  disabled={!inStock || addingToCart}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
                >
                  {addingToCart ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Adding...</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCartIcon className="w-5 h-5" />
                      <span>{inStock ? 'Add to Cart' : 'Out of Stock'}</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleWishlistToggle}
                  className="bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 px-4 py-4 rounded-xl transition-all transform hover:scale-105 hover:shadow-lg"
                  title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  {isWishlisted ? (
                    <HeartIconSolid className="w-6 h-6 text-red-500" />
                  ) : (
                    <HeartIcon className="w-6 h-6" />
                  )}
                </button>

                <button className="bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 px-4 py-4 rounded-xl transition-all transform hover:scale-105 hover:shadow-lg">
                  <ShareIcon className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Features */}
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <TruckIcon className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Free Delivery</p>
                    <p className="text-sm text-gray-600">Orders over <Price amount={50000} /></p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <ShieldCheckIcon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Quality Guarantee</p>
                    <p className="text-sm text-gray-600">30-day return</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-purple-100 p-2 rounded-full">
                    <CheckIcon className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Authentic</p>
                    <p className="text-sm text-gray-600">Verified products</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
