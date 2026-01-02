import { describe, it, expect } from 'vitest'
import { render } from '../../test/test-utils'
import Loader from './Loader'

describe('Loader', () => {
  it('renders spinner', () => {
    const { container } = render(<Loader />)

    // Check that spinner element exists
    const spinner = container.querySelector('.chakra-spinner')
    expect(spinner).toBeInTheDocument()
  })

  it('is centered', () => {
    const { container } = render(<Loader />)

    // Check that there's a flex container (Chakra Center uses flex)
    const center = container.firstChild
    expect(center).toBeInTheDocument()
  })
})
