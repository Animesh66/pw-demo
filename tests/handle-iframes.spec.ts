import { test, expect } from '@playwright/test';

test.describe('Handle iframes', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await expect(page).toHaveTitle(/learnwithanimesh/);
    await expect(page).toHaveURL(/.*\/home/);
  });

  test('should interact with iframe elements', async ({ page }) => {
    await page.getByRole('heading', { name: 'iFrames' }).scrollIntoViewIfNeeded();
    
    const frame = page.frameLocator('iframe');
    
    await expect(frame.getByRole('heading', { name: 'I am inside an iFrame!' })).toBeVisible();
    await expect(frame.getByRole('button', { name: 'Click Me (iFrame)' })).toBeVisible();
    await frame.getByRole('button', { name: 'Click Me (iFrame)' }).click();
    await expect(frame.getByRole('button', { name: 'Click Me (iFrame)' })).toBeVisible();
  });
});
