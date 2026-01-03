import { describe, expect, it, vi, beforeEach } from 'vitest'
import userEvent from '@testing-library/user-event'
import { render, screen } from '../../../test/test-utils'
import MenuSettingsPage from './MenuSettingsPage'

vi.mock('@chakra-ui/react', async () => {
  const actual = await vi.importActual<typeof import('@chakra-ui/react')>('@chakra-ui/react')

  return {
    ...actual,
    Switch: (props: {
      'aria-label'?: string
      isChecked?: boolean
      onChange?: React.ChangeEventHandler<HTMLInputElement>
    }) => (
      <input
        type="checkbox"
        aria-label={props['aria-label']}
        checked={Boolean(props.isChecked)}
        onChange={props.onChange}
      />
    ),
  }
})

describe('MenuSettingsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('toggles dark mode and persists setting', async () => {
    const user = userEvent.setup()

    render(<MenuSettingsPage onBack={() => {}} />)

    const toggle = screen.getByRole('checkbox', { name: 'Dark mode' })
    expect(toggle).toBeInTheDocument()

    await user.click(toggle)

    const calls = vi.mocked(window.localStorage.setItem).mock.calls
    const last = calls.at(-1)
    expect(last?.[0]).toBe('sf_client_settings')

    const parsed = JSON.parse(String(last?.[1])) as { colorMode?: string }
    expect(parsed.colorMode).toBe('dark')
  })

  it('changes language and persists setting', async () => {
    const user = userEvent.setup()

    render(<MenuSettingsPage onBack={() => {}} />)

    const languageSelect = screen.getByRole('combobox')
    await user.click(languageSelect)

    // Options are flags (🇮🇹 / 🇬🇧)
    await user.click(await screen.findByText('🇮🇹'))

    const calls = vi.mocked(window.localStorage.setItem).mock.calls
    const last = calls.at(-1)
    expect(last?.[0]).toBe('sf_client_settings')

    const parsed = JSON.parse(String(last?.[1])) as { language?: string }
    expect(parsed.language).toBe('it')
  })
})
