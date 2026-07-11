import { useStoreLocation } from '../context/LocationContext'

export function Footer() {
  const { location } = useStoreLocation()

  return (
    <footer className="mt-16 border-t border-ink/10 py-8 text-center text-sm text-ink-soft">
      <p>
        {location
          ? `${location.name} · ${location.address}, ${location.city} · ${location.hours}`
          : 'Prime Bites · locations in San Francisco, New York, Chicago & Los Angeles'}
      </p>
      <p className="mt-1">&copy; {new Date().getFullYear()} Prime Bites. All rights reserved.</p>
    </footer>
  )
}
