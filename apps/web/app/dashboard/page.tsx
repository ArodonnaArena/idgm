'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  ShoppingBagIcon, 
  UserCircleIcon, 
  ClipboardDocumentListIcon,
  ShoppingCartIcon 
} from '@heroicons/react/24/outline'

interface DashboardData {
  user: { name: string; email: string; phone: string | null }
  stats: {
    totalOrders: number
    pendingOrders: number
    cartItemsCount: number
    cartTotal: number
  }
  recentOrders: Array<{
    id: string
    total: number
    status: string
    createdAt: string
    itemCount: number
  }>
  cart: {
    id: string
    itemCount: number
    total: number
    items: Array<{
      id: string
      quantity: number
      product: {
        id: string
        name: string
        price: number
        images: string[]
      }
    }>
  } | null
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    if (status === 'authenticated') {
      fetchDashboardData()
    }
  }, [status])

  const fetchDashboardData = async () => {
    try {
      const res = await fetch('/api/dashboard')
      if (res.ok) {
        const data = await res.json()
        setDashboardData(data)
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    )
  }

  if (!session || !dashboardData) {
    return null
  }

  const dashboardItems = [
    {
      name: 'My Orders',
      description: `${dashboardData.stats.totalOrders} total orders`,
      icon: ShoppingBagIcon,
      href: '/dashboard/orders',
      color: 'bg-blue-500',
      count: dashboardData.stats.totalOrders,
    },
    {
      name: 'Pending Orders',
      description: 'Orders being processed',
      icon: ClipboardDocumentListIcon,
      href: '/dashboard/orders',
      color: 'bg-yellow-500',
      count: dashboardData.stats.pendingOrders,
    },
    {
      name: 'Shopping Cart',
      description: `${dashboardData.stats.cartItemsCount} items`,
      icon: ShoppingCartIcon,
      href: '/cart',
      color: 'bg-orange-500',
      count: dashboardData.stats.cartItemsCount,
    },
    {
      name: 'Profile',
      description: 'Manage your account',
      icon: UserCircleIcon,
      href: '/dashboard/profile',
      color: 'bg-green-500',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {session.user?.name || 'Customer'}!
          </h1>
          <p className="mt-2 text-gray-600">
            Manage your orders, profile, and preferences from your dashboard.
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {dashboardItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 group relative"
            >
              {'count' in item && item.count !== undefined && item.count > 0 && (
                <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                  {item.count}
                </div>
              )}
              <div className="flex items-start space-x-4">
                <div className={`${item.color} rounded-lg p-3 text-white flex-shrink-0`}>
                  <item.icon className="h-6 w-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-orange-500 transition-colors truncate">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Recent Orders Section */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Orders</h2>
          {dashboardData.recentOrders.length > 0 ? (
            <div className="space-y-4">
              {dashboardData.recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 rounded-lg p-3">
                      <ShoppingBagIcon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Order #{order.id.slice(0, 8)}</p>
                      <p className="text-sm text-gray-600">{order.itemCount} items</p>
                      <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">₦{order.total.toLocaleString()}</p>
                    <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
                      order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <ShoppingBagIcon className="h-12 w-12 mx-auto mb-3 text-gray-400" />
              <p>No orders yet</p>
              <Link 
                href="/shop" 
                className="inline-block mt-4 text-orange-500 hover:text-orange-600 font-semibold"
              >
                Start Shopping →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
