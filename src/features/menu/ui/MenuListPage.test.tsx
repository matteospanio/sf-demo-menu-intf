import { describe, expect, it, vi, beforeEach } from 'vitest'
import userEvent from '@testing-library/user-event'
import { render, screen, waitFor } from '../../../test/test-utils'
import MenuListPage from './MenuListPage'

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
    },
  }
})

import { menuService } from '../../../api'

describe('MenuListPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders empty state when there are no menus', async () => {
    vi.mocked(menuService.list).mockResolvedValue([])

    render(
      <MenuListPage
        onCreateNew={() => {}}
        onViewMenu={() => {}}
        onEditMenu={() => {}}
      />
    )

    expect(await screen.findByText('No menus yet')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'New menu request' })).toBeInTheDocument()
  })

  it('renders menus and triggers view/edit callbacks', async () => {
    vi.mocked(menuService.list).mockResolvedValue([
      { id: 10, title: 'Menu A', description: 'Desc A', dish_count: 2, status: 'draft', created_at: '2026-01-03T10:30:00+00:00', updated_at: '2026-01-03T12:45:00+00:00' },
      { id: 2, title: 'Menu B', description: '', dish_count: 0, status: 'submitted', created_at: '2026-01-03T10:30:00+00:00', updated_at: '2026-01-03T12:45:00+00:00' },
    ])

    const onViewMenu = vi.fn()
    const onEditMenu = vi.fn()

    render(
      <MenuListPage
        onCreateNew={() => {}}
        onViewMenu={onViewMenu}
        onEditMenu={onEditMenu}
      />
    )

    expect(await screen.findByText('Menu A')).toBeInTheDocument()

    const viewButtons = screen.getAllByRole('button', { name: 'View' })
    await userEvent.click(viewButtons[0])
    expect(onViewMenu).toHaveBeenCalledWith(10, 'Menu A')

    const editButtons = screen.getAllByRole('button', { name: 'Edit' })
    await userEvent.click(editButtons[0])
    expect(onEditMenu).toHaveBeenCalledWith(10, 'Menu A')
  })

  it('deletes a menu after confirmation', async () => {
    vi.mocked(menuService.list).mockResolvedValue([
      { id: 7, title: 'Menu X', description: 'Desc', dish_count: 1, status: 'draft', created_at: '2026-01-03T10:30:00+00:00', updated_at: '2026-01-03T12:45:00+00:00' },
    ])
    vi.mocked(menuService.delete).mockResolvedValue({ message: 'ok' })

    render(
      <MenuListPage
        onCreateNew={() => {}}
        onViewMenu={() => {}}
        onEditMenu={() => {}}
      />
    )

    expect(await screen.findByText('Menu X')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Delete' }))
    expect(await screen.findByText('Delete menu')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Delete' }))

    await waitFor(() => {
      expect(menuService.delete).toHaveBeenCalledWith(7)
    })

    await waitFor(() => {
      expect(screen.queryByText('Menu X')).not.toBeInTheDocument()
    })
  })
})
