import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useStoreLocation } from '../context/LocationContext'
import { useAuth } from '../context/AuthContext'
import { LocationModal } from './LocationModal'

export function Navbar() {
  const { totalCount } = useCart()
  const { location } = useStoreLocation()
  const { user } = useAuth()
  const [locationModalOpen, setLocationModalOpen] = useState(false)

  return (
    <header className="sticky top-0 z-10 border-b border-ink/10 bg-cream/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl">🍢</span>
          <span className="font-display text-xl tracking-wide text-ink">Prime Bites</span>
        </Link>

        <button
          type="button"
          onClick={() => setLocationModalOpen(true)}
          className="order-last flex items-center gap-1.5 rounded-full border border-ink/15 px-3 py-1.5 text-sm text-ink-soft hover:border-gold hover:text-gold transition-colors sm:order-none"
        >
          <span aria-hidden>📍</span>
          <span className="max-w-[10rem] truncate sm:max-w-xs">
            {location ? location.city : 'Set your location'}
          </span>
        </button>

        <nav className="flex items-center gap-4 text-sm font-medium text-ink-soft sm:gap-6">
          <Link to="/" className="hover:text-gold transition-colors">
            Menu
          </Link>
          <Link
            to={user ? '/account' : '/signin'}
            className="hover:text-gold transition-colors"
          >
            {user ? user.name.split(' ')[0] : 'Sign in'}
          </Link>
          <Link
            to="/cart"
            className="relative flex items-center gap-1 rounded-full border border-ink/15 px-3 py-1.5 hover:border-gold hover:text-gold transition-colors"
          >
            <span aria-hidden>🛍️</span>
            <span>Cart</span>
            {totalCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-gold text-xs font-semibold text-cream">
                {totalCount}
              </span>
            )}
          </Link>
        </nav>
      </div>

      {locationModalOpen && <LocationModal onClose={() => setLocationModalOpen(false)} />}
    </header>
  )
}
