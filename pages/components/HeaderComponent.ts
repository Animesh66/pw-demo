import { Page, Locator } from '@playwright/test';

/**
 * HeaderComponent - Represents the common header/navigation across all pages
 * Contains locators and actions for header elements
 */
export class HeaderComponent {
    private page: Page;
    
    // Locators
    private readonly logoLink: Locator;
    private readonly searchBox: Locator;
    private readonly shopNowLink: Locator;
    private readonly homeLink: Locator;
    private readonly cartLink: Locator;
    private readonly myAccountLink: Locator;
    private readonly logoutButton: Locator;
    private readonly userGreeting: Locator;

    constructor(page: Page) {
        this.page = page;
        
        // Initialize locators
        const nav = page.locator('nav').first();
        this.logoLink = page.getByRole('link', { name: 'TechStore' });
        this.searchBox = page.getByPlaceholder('Search products...');
        this.shopNowLink = nav.getByRole('link', { name: 'Shop Now' });
        this.homeLink = nav.getByRole('link', { name: 'Home' });
        this.cartLink = nav.getByRole('link', { name: /Cart/ });
        this.myAccountLink = nav.getByRole('link', { name: 'My Account' });
        this.logoutButton = page.getByRole('button', { name: 'Logout' });
        this.userGreeting = page.locator('div').filter({ hasText: /Hi,/ });
    }

    /**
     * Navigate to home page via logo
     */
    async clickLogo(): Promise<void> {
        await this.logoLink.click();
    }

    /**
     * Search for products
     */
    async searchProduct(searchTerm: string): Promise<void> {
        await this.searchBox.fill(searchTerm);
        await this.searchBox.press('Enter');
    }

    /**
     * Navigate to Shop page
     */
    async clickShopNow(): Promise<void> {
        await this.shopNowLink.click();
    }

    /**
     * Navigate to Home page
     */
    async clickHome(): Promise<void> {
        await this.homeLink.click();
    }

    /**
     * Navigate to Cart page
     */
    async clickCart(): Promise<void> {
        await this.cartLink.click();
        await this.page.waitForURL('**/cart');
    }

    /**
     * Navigate to My Account page
     */
    async clickMyAccount(): Promise<void> {
        await this.myAccountLink.click();
    }

    /**
     * Logout from application
     */
    async clickLogout(): Promise<void> {
        await this.logoutButton.click();
    }

    /**
     * Get user greeting text
     */
    async getUserGreeting(): Promise<string> {
        return await this.userGreeting.textContent() || '';
    }

    /**
     * Check if user is logged in
     */
    async isUserLoggedIn(): Promise<boolean> {
        try {
            await this.logoutButton.waitFor({ state: 'visible', timeout: 10000 });
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Get cart item count from badge
     */
    async getCartItemCount(): Promise<string> {
        const cartText = await this.cartLink.textContent();
        const match = cartText?.match(/\d+/);
        return match ? match[0] : '0';
    }
}
