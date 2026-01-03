import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '../../test/test-utils'
import userEvent from '@testing-library/user-event'
import MenuBar from './MenuBar'
import type { User } from '../../api'
import { API_BASE_URL } from '../../api'

type UseAuthReturn = { user: User | null; logout: () => Promise<void> }

const mockUseAuth = vi.fn<() => UseAuthReturn>()

vi.mock('../../features/auth', () => ({
  useAuth: () => mockUseAuth(),
}))

describe('MenuBar', () => {
  const defaultProps = {
    onGoToMenus: vi.fn(),
    onGoToNewMenu: vi.fn(),
    onGoToProfile: vi.fn(),
    onGoToSettings: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('does not show admin link for normal users', async () => {
    const user = userEvent.setup()
    mockUseAuth.mockReturnValue({
      user: {
        id: 1,
        username: 'alice',
        role: 'user',
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
      },
      logout: vi.fn().mockResolvedValue(undefined),
    })

    render(<MenuBar {...defaultProps} />)

    // Open mobile drawer
    await user.click(screen.getByRole('button', { name: /open menu/i }))

    expect(screen.queryByText(/admin area/i)).not.toBeInTheDocument()
  })

  it('shows admin link for admin users and points to backend /admin', async () => {
    const user = userEvent.setup()
    mockUseAuth.mockReturnValue({
      user: {
        id: 2,
        username: 'bob',
        role: 'admin',
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
      },
      logout: vi.fn().mockResolvedValue(undefined),
    })

    render(<MenuBar {...defaultProps} />)

    await user.click(screen.getByRole('button', { name: /open menu/i }))

    const adminLink = (await screen.findByRole('link', { name: /admin area/i })) as HTMLAnchorElement
    expect(adminLink.href).toBe(new URL('/admin', API_BASE_URL).toString())
  })

  it('shows admin link for manager users', async () => {
    const user = userEvent.setup()
    mockUseAuth.mockReturnValue({
      user: {
        id: 3,
        username: 'carol',
        role: 'manager',
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
      },
      logout: vi.fn().mockResolvedValue(undefined),
    })

    render(<MenuBar {...defaultProps} />)

    await user.click(screen.getByRole('button', { name: /open menu/i }))

    expect(await screen.findByRole('link', { name: /admin area/i })).toBeInTheDocument()
  })
})
