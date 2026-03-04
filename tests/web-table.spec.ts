import { test, expect } from '@playwright/test';
import { customers, newCustomer } from '../test-data/customers';

test.describe('Customer Order Table Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/home');
  });

  test.afterEach(async ({ page }) => {
    await page.close();
  });

  test('should count rows, add a new entry, verify count increased, delete an entry and verify count decreased', async ({ page }) => {
    // Step 1: Count initial rows in the table
    const allRows = page.locator('table tbody tr');
    const initialRowCount = await allRows.count();
    console.log(`Initial row count: ${initialRowCount}`);
    
    // Verify initial count matches expected (tbody contains only data rows, no header)
    expect(initialRowCount).toBe(customers.length);

    //  Verify 3rd row has special class and CSS properties
    const thirdRow = page.locator('table tbody tr').nth(2); 
    await expect(thirdRow).toHaveClass(/row-separator/); 

    // Step 2: Add a new customer entry
    await page.getByPlaceholder('Enter first name').fill(newCustomer.firstName);
    await page.getByPlaceholder('Enter last name').fill(newCustomer.lastName);
    await page.getByPlaceholder('Enter email').fill(newCustomer.email);
    await page.getByRole('textbox', { name: /\$/ }).fill(newCustomer.price);
    await page.getByRole('button', { name: 'Add Row' }).click();

    // Verify the new entry appears in the table
    const newCustomerRow = page.locator('table tbody tr').filter({ hasText: newCustomer.email });
    await expect(newCustomerRow).toBeVisible();

    // Step 3: Verify row count increased by 1
    const rowCountAfterAdd = await allRows.count();
    console.log(`Row count after adding: ${rowCountAfterAdd}`);
    expect(rowCountAfterAdd).toBe(initialRowCount + 1);

    // Step 4: Find a customer from test data to delete
    const customerToDelete = customers[customers.length - 1]; // Get last customer from test data
    
    // Locate the row containing this customer
    const rowToDelete = page.locator('table tbody tr').filter({ hasText: customerToDelete.email });
    await expect(rowToDelete).toBeVisible();
    
    // Delete the row
    await rowToDelete.getByRole('button', { name: 'Delete' }).click();

    // Step 5: Verify row count decreased by 1
    const rowCountAfterDelete = await allRows.count();
    console.log(`Row count after deleting: ${rowCountAfterDelete}`);
    expect(rowCountAfterDelete).toBe(rowCountAfterAdd - 1);
    
    // Verify the deleted customer is no longer in the table
    const deletedCustomerRow = page.locator('table tbody tr').filter({ hasText: customerToDelete.email });
    await expect(deletedCustomerRow).not.toBeVisible();
  });

  test('should find and update email for a customer in the table', async ({ page }) => {
    const targetEmail = 'eve@example.com';
    const updatedEmail = 'eve.updated@example.com';

    // Step 1: Locate the row that contains the target email (dynamic, no index)
    const targetRow = page.locator('table tbody tr').filter({ hasText: targetEmail });
    await expect(targetRow).toBeVisible();

    // Step 2: Click the Edit button within that row
    await targetRow.getByRole('button', { name: 'Edit' }).click();

    // Step 3: After clicking Edit, only one row is in edit mode at a time,
    const emailInput = page.locator('table tbody input[name="email"]');
    await expect(emailInput).toBeVisible();
    await expect(emailInput).toHaveValue(targetEmail);

    // Re-locate the editing row — use a row-scoped locator for the filter
    const editingRow = page.locator('table tbody tr').filter({ has: page.locator('input[name="email"]') });

    // Step 4: Clear the existing email and type the new one
    await emailInput.clear();
    await emailInput.fill(updatedEmail);

    // Step 5: Click the Save button within the same editing row
    await editingRow.getByRole('button', { name: 'Save' }).click();

    // Step 6: Verify the old email is no longer present in any row
    const oldEmailRow = page.locator('table tbody tr').filter({ hasText: targetEmail });
    await expect(oldEmailRow).not.toBeVisible();

    // Step 7: Verify the updated email is now visible in the table
    const updatedRow = page.locator('table tbody tr').filter({ hasText: updatedEmail });
    await expect(updatedRow).toBeVisible();

    // Step 8: Verify the email cell text matches the updated email exactly
    const emailCell = updatedRow.locator('td').filter({ hasText: updatedEmail });
    await expect(emailCell).toHaveText(updatedEmail);
  });
});