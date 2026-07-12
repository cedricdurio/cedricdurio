import type { Restaurant } from '../data/restaurants'

const API_BASE = import.meta.env.VITE_YELP_PROXY_URL as string | undefined

export function liveSearchConfigured(): boolean {
  return Boolean(API_BASE)
}

export async function searchRestaurantsByZip(zip: string): Promise<Restaurant[] | null> {
  if (!API_BASE) return null
  try {
    const res = await fetch(`${API_BASE}/restaurants?zip=${zip}`)
    if (!res.ok) return null
    const data = (await res.json()) as { restaurants: Restaurant[] }
    return data.restaurants
  } catch {
    return null
  }
}

export async function fetchRestaurantById(id: string): Promise<Restaurant | null> {
  if (!API_BASE) return null
  try {
    const res = await fetch(`${API_BASE}/restaurants/${id}`)
    if (!res.ok) return null
    const data = (await res.json()) as { restaurant: Restaurant }
    return data.restaurant
  } catch {
    return null
  }
}
