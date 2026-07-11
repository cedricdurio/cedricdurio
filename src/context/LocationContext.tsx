import { createContext, useContext, useState, type ReactNode } from 'react'
import { deliversTo, findNearestLocation, type Location } from '../data/locations'

const STORAGE_KEY = 'primebites_zip'

type LocationContextValue = {
  zip: string | null
  location: Location | null
  canDeliver: boolean
  setZip: (zip: string) => void
  clearZip: () => void
}

const LocationContext = createContext<LocationContextValue | null>(null)

export function LocationProvider({ children }: { children: ReactNode }) {
  const [zip, setZipState] = useState<string | null>(() =>
    localStorage.getItem(STORAGE_KEY),
  )

  const location = zip ? findNearestLocation(zip) : null
  const canDeliver = zip !== null && location !== null && deliversTo(location, zip)

  const setZip = (nextZip: string) => {
    localStorage.setItem(STORAGE_KEY, nextZip)
    setZipState(nextZip)
  }

  const clearZip = () => {
    localStorage.removeItem(STORAGE_KEY)
    setZipState(null)
  }

  return (
    <LocationContext.Provider value={{ zip, location, canDeliver, setZip, clearZip }}>
      {children}
    </LocationContext.Provider>
  )
}

export function useStoreLocation() {
  const ctx = useContext(LocationContext)
  if (!ctx) throw new Error('useStoreLocation must be used within a LocationProvider')
  return ctx
}
