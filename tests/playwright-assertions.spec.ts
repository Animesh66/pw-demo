import { test, expect } from '@playwright/test';


  test('Use Assertions in Playwright', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    // Page Assertion
    await expect(page).toHaveTitle(/learnwithanimesh/);
    await expect(page).toHaveURL(/.*\/home/)
    // Generic Assertions
    const actualText = await page.getByText('Single Click Me').textContent()
    expect(actualText).toEqual('Single Click Me');
    // Locator Assertion
    const singleClickButton = page.getByText('Single Click Me');
    await expect(singleClickButton).toBeVisible();
    await expect(singleClickButton).toBeEnabled();
  });
