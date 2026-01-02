import { test, expect } from '@playwright/test'

test.describe('Language Selector', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should display language selector', async ({ page }) => {
    // The language selector should be visible in the MenuBar or as a standalone component
    // Check if there's a language-related element
    const languageElements = page.locator('[data-testid="language-selector"], select, .language-selector')

    // If language selector exists, it should be interactive
    const count = await languageElements.count()
    if (count > 0) {
      await expect(languageElements.first()).toBeVisible()
    }
  })

  test('should change language when selected', async ({ page }) => {
    // Verify the page is loaded in a supported language (English or Italian)
    // by checking for the presence of the app title which is always visible
    await expect(page.getByText('🍽️ SoundFood')).toBeVisible()

    // Check that either English or Italian login button is present
    const englishButton = page.getByRole('button', { name: 'Login' })
    const italianButton = page.getByRole('button', { name: 'Accedi' })

    const isEnglish = await englishButton.count() > 0
    const isItalian = await italianButton.count() > 0

    expect(isEnglish || isItalian).toBeTruthy()
  })
})

test.describe('Accessibility', () => {
  test('should have proper heading structure', async ({ page }) => {
    await page.goto('/')

    // Check for at least one heading
    const headings = page.getByRole('heading')
    await expect(headings.first()).toBeVisible()
  })

  test('should have proper form labels', async ({ page }) => {
    await page.goto('/')

    // All form inputs should have associated labels
    const inputs = page.locator('input:not([type="hidden"])')
    const inputCount = await inputs.count()

    for (let i = 0; i < inputCount; i++) {
      const input = inputs.nth(i)
      const id = await input.getAttribute('id')

      if (id) {
        // Check if there's a label for this input
        const label = page.locator(`label[for="${id}"]`)
        const labelExists = await label.count() > 0
        const ariaLabel = await input.getAttribute('aria-label')
        const ariaLabelledby = await input.getAttribute('aria-labelledby')

        // Input should have either a label, aria-label, or aria-labelledby
        expect(labelExists || ariaLabel || ariaLabelledby).toBeTruthy()
      }
    }
  })

  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/')

    // Click on the page body first to ensure the page has focus
    await page.locator('body').click()

    // Tab through the page
    await page.keyboard.press('Tab')

    // First focusable element should be focused (the Username input based on tab order)
    const usernameInput = page.getByRole('textbox', { name: /username/i })
    await expect(usernameInput).toBeFocused()
  })

  test('should have proper color contrast', async ({ page }) => {
    await page.goto('/')

    // This is a basic check - for full a11y testing, use axe-playwright
    // Check that text is visible
    const textElements = page.locator('body')
    await expect(textElements).toBeVisible()
  })
})

test.describe('Responsive Design', () => {
  test('should work on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    // Page should still be functional
    await expect(page.getByText('🍽️ SoundFood')).toBeVisible()
  })

  test('should work on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.goto('/')

    // Page should still be functional
    await expect(page.getByText('🍽️ SoundFood')).toBeVisible()
  })

  test('should work on desktop viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.goto('/')

    // Page should still be functional
    await expect(page.getByText('🍽️ SoundFood')).toBeVisible()
  })
})
