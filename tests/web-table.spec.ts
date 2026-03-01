import { test, expect } from '@playwright/test';

test.describe('Customer Order Table Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/home');
  });

  test('should create a new entry in the Customer Order Table', async ({ page }) => {
    // Scroll to the Customer Order Table section
    await page.getByRole('heading', { name: 'Customer Order Table' }).scrollIntoViewIfNeeded();

    // Fill in the form fields
    await page.getByPlaceholder('Enter first name').fill('John');
    await page.getByPlaceholder('Enter last name').fill('Doe');
    await page.getByPlaceholder('Enter email').fill('john.doe@example.com');
    await page.getByRole('textbox', { name: /\$/ }).fill('150.75');

    // Click the Add Row button
    await page.getByRole('button', { name: 'Add Row' }).click();

    // Verify the new entry appears in the table
    const tableRow = page.getByRole('row', { name: /John.*Doe.*john\.doe@example\.com/ });
    await expect(tableRow).toBeVisible();
    await expect(tableRow).toContainText('John');
    await expect(tableRow).toContainText('Doe');
    await expect(tableRow).toContainText('john.doe@example.com');
    await expect(tableRow).toContainText('$150.75');
  });

  test('should delete an existing entry from the Customer Order Table', async ({ page }) => {
    // Scroll to the Customer Order Table section
    await page.getByRole('heading', { name: 'Customer Order Table' }).scrollIntoViewIfNeeded();

    // Find the row for "Alice Smith" and verify it exists before deletion
    const aliceRow = page.getByRole('row', { name: /Alice.*Smith.*alice@example\.com/ });
    await expect(aliceRow).toBeVisible();

    // Click the Delete button for Alice's row
    await aliceRow.getByRole('button', { name: 'Delete' }).click();

    // Verify the row is removed from the table
    await expect(aliceRow).not.toBeVisible();
  });

  test('should search for and verify an element exists in the Customer Order Table', async ({ page }) => {
    // Scroll to the Customer Order Table section
    await page.getByRole('heading', { name: 'Customer Order Table' }).scrollIntoViewIfNeeded();

    // Search for specific customer entries by verifying they exist in the table
    const bobRow = page.getByRole('row', { name: /Bob.*Johnson.*bob@example\.com/ });
    await expect(bobRow).toBeVisible();
    
    // Verify specific cell data
    const bobEmailCell = page.getByRole('cell', { name: 'bob@example.com', exact: true });
    await expect(bobEmailCell).toBeVisible();

    // Verify order ID for Bob
    const bobOrderCell = page.getByRole('cell', { name: 'ORD-002', exact: true });
    await expect(bobOrderCell).toBeVisible();

    // Verify price for Bob
    const bobPriceCell = page.getByRole('cell', { name: '$40.50', exact: true });
    await expect(bobPriceCell).toBeVisible();

    // Search for another customer - Charlie Brown
    const charlieRow = page.getByRole('row', { name: /Charlie.*Brown.*charlie@example\.com/ });
    await expect(charlieRow).toBeVisible();

    // Verify the total count of rows (header + 10 data rows)
    const allRows = page.getByRole('row');
    await expect(allRows).toHaveCount(11); // 1 header + 10 data rows
  });
});
