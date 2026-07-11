import { restaurants, type Restaurant } from '../data/restaurants'

export type Mood = 'cozy' | 'lively' | 'adventurous' | 'comfort'
export type Budget = Restaurant['priceRange'] | 'any'

export const moods: { id: Mood; label: string; description: string }[] = [
  { id: 'cozy', label: 'Cozy & quiet', description: 'Low-key, easy to talk' },
  { id: 'lively', label: 'Fun & lively', description: 'Energetic, good for a group' },
  { id: 'adventurous', label: 'Adventurous', description: "Something we haven't tried" },
  { id: 'comfort', label: 'Comfort food', description: 'Familiar and satisfying' },
]

const moodCuisines: Record<Mood, string[]> = {
  cozy: ['Italian', 'Cafe', 'New American'],
  lively: ['Mexican', 'Pizza', 'BBQ'],
  adventurous: ['Japanese', 'Chinese', 'Vegan'],
  comfort: ['BBQ', 'Pizza', 'Mexican', 'Cafe'],
}

export const budgets: { id: Budget; label: string }[] = [
  { id: '$', label: '$' },
  { id: '$$', label: '$$' },
  { id: '$$$', label: '$$$' },
  { id: '$$$$', label: '$$$$' },
  { id: 'any', label: 'No preference' },
]

export type QuizAnswers = {
  mood: Mood | null
  cuisines: string[]
  budget: Budget
}

export type Match = {
  restaurant: Restaurant
  score: number
  reasons: string[]
}

export function findMatches(
  answers: QuizAnswers,
  zip: string | null,
  averageRating: (id: string) => number | null,
): Match[] {
  const proximityOrder = zip
    ? [...restaurants]
        .sort(
          (a, b) =>
            Math.abs(parseInt(a.zip, 10) - parseInt(zip, 10)) -
            Math.abs(parseInt(b.zip, 10) - parseInt(zip, 10)),
        )
        .map((restaurant) => restaurant.id)
    : null

  const moodLabel = answers.mood && moods.find((m) => m.id === answers.mood)?.label

  const matches = restaurants.map((restaurant) => {
    let score = 0
    const reasons: string[] = []

    if (answers.cuisines.length > 0 && answers.cuisines.includes(restaurant.cuisine)) {
      score += 3
      reasons.push(`serves the ${restaurant.cuisine} you're craving`)
    }

    if (answers.mood && moodCuisines[answers.mood].includes(restaurant.cuisine)) {
      score += 2
      reasons.push(`matches your "${moodLabel?.toLowerCase()}" pick`)
    }

    if (answers.budget !== 'any' && restaurant.priceRange === answers.budget) {
      score += 2
      reasons.push(`matches your ${restaurant.priceRange} budget`)
    }

    if (proximityOrder) {
      const rank = proximityOrder.indexOf(restaurant.id)
      if (rank < 3) {
        score += 3 - rank
        reasons.push('close to your saved zip code')
      }
    }

    const avg = averageRating(restaurant.id)
    if (avg !== null) {
      score += avg / 5
      if (avg >= 4) reasons.push('highly rated by other diners')
    }

    return { restaurant, score, reasons }
  })

  return matches.sort((a, b) => b.score - a.score).slice(0, 3)
}
