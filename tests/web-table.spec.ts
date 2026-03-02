import { test, expect } from '@playwright/test';
import { customers, newCustomer } from '../test-data/customers';

test.describe('Customer Order Table Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/home');
  });

  test('should count rows, add a new entry, verify count increased, delete an entry and verify count decreased', async ({ page }) => {
    // Step 1: Count initial rows in the table
    const allRows = page.getByRole('row');
    const initialRowCount = await allRows.count();
    console.log(`Initial row count: ${initialRowCount}`);
    
    // Verify initial count matches expected (customers.length + 1 for header)
    expect(initialRowCount).toBe(customers.length + 1);

    // Step 2: Add a new customer entry
    await page.getByPlaceholder('Enter first name').fill(newCustomer.firstName);
    await page.getByPlaceholder('Enter last name').fill(newCustomer.lastName);
    await page.getByPlaceholder('Enter email').fill(newCustomer.email);
    await page.getByRole('textbox', { name: /\$/ }).fill(newCustomer.price);
    await page.getByRole('button', { name: 'Add Row' }).click();

    // Verify the new entry appears in the table
    const newCustomerRow = page.getByRole('row', { 
      name: new RegExp(`${newCustomer.firstName}.*${newCustomer.lastName}.*${newCustomer.email}`) 
    });
    await expect(newCustomerRow).toBeVisible();

    // Step 3: Verify row count increased by 1
    const rowCountAfterAdd = await allRows.count();
    console.log(`Row count after adding: ${rowCountAfterAdd}`);
    expect(rowCountAfterAdd).toBe(initialRowCount + 1);

    // Step 4: Find a customer from test data to delete
    const customerToDelete = customers[customers.length - 1]; // Get last customer from test data
    
    // Locate the row containing this customer
    const rowToDelete = page.getByRole('row', { 
      name: new RegExp(`${customerToDelete.firstName}.*${customerToDelete.lastName}.*${customerToDelete.email}`) 
    });
    await expect(rowToDelete).toBeVisible();
    
    // Delete the row
    await rowToDelete.getByRole('button', { name: 'Delete' }).click();

    // Step 5: Verify row count decreased by 1
    const rowCountAfterDelete = await allRows.count();
    console.log(`Row count after deleting: ${rowCountAfterDelete}`);
    expect(rowCountAfterDelete).toBe(rowCountAfterAdd - 1);
    
    // Verify the deleted customer is no longer in the table
    const deletedCustomerRow = page.getByRole('row', { 
      name: new RegExp(`${customerToDelete.firstName}.*${customerToDelete.email}`) 
    });
    await expect(deletedCustomerRow).not.toBeVisible();
  });
});
