import { filterCars, sortCars } from '@/lib/filters'

const mockCars = [
  {
    id: '1',
    name: 'Tesla Model 3',
    brand: 'Tesla',
    model: 'Model 3',
    category: 'electrique',
    rating: 4.5,
    price_per_day: 150,
    image_url: '',
    specs: {},
    description: '',
    year: 2024,
    is_available: true,
    images: [],
    weight_kg: 1800,
    length_cm: 469,
    width_cm: 185,
    height_cm: 144,
    comfort_level: 4,
    finish_level: 5,
    created_at: '2024-01-01',
  },
  {
    id: '2',
    name: 'BMW Série 3',
    brand: 'BMW',
    model: 'Série 3',
    category: 'berline',
    rating: 4.8,
    price_per_day: 200,
    image_url: '',
    specs: {},
    description: '',
    year: 2024,
    is_available: true,
    images: [],
    weight_kg: 1600,
    length_cm: 470,
    width_cm: 182,
    height_cm: 143,
    comfort_level: 5,
    finish_level: 5,
    created_at: '2024-01-02',
  },
  {
    id: '3',
    name: 'Fiat 500',
    brand: 'Fiat',
    model: '500',
    category: 'citadine',
    rating: 4.2,
    price_per_day: 50,
    image_url: '',
    specs: {},
    description: '',
    year: 2023,
    is_available: false,
    images: [],
    weight_kg: 1100,
    length_cm: 357,
    width_cm: 163,
    height_cm: 149,
    comfort_level: 3,
    finish_level: 3,
    created_at: '2024-01-03',
  },
]

describe('filterCars', () => {
  it('filters by search query on name', () => {
    const result = filterCars(mockCars, 'Tesla', { categories: [] })
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('Tesla Model 3')
  })

  it('filters by search query on brand', () => {
    const result = filterCars(mockCars, 'BMW', { categories: [] })
    expect(result).toHaveLength(1)
    expect(result[0].brand).toBe('BMW')
  })

  it('filters by category', () => {
    const result = filterCars(mockCars, '', { categories: ['electrique'] })
    expect(result).toHaveLength(1)
    expect(result[0].category).toBe('electrique')
  })

  it('filters by multiple categories', () => {
    const result = filterCars(mockCars, '', { categories: ['electrique', 'berline'] })
    expect(result).toHaveLength(2)
  })

  it('filters by minimum rating', () => {
    const result = filterCars(mockCars, '', { categories: [], minRating: 4.5 })
    expect(result).toHaveLength(2)
  })

  it('returns all cars with no filters', () => {
    const result = filterCars(mockCars, '', { categories: [] })
    expect(result).toHaveLength(3)
  })

  it('combines search query and category filter', () => {
    const result = filterCars(mockCars, 'Model', { categories: ['electrique'] })
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('Tesla Model 3')
  })
})

describe('sortCars', () => {
  it('sorts by name ascending', () => {
    const result = sortCars(mockCars, 'name')
    expect(result[0].name).toBe('BMW Série 3')
    expect(result[2].name).toBe('Tesla Model 3')
  })

  it('sorts by rating descending', () => {
    const result = sortCars(mockCars, 'rating')
    expect(result[0].rating).toBe(4.8)
    expect(result[2].rating).toBe(4.2)
  })

  it('sorts by newest first', () => {
    const result = sortCars(mockCars, 'newest')
    expect(result[0].id).toBe('3')
    expect(result[2].id).toBe('1')
  })
})
