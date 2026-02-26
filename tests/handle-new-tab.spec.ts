import { test, expect } from '@playwright/test';

test.describe('Handle New Tab', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await expect(page).toHaveTitle(/learnwithanimesh/);
    await expect(page).toHaveURL(/.*\/home/);
  });

  test.afterEach(async ({ page }) => {
    await page.close();
  });

  test('should open and interact with new tab', async ({ context, page }) => {
    const [newPage] = await Promise.all([page.waitForEvent('popup'), page.getByRole('link', { name: 'Open New Tab (Link)' }).click()]);
    await newPage.waitForLoadState('load');
    await expect(newPage).toHaveURL('http://localhost:5173/sample.html');
    await expect(newPage).toHaveTitle('Sample New Tab Page');
    await newPage.close();
    await expect(page).toHaveURL('http://localhost:5173/home');
    await expect(page).toHaveTitle('learnwithanimesh');
  });
});
