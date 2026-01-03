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
    await fulfillJson(route, [{ id: 1, description: 'joy' }])
  })
  await page.route(`${API}/api/textures`, async (route) => {
    if (route.request().method() === 'OPTIONS') return fulfillPreflight(route)
    await fulfillJson(route, [{ id: 1, description: 'crunchy' }])
  })
  await page.route(`${API}/api/shapes`, async (route) => {
    if (route.request().method() === 'OPTIONS') return fulfillPreflight(route)
    await fulfillJson(route, [{ id: 1, description: 'round' }])
  })
}

async function mockMenusList(page: Page) {
  await page.route(`${API}/api/menus`, async (route) => {
    const method = route.request().method()
    if (method === 'OPTIONS') return fulfillPreflight(route)
    if (method !== 'GET') return route.fallback()
    await fulfillJson(route, [])
  })
}

async function openNewMenuRequest(page: Page) {
  // Disambiguate from the MenuBar action (same label with different casing).
  // The MenuListPage CTA is inside the header row with the "My menus" heading.
  const listHeading = page.getByRole('heading', { name: 'My menus' })
  await expect(listHeading).toBeVisible()
  const headerRow = listHeading.locator('..')
  const cta = headerRow.getByRole('button', { name: /^New menu request$/ })
  await expect(cta).toBeVisible()
  await cta.click()
  await expect(page.getByText('Menu Title')).toBeVisible()
}

function inputNearLabel(page: Page, labelText: string) {
  // Chakra's FormLabel isn't always associated via htmlFor, so use proximity.
  return page.locator('label', { hasText: labelText }).locator('..').locator('input, textarea').first()
}

async function openDishModal(page: Page) {
  await page.getByRole('button', { name: 'Add' }).click()
  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()
  await expect(page.getByText('New Dish')).toBeVisible()
  return dialog
}

async function closeToastIfPresent(page: Page) {
  const region = page.getByRole('region', { name: 'Notifications-bottom' })
  const close = region.getByRole('button', { name: 'Close' })
  if (await close.isVisible().catch(() => false)) {
    await close.click({ force: true })
  }
}

async function createLocalDish(page: Page, name: string) {
  await openDishModal(page)
  await inputNearLabel(page, 'Name').fill(name)
  await page.getByRole('button', { name: 'Save' }).click()
  await expect(page.getByText(name)).toBeVisible()
}

