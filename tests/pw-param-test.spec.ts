import { test, expect } from '@playwright/test';


  test('This is a non parameterized test', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await expect(page).toHaveTitle(/learnwithanimesh/);
    await expect(page).toHaveURL(/.*\/home/)
    await page.close();
  });

  test('This is a parameterized test', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await expect(page).toHaveTitle(/learnwithanimesh/);
    await expect(page).toHaveURL(/.*\/home/)
    await page.close();
  });
