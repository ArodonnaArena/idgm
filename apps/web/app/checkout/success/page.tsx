'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { 
  CheckCircleIcon, 
  TruckIcon, 
  EnvelopeIcon,
  ArrowRightIcon,
  SparklesIcon,
  HeartIcon,
  GiftIcon
} from '@heroicons/react/24/outline'

export default function OrderSuccessPage() {
  const [showConfetti, setShowConfetti] = useState(true)

  useEffect(() => {
    // Hide confetti after animation
    const timer = setTimeout(() => {
      setShowConfetti(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 relative overflow-hidden">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-10">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            >
              <div 
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444'][Math.floor(Math.random() * 5)]
                }}
              />
            </div>
          ))}
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          {/* Success Icon */}
          <div className="mx-auto w-32 h-32 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mb-8 animate-pulse shadow-2xl">
            <CheckCircleIcon className="w-16 h-16 text-white" />
          </div>

          {/* Success Message */}
          <h1 className="text-5xl font-bold text-gray-900 mb-4 animate-fade-in">
            🎉 Order Successful!
          </h1>
          <p className="text-xl text-gray-600 mb-8 animate-slide-up">
            Thank you for your purchase! Your order has been confirmed and is being processed.
          </p>

          {/* Order Details Card */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-2xl border p-8 mb-8 animate-slide-up-delay">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">#</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Order Number</h3>
                <p className="text-blue-600 font-bold text-lg">IDGM-{Date.now().toString().slice(-6)}</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💰</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Total Amount</h3>
                <p className="text-green-600 font-bold text-lg">₦115,000</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TruckIcon className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Delivery</h3>
                <p className="text-purple-600 font-bold">3-5 Business Days</p>
              </div>
            </div>
          </div>

          {/* What's Next */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-8 mb-8 border border-yellow-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">What happens next?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold mb-3">
                  1
                </div>
                <EnvelopeIcon className="w-8 h-8 text-yellow-600 mb-2" />
                <h3 className="font-semibold text-gray-900 mb-1">Confirmation Email</h3>
                <p className="text-sm text-gray-600">You'll receive an email with your order details</p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold mb-3">
                  2
                </div>
                <GiftIcon className="w-8 h-8 text-orange-600 mb-2" />
                <h3 className="font-semibold text-gray-900 mb-1">Order Processing</h3>
                <p className="text-sm text-gray-600">We'll prepare your items with care</p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white font-bold mb-3">
                  3
                </div>
                <TruckIcon className="w-8 h-8 text-red-600 mb-2" />
                <h3 className="font-semibold text-gray-900 mb-1">Fast Delivery</h3>
                <p className="text-sm text-gray-600">Your order will be delivered to your doorstep</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/shop/products"
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all transform hover:scale-105 hover:shadow-lg flex items-center space-x-2"
            >
              <SparklesIcon className="w-5 h-5" />
              <span>Continue Shopping</span>
            </Link>
            
            <Link
              href="/account/orders"
              className="bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 px-8 py-4 rounded-xl font-semibold transition-all hover:shadow-lg flex items-center space-x-2"
            >
              <span>View Order Status</span>
              <ArrowRightIcon className="w-5 h-5" />
            </Link>
          </div>

          {/* Social Sharing */}
          <div className="mt-12 p-6 bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl border border-pink-200">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <HeartIcon className="w-6 h-6 text-pink-600" />
              <h3 className="text-lg font-semibold text-gray-900">Love our products?</h3>
            </div>
            <p className="text-gray-600 mb-4">Share the love with your friends and family!</p>
            <div className="flex justify-center space-x-4">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                Share on Facebook
              </button>
              <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                Share on WhatsApp
              </button>
            </div>
          </div>

          {/* Contact Info */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Questions about your order? Contact us at{' '}
              <a href="mailto:sanctuarymultipurpose@gmail.com" className="text-green-600 hover:text-green-700 font-semibold">
                sanctuarymultipurpose@gmail.com
              </a>
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 1s ease-out 0.3s both;
        }
        
        .animate-slide-up-delay {
          animation: slide-up 1s ease-out 0.6s both;
        }
      `}</style>
    </div>
  )
}
