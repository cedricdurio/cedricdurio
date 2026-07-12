import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { findRestaurant, type Restaurant } from '../data/restaurants'
import { fetchRestaurantById } from '../lib/yelpApi'
import { useReviews } from '../context/ReviewsContext'
import { useAuth } from '../context/AuthContext'
import { StarRating } from '../components/StarRating'

export function RestaurantDetail() {
  const { id } = useParams<{ id: string }>()
  const [restaurant, setRestaurant] = useState<Restaurant | null | undefined>(() =>
    id ? findRestaurant(id) : undefined,
  )
  const { user } = useAuth()
  const { addReview, reviewsFor, averageRating } = useReviews()
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const local = id ? findRestaurant(id) : undefined
    if (local || !id) return
    let cancelled = false
    fetchRestaurantById(id).then((fetched) => {
      if (!cancelled) setRestaurant(fetched)
    })
    return () => {
      cancelled = true
    }
  }, [id])

  if (restaurant === null) {
    return <Navigate to="/" replace />
  }

  if (!restaurant) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
        <p className="text-ink-soft">Loading restaurant…</p>
      </main>
    )
  }

  const reviews = reviewsFor(restaurant.id)
  const average = averageRating(restaurant.id)

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    addReview(restaurant.id, rating, comment.trim())
    setComment('')
    setRating(5)
    setSubmitted(true)
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <Link to="/" className="text-sm text-ink-soft hover:text-gold">
        &larr; Back to all restaurants
      </Link>

      <div className="mt-4 flex items-start gap-4">
        {restaurant.imageUrl ? (
          <img
            src={restaurant.imageUrl}
            alt=""
            className="h-16 w-16 rounded-xl object-cover"
          />
        ) : (
          <div className="text-4xl" aria-hidden>
            {restaurant.emoji}
          </div>
        )}
        <div>
          <h1 className="font-display text-3xl text-ink">{restaurant.name}</h1>
          <p className="text-ink-soft">
            {restaurant.cuisine} &middot; {restaurant.priceRange}
          </p>
          <p className="text-sm text-ink-soft">
            {restaurant.address}, {restaurant.city}
          </p>
        </div>
      </div>

      {restaurant.description && <p className="mt-4 text-ink-soft">{restaurant.description}</p>}

      {restaurant.yelpRating !== undefined && (
        <p className="mt-4 text-sm text-ink-soft">
          {restaurant.yelpRating.toFixed(1)} ★ on Yelp ({restaurant.yelpReviewCount ?? 0} reviews)
          {restaurant.yelpUrl && (
            <>
              {' '}
              &middot;{' '}
              <a
                href={restaurant.yelpUrl}
                target="_blank"
                rel="noreferrer"
                className="text-gold hover:underline"
              >
                View on Yelp
              </a>
            </>
          )}
        </p>
      )}

      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
          Prime Bites reviews
        </p>
        <StarRating rating={average} count={reviews.length} />
      </div>

      <section className="mt-10">
        <h2 className="font-display text-xl text-ink">Leave a review</h2>
        {user ? (
          <form onSubmit={handleSubmit} className="mt-4 space-y-3">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRating(value)}
                  aria-label={`Rate ${value} star${value === 1 ? '' : 's'}`}
                  className={`text-2xl ${value <= rating ? 'text-gold' : 'text-ink/20'}`}
                >
                  ★
                </button>
              ))}
            </div>
            <textarea
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              placeholder="Share how your visit went..."
              rows={3}
              className="w-full rounded-lg border border-ink/15 px-4 py-2.5 text-ink outline-none focus:border-gold"
            />
            <button
              type="submit"
              className="rounded-full bg-ink px-6 py-2.5 text-sm font-medium text-cream hover:bg-gold"
            >
              Submit review
            </button>
            {submitted && (
              <p className="text-sm text-green-700">Thanks for sharing your experience!</p>
            )}
          </form>
        ) : (
          <p className="mt-2 text-ink-soft">
            <Link to="/signin" className="text-gold hover:underline">
              Sign in
            </Link>{' '}
            to leave a review.
          </p>
        )}
      </section>

      <section className="mt-10">
        <h2 className="font-display text-xl text-ink">
          {reviews.length === 0 ? 'No reviews yet' : `${reviews.length} review${reviews.length === 1 ? '' : 's'}`}
        </h2>
        <ul className="mt-4 space-y-4">
          {reviews.map((review) => (
            <li key={review.id} className="rounded-xl border border-ink/10 bg-white/60 p-4">
              <div className="flex items-center justify-between">
                <p className="font-medium text-ink">{review.userName}</p>
                <StarRating rating={review.rating} size="sm" />
              </div>
              {review.comment && <p className="mt-2 text-sm text-ink-soft">{review.comment}</p>}
              <p className="mt-2 text-xs text-ink-soft">
                {new Date(review.date).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
