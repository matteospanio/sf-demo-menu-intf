import { test, expect, type Page, type Route } from '@playwright/test'

const API = 'http://localhost:5000'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
  'Access-Control-Allow-Headers': 'Authorization,Content-Type',
}

async function fulfillPreflight(route: Route) {
  await route.fulfill({ status: 204, headers: CORS_HEADERS })
}

async function fulfillJson(route: Route, body: unknown, status = 200) {
  await route.fulfill({
    status,
    headers: CORS_HEADERS,
    contentType: 'application/json',
    body: JSON.stringify(body),
  })
}

async function mockAuth(page: Page) {
  await page.addInitScript(() => {
    window.localStorage.setItem('auth_token', 'e2e-token')
    window.localStorage.setItem('i18nextLng', 'en')
  })

  await page.route(`${API}/auth/me`, async (route) => {
    if (route.request().method() === 'OPTIONS') return fulfillPreflight(route)
    await fulfillJson(route, { id: 1, username: 'e2e-user', role: 'user' })
  })
}

async function mockMenus(page: Page) {
  await page.route(`${API}/api/menus`, async (route) => {
    if (route.request().method() === 'OPTIONS') return fulfillPreflight(route)
    if (route.request().method() !== 'GET') return route.fallback()
    await fulfillJson(route, [])
  })
}

test.describe('Client settings page', () => {
  test.beforeEach(async ({ page }) => {
    await mockAuth(page)
    await mockMenus(page)
  })

  test('persists theme and language in localStorage', async ({ page }) => {
    // Use mobile layout for stable drawer navigation.
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    // Wait for app to stabilize before opening drawer
    await expect(page.getByRole('button', { name: /open menu/i })).toBeVisible()
    await page.getByRole('button', { name: /open menu/i }).click()

    // Wait for drawer to be fully visible before clicking settings
    const settingsButton = page.getByTestId('drawer-settings')
    await expect(settingsButton).toBeVisible()
    await settingsButton.click()

    // Wait for drawer to close and Settings page to appear
    await expect(settingsButton).not.toBeVisible()
    await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible()

    // Toggle dark mode - click the switch label (Chakra Switch label intercepts pointer events)
    const darkModeSwitch = page.getByRole('checkbox', { name: 'Dark mode' })
    await expect(darkModeSwitch).toBeVisible()
    // Click the parent label element that wraps the switch
    await darkModeSwitch.locator('..').click()

    // Verify we're still on Settings after toggle
    await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible()

    // Wait for localStorage to be updated
    await expect
      .poll(async () => page.evaluate(() => window.localStorage.getItem('sf_client_settings')), { timeout: 5000 })
      .toContain('"colorMode":"dark"')

    // Change language to Italian
    await page.getByRole('combobox').click()
    await page.getByText('🇮🇹').click()

    await expect(page.getByRole('heading', { name: 'Impostazioni' })).toBeVisible()

    const storedAfterLanguage = await page.evaluate(() => window.localStorage.getItem('sf_client_settings'))
    expect(storedAfterLanguage).toContain('"language":"it"')

    // Reload and ensure settings are still applied
    await page.reload()

    // Wait for app to load after reload - use longer timeout
    // After reload UI is in Italian (Apri menu instead of Open menu)
    await expect(page.getByRole('button', { name: /open menu|apri menu/i })).toBeVisible({ timeout: 10000 })
    await page.getByRole('button', { name: /open menu|apri menu/i }).click()

    const settingsButtonAfterReload = page.getByTestId('drawer-settings')
    await expect(settingsButtonAfterReload).toBeVisible()
    await settingsButtonAfterReload.click()

    await expect(settingsButtonAfterReload).not.toBeVisible()
    await expect(page.getByRole('heading', { name: 'Impostazioni' })).toBeVisible()

    const bodyClass = await page.locator('body').getAttribute('class')
    expect(bodyClass ?? '').toContain('chakra-ui-dark')
  })
})
