import { test, expect, type Page } from '@playwright/test'

const API = 'http://localhost:5000'

async function mockAuth(page: Page) {
  await page.addInitScript(() => {
    window.localStorage.setItem('auth_token', 'e2e-token')
    // Stabilize E2E expectations that assert English UI strings.
    window.localStorage.setItem('i18nextLng', 'en')
  })

  await page.route(`${API}/auth/me`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        id: 1,
        username: 'e2e-user',
        role: 'user',
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z',
      }),
    })
  })
}

async function mockAttributes(page: Page) {
  const empty = { status: 200, contentType: 'application/json', body: JSON.stringify([]) }
  await page.route(`${API}/api/emotions`, async (route) => route.fulfill(empty))
  await page.route(`${API}/api/textures`, async (route) => route.fulfill(empty))
  await page.route(`${API}/api/shapes`, async (route) => route.fulfill(empty))
}

async function mockMenusEmpty(page: Page) {
  await page.route(`${API}/api/menus`, async (route) => {
    if (route.request().method() !== 'GET') return route.fallback()
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([]),
    })
  })
}

/**
 * Navigate to profile page - handles both desktop and mobile navigation
 */
async function navigateToProfile(page: Page, isMobile: boolean) {
  await page.goto('/')
  await expect(page.getByText('SoundFood')).toBeVisible()

  if (isMobile) {
    // Open the mobile hamburger menu
    await page.getByRole('button', { name: /open menu/i }).click()
    // Click on the Profile button in the drawer
    await page.getByRole('button', { name: /profile/i }).click()
  } else {
    // Click on the user avatar to open the dropdown menu
    const avatar = page.locator('.chakra-avatar').first()
    await avatar.click()
    // Click on the Profile menu item
    await page.getByRole('menuitem', { name: /profile/i }).click()
  }

  // Wait for profile page to load
  await expect(page.getByRole('heading', { name: /profile/i })).toBeVisible()
}

