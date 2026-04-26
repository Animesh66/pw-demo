import { test, expect } from './base/BaseTest';
import { Logger, CSVOperations } from '../utils';

/**
 * Order Placement Test Suite - Happy Path Scenarios
 * Tests positive scenarios for placing orders
 * Uses CSV data for test inputs and Logger for test execution logs
 */

// Read test data from CSV files
const userData = CSVOperations.readCSVRow('users', 0); // Get first user (validUser)
const validCardData = CSVOperations.filterCSVByColumn('payment-cards', 'isValid', 'true')[0];

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

test.describe('Order Placement Flow - Happy Path', () => {

    test.beforeAll(async () => {
        Logger.initialize();
        Logger.info('=== Order Placement Test Suite (Happy Path) Started ===');
        Logger.info(`Test User: ${TEST_USER.email}`);
        Logger.info(`Valid Card Type: ${validCardData.cardType}`);
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
        Logger.info('=== Order Placement Test Suite (Happy Path) Completed ===');
        Logger.info(`Log file saved at: ${Logger.getLogFilePath()}`);
    });

    /**
     * TC01: Successful Order Placement with Valid Payment
     */
    test('TC01 - Place order successfully with valid payment details', { tag: '@order' }, async ({ 
        homePage, 
        cartPage, 
        checkoutPage 
    }) => {
        await test.step('Add product to cart', async () => {
            Logger.step(3, 'Add product to cart');
            await homePage.addFirstProductToCart();
            Logger.success('Product added to cart');

            const cartCount = await homePage.header.getCartItemCount();
            Logger.info(`Cart item count: ${cartCount}`);
            expect(parseInt(cartCount)).toBeGreaterThan(0);
            Logger.success('Cart count verified');
        });

        await test.step('Navigate to cart and verify product', async () => {
            Logger.step(4, 'Navigate to cart and verify');
            await homePage.header.clickCart();
            Logger.info('Navigated to cart page');

            expect(await cartPage.isPageLoaded()).toBeTruthy();
            Logger.success('Cart page loaded');

            const cartInfo = await cartPage.getCartItemsInfo();
            Logger.info(`Cart info: ${cartInfo}`);
            expect(cartInfo).toContain('item');

            const total = await cartPage.getTotal();
            Logger.info(`Total amount: ${total}`);
            expect(total).toMatch(/\$\d+/);
            Logger.success('Product verified in cart');
        });

        await test.step('Proceed to checkout', async () => {
            Logger.step(5, 'Proceed to checkout');
            await cartPage.proceedToCheckout();
            Logger.info('Navigated to checkout page');

            expect(await checkoutPage.isPageLoaded()).toBeTruthy();
            Logger.success('Checkout page loaded');

            expect(await checkoutPage.isPaymentFormDisplayed()).toBeTruthy();
            Logger.success('Payment form displayed');
        });

        await test.step('Fill payment form with valid details', async () => {
            Logger.step(6, 'Fill payment form with valid card details');
            Logger.info(`Card Type: ${validCardData.cardType}`);
            Logger.info(`Card Number: ${VALID_CARD.number}`);

            await checkoutPage.fillPaymentForm(
                VALID_CARD.number,
                VALID_CARD.holderName,
                VALID_CARD.expiry,
                VALID_CARD.cvv
            );
            Logger.success('Payment form filled');

            const payButtonText = await checkoutPage.getPayButtonText();
            Logger.info(`Pay button text: ${payButtonText}`);
            expect(payButtonText).toContain('Pay');
            expect(payButtonText).toMatch(/\$\d+/);
        });

        await test.step('Submit payment', async () => {
            Logger.step(7, 'Submit payment');
            await checkoutPage.submitPayment();
            Logger.info('Payment submitted');
        });

        await test.step('Verify order placement', async () => {
            Logger.step(8, 'Verify order placement result');
            const currentUrl = await checkoutPage.getUrl();
            Logger.info(`Current URL: ${currentUrl}`);

            expect(currentUrl).not.toContain('/checkout');
            Logger.success('Order placement flow completed');
        });
    });

    /**
     * TC04: Verify Cart Quantity and Amount Updates
     */
    test('TC04 - Verify cart quantity and amount updates', { tag: '@order' }, async ({ 
        homePage, 
        cartPage 
    }) => {
        Logger.step(3, 'Add product to cart');
        await homePage.addFirstProductToCart();
        Logger.success('Product added to cart');

        Logger.step(4, 'Navigate to cart');
        await homePage.header.clickCart();
        Logger.info('Navigated to cart page');

        Logger.step(5, 'Get initial cart total');
        const initialTotal = await cartPage.getTotal();
        const initialValue = parseFloat(initialTotal.replace('$', ''));
        Logger.info(`Initial total: ${initialTotal} (${initialValue})`);

        Logger.step(6, 'Increase product quantity');
        await cartPage.increaseFirstProductQuantity();
        Logger.info('Increased product quantity');

        Logger.step(7, 'Verify total amount increased');
        const updatedTotal = await cartPage.getTotal();
        const updatedValue = parseFloat(updatedTotal.replace('$', ''));
        Logger.info(`Updated total: ${updatedTotal} (${updatedValue})`);

        expect(updatedValue).toBeGreaterThan(initialValue);
        Logger.success(`Total increased from ${initialTotal} to ${updatedTotal}`);
    });
});
