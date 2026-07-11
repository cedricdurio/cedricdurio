import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { findRestaurant } from '../data/restaurants'
import { useReviews } from '../context/ReviewsContext'
import { useAuth } from '../context/AuthContext'
import { StarRating } from '../components/StarRating'

export function RestaurantDetail() {
  const { id } = useParams<{ id: string }>()
  const restaurant = id ? findRestaurant(id) : undefined
  const { user } = useAuth()
  const { addReview, reviewsFor, averageRating } = useReviews()
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [submitted, setSubmitted] = useState(false)

  if (!restaurant) {
    return <Navigate to="/" replace />
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
        <div className="text-4xl" aria-hidden>
          {restaurant.emoji}
        </div>
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

      <p className="mt-4 text-ink-soft">{restaurant.description}</p>

      <div className="mt-4">
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
