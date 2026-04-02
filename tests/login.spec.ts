import { test, expect } from '@playwright/test';

test.describe('Order Placement Tests', () => {
  
  
  test.beforeEach(async ({ page }) => {
    // Navigate to the application
    await page.goto('/');
    
    // Navigate to login page using the link in the header banner
    await page.getByRole('banner').getByRole('link', { name: 'Login' }).click();
    
    // Fill in login credentials using getByRole locators
    await page.getByRole('textbox', { name: 'you@example.com' }).fill('test.user@email.com');
    await page.getByRole('textbox', { name: 'Enter your password' }).fill('test1234');
    
    // Click Sign In button
    await page.getByRole('button', { name: 'Sign In' }).click();
    
    // Verify successful login by checking we're redirected away from login page
    await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 10000 });
    
    // Verify user name is displayed in header after successful login
    await expect(page.getByRole('banner').getByText(/Hi,.*test user/i)).toBeVisible({ timeout: 10000 });
  });

  test('should place order successfully with valid card number', async ({ page }) => {
    // Navigate to products/shop page
    await page.getByRole('banner').getByRole('link', { name: 'Shop Now' }).click();
    await expect(page).toHaveURL(/\/shop/);
    
    // Add a product to cart
    await page.getByRole('button', { name: /Add to Cart/i }).first().click();
    
    // Wait for cart to update
    await page.waitForTimeout(1000);
    
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
    
    // Submit order - button text is "💳 Pay $299"
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
    
    // Wait for cart to update
    await page.waitForTimeout(1000);
    
    // Navigate to cart
    await page.getByRole('banner').getByRole('link', { name: /cart/i }).click();
    await expect(page).toHaveURL(/\/cart/);
    
    // Proceed to checkout
    await page.getByRole('button', { name: /checkout|proceed to checkout/i }).click();
    
    // Wait for checkout page to load
    await page.waitForLoadState('networkidle');
    
    // Fill in invalid card details using the actual placeholders on the page
    await page.getByPlaceholder('1234 5678 9012 3456').fill('1234567890123456');
    await page.getByPlaceholder('John Doe').fill('Test User');
    await page.getByPlaceholder('MM/YY').fill('12/28');
    await page.getByPlaceholder('123').last().fill('456');
    
    // Submit order - button text is "💳 Pay $299"
    await page.getByRole('button', { name: /pay/i }).click();
    
    // Verify order failure - look for error message
    await expect(page.getByText(/please enter a valid card|invalid.*card|card.*invalid|payment.*failed|error/i)).toBeVisible({ timeout: 10000 });
  });
});
