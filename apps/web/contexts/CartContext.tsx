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
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  /** Re-sync cart from backend /api/cart for the logged-in user */
  syncFromBackend: () => Promise<void>
  total: number
  itemCount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

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

  const removeItem = (productId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.productId !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId)
      return
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      )
    )
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
