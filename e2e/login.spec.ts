import { test, expect } from '@playwright/test'

test.describe('Login Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should display login page when not authenticated', async ({ page }) => {
    // Should show the SoundFood title
    await expect(page.getByText('🍽️ SoundFood')).toBeVisible()

    // Should show login and register tabs
    await expect(page.getByRole('tab', { name: /login/i })).toBeVisible()
    await expect(page.getByRole('tab', { name: /register/i })).toBeVisible()
  })

  test('should have username and password fields', async ({ page }) => {
    await expect(page.getByLabel(/username/i).first()).toBeVisible()
    await expect(page.getByLabel(/password/i).first()).toBeVisible()
  })

  test('should toggle password visibility', async ({ page }) => {
    const passwordField = page.getByLabel(/password/i).first()
    await expect(passwordField).toHaveAttribute('type', 'password')

    // Click the toggle button (usually has an eye icon)
    const toggleButton = page.locator('button').filter({ has: page.locator('svg') }).first()
    await toggleButton.click()

    // Password should now be visible
    await expect(passwordField).toHaveAttribute('type', 'text')
  })

  test('should switch between login and register tabs', async ({ page }) => {
    // Click on register tab
    await page.getByRole('tab', { name: /register/i }).click()

    // Should show confirm password field
    await expect(page.getByLabel(/confirm password/i)).toBeVisible()

    // Click back on login tab
    await page.getByRole('tab', { name: /login/i }).click()

    // Confirm password should not be visible
    await expect(page.getByLabel(/confirm password/i)).not.toBeVisible()
  })

  test('should show error on empty form submission', async ({ page }) => {
    // Click login button without filling form
    await page.getByRole('button', { name: /login/i }).first().click()

    // Should show error message
    await expect(page.getByText(/all fields are required/i)).toBeVisible()
  })

  test('should validate password match in register', async ({ page }) => {
    // Switch to register tab
    await page.getByRole('tab', { name: /register/i }).click()

    // Fill form with mismatched passwords
    await page.getByLabel(/username/i).nth(1).fill('testuser')
    await page.getByLabel(/^password$/i).nth(1).fill('password123')
    await page.getByLabel(/confirm password/i).fill('differentpassword')

    // Submit
    await page.getByRole('button', { name: /register/i }).first().click()

    // Should show error
    await expect(page.getByText(/passwords do not match/i)).toBeVisible()
  })

  test('should validate password length in register', async ({ page }) => {
    // Switch to register tab
    await page.getByRole('tab', { name: /register/i }).click()

    // Fill form with short password
    await page.getByLabel(/username/i).nth(1).fill('testuser')
    await page.getByLabel(/^password$/i).nth(1).fill('12345')
    await page.getByLabel(/confirm password/i).fill('12345')

    // Submit
    await page.getByRole('button', { name: /register/i }).first().click()

    // Should show error
    await expect(page.getByText(/password must be at least 6 characters/i)).toBeVisible()
  })
})
