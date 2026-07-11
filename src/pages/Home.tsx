import { useMemo, useState } from 'react'
import { categories, menu, type Category } from '../data/menu'
import { MenuItemCard } from '../components/MenuItemCard'

export function Home() {
  const [activeCategory, setActiveCategory] = useState<Category>(categories[0])

  const items = useMemo(
    () => menu.filter((item) => item.category === activeCategory),
    [activeCategory],
  )

  return (
    <main className="mx-auto max-w-5xl px-4 pb-16 sm:px-6">
      <section className="py-14 text-center sm:py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">
          Small plates, big flavor
        </p>
        <h1 className="mt-3 font-display text-4xl text-ink sm:text-5xl">
          Welcome to Prime Bites
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-ink-soft">
          Elevated bites and shareable plates, crafted with premium ingredients.
          Order online for pickup or delivery.
        </p>
      </section>

      <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setActiveCategory(category)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              activeCategory === category
                ? 'border-ink bg-ink text-cream'
                : 'border-ink/15 text-ink-soft hover:border-gold hover:text-gold'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <MenuItemCard key={item.id} item={item} />
        ))}
      </div>
    </main>
  )
}
