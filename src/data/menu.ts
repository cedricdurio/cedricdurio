export type MenuItem = {
  id: string
  name: string
  description: string
  price: number
  category: Category
  emoji: string
  tags?: string[]
}

export type Category = 'Starters' | 'Signature Bites' | 'Mains' | 'Drinks' | 'Desserts'

export const categories: Category[] = [
  'Signature Bites',
  'Starters',
  'Mains',
  'Drinks',
  'Desserts',
]

export const menu: MenuItem[] = [
  {
    id: 'truffle-arancini',
    name: 'Truffle Arancini',
    description: 'Crispy risotto balls, black truffle, parmesan fonduta.',
    price: 12.5,
    category: 'Signature Bites',
    emoji: '🍙',
    tags: ['Popular'],
  },
  {
    id: 'wagyu-sliders',
    name: 'Wagyu Sliders',
    description: 'Trio of wagyu beef sliders, smoked cheddar, caramelized onion.',
    price: 16,
    category: 'Signature Bites',
    emoji: '🍔',
    tags: ['Popular'],
  },
  {
    id: 'tuna-tartare-cones',
    name: 'Tuna Tartare Cones',
    description: 'Ahi tuna, avocado, sesame crisp cones, yuzu aioli.',
    price: 14,
    category: 'Signature Bites',
    emoji: '🍣',
  },
  {
    id: 'crispy-brussels',
    name: 'Crispy Brussels Sprouts',
    description: 'Charred sprouts, chili glaze, candied pecans.',
    price: 10,
    category: 'Starters',
    emoji: '🥬',
  },
  {
    id: 'burrata',
    name: 'Burrata & Heirloom Tomato',
    description: 'Creamy burrata, basil oil, aged balsamic, sourdough crostini.',
    price: 13,
    category: 'Starters',
    emoji: '🍅',
  },
  {
    id: 'lobster-bisque',
    name: 'Lobster Bisque',
    description: 'Silky bisque, brandy cream, chive oil.',
    price: 11,
    category: 'Starters',
    emoji: '🦞',
  },
  {
    id: 'filet-mignon',
    name: '8oz Filet Mignon',
    description: 'Grilled filet, roasted garlic butter, truffle mash.',
    price: 38,
    category: 'Mains',
    emoji: '🥩',
    tags: ['Chef\'s Pick'],
  },
  {
    id: 'seared-salmon',
    name: 'Seared Salmon',
    description: 'Miso glaze, charred bok choy, jasmine rice.',
    price: 27,
    category: 'Mains',
    emoji: '🐟',
  },
  {
    id: 'mushroom-risotto',
    name: 'Wild Mushroom Risotto',
    description: 'Arborio rice, mixed wild mushrooms, white truffle oil.',
    price: 22,
    category: 'Mains',
    emoji: '🍄',
  },
  {
    id: 'old-fashioned',
    name: 'Prime Old Fashioned',
    description: 'Bourbon, demerara, orange bitters, smoked cherry.',
    price: 14,
    category: 'Drinks',
    emoji: '🥃',
  },
  {
    id: 'sparkling-rose',
    name: 'Sparkling Rosé',
    description: 'Glass of house sparkling rosé.',
    price: 12,
    category: 'Drinks',
    emoji: '🥂',
  },
  {
    id: 'citrus-mocktail',
    name: 'Citrus Mocktail',
    description: 'Blood orange, rosemary, soda, fresh mint.',
    price: 8,
    category: 'Drinks',
    emoji: '🍹',
  },
  {
    id: 'chocolate-souffle',
    name: 'Chocolate Soufflé',
    description: 'Warm dark chocolate soufflé, vanilla bean ice cream.',
    price: 12,
    category: 'Desserts',
    emoji: '🍫',
    tags: ['Popular'],
  },
  {
    id: 'creme-brulee',
    name: 'Crème Brûlée',
    description: 'Classic vanilla bean custard, caramelized sugar crust.',
    price: 10,
    category: 'Desserts',
    emoji: '🍮',
  },
]
