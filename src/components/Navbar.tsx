import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useStoreLocation } from '../context/LocationContext'
import { useAuth } from '../context/AuthContext'
import { LocationModal } from './LocationModal'

export function Navbar() {
  const { zip } = useStoreLocation()
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
            {zip ? `Near ${zip}` : 'Set your zip code'}
          </span>
        </button>

        <nav className="flex items-center gap-4 text-sm font-medium text-ink-soft sm:gap-6">
          <Link to="/" className="hover:text-gold transition-colors">
            Restaurants
          </Link>
          <Link
            to={user ? '/account' : '/signin'}
            className="hover:text-gold transition-colors"
          >
            {user ? user.name.split(' ')[0] : 'Sign in'}
          </Link>
        </nav>
      </div>

      {locationModalOpen && <LocationModal onClose={() => setLocationModalOpen(false)} />}
    </header>
  )
}
