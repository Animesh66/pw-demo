import { test, expect } from '@playwright/test';

test.describe('This section contains test hooks', () => {

  test.beforeAll(async () => {
    console.log('Connecting to database or setting up test environment before all tests');
  });

  test.afterAll(async () => {
    console.log('Disconnecting from database or cleaning up test environment after all tests');
  }); 
  
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await expect(page).toHaveTitle(/learnwithanimesh/);
    await expect(page).toHaveURL(/.*\/home/)
  });

  test.afterEach(async ({ page }) => {
    await page.close();
  });

test('Test will perform a single click', async ({ page }) => {
    await page.getByText('Single Click Me').click()
    await page.locator('#click-msg').waitFor();
    const expectedText = await page.locator('#click-msg').textContent();
    expect(expectedText).toBe('Single Click Performed!');
  });

test('Test will perform a double click', async ({ page }) => {
    await page.getByText('Double Click Me').dblclick();
    await page.locator('#dbl-click-msg').waitFor();
    const expectedText = await page.locator('#dbl-click-msg').textContent();
    expect(expectedText).toBe('Double Click Performed!');
  });

});
