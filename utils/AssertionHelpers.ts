import { expect } from '@playwright/test';
import { Locator, Page } from '@playwright/test';

/**
 * AssertionHelpers - Custom assertion helpers for common validations
 * Extends Playwright's built-in assertions with domain-specific checks
 */
export class AssertionHelpers {
    /**
     * Assert element is visible and enabled
     */
    static async assertElementInteractive(locator: Locator): Promise<void> {
        await expect(locator).toBeVisible();
        await expect(locator).toBeEnabled();
    }

    /**
     * Assert element contains exact text
     */
    static async assertExactText(locator: Locator, text: string): Promise<void> {
        await expect(locator).toHaveText(text);
    }

    /**
     * Assert element contains text (partial match)
     */
    static async assertContainsText(locator: Locator, text: string | RegExp): Promise<void> {
        await expect(locator).toContainText(text);
    }

    /**
     * Assert element has specific count
     */
    static async assertElementCount(locator: Locator, count: number): Promise<void> {
        await expect(locator).toHaveCount(count);
    }

    /**
     * Assert URL contains text
     */
    static async assertUrlContains(page: Page, urlPart: string): Promise<void> {
        expect(page.url()).toContain(urlPart);
    }

    /**
     * Assert URL matches pattern
     */
    static async assertUrlMatches(page: Page, pattern: RegExp): Promise<void> {
        expect(page.url()).toMatch(pattern);
    }

    /**
     * Assert page title
     */
    static async assertTitle(page: Page, title: string | RegExp): Promise<void> {
        await expect(page).toHaveTitle(title);
    }

    /**
     * Assert element has attribute with value
     */
    static async assertAttribute(
        locator: Locator, 
        attribute: string, 
        value: string | RegExp
    ): Promise<void> {
        await expect(locator).toHaveAttribute(attribute, value);
    }

    /**
     * Assert element has CSS class
     */
    static async assertHasClass(locator: Locator, className: string | RegExp): Promise<void> {
        await expect(locator).toHaveClass(className);
    }

    /**
     * Assert element has specific CSS value
     */
    static async assertCssValue(
        locator: Locator, 
        property: string, 
        value: string | RegExp
    ): Promise<void> {
        await expect(locator).toHaveCSS(property, value);
    }

    /**
     * Assert input has value
     */
    static async assertInputValue(locator: Locator, value: string | RegExp): Promise<void> {
        await expect(locator).toHaveValue(value);
    }

    /**
     * Assert checkbox/radio is checked
     */
    static async assertChecked(locator: Locator): Promise<void> {
        await expect(locator).toBeChecked();
    }

    /**
     * Assert checkbox/radio is not checked
     */
    static async assertNotChecked(locator: Locator): Promise<void> {
        await expect(locator).not.toBeChecked();
    }

    /**
     * Assert element is disabled
     */
    static async assertDisabled(locator: Locator): Promise<void> {
        await expect(locator).toBeDisabled();
    }

    /**
     * Assert element is hidden
     */
    static async assertHidden(locator: Locator): Promise<void> {
        await expect(locator).toBeHidden();
    }

    /**
     * Assert element is focused
     */
    static async assertFocused(locator: Locator): Promise<void> {
        await expect(locator).toBeFocused();
    }

    /**
     * Assert element is attached to DOM
     */
    static async assertAttached(locator: Locator): Promise<void> {
        await expect(locator).toBeAttached();
    }

    /**
     * Assert array/collection contains value
     */
    static assertContains<T>(array: T[], value: T, message?: string): void {
        expect(array, message).toContain(value);
    }

    /**
     * Assert array length
     */
    static assertLength<T>(array: T[], length: number, message?: string): void {
        expect(array, message).toHaveLength(length);
    }

    /**
     * Assert value is truthy
     */
    static assertTruthy(value: any, message?: string): void {
        expect(value, message).toBeTruthy();
    }

    /**
     * Assert value is falsy
     */
    static assertFalsy(value: any, message?: string): void {
        expect(value, message).toBeFalsy();
    }

    /**
     * Assert values are equal (deep equality for objects)
     */
    static assertEqual<T>(actual: T, expected: T, message?: string): void {
        const actualStr = JSON.stringify(actual);
        const expectedStr = JSON.stringify(expected);
        if (actualStr !== expectedStr) {
            throw new Error(message || `Expected ${actualStr} to equal ${expectedStr}`);
        }
    }

    /**
     * Assert values are strictly equal
     */
    static assertStrictEqual<T>(actual: T, expected: T, message?: string): void {
        expect(actual, message).toBe(expected);
    }

    /**
     * Assert value is greater than
     */
    static assertGreaterThan(actual: number, expected: number, message?: string): void {
        expect(actual, message).toBeGreaterThan(expected);
    }

    /**
     * Assert value is less than
     */
    static assertLessThan(actual: number, expected: number, message?: string): void {
        expect(actual, message).toBeLessThan(expected);
    }

    /**
     * Assert string matches regex pattern
     */
    static assertMatches(actual: string, pattern: RegExp, message?: string): void {
        expect(actual, message).toMatch(pattern);
    }

    /**
     * Assert object has property
     */
    static assertHasProperty(obj: any, property: string, message?: string): void {
        expect(obj, message).toHaveProperty(property);
    }

    /**
     * Assert price format (e.g., $123.45)
     */
    static assertPriceFormat(price: string, message?: string): void {
        const pricePattern = /^\$\d+(\.\d{2})?$/;
        expect(price, message || 'Invalid price format').toMatch(pricePattern);
    }

    /**
     * Assert email format
     */
    static assertEmailFormat(email: string, message?: string): void {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        expect(email, message || 'Invalid email format').toMatch(emailPattern);
    }

    /**
     * Assert date format (YYYY-MM-DD)
     */
    static assertDateFormat(date: string, message?: string): void {
        const datePattern = /^\d{4}-\d{2}-\d{2}$/;
        expect(date, message || 'Invalid date format').toMatch(datePattern);
    }

    /**
     * Assert response time is within acceptable range
     */
    static assertResponseTime(
        actualMs: number, 
        maxMs: number, 
        message?: string
    ): void {
        expect(
            actualMs, 
            message || `Response time ${actualMs}ms exceeded maximum ${maxMs}ms`
        ).toBeLessThanOrEqual(maxMs);
    }
}
