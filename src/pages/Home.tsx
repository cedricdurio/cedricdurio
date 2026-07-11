import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { cuisines, restaurants, sortByProximity } from '../data/restaurants'
import { RestaurantCard } from '../components/RestaurantCard'
import { useStoreLocation } from '../context/LocationContext'
import { LocationModal } from '../components/LocationModal'

export function Home() {
  const { zip } = useStoreLocation()
  const [activeCuisine, setActiveCuisine] = useState<string>('All')
  const [locationModalOpen, setLocationModalOpen] = useState(false)
  const navigate = useNavigate()

  const sorted = useMemo(() => (zip ? sortByProximity(zip) : restaurants), [zip])

  const filtered = useMemo(
    () =>
      activeCuisine === 'All'
        ? sorted
        : sorted.filter((restaurant) => restaurant.cuisine === activeCuisine),
    [sorted, activeCuisine],
  )

  const handleSurpriseMe = () => {
    const pool = filtered.length > 0 ? filtered : restaurants
    const pick = pool[Math.floor(Math.random() * pool.length)]
    navigate(`/restaurant/${pick.id}`)
  }

  return (
    <main className="mx-auto max-w-5xl px-4 pb-16 sm:px-6">
      <section className="py-14 text-center sm:py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">
          Find your next favorite spot
        </p>
        <h1 className="mt-3 font-display text-4xl text-ink sm:text-5xl">
          Welcome to Prime Bites
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-ink-soft">
          Discover restaurants near you, see what fellow diners think, and rate
          your own experiences.
        </p>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setLocationModalOpen(true)}
            className="flex items-center gap-2 rounded-full border border-ink/15 px-4 py-2 text-sm text-ink-soft hover:border-gold hover:text-gold"
          >
            <span aria-hidden>📍</span>
            {zip ? <span>Showing restaurants near {zip}</span> : <span>Set your zip code</span>}
          </button>

          <button
            type="button"
            onClick={handleSurpriseMe}
            className="flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-medium text-cream hover:bg-gold"
          >
            <span aria-hidden>🎲</span>
            <span>Surprise me</span>
          </button>

          <Link
            to="/decide"
            className="flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-2 text-sm font-medium text-gold hover:bg-gold/20"
          >
            <span aria-hidden>👥</span>
            <span>Decide together</span>
          </Link>
        </div>
      </section>

      {locationModalOpen && <LocationModal onClose={() => setLocationModalOpen(false)} />}

      <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
        {['All', ...cuisines].map((cuisine) => (
          <button
            key={cuisine}
            type="button"
            onClick={() => setActiveCuisine(cuisine)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              activeCuisine === cuisine
                ? 'border-ink bg-ink text-cream'
                : 'border-ink/15 text-ink-soft hover:border-gold hover:text-gold'
            }`}
          >
            {cuisine}
          </button>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((restaurant) => (
          <RestaurantCard key={restaurant.id} restaurant={restaurant} />
        ))}
      </div>
    </main>
  )
}
