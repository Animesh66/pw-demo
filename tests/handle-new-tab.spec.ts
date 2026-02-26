import { test, expect } from '@playwright/test';

test.describe('Handle New Tab', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await expect(page).toHaveTitle(/learnwithanimesh/);
    await expect(page).toHaveURL(/.*\/home/);
  });

  test('should open and interact with new tab', async ({ context, page }) => {
    await page.getByRole('heading', { name: 'Windows & Tabs' }).scrollIntoViewIfNeeded();
    
    const pagePromise = context.waitForEvent('page');
    await page.getByRole('link', { name: 'Open New Tab (Link)' }).click();
    
    const newPage = await pagePromise;
    await newPage.waitForLoadState('domcontentloaded');
    
    expect(newPage.url()).toContain('sample.html');
    console.log(`New tab opened with URL: ${newPage.url()}`);
    
    await expect(newPage.locator('body')).toBeVisible();
    
    const newPageTitle = await newPage.title();
    expect(newPageTitle).toBeTruthy();
    console.log(`New page title: ${newPageTitle}`);
    
    await newPage.close();
    
    await expect(page).toHaveURL('http://localhost:5173/home');
    await expect(page.getByRole('heading', { name: 'Windows & Tabs' })).toBeVisible();
  });
});
