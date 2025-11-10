'use client'

import { useState, useEffect } from 'react'
import { 
  ChartBarIcon,
  CurrencyDollarIcon,
  ShoppingBagIcon,
  UsersIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CalendarIcon,
  FunnelIcon
} from '@heroicons/react/24/outline'

interface AnalyticsData {
  type: string
  period: string
  [key: string]: any
}

export default function AdminAnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedType, setSelectedType] = useState('overview')
  const [selectedPeriod, setSelectedPeriod] = useState('30d')

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/admin/analytics?type=${selectedType}&period=${selectedPeriod}`)
      if (!response.ok) {
        throw new Error('Failed to fetch analytics data')
      }
      
      const data = await response.json()
      setAnalyticsData(data)
    } catch (err) {
      console.error('Analytics fetch error:', err)
      setError(err instanceof Error ? err.message : 'Failed to load analytics')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
  }, [selectedType, selectedPeriod])

  const renderOverviewAnalytics = (data: any) => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <CurrencyDollarIcon className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                ₦{data.revenue?.total?.toLocaleString() || 0}
              </p>
              <p className="text-sm text-gray-600">{data.revenue?.transactions || 0} transactions</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <ShoppingBagIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">
                {Object.values(data.orders || {}).reduce((sum: number, order: any) => sum + order.count, 0)}
              </p>
              <p className="text-sm text-gray-600">
                ₦{Object.values(data.orders || {}).reduce((sum: number, order: any) => sum + order.value, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <UsersIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">New Users</p>
              <p className="text-2xl font-bold text-gray-900">
                {data.userGrowth?.reduce((sum: number, day: any) => sum + day.newUsers, 0) || 0}
              </p>
              <p className="text-sm text-gray-600">This period</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-lg">
              <ChartBarIcon className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Top Category</p>
              <p className="text-2xl font-bold text-gray-900">
                {data.topCategories?.[0]?.category || 'N/A'}
              </p>
              <p className="text-sm text-gray-600">
                {data.topCategories?.[0]?.orders || 0} orders
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Order Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Status Breakdown</h3>
          <div className="space-y-3">
            {Object.entries(data.orders || {}).map(([status, orderData]: [string, any]) => (
              <div key={status} className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600 capitalize">{status}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold text-gray-900">{orderData.count}</span>
                  <span className="text-xs text-gray-500">₦{orderData.value.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Categories</h3>
          <div className="space-y-3">
            {(data.topCategories || []).slice(0, 5).map((category: any) => (
              <div key={category.category} className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">{category.category}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold text-gray-900">{category.orders}</span>
                  <span className="text-xs text-gray-500">{category.itemsSold} items</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {(data.recentActivity || []).map((activity: any, index: number) => (
            <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <span className="text-sm font-medium text-gray-900 capitalize">
                  {activity.type} #{activity.id.slice(-8)}
                </span>
                <span className="text-xs text-gray-500 ml-2">
                  {new Date(activity.createdAt).toLocaleDateString()}
                </span>
              </div>
              <span className="text-sm font-bold text-green-600">
                ₦{activity.amount.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderRevenueAnalytics = (data: any) => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Revenue Trend</h3>
        <div className="space-y-2">
          {(data.dailyRevenue || []).slice(-7).map((day: any) => (
            <div key={day.date} className="flex justify-between items-center p-2 border-b">
              <span className="text-sm text-gray-600">{new Date(day.date).toLocaleDateString()}</span>
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium">₦{day.revenue.toLocaleString()}</span>
                <span className="text-xs text-gray-500">{day.transactions} txns</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Category</h3>
          <div className="space-y-3">
            {(data.revenueByCategory || []).slice(0, 5).map((category: any) => (
              <div key={category.category} className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">{category.category}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold text-gray-900">₦{category.revenue.toLocaleString()}</span>
                  <span className="text-xs text-gray-500">{category.orders} orders</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods</h3>
          <div className="space-y-3">
            {(data.paymentMethods || []).map((method: any) => (
              <div key={method.provider} className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600 capitalize">{method.provider}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold text-gray-900">₦{method.amount.toLocaleString()}</span>
                  <span className="text-xs text-gray-500">{method.count} uses</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  const renderProductAnalytics = (data: any) => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Selling Products</h3>
          <div className="space-y-3">
            {(data.topProducts || []).slice(0, 5).map((product: any) => (
              <div key={product.sku} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="text-sm font-medium text-gray-900">{product.name}</div>
                  <div className="text-xs text-gray-500">SKU: {product.sku}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-gray-900">{product.totalSold} sold</div>
                  <div className="text-xs text-green-600">₦{product.revenue.toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Inventory Alerts</h3>
          <div className="space-y-3">
            {(data.inventoryAlerts || []).slice(0, 5).map((alert: any) => (
              <div key={alert.sku} className="flex justify-between items-center p-3 rounded-lg bg-red-50 border-l-4 border-red-500">
                <div>
                  <div className="text-sm font-medium text-gray-900">{alert.name}</div>
                  <div className="text-xs text-gray-500">SKU: {alert.sku}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-red-600">{alert.quantity} left</div>
                  <div className="text-xs text-gray-500">Min: {alert.threshold}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Performance</h3>
        <div className="space-y-3">
          {(data.categoryPerformance || []).map((category: any) => (
            <div key={category.category} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-600">{category.category}</span>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-900">{category.activeProducts}/{category.totalProducts}</span>
                <span className="text-sm font-bold text-green-600">₦{category.avgPrice.toLocaleString()} avg</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-6 w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-1">Business insights and performance metrics</p>
        </div>
        
        {/* Filters */}
        <div className="flex items-center space-x-4">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="overview">Overview</option>
            <option value="revenue">Revenue</option>
            <option value="products">Products</option>
            <option value="properties">Properties</option>
          </select>
          
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
        </div>
      </div>

      {/* Analytics Content */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {analyticsData && (
        <>
          {selectedType === 'overview' && renderOverviewAnalytics(analyticsData)}
          {selectedType === 'revenue' && renderRevenueAnalytics(analyticsData)}
          {selectedType === 'products' && renderProductAnalytics(analyticsData)}
          {selectedType === 'properties' && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg">
              Property analytics coming soon...
            </div>
          )}
        </>
      )}
    </div>
  )
}