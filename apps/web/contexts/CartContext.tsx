'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  quantity: number
  image?: string
  slug?: string
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void
  /** Remove an item from the cart by its cart item ID (not productId) and sync backend */
  removeItem: (itemId: string) => Promise<void>
  /** Update quantity for a cart item ID and sync backend */
  updateQuantity: (itemId: string, quantity: number) => Promise<void>
  clearCart: () => void
  /** Re-sync cart from backend /api/cart for the logged-in user */
  syncFromBackend: () => Promise<void>
  /** Subtotal of items only (no delivery) */
  total: number
  itemCount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [pendingItemId, setPendingItemId] = useState<string | null>(null)

  const syncFromBackend = async () => {
    try {
      const res = await fetch('/api/cart', { credentials: 'include' })
      if (!res.ok) return
      const cart: any = await res.json()
      if (!cart || !Array.isArray(cart.items)) return

      const mapped: CartItem[] = cart.items.map((ci: any) => ({
        id: ci.id,
        productId: ci.productId,
        name: ci.product?.name ?? 'Product',
        price: ci.price,
        quantity: ci.quantity,
        image: ci.product?.images?.[0]?.url,
        slug: ci.product?.slug,
      }))
      setItems(mapped)
    } catch (error) {
      console.error('Error syncing cart from backend:', error)
    }
  }

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cart')
      if (savedCart) {
        setItems(JSON.parse(savedCart))
      }
    } catch (error) {
      console.error('Error loading cart:', error)
    }
    setIsLoaded(true)
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('cart', JSON.stringify(items))
    }
  }, [items, isLoaded])

  const addItem = (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.productId === item.productId)
      
      if (existingItem) {
        // Update quantity if item already exists
        return prevItems.map((i) =>
          i.productId === item.productId
            ? { ...i, quantity: i.quantity + (item.quantity || 1) }
            : i
        )
      } else {
        // Add new item
        return [...prevItems, { ...item, quantity: item.quantity || 1 }]
      }
    })
  }

  const removeItem = async (itemId: string) => {
    setPendingItemId(itemId)
    try {
      await fetch(`/api/cart?itemId=${encodeURIComponent(itemId)}`, {
        method: 'DELETE',
        credentials: 'include',
      })
    } catch (error) {
      console.error('Error removing cart item:', error)
    } finally {
      await syncFromBackend()
      setPendingItemId(null)
    }
  }

  const updateQuantity = async (itemId: string, quantity: number) => {
    setPendingItemId(itemId)
    if (quantity <= 0) {
      await removeItem(itemId)
      return
    }

    try {
      await fetch('/api/cart', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ itemId, quantity }),
      })
    } catch (error) {
      console.error('Error updating cart quantity:', error)
    } finally {
      await syncFromBackend()
      setPendingItemId(null)
    }
  }

  const clearCart = () => {
    setItems([])
  }

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        syncFromBackend,
        total,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
