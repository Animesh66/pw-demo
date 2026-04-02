import { test as setup, expect } from '@playwright/test';
import path from 'path';

const authFile = path.join(__dirname, '../playwright/.auth/user.json');

setup('Login to demo app', async ({ page }) => {
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

    // Save authentication state to a file for reuse in other tests
    await page.context().storageState({ path: authFile });

});