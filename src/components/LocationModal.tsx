import { useState } from 'react'
import { deliversTo, findNearestLocation } from '../data/locations'
import { useStoreLocation } from '../context/LocationContext'

export function LocationModal({ onClose }: { onClose: () => void }) {
  const { setZip } = useStoreLocation()
  const [input, setInput] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<{ zip: string; deliverable: boolean } | null>(null)

  const handleCheck = (event: React.FormEvent) => {
    event.preventDefault()
    const trimmed = input.trim()
    if (!/^\d{5}$/.test(trimmed)) {
      setError('Enter a valid 5-digit zip code.')
      setPreview(null)
      return
    }
    setError(null)
    const nearest = findNearestLocation(trimmed)
    setPreview({ zip: trimmed, deliverable: deliversTo(nearest, trimmed) })
  }

  const handleConfirm = () => {
    if (!preview) return
    setZip(preview.zip)
    onClose()
  }

  const nearest = preview ? findNearestLocation(preview.zip) : null

  return (
    <div
      className="fixed inset-0 z-20 flex items-center justify-center bg-ink/40 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-cream p-6 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 className="font-display text-xl text-ink">Find your Prime Bites</h2>
        <p className="mt-1 text-sm text-ink-soft">
          Enter your zip code to see your nearest location and delivery availability.
        </p>

        <form onSubmit={handleCheck} className="mt-4 flex gap-2">
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            inputMode="numeric"
            maxLength={5}
            placeholder="Zip code"
            autoFocus
            className="flex-1 rounded-lg border border-ink/15 px-4 py-2.5 text-ink outline-none focus:border-gold"
          />
          <button
            type="submit"
            className="rounded-lg bg-ink px-4 py-2.5 text-sm font-medium text-cream hover:bg-gold"
          >
            Check
          </button>
        </form>

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        {nearest && preview && (
          <div className="mt-4 rounded-xl border border-ink/10 bg-white/60 p-4">
            <p className="font-medium text-ink">{nearest.name}</p>
            <p className="text-sm text-ink-soft">
              {nearest.address}, {nearest.city}
            </p>
            <p className="text-sm text-ink-soft">{nearest.hours}</p>
            <p
              className={`mt-2 text-sm font-medium ${
                preview.deliverable ? 'text-green-700' : 'text-amber-700'
              }`}
            >
              {preview.deliverable
                ? 'Delivery available to your zip code'
                : 'Delivery not available here — pickup only'}
            </p>
            <button
              type="button"
              onClick={handleConfirm}
              className="mt-4 w-full rounded-full bg-ink px-4 py-2.5 text-sm font-medium text-cream hover:bg-gold"
            >
              Set as my location
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={onClose}
          className="mt-4 w-full text-center text-sm text-ink-soft hover:text-ink"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
