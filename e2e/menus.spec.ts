import { test, expect, type Page, type Route } from '@playwright/test'

const API = 'http://localhost:5000'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
  'Access-Control-Allow-Headers': 'Authorization,Content-Type',
}

async function fulfillPreflight(route: Route) {
  await route.fulfill({
    status: 204,
    headers: CORS_HEADERS,
  })
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
    // Stabilize E2E expectations that assert English UI strings.
    window.localStorage.setItem('i18nextLng', 'en')
  })

  await page.route(`${API}/auth/me`, async (route) => {
    if (route.request().method() === 'OPTIONS') return fulfillPreflight(route)
    await fulfillJson(route, { id: 1, username: 'e2e-user', role: 'user' })
  })
}

async function mockAttributes(page: Page) {
  await page.route(`${API}/api/emotions`, async (route) => {
    if (route.request().method() === 'OPTIONS') return fulfillPreflight(route)
    await fulfillJson(route, [])
  })
  await page.route(`${API}/api/textures`, async (route) => {
    if (route.request().method() === 'OPTIONS') return fulfillPreflight(route)
    await fulfillJson(route, [])
  })
  await page.route(`${API}/api/shapes`, async (route) => {
    if (route.request().method() === 'OPTIONS') return fulfillPreflight(route)
    await fulfillJson(route, [])
  })
}

async function openMyMenus(page: Page) {
  const heading = page.getByRole('heading', { name: /my menus|i miei menu/i })

  // Wait for the page to stabilize (auth check completes, menus load)
  // First wait for the app to be ready
  await expect(page.getByRole('button', { name: 'Go to menus list' })).toBeVisible({ timeout: 10000 })

  // Check if we're already on the menus page
  const isOnMenusPage = await heading.isVisible().catch(() => false)
  if (isOnMenusPage) {
    return
  }

  // Click the logo/home button to navigate to menus
  await page.getByRole('button', { name: 'Go to menus list' }).click()

  // Wait for navigation to complete
  await expect(heading).toBeVisible({ timeout: 10000 })
}

