import { test, expect } from '@playwright/test';

test.describe('Visual Regression Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');
    // Wait for page to be fully loaded
    await page.waitForLoadState('domcontentloaded');
  });

  test('should match homepage screenshot after theme change using toHaveScreenshot', async ({ page }) => {
    // Take screenshot before theme change
    await expect(page).toHaveScreenshot('homepage-before-theme-change.png');
    
    // Click theme change button to switch to light mode
    await page.getByRole('button', { name: 'Switch to light mode' }).click();
    
    // Take screenshot after theme change and compare
    await expect(page).toHaveScreenshot('homepage-after-theme-change.png');
  });

  test('should match homepage screenshot after theme change using toMatchSnapshot', async ({ page }) => {
    // Take screenshot before theme change
    const screenshotBefore = await page.screenshot();
    expect(screenshotBefore).toMatchSnapshot('homepage-before-theme-change-snapshot.png');
    
    // Click theme change button to switch to light mode
    await page.getByRole('button', { name: 'Switch to light mode' }).click();
    
    // Take screenshot after theme change and compare
    const screenshotAfter = await page.screenshot();
    expect(screenshotAfter).toMatchSnapshot('homepage-after-theme-change-snapshot.png');
  });
});

