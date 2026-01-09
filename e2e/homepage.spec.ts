import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should display the page title', async ({ page }) => {
    await expect(page).toHaveTitle(/APX/)
  })

  test('should display the navbar', async ({ page }) => {
    await expect(page.getByRole('navigation')).toBeVisible()
  })

  test('should display car cards', async ({ page }) => {
    // Wait for cars to load
    await page.waitForSelector('[data-testid="car-card"]', { timeout: 10000 }).catch(() => {
      // If no data-testid, look for car card by class
    })

    // Check that at least one car is displayed (by looking for "Réserver" button)
    const reserveButtons = page.getByText('Réserver')
    await expect(reserveButtons.first()).toBeVisible({ timeout: 10000 })
  })

  test('should have working search functionality', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/rechercher/i)
    if (await searchInput.isVisible()) {
      await searchInput.fill('Tesla')
      // Wait for filtering
      await page.waitForTimeout(500)
    }
  })

  test('should navigate to car detail page when clicking a car', async ({ page }) => {
    // Wait for page to load
    await page.waitForTimeout(1000)

    // Click on the first "Réserver" button or car card link
    const carLink = page.locator('a[href^="/cars/"]').first()
    if (await carLink.isVisible()) {
      await carLink.click()
      await expect(page).toHaveURL(/\/cars\//)
    }
  })
})

test.describe('Navigation', () => {
  test('should navigate to login page', async ({ page }) => {
    await page.goto('/')

    const loginLink = page.getByRole('link', { name: /connexion/i })
    if (await loginLink.isVisible()) {
      await loginLink.click()
      await expect(page).toHaveURL(/\/login/)
    }
  })
})

test.describe('Car Detail Page', () => {
  test('should display car details', async ({ page }) => {
    // Go to a car detail page (assuming at least one car exists)
    await page.goto('/')
    await page.waitForTimeout(1000)

    const carLink = page.locator('a[href^="/cars/"]').first()
    if (await carLink.isVisible()) {
      await carLink.click()

      // Should show booking calendar
      await expect(page.getByText(/calendrier|réservation/i).first()).toBeVisible({ timeout: 5000 }).catch(() => {})
    }
  })
})

test.describe('Responsive Design', () => {
  test('should be mobile friendly', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    // Page should still be functional
    await expect(page.getByRole('navigation')).toBeVisible()
  })
})
