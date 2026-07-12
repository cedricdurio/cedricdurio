export type Restaurant = {
  id: string
  name: string
  cuisine: string
  priceRange: '$' | '$$' | '$$$' | '$$$$'
  address: string
  city: string
  zip: string
  emoji: string
  description: string
  imageUrl?: string
  yelpRating?: number
  yelpReviewCount?: number
  yelpUrl?: string
}

export const restaurants: Restaurant[] = [
  {
    id: 'downtown-market',
    name: 'Prime Bites — Downtown Market',
    cuisine: 'New American',
    priceRange: '$$$',
    address: '123 Market Street',
    city: 'San Francisco, CA',
    zip: '94103',
    emoji: '🍢',
    description: 'Elevated small plates and shareable bites in a warm, modern dining room.',
  },
  {
    id: 'golden-wok',
    name: 'Golden Wok',
    cuisine: 'Chinese',
    priceRange: '$$',
    address: '88 Clement Street',
    city: 'San Francisco, CA',
    zip: '94107',
    emoji: '🥡',
    description: 'Family-run kitchen known for hand-pulled noodles and Sichuan classics.',
  },
  {
    id: 'basil-and-vine',
    name: 'Basil & Vine',
    cuisine: 'Italian',
    priceRange: '$$$',
    address: '540 Columbus Ave',
    city: 'San Francisco, CA',
    zip: '94102',
    emoji: '🍝',
    description: 'Wood-fired pastas and a deep Italian wine list in a candlelit trattoria.',
  },
  {
    id: 'uptown-terrace',
    name: 'Prime Bites — Uptown Terrace',
    cuisine: 'New American',
    priceRange: '$$$',
    address: '450 8th Avenue',
    city: 'New York, NY',
    zip: '10001',
    emoji: '🍢',
    description: 'Rooftop terrace dining with seasonal small plates and craft cocktails.',
  },
  {
    id: 'ramen-row',
    name: 'Ramen Row',
    cuisine: 'Japanese',
    priceRange: '$',
    address: '212 St Marks Place',
    city: 'New York, NY',
    zip: '10009',
    emoji: '🍜',
    description: 'Late-night ramen counter with rich tonkotsu broth simmered for 18 hours.',
  },
  {
    id: 'the-brooklyn-grind',
    name: 'The Brooklyn Grind',
    cuisine: 'Cafe',
    priceRange: '$',
    address: '77 Bedford Ave',
    city: 'New York, NY',
    zip: '10011',
    emoji: '☕',
    description: 'All-day cafe serving single-origin coffee, pastries, and hearty brunch plates.',
  },
  {
    id: 'lakeside-ave',
    name: 'Prime Bites — Lakeside Ave',
    cuisine: 'New American',
    priceRange: '$$$',
    address: '77 Wacker Drive',
    city: 'Chicago, IL',
    zip: '60601',
    emoji: '🍢',
    description: 'Skyline views and a seasonal small-plates menu overlooking the river.',
  },
  {
    id: 'windy-city-smokehouse',
    name: 'Windy City Smokehouse',
    cuisine: 'BBQ',
    priceRange: '$$',
    address: '900 W Fulton St',
    city: 'Chicago, IL',
    zip: '60607',
    emoji: '🍖',
    description: 'Low-and-slow smoked brisket and ribs with a build-your-own platter.',
  },
  {
    id: 'deep-dish-social',
    name: 'Deep Dish Social',
    cuisine: 'Pizza',
    priceRange: '$$',
    address: '1414 N Wells St',
    city: 'Chicago, IL',
    zip: '60614',
    emoji: '🍕',
    description: 'Classic Chicago deep dish alongside a rotating list of local drafts.',
  },
  {
    id: 'harbor-point',
    name: 'Prime Bites — Harbor Point',
    cuisine: 'New American',
    priceRange: '$$$',
    address: '900 Wilshire Blvd',
    city: 'Los Angeles, CA',
    zip: '90017',
    emoji: '🍢',
    description: 'Coastal-inspired small plates paired with a curated natural wine list.',
  },
  {
    id: 'taqueria-del-sol',
    name: 'Taqueria del Sol',
    cuisine: 'Mexican',
    priceRange: '$',
    address: '2130 Sunset Blvd',
    city: 'Los Angeles, CA',
    zip: '90026',
    emoji: '🌮',
    description: 'Griddled street tacos and housemade salsas from a family recipe book.',
  },
  {
    id: 'sunset-greens',
    name: 'Sunset Greens',
    cuisine: 'Vegan',
    priceRange: '$$',
    address: '8500 Sunset Blvd',
    city: 'Los Angeles, CA',
    zip: '90012',
    emoji: '🥗',
    description: 'Plant-based bowls and cold-pressed juices in a sunlit dining room.',
  },
]

export function cuisinesFrom(list: Restaurant[]): string[] {
  return Array.from(new Set(list.map((restaurant) => restaurant.cuisine))).sort()
}

export const cuisines: string[] = cuisinesFrom(restaurants)

export function sortByProximity(zip: string): Restaurant[] {
  const zipNum = parseInt(zip, 10)
  return [...restaurants].sort(
    (a, b) =>
      Math.abs(parseInt(a.zip, 10) - zipNum) - Math.abs(parseInt(b.zip, 10) - zipNum),
  )
}

export function findRestaurant(id: string): Restaurant | undefined {
  return restaurants.find((restaurant) => restaurant.id === id)
}
