import { describe, it, expect } from 'vitest'
import { render, screen } from '../test/test-utils'
import DishCard from './DishCard'
import { Dish } from '../dish'
import { Section } from '../utils'

describe('DishCard', () => {
  const createMockDish = (overrides?: Partial<Dish>): Dish => ({
    name: 'Test Dish',
    description: 'A delicious test dish',
    section: Section.Appetizer,
    tastes: {
      basic: {
        sweet: 5,
        bitter: 3,
        sour: 2,
        salty: 4,
        umami: 6,
      },
      other: {
        piquant: 1,
        fat: 2,
        temperature: 37,
      },
    },
    vision: {
      colors: ['#ff0000', '#00ff00'],
      shapes: ['round', 'smooth'],
    },
    textures: ['crunchy', 'soft'],
    emotions: ['joy', 'satisfaction'],
    ...overrides,
  })

  it('renders dish name', () => {
    const dish = createMockDish()
    render(<DishCard dish={dish} />)
    expect(screen.getByText('Test Dish')).toBeInTheDocument()
  })

  it('renders dish description', () => {
    const dish = createMockDish({ description: 'My special dish' })
    render(<DishCard dish={dish} />)
    expect(screen.getByText(/My special dish/)).toBeInTheDocument()
  })

  it('renders basic taste values', () => {
    const dish = createMockDish()
    render(<DishCard dish={dish} />)

    expect(screen.getByText(/Sweet: 5/)).toBeInTheDocument()
    expect(screen.getByText(/Salty: 4/)).toBeInTheDocument()
    expect(screen.getByText(/Bitter: 3/)).toBeInTheDocument()
    expect(screen.getByText(/Sour: 2/)).toBeInTheDocument()
    expect(screen.getByText(/Umami: 6/)).toBeInTheDocument()
  })

  it('renders colors as avatars when colors are present', () => {
    const dish = createMockDish({
      vision: { colors: ['#ff0000', '#00ff00', '#0000ff'], shapes: [] },
    })
    render(<DishCard dish={dish} />)

    // Should render 3 color avatars
    const avatars = screen.getAllByRole('img', { hidden: true })
    expect(avatars.length).toBeGreaterThanOrEqual(3)
  })

  it('does not render colors section when no colors', () => {
    const dish = createMockDish({
      vision: { colors: [], shapes: [] },
    })
    const { container } = render(<DishCard dish={dish} />)

    // Avatar stack should not be visible
    const colorAvatars = container.querySelectorAll('[class*="chakra-avatar"]')
    expect(colorAvatars.length).toBe(0)
  })

  it('renders emotions when present', () => {
    const dish = createMockDish({
      emotions: ['joy', 'happiness'],
    })
    render(<DishCard dish={dish} />)

    expect(screen.getByText('joy')).toBeInTheDocument()
    expect(screen.getByText('happiness')).toBeInTheDocument()
  })

  it('renders textures when present', () => {
    const dish = createMockDish({
      textures: ['crunchy', 'soft'],
    })
    render(<DishCard dish={dish} />)

    expect(screen.getByText('crunchy')).toBeInTheDocument()
    expect(screen.getByText('soft')).toBeInTheDocument()
  })

  it('renders shapes when present', () => {
    const dish = createMockDish({
      vision: { colors: [], shapes: ['round', 'smooth'] },
    })
    render(<DishCard dish={dish} />)

    expect(screen.getByText('round')).toBeInTheDocument()
    expect(screen.getByText('smooth')).toBeInTheDocument()
  })

  it('handles dish with no section gracefully', () => {
    const dish = createMockDish({ section: Section.None })
    render(<DishCard dish={dish} />)

    // Should not show "None, " prefix
    expect(screen.getByText('Test Dish')).toBeInTheDocument()
  })

  it('handles dish with null description', () => {
    const dish = createMockDish({ description: null })
    render(<DishCard dish={dish} />)

    expect(screen.getByText('Test Dish')).toBeInTheDocument()
  })
})
