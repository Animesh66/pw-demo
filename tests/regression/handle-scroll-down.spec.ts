import { test, expect } from '@playwright/test';

test.describe('Handle Scroll Down', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await expect(page).toHaveTitle(/learnwithanimesh/);
    await expect(page).toHaveURL(/.*\/home/);
  });

  test('should scroll to footer text', async ({ page }) => {
    await page.getByText('© 2026 learnwithanimesh. All rights reserved.').scrollIntoViewIfNeeded();
    await expect(page.getByText('© 2026 learnwithanimesh. All rights reserved.')).toBeVisible();
    await page.screenshot({ path: 'screenshot/scroll-down.png' });
  });
});
