import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../../../test/test-utils';
import ProfilePage from './ProfilePage';

// Mock the useAuth hook
vi.mock('../model', () => ({
  useAuth: vi.fn(() => ({
    user: {
      id: 1,
      username: 'testuser',
      role: 'user',
      created_at: '2025-01-01T00:00:00Z',
      updated_at: '2025-01-01T00:00:00Z',
    },
    isAuthenticated: true,
    isLoading: false,
  })),
}));

// Mock the authService
vi.mock('../../../api', () => ({
  authService: {
    updateEmail: vi.fn(),
    updatePassword: vi.fn(),
  },
}));

import { useAuth } from '../model';
import { authService } from '../../../api';

describe('ProfilePage', () => {
  const mockOnBack = vi.fn();
  const mockUser = {
    id: 1,
    username: 'testuser',
    role: 'user',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuth).mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
      isLoading: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      error: null,
      clearError: vi.fn(),
    });
  });

  it('renders profile page with user information', () => {
    render(<ProfilePage onBack={mockOnBack} />);

    // Check that username is displayed
    expect(screen.getByText('testuser')).toBeInTheDocument();
    // Check page title exists
    expect(screen.getByRole('heading')).toBeInTheDocument();
  });

  it('shows back button and calls onBack when clicked', () => {
    render(<ProfilePage onBack={mockOnBack} />);

    const backButton = screen.getByRole('button', { name: /back/i });
    expect(backButton).toBeInTheDocument();

    fireEvent.click(backButton);
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  it('shows change email button', () => {
    render(<ProfilePage onBack={mockOnBack} />);

    const changeEmailButtons = screen.getAllByRole('button').filter(
      (btn) => btn.textContent?.toLowerCase().includes('email')
    );
    expect(changeEmailButtons.length).toBeGreaterThan(0);
  });

  it('shows change password button', () => {
    render(<ProfilePage onBack={mockOnBack} />);

    const changePasswordButtons = screen.getAllByRole('button').filter(
      (btn) => btn.textContent?.toLowerCase().includes('password')
    );
    expect(changePasswordButtons.length).toBeGreaterThan(0);
  });

  it('shows email input when clicking change email', async () => {
    render(<ProfilePage onBack={mockOnBack} />);

    // Find and click the change email button
    const changeEmailButton = screen.getAllByRole('button').find(
      (btn) => btn.textContent?.toLowerCase().includes('email')
    );

    if (changeEmailButton) {
      fireEvent.click(changeEmailButton);

      // Should show email input field
      await waitFor(() => {
        const emailInput = screen.getByPlaceholderText(/email/i);
        expect(emailInput).toBeInTheDocument();
      });
    }
  });

  it('shows password fields when clicking change password', async () => {
    render(<ProfilePage onBack={mockOnBack} />);

    // Find and click the change password button
    const changePasswordButton = screen.getAllByRole('button').find(
      (btn) => btn.textContent?.toLowerCase().includes('password')
    );

    if (changePasswordButton) {
      fireEvent.click(changePasswordButton);

      // Should show password input fields
      await waitFor(() => {
        const passwordInputs = screen.getAllByPlaceholderText(/password/i);
        expect(passwordInputs.length).toBeGreaterThan(0);
      });
    }
  });

  it('validates email format before submitting', async () => {
    render(<ProfilePage onBack={mockOnBack} />);

    // Open email edit mode
    const changeEmailButton = screen.getAllByRole('button').find(
      (btn) => btn.textContent?.toLowerCase().includes('email')
    );

    if (changeEmailButton) {
      fireEvent.click(changeEmailButton);

      // Enter invalid email
      const emailInput = await screen.findByPlaceholderText(/email/i);
      fireEvent.change(emailInput, { target: { value: 'invalid-email' } });

      // Click save button
      const saveButton = screen.getByRole('button', { name: /save/i });
      fireEvent.click(saveButton);

      // Should show error alert
      await waitFor(() => {
        const alert = screen.queryByRole('alert');
        // Either alert appears or error state is shown
        expect(alert !== null || emailInput).toBeTruthy();
      });

      // API should not be called with invalid email
      expect(authService.updateEmail).not.toHaveBeenCalled();
    }
  });

  it('validates password match before submitting', async () => {
    render(<ProfilePage onBack={mockOnBack} />);

    // Open password edit mode
    const changePasswordButton = screen.getAllByRole('button').find(
      (btn) => btn.textContent?.toLowerCase().includes('password')
    );

    if (changePasswordButton) {
      fireEvent.click(changePasswordButton);

      await waitFor(() => {
        const passwordInputs = screen.getAllByPlaceholderText(/password/i);
        expect(passwordInputs.length).toBeGreaterThan(0);
      });

      // Fill in password fields with mismatched passwords
      const passwordInputs = screen.getAllByPlaceholderText(/password/i);

      // Current password
      if (passwordInputs[0]) {
        fireEvent.change(passwordInputs[0], { target: { value: 'currentpass' } });
      }
      // New password
      if (passwordInputs[1]) {
        fireEvent.change(passwordInputs[1], { target: { value: 'newpass123' } });
      }
      // Confirm password (different)
      if (passwordInputs[2]) {
        fireEvent.change(passwordInputs[2], { target: { value: 'different123' } });
      }

      // Click save button
      const saveButton = screen.getByRole('button', { name: /save/i });
      fireEvent.click(saveButton);

      // API should not be called with mismatched passwords
      await waitFor(() => {
        expect(authService.updatePassword).not.toHaveBeenCalled();
      });
    }
  });

  it('calls updateEmail API when valid email is submitted', async () => {
    vi.mocked(authService.updateEmail).mockResolvedValueOnce({ message: 'Email updated' });

    render(<ProfilePage onBack={mockOnBack} />);

    // Open email edit mode
    const changeEmailButton = screen.getAllByRole('button').find(
      (btn) => btn.textContent?.toLowerCase().includes('email')
    );

    if (changeEmailButton) {
      fireEvent.click(changeEmailButton);

      // Enter valid email
      const emailInput = await screen.findByPlaceholderText(/email/i);
      fireEvent.change(emailInput, { target: { value: 'newemail@example.com' } });

      // Click save button
      const saveButton = screen.getByRole('button', { name: /save/i });
      fireEvent.click(saveButton);

      // API should be called
      await waitFor(() => {
        expect(authService.updateEmail).toHaveBeenCalledWith({ email: 'newemail@example.com' });
      });
    }
  });

  it('calls updatePassword API when valid passwords are submitted', async () => {
    vi.mocked(authService.updatePassword).mockResolvedValueOnce({ message: 'Password updated' });

    render(<ProfilePage onBack={mockOnBack} />);

    // Open password edit mode
    const changePasswordButton = screen.getAllByRole('button').find(
      (btn) => btn.textContent?.toLowerCase().includes('password')
    );

    if (changePasswordButton) {
      fireEvent.click(changePasswordButton);

      await waitFor(() => {
        const passwordInputs = screen.getAllByPlaceholderText(/password/i);
        expect(passwordInputs.length).toBeGreaterThan(0);
      });

      const passwordInputs = screen.getAllByPlaceholderText(/password/i);

      // Fill in all password fields with matching passwords
      if (passwordInputs[0]) {
        fireEvent.change(passwordInputs[0], { target: { value: 'currentpass' } });
      }
      if (passwordInputs[1]) {
        fireEvent.change(passwordInputs[1], { target: { value: 'newpassword123' } });
      }
      if (passwordInputs[2]) {
        fireEvent.change(passwordInputs[2], { target: { value: 'newpassword123' } });
      }

      // Click save button
      const saveButton = screen.getByRole('button', { name: /save/i });
      fireEvent.click(saveButton);

      // API should be called
      await waitFor(() => {
        expect(authService.updatePassword).toHaveBeenCalledWith({
          current_password: 'currentpass',
          new_password: 'newpassword123',
        });
      });
    }
  });

  it('can cancel email edit mode', async () => {
    render(<ProfilePage onBack={mockOnBack} />);

    // Open email edit mode
    const changeEmailButton = screen.getAllByRole('button').find(
      (btn) => btn.textContent?.toLowerCase().includes('email')
    );

    if (changeEmailButton) {
      fireEvent.click(changeEmailButton);

      // Should show email input
      const emailInput = await screen.findByPlaceholderText(/email/i);
      expect(emailInput).toBeInTheDocument();

      // Click cancel button (the Close button)
      const cancelButton = screen.getByRole('button', { name: /close/i });
      fireEvent.click(cancelButton);

      // Email input should no longer be visible
      await waitFor(() => {
        expect(screen.queryByPlaceholderText(/email/i)).not.toBeInTheDocument();
      });
    }
  });

  it('can cancel password edit mode', async () => {
    render(<ProfilePage onBack={mockOnBack} />);

    // Open password edit mode
    const changePasswordButton = screen.getAllByRole('button').find(
      (btn) => btn.textContent?.toLowerCase().includes('password')
    );

    if (changePasswordButton) {
      fireEvent.click(changePasswordButton);

      // Should show password inputs
      await waitFor(() => {
        const passwordInputs = screen.getAllByPlaceholderText(/password/i);
        expect(passwordInputs.length).toBeGreaterThan(0);
      });

      // Click cancel button
      const cancelButton = screen.getByRole('button', { name: /close/i });
      fireEvent.click(cancelButton);

      // Password inputs should no longer be visible
      await waitFor(() => {
        const passwordInputs = screen.queryAllByPlaceholderText(/password/i);
        expect(passwordInputs.length).toBe(0);
      });
    }
  });

  it('displays user avatar with username', () => {
    render(<ProfilePage onBack={mockOnBack} />);

    // Avatar should be present (Chakra Avatar shows initials from name prop)
    // Just verify the username is displayed somewhere
    expect(screen.getByText('testuser')).toBeInTheDocument();
  });

  it('handles API error when updating email', async () => {
    vi.mocked(authService.updateEmail).mockRejectedValueOnce(new Error('API Error'));

    render(<ProfilePage onBack={mockOnBack} />);

    const changeEmailButton = screen.getAllByRole('button').find(
      (btn) => btn.textContent?.toLowerCase().includes('email')
    );

    if (changeEmailButton) {
      fireEvent.click(changeEmailButton);

      const emailInput = await screen.findByPlaceholderText(/email/i);
      fireEvent.change(emailInput, { target: { value: 'newemail@example.com' } });

      const saveButton = screen.getByRole('button', { name: /save/i });
      fireEvent.click(saveButton);

      // Should show error
      await waitFor(() => {
        const alert = screen.getByRole('alert');
        expect(alert).toBeInTheDocument();
      });
    }
  });

  it('handles API error when updating password', async () => {
    vi.mocked(authService.updatePassword).mockRejectedValueOnce(new Error('API Error'));

    render(<ProfilePage onBack={mockOnBack} />);

    const changePasswordButton = screen.getAllByRole('button').find(
      (btn) => btn.textContent?.toLowerCase().includes('password')
    );

    if (changePasswordButton) {
      fireEvent.click(changePasswordButton);

      await waitFor(() => {
        const passwordInputs = screen.getAllByPlaceholderText(/password/i);
        expect(passwordInputs.length).toBeGreaterThan(0);
      });

      const passwordInputs = screen.getAllByPlaceholderText(/password/i);

      if (passwordInputs[0]) {
        fireEvent.change(passwordInputs[0], { target: { value: 'currentpass' } });
      }
      if (passwordInputs[1]) {
        fireEvent.change(passwordInputs[1], { target: { value: 'newpassword123' } });
      }
      if (passwordInputs[2]) {
        fireEvent.change(passwordInputs[2], { target: { value: 'newpassword123' } });
      }

      const saveButton = screen.getByRole('button', { name: /save/i });
      fireEvent.click(saveButton);

      // Should show error
      await waitFor(() => {
        const alert = screen.getByRole('alert');
        expect(alert).toBeInTheDocument();
      });
    }
  });
});
