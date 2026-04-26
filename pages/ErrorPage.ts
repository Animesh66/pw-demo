import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { HeaderComponent } from './components/HeaderComponent';

/**
 * ErrorPage - Represents the error/payment failed page
 * Contains locators and actions for error page elements
 */
export class ErrorPage extends BasePage {
    readonly header: HeaderComponent;
    
    // Locators
    private readonly pageHeading: Locator;
    private readonly errorMessage: Locator;
    private readonly errorReason: Locator;
    private readonly tryAgainButton: Locator;
    private readonly contactSupportButton: Locator;
    private readonly errorIcon: Locator;

    constructor(page: Page) {
        super(page);
        this.header = new HeaderComponent(page);
        
        // Initialize locators
        this.pageHeading = page.getByRole('heading', { name: 'Payment Failed' });
        this.errorMessage = page.locator('p').filter({ hasText: /couldn't process your payment/ });
        this.errorReason = page.locator('p').filter({ hasText: /Reason:/ });
        this.tryAgainButton = page.getByRole('button', { name: 'Try Again' });
        this.contactSupportButton = page.getByRole('button', { name: 'Contact Support' });
        this.errorIcon = page.locator('div').filter({ hasText: '✕' }).first();
    }

    /**
     * Check if error page is displayed
     */
    async isErrorPageDisplayed(): Promise<boolean> {
        await this.pageHeading.waitFor({ state: 'visible', timeout: 10000 });
        return await this.pageHeading.isVisible();
    }

    /**
     * Get error message
     */
    async getErrorMessage(): Promise<string> {
        return await this.errorMessage.textContent() || '';
    }

    /**
     * Get error reason
     */
    async getErrorReason(): Promise<string> {
        const reasonText = await this.errorReason.textContent();
        return reasonText?.replace('Reason:', '').trim() || '';
    }

    /**
     * Click try again button
     */
    async clickTryAgain(): Promise<void> {
        await this.tryAgainButton.click();
    }

    /**
     * Click contact support button
     */
    async clickContactSupport(): Promise<void> {
        await this.contactSupportButton.click();
    }

    /**
     * Check if payment failed
     */
    async isPaymentFailed(): Promise<boolean> {
        await this.pageHeading.waitFor({ state: 'visible', timeout: 10000 });
        return await this.pageHeading.isVisible() && 
               (await this.getUrl()).includes('/error');
    }

    /**
     * Get complete error details
     */
    async getErrorDetails(): Promise<{ heading: string; message: string; reason: string }> {
        return {
            heading: await this.pageHeading.textContent() || '',
            message: await this.getErrorMessage(),
            reason: await this.getErrorReason()
        };
    }
}
