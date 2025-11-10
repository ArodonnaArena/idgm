// Enhanced API client with full CRUD methods
export const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'

class ApiError extends Error {
  constructor(public status: number, public statusText: string, public data?: any) {
    super(`API Error ${status}: ${statusText}`)
    this.name = 'ApiError'
  }
}

let authToken: string | null = null
export function setAuthToken(token: string | null) {
  authToken = token
}
export function getAuthToken() {
  return authToken
}

function qs(params?: Record<string, any>) {
  const usp = new URLSearchParams()
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v === undefined || v === null || v === '') continue
      usp.append(k, String(v))
    }
  }
  const s = usp.toString()
  return s ? `?${s}` : ''
}

async function refreshTokenFromSession(): Promise<boolean> {
  if (typeof window === 'undefined') return false
  try {
    const res = await fetch('/api/auth/session', { cache: 'no-store' })
    if (!res.ok) return false
    const data = await res.json()
    const token = (data as any)?.accessToken || null
    if (token) {
      setAuthToken(token)
      return true
    }
  } catch {}
  return false
}

async function apiRequest<T>(path: string, options: RequestInit = {}, _retried = false): Promise<T> {
  const url = `${API_BASE}${path}`
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as any),
  }
  // Attach bearer token if available
  if (authToken) headers['Authorization'] = `Bearer ${authToken}`

  const res = await fetch(url, {
    cache: 'no-store',
    ...options,
    headers,
  })

  if (!res.ok) {
    // If unauthorized and we haven't tried refreshing from NextAuth session, do it once
    if (res.status === 401 && !_retried) {
      const ok = await refreshTokenFromSession()
      if (ok) {
        return apiRequest<T>(path, options, true)
      }
    }
    const data = await res.json().catch(() => null)
    throw new ApiError(res.status, res.statusText, data)
  }

  return res.json()
}

export async function apiGet<T>(path: string): Promise<T> {
  return apiRequest<T>(path, { method: 'GET' })
}

export async function apiPost<T>(path: string, body?: any): Promise<T> {
  return apiRequest<T>(path, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export async function apiPut<T>(path: string, body?: any): Promise<T> {
  return apiRequest<T>(path, {
    method: 'PUT',
    body: JSON.stringify(body),
  })
}

export async function apiDelete<T>(path: string): Promise<T> {
  return apiRequest<T>(path, { method: 'DELETE' })
}

// Typed API client functions
export const api = {
  // Auth
  auth: {
    register: (data: { email: string; password: string; name?: string; phone?: string }) =>
      apiPost('/auth/register', data),
    login: (data: { email: string; password: string }) => apiPost('/auth/login', data),
  },

  // Users
  users: {
    list: (params?: { skip?: number; take?: number; search?: string }) =>
      apiGet(`/users${qs(params as any)}`),
    get: (id: string) => apiGet(`/users/${id}`),
    create: (data: any) => apiPost('/users', data),
    update: (id: string, data: any) => apiPut(`/users/${id}`, data),
    delete: (id: string) => apiDelete(`/users/${id}`),
    assignRoles: (id: string, roleIds: string[]) => apiPost(`/users/${id}/roles`, { roleIds }),
  },

  // Products
  products: {
    list: (params?: { skip?: number; take?: number; search?: string; categoryId?: string }) =>
      apiGet(`/products${qs(params as any)}`),
    get: (id: string) => apiGet(`/products/${id}`),
    getBySlug: (slug: string) => apiGet(`/products/slug/${slug}`),
    create: (data: any) => apiPost('/products', data),
    update: (id: string, data: any) => apiPut(`/products/${id}`, data),
    delete: (id: string) => apiDelete(`/products/${id}`),
    updateInventory: (id: string, quantity: number) =>
      apiPost(`/products/${id}/inventory`, { quantity }),
  },

  // Categories
  categories: {
    list: () => apiGet('/categories'),
    get: (id: string) => apiGet(`/categories/${id}`),
    create: (data: any) => apiPost('/categories', data),
    update: (id: string, data: any) => apiPut(`/categories/${id}`, data),
    delete: (id: string) => apiDelete(`/categories/${id}`),
  },

  // Orders
  orders: {
    list: (params?: { skip?: number; take?: number; status?: string; userId?: string }) =>
      apiGet(`/orders${qs(params as any)}`),
    get: (id: string) => apiGet(`/orders/${id}`),
    create: (data: any) => apiPost('/orders', data),
    updateStatus: (id: string, status: string) => apiPut(`/orders/${id}/status`, { status }),
  },
}

export { ApiError }
