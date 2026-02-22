import { test, expect } from '@playwright/test';

test.describe('This section contains test hooks', () => {

  test.beforeAll(async () => {
    console.log('Connecting to database or setting up test environment before all tests');
  });

  test.afterAll(async () => {
    console.log('Disconnecting from database or cleaning up test environment after all tests');
  }); 
  
  test.beforeEach(async ({ page }) => {
    console.log('This will run before each test');
    await page.goto('http://localhost:5173/');
    await expect(page).toHaveTitle(/learnwithanimesh/);
    await expect(page).toHaveURL(/.*\/home/)
  });

  test.afterEach(async ({ page }) => {
    console.log('This will run after each test');
    await page.close();
  });

test('Test will perform a single click', async ({ page }) => {
    await page.getByText('Single Click Me').click()
    expect(await page.locator('#click-msg').textContent()).toBe('Single Click Performed!');
  });

test('Test will perform a double click', async ({ page }) => {
    await page.getByText('Double Click Me').dblclick();
    expect(await page.locator('#dbl-click-msg').textContent()).toBe('Double Click Performed!');
  });

});
