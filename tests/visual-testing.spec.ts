import { test, expect } from '@playwright/test';

test.describe('Visual Regression Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');
    // Wait for page to be fully loaded
    await page.waitForLoadState('domcontentloaded');
  });

  test.afterEach(async ({ page }) => {
    // Reset theme to default (dark mode) after each test
    await page.close();
  });

  test('should compare homepage screenshots before and after theme change using toHaveScreenshot',{ tag: '@visual-screenshot' }, async ({ page }) => {
    // Take screenshot before theme change, masking the clock to avoid time-based failures
    await expect(page).toHaveScreenshot('homepage-before-theme-change.png', {
      animations: 'disabled',
      mask: [page.getByText(/\d{1,2}:\d{2}:\d{2}\s*(AM|PM)/i)],
    });
    
    // Click theme change button to switch to dark mode (first button in navigation)
    await page.locator('nav button').first().click();
    
    // Take screenshot after theme change and compare, masking the clock
    await expect(page).toHaveScreenshot('homepage-after-theme-change.png', {
      animations: 'disabled',
      mask: [page.getByText(/\d{1,2}:\d{2}:\d{2}\s*(AM|PM)/i)],
    });
  });

  test('should compare homepage text content before and after theme change using toMatchSnapshot',{ tag: '@visual-snapshot' }, async ({ page }) => {
    // Get text content and remove the clock time using regex
    const getTextWithoutClock = async () => {
      const text = await page.textContent('body');
      // Remove time pattern from text
      return text?.replace(/\d{1,2}:\d{2}:\d{2}\s*(AM|PM)/gi, '[TIME]') || '';
    };
    
    // Get text content before theme change
    const textContentBefore = await getTextWithoutClock();
    expect(textContentBefore).toMatchSnapshot('homepage-before-theme-change-text.txt');
    
    // Click theme change button to switch to dark mode (first button in navigation)
    await page.locator('nav button').first().click();
    
    // Get text content after theme change and compare
    const textContentAfter = await getTextWithoutClock();
    expect(textContentAfter).toMatchSnapshot('homepage-after-theme-change-text.txt');
  });

  test('should compare homepage screenshot using toMatchSnapshot',{ tag: '@visual-snapshot-compare' }, async ({ page }) => {
    // Take screenshot of the homepage
    const screenshot = await page.screenshot({ fullPage: true, animations: 'disabled' });
    
    // Compare screenshot using toMatchSnapshot
    expect(screenshot).toMatchSnapshot('homepage-screenshot.png');
  });
});

