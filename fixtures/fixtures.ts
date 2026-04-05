import { test as base, expect, Page } from '@playwright/test';

type LoginCredentials = {
  email: string;
  password: string;
};

type MyFixtures = {
  login: Page;
  checkout: Page;
  credentials: LoginCredentials;
};

export const test = base.extend<MyFixtures>({
  // Credentials fixture: reads from environment variables by default, can be overridden
  credentials: [
    { 
      email: process.env.TEST_USER_EMAIL || '', 
      password: process.env.TEST_USER_PASSWORD || '' 
    }, 
    { option: true }
  ],

  // Login fixture: handles login and logout
  login: async ({ page, credentials }, use) => {
    const { email, password } = credentials;
    
    if (!email || !password) {
      throw new Error('Login credentials not provided. Set TEST_USER_EMAIL and TEST_USER_PASSWORD environment variables or use test.use({ credentials: { email: "...", password: "..." } }).');
    }

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
    await page.getByRole('banner').getByRole('button', { name: /logout|sign out/i }).click();
    await page.close();
  },

  // Checkout fixture: navigates to checkout/payment page with item in cart
  checkout: async ({ login }, use) => {
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
  },
});

export { expect } from '@playwright/test';
