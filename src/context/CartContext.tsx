import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { MenuItem } from '../data/menu'

export type CartLine = {
  item: MenuItem
  quantity: number
}

type CartContextValue = {
  lines: CartLine[]
  addItem: (item: MenuItem) => void
  removeItem: (itemId: string) => void
  decrementItem: (itemId: string) => void
  clearCart: () => void
  totalCount: number
  subtotal: number
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([])

  const addItem = (item: MenuItem) => {
    setLines((prev) => {
      const existing = prev.find((line) => line.item.id === item.id)
      if (existing) {
        return prev.map((line) =>
          line.item.id === item.id ? { ...line, quantity: line.quantity + 1 } : line,
        )
      }
      return [...prev, { item, quantity: 1 }]
    })
  }

  const decrementItem = (itemId: string) => {
    setLines((prev) =>
      prev
        .map((line) =>
          line.item.id === itemId ? { ...line, quantity: line.quantity - 1 } : line,
        )
        .filter((line) => line.quantity > 0),
    )
  }

  const removeItem = (itemId: string) => {
    setLines((prev) => prev.filter((line) => line.item.id !== itemId))
  }

  const clearCart = () => setLines([])

  const totalCount = useMemo(
    () => lines.reduce((sum, line) => sum + line.quantity, 0),
    [lines],
  )

  const subtotal = useMemo(
    () => lines.reduce((sum, line) => sum + line.quantity * line.item.price, 0),
    [lines],
  )

  return (
    <CartContext.Provider
      value={{ lines, addItem, removeItem, decrementItem, clearCart, totalCount, subtotal }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within a CartProvider')
  return ctx
}
