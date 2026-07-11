export type Location = {
  id: string
  name: string
  address: string
  city: string
  zip: string
  hours: string
  deliveryZips: string[]
}

export const locations: Location[] = [
  {
    id: 'downtown-market',
    name: 'Prime Bites — Downtown Market',
    address: '123 Market Street',
    city: 'San Francisco, CA',
    zip: '94103',
    hours: 'Daily 5pm–11pm',
    deliveryZips: ['94103', '94102', '94107', '94105', '94110'],
  },
  {
    id: 'uptown-terrace',
    name: 'Prime Bites — Uptown Terrace',
    address: '450 8th Avenue',
    city: 'New York, NY',
    zip: '10001',
    hours: 'Daily 5pm–midnight',
    deliveryZips: ['10001', '10011', '10003', '10009', '10018'],
  },
  {
    id: 'lakeside-ave',
    name: 'Prime Bites — Lakeside Ave',
    address: '77 Wacker Drive',
    city: 'Chicago, IL',
    zip: '60601',
    hours: 'Daily 4pm–11pm',
    deliveryZips: ['60601', '60602', '60607', '60614', '60654'],
  },
  {
    id: 'harbor-point',
    name: 'Prime Bites — Harbor Point',
    address: '900 Wilshire Blvd',
    city: 'Los Angeles, CA',
    zip: '90017',
    hours: 'Daily 5pm–11pm',
    deliveryZips: ['90017', '90012', '90013', '90026', '90005'],
  },
]

export function findNearestLocation(zip: string): Location {
  const zipNum = parseInt(zip, 10)
  return locations.reduce((nearest, candidate) => {
    const nearestDiff = Math.abs(parseInt(nearest.zip, 10) - zipNum)
    const candidateDiff = Math.abs(parseInt(candidate.zip, 10) - zipNum)
    return candidateDiff < nearestDiff ? candidate : nearest
  }, locations[0])
}

export function deliversTo(location: Location, zip: string): boolean {
  return location.deliveryZips.includes(zip)
}
