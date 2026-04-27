import { Locator, expect } from '@playwright/test';
import { EnvironmentConfig } from '../config/environment.config';

/**
 * WaitHelpers - Utility class for Playwright assertion-based waits
 * 
 * NOTE: Most waits should use Playwright's built-in methods directly:
 * - locator.waitFor({ state: 'visible' })
 * - expect(locator).toBeVisible()
 * - page.waitForURL()
 * 
 * These helpers provide convenience wrappers for common assertion patterns.
 * Avoid static waits (setTimeout/waitForTimeout) - use element-based waits.
 */
export class WaitHelpers {
    /**
     * DEPRECATED: These methods just wrap Playwright's built-in methods.
     * Use the Playwright methods directly instead:
     * 
     * - locator.waitFor({ state: 'visible', timeout })
     * - locator.waitFor({ state: 'hidden', timeout })
     * - locator.waitFor({ state: 'attached', timeout })
     * - locator.waitFor({ state: 'detached', timeout })
     * - page.waitForURL(pattern, { timeout })
     * 
     * Or better yet, use assertions with auto-retry:
     * - await expect(locator).toBeVisible({ timeout })
     * - await expect(locator).toBeHidden({ timeout })
     * - await expect(page).toHaveURL(pattern, { timeout })
     */
    // Removed - use Playwright's built-in methods directly

    /**
     * DEPRECATED: Use page.waitForLoadState() directly
     * @deprecated Use page.waitForLoadState('load') or page.waitForLoadState('domcontentloaded')
     */
    // Removed - use Playwright's page.waitForLoadState() directly

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
     * DEPRECATED: Use page.waitForFunction() or expect assertions instead
     * @deprecated Use page.waitForFunction() for custom conditions or expect() assertions
     * Example: await page.waitForFunction(() => document.readyState === 'complete')
     */
    // Removed - use Playwright's page.waitForFunction() or expect() assertions

    /**
     * Wait for element to be clickable (visible and enabled)
     * Uses Playwright assertions for auto-retry behavior
     */
    static async waitForClickable(
        locator: Locator, 
        timeout: number = EnvironmentConfig.TIMEOUTS.MEDIUM
    ): Promise<void> {
        await expect(locator).toBeVisible({ timeout });
        await expect(locator).toBeEnabled({ timeout });
    }

    /**
     * DEPRECATED: Playwright's auto-waiting handles stability automatically
     * @deprecated Playwright automatically waits for stability before actions (click, fill, etc.)
     * No need to manually wait for stability - just perform your action directly.
     */
    // Removed - Playwright's actionability checks handle this automatically
}
