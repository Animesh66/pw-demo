import { test, expect } from './base/BaseTest';
import { Logger, CSVOperations } from '../utils';

/**
 * Order Placement Test Suite - Negative Scenarios
 * Tests negative scenarios and validation for placing orders
 * Uses CSV data for test inputs and Logger for test execution logs
 */

// Read test data from CSV files
const userData = CSVOperations.readCSVRow('users', 0); // Get first user (validUser)
const validCardData = CSVOperations.filterCSVByColumn('payment-cards', 'isValid', 'true')[0];
const invalidCardData = CSVOperations.filterCSVByColumn('payment-cards', 'isValid', 'false')[0];

// Extract test data
const TEST_USER = {
    email: userData.email,
    password: userData.password
};

const VALID_CARD = {
    number: validCardData.cardNumber,
    holderName: validCardData.holderName,
    expiry: validCardData.expiryDate,
    cvv: validCardData.cvv
};

const INVALID_CARD = {
    number: invalidCardData.cardNumber,
    holderName: invalidCardData.holderName,
    expiry: invalidCardData.expiryDate,
    cvv: invalidCardData.cvv
};

test.describe('Order Placement Flow - Negative Scenarios', () => {

    test.beforeAll(async () => {
        Logger.initialize();
        Logger.info('=== Order Placement Test Suite (Negative Scenarios) Started ===');
        Logger.info(`Test User: ${TEST_USER.email}`);
        Logger.info(`Invalid Card Type: ${invalidCardData.cardType}`);
    });

    /**
     * Before each test hook - Performs login and navigation to home page
     */
    test.beforeEach(async ({ loginPage, homePage }, testInfo) => {
        Logger.testStart(testInfo.title);
        Logger.step(1, 'Navigate to login page and perform login');

        await loginPage.navigateToLogin();
        Logger.info('Navigated to login page');

        Logger.info(`Logging in with user: ${TEST_USER.email}`);
        await loginPage.login(TEST_USER.email, TEST_USER.password);
        Logger.success('Login successful');

        Logger.step(2, 'Navigate to home page and verify');
        await homePage.navigateToHome();
        Logger.info('Navigated to home page');

        expect(await homePage.isPageLoaded()).toBeTruthy();
        Logger.success('Home page loaded successfully');
    });

    /**
     * After each test hook - Captures screenshot on failure and logs test status
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

    test.afterAll(async () => {
        Logger.info('=== Order Placement Test Suite (Negative Scenarios) Completed ===');
        Logger.info(`Log file saved at: ${Logger.getLogFilePath()}`);
    });

    /**
     * TC02: Order Placement with Invalid Card
     */
    test('TC02 - Order placement fails with invalid card number', { tag: '@order' }, async ({ 
        homePage, 
        cartPage, 
        checkoutPage,
        errorPage 
    }) => {
        await test.step('Add product to cart', async () => {
            Logger.step(3, 'Add product to cart');
            await homePage.addFirstProductToCart();
            Logger.success('Product added to cart');

            const cartCount = await homePage.header.getCartItemCount();
            Logger.info(`Cart item count: ${cartCount}`);
            expect(parseInt(cartCount)).toBeGreaterThan(0);
        });

        await test.step('Navigate to cart', async () => {
            Logger.step(4, 'Navigate to cart');
            await homePage.header.clickCart();
            Logger.info('Navigated to cart page');
            expect(await cartPage.isPageLoaded()).toBeTruthy();
            Logger.success('Cart page loaded');
        });

        await test.step('Proceed to checkout', async () => {
            Logger.step(5, 'Proceed to checkout');
            await cartPage.proceedToCheckout();
            Logger.info('Navigated to checkout page');
            expect(await checkoutPage.isPageLoaded()).toBeTruthy();
            Logger.success('Checkout page loaded');
        });

        await test.step('Fill payment form with invalid card', async () => {
            Logger.step(6, 'Fill payment form with INVALID card');
            Logger.info(`Card Type: ${invalidCardData.cardType}`);
            Logger.info(`Card Number: ${INVALID_CARD.number}`);
            Logger.warn('Using invalid card for negative testing');

            await checkoutPage.fillPaymentForm(
                INVALID_CARD.number,
                INVALID_CARD.holderName,
                INVALID_CARD.expiry,
                INVALID_CARD.cvv
            );
            Logger.success('Payment form filled with invalid card');
        });

        await test.step('Submit payment with invalid card', async () => {
            Logger.step(7, 'Submit payment with invalid card');
            await checkoutPage.attemptPayment();
            Logger.info('Payment submitted with invalid card');
        });

        await test.step('Verify payment failure', async () => {
            Logger.step(8, 'Verify payment failure');

            const currentUrl = await checkoutPage.getUrl();
            Logger.info(`Current URL: ${currentUrl}`);

            // Check if client-side validation prevented submission
            if (currentUrl.includes('/checkout')) {
                Logger.info('Client-side validation prevented payment submission');
                Logger.warn('Skipping server-side error page verification');
                return;
            }

            // Verify we're on error page
            expect(await errorPage.isPaymentFailed()).toBeTruthy();
            Logger.success('Payment failed as expected');

            expect(await errorPage.isErrorPageDisplayed()).toBeTruthy();
            Logger.success('Error page displayed');

            const errorMessage = await errorPage.getErrorMessage();
            Logger.info(`Error message: ${errorMessage}`);
            expect(errorMessage).toContain("couldn't process your payment");

            const errorReason = await errorPage.getErrorReason();
            Logger.info(`Error reason: ${errorReason}`);
            expect(errorReason.length).toBeGreaterThan(0);

            const errorDetails = await errorPage.getErrorDetails();
            Logger.info(`Error details: ${JSON.stringify(errorDetails)}`);
            expect(errorDetails.heading).toBe('Payment Failed');
            Logger.success('All error validations passed');
        });
    });

    /**
     * TC03: Validation - Empty Card Number
     */
    test('TC03 - Cannot submit payment with empty card number', { tag: '@order' }, async ({ 
        homePage, 
        cartPage, 
        checkoutPage 
    }) => {
        Logger.step(3, 'Add product and navigate to checkout');

        await homePage.addFirstProductToCart();
        Logger.success('Product added to cart');

        await homePage.header.clickCart();
        Logger.info('Navigated to cart');

        await cartPage.proceedToCheckout();
        Logger.info('Navigated to checkout');

        Logger.step(4, 'Fill partial payment details (no card number)');

        await checkoutPage.fillCardholderName(VALID_CARD.holderName);
        await checkoutPage.fillExpiryDate(VALID_CARD.expiry);
        await checkoutPage.fillCVV(VALID_CARD.cvv);
        Logger.warn('Filled payment form without card number');

        Logger.step(5, 'Attempt to submit payment');

        const urlBeforeSubmit = await checkoutPage.getUrl();
        Logger.info(`URL before submit: ${urlBeforeSubmit}`);

        await checkoutPage.attemptPayment();

        const urlAfterSubmit = await checkoutPage.getUrl();
        Logger.info(`URL after submit: ${urlAfterSubmit}`);

        Logger.step(6, 'Verify form validation prevents submission');

        expect(urlAfterSubmit).toContain('/checkout');
        Logger.success('Form validation working - still on checkout page');
    });
});
