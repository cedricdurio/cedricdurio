import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export function Navbar() {
  const { totalCount } = useCart()

  return (
    <header className="sticky top-0 z-10 border-b border-ink/10 bg-cream/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl">🍢</span>
          <span className="font-display text-xl tracking-wide text-ink">Prime Bites</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm font-medium text-ink-soft sm:gap-6">
          <Link to="/" className="hover:text-gold transition-colors">
            Menu
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
    </header>
  )
}