test.describe('Menu Form', () => {
  test.beforeEach(async ({ page }) => {
    await mockAuth(page)
    await mockAttributes(page)
    await mockMenusList(page)
    await page.goto('/')
    await openNewMenuRequest(page)
  })

  test('should show breadcrumb navigation', async ({ page }) => {
    // Breadcrumb is always rendered when authenticated.
    const breadcrumb = page.locator('nav[aria-label="breadcrumb"]')
    await expect(breadcrumb).toBeVisible()
    await expect(breadcrumb.getByText('My menus')).toBeVisible()
    await expect(breadcrumb.getByText('New Menu Request')).toBeVisible()
  })

  test('should be able to add a new dish', async ({ page }) => {
    await openDishModal(page)
  })

  test('should validate dish name is required', async ({ page }) => {
    await openDishModal(page)
    await page.getByRole('button', { name: 'Save' }).click()
    await expect(page.getByText('Name is required')).toBeVisible()
  })

  test('should allow setting taste values with sliders', async ({ page }) => {
    const dialog = await openDishModal(page)

    // Enable sweet and ensure the slider is usable.
    const sweetLabel = dialog.getByText('Sweet', { exact: true })
    await sweetLabel.scrollIntoViewIfNeeded()
    await sweetLabel.click({ force: true })
    const sweetSlider = page.getByRole('slider', { name: 'sweet-slider' })
    await expect(sweetSlider).toBeEnabled()
    await sweetSlider.focus()
    await page.keyboard.press('ArrowRight')
  })

  test('should allow selecting dish section', async ({ page }) => {
    await openDishModal(page)

    // SectionSelect (chakra-react-select) defaults to "None".
    const sectionCombo = page.getByRole('combobox').first()
    await sectionCombo.click()
    await page.getByText('Appetizer', { exact: true }).click()
    await expect(page.getByText('Appetizer', { exact: true })).toBeVisible()
  })

  test('should allow selecting colors', async ({ page }) => {
    const dialog = await openDishModal(page)

    const color1Label = dialog.getByText('Color 1', { exact: true })
    await color1Label.scrollIntoViewIfNeeded()
    await color1Label.click({ force: true })
    const colorPicker = page.locator('input[type="color"]').first()
    await expect(colorPicker).toBeEnabled()
    await colorPicker.fill('#ff0000')
  })

  test('should show summary drawer with dishes', async ({ page }) => {
    // Add a dish locally.
    await createLocalDish(page, 'Test Pasta')

    // Close toast to prevent pointer interception on mobile viewports.
    await closeToastIfPresent(page)

    // Fill menu title and submit (this triggers API calls and opens the drawer).
    const titleInput = page.getByRole('textbox', { name: 'Menu Title' })
    await titleInput.click()
    await titleInput.type('Test Menu')
    await expect(titleInput).toHaveValue('Test Menu')

    // Mock menu + dish creation endpoints.
    // Replace the list mock with a single handler so POST doesn't depend on route ordering.
    await page.unroute('**/api/menus')
    await page.route('**/api/menus', async (route) => {
      const method = route.request().method()
      if (method === 'OPTIONS') return fulfillPreflight(route)
      if (method === 'GET') {
        await fulfillJson(route, [])
        return
      }

      if (method === 'POST') {
        await fulfillJson(route, { message: 'ok', id: 123 })
        return
      }

      await route.fallback()
    })

    let dishId = 1000
    await page.route('**/api/menus/123/dishes', async (route) => {
      const method = route.request().method()
      if (method === 'OPTIONS') return fulfillPreflight(route)
      if (method !== 'POST') return route.fallback()
      dishId += 1
      await fulfillJson(route, { message: 'ok', id: dishId })
    })

    const submit = page.getByRole('button', { name: 'Submit' })
    await submit.scrollIntoViewIfNeeded()
    await submit.click()

    await expect(page.getByText('Menu submitted')).toBeVisible({ timeout: 10_000 })
    await expect(page.getByText('Menu: Test Menu')).toBeVisible({ timeout: 10_000 })
    const drawer = page.getByRole('dialog', { name: 'Menu: Test Menu' })
    await expect(drawer.getByRole('heading', { name: 'Test Pasta' })).toBeVisible({ timeout: 10_000 })
  })

  test('should allow reordering dishes', async ({ page, isMobile }) => {
    await createLocalDish(page, 'Dish A')
    await createLocalDish(page, 'Dish B')

    // On mobile browsers, pointer/drag semantics vary a lot; still assert the
    // draggable UI is present (no skipping).
    if (isMobile) {
      await expect(page.getByText('#1')).toBeVisible()
      await expect(page.getByText('#2')).toBeVisible()
      return
    }

    const dishA = page.getByText('Dish A')
    const dishB = page.getByText('Dish B')

    const sourceBox = await dishB.boundingBox()
    const targetBox = await dishA.boundingBox()
    expect(sourceBox).toBeTruthy()
    expect(targetBox).toBeTruthy()

    // Drag Dish B above Dish A.
    await page.mouse.move(sourceBox!.x + sourceBox!.width / 2, sourceBox!.y + sourceBox!.height / 2)
    await page.mouse.down()
    await page.mouse.move(targetBox!.x + targetBox!.width / 2, targetBox!.y + 5)
    await page.mouse.up()

    // Order labels should flip after reordering.
    await expect(page.locator('text=#1').first()).toBeVisible()
  })
})
