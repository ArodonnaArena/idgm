'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  CreditCardIcon, 
  BanknotesIcon, 
  ShieldCheckIcon, 
  TruckIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowLeftIcon,
  SparklesIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline'
import { useCart } from '../../components/CartProvider'
import { apiUrl } from '../../lib/api'

interface CheckoutItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
}

interface ShippingInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  postalCode: string
}

export default function CheckoutPage() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank' | 'paystack' | 'flutterwave'>('paystack')
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: ''
  })

  const { cart, subtotal } = useCart()
  const deliveryFee = subtotal > 50000 ? 0 : 5000
  const total = subtotal + deliveryFee

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStep(2)
  }

  const handlePayment = async (provider: 'paystack' | 'flutterwave') => {
    setLoading(true)
    try {
const res = await fetch(apiUrl('/api/payments/initialize'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: shippingInfo.email,
          amount: total,
          currency: 'NGN',
          provider,
          metadata: {
            customer: { name: `${shippingInfo.firstName} ${shippingInfo.lastName}`.trim(), email: shippingInfo.email, phone: shippingInfo.phone },
            order: { id: cart?.id || 'cart', items: (cart?.items || []).map(it => ({ id: it.id, productId: it.productId, quantity: it.quantity, price: it.price })) }
          }
        })
      })
      const data = await res.json()
      if (!res.ok || !data?.success) throw new Error(data?.error || 'Payment init failed')

      // Redirect to provider
      if (provider === 'paystack') {
        const url = data?.payment?.data?.authorization_url
        if (url) window.location.href = url
      } else {
        const link = data?.payment?.data?.link
        if (link) window.location.href = link
      }
    } catch (error) {
      console.error('Payment failed:', error)
      alert('Payment initialization failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const initializePaystackPayment = () => handlePayment('paystack')
  const initializeFlutterwavePayment = () => handlePayment('flutterwave')

  const nigerianStates = [
    'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno', 
    'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT', 'Gombe', 
    'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 
    'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 
    'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara'
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/cart" className="inline-flex items-center text-gray-600 hover:text-green-600 transition-colors mb-4">
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back to Cart
          </Link>
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-100 to-blue-100 rounded-full mb-4">
            <ShieldCheckIcon className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Secure Checkout</h1>
          <p className="text-gray-600">Complete your purchase safely and securely</p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            <div className={`flex items-center ${step >= 1 ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold border-2 ${
                step >= 1 ? 'bg-green-600 text-white border-green-600' : 'border-gray-300'
              }`}>
                {step > 1 ? <CheckCircleIcon className="w-5 h-5" /> : '1'}
              </div>
              <span className="ml-2 font-medium">Shipping</span>
            </div>
            <div className={`w-16 h-1 ${step >= 2 ? 'bg-green-600' : 'bg-gray-300'}`}></div>
            <div className={`flex items-center ${step >= 2 ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold border-2 ${
                step >= 2 ? 'bg-green-600 text-white border-green-600' : 'border-gray-300'
              }`}>
                2
              </div>
              <span className="ml-2 font-medium">Payment</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {step === 1 ? (
              /* Shipping Information */
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border overflow-hidden">
                <div className="p-6 border-b bg-gradient-to-r from-green-50 to-blue-50">
                  <h2 className="text-2xl font-semibold text-gray-900">Shipping Information</h2>
                </div>
                
                <form onSubmit={handleShippingSubmit} className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={shippingInfo.firstName}
                        onChange={(e) => setShippingInfo({...shippingInfo, firstName: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        placeholder="Enter first name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={shippingInfo.lastName}
                        onChange={(e) => setShippingInfo({...shippingInfo, lastName: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        placeholder="Enter last name"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={shippingInfo.email}
                        onChange={(e) => setShippingInfo({...shippingInfo, email: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={shippingInfo.phone}
                        onChange={(e) => setShippingInfo({...shippingInfo, phone: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        placeholder="+234 800 000 0000"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address *
                    </label>
                    <input
                      type="text"
                      required
                      value={shippingInfo.address}
                      onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      placeholder="Street address, building, apartment"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        required
                        value={shippingInfo.city}
                        onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        placeholder="City"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State *
                      </label>
                      <select
                        required
                        value={shippingInfo.state}
                        onChange={(e) => setShippingInfo({...shippingInfo, state: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      >
                        <option value="">Select State</option>
                        {nigerianStates.map(state => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        value={shippingInfo.postalCode}
                        onChange={(e) => setShippingInfo({...shippingInfo, postalCode: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        placeholder="100001"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all transform hover:scale-105 hover:shadow-lg"
                  >
                    Continue to Payment
                  </button>
                </form>
              </div>
            ) : (
              /* Payment Method */
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border overflow-hidden">
                <div className="p-6 border-b bg-gradient-to-r from-purple-50 to-pink-50">
                  <h2 className="text-2xl font-semibold text-gray-900">Payment Method</h2>
                </div>
                
                <div className="p-6 space-y-6">
                  {/* Payment Options */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div
                      onClick={() => setPaymentMethod('paystack')}
                      className={`p-4 border rounded-xl cursor-pointer transition-all hover:shadow-lg ${
                        paymentMethod === 'paystack' ? 'border-green-500 bg-green-50 ring-2 ring-green-200' : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <CreditCardIcon className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">Paystack</h3>
                          <p className="text-sm text-gray-600">Cards, Bank Transfer, USSD</p>
                        </div>
                      </div>
                    </div>

                    <div
                      onClick={() => setPaymentMethod('flutterwave')}
                      className={`p-4 border rounded-xl cursor-pointer transition-all hover:shadow-lg ${
                        paymentMethod === 'flutterwave' ? 'border-green-500 bg-green-50 ring-2 ring-green-200' : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                          <BanknotesIcon className="w-6 h-6 text-orange-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">Flutterwave</h3>
                          <p className="text-sm text-gray-600">Multiple payment options</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Security Notice */}
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 border border-green-200">
                    <div className="flex items-center space-x-3">
                      <LockClosedIcon className="w-6 h-6 text-green-600" />
                      <div>
                        <h4 className="font-semibold text-gray-900">Secure Payment</h4>
                        <p className="text-sm text-gray-600">Your payment information is encrypted and secure</p>
                      </div>
                    </div>
                  </div>

                  {/* Payment Buttons */}
                  <div className="space-y-4">
                    <button
                      onClick={() => setStep(1)}
                      className="w-full bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 py-3 px-6 rounded-xl font-medium transition-all hover:shadow-md"
                    >
                      Back to Shipping
                    </button>
                    
                    {paymentMethod === 'paystack' && (
                      <button
                        onClick={initializePaystackPayment}
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
                      >
                        {loading ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Processing Payment...</span>
                          </>
                        ) : (
                          <>
                            <CreditCardIcon className="w-5 h-5" />
                            <span>Pay with Paystack</span>
                          </>
                        )}
                      </button>
                    )}
                    
                    {paymentMethod === 'flutterwave' && (
                      <button
                        onClick={initializeFlutterwavePayment}
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-orange-700 hover:to-red-700 transition-all transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
                      >
                        {loading ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Processing Payment...</span>
                          </>
                        ) : (
                          <>
                            <BanknotesIcon className="w-5 h-5" />
                            <span>Pay with Flutterwave</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border overflow-hidden sticky top-8">
              <div className="p-6 border-b bg-gradient-to-r from-yellow-50 to-orange-50">
                <h2 className="text-2xl font-semibold text-gray-900">Order Summary</h2>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Items */}
                <div className="space-y-4">
                  {(cart?.items || []).map((item) => (
                    <div key={item.id} className="flex items-center space-x-3">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={item.product?.images?.[0]?.url || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop'}
                          alt={item.product?.name || 'Product'}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-grow min-w-0">
                        <h4 className="font-medium text-gray-900 line-clamp-1">{item.product?.name || 'Product'}</h4>
                        <p className="text-sm text-gray-600">Qty: {Number(item.quantity)}</p>
                      </div>
                      <p className="font-semibold text-gray-900">
                        ₦{(Number(item.price) * Number(item.quantity)).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="border-t pt-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">₦{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery</span>
                    <span className={deliveryFee === 0 ? 'text-green-600 font-medium' : 'font-semibold'}>
                      {deliveryFee === 0 ? 'FREE' : `₦${deliveryFee.toLocaleString()}`}
                    </span>
                  </div>
                  <div className="border-t pt-3 flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span className="text-green-600">₦{total.toLocaleString()}</span>
                  </div>
                </div>

                {/* Features */}
                <div className="border-t pt-4 space-y-3 text-sm">
                  <div className="flex items-center text-gray-600">
                    <TruckIcon className="w-4 h-4 mr-2 text-green-600" />
                    Fast and secure delivery
                  </div>
                  <div className="flex items-center text-gray-600">
                    <ShieldCheckIcon className="w-4 h-4 mr-2 text-blue-600" />
                    100% secure payment
                  </div>
                  <div className="flex items-center text-gray-600">
                    <SparklesIcon className="w-4 h-4 mr-2 text-purple-600" />
                    Quality guarantee
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
