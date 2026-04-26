import { Page } from '@playwright/test';

/**
 * BasePage class - Contains common page context and methods
 * All page objects should extend this class
 */
export class BasePage {
    protected page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    /**
     * Navigate to a specific URL
     */
    async goto(url: string): Promise<void> {
        await this.page.goto(url);
    }

    /**
     * Get current page URL
     */
    async getUrl(): Promise<string> {
        return this.page.url();
    }

    /**
     * Get page title
     */
    async getTitle(): Promise<string> {
        return await this.page.title();
    }

    /**
     * Wait for specific time (use sparingly, prefer waitForSelector)
     */
    async wait(milliseconds: number): Promise<void> {
        await this.page.waitForTimeout(milliseconds);
    }

    /**
     * Wait for page navigation
     */
    async waitForNavigation(): Promise<void> {
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Take screenshot
     */
    async screenshot(path: string): Promise<void> {
        await this.page.screenshot({ path, fullPage: true });
    }
}
