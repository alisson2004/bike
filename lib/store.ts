'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Product, CartItem } from './types'

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  
  // Actions
  addItem: (product: Product, quantity?: number, price?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
  openCart: () => void
  closeCart: () => void
  
  // Computed
  getItemCount: () => number
  getSubtotal: () => number
  getGst: () => number
  getTotal: () => number
  qualifiesForFreeShipping: () => boolean
}

const GST_RATE = 0.10
const FREE_SHIPPING_THRESHOLD = 500

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product, quantity = 1, price) => {
        set((state) => {
          const existingItem = state.items.find(item => item.productId === product.id)
          const itemPrice = price ?? product.priceRetail
          
          if (existingItem) {
            return {
              items: state.items.map(item =>
                item.productId === product.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            }
          }
          
          const newItem: CartItem = {
            id: `cart-${product.id}-${Date.now()}`,
            cartId: 'local',
            productId: product.id,
            quantity,
            priceSnap: itemPrice,
            product,
          }
          
          return { items: [...state.items, newItem] }
        })
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter(item => item.productId !== productId),
        }))
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }
        
        set((state) => ({
          items: state.items.map(item =>
            item.productId === productId
              ? { ...item, quantity }
              : item
          ),
        }))
      },

      clearCart: () => set({ items: [] }),
      
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0)
      },

      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + (item.priceSnap * item.quantity), 0)
      },

      getGst: () => {
        const subtotal = get().getSubtotal()
        return subtotal * GST_RATE
      },

      getTotal: () => {
        const subtotal = get().getSubtotal()
        const gst = get().getGst()
        const shipping = get().qualifiesForFreeShipping() ? 0 : 29
        return subtotal + gst + shipping
      },

      qualifiesForFreeShipping: () => {
        return get().getSubtotal() >= FREE_SHIPPING_THRESHOLD
      },
    }),
    {
      name: 'voltride-cart',
      partialize: (state) => ({ items: state.items }),
    }
  )
)

// Auth store for client-side state
interface AuthStore {
  user: {
    id: string
    email: string
    firstName: string
    lastName: string
    role: 'CUSTOMER' | 'WHOLESALE' | 'ADMIN'
    b2bAccount?: {
      discountRate: number
      businessName: string
    }
  } | null
  isLoading: boolean
  setUser: (user: AuthStore['user']) => void
  clearUser: () => void
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoading: true,
  setUser: (user) => set({ user, isLoading: false }),
  clearUser: () => set({ user: null, isLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),
}))
