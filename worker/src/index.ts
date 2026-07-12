export interface Env {
  YELP_API_KEY: string
  ALLOWED_ORIGIN?: string
}

type YelpBusiness = {
  id: string
  name: string
  image_url?: string
  url?: string
  review_count?: number
  categories?: { alias: string; title: string }[]
  rating?: number
  price?: string
  location: {
    address1?: string
    city?: string
    state?: string
    zip_code?: string
  }
}

const CATEGORY_EMOJI: Record<string, string> = {
  italian: '🍝',
  chinese: '🥡',
  japanese: '🍜',
  sushi: '🍣',
  mexican: '🌮',
  bbq: '🍖',
  pizza: '🍕',
  vegan: '🥗',
  vegetarian: '🥗',
  cafes: '☕',
  coffee: '☕',
  bakeries: '🥐',
  seafood: '🦞',
  steak: '🥩',
  indpak: '🍛',
  thai: '🍜',
  korean: '🍲',
  ramen: '🍜',
  burgers: '🍔',
  breakfast_brunch: '🥞',
  french: '🥖',
  mediterranean: '🥙',
}

function mapBusiness(b: YelpBusiness) {
  const categoryAlias = b.categories?.[0]?.alias ?? ''
  return {
    id: b.id,
    name: b.name,
    cuisine: b.categories?.[0]?.title ?? 'Restaurant',
    priceRange: (b.price as '$' | '$$' | '$$$' | '$$$$' | undefined) ?? '$$',
    address: b.location.address1 ?? '',
    city: [b.location.city, b.location.state].filter(Boolean).join(', '),
    zip: b.location.zip_code ?? '',
    emoji: CATEGORY_EMOJI[categoryAlias] ?? '🍽️',
    description: '',
    imageUrl: b.image_url || undefined,
    yelpRating: b.rating,
    yelpReviewCount: b.review_count,
    yelpUrl: b.url,
  }
}

function corsHeaders(env: Env): HeadersInit {
  return {
    'Access-Control-Allow-Origin': env.ALLOWED_ORIGIN || '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }
}

function json(data: unknown, status: number, env: Env): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders(env) },
  })
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders(env) })
    }

    const url = new URL(request.url)

    if (url.pathname === '/restaurants') {
      const zip = url.searchParams.get('zip')
      if (!zip || !/^\d{5}$/.test(zip)) {
        return json({ error: 'A valid 5-digit zip query param is required.' }, 400, env)
      }

      const yelpUrl = new URL('https://api.yelp.com/v3/businesses/search')
      yelpUrl.searchParams.set('location', zip)
      yelpUrl.searchParams.set('term', 'restaurants')
      yelpUrl.searchParams.set('limit', '20')
      yelpUrl.searchParams.set('sort_by', 'best_match')

      const yelpRes = await fetch(yelpUrl, {
        headers: { Authorization: `Bearer ${env.YELP_API_KEY}` },
      })

      if (!yelpRes.ok) {
        return json(
          { error: 'Could not fetch restaurants for that zip code.' },
          502,
          env,
        )
      }

      const data = (await yelpRes.json()) as { businesses: YelpBusiness[] }
      return json({ restaurants: data.businesses.map(mapBusiness) }, 200, env)
    }

    if (url.pathname.startsWith('/restaurants/')) {
      const id = url.pathname.replace('/restaurants/', '')
      if (!id) return json({ error: 'Missing business id.' }, 400, env)

      const yelpRes = await fetch(`https://api.yelp.com/v3/businesses/${id}`, {
        headers: { Authorization: `Bearer ${env.YELP_API_KEY}` },
      })

      if (!yelpRes.ok) {
        return json({ error: 'Restaurant not found.' }, 404, env)
      }

      const business = (await yelpRes.json()) as YelpBusiness
      return json({ restaurant: mapBusiness(business) }, 200, env)
    }

    return json({ error: 'Not found.' }, 404, env)
  },
}
