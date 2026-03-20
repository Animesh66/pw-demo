import { test, expect } from '@playwright/test';

test.describe('Handle New Tab @new-tab-test', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await expect(page).toHaveTitle(/learnwithanimesh/);
    await expect(page).toHaveURL(/.*\/home/);
  });

  test.afterEach(async ({ page }) => {
    await page.close();
  });

  test.fixme('should open and interact with new tab', { tag: ['@regression', '@smoke']},async ({ page }) => {
    // TODO: This test is expected to fail due to a known issue with handling new tabs in Playwright. Once the issue is resolved, remove the fixme annotation and verify the test passes successfully.
    // wait for the new page to open after clicking the link
    const [newPage] = await Promise.all([page.waitForEvent('popup'), page.getByRole('link', { name: 'Open New Tab (Link)' }).click()]);
    // wait for the new page to load
    await newPage.waitForLoadState('load'); 
    // verify the new page URL and title
    await expect(newPage).toHaveURL('http://localhost:5173/sample.html');
    await expect(newPage).toHaveTitle('Sample New Tab Page');
    //close the new tab and verify we are back to the original page
    await newPage.close();
    await expect(page).toHaveURL('http://localhost:5173/home');
    await expect(page).toHaveTitle('learnwithanimesh');
  });
});
