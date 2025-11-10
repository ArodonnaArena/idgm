'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { 
  ArrowRightIcon, 
  ShoppingBagIcon, 
  HomeIcon, 
  BuildingOfficeIcon,
  SparklesIcon,
  StarIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  TruckIcon,
  ShieldCheckIcon,
  HeartIcon,
  FireIcon,
  LightBulbIcon,
  GiftIcon,
  TagIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import FlashSaleCountdown from '../components/FlashSaleCountdown'
import { Price } from '../components/Currency'

function AddToCartButton({ productId }: { productId: number }) {
  const [adding, setAdding] = useState(false)
  const [msg, setMsg] = useState('')

  const add = async () => {
    setAdding(true)
    setMsg('')
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity: 1 })
      })
      if (res.status === 401) {
        window.location.href = '/login'
        return
      }
      if (res.ok) {
        setMsg('Added!')
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('cart:updated'))
        }
        setTimeout(() => setMsg(''), 2000)
      } else {
        setMsg('Failed')
      }
    } catch (e) {
      setMsg('Failed')
    } finally {
      setAdding(false)
    }
  }

  return (
    <button
      onClick={add}
      disabled={adding}
      className="w-full bg-orange-500 text-white text-xs px-3 py-2 rounded-md hover:bg-orange-600 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {adding ? 'Adding...' : (msg || 'Add to Cart')}
    </button>
  )
}

// Dynamic data interface
interface HomepageData {
  featuredProducts: Array<{
    id: number
    name: string
    slug: string
    price: number
    compareAt?: number
    images: Array<{ url: string; alt?: string }>
    category: { name: string; slug: string }
    stock: number
    lowStock: boolean
    soldCount: number
  }>
  stats: {
    products: number
    properties: number
    users: number
    revenue: number
    orders: number
    averageOrderValue: number
  }
  categories: Array<{
    id: number
    name: string
    slug: string
    productCount: number
  }>
  testimonials: Array<{
    id: string
    customerName: string
    productName: string
    rating: number
    content: string
    verified: boolean
  }>
  flashSaleProducts: Array<{
    id: number
    flashSaleId: string
    name: string
    slug: string
    price: number
    originalPrice: number
    compareAt: number
    discount: number
    images: Array<{ url: string; alt?: string }>
    category: string
    stock: number
    maxQuantity?: number | null
    soldCount: number
    startTime: string
    endTime: string
    isActive: boolean
  }>
}

// Static service features (unchanged for visual consistency)
const features = [
  {
    title: 'Agricultural Products',
    description: 'Premium quality agricultural products sourced directly from Nigerian farms. Fresh, organic, and delivered to your doorstep.',
    icon: ShoppingBagIcon,
    href: '/shop',
    gradient: 'from-orange-500 to-orange-600',
    bgColor: 'bg-white',
    iconColor: 'text-orange-500',
    hoverGradient: 'hover:from-orange-600 hover:to-orange-700',
    image: '/images/agriculture-rice.jpeg'
  },
  {
    title: 'Premium Kitchenware',
    description: 'High-quality kitchen utensils and cookware for modern homes. Durable, stylish, and built to last.',
    icon: HomeIcon,
    href: '/shop',
    gradient: 'from-orange-500 to-orange-600',
    bgColor: 'bg-white',
    iconColor: 'text-orange-500',
    hoverGradient: 'hover:from-orange-600 hover:to-orange-700',
    image: '/images/kitchenware-cutlery.jpeg'
  },
  {
    title: 'Real Estate Solutions',
    description: 'Comprehensive property management, leasing, and facility management. Your property investment partner.',
    icon: BuildingOfficeIcon,
    href: '/properties',
    gradient: 'from-orange-500 to-orange-600',
    bgColor: 'bg-white',
    iconColor: 'text-orange-500',
    hoverGradient: 'hover:from-orange-600 hover:to-orange-700',
    image: '/images/real-estate-keys.jpeg'
  },
]

