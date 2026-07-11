import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useStoreLocation } from '../context/LocationContext'

export function Account() {
  const { user, signOut } = useAuth()
  const { location, zip } = useStoreLocation()
  const navigate = useNavigate()

  if (!user) {
    return <Navigate to="/signin" replace />
  }

  const handleSignOut = () => {
    signOut()
    navigate('/')
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-ink">{user.name}</h1>
          <p className="text-ink-soft">{user.email}</p>
        </div>
        <button
          type="button"
          onClick={handleSignOut}
          className="rounded-full border border-ink/15 px-4 py-2 text-sm font-medium text-ink hover:border-gold hover:text-gold"
        >
          Sign out
        </button>
      </div>

      <div className="mt-8 rounded-xl border border-ink/10 bg-white/60 p-4">
        <p className="text-sm font-semibold uppercase tracking-wide text-ink-soft">
          Saved location
        </p>
        {location && zip ? (
          <>
            <p className="mt-1 font-medium text-ink">{location.name}</p>
            <p className="text-sm text-ink-soft">
              {location.address}, {location.city} &middot; zip {zip}
            </p>
          </>
        ) : (
          <p className="mt-1 text-sm text-ink-soft">
            No location saved yet — use the location button in the header.
          </p>
        )}
      </div>

      <h2 className="mt-10 font-display text-xl text-ink">Order history</h2>
      {user.orders.length === 0 ? (
        <p className="mt-2 text-ink-soft">You haven't placed an order yet.</p>
      ) : (
        <ul className="mt-4 divide-y divide-ink/10 rounded-xl border border-ink/10 bg-white/60">
          {user.orders.map((order) => (
            <li key={order.orderNumber} className="flex items-center justify-between p-4">
              <div>
                <p className="font-medium text-ink">Order #{order.orderNumber}</p>
                <p className="text-sm text-ink-soft">{order.itemSummary}</p>
                <p className="text-sm text-ink-soft">
                  {order.locationName} &middot; {order.fulfillment} &middot;{' '}
                  {new Date(order.date).toLocaleDateString()}
                </p>
              </div>
              <span className="font-semibold text-ink">${order.total.toFixed(2)}</span>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
