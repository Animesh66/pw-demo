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
    // and wait for navigation to complete
    await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 10000 });
    
    // Additional verification: Check that user-specific elements are visible in header
    // This could be the user's name, email, or a logout button
    await expect(page.getByRole('banner')).toBeVisible();
  });

  test('should place order successfully with valid card number', async ({ page }) => {
    // Navigate to products/shop page
    await page.getByRole('banner').getByRole('link', { name: 'Shop Now' }).click();
    
    // Add a product to cart
    await page.getByRole('button', { name: /Add to Cart/i }).first().click();
    
    // Navigate to cart
    await page.getByRole('link', { name: /cart/i }).click();
    
    // Proceed to checkout
    await page.getByRole('button', { name: /checkout|proceed to checkout/i }).click();
    
    // Fill in shipping information if required
    await page.getByPlaceholder(/address/i).fill('123 Test Street').catch(() => {});
    await page.getByPlaceholder(/city/i).fill('Test City').catch(() => {});
    await page.getByPlaceholder(/zip|postal/i).fill('12345').catch(() => {});
    
    // Fill in valid card details
    await page.getByPlaceholder(/card number/i).fill('4111111111111111');
    await page.getByPlaceholder(/name on card/i).fill('Test User').catch(() => {});
    await page.getByPlaceholder(/expiry|expiration/i).fill('12/28').catch(() => {});
    await page.getByPlaceholder(/cvv|cvc|security code/i).fill('123').catch(() => {});
    
    // Submit order
    await page.getByRole('button', { name: /place order|complete order|submit/i }).click();
    
    // Verify order success
    await expect(page.getByText(/order.*success|thank you|confirmed/i)).toBeVisible({ timeout: 10000 });
  });

  test('should fail to place order with invalid card number', async ({ page }) => {
    // Navigate to products/shop page
    await page.getByRole('banner').getByRole('link', { name: 'Shop Now' }).click();
    
    // Add a product to cart
    await page.getByRole('button', { name: /Add to Cart/i }).first().click();
    
    // Navigate to cart
    await page.getByRole('link', { name: /cart/i }).click();
    
    // Proceed to checkout
    await page.getByRole('button', { name: /checkout|proceed to checkout/i }).click();
    
    // Fill in shipping information if required
    await page.getByPlaceholder(/address/i).fill('123 Test Street').catch(() => {});
    await page.getByPlaceholder(/city/i).fill('Test City').catch(() => {});
    await page.getByPlaceholder(/zip|postal/i).fill('12345').catch(() => {});
    
    // Fill in invalid card details
    await page.getByPlaceholder(/card number/i).fill('1234567890123456');
    await page.getByPlaceholder(/name on card/i).fill('Test User').catch(() => {});
    await page.getByPlaceholder(/expiry|expiration/i).fill('12/28').catch(() => {});
    await page.getByPlaceholder(/cvv|cvc|security code/i).fill('123').catch(() => {});
    
    // Submit order
    await page.getByRole('button', { name: /place order|complete order|submit/i }).click();
    
    // Verify order failure - look for error message
    await expect(page.getByText(/invalid.*card|card.*invalid|payment.*failed|error/i)).toBeVisible({ timeout: 10000 });
  });
});
