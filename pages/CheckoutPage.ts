import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { HeaderComponent } from './components/HeaderComponent';
import { EnvironmentConfig } from '../config/environment.config';

/**
 * CheckoutPage - Represents the checkout/payment page
 * Contains locators and actions for checkout form elements
 */
export class CheckoutPage extends BasePage {
    readonly header: HeaderComponent;
    
    // Locators
    private readonly pageHeading: Locator;
    private readonly cardNumberInput: Locator;
    private readonly cardholderNameInput: Locator;
    private readonly expiryDateInput: Locator;
    private readonly cvvInput: Locator;
    private readonly payButton: Locator;
    private readonly orderSummaryHeading: Locator;
    private readonly totalAmount: Locator;
    private readonly acceptedCardsInfo: Locator;
    private readonly securePaymentInfo: Locator;

    constructor(page: Page) {
        super(page);
        this.header = new HeaderComponent(page);
        
        // Initialize locators
        this.pageHeading = page.getByRole('heading', { name: 'Secure Checkout' });
        this.cardNumberInput = page.locator('input[placeholder="1234 5678 9012 3456"]');
        this.cardholderNameInput = page.locator('input[placeholder="John Doe"]');
        this.expiryDateInput = page.locator('input[placeholder="MM/YY"]');
        this.cvvInput = page.locator('input[placeholder="123"]').last();
        this.payButton = page.getByRole('button', { name: /Pay/ });
        this.orderSummaryHeading = page.getByRole('heading', { name: 'Order Summary' });
        this.totalAmount = page.locator('div').filter({ hasText: /^Total$/ }).locator('div').last();
        this.acceptedCardsInfo = page.locator('div').filter({ hasText: /Accepted:.*VISA.*MasterCard.*Amex/ });
        this.securePaymentInfo = page.locator('p').filter({ hasText: /secure and encrypted/ });
    }

    /**
     * Navigate to checkout page
     */
    async navigateToCheckout(): Promise<void> {
        await this.goto(EnvironmentConfig.URLS.CHECKOUT);
    }

    /**
     * Fill card number
     */
    async fillCardNumber(cardNumber: string): Promise<void> {
        await this.cardNumberInput.fill(cardNumber);
    }

    /**
     * Fill cardholder name
     */
    async fillCardholderName(name: string): Promise<void> {
        await this.cardholderNameInput.fill(name);
    }

    /**
     * Fill expiry date
     */
    async fillExpiryDate(expiry: string): Promise<void> {
        await this.expiryDateInput.fill(expiry);
    }

    /**
     * Fill CVV
     */
    async fillCVV(cvv: string): Promise<void> {
        await this.cvvInput.fill(cvv);
    }

    /**
     * Fill complete payment form
     */
    async fillPaymentForm(
        cardNumber: string,
        cardholderName: string,
        expiryDate: string,
        cvv: string
    ): Promise<void> {
        await this.fillCardNumber(cardNumber);
        await this.fillCardholderName(cardholderName);
        await this.fillExpiryDate(expiryDate);
        await this.fillCVV(cvv);
    }

    /**
     * Click pay button to submit payment
     */
    async submitPayment(): Promise<void> {
        await this.payButton.click();
        // Wait for navigation after payment is processed
        await this.page.waitForURL((url) => !url.pathname.includes('/checkout'), { timeout: 15000 });
    }

    /**
     * Attempt to click pay button (may not navigate if validation fails)
     */
    async attemptPayment(): Promise<void> {
        await this.payButton.click();
    }

    /**
     * Complete checkout with payment details
     */
    async completeCheckout(
        cardNumber: string,
        cardholderName: string,
        expiryDate: string,
        cvv: string
    ): Promise<void> {
        await this.fillPaymentForm(cardNumber, cardholderName, expiryDate, cvv);
        await this.submitPayment();
    }

    /**
     * Get total amount to be paid
     */
    async getTotalAmount(): Promise<string> {
        return await this.totalAmount.textContent() || '';
    }

    /**
     * Check if checkout page loaded correctly
     */
    async isPageLoaded(): Promise<boolean> {
        await this.pageHeading.waitFor({ state: 'visible', timeout: 10000 });
        return await this.pageHeading.isVisible();
    }

    /**
     * Get pay button text (includes amount)
     */
    async getPayButtonText(): Promise<string> {
        return await this.payButton.textContent() || '';
    }

    /**
     * Check if payment form is displayed
     */
    async isPaymentFormDisplayed(): Promise<boolean> {
        await this.cardNumberInput.waitFor({ state: 'visible', timeout: 10000 });
        await this.cardholderNameInput.waitFor({ state: 'visible', timeout: 10000 });
        await this.expiryDateInput.waitFor({ state: 'visible', timeout: 10000 });
        await this.cvvInput.waitFor({ state: 'visible', timeout: 10000 });
        return await this.cardNumberInput.isVisible() &&
               await this.cardholderNameInput.isVisible() &&
               await this.expiryDateInput.isVisible() &&
               await this.cvvInput.isVisible();
    }
}
