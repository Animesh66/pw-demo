import { test, expect } from '@playwright/test';


  test('This test will fail, debug and find the root cause', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await expect(page).toHaveTitle(/learnwithanimesh/);
    await expect(page).toHaveURL(/.*\/home/)
    // Click on the submit button
    await page.pause();
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


