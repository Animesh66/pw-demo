/* eslint-disable no-console */
import { test as setup } from '@playwright/test';
import { AuthConfig } from '../config/auth.config';
import { CSVOperations } from '../utils';

/**
 * Authentication Setup
 * Runs once before all tests to establish authenticated state
 * Saves the storage state (cookies, localStorage) to a file for reuse in tests
 */

const authFile = AuthConfig.STORAGE_STATE_PATH;

setup('authenticate', async ({ page }) => {
    console.log('\n=== Starting Authentication Setup ===\n');

    // Read test user credentials from CSV
    const userData = CSVOperations.readCSVRow('users', 0);
    const TEST_USER = {
        email: userData.email,
        password: userData.password
    };

    console.log(`Authenticating user: ${TEST_USER.email}`);

    // Navigate to login page
    console.log('Navigating to login page...');
    await page.goto('/login');
    
    // Wait for login form to be ready
    await page.locator('input[type="email"], input[name="email"]').waitFor({ state: 'visible' });

    // Perform authentication steps
    console.log('Filling login credentials...');
    await page.fill('input[type="email"], input[name="email"]', TEST_USER.email);
    await page.fill('input[type="password"], input[name="password"]', TEST_USER.password);

    console.log('Submitting login form...');
    await page.click('button[type="submit"]');

    // Wait until the page receives the cookies
    // Sometimes login flow sets cookies in the process of several redirects
    // Wait for the final URL to ensure that the cookies are actually set
    await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 10000 });
    console.log('Login successful!');

    // Verify we're on a logged-in page (waitForURL already validated we're not on /login)
    const currentUrl = page.url();
    console.log(`Current URL after login: ${currentUrl}`);

    // End of authentication steps
    console.log(`Saving storage state to: ${authFile}`);
    await page.context().storageState({ path: authFile });
    console.log('✓ Storage state saved successfully');
    console.log('\n=== Authentication Setup Completed ===\n');
});
