'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface WishlistItem {
  productId: string
  name: string
  price: number
  image?: string
  slug?: string
  addedAt: string
}

interface WishlistContextType {
  items: WishlistItem[]
  addItem: (item: Omit<WishlistItem, 'addedAt'>) => void
  removeItem: (productId: string) => void
  isInWishlist: (productId: string) => boolean
  clearWishlist: () => void
  itemCount: number
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load wishlist from localStorage on mount
  useEffect(() => {
    try {
      const savedWishlist = localStorage.getItem('wishlist')
      if (savedWishlist) {
        setItems(JSON.parse(savedWishlist))
      }
    } catch (error) {
      console.error('Error loading wishlist:', error)
    }
    setIsLoaded(true)
  }, [])

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('wishlist', JSON.stringify(items))
    }
  }, [items, isLoaded])

  const addItem = (item: Omit<WishlistItem, 'addedAt'>) => {
    setItems((prevItems) => {
      // Don't add if already in wishlist
      if (prevItems.some((i) => i.productId === item.productId)) {
        return prevItems
      }
      
      return [...prevItems, { ...item, addedAt: new Date().toISOString() }]
    })
  }

  const removeItem = (productId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.productId !== productId))
  }

  const isInWishlist = (productId: string) => {
    return items.some((item) => item.productId === productId)
  }

  const clearWishlist = () => {
    setItems([])
  }

  const itemCount = items.length

  return (
    <WishlistContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        isInWishlist,
        clearWishlist,
        itemCount,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}
