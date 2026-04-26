import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { HeaderComponent } from './components/HeaderComponent';

/**
 * CartPage - Represents the shopping cart page
 * Contains locators and actions for cart page elements
 */
export class CartPage extends BasePage {
    readonly header: HeaderComponent;
    
    // Locators
    private readonly pageHeading: Locator;
    private readonly cartItemsInfo: Locator;
    private readonly productImages: Locator;
    private readonly productTitles: Locator;
    private readonly productPrices: Locator;
    private readonly quantityDecrementButtons: Locator;
    private readonly quantityIncrementButtons: Locator;
    private readonly quantityDisplays: Locator;
    private readonly removeButtons: Locator;
    private readonly subtotalAmount: Locator;
    private readonly shippingAmount: Locator;
    private readonly taxAmount: Locator;
    private readonly totalAmount: Locator;
    private readonly proceedToCheckoutButton: Locator;

    constructor(page: Page) {
        super(page);
        this.header = new HeaderComponent(page);
        
        // Initialize locators
        this.pageHeading = page.getByRole('heading', { name: 'Shopping Cart' });
        this.cartItemsInfo = page.locator('p').filter({ hasText: /item.*in your cart/ });
        this.productImages = page.locator('img[alt*=""]');
        this.productTitles = page.locator('h3');
        this.productPrices = page.locator('p').filter({ hasText: /^\$\d+ each$/ });
        this.quantityDecrementButtons = page.locator('button').filter({ hasText: /^[−\-]$/ });
        this.quantityIncrementButtons = page.locator('button').filter({ hasText: /^[+\+]$/ });
        this.quantityDisplays = page.locator('div').filter({ hasText: /^\d+$/ });
        this.removeButtons = page.getByRole('button', { name: 'Remove' });
        this.subtotalAmount = page.locator('div').filter({ hasText: /Subtotal/ }).locator('div').last();
        this.shippingAmount = page.locator('div').filter({ hasText: /Shipping/ }).locator('div').last();
        this.taxAmount = page.locator('div').filter({ hasText: /Tax/ }).locator('div').last();
        this.totalAmount = page.locator('div').filter({ hasText: /Total/ }).locator('div').last();
        this.proceedToCheckoutButton = page.getByRole('button', { name: 'Proceed to Checkout' });
    }

    /**
     * Navigate to cart page
     */
    async navigateToCart(): Promise<void> {
        await this.goto('http://localhost:5173/cart');
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Increase quantity of first product
     */
    async increaseFirstProductQuantity(): Promise<void> {
        await this.quantityIncrementButtons.first().click();
        await this.page.waitForTimeout(500);
    }

    /**
     * Decrease quantity of first product
     */
    async decreaseFirstProductQuantity(): Promise<void> {
        await this.quantityDecrementButtons.first().click();
        await this.page.waitForTimeout(500);
    }

    /**
     * Remove first product from cart
     */
    async removeFirstProduct(): Promise<void> {
        await this.removeButtons.first().click();
        await this.page.waitForTimeout(500);
    }

    /**
     * Get cart item count text
     */
    async getCartItemsInfo(): Promise<string> {
        return await this.cartItemsInfo.textContent() || '';
    }

    /**
     * Get first product title
     */
    async getFirstProductTitle(): Promise<string> {
        return await this.productTitles.first().textContent() || '';
    }

    /**
     * Get subtotal amount
     */
    async getSubtotal(): Promise<string> {
        await this.subtotalAmount.waitFor({ state: 'visible', timeout: 10000 });
        return await this.subtotalAmount.textContent() || '';
    }

    /**
     * Get shipping amount
     */
    async getShipping(): Promise<string> {
        return await this.shippingAmount.textContent() || '';
    }

    /**
     * Get tax amount
     */
    async getTax(): Promise<string> {
        return await this.taxAmount.textContent() || '';
    }

    /**
     * Get total amount
     */
    async getTotal(): Promise<string> {
        await this.totalAmount.waitFor({ state: 'visible', timeout: 10000 });
        return await this.totalAmount.textContent() || '';
    }

    /**
     * Proceed to checkout
     */
    async proceedToCheckout(): Promise<void> {
        await this.proceedToCheckoutButton.click();
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Check if cart page loaded correctly
     */
    async isPageLoaded(): Promise<boolean> {
        return await this.pageHeading.isVisible();
    }

    /**
     * Check if cart is empty
     */
    async isCartEmpty(): Promise<boolean> {
        const itemsText = await this.getCartItemsInfo();
        return itemsText.includes('0 item');
    }
}
