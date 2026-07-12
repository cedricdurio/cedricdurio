import { useEffect, useState } from 'react'
import { restaurants as demoRestaurants, sortByProximity, type Restaurant } from '../data/restaurants'
import { useStoreLocation } from '../context/LocationContext'
import { searchRestaurantsByZip, liveSearchConfigured } from '../lib/yelpApi'

export type RestaurantPool = {
  restaurants: Restaurant[]
  isLive: boolean
  loading: boolean
  liveUnavailable: boolean
}

export function useRestaurantPool(): RestaurantPool {
  const { zip } = useStoreLocation()
  const [pool, setPool] = useState<RestaurantPool>({
    restaurants: demoRestaurants,
    isLive: false,
    loading: false,
    liveUnavailable: false,
  })

  useEffect(() => {
    if (!zip) {
      setPool({ restaurants: demoRestaurants, isLive: false, loading: false, liveUnavailable: false })
      return
    }

    if (!liveSearchConfigured()) {
      setPool({
        restaurants: sortByProximity(zip),
        isLive: false,
        loading: false,
        liveUnavailable: false,
      })
      return
    }

    let cancelled = false
    setPool((prev) => ({ ...prev, loading: true }))

    searchRestaurantsByZip(zip).then((live) => {
      if (cancelled) return
      if (live && live.length > 0) {
        setPool({ restaurants: live, isLive: true, loading: false, liveUnavailable: false })
      } else {
        setPool({
          restaurants: sortByProximity(zip),
          isLive: false,
          loading: false,
          liveUnavailable: true,
        })
      }
    })

    return () => {
      cancelled = true
    }
  }, [zip])

  return pool
}
