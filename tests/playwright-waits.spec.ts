import { test, expect } from '@playwright/test';


  test('Test with default assertion timeout wait(5 seconds)', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await expect(page).toHaveTitle(/learnwithanimesh/);
    await expect(page).toHaveURL(/.*\/home/)
    // Click on the submit button
    await page.getByText('Submit Form').click()
    // Verify the success message
    await expect(page.locator('#success-msg')).toHaveText('Form Submitted successfully');
    //Close the page at the end of the test
    await page.close();
  });

  test('Test with Static Wait Scenario', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await expect(page).toHaveTitle(/learnwithanimesh/);
    await expect(page).toHaveURL(/.*\/home/)
    // Click on the submit button
    await page.getByText('Submit Form').click()
    // Static Wait
    await page.waitForTimeout(10000);
    await expect(page.locator('#success-msg')).toHaveText('Form Submitted successfully');
    //Close the page at the end of the test
    await page.close();
  });

  test('Test with Dynamic Wait Scenario', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await expect(page).toHaveTitle(/learnwithanimesh/);
    await expect(page).toHaveURL(/.*\/home/)
    // Click on the submit button
    await page.getByText('Submit Form').click()
    // Dynamic Wait
    await page.locator('#success-msg').waitFor();
    const expectedText = await page.locator('#success-msg').textContent();
    expect(expectedText).toBe('Form Submitted successfully');
    //Close the page at the end of the test   
    await page.close();
  });

  test('Test with Assertion Wait (extended timeout) Scenario', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await expect(page).toHaveTitle(/learnwithanimesh/);
    await expect(page).toHaveURL(/.*\/home/)
    // Click on the submit button
    await page.getByText('Submit Form').click()
    //Use Assertion Wait with extended timeout
    await expect(page.locator('#success-msg')).toHaveText('Form Submitted successfully', { timeout: 10000 });
    //Close the page at the end of the test
    await page.close();
  });


