export function StarRating({
  rating,
  count,
  size = 'md',
}: {
  rating: number | null
  count?: number
  size?: 'sm' | 'md'
}) {
  const textSize = size === 'sm' ? 'text-sm' : 'text-base'

  if (rating === null) {
    return <span className={`${textSize} text-ink-soft`}>No reviews yet</span>
  }

  const rounded = Math.round(rating)

  return (
    <span className={`inline-flex items-center gap-1 ${textSize}`}>
      <span aria-hidden className="text-gold">
        {'★'.repeat(rounded)}
        {'☆'.repeat(5 - rounded)}
      </span>
      <span className="text-ink-soft">
        {rating.toFixed(1)}
        {count !== undefined ? ` (${count})` : ''}
      </span>
    </span>
  )
}
