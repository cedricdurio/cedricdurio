import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export function Cart() {
  const { lines, addItem, decrementItem, removeItem, subtotal } = useCart()
  const navigate = useNavigate()

  if (lines.length === 0) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
        <p className="text-4xl">🍽️</p>
        <h1 className="mt-4 font-display text-2xl text-ink">Your cart is empty</h1>
        <p className="mt-2 text-ink-soft">Add some bites from the menu to get started.</p>
        <Link
          to="/"
          className="mt-6 inline-block rounded-full bg-ink px-6 py-3 text-sm font-medium text-cream hover:bg-gold"
        >
          Browse the menu
        </Link>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl text-ink">Your Order</h1>

      <ul className="mt-8 divide-y divide-ink/10">
        {lines.map(({ item, quantity }) => (
          <li key={item.id} className="flex items-center gap-4 py-4">
            <span className="text-3xl" aria-hidden>
              {item.emoji}
            </span>
            <div className="flex-1">
              <p className="font-medium text-ink">{item.name}</p>
              <p className="text-sm text-ink-soft">${item.price.toFixed(2)} each</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => decrementItem(item.id)}
                aria-label={`Remove one ${item.name}`}
                className="h-8 w-8 rounded-full border border-ink/15 text-ink hover:border-gold hover:text-gold"
              >
                −
              </button>
              <span className="w-6 text-center font-medium">{quantity}</span>
              <button
                type="button"
                onClick={() => addItem(item)}
                aria-label={`Add one more ${item.name}`}
                className="h-8 w-8 rounded-full border border-ink/15 text-ink hover:border-gold hover:text-gold"
              >
                +
              </button>
            </div>
            <span className="w-16 text-right font-semibold text-ink">
              ${(item.price * quantity).toFixed(2)}
            </span>
            <button
              type="button"
              onClick={() => removeItem(item.id)}
              aria-label={`Remove ${item.name} from cart`}
              className="text-ink-soft hover:text-red-600"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex items-center justify-between border-t border-ink/10 pt-6">
        <span className="text-lg font-semibold text-ink">Subtotal</span>
        <span className="text-lg font-semibold text-ink">${subtotal.toFixed(2)}</span>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Link
          to="/"
          className="flex-1 rounded-full border border-ink/15 px-6 py-3 text-center text-sm font-medium text-ink hover:border-gold hover:text-gold"
        >
          Add more items
        </Link>
        <button
          type="button"
          onClick={() => navigate('/checkout')}
          className="flex-1 rounded-full bg-ink px-6 py-3 text-sm font-medium text-cream hover:bg-gold"
        >
          Checkout
        </button>
      </div>
    </main>
  )
}
