import { render, screen } from '@testing-library/react'
import CarCard from '@/components/CarCard'

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, initial, animate, transition, whileHover, whileTap, ...props }: any) => (
      <div {...props}>{children}</div>
    ),
  },
}))

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ fill, priority, loading, sizes, ...props }: any) => <img {...props} />,
}))

// Mock next/link
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}))

// Mock FavoriteButton
jest.mock('@/components/FavoriteButton', () => ({
  __esModule: true,
  default: () => <button>Favorite</button>,
}))

const mockCar = {
  id: '1',
  name: 'Tesla Model 3',
  brand: 'Tesla',
  model: 'Model 3',
  image_url: 'https://example.com/tesla.jpg',
  price_per_day: 150,
  rating: 4.5,
  category: 'electrique',
  specs: {
    transmission: 'Automatique',
    fuel: 'Électrique',
    seats: 5,
    doors: 4,
  },
  description: 'Voiture électrique performante',
  year: 2024,
  is_available: true,
  images: [],
  weight_kg: 1800,
  length_cm: 469,
  width_cm: 185,
  height_cm: 144,
  comfort_level: 4,
  finish_level: 5,
  created_at: new Date().toISOString(),
}

describe('CarCard', () => {
  it('renders car name correctly', () => {
    render(<CarCard car={mockCar} />)
    expect(screen.getByRole('heading', { name: 'Tesla Model 3' })).toBeInTheDocument()
  })

  it('renders car brand and model', () => {
    render(<CarCard car={mockCar} />)
    expect(screen.getByText('Tesla Model 3', { selector: 'p' })).toBeInTheDocument()
  })

  it('renders rating', () => {
    render(<CarCard car={mockCar} />)
    expect(screen.getByText('4.5')).toBeInTheDocument()
  })

  it('renders reserve button', () => {
    render(<CarCard car={mockCar} />)
    expect(screen.getByText('Réserver')).toBeInTheDocument()
  })

  it('renders car image with correct alt text', () => {
    render(<CarCard car={mockCar} />)
    const image = screen.getByAltText('Tesla Model 3')
    expect(image).toBeInTheDocument()
  })

  it('links to correct car detail page', () => {
    render(<CarCard car={mockCar} />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/cars/1')
  })
})
