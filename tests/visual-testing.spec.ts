import { test, expect } from '@playwright/test';

test.describe('Visual Regression Tests', () => {
  
  test('should match homepage screenshot after theme change using toHaveScreenshot', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');
    // Click theme change button
    await page.getByRole('button', { name: /theme|dark|light/i }).click();
    // Compare page screenshot with baseline
    await expect(page).toHaveScreenshot('homepage-theme-changed.png');
  });

  test('should match homepage screenshot after theme change using toMatchSnapshot', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');
    // Click theme change button
    await page.getByRole('button', { name: /theme|dark|light/i }).click();
    // Take screenshot and compare with snapshot
    const screenshot = await page.screenshot();
    expect(screenshot).toMatchSnapshot('homepage-theme-changed-snapshot.png');
  });
});

