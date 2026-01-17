import { test, expect } from '@playwright/test';


  test('Use Assertions in Playwright', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await expect(page).toHaveTitle(/learnwithanimesh/);
  });
