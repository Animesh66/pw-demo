import { test as base, expect, Page } from '@playwright/test';

type LoginCredentials = {
  email: string;
  password: string;
};

type MyFixtures = {
  login: Page;
  placeOrder: Page;
  credentials: LoginCredentials;
};

export const test = base.extend<MyFixtures>({
  // Credentials fixture: must be overridden in tests
  credentials: [undefined as any, { option: true }],

  // Login fixture: handles login and logout
  login: async ({ page, credentials }, use) => {
    if (!credentials) {
      throw new Error('Login credentials not provided. Please use test.use({ credentials: { email: "...", password: "..." } }) in your test or describe block.');
    }
    
    const { email, password } = credentials;

    // Navigate to the application
    await page.goto('/');
    
    // Navigate to login page using the link in the header banner
    await page.getByRole('banner').getByRole('link', { name: 'Login' }).click();
    
    // Fill in login credentials using getByRole locators
    await page.getByRole('textbox', { name: 'you@example.com' }).fill(email);
    await page.getByRole('textbox', { name: 'Enter your password' }).fill(password);
    
    // Click Sign In button
    await page.getByRole('button', { name: 'Sign In' }).click();
    
    // Verify successful login by checking we're redirected away from login page
    await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 10000 });
    
    // Verify user name is displayed in header after successful login
    await expect(page.getByRole('banner').getByText(/Hi,.*test user/i)).toBeVisible({ timeout: 10000 });

    // Provide the logged-in page to the test
    await use(page);

    // Cleanup: Logout after test
    try {
      // Attempt to click logout button (adjust selector based on your app)
      await page.getByRole('banner').getByRole('link', { name: /logout|sign out/i }).click({ timeout: 5000 });
    } catch (error) {
      // If logout fails or button not found, continue with page close
      console.log('Logout button not found or failed to click');
    }
    
    await page.close();
  },

  // PlaceOrder fixture: navigates to checkout/payment page with item in cart
  placeOrder: async ({ login }, use) => {
    const page = login; // This fixture depends on login fixture

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
    
    // Proceed to checkout (payment page)
    await page.getByRole('button', { name: /checkout|proceed to checkout/i }).click();

    // Provide the page at checkout/payment stage to the test
    await use(page);
    
    // No additional cleanup needed as login fixture handles page close
  },
});

export { expect } from '@playwright/test';
