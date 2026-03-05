import { test, expect } from '@playwright/test';

test.describe('Customer Order Table Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/home');
  });

  test.afterEach(async ({ page }) => {
    await page.close();
  });

  test('should find and update email for a customer in the table', async ({ page }) => {
    const targetEmail = 'eve@example.com';
    const updatedEmail = 'eve.updated@example.com';

    // Count initial rows in the table
    const allRows = page.locator('table tbody tr');
    const initialRowCount = await allRows.count();
    
    // Verify initial count matches expected (tbody contains only data rows, no header)
    expect(initialRowCount).toBe(10);

    //  Verify 3rd row has special class and CSS properties
    const thirdRow = page.locator('table tbody tr').nth(2); 
    await expect(thirdRow).toHaveClass(/row-separator/); 

    // Locate the row that contains the target email (dynamic, no index)
    const targetRow = page.locator('table tbody tr').filter({ hasText: targetEmail });
    await expect(targetRow).toBeVisible();

    //Click the Edit button within that row
    await targetRow.getByRole('button', { name: 'Edit' }).click();

    // After clicking Edit, only one row is in edit mode at a time,
    const emailInput = page.locator('table tbody input[name="email"]');
    await expect(emailInput).toBeVisible();
    await expect(emailInput).toHaveValue(targetEmail);

    // Re-locate the editing row — use a row-scoped locator for the filter
    const editingRow = page.locator('table tbody tr').filter({ has: page.locator('input[name="email"]') });

    //  Clear the existing email and type the new one
    await emailInput.clear();
    await emailInput.fill(updatedEmail);

    // Click the Save button within the same editing row
    await editingRow.getByRole('button', { name: 'Save' }).click();

    // Verify the old email is no longer present in any row
    const oldEmailRow = page.locator('table tbody tr').filter({ hasText: targetEmail });
    await expect(oldEmailRow).not.toBeVisible();

    // Verify the updated email is now visible in the table
    const updatedRow = page.locator('table tbody tr').filter({ hasText: updatedEmail });
    await expect(updatedRow).toBeVisible();

    // Verify the email cell text matches the updated email exactly
    const emailCell = updatedRow.locator('td').filter({ hasText: updatedEmail });
    await expect(emailCell).toHaveText(updatedEmail);
  });
});