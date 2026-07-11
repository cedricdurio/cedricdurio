import type { MenuItem } from '../data/menu'
import { useCart } from '../context/CartContext'

export function MenuItemCard({ item }: { item: MenuItem }) {
  const { addItem } = useCart()

  return (
    <div className="flex flex-col rounded-2xl border border-ink/10 bg-white/60 p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="text-3xl" aria-hidden>
          {item.emoji}
        </div>
        {item.tags?.map((tag) => (
          <span
            key={tag}
            className="whitespace-nowrap rounded-full bg-gold/15 px-2.5 py-1 text-xs font-semibold text-gold"
          >
            {tag}
          </span>
        ))}
      </div>
      <h3 className="mt-3 font-display text-lg text-ink">{item.name}</h3>
      <p className="mt-1 flex-1 text-sm text-ink-soft">{item.description}</p>
      <div className="mt-4 flex items-center justify-between">
        <span className="font-semibold text-ink">${item.price.toFixed(2)}</span>
        <button
          type="button"
          onClick={() => addItem(item)}
          className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-cream transition-colors hover:bg-gold"
        >
          Add to order
        </button>
      </div>
    </div>
  )
}
