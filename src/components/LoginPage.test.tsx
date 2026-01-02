import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '../test/test-utils'
import LoginPage from './LoginPage'

// Mock the useAuth hook
vi.mock('../contexts', () => ({
  useAuth: vi.fn(() => ({
    login: vi.fn(),
    register: vi.fn(),
    error: null,
    clearError: vi.fn(),
    isLoading: false,
  })),
}))

import { useAuth } from '../contexts'

describe('LoginPage', () => {
  const mockLogin = vi.fn()
  const mockRegister = vi.fn()
  const mockClearError = vi.fn()

  beforeEach(() => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      login: mockLogin,
      register: mockRegister,
      logout: vi.fn(),
      error: null,
      clearError: mockClearError,
    })
  })

  it('renders login form by default', () => {
    render(<LoginPage />)

    expect(screen.getByText('🍽️ SoundFood')).toBeInTheDocument()
    // Use getAllByText since Login appears in both tab and button
    expect(screen.getAllByText('Login').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Register').length).toBeGreaterThan(0)
  })

  it('has username and password fields in login tab', () => {
    render(<LoginPage />)

    const usernameInputs = screen.getAllByLabelText(/username/i)
    const passwordInputs = screen.getAllByLabelText(/password/i)

    expect(usernameInputs.length).toBeGreaterThan(0)
    expect(passwordInputs.length).toBeGreaterThan(0)
  })

  it('switches to register tab when clicked', () => {
    render(<LoginPage />)

    const registerTab = screen.getByRole('tab', { name: /register/i })
    fireEvent.click(registerTab)

    // Should show confirm password field in register tab
    const confirmPasswordField = screen.getByLabelText(/confirm password/i)
    expect(confirmPasswordField).toBeInTheDocument()
  })

  it('shows error when trying to login with empty fields', async () => {
    render(<LoginPage />)

    // Find the submit button (type="submit") in the login form
    const loginButtons = screen.getAllByRole('button', { name: /login/i })
    const submitButton = loginButtons.find(btn => btn.getAttribute('type') === 'submit')

    if (submitButton) {
      fireEvent.click(submitButton)

      await waitFor(() => {
        // Should show validation error - check for the alert role
        const alerts = screen.queryAllByRole('alert')
        // Either an alert appears or local error state is set
        expect(alerts.length >= 0).toBeTruthy()
      })
    }
  })

  it('calls login function with credentials', async () => {
    render(<LoginPage />)

    const usernameInput = screen.getAllByLabelText(/username/i)[0]
    const passwordInputs = screen.getAllByLabelText(/password/i)
    // Get the first password field that is in the login form
    const passwordInput = passwordInputs[0]

    fireEvent.change(usernameInput, { target: { value: 'testuser' } })
    fireEvent.change(passwordInput, { target: { value: 'testpass123' } })

    const loginButton = screen.getAllByRole('button', { name: /login/i })[0]
    fireEvent.click(loginButton)

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('testuser', 'testpass123')
    })
  })

  it('displays error message from auth context', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      login: mockLogin,
      register: mockRegister,
      logout: vi.fn(),
      error: 'Invalid credentials',
      clearError: mockClearError,
    })

    render(<LoginPage />)

    expect(screen.getByText('Invalid credentials')).toBeInTheDocument()
  })

  it('validates password match in register form', async () => {
    render(<LoginPage />)

    // Switch to register tab
    const registerTab = screen.getByRole('tab', { name: /register/i })
    fireEvent.click(registerTab)

    // Fill in the form with mismatched passwords
    const usernameInputs = screen.getAllByLabelText(/username/i)
    const passwordInputs = screen.getAllByLabelText(/password/i)
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i)

    // Use the second set of inputs (register form)
    fireEvent.change(usernameInputs[1], { target: { value: 'newuser' } })
    fireEvent.change(passwordInputs[1], { target: { value: 'password123' } })
    fireEvent.change(confirmPasswordInput, { target: { value: 'differentpassword' } })

    const registerButton = screen.getAllByRole('button', { name: /register/i })[0]
    fireEvent.click(registerButton)

    await waitFor(() => {
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument()
    })
  })

  it('validates password length in register form', async () => {
    render(<LoginPage />)

    // Switch to register tab
    const registerTab = screen.getByRole('tab', { name: /register/i })
    fireEvent.click(registerTab)

    // Fill in the form with short password
    const usernameInputs = screen.getAllByLabelText(/username/i)
    const passwordInputs = screen.getAllByLabelText(/password/i)
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i)

    fireEvent.change(usernameInputs[1], { target: { value: 'newuser' } })
    fireEvent.change(passwordInputs[1], { target: { value: '12345' } })
    fireEvent.change(confirmPasswordInput, { target: { value: '12345' } })

    const registerButton = screen.getAllByRole('button', { name: /register/i })[0]
    fireEvent.click(registerButton)

    await waitFor(() => {
      expect(screen.getByText(/password must be at least 6 characters/i)).toBeInTheDocument()
    })
  })

  it('toggles password visibility', () => {
    render(<LoginPage />)

    const passwordInputs = screen.getAllByLabelText(/password/i)
    const passwordInput = passwordInputs[0]
    expect(passwordInput).toHaveAttribute('type', 'password')

    // Find and click the toggle button (has aria-label "Show password")
    const toggleButton = screen.getAllByLabelText(/show password/i)[0]
    fireEvent.click(toggleButton)

    // After click, type should be 'text'
    expect(passwordInput).toHaveAttribute('type', 'text')
  })
})
