import { createContext, useContext, useState, type ReactNode } from 'react'

const STORAGE_KEY = 'primebites_zip'

type LocationContextValue = {
  zip: string | null
  setZip: (zip: string) => void
  clearZip: () => void
}

const LocationContext = createContext<LocationContextValue | null>(null)

export function LocationProvider({ children }: { children: ReactNode }) {
  const [zip, setZipState] = useState<string | null>(() =>
    localStorage.getItem(STORAGE_KEY),
  )

  const setZip = (nextZip: string) => {
    localStorage.setItem(STORAGE_KEY, nextZip)
    setZipState(nextZip)
  }

  const clearZip = () => {
    localStorage.removeItem(STORAGE_KEY)
    setZipState(null)
  }

  return (
    <LocationContext.Provider value={{ zip, setZip, clearZip }}>
      {children}
    </LocationContext.Provider>
  )
}

export function useStoreLocation() {
  const ctx = useContext(LocationContext)
  if (!ctx) throw new Error('useStoreLocation must be used within a LocationProvider')
  return ctx
}
