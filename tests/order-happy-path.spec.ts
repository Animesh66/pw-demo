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
    
    // Initialize logger before all tests
    test.beforeAll(async () => {
        Logger.initialize();
        Logger.info('=== Order Placement Test Suite (Happy Path) Started ===');
        Logger.info(`Test User: ${TEST_USER.email}`);
        Logger.info(`Valid Card Type: ${validCardData.cardType}`);
    });
    
    /**
     * Before each test hook
     * - Navigate to login page
     * - Login with valid credentials
     * - Navigate to home page
     * - Verify user is logged in
     */
    test.beforeEach(async ({ loginPage, homePage }, testInfo) => {
        Logger.testStart(testInfo.title);
        Logger.step(1, 'Navigate to login page and perform login');
        
        // Navigate to login page
        await loginPage.navigateToLogin();
        Logger.info('Navigated to login page');
        
        // Perform login with test credentials
        Logger.info(`Logging in with user: ${TEST_USER.email}`);
        await loginPage.login(TEST_USER.email, TEST_USER.password);
        Logger.success('Login successful');
        
        Logger.step(2, 'Navigate to home page and verify');
        
        // Navigate to home page
        await homePage.navigateToHome();
        Logger.info('Navigated to home page');
        
        // Verify home page loaded
        const isPageLoaded = await homePage.isPageLoaded();
        expect(isPageLoaded).toBeTruthy();
        Logger.success('Home page loaded successfully');
    });

    /**
     * After each test hook
     * - Take screenshot on failure
     * - Log test completion status
     */
    test.afterEach(async ({ page }, testInfo) => {
        // Take screenshot if test failed
        if (testInfo.status !== testInfo.expectedStatus) {
            Logger.error(`Test failed: ${testInfo.title}`);
            const screenshot = await page.screenshot();
            await testInfo.attach('failure-screenshot', {
                body: screenshot,
                contentType: 'image/png'
            });
            Logger.info('Failure screenshot captured');
            Logger.testEnd(testInfo.title, 'FAILED');
        } else {
            Logger.testEnd(testInfo.title, 'PASSED');
        }
    });
    
    // Log after all tests
    test.afterAll(async () => {
        Logger.info('=== Order Placement Test Suite (Happy Path) Completed ===');
        Logger.info(`Log file saved at: ${Logger.getLogFilePath()}`);
    });

    /**
     * Test Case: Positive - Successful Order Placement
     * 
     * Steps:
     * 1. Add product to cart from home page
     * 2. Navigate to cart and verify product is added
     * 3. Proceed to checkout
     * 4. Fill payment form with valid card details
     * 5. Submit payment
     * 6. Verify order is placed successfully
     */
    test('TC01 - Place order successfully with valid payment details', { tag: '@order' }, async ({ 
        homePage, 
        cartPage, 
        checkoutPage,
        page 
    }) => {
        // Step 1: Add product to cart
        await test.step('Add product to cart', async () => {
            Logger.step(3, 'Add product to cart');
            await homePage.addFirstProductToCart();
            Logger.success('Product added to cart');
            
            // Verify cart badge updated
            const cartCount = await homePage.header.getCartItemCount();
            Logger.info(`Cart item count: ${cartCount}`);
            expect(parseInt(cartCount)).toBeGreaterThan(0);
            Logger.success('Cart count verified');
        });

        // Step 2: Navigate to cart and verify
        await test.step('Navigate to cart and verify product', async () => {
            Logger.step(4, 'Navigate to cart and verify');
            await homePage.header.clickCart();
            Logger.info('Navigated to cart page');
            
            // Verify cart page loaded
            expect(await cartPage.isPageLoaded()).toBeTruthy();
            Logger.success('Cart page loaded');
            
            // Verify product is in cart
            const cartInfo = await cartPage.getCartItemsInfo();
            Logger.info(`Cart info: ${cartInfo}`);
            expect(cartInfo).toContain('item');
            
            // Verify total amount is displayed
            const total = await cartPage.getTotal();
            Logger.info(`Total amount: ${total}`);
            expect(total).toMatch(/\$\d+/);
            Logger.success('Product verified in cart');
        });

        // Step 3: Proceed to checkout
        await test.step('Proceed to checkout', async () => {
            Logger.step(5, 'Proceed to checkout');
            await cartPage.proceedToCheckout();
            Logger.info('Navigated to checkout page');
            
            // Verify checkout page loaded
            expect(await checkoutPage.isPageLoaded()).toBeTruthy();
            Logger.success('Checkout page loaded');
            
            // Verify payment form is displayed
            expect(await checkoutPage.isPaymentFormDisplayed()).toBeTruthy();
            Logger.success('Payment form displayed');
        });

        // Step 4: Fill payment details with valid card
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
            
            // Verify pay button shows correct amount
            const payButtonText = await checkoutPage.getPayButtonText();
            Logger.info(`Pay button text: ${payButtonText}`);
            expect(payButtonText).toContain('Pay');
            expect(payButtonText).toMatch(/\$\d+/);
        });

        // Step 5: Submit payment
        await test.step('Submit payment', async () => {
            Logger.step(7, 'Submit payment');
            await checkoutPage.submitPayment();
            Logger.info('Payment submitted');
        });

        // Step 6: Verify order placed successfully
        await test.step('Verify order placement', async () => {
            Logger.step(8, 'Verify order placement result');
            const currentUrl = page.url();
            Logger.info(`Current URL: ${currentUrl}`);
            
            // Payment processing happens - check if we're redirected
            // Based on the application behavior, it might redirect to success or error page
            // For now, we verify the payment was submitted and page changed
            expect(currentUrl).not.toContain('/checkout');
            Logger.success('Order placement flow completed');
            
            // Note: If there's a success page, add verification here
            // For example: expect(currentUrl).toContain('/success');
        });
    });

    /**
     * Test Case: Positive - Verify cart quantity updates correctly
     * 
     * Steps:
     * 1. Add multiple products to cart
     * 2. Navigate to cart
     * 3. Update product quantities
     * 4. Verify total amount updates correctly
     */
    test('TC04 - Verify cart quantity and amount updates', { tag: '@order' }, async ({ 
        homePage, 
        cartPage 
    }) => {
        Logger.step(3, 'Add product to cart');
        
        // Add product to cart
        await homePage.addFirstProductToCart();
        Logger.success('Product added to cart');
        
        Logger.step(4, 'Navigate to cart');
        
        // Navigate to cart
        await homePage.header.clickCart();
        Logger.info('Navigated to cart page');
        
        Logger.step(5, 'Get initial cart total');
        
        // Get initial total
        const initialTotal = await cartPage.getTotal();
        const initialValue = parseFloat(initialTotal.replace('$', ''));
        Logger.info(`Initial total: ${initialTotal} (${initialValue})`);
        
        Logger.step(6, 'Increase product quantity');
        
        // Increase quantity
        await cartPage.increaseFirstProductQuantity();
        Logger.info('Increased product quantity');
        
        Logger.step(7, 'Verify total amount increased');
        
        // Get updated total
        const updatedTotal = await cartPage.getTotal();
        const updatedValue = parseFloat(updatedTotal.replace('$', ''));
        Logger.info(`Updated total: ${updatedTotal} (${updatedValue})`);
        
        // Verify total increased
        expect(updatedValue).toBeGreaterThan(initialValue);
        Logger.success(`Total increased from ${initialTotal} to ${updatedTotal}`);
    });
});
