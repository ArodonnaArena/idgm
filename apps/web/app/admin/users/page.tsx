'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  MagnifyingGlassIcon,
  UserIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  PencilIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  TicketIcon,
  UserGroupIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline'

interface UserProfile {
  nin?: string
  phoneAlt?: string
  company?: string
  roleNote?: string
}

interface User {
  id: string
  email: string
  phone?: string
  name?: string
  image?: string
  status: string
  roles: string[]
  roleDescriptions: string[]
  tenantProfile?: UserProfile
  landlordProfile?: UserProfile
  staffProfile?: UserProfile
  totalSpent: number
  activeTickets: number
  lastOrderDate?: string
  profileType: string
  _count: {
    orders: number
    tickets: number
    carts: number
  }
  createdAt: string
  updatedAt: string
}

interface UsersResponse {
  users: User[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
  filters: {
    statusCounts: Record<string, number>
    roles: Array<{
      name: string
      count: number
    }>
  }
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [filterOptions, setFilterOptions] = useState<{
    statusCounts: Record<string, number>
    roles: Array<{ name: string; count: number }>
  }>({ statusCounts: {}, roles: [] })
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updatingUser, setUpdatingUser] = useState<string | null>(null)
  
  // Filters
  const [search, setSearch] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [selectedRole, setSelectedRole] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('desc')

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(search && { search }),
        ...(selectedStatus && { status: selectedStatus }),
        ...(selectedRole && { role: selectedRole }),
        ...(dateFrom && { dateFrom }),
        ...(dateTo && { dateTo }),
        sortBy,
        sortOrder
      })

      const response = await fetch(`/api/admin/users?${params}`)
      if (!response.ok) {
        throw new Error('Failed to fetch users')
      }
      
      const data: UsersResponse = await response.json()
      setUsers(data.users)
      setPagination(data.pagination)
      setFilterOptions(data.filters)
    } catch (err) {
      console.error('Users fetch error:', err)
      setError(err instanceof Error ? err.message : 'Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  const updateUserStatus = async (userId: string, newStatus: string) => {
    try {
      setUpdatingUser(userId)
      
      const response = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          status: newStatus
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update user status')
      }

      // Refresh users list
      await fetchUsers()
    } catch (err) {
      console.error('Update user error:', err)
      setError(err instanceof Error ? err.message : 'Failed to update user')
    } finally {
      setUpdatingUser(null)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [pagination.page, search, selectedStatus, selectedRole, dateFrom, dateTo, sortBy, sortOrder])

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }))
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircleIcon },
      inactive: { bg: 'bg-gray-100', text: 'text-gray-800', icon: XCircleIcon },
      suspended: { bg: 'bg-red-100', text: 'text-red-800', icon: ExclamationTriangleIcon }
    }

    const config = statusConfig[status.toLowerCase() as keyof typeof statusConfig]
    if (!config) return null

    const Icon = config.icon

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status}
      </span>
    )
  }

  const getProfileTypeIcon = (profileType: string) => {
    switch (profileType) {
      case 'Tenant':
        return UserIcon
      case 'Landlord':
        return BuildingOfficeIcon
      case 'Staff':
        return ShieldCheckIcon
      default:
        return UserIcon
    }
  }

  const getProfileTypeBadge = (profileType: string) => {
    const colors = {
      Tenant: 'bg-blue-100 text-blue-800',
      Landlord: 'bg-purple-100 text-purple-800',
      Staff: 'bg-green-100 text-green-800',
      Customer: 'bg-gray-100 text-gray-800'
    }
    
    const Icon = getProfileTypeIcon(profileType)
    const color = colors[profileType as keyof typeof colors] || 'bg-gray-100 text-gray-800'

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {profileType}
      </span>
    )
  }

  const getStatusActions = (user: User) => {
    const currentStatus = user.status.toLowerCase()
    const actions = []

    if (currentStatus === 'active') {
      actions.push(
        <button
          key="suspend"
          onClick={() => updateUserStatus(user.id, 'SUSPENDED')}
          disabled={updatingUser === user.id}
          className="text-red-600 hover:text-red-900 text-xs font-medium disabled:opacity-50"
        >
          Suspend
        </button>
      )
      actions.push(
        <button
          key="deactivate"
          onClick={() => updateUserStatus(user.id, 'INACTIVE')}
          disabled={updatingUser === user.id}
          className="text-gray-600 hover:text-gray-900 text-xs font-medium disabled:opacity-50"
        >
          Deactivate
        </button>
      )
    }

    if (currentStatus === 'suspended' || currentStatus === 'inactive') {
      actions.push(
        <button
          key="activate"
          onClick={() => updateUserStatus(user.id, 'ACTIVE')}
          disabled={updatingUser === user.id}
          className="text-green-600 hover:text-green-900 text-xs font-medium disabled:opacity-50"
        >
          Activate
        </button>
      )
    }

    return actions
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4 w-1/4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
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
          <h1 className="text-3xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-600 mt-1">Manage user accounts and permissions</p>
        </div>
        
        {/* Status Summary */}
        <div className="flex items-center space-x-6">
          {Object.entries(filterOptions.statusCounts).map(([status, count]) => (
            <div key={status} className="text-center">
              <div className="text-2xl font-bold text-gray-900">{count}</div>
              <div className="text-xs text-gray-500 capitalize">{status}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Role Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {filterOptions.roles.slice(0, 4).map(({ name, count }) => (
          <div key={name} className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <UserGroupIcon className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">{name}</p>
                <p className="text-lg font-bold text-gray-900">{count}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>
          
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All Roles</option>
            {filterOptions.roles.map(role => (
              <option key={role.name} value={role.name}>{role.name}</option>
            ))}
          </select>
          
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          
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
            <option value="name-asc">Name A-Z</option>
            <option value="name-desc">Name Z-A</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Profile Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Roles
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Activity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                        {user.image ? (
                          <Image
                            src={user.image}
                            alt={user.name || user.email}
                            width={48}
                            height={48}
                            className="h-12 w-12 rounded-full object-cover"
                          />
                        ) : (
                          <UserIcon className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.name || 'Unnamed User'}
                        </div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                        {user.phone && (
                          <div className="text-xs text-gray-400">{user.phone}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getProfileTypeBadge(user.profileType)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      {user.roles.map(role => (
                        <span key={role} className="inline-block px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 rounded-full mr-1">
                          {role}
                        </span>
                      ))}
                      {user.roles.length === 0 && (
                        <span className="text-xs text-gray-500">No roles assigned</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm space-y-1">
                      <div className="flex items-center text-gray-600">
                        <CurrencyDollarIcon className="w-4 h-4 mr-1" />
                        ₦{user.totalSpent.toLocaleString()}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <span className="text-xs">{user._count.orders} orders</span>
                        {user.activeTickets > 0 && (
                          <span className="ml-2 text-xs text-red-600">
                            {user.activeTickets} tickets
                          </span>
                        )}
                      </div>
                      {user.lastOrderDate && (
                        <div className="text-xs text-gray-500 flex items-center">
                          <CalendarIcon className="w-3 h-3 mr-1" />
                          {new Date(user.lastOrderDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(user.status)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col space-y-1">
                      <Link
                        href={`/admin/users/${user.id}`}
                        className="text-indigo-600 hover:text-indigo-900 text-xs font-medium"
                      >
                        View Details
                      </Link>
                      {getStatusActions(user)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="bg-white px-4 py-3 border-t border-gray-200">
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
      </div>

      {error && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg">
          {error}
        </div>
      )}
    </div>
  )
}