import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useStoreLocation } from '../context/LocationContext'
import { useReviews } from '../context/ReviewsContext'
import { findRestaurant } from '../data/restaurants'
import { StarRating } from '../components/StarRating'

export function Account() {
  const { user, signOut } = useAuth()
  const { zip } = useStoreLocation()
  const { reviews } = useReviews()
  const navigate = useNavigate()

  if (!user) {
    return <Navigate to="/signin" replace />
  }

  const myReviews = reviews
    .filter((review) => review.userEmail === user.email)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

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
          Saved zip code
        </p>
        {zip ? (
          <p className="mt-1 text-sm text-ink-soft">
            Restaurants are sorted by distance from {zip}.
          </p>
        ) : (
          <p className="mt-1 text-sm text-ink-soft">
            No zip code saved yet — use the location button in the header.
          </p>
        )}
      </div>

      <h2 className="mt-10 font-display text-xl text-ink">Your reviews</h2>
      {myReviews.length === 0 ? (
        <p className="mt-2 text-ink-soft">You haven't reviewed a restaurant yet.</p>
      ) : (
        <ul className="mt-4 space-y-4">
          {myReviews.map((review) => {
            const restaurant = findRestaurant(review.restaurantId)
            return (
              <li key={review.id} className="rounded-xl border border-ink/10 bg-white/60 p-4">
                <div className="flex items-center justify-between">
                  <Link
                    to={`/restaurant/${review.restaurantId}`}
                    className="font-medium text-ink hover:text-gold"
                  >
                    {restaurant?.name ?? 'Restaurant'}
                  </Link>
                  <StarRating rating={review.rating} size="sm" />
                </div>
                {review.comment && (
                  <p className="mt-2 text-sm text-ink-soft">{review.comment}</p>
                )}
                <p className="mt-2 text-xs text-ink-soft">
                  {new Date(review.date).toLocaleDateString()}
                </p>
              </li>
            )
          })}
        </ul>
      )}
    </main>
  )
}
