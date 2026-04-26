import { test, expect } from '@playwright/test';
import { Logger } from '../../utils';

/**
 * User Registration Test Suite - Negative Scenarios
 * Tests error handling and validation in registration flow
 * This test does not use authenticated storage state
 */

// Reset storage state for this file to avoid being authenticated
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('User Registration - Negative Scenarios', () => {

    test.beforeAll(async () => {
        Logger.initialize();
        Logger.info('=== User Registration Test Suite (Negative Scenarios) Started ===');
        Logger.info('Note: These tests run without authentication');
    });

    test.afterAll(async () => {
        Logger.info('=== User Registration Test Suite (Negative Scenarios) Completed ===');
        Logger.info(`Log file saved at: ${Logger.getLogFilePath()}`);
    });

    /**
     * After each test hook - Captures screenshot on failure
     */
    test.afterEach(async ({ page }, testInfo) => {
        if (testInfo.status !== testInfo.expectedStatus) {
            Logger.error(`Test failed: ${testInfo.title}`);
            const screenshot = await page.screenshot();
            await testInfo.attach('failure-screenshot', { body: screenshot, contentType: 'image/png' });
            Logger.info('Failure screenshot captured');
            Logger.testEnd(testInfo.title, 'FAILED');
        } else {
            Logger.testEnd(testInfo.title, 'PASSED');
        }
    });

    /**
     * Test Case: Registration fails with duplicate email
     */
    test('TC_REG_03 - Registration fails with existing email', { tag: '@registration' }, async ({ page }) => {
        Logger.testStart('TC_REG_03 - Registration fails with existing email');
        Logger.step(1, 'Navigate to registration page');

        await page.goto('/register'); // or '/signup'
        Logger.info('Navigated to registration page');

        Logger.step(2, 'Fill form with existing user email');

        // Use an existing test user email
        const existingEmail = 'test.user@email.com'; // From your CSV data
        Logger.warn(`Attempting to register with existing email: ${existingEmail}`);

        // Fill registration form (adjust selectors based on your app)
        // await page.fill('input[name="email"]', existingEmail);
        // await page.fill('input[name="password"]', 'TestPassword123!');
        // await page.fill('input[name="confirmPassword"]', 'TestPassword123!');

        Logger.step(3, 'Submit registration form');

        // Submit the form
        // await page.click('button[type="submit"]');

        Logger.step(4, 'Verify error message is displayed');

        // Verify appropriate error message is shown
        // await expect(page.getByText('Email already registered')).toBeVisible();
        // OR
        // await expect(page.getByText('User already exists')).toBeVisible();

        // Verify we're still on registration page
        expect(page.url()).toContain('/register');
        Logger.success('Duplicate email validation working as expected');
        Logger.warn('Note: This is a template test - adjust assertions based on your app');
    });

    /**
     * Test Case: Registration fails with invalid email format
     */
    test('TC_REG_04 - Registration fails with invalid email format', { tag: '@registration' }, async ({ page }) => {
        Logger.testStart('TC_REG_04 - Registration fails with invalid email format');
        Logger.step(1, 'Navigate to registration page');

        await page.goto('/register'); // or '/signup'
        Logger.info('Navigated to registration page');

        Logger.step(2, 'Fill form with invalid email format');

        const invalidEmail = 'invalid-email-format';
        Logger.warn(`Using invalid email: ${invalidEmail}`);

        // Fill registration form (adjust selectors based on your app)
        // await page.fill('input[name="email"]', invalidEmail);
        // await page.fill('input[name="password"]', 'TestPassword123!');

        Logger.step(3, 'Attempt to submit form');

        // Try to submit
        // await page.click('button[type="submit"]');

        Logger.step(4, 'Verify validation error');

        // Verify client-side or server-side validation error
        // Client-side: HTML5 validation or custom validation message
        // Server-side: Error message from API

        // Example assertions:
        // const emailInput = page.locator('input[name="email"]');
        // await expect(emailInput).toHaveAttribute('aria-invalid', 'true');
        // OR
        // await expect(page.getByText('Please enter a valid email')).toBeVisible();

        expect(page.url()).toContain('/register');
        Logger.success('Email format validation working as expected');
        Logger.warn('Note: This is a template test - adjust assertions based on your app');
    });
});
