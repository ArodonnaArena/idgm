'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  ChartBarIcon, 
  ShoppingBagIcon, 
  BuildingOfficeIcon,
  UsersIcon,
  CurrencyDollarIcon,
  TruckIcon,
  ExclamationTriangleIcon,
  SparklesIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  EyeIcon,
  PlusIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline'

interface DashboardStats {
  totalRevenue: number
  revenueChange: number
  totalOrders: number
  ordersChange: number
  totalProducts: number
  productsChange: number
  totalProperties: number
  propertiesChange: number
  activeUsers: number
  usersChange: number
  pendingTickets: number
  ticketsChange: number
}

interface RecentOrder {
  id: string
  customer: string
  amount: number
  status: string
  date: string
}

interface RecentProperty {
  id: string
  title: string
  type: string
  rent?: number
  price?: number
  status: string
}

interface DashboardData {
  stats: DashboardStats
  recentOrders: RecentOrder[]
  recentProperties: RecentProperty[]
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedPeriod, setSelectedPeriod] = useState('7d')
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/admin/dashboard?period=${selectedPeriod}`)
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data')
      }
      
      const data = await response.json()
      setDashboardData(data)
    } catch (err) {
      console.error('Dashboard fetch error:', err)
      setError(err instanceof Error ? err.message : 'Failed to load dashboard')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [selectedPeriod])

  const StatCard = ({ 
    title, 
    value, 
    change, 
    icon: Icon, 
    color, 
    bgColor, 
    trend 
  }: {
    title: string
    value: string | number
    change: number
    icon: any
    color: string
    bgColor: string
    trend: 'up' | 'down'
  }) => (
    <div className="group bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border hover:shadow-3xl transition-all duration-700 hover:-translate-y-6 hover:rotate-2 hover:scale-105">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-gray-600 text-sm font-semibold mb-3">{title}</p>
          <p className="text-4xl font-extrabold text-gray-900 mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-green-600 group-hover:to-blue-600 group-hover:bg-clip-text transition-all">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          <div className={`flex items-center ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {trend === 'up' ? (
              <ArrowUpIcon className="w-5 h-5 mr-2 group-hover:animate-bounce" />
            ) : (
              <ArrowDownIcon className="w-5 h-5 mr-2 group-hover:animate-bounce" />
            )}
            <span className="text-lg font-bold">{Math.abs(change)}%</span>
            <span className="text-gray-600 text-sm ml-2">vs last month</span>
          </div>
          
          {/* Progress bar */}
          <div className="mt-4 bg-gray-200 rounded-full h-2 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ${
                trend === 'up' ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-gradient-to-r from-red-400 to-pink-500'
              }`}
              style={{ width: `${Math.min(Math.abs(change) * 5, 100)}%` }}
            />
          </div>
        </div>
        <div className={`${bgColor.replace('bg-', 'bg-gradient-to-br from-').replace('-100', '-100 to-').replace('green-100', 'green-100 to-emerald-100').replace('blue-100', 'blue-100 to-indigo-100').replace('purple-100', 'purple-100 to-pink-100').replace('orange-100', 'orange-100 to-yellow-100').replace('indigo-100', 'indigo-100 to-purple-100').replace('red-100', 'red-100 to-pink-100')} p-4 rounded-2xl group-hover:scale-125 transition-transform duration-500 group-hover:rotate-12 shadow-lg`}>
          <Icon className={`w-10 h-10 ${color} group-hover:animate-pulse`} />
        </div>
      </div>
      
      {/* Sparkle effects */}
      <div className="flex justify-center mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        {[...Array(3)].map((_, i) => (
          <SparklesIcon key={i} className="w-4 h-4 text-yellow-400 mx-1" style={{animationDelay: `${i * 200}ms`}} />
        ))}
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="relative">
          <div className="w-32 h-32 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <ChartBarIcon className="w-8 h-8 text-indigo-600" />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <ExclamationCircleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Failed to Load Dashboard</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => fetchDashboardData()}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!dashboardData) {
    return null
  }

  const { stats, recentOrders, recentProperties } = dashboardData

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* SPECTACULAR Header */}
      <div className="relative bg-gradient-to-br from-green-600 via-blue-600 to-purple-600 text-white overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-yellow-400/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center animate-bounce">
                  <SparklesIcon className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h1 className="text-5xl font-extrabold mb-2">
                    🚀 Admin <span className="text-yellow-300">Dashboard</span>
                  </h1>
                  <p className="text-xl text-green-100">✨ Welcome back! Manage your IDGM Universal platform with powerful insights.</p>
                </div>
              </div>
              
              {/* Quick Stats Preview */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mt-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center hover:bg-white/20 transition-all hover:scale-105 animate-pulse">
                  <CurrencyDollarIcon className="w-8 h-8 mx-auto mb-2 text-yellow-300" />
                  <p className="text-2xl font-bold">₦{stats.totalRevenue.toLocaleString()}</p>
                  <p className="text-green-100 text-sm">Revenue</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center hover:bg-white/20 transition-all hover:scale-105" style={{animationDelay: '200ms'}}>
                  <ShoppingBagIcon className="w-8 h-8 mx-auto mb-2 text-blue-300" />
                  <p className="text-2xl font-bold">{stats.totalOrders}</p>
                  <p className="text-green-100 text-sm">Orders</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center hover:bg-white/20 transition-all hover:scale-105" style={{animationDelay: '400ms'}}>
                  <BuildingOfficeIcon className="w-8 h-8 mx-auto mb-2 text-purple-300" />
                  <p className="text-2xl font-bold">{stats.totalProperties}</p>
                  <p className="text-green-100 text-sm">Properties</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center hover:bg-white/20 transition-all hover:scale-105" style={{animationDelay: '600ms'}}>
                  <UsersIcon className="w-8 h-8 mx-auto mb-2 text-pink-300" />
                  <p className="text-2xl font-bold">{stats.activeUsers}</p>
                  <p className="text-green-100 text-sm">Users</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Period Selector */}
              <div className="flex bg-white/20 backdrop-blur-sm rounded-2xl p-1">
                {['24h', '7d', '30d'].map((period) => (
                  <button
                    key={period}
                    onClick={() => setSelectedPeriod(period)}
                    className={`px-4 py-2 text-sm font-bold rounded-xl transition-all ${
                      selectedPeriod === period 
                        ? 'bg-white text-green-600 shadow-lg' 
                        : 'text-white hover:bg-white/20'
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
              
              <button className="bg-white text-green-600 px-8 py-4 rounded-2xl font-bold hover:bg-green-50 transition-all transform hover:scale-105 hover:shadow-2xl flex items-center space-x-2">
                <PlusIcon className="w-5 h-5" />
                <span>🎯 Quick Action</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total Revenue"
            value={`₦${stats.totalRevenue.toLocaleString()}`}
            change={stats.revenueChange}
            icon={CurrencyDollarIcon}
            color="text-green-600"
            bgColor="bg-green-100"
            trend={stats.revenueChange >= 0 ? "up" : "down"}
          />
          <StatCard
            title="Orders"
            value={stats.totalOrders}
            change={stats.ordersChange}
            icon={ShoppingBagIcon}
            color="text-blue-600"
            bgColor="bg-blue-100"
            trend={stats.ordersChange >= 0 ? "up" : "down"}
          />
          <StatCard
            title="Products"
            value={stats.totalProducts}
            change={stats.productsChange}
            icon={SparklesIcon}
            color="text-purple-600"
            bgColor="bg-purple-100"
            trend={stats.productsChange >= 0 ? "up" : "down"}
          />
          <StatCard
            title="Properties"
            value={stats.totalProperties}
            change={stats.propertiesChange}
            icon={BuildingOfficeIcon}
            color="text-orange-600"
            bgColor="bg-orange-100"
            trend={stats.propertiesChange >= 0 ? "up" : "down"}
          />
          <StatCard
            title="Active Users"
            value={stats.activeUsers}
            change={stats.usersChange}
            icon={UsersIcon}
            color="text-indigo-600"
            bgColor="bg-indigo-100"
            trend={stats.usersChange >= 0 ? "up" : "down"}
          />
          <StatCard
            title="Pending Tickets"
            value={stats.pendingTickets}
            change={stats.ticketsChange}
            icon={ExclamationTriangleIcon}
            color="text-red-600"
            bgColor="bg-red-100"
            trend={stats.ticketsChange >= 0 ? "up" : "down"}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Recent Orders */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border overflow-hidden">
            <div className="p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
                <Link href="/admin/orders" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View All
                </Link>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div>
                      <p className="font-semibold text-gray-900">{order.id}</p>
                      <p className="text-sm text-gray-600">{order.customer}</p>
                      <p className="text-xs text-gray-500">{order.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">₦{order.amount.toLocaleString()}</p>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        order.status === 'completed' ? 'bg-green-100 text-green-800' :
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Properties */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border overflow-hidden">
            <div className="p-6 border-b bg-gradient-to-r from-purple-50 to-pink-50">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Recent Properties</h2>
                <Link href="/admin/properties" className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                  View All
                </Link>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentProperties.map((property) => (
                  <div key={property.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div>
                      <p className="font-semibold text-gray-900">{property.title}</p>
                      <p className="text-sm text-gray-600">{property.type}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">
                        ₦{((property as any).rent || (property as any).price).toLocaleString()}
                      </p>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        property.status === 'available' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {property.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* DAZZLING Quick Actions */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border p-8">
          <h2 className="text-3xl font-bold mb-8">
            <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              ⚡ Quick Actions
            </span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <Link href="/admin/products/new" className="group bg-gradient-to-br from-green-400 to-emerald-600 text-white p-8 rounded-3xl hover:from-green-500 hover:to-emerald-700 transition-all transform hover:scale-110 hover:-rotate-3 hover:shadow-2xl">
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl inline-flex mb-4 group-hover:scale-125 transition-transform group-hover:rotate-12">
                <PlusIcon className="w-8 h-8 group-hover:animate-bounce" />
              </div>
              <h3 className="text-xl font-bold mb-2">🛍️ Add Product</h3>
              <p className="text-green-100 mb-4">Create amazing new products</p>
              <div className="flex items-center text-white/80 text-sm">
                <span>Get Started</span>
                <ArrowUpIcon className="w-4 h-4 ml-2 rotate-45 group-hover:translate-x-2 transition-transform" />
              </div>
            </Link>
            
            <Link href="/admin/properties/new" className="group bg-gradient-to-br from-blue-400 to-indigo-600 text-white p-8 rounded-3xl hover:from-blue-500 hover:to-indigo-700 transition-all transform hover:scale-110 hover:rotate-3 hover:shadow-2xl">
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl inline-flex mb-4 group-hover:scale-125 transition-transform group-hover:-rotate-12">
                <BuildingOfficeIcon className="w-8 h-8 group-hover:animate-bounce" />
              </div>
              <h3 className="text-xl font-bold mb-2">🏢 Add Property</h3>
              <p className="text-blue-100 mb-4">List premium properties</p>
              <div className="flex items-center text-white/80 text-sm">
                <span>List Now</span>
                <ArrowUpIcon className="w-4 h-4 ml-2 rotate-45 group-hover:translate-x-2 transition-transform" />
              </div>
            </Link>
            
            <Link href="/admin/orders" className="group bg-gradient-to-br from-purple-400 to-pink-600 text-white p-8 rounded-3xl hover:from-purple-500 hover:to-pink-700 transition-all transform hover:scale-110 hover:-rotate-3 hover:shadow-2xl">
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl inline-flex mb-4 group-hover:scale-125 transition-transform group-hover:rotate-12">
                <EyeIcon className="w-8 h-8 group-hover:animate-bounce" />
              </div>
              <h3 className="text-xl font-bold mb-2">👀 View Orders</h3>
              <p className="text-purple-100 mb-4">Manage all orders efficiently</p>
              <div className="flex items-center text-white/80 text-sm">
                <span>Manage</span>
                <ArrowUpIcon className="w-4 h-4 ml-2 rotate-45 group-hover:translate-x-2 transition-transform" />
              </div>
            </Link>
            
            <Link href="/admin/users" className="group bg-gradient-to-br from-orange-400 to-red-600 text-white p-8 rounded-3xl hover:from-orange-500 hover:to-red-700 transition-all transform hover:scale-110 hover:rotate-3 hover:shadow-2xl">
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl inline-flex mb-4 group-hover:scale-125 transition-transform group-hover:-rotate-12">
                <UsersIcon className="w-8 h-8 group-hover:animate-bounce" />
              </div>
              <h3 className="text-xl font-bold mb-2">📊 User Management</h3>
              <p className="text-orange-100 mb-4">Manage users & permissions</p>
              <div className="flex items-center text-white/80 text-sm">
                <span>Access</span>
                <ArrowUpIcon className="w-4 h-4 ml-2 rotate-45 group-hover:translate-x-2 transition-transform" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
