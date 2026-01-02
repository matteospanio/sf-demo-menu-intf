import { test, expect } from '@playwright/test'

const API = 'http://localhost:5000'

async function mockAuth(page: any) {
  await page.addInitScript(() => {
    window.localStorage.setItem('auth_token', 'e2e-token')
  })

  await page.route(`${API}/auth/me`, async (route: any) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ id: 1, username: 'e2e-user', role: 'user' }),
    })
  })
}

async function mockAttributes(page: any) {
  const empty = { status: 200, contentType: 'application/json', body: JSON.stringify([]) }
  await page.route(`${API}/api/emotions`, async (route: any) => route.fulfill(empty))
  await page.route(`${API}/api/textures`, async (route: any) => route.fulfill(empty))
  await page.route(`${API}/api/shapes`, async (route: any) => route.fulfill(empty))
}

async function openMyMenus(page: any) {
  // Chakra MenuButton renders as a button with aria-haspopup="menu"
  await page.locator('button[aria-haspopup="menu"]').last().click()
  await page.getByRole('menuitem', { name: 'My menus' }).click()
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
    await expect(page.getByText(menuTitle)).toBeVisible()
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
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ id: 1, title: currentTitle, description: 'Desc' }),
        })
        return
      }

      if (method === 'PUT') {
        const body = route.request().postDataJSON?.() ?? {}
        if (typeof body.title === 'string') currentTitle = body.title
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'ok' }),
        })
        return
      }

      await route.fallback()
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
    await page.getByRole('button', { name: /^submit$/i }).click()

    // Close the drawer so App calls onDone and navigates to details.
    const drawer = page.getByRole('dialog', { name: /Menu:/ })
    await expect(drawer).toBeVisible()
    await drawer.getByRole('button', { name: 'Close' }).click()
    await expect(drawer).toBeHidden()

    await expect(page.getByRole('heading', { name: 'Menu details' })).toBeVisible()
    await expect(page.getByText('Updated Title')).toBeVisible()
  })
})
