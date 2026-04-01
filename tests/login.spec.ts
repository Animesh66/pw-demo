import { test, expect } from '@playwright/test';

test.describe('Order Placement Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to the application
    await page.goto('/');
    
    // Navigate to login page
    await page.getByRole('link', { name: 'Login' }).click();
    
    // Fill in login credentials using getByRole locators
    await page.getByRole('textbox', { name: 'you@example.com' }).fill('testuser@example.com');
    await page.getByRole('textbox', { name: 'Enter your password' }).fill('password123');
    
    // Click Sign In button
    await page.getByRole('button', { name: 'Sign In' }).click();
    
    // Verify successful login by checking user name is displayed in header
    await expect(page.getByRole('banner').locator('text=/testuser|test user/i')).toBeVisible({ timeout: 10000 });
  });

  test('should place order successfully with valid card number', async ({ page }) => {
    // Navigate to products/shop page
    await page.getByRole('link', { name: 'Shop Now' }).click();
    
    // Add a product to cart
    await page.getByRole('button', { name: /Add to Cart/i }).first().click();
    
    // Navigate to cart
    await page.click('a:has-text("Cart"), button:has-text("Cart"), [aria-label="Cart"]');
    
    // Proceed to checkout
    await page.click('button:has-text("Checkout"), button:has-text("Proceed to checkout")');
    
    // Fill in shipping information if required
    await page.fill('input[name="address"], input[placeholder*="address" i]', '123 Test Street').catch(() => {});
    await page.fill('input[name="city"]', 'Test City').catch(() => {});
    await page.fill('input[name="zipcode"], input[name="zip"]', '12345').catch(() => {});
    
    // Fill in valid card details
    await page.fill('input[name="cardNumber"], input[placeholder*="card number" i], #cardNumber', '4111111111111111');
    await page.fill('input[name="cardName"], input[placeholder*="name on card" i]', 'Test User').catch(() => {});
    await page.fill('input[name="expiry"], input[placeholder*="expiry" i], input[name="expiryDate"]', '12/28').catch(() => {});
    await page.fill('input[name="cvv"], input[placeholder*="cvv" i], input[name="cvc"]', '123').catch(() => {});
    
    // Submit order
    await page.click('button:has-text("Place Order"), button:has-text("Complete Order"), button[type="submit"]');
    
    // Verify order success
    await expect(page.locator('text=/order.*success|thank you|confirmed/i')).toBeVisible({ timeout: 10000 });
  });

  test('should fail to place order with invalid card number', async ({ page }) => {
    // Navigate to products/shop page
    await page.getByRole('link', { name: 'Shop Now' }).click();
    
    // Add a product to cart
    await page.getByRole('button', { name: /Add to Cart/i }).first().click();
    
    // Navigate to cart
    await page.click('a:has-text("Cart"), button:has-text("Cart"), [aria-label="Cart"]');
    
    // Proceed to checkout
    await page.click('button:has-text("Checkout"), button:has-text("Proceed to checkout")');
    
    // Fill in shipping information if required
    await page.fill('input[name="address"], input[placeholder*="address" i]', '123 Test Street').catch(() => {});
    await page.fill('input[name="city"]', 'Test City').catch(() => {});
    await page.fill('input[name="zipcode"], input[name="zip"]', '12345').catch(() => {});
    
    // Fill in invalid card details
    await page.fill('input[name="cardNumber"], input[placeholder*="card number" i], #cardNumber', '1234567890123456');
    await page.fill('input[name="cardName"], input[placeholder*="name on card" i]', 'Test User').catch(() => {});
    await page.fill('input[name="expiry"], input[placeholder*="expiry" i], input[name="expiryDate"]', '12/28').catch(() => {});
    await page.fill('input[name="cvv"], input[placeholder*="cvv" i], input[name="cvc"]', '123').catch(() => {});
    
    // Submit order
    await page.click('button:has-text("Place Order"), button:has-text("Complete Order"), button[type="submit"]');
    
    // Verify order failure - look for error message
    await expect(page.locator('text=/invalid.*card|card.*invalid|payment.*failed|error/i')).toBeVisible({ timeout: 10000 });
  });
});
