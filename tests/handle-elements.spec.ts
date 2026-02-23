import { test, expect } from '@playwright/test';

test.describe('Handle Different Elements', () => {

  test('Handle Dialog', async ({ page }) => {
    await page.goto('http://localhost:5173/home');

    page.once('dialog', async dialog => {
      expect(dialog.type()).toBe('alert');
      expect(dialog.message()).toBeTruthy();
      console.log(`Dialog message: ${dialog.message()}`);
      await dialog.accept();
    });

    await page.click('button:has-text("Trigger Alert")');
    
    // Assert that dialog was handled and page is still functional
    await expect(page).toHaveURL('http://localhost:5173/home');
    await expect(page.locator('h2:has-text("🚨 Alerts & Modals")')).toBeVisible();
  });

  test('Handle Scroll Down', async ({ page }) => {
    await page.goto('http://localhost:5173/home');

    // Get initial scroll position
    const initialScrollY = await page.evaluate(() => window.scrollY);
    expect(initialScrollY).toBe(0);

    // Scroll down to the iFrames section
    await page.locator('h2:has-text("🖼️ iFrames")').scrollIntoViewIfNeeded();
    
    // Assert scroll position changed
    const scrolledY = await page.evaluate(() => window.scrollY);
    expect(scrolledY).toBeGreaterThan(initialScrollY);
    console.log(`Scrolled from ${initialScrollY} to ${scrolledY}`);

    // Verify the iFrames section is visible after scrolling
    await expect(page.locator('h2:has-text("🖼️ iFrames")')).toBeInViewport();

    // Scroll to bottom of page
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    
    const finalScrollY = await page.evaluate(() => window.scrollY);
    expect(finalScrollY).toBeGreaterThan(scrolledY);
    
    // Verify Configuration section (at the bottom) is visible
    await expect(page.locator('h2:has-text("⚙️ Configuration")')).toBeInViewport();
  });

  test('Handle iframes', async ({ page }) => {
    await page.goto('http://localhost:5173/home');

    // Scroll to the iframe section
    await page.locator('h2:has-text("🖼️ iFrames")').scrollIntoViewIfNeeded();
    
    // Locate the iframe using frameLocator
    const frame = page.frameLocator('iframe');
    
    // Assert iframe heading is visible
    await expect(frame.locator('h2:has-text("I am inside an iFrame!")')).toBeVisible();
    
    // Assert the button inside iframe is visible
    await expect(frame.locator('button:has-text("Click Me (iFrame)")')).toBeVisible();
    
    // Click the button inside the iframe
    await frame.locator('button:has-text("Click Me (iFrame)")').click();
    
    // Assert that the button is still visible after click (confirming iframe interaction worked)
    await expect(frame.locator('button:has-text("Click Me (iFrame)")')).toBeVisible();
  });

  test('Handle New Tab', async ({ context, page }) => {
    await page.goto('http://localhost:5173/home');

    // Scroll to Windows & Tabs section
    await page.locator('h2:has-text("📑 Windows & Tabs")').scrollIntoViewIfNeeded();
    
    // Setup listener for new page/tab before triggering the action
    const pagePromise = context.waitForEvent('page');
    
    // Click the link that opens in new tab
    await page.click('a:has-text("Open New Tab (Link)")');
    
    // Get the new page
    const newPage = await pagePromise;
    await newPage.waitForLoadState('domcontentloaded');
    
    // Assert new page URL contains the expected path
    expect(newPage.url()).toContain('sample.html');
    console.log(`New tab opened with URL: ${newPage.url()}`);
    
    // Assert new page has content
    await expect(newPage.locator('body')).toBeVisible();
    
    // Get the title and verify it's not empty
    const newPageTitle = await newPage.title();
    expect(newPageTitle).toBeTruthy();
    console.log(`New page title: ${newPageTitle}`);
    
    // Close the new page
    await newPage.close();
    
    // Assert original page is still open and functional
    await expect(page).toHaveURL('http://localhost:5173/home');
    await expect(page.locator('h2:has-text("📑 Windows & Tabs")')).toBeVisible();
  });

});
