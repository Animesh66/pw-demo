import { test, expect } from '../fixtures/fixtures';

test.describe('Order Placement Tests', () => {
  
  test('should place order successfully with valid card number', async ({ checkout: page }) => {
    // Fill in valid card details using the actual placeholders on the page
    await page.getByPlaceholder('1234 5678 9012 3456').fill('4111111111111111');
    await page.getByPlaceholder('John Doe').fill('Test User');
    await page.getByPlaceholder('MM/YY').fill('12/28');
    await page.getByPlaceholder('123').last().fill('456');
    // Submit order 
    await page.getByRole('button', { name: /pay/i }).click();
    // Verify order success
    await expect(page.getByText(/order.*success|thank you|confirmed/i)).toBeVisible({ timeout: 10000 });
  });

  test('should fail to place order with invalid card number', async ({ checkout: page }) => {    
    // Fill in invalid card details using the actual placeholders on the page
    await page.getByPlaceholder('1234 5678 9012 3456').fill('1234567890123456');
    await page.getByPlaceholder('John Doe').fill('Test User');
    await page.getByPlaceholder('MM/YY').fill('12/28');
    await page.getByPlaceholder('123').last().fill('456');
    // Submit order 
    await page.getByRole('button', { name: /pay/i }).click();
    // Verify order failure - look for error message
    await expect(page.getByText(/please enter a valid card|invalid.*card|card.*invalid|payment.*failed|error/i)).toBeVisible({ timeout: 10000 });
  });
});
