import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ChakraProvider } from '@chakra-ui/react'
import TasteSlider from './TasteSlider'
import { I18nextProvider } from 'react-i18next'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

// Initialize i18n for tests
i18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  resources: {
    en: {
      translation: {
        tastes: {
          'basic.sweet': 'Sweet',
          'basic.salty': 'Salty',
          'basic.bitter': 'Bitter',
          'basic.sour': 'Sour',
          'basic.umami': 'Umami',
          'other.piquant': 'Piquant',
          'other.fat': 'Fat',
          'other.temperature': 'Temperature',
        },
      },
    },
  },
})

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <ChakraProvider>
      <I18nextProvider i18n={i18n}>{ui}</I18nextProvider>
    </ChakraProvider>
  )
}

describe('TasteSlider', () => {
  const defaultProps = {
    label: 'basic.sweet',
    ariaLabel: 'sweet-slider',
    value: 5,
    isChecked: true,
    checkCallback: vi.fn(),
    setValueCallback: vi.fn(),
  }

  it('renders correctly with label', () => {
    renderWithProviders(<TasteSlider {...defaultProps} />)
    expect(screen.getByText('Sweet')).toBeInTheDocument()
  })

  it('shows checkbox as checked when isChecked is true', () => {
    renderWithProviders(<TasteSlider {...defaultProps} isChecked={true} />)
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeChecked()
  })

  it('shows checkbox as unchecked when isChecked is false', () => {
    renderWithProviders(<TasteSlider {...defaultProps} isChecked={false} />)
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).not.toBeChecked()
  })

  it('calls checkCallback when checkbox is toggled', () => {
    const checkCallback = vi.fn()
    renderWithProviders(<TasteSlider {...defaultProps} checkCallback={checkCallback} />)

    const checkbox = screen.getByRole('checkbox')
    fireEvent.click(checkbox)

    expect(checkCallback).toHaveBeenCalledWith(false)
  })
})
