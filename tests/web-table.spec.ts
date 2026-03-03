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

    // Step 1.5: Verify 3rd row has special class and CSS properties
    const thirdRow = page.locator('table tbody tr').nth(2); // 0-indexed, so 2 is the 3rd row
    await expect(thirdRow).toHaveClass(/row-separator/); // Check if row has 'row-separator' class
    
    // Verify the CSS background-color property of the 3rd row
    const backgroundColor = await thirdRow.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });
    console.log(`3rd row background color: ${backgroundColor}`);
    expect(backgroundColor).toBe('rgba(0, 0, 0, 0)'); // Verify transparent background

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
});
