import { useMemo, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { cuisines, restaurants, sortByProximity } from '../data/restaurants'
import { randomHeroImage } from '../data/heroImages'
import { RestaurantCard } from '../components/RestaurantCard'
import { useStoreLocation } from '../context/LocationContext'

export function Home() {
  const { zip, setZip } = useStoreLocation()
  const [activeCuisine, setActiveCuisine] = useState<string>('All')
  const [zipInput, setZipInput] = useState('')
  const [zipError, setZipError] = useState<string | null>(null)
  const [heroImage] = useState(randomHeroImage)
  const [heroImageFailed, setHeroImageFailed] = useState(false)
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

  const handleZipSubmit = (event: FormEvent) => {
    event.preventDefault()
    const trimmed = zipInput.trim()
    if (!/^\d{5}$/.test(trimmed)) {
      setZipError('Enter a valid 5-digit zip code.')
      return
    }
    setZipError(null)
    setZip(trimmed)
  }

  return (
    <>
      <section className="relative overflow-hidden">
        {!heroImageFailed && (
          <img
            src={heroImage}
            onError={() => setHeroImageFailed(true)}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-ink/80 via-ink/70 to-ink/90" />

        <div className="relative mx-auto max-w-2xl px-4 py-24 text-center sm:px-6 sm:py-32">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-light">
            Find your next favorite spot
          </p>
          <h1 className="mt-3 font-display text-4xl text-cream sm:text-5xl">
            Welcome to Prime Bites
          </h1>
          <p className="mt-4 text-lg text-cream/90">Let's cure that hunger.</p>

          <form
            onSubmit={handleZipSubmit}
            className="mx-auto mt-8 flex max-w-md flex-col gap-2 sm:flex-row"
          >
            <input
              value={zipInput}
              onChange={(event) => setZipInput(event.target.value)}
              inputMode="numeric"
              maxLength={5}
              placeholder="Enter your zip code"
              className="flex-1 rounded-full border border-cream/30 bg-cream/10 px-5 py-3 text-cream placeholder-cream/60 outline-none backdrop-blur focus:border-gold"
            />
            <button
              type="submit"
              className="rounded-full bg-gold px-6 py-3 text-sm font-medium text-ink hover:bg-gold-light"
            >
              Find restaurants
            </button>
          </form>
          {zipError && <p className="mt-2 text-sm text-red-300">{zipError}</p>}
          {zip && !zipError && (
            <p className="mt-2 text-sm text-cream/80">Showing restaurants near {zip}</p>
          )}

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleSurpriseMe}
              className="flex items-center gap-2 rounded-full border border-cream/30 bg-cream/10 px-4 py-2 text-sm font-medium text-cream backdrop-blur hover:border-gold hover:text-gold-light"
            >
              <span aria-hidden>🎲</span>
              <span>Surprise me</span>
            </button>

            <Link
              to="/decide"
              className="flex items-center gap-2 rounded-full border border-cream/30 bg-cream/10 px-4 py-2 text-sm font-medium text-cream backdrop-blur hover:border-gold hover:text-gold-light"
            >
              <span aria-hidden>👥</span>
              <span>Decide together</span>
            </Link>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-5xl px-4 pb-16 sm:px-6">
        <div className="mt-10 flex flex-wrap justify-center gap-2 sm:gap-3">
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
    </>
  )
}
