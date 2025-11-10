'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { PlusIcon, PencilIcon, TrashIcon, FireIcon, ClockIcon } from '@heroicons/react/24/outline'

interface FlashSale {
  id: string
  name: string
  description: string | null
  discountPercent: number
  flashPrice: number
  startTime: string
  endTime: string
  maxQuantity: number | null
  soldCount: number
  isActive: boolean
  product: {
    id: string
    name: string
    price: number
    images: Array<{ url: string; alt?: string }>
    category: { name: string }
  }
}

export default function FlashSalesAdmin() {
  const [flashSales, setFlashSales] = useState<FlashSale[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'active'>('all')

  useEffect(() => {
    fetchFlashSales()
  }, [filter])

  const fetchFlashSales = async () => {
    try {
      setLoading(true)
      const url = filter === 'active' 
        ? '/api/admin/flash-sales?active=true'
        : '/api/admin/flash-sales'
      const response = await fetch(url)
      const data = await response.json()
      setFlashSales(data)
    } catch (error) {
      console.error('Failed to fetch flash sales:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteFlashSale = async (id: string) => {
    if (!confirm('Are you sure you want to delete this flash sale?')) return

    try {
      const response = await fetch(`/api/admin/flash-sales/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setFlashSales(flashSales.filter(sale => sale.id !== id))
      }
    } catch (error) {
      console.error('Failed to delete flash sale:', error)
      alert('Failed to delete flash sale')
    }
  }

  const toggleActive = async (id: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/flash-sales/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive })
      })

      if (response.ok) {
        fetchFlashSales()
      }
    } catch (error) {
      console.error('Failed to toggle flash sale:', error)
    }
  }

  const getStatus = (sale: FlashSale) => {
    const now = new Date()
    const start = new Date(sale.startTime)
    const end = new Date(sale.endTime)

    if (!sale.isActive) return { label: 'Inactive', color: 'gray' }
    if (now < start) return { label: 'Scheduled', color: 'blue' }
    if (now > end) return { label: 'Expired', color: 'red' }
    return { label: 'Active', color: 'green' }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <FireIcon className="w-10 h-10 text-orange-500" />
              <div>
                <h1 className="text-3xl font-black text-gray-800">Flash Sales Management</h1>
                <p className="text-gray-600">Create and manage limited-time offers</p>
              </div>
            </div>
            <Link
              href="/admin/flash-sales/new"
              className="bg-orange-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-orange-600 transition flex items-center gap-2"
            >
              <PlusIcon className="w-5 h-5" />
              Create Flash Sale
            </Link>
          </div>

          {/* Filters */}
          <div className="flex gap-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filter === 'all'
                  ? 'bg-orange-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              All Sales
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filter === 'active'
                  ? 'bg-orange-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Active Only
            </button>
          </div>
        </div>

        {/* Flash Sales List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            <p className="mt-4 text-gray-600">Loading flash sales...</p>
          </div>
        ) : flashSales.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <FireIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">No Flash Sales Yet</h3>
            <p className="text-gray-600 mb-6">Create your first flash sale to boost sales!</p>
            <Link
              href="/admin/flash-sales/new"
              className="inline-block bg-orange-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-orange-600 transition"
            >
              Create Flash Sale
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {flashSales.map((sale) => {
              const status = getStatus(sale)
              return (
                <div key={sale.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                  {/* Product Image */}
                  <div className="relative h-48 bg-gray-100">
                    {sale.product.images[0] ? (
                      <img
                        src={sale.product.images[0].url}
                        alt={sale.product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        No Image
                      </div>
                    )}
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                      -{sale.discountPercent}% OFF
                    </div>
                    <div className={`absolute top-2 left-2 px-3 py-1 rounded-full text-xs font-bold text-white ${
                      status.color === 'green' ? 'bg-green-500' :
                      status.color === 'blue' ? 'bg-blue-500' :
                      status.color === 'red' ? 'bg-red-500' : 'bg-gray-500'
                    }`}>
                      {status.label}
                    </div>
                  </div>

                  {/* Sale Info */}
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-2">{sale.name}</h3>
                    <p className="text-sm text-gray-600 mb-4">{sale.product.name}</p>

                    {/* Pricing */}
                    <div className="mb-4">
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black text-orange-500">
                          ₦{sale.flashPrice.toLocaleString()}
                        </span>
                        <span className="text-sm text-gray-500 line-through">
                          ₦{sale.product.price.toLocaleString()}
                        </span>
                      </div>
                      <div className="text-xs text-green-600 font-semibold">
                        Save ₦{(sale.product.price - sale.flashPrice).toLocaleString()}
                      </div>
                    </div>

                    {/* Time */}
                    <div className="mb-4 text-xs text-gray-600 space-y-1">
                      <div className="flex items-center gap-2">
                        <ClockIcon className="w-4 h-4" />
                        <span>Start: {new Date(sale.startTime).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ClockIcon className="w-4 h-4" />
                        <span>End: {new Date(sale.endTime).toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Progress */}
                    {sale.maxQuantity && (
                      <div className="mb-4">
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>Sold: {sale.soldCount}/{sale.maxQuantity}</span>
                          <span>{Math.round((sale.soldCount / sale.maxQuantity) * 100)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-orange-500 h-2 rounded-full"
                            style={{ width: `${Math.min((sale.soldCount / sale.maxQuantity) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleActive(sale.id, sale.isActive)}
                        className={`flex-1 py-2 rounded-lg font-semibold transition ${
                          sale.isActive
                            ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            : 'bg-green-500 text-white hover:bg-green-600'
                        }`}
                      >
                        {sale.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <Link
                        href={`/admin/flash-sales/edit/${sale.id}`}
                        className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                      >
                        <PencilIcon className="w-5 h-5" />
                      </Link>
                      <button
                        onClick={() => deleteFlashSale(sale.id)}
                        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
