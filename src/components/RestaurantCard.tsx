import { Link } from 'react-router-dom'
import type { Restaurant } from '../data/restaurants'
import { useReviews } from '../context/ReviewsContext'
import { StarRating } from './StarRating'

export function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
  const { averageRating, reviewsFor } = useReviews()
  const average = averageRating(restaurant.id)
  const count = reviewsFor(restaurant.id).length

  return (
    <Link
      to={`/restaurant/${restaurant.id}`}
      className="flex flex-col rounded-2xl border border-ink/10 bg-white/60 p-5 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        {restaurant.imageUrl ? (
          <img
            src={restaurant.imageUrl}
            alt=""
            className="h-14 w-14 rounded-xl object-cover"
          />
        ) : (
          <div className="text-3xl" aria-hidden>
            {restaurant.emoji}
          </div>
        )}
        <span className="whitespace-nowrap rounded-full bg-gold/15 px-2.5 py-1 text-xs font-semibold text-gold">
          {restaurant.cuisine}
        </span>
      </div>
      <h3 className="mt-3 font-display text-lg text-ink">{restaurant.name}</h3>
      <p className="mt-1 flex-1 text-sm text-ink-soft">
        {restaurant.description ||
          (restaurant.yelpRating
            ? `Rated ${restaurant.yelpRating.toFixed(1)} on Yelp (${restaurant.yelpReviewCount ?? 0} reviews)`
            : '')}
      </p>
      <p className="mt-2 text-sm text-ink-soft">
        {restaurant.address}, {restaurant.city}
      </p>
      <div className="mt-4 flex items-center justify-between">
        <StarRating rating={average} count={count} size="sm" />
        <span className="text-sm font-medium text-ink-soft">{restaurant.priceRange}</span>
      </div>
    </Link>
  )
}
