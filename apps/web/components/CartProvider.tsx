'use client'

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useSession } from 'next-auth/react'
import { apiUrl } from '../lib/api'

export type CartItem = {
  id: string
  productId: number
  quantity: number
  price: number
  product?: {
    id: number
    name: string
    slug: string
    images?: { url: string; alt?: string }[]
  }
}

export type Cart = {
  id: string
  items: CartItem[]
}

interface CartContextValue {
  cart: Cart | null
  count: number
  subtotal: number
  loading: boolean
  refresh: () => Promise<void>
  addToCart: (productId: number, quantity?: number) => Promise<boolean>
  removeItem: (itemId: string) => Promise<boolean>
  updateQuantity: (itemId: string, quantity: number) => Promise<boolean>
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState(false)

  const computeSubtotal = useCallback((c: Cart | null) => {
    if (!c) return 0
    return c.items.reduce((sum, it) => sum + (Number(it.price) * Number(it.quantity)), 0)
  }, [])

  const refresh = useCallback(async () => {
    if (status !== 'authenticated') {
      setCart(null)
      return
    }
    setLoading(true)
    try {
const res = await fetch(apiUrl('/api/cart'), { cache: 'no-store' })
      if (res.ok) {
        const data = await res.json()
        setCart({ id: data.id, items: data.items || [] })
      }
    } finally {
      setLoading(false)
    }
  }, [status])

  const addToCart = useCallback(async (productId: number, quantity = 1) => {
    if (status !== 'authenticated') return false
    const res = await fetch(apiUrl('/api/cart'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, quantity })
    })
    if (res.ok) {
      await refresh()
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('cart:updated'))
      }
      return true
    }
    return false
  }, [refresh, status])

  const removeItem = useCallback(async (itemId: string) => {
    if (status !== 'authenticated') return false
const res = await fetch(apiUrl(`/api/cart?itemId=${itemId}`), { method: 'DELETE' })
    if (res.ok) {
      await refresh()
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('cart:updated'))
      }
      return true
    }
    return false
  }, [refresh, status])

  const updateQuantity = useCallback(async (itemId: string, quantity: number) => {
    if (status !== 'authenticated') return false
    const res = await fetch(apiUrl('/api/cart'), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ itemId, quantity })
    })
    if (res.ok) {
      await refresh()
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('cart:updated'))
      }
      return true
    }
    return false
  }, [refresh, status])

  // initial load and event listeners
  useEffect(() => {
    refresh()
  }, [refresh])

  useEffect(() => {
    const onUpdated = () => refresh()
    window.addEventListener('cart:updated', onUpdated)
    return () => window.removeEventListener('cart:updated', onUpdated)
  }, [refresh])

  const value = useMemo<CartContextValue>(() => ({
    cart,
    count: cart?.items?.reduce((n, it) => n + Number(it.quantity), 0) || 0,
    subtotal: computeSubtotal(cart),
    loading,
    refresh,
    addToCart,
    removeItem,
    updateQuantity,
  }), [cart, computeSubtotal, loading, refresh, addToCart, removeItem, updateQuantity])

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}