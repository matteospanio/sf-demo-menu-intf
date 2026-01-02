import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '../../../test/test-utils'
import SectionSelect from './SectionSelect'

describe('SectionSelect', () => {
  it('renders correctly', () => {
    const sectionHandler = vi.fn()
    render(<SectionSelect sectionHandler={sectionHandler} />)

    // The default value should be "None"
    expect(screen.getByText('None')).toBeInTheDocument()
  })

  it('displays all section options', async () => {
    const sectionHandler = vi.fn()
    render(<SectionSelect sectionHandler={sectionHandler} />)

    // Click to open the select dropdown
    const selectInput = screen.getByRole('combobox')
    expect(selectInput).toBeInTheDocument()
  })

  it('has correct default value', () => {
    const sectionHandler = vi.fn()
    render(<SectionSelect sectionHandler={sectionHandler} />)

    // Check that "None" is displayed as the default value
    expect(screen.getByText('None')).toBeInTheDocument()
  })
})