// Jumia-inspired stats with orange accent colors
const stats = [
  { 
    label: 'Years of Excellence', 
    value: 'Est. 2025',
    icon: StarIcon,
    color: 'text-orange-500',
    bgColor: 'bg-white',
    glowColor: 'shadow-orange-500/50'
  },
  { 
    label: 'RC Number', 
    value: '8559613',
    icon: ShieldCheckIcon,
    color: 'text-orange-500',
    bgColor: 'bg-white',
    glowColor: 'shadow-orange-500/50'
  },
  { 
    label: 'Active Status', 
    value: 'VERIFIED',
    icon: CheckCircleIcon,
    color: 'text-orange-500',
    bgColor: 'bg-white',
    glowColor: 'shadow-orange-500/50'
  },
  { 
    label: 'Customer Satisfaction', 
    value: '100%',
    icon: HeartIcon,
    color: 'text-orange-500',
    bgColor: 'bg-white',
    glowColor: 'shadow-orange-500/50'
  },
]

// Jumia-inspired testimonials with consistent styling
const testimonials = [
  {
    name: 'Adebayo Johnson',
    role: 'Lagos Business Owner',
    content: 'IDGM Universal has been my go-to supplier for quality agricultural products. Exceptional service that exceeds expectations every time!',
    rating: 5,
    avatar: '👨🏾‍💼',
    bgColor: 'bg-white'
  },
  {
    name: 'Fatima Mohammed',
    role: 'Property Investor',
    content: 'Their real estate management services are top-notch. Professional, reliable, and results-driven team that delivers excellence.',
    rating: 5,
    avatar: '👩🏽‍💼',
    bgColor: 'bg-white'
  },
  {
    name: 'Chinedu Okafor',
    role: 'Restaurant Owner',
    content: 'Best kitchenware supplier in Nigeria. Premium quality products at competitive prices with outstanding customer service.',
    rating: 5,
    avatar: '👨🏿‍🍳',
    bgColor: 'bg-white'
  }
]

// Jumia-inspired floating elements with consistent orange branding
const floatingElements = [
  { icon: SparklesIcon, delay: '0s', duration: '6s', color: 'text-orange-500' },
  { icon: StarIcon, delay: '2s', duration: '8s', color: 'text-orange-500' },
  { icon: HeartIcon, delay: '4s', duration: '7s', color: 'text-orange-500' },
  { icon: FireIcon, delay: '1s', duration: '9s', color: 'text-orange-500' },
  { icon: TagIcon, delay: '3s', duration: '5s', color: 'text-orange-500' },
  { icon: GiftIcon, delay: '5s', duration: '6s', color: 'text-orange-500' },
]

