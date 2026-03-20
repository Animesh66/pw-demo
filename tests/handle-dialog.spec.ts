import { test, expect } from '@playwright/test';

test.describe('Handle Dialog', {tag: '@dialog-test'}, () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await expect(page).toHaveTitle(/learnwithanimesh/);
    await expect(page).toHaveURL(/.*\/home/);
  });

    test.afterEach(async ({ page }) => {
    await page.close();
  });


  test.only('should handle alert dialog acceptance', async ({ page }) => {
    page.on('dialog', dialog => dialog.accept());
    await page.getByRole('button', { name: 'Trigger Confirm' }).click();
    await expect(page.getByRole('heading', { name: 'Alerts & Modals' })).toBeVisible();
  });

  test.fixme('should handle alert dialog dismissal', async ({ page, browserName }) => {
    // Skipping this test as there is new screen added recently which is causing the test to fail. Will fix this test in next video.
    test.skip(browserName === 'chromium', 'Does not work in chromium due to known issue');
    page.on('dialog', dialog => dialog.dismiss());
    await page.getByRole('button', { name: 'Trigger Confirm' }).click();
    await expect(page.getByRole('heading', { name: 'Alerts & Modals' })).toBeVisible();
  });
});
