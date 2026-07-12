import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { cuisinesFrom } from '../data/restaurants'
import { findMatches, moods, budgets, type Mood, type Budget, type Match } from '../lib/matchmaker'
import { useStoreLocation } from '../context/LocationContext'
import { useReviews } from '../context/ReviewsContext'
import { useRestaurantPool } from '../hooks/useRestaurantPool'
import { StarRating } from '../components/StarRating'

export function DecideTogether() {
  const { zip } = useStoreLocation()
  const { averageRating } = useReviews()
  const pool = useRestaurantPool()
  const [mood, setMood] = useState<Mood | null>(null)
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([])
  const [budget, setBudget] = useState<Budget>('any')
  const [matches, setMatches] = useState<Match[] | null>(null)

  const cuisines = useMemo(() => cuisinesFrom(pool.restaurants), [pool.restaurants])

  const toggleCuisine = (cuisine: string) => {
    setSelectedCuisines((prev) =>
      prev.includes(cuisine) ? prev.filter((c) => c !== cuisine) : [...prev, cuisine],
    )
  }

  const handleFindMatch = () => {
    const results = findMatches(
      pool.restaurants,
      { mood, cuisines: selectedCuisines, budget },
      zip,
      averageRating,
    )
    setMatches(results)
  }

  const handleStartOver = () => {
    setMood(null)
    setSelectedCuisines([])
    setBudget('any')
    setMatches(null)
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">
        Can't agree on where to eat?
      </p>
      <h1 className="mt-2 font-display text-3xl text-ink sm:text-4xl">Decide together</h1>
      <p className="mt-2 text-ink-soft">
        Answer a few quick questions as a couple or group and we'll suggest a match.
      </p>

      {matches === null ? (
        <div className="mt-8 space-y-8">
          <fieldset>
            <legend className="text-sm font-semibold uppercase tracking-wide text-ink-soft">
              What's the mood tonight?
            </legend>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {moods.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setMood(option.id)}
                  className={`rounded-xl border px-4 py-3 text-left transition-colors ${
                    mood === option.id
                      ? 'border-ink bg-ink text-cream'
                      : 'border-ink/15 hover:border-gold hover:text-gold'
                  }`}
                >
                  <p className="font-medium">{option.label}</p>
                  <p
                    className={`text-sm ${mood === option.id ? 'text-cream/80' : 'text-ink-soft'}`}
                  >
                    {option.description}
                  </p>
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-sm font-semibold uppercase tracking-wide text-ink-soft">
              Craving anything in particular? (optional, pick any that apply)
            </legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {cuisines.map((cuisine) => (
                <button
                  key={cuisine}
                  type="button"
                  onClick={() => toggleCuisine(cuisine)}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                    selectedCuisines.includes(cuisine)
                      ? 'border-ink bg-ink text-cream'
                      : 'border-ink/15 text-ink-soft hover:border-gold hover:text-gold'
                  }`}
                >
                  {cuisine}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-sm font-semibold uppercase tracking-wide text-ink-soft">
              Budget
            </legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {budgets.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setBudget(option.id)}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                    budget === option.id
                      ? 'border-ink bg-ink text-cream'
                      : 'border-ink/15 text-ink-soft hover:border-gold hover:text-gold'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </fieldset>

          <button
            type="button"
            onClick={handleFindMatch}
            disabled={!mood}
            className="w-full rounded-full bg-ink px-6 py-3 text-sm font-medium text-cream hover:bg-gold disabled:cursor-not-allowed disabled:opacity-40"
          >
            Find our match
          </button>
          {!mood && (
            <p className="text-center text-sm text-ink-soft">Pick a mood to get started.</p>
          )}
        </div>
      ) : (
        <div className="mt-8">
          <h2 className="font-display text-xl text-ink">
            {matches.length === 0 ? "We couldn't find a match" : 'Your top picks'}
          </h2>
          <ul className="mt-4 space-y-4">
            {matches.map(({ restaurant, reasons }, index) => (
              <li
                key={restaurant.id}
                className="rounded-2xl border border-ink/10 bg-white/60 p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl" aria-hidden>
                      {restaurant.emoji}
                    </span>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-gold">
                        {index === 0 ? 'Best match' : `#${index + 1} pick`}
                      </p>
                      <Link
                        to={`/restaurant/${restaurant.id}`}
                        className="font-display text-lg text-ink hover:text-gold"
                      >
                        {restaurant.name}
                      </Link>
                    </div>
                  </div>
                  <StarRating rating={averageRating(restaurant.id)} size="sm" />
                </div>
                <p className="mt-2 text-sm text-ink-soft">
                  {restaurant.cuisine} &middot; {restaurant.priceRange} &middot;{' '}
                  {restaurant.address}, {restaurant.city}
                </p>
                {reasons.length > 0 && (
                  <p className="mt-2 text-sm text-ink-soft">
                    Why: {reasons.join(', ')}.
                  </p>
                )}
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={handleStartOver}
            className="mt-6 w-full rounded-full border border-ink/15 px-6 py-3 text-sm font-medium text-ink hover:border-gold hover:text-gold"
          >
            Start over
          </button>
        </div>
      )}
    </main>
  )
}
