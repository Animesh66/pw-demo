import { test, expect } from '@playwright/test';

test.describe('Handle iframes', {tag: '@iframe-test'},() => {

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await expect(page).toHaveTitle(/learnwithanimesh/);
    await expect(page).toHaveURL(/.*\/home/);
  });

  test.afterEach(async ({ page }) => {
    await page.close();
  });

  test.fail('should interact with iframe element @regression', {
  annotation: {
    type: 'issue',
    description: 'https://github.com/issue-url',
  },
}, async ({ page }) => {
    // This test is expected to fail due to a known issue with handling iframes in Playwright. Once the issue is resolved, remove the fail annotation and verify the test passes successfully.
    const frame = page.frameLocator('#test-iframe');
    await frame.getByRole('button', { name: 'Click Me (iFrame)' }).click();
    await expect(frame.getByText('Clicked inside iFrame 1!')).toBeVisible();
    await page.getByRole('button', { name: 'Single Click Me' }).click();
    await expect(page.getByRole('button', { name: 'Single Click Me' })).toBeVisible();
  });
});
