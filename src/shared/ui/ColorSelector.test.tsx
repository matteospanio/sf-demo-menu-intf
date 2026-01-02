import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '../../test/test-utils'
import ColorSelector from './ColorSelector'

describe('ColorSelector', () => {
  const defaultProps = {
    label: 'Color 1',
    value: '#ff0000',
    isChecked: true,
    checkHandler: vi.fn(),
    colorSetter: vi.fn(),
  }

  it('renders with label', () => {
    render(<ColorSelector {...defaultProps} />)
    expect(screen.getByText('Color 1')).toBeInTheDocument()
  })

  it('shows checkbox as checked when isChecked is true', () => {
    render(<ColorSelector {...defaultProps} isChecked={true} />)
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeChecked()
  })

  it('shows checkbox as unchecked when isChecked is false', () => {
    render(<ColorSelector {...defaultProps} isChecked={false} />)
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).not.toBeChecked()
  })

  it('calls checkHandler when checkbox is clicked', () => {
    const checkHandler = vi.fn()
    render(<ColorSelector {...defaultProps} checkHandler={checkHandler} />)

    const checkbox = screen.getByRole('checkbox')
    fireEvent.click(checkbox)

    expect(checkHandler).toHaveBeenCalledWith(false)
  })

  it('color input is disabled when isChecked is false', () => {
    render(<ColorSelector {...defaultProps} isChecked={false} />)
    const colorInput = document.querySelector('input[type="color"]')
    expect(colorInput).toBeDisabled()
  })

  it('color input is enabled when isChecked is true', () => {
    render(<ColorSelector {...defaultProps} isChecked={true} />)
    const colorInput = document.querySelector('input[type="color"]')
    expect(colorInput).not.toBeDisabled()
  })

  it('calls colorSetter when color is changed', () => {
    const colorSetter = vi.fn()
    render(<ColorSelector {...defaultProps} colorSetter={colorSetter} />)

    const colorInput = document.querySelector('input[type="color"]') as HTMLInputElement
    fireEvent.change(colorInput, { target: { value: '#00ff00' } })

    expect(colorSetter).toHaveBeenCalledWith('#00ff00')
  })

  it('displays the correct color value', () => {
    render(<ColorSelector {...defaultProps} value="#0000ff" />)
    const colorInput = document.querySelector('input[type="color"]') as HTMLInputElement
    expect(colorInput.value).toBe('#0000ff')
  })
})
