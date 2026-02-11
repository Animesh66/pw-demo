import { test, expect } from '@playwright/test';


  test('Playwright Wait, resolve synchronization issue', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await expect(page).toHaveTitle(/learnwithanimesh/);
    await expect(page).toHaveURL(/.*\/home/)
    // Click on the submit button
    await page.getByText('Submit Form').click()
    // Static Wait
    await page.waitForTimeout(10000);
    await expect(page.locator('#success-msg')).toHaveText('Form Submitted successfully');
    // Dynamic Wait
    await page.locator('#delayed-msg').waitFor();
    const expectedText = await page.locator('#success-msg').textContent();
    expect(expectedText).toBe('Form Submitted successfully');
    //Assertion Wait
    await expect(page.locator('#success-msg')).toHaveText('Form Submitted successfully', { timeout: 10000 });
    
  });
