import { test, expect } from '@playwright/test';

test.describe('Handle Modal', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await expect(page).toHaveTitle(/learnwithanimesh/);
    await expect(page).toHaveURL(/.*\/home/);
  });

  test('should open and close modal', async ({ page }) => {
    await page.getByRole('heading', { name: '🚨 Alerts & Modals' }).scrollIntoViewIfNeeded();
    
    await page.getByRole('button', { name: 'Open Modal Behavior' }).click();
    
    const modal = page.locator('[role="dialog"], .modal, [class*="modal"]').first();
    await expect(modal).toBeVisible({ timeout: 5000 });
    
    await expect(modal).not.toBeEmpty();
    console.log('Modal opened successfully');
    
    const closeButton = modal.locator('button').filter({ hasText: /close|×|x/i }).first();
    const closeButtonExists = await closeButton.count() > 0;
    
    if (closeButtonExists) {
      await closeButton.click();
      await expect(modal).toBeHidden({ timeout: 3000 });
      console.log('Modal closed successfully');
    } else {
      await page.keyboard.press('Escape');
      await expect(modal).toBeHidden({ timeout: 3000 });
      console.log('Modal closed with Escape key');
    }
    
    await expect(page).toHaveURL('http://localhost:5173/home');
    await expect(page.getByRole('heading', { name: '🚨 Alerts & Modals' })).toBeVisible();
  });
});