test.describe('Profile Page', () => {
  test.beforeEach(async ({ page }) => {
    await mockAuth(page)
    await mockAttributes(page)
    await mockMenusEmpty(page)
  })

  test('can navigate to profile page from desktop menu', async ({ page, isMobile }) => {
    test.skip(isMobile === true, 'Desktop-only navigation test')

    await page.goto('/')

    // Wait for the app to load
    await expect(page.getByText('SoundFood')).toBeVisible()

    // Click on the user avatar to open the dropdown menu
    const avatar = page.locator('.chakra-avatar').first()
    await avatar.click()

    // Click on the Profile menu item
    await page.getByRole('menuitem', { name: /profile/i }).click()

    // Should show the profile page
    await expect(page.getByRole('heading', { name: /profile/i })).toBeVisible()
    // Use heading selector to find username within the profile card
    await expect(page.locator('[class*="chakra-card"] >> text=e2e-user').first()).toBeVisible()
  })

  test('can navigate to profile page from mobile drawer', async ({ page, isMobile }) => {
    test.skip(isMobile !== true, 'Mobile-only navigation test')

    await page.goto('/')

    // Wait for the app to load
    await expect(page.getByText('SoundFood')).toBeVisible()

    // Open the mobile hamburger menu
    await page.getByRole('button', { name: /open menu/i }).click()

    // Click on the Profile button in the drawer
    await page.getByRole('button', { name: /profile/i }).click()

    // Should show the profile page
    await expect(page.getByRole('heading', { name: /profile/i })).toBeVisible()
    // Use heading selector to find username within the profile card
    await expect(page.locator('[class*="chakra-card"] >> text=e2e-user').first()).toBeVisible()
  })

  test('displays user information correctly', async ({ page, isMobile }) => {
    await navigateToProfile(page, isMobile ?? false)

    // Should display username in the profile card
    await expect(page.locator('[class*="chakra-card"] >> text=e2e-user').first()).toBeVisible()

    // Should display member since date
    await expect(page.getByText(/member since/i)).toBeVisible()

    // Should show change email and password buttons
    await expect(page.getByRole('button', { name: /change email/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /change password/i })).toBeVisible()
  })

  test('can open email edit form', async ({ page, isMobile }) => {
    await navigateToProfile(page, isMobile ?? false)

    // Click change email button
    await page.getByRole('button', { name: /change email/i }).click()

    // Should show email input
    await expect(page.getByLabel(/new email/i)).toBeVisible()

    // Should show save (check icon) and cancel (X icon) buttons
    // These buttons use aria-label from t('modal.submit') and t('modal.cancel')
    // which resolve to 'Save' and 'Close' respectively
    await expect(page.locator('button[aria-label="Save"], button[aria-label="modal.submit"]').first()).toBeVisible()
    await expect(page.locator('button[aria-label="Close"], button[aria-label="modal.cancel"]').first()).toBeVisible()
  })

  test('can cancel email edit', async ({ page, isMobile }) => {
    await navigateToProfile(page, isMobile ?? false)

    // Open email edit form
    await page.getByRole('button', { name: /change email/i }).click()
    await expect(page.getByLabel(/new email/i)).toBeVisible()

    // Cancel - click the X button
    await page.locator('button[aria-label="Close"], button[aria-label="modal.cancel"]').first().click()

    // Email input should be hidden
    await expect(page.getByLabel(/new email/i)).not.toBeVisible()

    // Change email button should be visible again
    await expect(page.getByRole('button', { name: /change email/i })).toBeVisible()
  })

  test('validates email format', async ({ page, isMobile }) => {
    await navigateToProfile(page, isMobile ?? false)

    // Open email edit form
    await page.getByRole('button', { name: /change email/i }).click()

    // Enter invalid email
    await page.getByLabel(/new email/i).fill('invalid-email')

    // Submit - click the check button
    await page.locator('button[aria-label="Save"], button[aria-label="modal.submit"]').first().click()

    // Should show error
    await expect(page.getByRole('alert')).toBeVisible()
  })

  test('can update email successfully', async ({ page, isMobile }) => {
    // Mock the email update endpoint
    await page.route(`${API}/auth/me/email`, async (route) => {
      if (route.request().method() !== 'PATCH') return route.fallback()
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Email updated' }),
      })
    })

    await navigateToProfile(page, isMobile ?? false)

    // Open email edit form
    await page.getByRole('button', { name: /change email/i }).click()

    // Enter valid email
    await page.getByLabel(/new email/i).fill('newemail@example.com')

    // Submit
    await page.locator('button[aria-label="Save"], button[aria-label="modal.submit"]').first().click()

    // Should show success toast
    await expect(page.getByText(/email updated/i)).toBeVisible()

    // Form should be closed
    await expect(page.getByLabel(/new email/i)).not.toBeVisible()
  })

  test('can open password edit form', async ({ page, isMobile }) => {
    await navigateToProfile(page, isMobile ?? false)

    // Click change password button
    await page.getByRole('button', { name: /change password/i }).click()

    // Should show password inputs
    await expect(page.getByLabel(/current password/i)).toBeVisible()
    await expect(page.getByLabel(/new password/i)).toBeVisible()
    await expect(page.getByLabel(/confirm password/i)).toBeVisible()
  })

  test('can cancel password edit', async ({ page, isMobile }) => {
    await navigateToProfile(page, isMobile ?? false)

    // Open password edit form
    await page.getByRole('button', { name: /change password/i }).click()
    await expect(page.getByLabel(/current password/i)).toBeVisible()

    // Cancel - click the X button
    await page.locator('button[aria-label="Close"], button[aria-label="modal.cancel"]').first().click()

    // Password inputs should be hidden
    await expect(page.getByLabel(/current password/i)).not.toBeVisible()

    // Change password button should be visible again
    await expect(page.getByRole('button', { name: /change password/i })).toBeVisible()
  })

  test('validates password fields are required', async ({ page, isMobile }) => {
    await navigateToProfile(page, isMobile ?? false)

    // Open password edit form
    await page.getByRole('button', { name: /change password/i }).click()

    // Submit without filling fields
    await page.locator('button[aria-label="Save"], button[aria-label="modal.submit"]').first().click()

    // Should show error
    await expect(page.getByRole('alert')).toBeVisible()
  })

  test('validates password match', async ({ page, isMobile }) => {
    await navigateToProfile(page, isMobile ?? false)

    // Open password edit form
    await page.getByRole('button', { name: /change password/i }).click()

    // Fill with mismatched passwords
    await page.getByLabel(/current password/i).fill('currentpass')
    await page.getByLabel(/new password/i).fill('newpassword123')
    await page.getByLabel(/confirm password/i).fill('differentpassword')

    // Submit
    await page.locator('button[aria-label="Save"], button[aria-label="modal.submit"]').first().click()

    // Should show password mismatch error
    await expect(page.getByRole('alert')).toBeVisible()
  })

  test('validates password minimum length', async ({ page, isMobile }) => {
    await navigateToProfile(page, isMobile ?? false)

    // Open password edit form
    await page.getByRole('button', { name: /change password/i }).click()

    // Fill with short password
    await page.getByLabel(/current password/i).fill('currentpass')
    await page.getByLabel(/new password/i).fill('12345')
    await page.getByLabel(/confirm password/i).fill('12345')

    // Submit
    await page.locator('button[aria-label="Save"], button[aria-label="modal.submit"]').first().click()

    // Should show password length error
    await expect(page.getByRole('alert')).toBeVisible()
  })

  test('can update password successfully', async ({ page, isMobile }) => {
    // Mock the password update endpoint
    await page.route(`${API}/auth/me/password`, async (route) => {
      if (route.request().method() !== 'PATCH') return route.fallback()
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Password updated' }),
      })
    })

    await navigateToProfile(page, isMobile ?? false)

    // Open password edit form
    await page.getByRole('button', { name: /change password/i }).click()

    // Fill with valid passwords
    await page.getByLabel(/current password/i).fill('currentpassword')
    await page.getByLabel(/new password/i).fill('newpassword123')
    await page.getByLabel(/confirm password/i).fill('newpassword123')

    // Submit
    await page.locator('button[aria-label="Save"], button[aria-label="modal.submit"]').first().click()

    // Should show success toast
    await expect(page.getByText(/password updated/i)).toBeVisible()

    // Form should be closed
    await expect(page.getByLabel(/current password/i)).not.toBeVisible()
  })

  test('can toggle password visibility', async ({ page, isMobile }) => {
    await navigateToProfile(page, isMobile ?? false)

    // Open password edit form
    await page.getByRole('button', { name: /change password/i }).click()

    // Current password should be hidden by default
    const currentPasswordInput = page.getByLabel(/current password/i)
    await expect(currentPasswordInput).toHaveAttribute('type', 'password')

    // Click show password button
    await page.getByRole('button', { name: /show password/i }).first().click()

    // Password should now be visible
    await expect(currentPasswordInput).toHaveAttribute('type', 'text')
  })

  test('can navigate back from profile page', async ({ page, isMobile }) => {
    await navigateToProfile(page, isMobile ?? false)

    // Verify we're on profile page
    await expect(page.getByRole('heading', { name: /profile/i })).toBeVisible()

    // Click back button
    await page.getByRole('button', { name: /back/i }).click()

    // Should navigate back to menus list
    await expect(page.getByRole('heading', { name: /my menus/i })).toBeVisible()
  })

  test('handles API error when updating email', async ({ page, isMobile }) => {
    // Mock the email update endpoint to return an error
    await page.route(`${API}/auth/me/email`, async (route) => {
      if (route.request().method() !== 'PATCH') return route.fallback()
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Invalid email' }),
      })
    })

    await navigateToProfile(page, isMobile ?? false)

    // Open email edit form
    await page.getByRole('button', { name: /change email/i }).click()

    // Enter valid email
    await page.getByLabel(/new email/i).fill('newemail@example.com')

    // Submit
    await page.locator('button[aria-label="Save"], button[aria-label="modal.submit"]').first().click()

    // Should show error
    await expect(page.getByRole('alert')).toBeVisible()

    // Form should remain open
    await expect(page.getByLabel(/new email/i)).toBeVisible()
  })

  test('handles API error when updating password', async ({ page, isMobile }) => {
    // Mock the password update endpoint to return an error
    await page.route(`${API}/auth/me/password`, async (route) => {
      if (route.request().method() !== 'PATCH') return route.fallback()
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Current password is incorrect' }),
      })
    })

    await navigateToProfile(page, isMobile ?? false)

    // Open password edit form
    await page.getByRole('button', { name: /change password/i }).click()

    // Fill with valid passwords
    await page.getByLabel(/current password/i).fill('wrongpassword')
    await page.getByLabel(/new password/i).fill('newpassword123')
    await page.getByLabel(/confirm password/i).fill('newpassword123')

    // Submit
    await page.locator('button[aria-label="Save"], button[aria-label="modal.submit"]').first().click()

    // Should show error
    await expect(page.getByRole('alert')).toBeVisible()

    // Form should remain open
    await expect(page.getByLabel(/current password/i)).toBeVisible()
  })
})
