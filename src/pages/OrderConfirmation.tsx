import { Link, Navigate, useLocation } from 'react-router-dom'

type ConfirmationState = {
  orderNumber: number
  total: number
  fulfillment: 'pickup' | 'delivery'
  locationName: string
}

export function OrderConfirmation() {
  const location = useLocation()
  const state = location.state as ConfirmationState | null

  if (!state) {
    return <Navigate to="/" replace />
  }

  return (
    <main className="mx-auto max-w-xl px-4 py-20 text-center sm:px-6">
      <p className="text-5xl">🎉</p>
      <h1 className="mt-4 font-display text-3xl text-ink">Order confirmed!</h1>
      <p className="mt-2 text-ink-soft">
        Thanks for ordering from {state.locationName}. Your order number is:
      </p>
      <p className="mt-4 text-2xl font-semibold tracking-wide text-gold">
        #{state.orderNumber}
      </p>
      <p className="mt-6 text-ink-soft">
        {state.fulfillment === 'pickup'
          ? 'It will be ready for pickup in about 20 minutes.'
          : 'Estimated delivery time is 35-45 minutes.'}
      </p>
      <p className="mt-2 font-medium text-ink">Total charged: ${state.total.toFixed(2)}</p>
      <Link
        to="/"
        className="mt-8 inline-block rounded-full bg-ink px-6 py-3 text-sm font-medium text-cream hover:bg-gold"
      >
        Back to menu
      </Link>
    </main>
  )
}
