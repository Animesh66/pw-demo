import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { HeaderComponent } from './components/HeaderComponent';

/**
 * HomePage - Represents the home/landing page
 * Contains locators and actions for home page elements
 */
export class HomePage extends BasePage {
    readonly header: HeaderComponent;
    
    // Locators
    private readonly pageHeading: Locator;
    private readonly featuredProductsSection: Locator;
    private readonly addToCartButtons: Locator;
    private readonly viewAllProductsLink: Locator;

    constructor(page: Page) {
        super(page);
        this.header = new HeaderComponent(page);
        
        // Initialize locators
        this.pageHeading = page.getByRole('heading', { name: 'Discover Premium Tech & More' });
        this.featuredProductsSection = page.getByRole('heading', { name: 'Featured Products' });
        this.addToCartButtons = page.getByRole('button', { name: '+ Add to Cart' });
        this.viewAllProductsLink = page.getByRole('link', { name: 'View All Products' });
    }

    /**
     * Navigate to home page
     */
    async navigateToHome(): Promise<void> {
        await this.goto('http://localhost:5173/');
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Add first product to cart
     */
    async addFirstProductToCart(): Promise<void> {
        await this.addToCartButtons.first().click();
        await this.page.waitForTimeout(1000); // Wait for cart update
    }

    /**
     * Add product to cart by index (0-based)
     */
    async addProductToCartByIndex(index: number): Promise<void> {
        await this.addToCartButtons.nth(index).click();
        await this.page.waitForTimeout(1000); // Wait for cart update
    }

    /**
     * Add specific product by name
     */
    async addProductToCartByName(productName: string): Promise<void> {
        const productCard = this.page.locator(`a:has-text("${productName}")`).first();
        await productCard.locator('button', { hasText: '+ Add to Cart' }).click();
        await this.page.waitForTimeout(1000);
    }

    /**
     * Get product price by name
     */
    async getProductPrice(productName: string): Promise<string> {
        const productCard = this.page.locator(`a:has-text("${productName}")`).first();
        const priceElement = productCard.locator('div').filter({ hasText: /^\$\d+$/ }).first();
        return await priceElement.textContent() || '';
    }

    /**
     * Navigate to all products page
     */
    async viewAllProducts(): Promise<void> {
        await this.viewAllProductsLink.click();
    }

    /**
     * Check if home page loaded correctly
     */
    async isPageLoaded(): Promise<boolean> {
        return await this.pageHeading.isVisible();
    }

    /**
     * Get count of featured products
     */
    async getFeaturedProductCount(): Promise<number> {
        return await this.addToCartButtons.count();
    }
}
