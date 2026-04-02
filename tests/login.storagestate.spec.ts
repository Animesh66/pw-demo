import { test, expect } from '@playwright/test';

test.describe('Order Placement Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to the application
    await page.goto('/');
  });

  test.afterEach(async ({ page }) => {
   await page.close();
  });

  test('should place order successfully with valid card number', async ({ page }) => {
    // Navigate to products/shop page
    await page.getByRole('banner').getByRole('link', { name: 'Shop Now' }).click();
    await expect(page).toHaveURL(/\/shop/);
    
    // Add a product to cart
    await page.getByRole('button', { name: /Add to Cart/i }).first().click();
    
    // Navigate to cart
    await page.getByRole('banner').getByRole('link', { name: /cart/i }).click();
    await expect(page).toHaveURL(/\/cart/);
    
    // Verify item is in cart
    await expect(page.getByText(/cart/i).first()).toBeVisible();
    
    // Proceed to checkout
    await page.getByRole('button', { name: /checkout|proceed to checkout/i }).click();
    
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

  test('should fail to place order with invalid card number', async ({ page }) => {
    // Navigate to products/shop page
    await page.getByRole('banner').getByRole('link', { name: 'Shop Now' }).click();
    await expect(page).toHaveURL(/\/shop/);
    
    // Add a product to cart
    await page.getByRole('button', { name: /Add to Cart/i }).first().click();

    // Navigate to cart
    await page.getByRole('banner').getByRole('link', { name: /cart/i }).click();
    await expect(page).toHaveURL(/\/cart/);
    
    // Proceed to checkout
    await page.getByRole('button', { name: /checkout|proceed to checkout/i }).click();
    
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
