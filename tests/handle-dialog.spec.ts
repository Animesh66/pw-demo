import { test, expect } from '@playwright/test';

test.describe('Handle Dialog', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await expect(page).toHaveTitle(/learnwithanimesh/);
    await expect(page).toHaveURL(/.*\/home/);
  });

  test('should handle alert dialog', async ({ page }) => {
    page.on('dialog', dialog => dialog.accept());
    await page.getByRole('button', { name: 'Trigger Alert' }).click();
    await expect(page.getByRole('heading', { name: '🚨 Alerts & Modals' })).toBeVisible();
  });
});
