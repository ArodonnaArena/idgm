/**
 * API Client for communicating with the backend API on Render
 */

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';

interface FetchOptions extends RequestInit {
  token?: string;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: FetchOptions = {}
  ): Promise<T> {
    const { token, ...fetchOptions } = options;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...fetchOptions.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const url = `${this.baseURL}${endpoint}`;

    const response = await fetch(url, {
      ...fetchOptions,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: response.statusText,
      }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Auth endpoints
  async register(data: {
    email: string;
    password: string;
    name: string;
    phone?: string;
  }) {
    return this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(data: { email: string; password: string }) {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Products endpoints
  async getProducts(params?: {
    skip?: number;
    take?: number;
    search?: string;
    categoryId?: string;
  }) {
    const query = new URLSearchParams();
    if (params?.skip) query.set('skip', params.skip.toString());
    if (params?.take) query.set('take', params.take.toString());
    if (params?.search) query.set('search', params.search);
    if (params?.categoryId) query.set('categoryId', params.categoryId);

    return this.request(`/api/products?${query.toString()}`);
  }

  async getProduct(id: string) {
    return this.request(`/api/products/${id}`);
  }

  async getProductBySlug(slug: string) {
    return this.request(`/api/products/slug/${slug}`);
  }

  async createProduct(data: any, token: string) {
    return this.request('/api/products', {
      method: 'POST',
      body: JSON.stringify(data),
      token,
    });
  }

  async updateProduct(id: string, data: any, token: string) {
    return this.request(`/api/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      token,
    });
  }

  async deleteProduct(id: string, token: string) {
    return this.request(`/api/products/${id}`, {
      method: 'DELETE',
      token,
    });
  }

  // Properties endpoints
  async getProperties(q?: string) {
    const query = q ? `?q=${encodeURIComponent(q)}` : '';
    return this.request(`/api/properties${query}`);
  }

  async getProperty(slug: string) {
    return this.request(`/api/properties/${slug}`);
  }

  // Orders endpoints
  async getOrders(params?: {
    skip?: number;
    take?: number;
    status?: string;
    userId?: string;
  }, token?: string) {
    const query = new URLSearchParams();
    if (params?.skip) query.set('skip', params.skip.toString());
    if (params?.take) query.set('take', params.take.toString());
    if (params?.status) query.set('status', params.status);
    if (params?.userId) query.set('userId', params.userId);

    return this.request(`/api/orders?${query.toString()}`, { token });
  }

  async getOrder(id: string, token?: string) {
    return this.request(`/api/orders/${id}`, { token });
  }

  async createOrder(data: any, token: string) {
    return this.request('/api/orders', {
      method: 'POST',
      body: JSON.stringify(data),
      token,
    });
  }

  async updateOrderStatus(id: string, status: string, token: string) {
    return this.request(`/api/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
      token,
    });
  }

  // Categories endpoints
  async getCategories() {
    return this.request('/api/categories');
  }

  async getCategory(id: string) {
    return this.request(`/api/categories/${id}`);
  }

  async createCategory(data: any, token: string) {
    return this.request('/api/categories', {
      method: 'POST',
      body: JSON.stringify(data),
      token,
    });
  }

  // Users endpoints
  async getUsers(token: string) {
    return this.request('/api/users', { token });
  }

  async getUser(id: string, token: string) {
    return this.request(`/api/users/${id}`, { token });
  }

  async updateUser(id: string, data: any, token: string) {
    return this.request(`/api/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      token,
    });
  }

  // Payments endpoints
  async initializePayment(data: any, token: string) {
    return this.request('/api/payments/initialize', {
      method: 'POST',
      body: JSON.stringify(data),
      token,
    });
  }

  async verifyPayment(reference: string, token: string) {
    return this.request(`/api/payments/verify/${reference}`, { token });
  }

  // Cart endpoints (if backend doesn't have these, frontend will handle locally)
  async getCart(token: string) {
    return this.request('/api/cart', { token });
  }

  async addToCart(data: { productId: string; quantity: number }, token: string) {
    return this.request('/api/cart', {
      method: 'POST',
      body: JSON.stringify(data),
      token,
    });
  }

  async updateCartItem(data: { itemId: string; quantity: number }, token: string) {
    return this.request('/api/cart', {
      method: 'PUT',
      body: JSON.stringify(data),
      token,
    });
  }

  async removeFromCart(itemId: string, token: string) {
    return this.request(`/api/cart?itemId=${itemId}`, {
      method: 'DELETE',
      token,
    });
  }

  // Wishlist endpoints
  async getWishlist(token: string) {
    return this.request('/api/wishlist', { token });
  }

  async addToWishlist(productId: string, token: string) {
    return this.request('/api/wishlist', {
      method: 'POST',
      body: JSON.stringify({ productId }),
      token,
    });
  }

  async removeFromWishlist(productId: string, token: string) {
    return this.request(`/api/wishlist?productId=${productId}`, {
      method: 'DELETE',
      token,
    });
  }
}

export const apiClient = new ApiClient(BACKEND_URL);