test.describe('Menus management', () => {
  test.beforeEach(async ({ page }) => {
    await mockAuth(page)
    await mockAttributes(page)
  })

  test('can open menus list and view details', async ({ page }) => {
    const menuTitle = 'Winter Menu'
    const nowIso = new Date().toISOString()

    await page.route(`${API}/api/menus`, async (route) => {
      if (route.request().method() === 'OPTIONS') return fulfillPreflight(route)
      if (route.request().method() !== 'GET') return route.fallback()
      await fulfillJson(route, [
        {
          id: 1,
          title: menuTitle,
          description: 'Seasonal dishes',
          status: 'draft',
          dish_count: 2,
          created_at: nowIso,
          updated_at: nowIso,
        },
      ])
    })

    await page.route(`${API}/api/menus/1`, async (route) => {
      if (route.request().method() === 'OPTIONS') return fulfillPreflight(route)
      await fulfillJson(route, {
        id: 1,
        title: menuTitle,
        description: 'Seasonal dishes',
        status: 'draft',
        created_at: nowIso,
        updated_at: nowIso,
      })
    })

    await page.route(`${API}/api/menus/1/dishes`, async (route) => {
      if (route.request().method() === 'OPTIONS') return fulfillPreflight(route)
      await fulfillJson(route, [
        {
          id: 11,
          name: 'Pumpkin Risotto',
          description: 'Creamy and aromatic',
          section: 'firstCourse',
          emotions: [],
          textures: [],
          shapes: [],
          bitter: 0,
          salty: 0,
          sour: 0,
          sweet: 0,
          umami: 0,
          fat: 0,
          piquant: 0,
          temperature: 0,
          colors: ['#ffffff'],
          created_at: nowIso,
          updated_at: nowIso,
        },
      ])
    })

    await page.goto('/')

    await openMyMenus(page)

    await expect(page.getByRole('heading', { name: 'My menus' })).toBeVisible()
    await expect(page.getByText(menuTitle)).toBeVisible()

    await page.getByRole('button', { name: 'View' }).click()

    await expect(page.getByRole('heading', { name: 'Menu details' })).toBeVisible()
    await expect(page.getByRole('heading', { name: menuTitle })).toBeVisible()
    await expect(page.getByText('Pumpkin Risotto')).toBeVisible()
  })

  test('can delete a menu from the list', async ({ page }) => {
    const nowIso = new Date().toISOString()

    await page.route(`${API}/api/menus`, async (route) => {
      if (route.request().method() === 'OPTIONS') return fulfillPreflight(route)
      if (route.request().method() !== 'GET') return route.fallback()
      await fulfillJson(route, [
        {
          id: 7,
          title: 'Menu To Delete',
          description: '',
          status: 'draft',
          dish_count: 0,
          created_at: nowIso,
          updated_at: nowIso,
        },
      ])
    })

    await page.route(`${API}/api/menus/7`, async (route) => {
      if (route.request().method() === 'OPTIONS') return fulfillPreflight(route)
      if (route.request().method() !== 'DELETE') return route.fallback()
      await fulfillJson(route, { message: 'ok' })
    })

    await page.goto('/')
    await openMyMenus(page)

    await expect(page.getByText('Menu To Delete')).toBeVisible()

    await page.getByRole('button', { name: 'Delete' }).click()
    const dialog = page.getByRole('alertdialog', { name: 'Delete menu' })
    await expect(dialog).toBeVisible()

    await dialog.getByRole('button', { name: 'Delete' }).click()

    await expect(dialog).toBeHidden()
    await expect(page.getByRole('heading', { name: 'Menu To Delete' })).toHaveCount(0)
  })

  test('can edit a menu title (update request)', async ({ page }) => {
    let currentTitle = 'Original Title'
    const nowIso = new Date().toISOString()

    await page.route(`${API}/api/menus`, async (route) => {
      if (route.request().method() === 'OPTIONS') return fulfillPreflight(route)
      if (route.request().method() !== 'GET') return route.fallback()
      await fulfillJson(route, [
        { id: 1, title: currentTitle, description: 'Desc', dish_count: 1, status: 'draft', created_at: nowIso, updated_at: nowIso },
      ])
    })

    await page.route(`${API}/api/menus/1`, async (route) => {
      const method = route.request().method()
      if (method === 'OPTIONS') return fulfillPreflight(route)
      if (method === 'GET') {
        await fulfillJson(route, { id: 1, title: currentTitle, description: 'Desc', status: 'draft' })
        return
      }

      if (method === 'PUT') {
        const body = route.request().postDataJSON?.() ?? {}
        if (typeof body.title === 'string') currentTitle = body.title
        await fulfillJson(route, { message: 'ok' })
        return
      }

      await route.fallback()
    })

    await page.route(`${API}/api/menus/1/submit`, async (route) => {
      const method = route.request().method()
      if (method === 'OPTIONS') return fulfillPreflight(route)
      if (method !== 'POST') return route.fallback()
      await fulfillJson(route, { message: 'ok' })
    })

    await page.route(`${API}/api/menus/1/dishes`, async (route) => {
      if (route.request().method() === 'OPTIONS') return fulfillPreflight(route)
      await fulfillJson(route, [
        {
          id: 22,
          name: 'Existing Dish',
          description: '',
          section: 'appetizer',
          emotions: [],
          textures: [],
          shapes: [],
          bitter: 0,
          salty: 0,
          sour: 0,
          sweet: 0,
          umami: 0,
          fat: 0,
          piquant: 0,
          temperature: 0,
          colors: ['#ffffff'],
        },
      ])
    })

    await page.goto('/')
    await openMyMenus(page)

    await page.getByRole('button', { name: 'Edit' }).click()

    const titleInput = page.getByRole('textbox', { name: /menu title/i })
    await expect(titleInput).toHaveValue('Original Title')

    await titleInput.fill('Updated Title')

    // Submit in edit mode triggers PUT /api/menus/1 then redirects back to the list.
    const submitButton = page.getByRole('button', { name: /^submit$/i })
    await expect(submitButton).toBeVisible()
    // Use keyboard activation to avoid occasional pointer interception by overlapping content.
    await submitButton.press('Enter')

    await expect(page.getByText('Menu sent successfully')).toBeVisible({ timeout: 10_000 })
    await expect(page.getByRole('heading', { name: 'My menus' })).toBeVisible({ timeout: 10_000 })
    await expect(page.getByText('Updated Title')).toBeVisible({ timeout: 10_000 })
    const justSent = page.getByText('Just sent')
    await expect(justSent.first()).toBeVisible({ timeout: 10_000 })
  })
})
