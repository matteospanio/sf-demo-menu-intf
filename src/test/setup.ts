import '@testing-library/jest-dom'
import { afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'

const focusVisibleMock = {
  trackFocusVisible: () => () => {},
  trackInteractionModality: () => () => {},
  setInteractionModality: () => {},
  getInteractionModality: () => null,
}

vi.mock('@zag-js/focus-visible', () => focusVisibleMock)

// Cleanup after each test
afterEach(() => {
  cleanup()
})

// Mock IntersectionObserver
const mockIntersectionObserver = vi.fn()
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
})
window.IntersectionObserver = mockIntersectionObserver

// Mock ResizeObserver with proper constructor
class MockResizeObserver {
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
}
window.ResizeObserver = MockResizeObserver as unknown as typeof ResizeObserver

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock scrollTo
window.scrollTo = vi.fn()

// Mock getComputedStyle for Chakra UI
const originalGetComputedStyle = window.getComputedStyle
window.getComputedStyle = (element: Element) => {
  return originalGetComputedStyle(element)
}

// Chakra UI (via @zag-js/focus-visible) may attempt to patch HTMLElement.prototype.focus.
// Some jsdom versions expose focus as a getter-only property; make it writable for tests.
try {
  const desc = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'focus')
  if (!desc || desc.writable !== true) {
    Object.defineProperty(HTMLElement.prototype, 'focus', {
      configurable: true,
      writable: true,
      value: vi.fn(),
    })
  }
} catch {
  // Ignore if the runtime prevents redefining.
}

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

// Suppress console errors for expected test warnings
const originalConsoleError = console.error
console.error = (...args) => {
  if (
    typeof args[0] === 'string' &&
    (args[0].includes('Warning: ReactDOM.render') ||
      args[0].includes('Warning: An update to') ||
      args[0].includes('act(...)'))
  ) {
    return
  }
  originalConsoleError.call(console, ...args)
}
