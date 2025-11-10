'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { 
  ShoppingCartIcon, 
  XMarkIcon, 
  PlusIcon, 
  MinusIcon,
  HeartIcon,
  ArrowRightIcon,
  TagIcon,
  TruckIcon,
  CreditCardIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'
import { useCart } from '../../components/CartProvider'
import { Price } from '../../components/Currency'

export default function CartPage() {
  const { cart, loading, updateQuantity, removeItem, subtotal, count, refresh } = useCart()
  const [promoCode, setPromoCode] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)
  const [promoDiscount, setPromoDiscount] = useState(0)

  useEffect(() => { refresh() }, [refresh])

  const deliveryFee = useMemo(() => (subtotal > 50000 ? 0 : 5000), [subtotal])
  const discountAmount = useMemo(() => (promoApplied ? subtotal * (promoDiscount / 100) : 0), [promoApplied, promoDiscount, subtotal])
  const total = useMemo(() => subtotal - discountAmount + deliveryFee, [subtotal, discountAmount, deliveryFee])

  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === 'welcome10') {
      setPromoApplied(true)
      setPromoDiscount(10)
    } else {
      alert('Invalid promo code')
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

  const items = cart?.items || []
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto w-32 h-32 bg-gradient-to-br from-green-100 to-blue-100 rounded-full flex items-center justify-center mb-8 animate-pulse">
            <ShoppingCartIcon className="w-16 h-16 text-green-600" />
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-8 text-lg">Discover amazing products in our store!</p>
          <Link
            href="/shop"
            className="inline-flex items-center bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all transform hover:scale-105 hover:shadow-lg"
          >
            <SparklesIcon className="w-5 h-5 mr-2" />
            Start Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-100 to-blue-100 rounded-full mb-4 animate-bounce">
            <ShoppingCartIcon className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
          <p className="text-gray-600">Review your items before checkout</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border overflow-hidden">
              <div className="p-6 border-b bg-gradient-to-r from-green-50 to-blue-50">
                <h2 className="text-2xl font-semibold text-gray-900">
                  Cart Items ({items.length})
                </h2>
              </div>
              
              <div className="p-6 space-y-6">
                {items.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex-shrink-0">
                      <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden group">
                        <img
                          src={item.product?.images?.[0]?.url || '/placeholder.jpg'}
                          alt={item.product?.images?.[0]?.alt || item.product?.name || 'Product'}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    </div>
                    
                    <div className="flex-grow min-w-0">
                      <div className="flex justify-between items-start">
                        <div className="min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 hover:text-green-600 transition-colors line-clamp-1">
                            <Link href={`/shop/${item.product?.slug || ''}`}>
                              {item.product?.name || 'Product'}
                            </Link>
                          </h3>
<p className="text-green-600 font-bold text-xl mt-1">
                            <Price amount={item.price} />
                          </p>
                        </div>
                        
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50"
                        >
                          <XMarkIcon className="w-5 h-5" />
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => updateQuantity(item.id, Number(item.quantity) - 1)}
                            className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                            disabled={Number(item.quantity) <= 1}
                          >
                            <MinusIcon className="w-4 h-4" />
                          </button>
                          
                          <span className="font-semibold text-lg min-w-[2rem] text-center">
                            {Number(item.quantity)}
                          </span>
                          
                          <button
                            onClick={() => updateQuantity(item.id, Number(item.quantity) + 1)}
                            className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                          >
                            <PlusIcon className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button className="text-gray-400 hover:text-pink-500 transition-colors p-2 rounded-full hover:bg-pink-50">
                            <HeartIcon className="w-5 h-5" />
                          </button>
<p className="text-lg font-bold text-gray-900">
                            <Price amount={Number(item.price) * Number(item.quantity)} />
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border overflow-hidden sticky top-8">
              <div className="p-6 border-b bg-gradient-to-r from-purple-50 to-pink-50">
                <h2 className="text-2xl font-semibold text-gray-900">Order Summary</h2>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Promo Code */}
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 border border-yellow-200">
                  <div className="flex items-center mb-3">
                    <TagIcon className="w-5 h-5 text-yellow-600 mr-2" />
                    <span className="font-medium text-gray-900">Promo Code</span>
                  </div>
                  {!promoApplied ? (
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="Enter code"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      />
                      <button
                        onClick={applyPromoCode}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className="text-green-600 font-medium">WELCOME10 Applied!</span>
                      <button
                        onClick={() => {
                          setPromoApplied(false)
                          setPromoDiscount(0)
                          setPromoCode('')
                        }}
                        className="text-red-500 hover:text-red-600 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                {/* Order Details */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
<span className="font-semibold"><Price amount={subtotal} /></span>
                  </div>
                  
                  {promoApplied && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({promoDiscount}%)</span>
                      <span>-?{discountAmount.toLocaleString()}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery</span>
                    <span className={deliveryFee === 0 ? 'text-green-600 font-medium' : 'font-semibold'}>
{deliveryFee === 0 ? 'FREE' : <Price amount={deliveryFee} />}
                    </span>
                  </div>
                  
                  <div className="border-t pt-3 flex justify-between text-xl font-bold">
                    <span>Total</span>
<span className="text-green-600"><Price amount={total} /></span>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-3 text-sm">
                  <div className="flex items-center text-gray-600">
                    <TruckIcon className="w-4 h-4 mr-2 text-green-600" />
                    Free delivery on orders over ?50,000
                  </div>
                  <div className="flex items-center text-gray-600">
                    <CreditCardIcon className="w-4 h-4 mr-2 text-blue-600" />
                    Secure payment processing
                  </div>
                </div>

                {/* Checkout Button */}
                <Link
                  href="/checkout"
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all transform hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-2"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRightIcon className="w-5 h-5" />
                </Link>
                
                <Link
                  href="/shop"
                  className="w-full bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 py-3 px-6 rounded-xl font-medium transition-all hover:shadow-md flex items-center justify-center"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
