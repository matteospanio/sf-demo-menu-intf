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
  if (await heading.count()) return

  // Navigation is responsive (desktop buttons vs mobile drawer). The logo action is stable.
  await page.getByRole('button', { name: 'Go to menus list' }).click()
  await expect(heading).toBeVisible()
}

test.describe('Menus management', () => {
  test.beforeEach(async ({ page }) => {
    await mockAuth(page)
    await mockAttributes(page)
  })

  test('can open menus list and view details', async ({ page }) => {
    const menuTitle = 'Winter Menu'

    await page.route(`${API}/api/menus`, async (route) => {
      if (route.request().method() !== 'GET') return route.fallback()
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id: 1, title: menuTitle, description: 'Seasonal dishes', dish_count: 2 },
        ]),
      })
    })

    await page.route(`${API}/api/menus/1`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ id: 1, title: menuTitle, description: 'Seasonal dishes' }),
      })
    })

    await page.route(`${API}/api/menus/1/dishes`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
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
          },
        ]),
      })
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
    await page.route(`${API}/api/menus`, async (route) => {
      if (route.request().method() !== 'GET') return route.fallback()
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id: 7, title: 'Menu To Delete', description: '', dish_count: 0 },
        ]),
      })
    })

    await page.route(`${API}/api/menus/7`, async (route) => {
      if (route.request().method() !== 'DELETE') return route.fallback()
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'ok' }),
      })
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

    await page.route(`${API}/api/menus`, async (route) => {
      if (route.request().method() !== 'GET') return route.fallback()
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id: 1, title: currentTitle, description: 'Desc', dish_count: 1 },
        ]),
      })
    })

    await page.route(`${API}/api/menus/1`, async (route) => {
      const method = route.request().method()
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
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
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
        ]),
      })
    })

    await page.goto('/')
    await openMyMenus(page)

    await page.getByRole('button', { name: 'Edit' }).click()

    const titleInput = page.getByRole('textbox', { name: /menu title/i })
    await expect(titleInput).toHaveValue('Original Title')

    await titleInput.fill('Updated Title')

    // Submit in edit mode triggers PUT /api/menus/1 then opens the summary drawer.
    const submitButton = page.getByRole('button', { name: /^submit$/i })
    await expect(submitButton).toBeVisible()
    // Use keyboard activation to avoid occasional pointer interception by overlapping content.
    await submitButton.press('Enter')

    // Close the drawer so App calls onDone and navigates to details.
    const drawer = page.getByRole('dialog', { name: /Menu:/ })
    await expect(drawer).toBeVisible()
    // Dismiss via keyboard to avoid flakiness from animations/overlapping header.
    await page.keyboard.press('Escape')
    await expect(drawer).toBeHidden()

    await expect(page.getByRole('heading', { name: 'Menu details' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Updated Title' })).toBeVisible()
  })
})
