import { useRef, useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useStoreLocation } from '../context/LocationContext'
import { useAuth } from '../context/AuthContext'

const TAX_RATE = 0.09

export function Checkout() {
  const { lines, subtotal, clearCart } = useCart()
  const { location, canDeliver } = useStoreLocation()
  const { user, addOrder } = useAuth()
  const navigate = useNavigate()
  const [fulfillment, setFulfillment] = useState<'pickup' | 'delivery'>('pickup')
  const [name, setName] = useState(user?.name ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const orderPlaced = useRef(false)

  if (lines.length === 0 && !orderPlaced.current) {
    return <Navigate to="/" replace />
  }

  const deliveryAllowed = canDeliver
  const tax = subtotal * TAX_RATE
  const deliveryFee = fulfillment === 'delivery' ? 5.99 : 0
  const total = subtotal + tax + deliveryFee
  const locationName = location?.name ?? 'Prime Bites'

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    orderPlaced.current = true
    const orderNumber = Math.floor(1000 + Math.random() * 9000)

    if (user) {
      const itemSummary = lines
        .map((line) => `${line.quantity}x ${line.item.name}`)
        .join(', ')
      addOrder({
        orderNumber,
        date: new Date().toISOString(),
        total,
        fulfillment,
        locationName,
        itemSummary,
      })
    }

    clearCart()
    navigate('/confirmation', { state: { orderNumber, total, fulfillment, locationName } })
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl text-ink">Checkout</h1>
      <p className="mt-1 text-sm text-ink-soft">Ordering from {locationName}</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-8">
        <fieldset>
          <legend className="text-sm font-semibold uppercase tracking-wide text-ink-soft">
            Fulfillment
          </legend>
          <div className="mt-3 flex gap-3">
            {(['pickup', 'delivery'] as const).map((option) => (
              <button
                type="button"
                key={option}
                disabled={option === 'delivery' && !deliveryAllowed}
                onClick={() => setFulfillment(option)}
                className={`flex-1 rounded-xl border px-4 py-3 text-sm font-medium capitalize transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                  fulfillment === option
                    ? 'border-ink bg-ink text-cream'
                    : 'border-ink/15 text-ink-soft hover:border-gold hover:text-gold'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
          {!deliveryAllowed && (
            <p className="mt-2 text-sm text-amber-700">
              Delivery isn't available at your saved location — pickup only.
            </p>
          )}
        </fieldset>

        <fieldset className="space-y-3">
          <legend className="text-sm font-semibold uppercase tracking-wide text-ink-soft">
            Contact details
          </legend>
          <input
            required
            type="text"
            placeholder="Full name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full rounded-lg border border-ink/15 px-4 py-2.5 text-ink outline-none focus:border-gold"
          />
          <input
            required
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-lg border border-ink/15 px-4 py-2.5 text-ink outline-none focus:border-gold"
          />
          <input
            required
            type="tel"
            placeholder="Phone number"
            className="w-full rounded-lg border border-ink/15 px-4 py-2.5 text-ink outline-none focus:border-gold"
          />
          {fulfillment === 'delivery' && (
            <input
              required
              type="text"
              placeholder="Delivery address"
              className="w-full rounded-lg border border-ink/15 px-4 py-2.5 text-ink outline-none focus:border-gold"
            />
          )}
        </fieldset>

        <fieldset className="space-y-3">
          <legend className="text-sm font-semibold uppercase tracking-wide text-ink-soft">
            Payment
          </legend>
          <input
            required
            type="text"
            placeholder="Card number"
            className="w-full rounded-lg border border-ink/15 px-4 py-2.5 text-ink outline-none focus:border-gold"
          />
          <div className="flex gap-3">
            <input
              required
              type="text"
              placeholder="MM/YY"
              className="w-full rounded-lg border border-ink/15 px-4 py-2.5 text-ink outline-none focus:border-gold"
            />
            <input
              required
              type="text"
              placeholder="CVC"
              className="w-full rounded-lg border border-ink/15 px-4 py-2.5 text-ink outline-none focus:border-gold"
            />
          </div>
        </fieldset>

        <div className="space-y-2 border-t border-ink/10 pt-6 text-sm">
          <div className="flex justify-between text-ink-soft">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-ink-soft">
            <span>Tax</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          {fulfillment === 'delivery' && (
            <div className="flex justify-between text-ink-soft">
              <span>Delivery fee</span>
              <span>${deliveryFee.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-lg font-semibold text-ink">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        <button
          type="submit"
          className="w-full rounded-full bg-ink px-6 py-3 text-sm font-medium text-cream hover:bg-gold"
        >
          Place order
        </button>
      </form>
    </main>
  )
}
