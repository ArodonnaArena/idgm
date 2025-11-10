'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  PlusIcon,
  MagnifyingGlassIcon,
  BuildingOfficeIcon,
  HomeIcon,
  MapPinIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  UsersIcon,
  CheckCircleIcon,
  XMarkIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline'

interface PropertyUnit {
  id: string
  label: string
  bedrooms?: number
  bathrooms?: number
  sizeSqm?: number
  status: string
  rent?: number
  isOccupied: boolean
}

interface PropertyLandlord {
  company?: string
  user: {
    name?: string
    email: string
    phone?: string
  }
}

interface Property {
  id: string
  title: string
  slug: string
  description?: string
  type: string
  address: string
  city: string
  state: string
  country: string
  price?: number
  images: Array<{
    url: string
    alt?: string
  }>
  units: PropertyUnit[]
  landlord?: PropertyLandlord
  totalUnits: number
  occupiedUnits: number
  availableUnits: number
  totalRevenue: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface PropertiesResponse {
  properties: Property[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
  filters: {
    cities: string[]
    types: Array<{
      type: string
      count: number
    }>
  }
}

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [filterOptions, setFilterOptions] = useState<{
    cities: string[]
    types: Array<{ type: string; count: number }>
  }>({ cities: [], types: [] })
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Filters
  const [search, setSearch] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('desc')

  const fetchProperties = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(search && { search }),
        ...(selectedType && { type: selectedType }),
        ...(selectedStatus && { status: selectedStatus }),
        ...(selectedCity && { city: selectedCity }),
        sortBy,
        sortOrder
      })

      const response = await fetch(`/api/admin/properties?${params}`)
      if (!response.ok) {
        throw new Error('Failed to fetch properties')
      }
      
      const data: PropertiesResponse = await response.json()
      setProperties(data.properties)
      setPagination(data.pagination)
      setFilterOptions(data.filters)
    } catch (err) {
      console.error('Properties fetch error:', err)
      setError(err instanceof Error ? err.message : 'Failed to load properties')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProperties()
  }, [pagination.page, search, selectedType, selectedStatus, selectedCity, sortBy, sortOrder])

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }))
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'RESIDENTIAL':
        return HomeIcon
      case 'COMMERCIAL':
        return BuildingOfficeIcon
      case 'LAND':
        return MapPinIcon
      default:
        return BuildingOfficeIcon
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'RESIDENTIAL':
        return 'bg-green-100 text-green-800'
      case 'COMMERCIAL':
        return 'bg-blue-100 text-blue-800'
      case 'LAND':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getOccupancyBadge = (property: Property) => {
    const occupancyRate = property.totalUnits > 0 ? (property.occupiedUnits / property.totalUnits) * 100 : 0
    
    if (occupancyRate === 100) {
      return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">Fully Occupied</span>
    } else if (occupancyRate >= 80) {
      return <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">High Occupancy</span>
    } else if (occupancyRate >= 50) {
      return <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">Moderate Occupancy</span>
    } else if (occupancyRate > 0) {
      return <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">Low Occupancy</span>
    } else {
      return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Vacant</span>
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4 w-1/4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
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
          <h1 className="text-3xl font-bold text-gray-900">Properties</h1>
          <p className="text-gray-600 mt-1">Manage your real estate portfolio</p>
        </div>
        <Link
          href="/admin/properties/new"
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Add Property</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {filterOptions.types.map(({ type, count }) => {
          const Icon = getTypeIcon(type)
          return (
            <div key={type} className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${getTypeColor(type).replace('text-', 'bg-').replace('800', '100')}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">{type}</p>
                  <p className="text-2xl font-bold text-gray-900">{count}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search properties..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All Types</option>
            <option value="RESIDENTIAL">Residential</option>
            <option value="COMMERCIAL">Commercial</option>
            <option value="LAND">Land</option>
          </select>
          
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All Cities</option>
            {filterOptions.cities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
          
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [newSortBy, newSortOrder] = e.target.value.split('-')
              setSortBy(newSortBy)
              setSortOrder(newSortOrder)
            }}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="createdAt-desc">Newest First</option>
            <option value="createdAt-asc">Oldest First</option>
            <option value="title-asc">Name A-Z</option>
            <option value="title-desc">Name Z-A</option>
            <option value="price-desc">Highest Price</option>
            <option value="price-asc">Lowest Price</option>
          </select>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
        {properties.map((property) => {
          const TypeIcon = getTypeIcon(property.type)
          return (
            <div key={property.id} className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
              {/* Property Image */}
              <div className="relative h-48 bg-gray-100">
                {property.images[0] ? (
                  <Image
                    src={property.images[0].url}
                    alt={property.images[0].alt || property.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <TypeIcon className="w-16 h-16 text-gray-400" />
                  </div>
                )}
                
                {/* Type Badge */}
                <div className={`absolute top-3 left-3 px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(property.type)}`}>
                  {property.type}
                </div>
                
                {/* Status Badge */}
                <div className="absolute top-3 right-3">
                  {property.isActive ? (
                    <CheckCircleIcon className="w-6 h-6 text-green-600 bg-white rounded-full" />
                  ) : (
                    <XMarkIcon className="w-6 h-6 text-red-600 bg-white rounded-full" />
                  )}
                </div>
              </div>

              {/* Property Details */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{property.title}</h3>
                    <p className="text-sm text-gray-600 flex items-center">
                      <MapPinIcon className="w-4 h-4 mr-1" />
                      {property.address}, {property.city}
                    </p>
                  </div>
                </div>

                {/* Property Stats */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">{property.totalUnits}</div>
                    <div className="text-xs text-gray-500">Total Units</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">{property.availableUnits}</div>
                    <div className="text-xs text-gray-500">Available</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">{property.occupiedUnits}</div>
                    <div className="text-xs text-gray-500">Occupied</div>
                  </div>
                </div>

                {/* Revenue & Occupancy */}
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <div className="flex items-center text-sm">
                      <CurrencyDollarIcon className="w-4 h-4 mr-1 text-gray-400" />
                      <span className="font-medium text-gray-900">
                        ₦{property.totalRevenue.toLocaleString()}/mo
                      </span>
                    </div>
                    {property.price && (
                      <div className="text-xs text-gray-500">
                        Sale: ₦{property.price.toLocaleString()}
                      </div>
                    )}
                  </div>
                  {getOccupancyBadge(property)}
                </div>

                {/* Landlord Info */}
                {property.landlord && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm">
                      <div className="font-medium text-gray-900">
                        {property.landlord.company || property.landlord.user.name || 'Landlord'}
                      </div>
                      <div className="text-xs text-gray-500">{property.landlord.user.email}</div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Link
                      href={`/admin/properties/${property.slug}`}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <EyeIcon className="w-5 h-5" />
                    </Link>
                    <Link
                      href={`/admin/properties/${property.slug}/edit`}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </Link>
                    <button className="text-red-600 hover:text-red-900">
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    {new Date(property.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              {[...Array(Math.min(5, pagination.pages))].map((_, i) => {
                const page = i + 1
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 text-sm border rounded-md ${
                      page === pagination.page
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                )
              })}
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg">
          {error}
        </div>
      )}
    </div>
  )
}