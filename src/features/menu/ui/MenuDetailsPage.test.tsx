import { describe, expect, it, vi, beforeEach } from 'vitest'
import { useCallback, useState } from 'react'
import { render, screen, waitFor } from '../../../test/test-utils'
import MenuDetailsPage from './MenuDetailsPage'

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
    dishService: {
      listByMenu: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  }
})

import { dishService, menuService } from '../../../api'

describe('MenuDetailsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('loads menu details sending dishes request only once (even if onMenuLoaded identity changes)', async () => {
    vi.mocked(menuService.get).mockResolvedValue({
      id: 123,
      title: 'Menu A',
      description: 'Desc A',
      dish_count: 1,
    })

    vi.mocked(dishService.listByMenu).mockResolvedValue([
      {
        id: 1,
        name: 'Dish 1',
        description: '',
        section: 'Appetizer',
        sweet: 0,
        salty: 0,
        bitter: 0,
        sour: 0,
        umami: 0,
        piquant: 0,
        fat: 0,
        temperature: 0,
        emotions: [],
        textures: [],
        shapes: [],
        colors: [],
      },
    ])

    const Wrapper = () => {
      const [cbVersion, setCbVersion] = useState(0)
      const onLoaded0 = useCallback(() => setCbVersion(1), [])
      const onLoaded1 = useCallback(() => {}, [])

      return (
        <>
          <div data-testid="cb-version">{cbVersion}</div>
          <MenuDetailsPage
            menuId={123}
            onBack={() => {}}
            onEdit={() => {}}
            onDeleted={() => {}}
            onMenuLoaded={cbVersion === 0 ? onLoaded0 : onLoaded1}
          />
        </>
      )
    }

    render(<Wrapper />)

    expect(await screen.findByText('Menu A')).toBeInTheDocument()
    expect(await screen.findByText('Dish 1')).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByTestId('cb-version')).toHaveTextContent('1')
    })

    await waitFor(() => {
      expect(menuService.get).toHaveBeenCalledTimes(1)
      expect(dishService.listByMenu).toHaveBeenCalledTimes(1)
    })

    expect(menuService.get).toHaveBeenCalledWith(123)
    expect(dishService.listByMenu).toHaveBeenCalledWith(123)
  })
})
