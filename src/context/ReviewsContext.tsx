import { createContext, useContext, useState, type ReactNode } from 'react'
import { useAuth } from './AuthContext'

export type Review = {
  id: string
  restaurantId: string
  userName: string
  userEmail: string
  rating: number
  comment: string
  date: string
}

type ReviewsContextValue = {
  reviews: Review[]
  addReview: (restaurantId: string, rating: number, comment: string) => void
  reviewsFor: (restaurantId: string) => Review[]
  averageRating: (restaurantId: string) => number | null
}

const STORAGE_KEY = 'primebites_reviews'

const ReviewsContext = createContext<ReviewsContextValue | null>(null)

function loadReviews(): Review[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
  } catch {
    return []
  }
}

export function ReviewsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [reviews, setReviews] = useState<Review[]>(loadReviews)

  const addReview = (restaurantId: string, rating: number, comment: string) => {
    if (!user) return
    const review: Review = {
      id: `${restaurantId}-${Date.now()}`,
      restaurantId,
      userName: user.name,
      userEmail: user.email,
      rating,
      comment,
      date: new Date().toISOString(),
    }
    const next = [review, ...reviews]
    setReviews(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }

  const reviewsFor = (restaurantId: string) =>
    reviews
      .filter((review) => review.restaurantId === restaurantId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const averageRating = (restaurantId: string) => {
    const forRestaurant = reviewsFor(restaurantId)
    if (forRestaurant.length === 0) return null
    return forRestaurant.reduce((sum, review) => sum + review.rating, 0) / forRestaurant.length
  }

  return (
    <ReviewsContext.Provider value={{ reviews, addReview, reviewsFor, averageRating }}>
      {children}
    </ReviewsContext.Provider>
  )
}

export function useReviews() {
  const ctx = useContext(ReviewsContext)
  if (!ctx) throw new Error('useReviews must be used within a ReviewsProvider')
  return ctx
}
