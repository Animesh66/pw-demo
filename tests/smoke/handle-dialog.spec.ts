import { test, expect } from '@playwright/test';

// test.describe.configure({ mode: 'parallel' });

test.describe('Handle Dialog', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await expect(page).toHaveTitle(/learnwithanimesh/);
    await expect(page).toHaveURL(/.*\/home/);
  });

    test.afterEach(async ({ page }) => {
    await page.close();
  });

  test('should handle alert dialog acceptance', async ({ page }) => {
    // await page.pause();
    page.on('dialog', dialog => dialog.accept());
    await page.getByRole('button', { name: 'Trigger Confirm' }).click();
    await expect(page.getByRole('heading', { name: 'Alerts & Modals' })).toBeVisible();
  });

  test('should handle alert dialog dismissal', async ({ page }) => {
    // await page.pause();
    page.on('dialog', dialog => dialog.dismiss());
    await page.getByRole('button', { name: 'Trigger Confirm' }).click();
    await expect(page.getByRole('heading', { name: 'Alerts & Modals' })).toBeVisible();
  });
});
