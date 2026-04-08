import { test, expect } from '@playwright/test';

test.describe('Visual Regression Tests', () => {
  
  test('should match homepage screenshot after theme change using toHaveScreenshot', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');
    // Wait for page to be fully loaded
    await page.waitForLoadState('domcontentloaded');
    // Click theme change button (sun emoji)
    await page.getByRole('button', { name: '☀️' }).click();
    // Compare page screenshot with baseline
    await expect(page).toHaveScreenshot('homepage-dark-theme.png');
  });

  test('should match homepage screenshot after theme change using toMatchSnapshot', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');
    // Wait for page to be fully loaded
    await page.waitForLoadState('domcontentloaded');
    // Click theme change button (sun emoji)
    await page.getByRole('button', { name: '☀️' }).click();
    // Take screenshot and compare with snapshot
    const screenshot = await page.screenshot();
    expect(screenshot).toMatchSnapshot('homepage-dark-theme-snapshot.png');
  });
});

