import { Page, Locator, expect } from '@playwright/test';
import { EnvironmentConfig } from '../config/environment.config';

/**
 * WaitHelpers - Utility class for custom wait operations
 * Provides reusable wait methods for common scenarios
 */
export class WaitHelpers {
    /**
     * Wait for element to be visible with custom timeout
     */
    static async waitForVisible(
        locator: Locator, 
        timeout: number = EnvironmentConfig.TIMEOUTS.MEDIUM
    ): Promise<void> {
        await locator.waitFor({ state: 'visible', timeout });
    }

    /**
     * Wait for element to be hidden
     */
    static async waitForHidden(
        locator: Locator, 
        timeout: number = EnvironmentConfig.TIMEOUTS.MEDIUM
    ): Promise<void> {
        await locator.waitFor({ state: 'hidden', timeout });
    }

    /**
     * Wait for element to be attached to DOM
     */
    static async waitForAttached(
        locator: Locator, 
        timeout: number = EnvironmentConfig.TIMEOUTS.MEDIUM
    ): Promise<void> {
        await locator.waitFor({ state: 'attached', timeout });
    }

    /**
     * Wait for element to be detached from DOM
     */
    static async waitForDetached(
        locator: Locator, 
        timeout: number = EnvironmentConfig.TIMEOUTS.MEDIUM
    ): Promise<void> {
        await locator.waitFor({ state: 'detached', timeout });
    }

    /**
     * Wait for URL to contain specific text
     */
    static async waitForUrlContains(
        page: Page, 
        urlPart: string, 
        timeout: number = EnvironmentConfig.TIMEOUTS.NAVIGATION
    ): Promise<void> {
        await page.waitForURL(`**/*${urlPart}*`, { timeout });
    }

    /**
     * Wait for URL to match pattern
     */
    static async waitForUrlPattern(
        page: Page, 
        pattern: string | RegExp, 
        timeout: number = EnvironmentConfig.TIMEOUTS.NAVIGATION
    ): Promise<void> {
        await page.waitForURL(pattern, { timeout });
    }

    /**
     * Wait for page to be fully loaded
     */
    static async waitForPageLoad(
        page: Page, 
        timeout: number = EnvironmentConfig.TIMEOUTS.NAVIGATION
    ): Promise<void> {
        await page.waitForLoadState('load', { timeout });
        await page.waitForLoadState('domcontentloaded', { timeout });
    }

    /**
     * Wait for specific number of milliseconds
     */
    static async waitForTimeout(milliseconds: number): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, milliseconds));
    }

    /**
     * Wait for element count to be specific value
     */
    static async waitForElementCount(
        locator: Locator, 
        count: number, 
        timeout: number = EnvironmentConfig.TIMEOUTS.MEDIUM
    ): Promise<void> {
        await expect(locator).toHaveCount(count, { timeout });
    }

    /**
     * Wait for element to contain text
     */
    static async waitForText(
        locator: Locator, 
        text: string | RegExp, 
        timeout: number = EnvironmentConfig.TIMEOUTS.MEDIUM
    ): Promise<void> {
        await expect(locator).toContainText(text, { timeout });
    }

    /**
     * Wait for element to have specific attribute value
     */
    static async waitForAttribute(
        locator: Locator, 
        attribute: string, 
        value: string | RegExp, 
        timeout: number = EnvironmentConfig.TIMEOUTS.MEDIUM
    ): Promise<void> {
        await expect(locator).toHaveAttribute(attribute, value, { timeout });
    }

    /**
     * Wait with retry logic - polls until condition is met or timeout
     */
    static async waitUntil(
        condition: () => Promise<boolean>,
        options: {
            timeout?: number;
            interval?: number;
            message?: string;
        } = {}
    ): Promise<void> {
        const {
            timeout = EnvironmentConfig.TIMEOUTS.MEDIUM,
            interval = 500,
            message = 'Condition not met within timeout'
        } = options;

        const startTime = Date.now();
        
        while (Date.now() - startTime < timeout) {
            if (await condition()) {
                return;
            }
            await this.waitForTimeout(interval);
        }
        
        throw new Error(message);
    }

    /**
     * Wait for element to be clickable (visible and enabled)
     */
    static async waitForClickable(
        locator: Locator, 
        timeout: number = EnvironmentConfig.TIMEOUTS.MEDIUM
    ): Promise<void> {
        await this.waitForVisible(locator, timeout);
        await expect(locator).toBeEnabled({ timeout });
    }

    /**
     * Wait for element to be stable (not animating)
     * Playwright's waitFor already ensures stability before interacting
     */
    static async waitForStable(
        locator: Locator, 
        timeout: number = EnvironmentConfig.TIMEOUTS.SHORT
    ): Promise<void> {
        // Playwright's actionability checks ensure the element is stable
        // Wait for visible and attached states
        await locator.waitFor({ state: 'visible', timeout });
        await locator.waitFor({ state: 'attached', timeout });
    }
}