export default function HomePage() {
  const [homepageData, setHomepageData] = useState<HomepageData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchHomepageData = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/homepage')
        if (!response.ok) {
          throw new Error('Failed to fetch homepage data')
        }
        const data = await response.json()
        setHomepageData(data)
      } catch (err) {
        console.error('Homepage data fetch error:', err)
        setError('Failed to load homepage data')
      } finally {
        setLoading(false)
      }
    }

    fetchHomepageData()
  }, [])

  // Show loading state while preserving the visual layout
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Show error state with option to retry
  if (error || !homepageData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-orange-500 text-white px-6 py-2 rounded-md hover:bg-orange-600 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }
  return (
    <>
      {/* Jumia-inspired Hero Section with vibrant orange branding */}
      <section className="bg-white">
        {/* Main hero banner */}
        <div className="relative overflow-hidden h-[600px] flex items-center">
          {/* Background hero image with overlay */}
          <div className="absolute inset-0">
            <Image
              src="/images/hero-store.jpg"
              alt="IDGM Universal Store"
              fill
              priority
              className="object-cover"
              quality={90}
            />
            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40"></div>
          </div>

          {/* Floating elements for visual interest */}
          <div className="absolute inset-0">
            {floatingElements.map((element, index) => (
              <div
                key={index}
                className="absolute animate-float opacity-10"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: element.delay,
                  animationDuration: element.duration,
                }}
              >
                <element.icon className={`w-8 h-8 ${element.color}`} />
              </div>
            ))}
          </div>
          
          <div className="container mx-auto px-4 md:px-8 lg:px-16 relative z-10">
            <div className="max-w-3xl">
              {/* Hero content */}
              <div className="text-white">
                <div className="text-xl font-semibold mb-4 bg-orange-500/90 inline-block px-4 py-2 rounded-full backdrop-blur-sm">Welcome to IDGM Universal</div>
                <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight drop-shadow-2xl">
                  Your One-Stop Shop for Excellence
                </h1>
                <p className="text-xl md:text-2xl mb-8 text-gray-100 drop-shadow-lg">
                  Agricultural Products, Premium Kitchenware & Real Estate Services
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/shop"
                    className="bg-orange-500 text-white px-8 py-3 rounded-md font-bold text-lg hover:bg-orange-600 transition flex items-center gap-2 shadow-xl"
                  >
                    <ShoppingBagIcon className="w-5 h-5" />
                    Shop Now
                  </Link>
                  <Link
                    href="/services"
                    className="bg-white text-orange-600 px-8 py-3 rounded-md font-bold text-lg hover:bg-gray-100 transition flex items-center gap-2 shadow-xl"
                  >
                    <BuildingOfficeIcon className="w-5 h-5" />
                    Our Services
                  </Link>
                </div>

                {/* Trust badges */}
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2 border border-white/30">
                    <CheckCircleIcon className="w-5 h-5" />
                    <span>Verified Business</span>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2 border border-white/30">
                    <TruckIcon className="w-5 h-5" />
                    <span>Fast Delivery</span>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2 border border-white/30">
                    <ShieldCheckIcon className="w-5 h-5" />
                    <span>Secure Payments</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Promotion banner - Jumia style */}
        <div className="bg-black text-white py-3 text-center font-bold">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center gap-4">
              <span className="animate-pulse">🔥</span>
              <span>SPECIAL OFFER: Free delivery on orders above <Price amount={50000} />!</span>
              <span className="animate-pulse">🔥</span>
            </div>
          </div>
        </div>

        {/* Featured categories - Jumia style */}
        <div className="container mx-auto px-4 md:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-gray-800 mb-4">Shop By Category</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">Discover our wide range of products and services designed to meet your needs</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <Link 
                key={feature.title}
                href={feature.href}
                className="bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                {/* Category image */}
                <div className="h-48 relative overflow-hidden bg-gray-100">
                  {feature.image ? (
                    <Image
                      src={feature.image}
                      alt={feature.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center bg-orange-100">
                      <feature.icon className="w-20 h-20 text-orange-500" />
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 mb-4">{feature.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-semibold">
                      {feature.title === 'Agricultural Products' ? 
                        `${homepageData.categories.find(c => c.name.toLowerCase().includes('grain') || c.name.toLowerCase().includes('produce'))?.productCount || homepageData.stats.products}+ Items` :
                       feature.title === 'Premium Kitchenware' ? 
                        `${homepageData.categories.find(c => c.name.toLowerCase().includes('kitchen'))?.productCount || Math.round(homepageData.stats.products * 0.3)}+ Items` :
                       feature.title === 'Real Estate Solutions' ? 
                        `${homepageData.stats.properties}+ Properties` : 'Top Rated'}
                    </span>
                    <div className="flex items-center text-orange-500 font-semibold">
                      Explore
                      <ArrowRightIcon className="w-4 h-4 ml-1" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Jumia-inspired Flash Sale Section with Countdown */}
      {homepageData.flashSaleProducts && homepageData.flashSaleProducts.length > 0 ? (
      <section className="py-12 bg-gray-100">
        <div className="container mx-auto px-4 md:px-8">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6 rounded-t-xl">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-3">
                <FireIcon className="w-10 h-10 animate-pulse" />
                <div>
                  <h2 className="text-3xl md:text-4xl font-black">Flash Sales!</h2>
                  <p className="text-sm opacity-90">Limited time offers - Don't miss out!</p>
                </div>
              </div>
              {homepageData.flashSaleProducts[0]?.endTime && (
                <div className="flex items-center gap-2">
                  <ClockIcon className="w-5 h-5" />
                  <div className="text-sm font-semibold">Ends in:</div>
                  <FlashSaleCountdown endTime={homepageData.flashSaleProducts[0].endTime} />
                </div>
              )}
            </div>
          </div>
          
          {/* Flash sale products - fully dynamic */}
          <div className="bg-white p-6 rounded-b-xl shadow-lg grid grid-cols-2 md:grid-cols-4 gap-6">
            {homepageData.flashSaleProducts && homepageData.flashSaleProducts.length > 0 ? (
              homepageData.flashSaleProducts.slice(0, 4).map((product) => (
                <div key={product.id} className="bg-white border-2 border-orange-100 rounded-lg overflow-hidden hover:shadow-xl hover:border-orange-300 transition-all group">
                  <Link href={`/shop/${product.slug}`}>
                    <div className="h-40 bg-gray-50 flex items-center justify-center relative overflow-hidden">
                      {product.images && product.images[0] ? (
                        <img
                          src={product.images[0].url}
                          alt={product.images[0].alt || product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <ShoppingBagIcon className="w-16 h-16 text-orange-300" />
                      )}
                      
                      {/* Discount badge with flash animation */}
                      <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
                        -{product.discount}% OFF
                      </div>
                      
                      {/* Stock indicator */}
                      {product.stock < 10 && (
                        <div className="absolute bottom-2 left-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          Only {product.stock} left!
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4">
                      <h3 className="text-sm font-bold text-gray-800 mb-2 line-clamp-2 h-10">{product.name}</h3>
                      
                      {/* Price with savings */}
                      <div className="mb-2">
                        <div className="flex items-baseline gap-2">
<span className="text-xl font-black text-orange-500"><Price amount={product.price} /></span>
                          <span className="text-xs text-gray-500 line-through"><Price amount={product.compareAt} /></span>
                        </div>
<div className="text-xs text-green-600 font-semibold">
                          Save <Price amount={product.compareAt - product.price} />
                        </div>
                      </div>
                      
                      {/* Progress bar for sold quantity */}
                      {product.maxQuantity && (
                        <div className="mb-3">
                          <div className="flex justify-between text-xs text-gray-600 mb-1">
                            <span>Sold: {product.soldCount}/{product.maxQuantity}</span>
                            <span>{Math.round((product.soldCount / product.maxQuantity) * 100)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div 
                              className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${Math.min((product.soldCount / product.maxQuantity) * 100, 100)}%` }}
                            />
                          </div>
                        </div>
                      )}
                      
                      {/* Rating */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <StarIcon key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                          ))}
                          <span className="text-xs text-gray-500 ml-1">(4.8)</span>
                        </div>
                        <span className="text-xs text-gray-500">{product.category}</span>
                      </div>
                    </div>
                  </Link>

                  {/* Add to Cart from homepage */}
                  <div className="px-4 pb-4">
                    <AddToCartButton productId={product.id} />
                  </div>
                </div>
              ))
            ) : (
              // Fallback to maintain visual consistency
              [1, 2, 3, 4].map((item) => (
                <div key={item} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  <div className="h-40 bg-orange-100 flex items-center justify-center relative">
                    <ShoppingBagIcon className="w-16 h-16 text-orange-300" />
                    <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      -40%
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-bold text-gray-800 mb-1 truncate">Premium Product {item}</h3>
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-bold text-orange-500">₦15,000</span>
                      <span className="text-xs text-gray-500 line-through">₦25,000</span>
                    </div>
                    <div className="mt-3 flex justify-between items-center">
                      <div className="flex items-center">
                        <StarIcon className="w-3 h-3 text-yellow-500 fill-current" />
                        <StarIcon className="w-3 h-3 text-yellow-500 fill-current" />
                        <StarIcon className="w-3 h-3 text-yellow-500 fill-current" />
                        <StarIcon className="w-3 h-3 text-yellow-500 fill-current" />
                        <StarIcon className="w-3 h-3 text-gray-300 fill-current" />
                        <span className="text-xs text-gray-500 ml-1">(42)</span>
                      </div>
                      <div className="text-xs text-gray-500">25 sold</div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="mt-6 text-center">
            <Link 
              href="/shop" 
              className="inline-block bg-orange-500 text-white px-8 py-3 rounded-md font-bold hover:bg-orange-600 transition"
            >
              View All Deals
            </Link>
          </div>
        </div>
      </section>
      ) : null}
      
      {/* Jumia-inspired Featured Categories */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-gray-800 mb-4">Our Premium Services</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">Discover our comprehensive range of high-quality services designed to exceed your expectations</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div 
                key={feature.title}
                className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-xl transition duration-300"
              >
                <div className="h-48 relative overflow-hidden bg-gray-100">
                  {feature.image ? (
                    <Image
                      src={feature.image}
                      alt={feature.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center bg-orange-100">
                      <feature.icon className="h-20 w-20 text-orange-500" />
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 mb-6 text-sm">{feature.description}</p>
                  
                  <Link
                    href={feature.href}
                    className="inline-flex items-center text-orange-500 font-semibold hover:text-orange-700 transition"
                  >
                    Learn More
                    <ArrowRightIcon className="ml-2 w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Jumia-inspired Company Stats Section */}
      <section className="py-12 bg-black text-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-black mb-4">Why Choose IDGM?</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">Join thousands of satisfied customers who trust our verified business</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-gray-800 rounded-lg p-6 text-center">
                <div className="bg-orange-500 w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-black text-white mb-2">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
          
          <div className="mt-10 text-center">
            <Link 
              href="/about" 
              className="inline-block bg-orange-500 text-white px-8 py-3 rounded-md font-bold hover:bg-orange-600 transition"
            >
              Learn More About Us
            </Link>
          </div>
        </div>
      </section>

      {/* Jumia-inspired Testimonials Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-gray-800 mb-4">What Our Customers Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Join thousands of satisfied customers across Nigeria</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {homepageData.testimonials && homepageData.testimonials.length > 0 ? (
              homepageData.testimonials.slice(0, 3).map((testimonial) => (
                <div 
                  key={testimonial.id}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
                >
                  <div className="flex items-center mb-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full text-2xl">
                      👤
                    </div>
                    <div className="ml-4">
                      <p className="font-bold text-gray-800">{testimonial.customerName}</p>
                      <p className="text-sm text-gray-600">Verified Customer</p>
                    </div>
                  </div>
                  
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <StarIcon key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  
                  <blockquote className="text-gray-700 text-sm mb-4">
                    "{testimonial.content}"
                  </blockquote>
                  
                  <div className="text-orange-500 text-xs font-semibold">
                    {testimonial.verified ? 'Verified Purchase' : 'Customer Review'} • {testimonial.productName}
                  </div>
                </div>
              ))
            ) : (
              // Fallback to maintain visual consistency
              testimonials.map((testimonial) => (
                <div 
                  key={testimonial.name}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
                >
                  <div className="flex items-center mb-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full text-2xl">
                      {testimonial.avatar}
                    </div>
                    <div className="ml-4">
                      <p className="font-bold text-gray-800">{testimonial.name}</p>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                    </div>
                  </div>
                  
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <StarIcon key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  
                  <blockquote className="text-gray-700 text-sm mb-4">
                    "{testimonial.content}"
                  </blockquote>
                  
                  <div className="text-orange-500 text-xs font-semibold">Verified Purchase</div>
                </div>
              ))
            )}
          </div>
          
          <div className="mt-10 text-center">
            <span className="inline-block bg-orange-100 text-orange-800 px-4 py-2 rounded-full font-semibold">
              4.9/5 Average Rating from {homepageData.stats.orders}+ Happy Customers
            </span>
          </div>
        </div>
      </section>

      {/* Jumia-inspired Newsletter & Download App Section */}
      <section className="py-12 bg-orange-500 text-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Newsletter signup */}
            <div>
              <h2 className="text-3xl font-black mb-4">Subscribe for Deals & Updates</h2>
              <p className="mb-6">Be the first to know about our special offers, new products, and exclusive deals!</p>
              
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Enter your email address" 
                  className="flex-grow p-3 rounded-l-md text-black focus:outline-none" 
                />
                <button className="bg-black text-white px-6 py-3 rounded-r-md font-bold hover:bg-gray-800 transition">
                  Subscribe
                </button>
              </div>
            </div>
            
            {/* Mobile app */}
            <div className="text-center lg:text-right">
              <h2 className="text-3xl font-black mb-4">Download Our Mobile App</h2>
              <p className="mb-6">Shop on the go! Get the best experience with our mobile application</p>
              
              <div className="flex flex-wrap justify-center lg:justify-end gap-4">
                <button className="bg-black text-white px-6 py-3 rounded-md font-bold hover:bg-gray-800 transition flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.9 19.9l1.5-1.5c.2-.2.3-.4.3-.7 0-.3-.1-.5-.3-.7l-1.5-1.5c-.2-.2-.4-.3-.7-.3-.3 0-.5.1-.7.3l-1.5 1.5c-.2.2-.3.4-.3.7 0 .3.1.5.3.7l1.5 1.5c.2.2.4.3.7.3.3 0 .5-.1.7-.3zm-3.7-3.7c.2-.2.3-.4.3-.7 0-.3-.1-.5-.3-.7l-7.2-7.2c-.2-.2-.4-.3-.7-.3-.3 0-.5.1-.7.3l-1.5 1.5c-.2.2-.3.4-.3.7 0 .3.1.5.3.7l7.2 7.2c.2.2.4.3.7.3.3 0 .5-.1.7-.3l1.5-1.5zM24 5h-4V1h-2v4h-4v2h4v4h2V7h4z"/>
                  </svg>
                  App Store
                </button>
                <button className="bg-black text-white px-6 py-3 rounded-md font-bold hover:bg-gray-800 transition flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 3v18h18V3H3zm14.3 5.8l-1.4 1.4L14 8.4V12H7v-1h6V9c0-.3.1-.5.3-.7l2.3-2.3L14.2 4.5 7.5 11.2 6.1 9.8 12.8 3h1.4l3.1 3.1L15.9 8.8z"/>
                  </svg>
                  Google Play
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Jumia-inspired Call to Action */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <h2 className="text-4xl font-black text-gray-800 mb-6">Ready to Experience Excellence?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-10">Join thousands of satisfied customers who trust IDGM Universal for their business needs</p>
          
          <div className="flex flex-wrap justify-center gap-6">
            <Link
              href="/shop"
              className="bg-orange-500 text-white px-8 py-4 rounded-md font-bold text-lg hover:bg-orange-600 transition flex items-center gap-2"
            >
              <ShoppingBagIcon className="w-6 h-6" />
              Start Shopping
            </Link>
            
            <Link 
              href="/contact" 
              className="bg-black text-white px-8 py-4 rounded-md font-bold text-lg hover:bg-gray-900 transition flex items-center gap-2"
            >
              <HeartIcon className="w-6 h-6" />
              Contact Us
            </Link>
          </div>
          
          <div className="mt-16 flex flex-wrap justify-center gap-10 text-gray-600">
            <div className="flex items-center gap-2">
              <TruckIcon className="w-6 h-6 text-orange-500" />
              <span>Fast Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheckIcon className="w-6 h-6 text-orange-500" />
              <span>Secure Payments</span>
            </div>
            <div className="flex items-center gap-2">
              <TagIcon className="w-6 h-6 text-orange-500" />
              <span>Best Prices</span>
            </div>
            <div className="flex items-center gap-2">
              <UserGroupIcon className="w-6 h-6 text-orange-500" />
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

// Custom CSS animations (add to your global CSS or styled-components)
const styles = `
@keyframes blob {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(10deg);
  }
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-shimmer {
  animation: shimmer 3s linear infinite;
}

.bg-300% {
  background-size: 300% 300%;
}

.bg-gradient-radial {
  background: radial-gradient(circle, var(--tw-gradient-stops));
}

.transform-gpu {
  transform: translate3d(0, 0, 0);
}
`