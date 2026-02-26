import { test, expect } from '@playwright/test';

test.describe('Handle iframes', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await expect(page).toHaveTitle(/learnwithanimesh/);
    await expect(page).toHaveURL(/.*\/home/);
  });

  test.afterEach(async ({ page }) => {
    await page.close();
  });

  test('should interact with iframe elements', async ({ page }) => {
    const frame = page.frameLocator('#test-iframe');
    await frame.getByRole('button', { name: 'Click Me (iFrame)' }).click();
    await expect(frame.getByRole('button', { name: 'Click Me (iFrame)' })).toBeVisible();
  });
});
