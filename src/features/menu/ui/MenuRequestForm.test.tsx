import { describe, expect, it, vi, beforeEach } from 'vitest'
import userEvent from '@testing-library/user-event'
import { render, screen, waitFor } from '../../../test/test-utils'
import MenuRequestForm from './MenuRequestForm'

// Mock the API services
vi.mock('../../../api', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../../api')>()

  return {
    ...actual,
    menuService: {
      list: vi.fn(),
      delete: vi.fn(),
      get: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      submit: vi.fn(),
    },
    dishService: {
      listByMenu: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    attributeService: {
      getEmotions: vi.fn().mockResolvedValue([
        { id: 1, description: 'joy' },
        { id: 2, description: 'sadness' },
      ]),
      getTextures: vi.fn().mockResolvedValue([
        { id: 1, description: 'crunchy' },
        { id: 2, description: 'soft' },
      ]),
      getShapes: vi.fn().mockResolvedValue([
        { id: 1, description: 'round' },
        { id: 2, description: 'sharp' },
      ]),
    },
  }
})

import { menuService, dishService } from '../../../api'

describe('MenuRequestForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(menuService.create).mockResolvedValue({ message: 'created', id: 1 })
    vi.mocked(menuService.update).mockResolvedValue({ message: 'updated' })
    vi.mocked(menuService.submit).mockResolvedValue({ message: 'submitted' })
    vi.mocked(dishService.create).mockResolvedValue({ message: 'created', id: 1 })
  })

  describe('Save draft functionality', () => {
    it('renders the save draft button', async () => {
      render(<MenuRequestForm />)

      // Wait for attributes to load
      await waitFor(() => {
        expect(screen.queryByText('Loading attributes from server...')).not.toBeInTheDocument()
      })

      expect(screen.getByRole('button', { name: /save draft/i })).toBeInTheDocument()
    })

    it('shows error toast when saving draft without title', async () => {
      const user = userEvent.setup()
      render(<MenuRequestForm />)

      // Wait for attributes to load
      await waitFor(() => {
        expect(screen.queryByText('Loading attributes from server...')).not.toBeInTheDocument()
      })

      // Try to save draft without title
      await user.click(screen.getByRole('button', { name: /save draft/i }))

      // Should show error toast (menu title required)
      await waitFor(() => {
        expect(screen.getByText('Menu title is required')).toBeInTheDocument()
      })
    })

    it('saves menu as draft with only title (no dishes required)', async () => {
      const user = userEvent.setup()
      render(<MenuRequestForm />)

      // Wait for attributes to load
      await waitFor(() => {
        expect(screen.queryByText('Loading attributes from server...')).not.toBeInTheDocument()
      })

      // Enter only the title (no dishes)
      const titleInput = screen.getByRole('textbox', { name: /menu title/i })
      await user.type(titleInput, 'My Draft Menu')

      // Click save draft
      await user.click(screen.getByRole('button', { name: /save draft/i }))

      // Verify menu was created
      await waitFor(() => {
        expect(menuService.create).toHaveBeenCalledWith({
          title: 'My Draft Menu',
          description: undefined,
        })
      })

      // Should show success toast
      await waitFor(() => {
        expect(screen.getByText('Draft saved')).toBeInTheDocument()
      })
    })

    it('saves menu as draft with title and description', async () => {
      const user = userEvent.setup()
      render(<MenuRequestForm />)

      // Wait for attributes to load
      await waitFor(() => {
        expect(screen.queryByText('Loading attributes from server...')).not.toBeInTheDocument()
      })

      // Enter title and description
      const titleInput = screen.getByRole('textbox', { name: /menu title/i })
      const descInput = screen.getByRole('textbox', { name: /description/i })
      await user.type(titleInput, 'My Draft Menu')
      await user.type(descInput, 'A description of my menu')

      // Click save draft
      await user.click(screen.getByRole('button', { name: /save draft/i }))

      // Verify menu was created with description
      await waitFor(() => {
        expect(menuService.create).toHaveBeenCalledWith({
          title: 'My Draft Menu',
          description: 'A description of my menu',
        })
      })
    })

    it('does not require dishes when saving as draft', async () => {
      const user = userEvent.setup()
      render(<MenuRequestForm />)

      // Wait for attributes to load
      await waitFor(() => {
        expect(screen.queryByText('Loading attributes from server...')).not.toBeInTheDocument()
      })

      // Enter only title (no dishes)
      const titleInput = screen.getByRole('textbox', { name: /menu title/i })
      await user.type(titleInput, 'Draft Without Dishes')

      // Save draft should succeed without dishes
      await user.click(screen.getByRole('button', { name: /save draft/i }))

      // Should NOT show "dishes required" error
      await waitFor(() => {
        expect(screen.queryByText('Dishes are required')).not.toBeInTheDocument()
      })

      // Should show success toast
      await waitFor(() => {
        expect(screen.getByText('Draft saved')).toBeInTheDocument()
      })
    })
  })

  describe('Submit functionality', () => {
    it('requires dishes when submitting (not draft)', async () => {
      const user = userEvent.setup()
      render(<MenuRequestForm />)

      // Wait for attributes to load
      await waitFor(() => {
        expect(screen.queryByText('Loading attributes from server...')).not.toBeInTheDocument()
      })

      // Enter title
      const titleInput = screen.getByRole('textbox', { name: /menu title/i })
      await user.type(titleInput, 'My Menu')

      // Try to submit without dishes
      await user.click(screen.getByRole('button', { name: /^submit$/i }))

      // Should show error toast for missing dishes
      await waitFor(() => {
        expect(screen.getByText('Dishes are required')).toBeInTheDocument()
      })
    })

    it('requires title when submitting', async () => {
      const user = userEvent.setup()
      render(<MenuRequestForm />)

      // Wait for attributes to load
      await waitFor(() => {
        expect(screen.queryByText('Loading attributes from server...')).not.toBeInTheDocument()
      })

      // Try to submit without title
      await user.click(screen.getByRole('button', { name: /^submit$/i }))

      // Should show error toast for missing title
      await waitFor(() => {
        expect(screen.getByText('Menu title is required')).toBeInTheDocument()
      })
    })
  })

  describe('Draft vs Submission difference', () => {
    it('draft allows saving with title only, submission requires dishes', async () => {
      const user = userEvent.setup()
      render(<MenuRequestForm />)

      // Wait for attributes to load
      await waitFor(() => {
        expect(screen.queryByText('Loading attributes from server...')).not.toBeInTheDocument()
      })

      // Enter only title
      const titleInput = screen.getByRole('textbox', { name: /menu title/i })
      await user.type(titleInput, 'Test Menu')

      // Saving as draft should succeed
      await user.click(screen.getByRole('button', { name: /save draft/i }))

      await waitFor(() => {
        expect(menuService.create).toHaveBeenCalled()
      })

      // Clear the menu create mock for the next test
      vi.mocked(menuService.create).mockClear()

      // Now try to submit - should fail due to no dishes
      await user.click(screen.getByRole('button', { name: /^submit$/i }))

      await waitFor(() => {
        expect(screen.getByText('Dishes are required')).toBeInTheDocument()
      })
    })
  })
})
