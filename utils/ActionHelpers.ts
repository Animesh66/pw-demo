import { Page, Locator } from '@playwright/test';
import { Logger } from './Logger';

/**
 * ActionHelpers - Utility class for common page actions
 * Provides reusable action methods with built-in waits and error handling
 */
export class ActionHelpers {
    /**
     * Click element with retry logic
     */
    static async click(
        locator: Locator, 
        options: { 
            timeout?: number; 
            force?: boolean;
            retries?: number;
        } = {}
    ): Promise<void> {
        const { timeout = 10000, force = false, retries = 3 } = options;
        
        for (let i = 0; i < retries; i++) {
            try {
                await locator.click({ timeout, force });
                return;
            } catch (error) {
                if (i === retries - 1) throw error;
                Logger.warn(`Click failed, retrying... (${i + 1}/${retries})`);
                await this.wait(1000);
            }
        }
    }

    /**
     * Fill text input with clear and validation
     */
    static async fill(
        locator: Locator, 
        text: string, 
        options: { 
            timeout?: number;
            clear?: boolean;
            validate?: boolean;
        } = {}
    ): Promise<void> {
        const { timeout = 10000, clear = true, validate = true } = options;
        
        if (clear) {
            await locator.clear({ timeout });
        }
        
        await locator.fill(text, { timeout });
        
        if (validate) {
            const value = await locator.inputValue();
            if (value !== text) {
                throw new Error(`Fill validation failed. Expected: ${text}, Got: ${value}`);
            }
        }
    }

    /**
     * Type text with delay (simulates human typing)
     */
    static async type(
        locator: Locator, 
        text: string, 
        delay: number = 50
    ): Promise<void> {
        await locator.type(text, { delay });
    }

    /**
     * Select option from dropdown by value
     */
    static async selectOption(
        locator: Locator, 
        value: string | string[]
    ): Promise<void> {
        await locator.selectOption(value);
    }

    /**
     * Check checkbox if not already checked
     */
    static async check(locator: Locator): Promise<void> {
        if (!await locator.isChecked()) {
            await locator.check();
        }
    }

    /**
     * Uncheck checkbox if checked
     */
    static async uncheck(locator: Locator): Promise<void> {
        if (await locator.isChecked()) {
            await locator.uncheck();
        }
    }

    /**
     * Hover over element
     */
    static async hover(
        locator: Locator, 
        options: { timeout?: number } = {}
    ): Promise<void> {
        await locator.hover(options);
    }

    /**
     * Double click element
     */
    static async doubleClick(
        locator: Locator, 
        options: { timeout?: number } = {}
    ): Promise<void> {
        await locator.dblclick(options);
    }

    /**
     * Right click (context menu)
     */
    static async rightClick(
        locator: Locator, 
        options: { timeout?: number } = {}
    ): Promise<void> {
        await locator.click({ ...options, button: 'right' });
    }

    /**
     * Scroll element into view
     */
    static async scrollIntoView(locator: Locator): Promise<void> {
        await locator.scrollIntoViewIfNeeded();
    }

    /**
     * Upload file
     */
    static async uploadFile(
        locator: Locator, 
        filePath: string | string[]
    ): Promise<void> {
        await locator.setInputFiles(filePath);
    }

    /**
     * Clear file input
     */
    static async clearFiles(locator: Locator): Promise<void> {
        await locator.setInputFiles([]);
    }

    /**
     * Press keyboard key
     */
    static async press(
        locator: Locator, 
        key: string
    ): Promise<void> {
        await locator.press(key);
    }

    /**
     * Focus element
     */
    static async focus(locator: Locator): Promise<void> {
        await locator.focus();
    }

    /**
     * Blur (remove focus) from element
     */
    static async blur(locator: Locator): Promise<void> {
        await locator.blur();
    }

    /**
     * Drag and drop
     */
    static async dragAndDrop(
        source: Locator, 
        target: Locator
    ): Promise<void> {
        await source.dragTo(target);
    }

    /**
     * Wait helper
     */
    private static async wait(ms: number): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Click and wait for navigation
     */
    static async clickAndNavigate(
        page: Page, 
        locator: Locator, 
        urlPattern?: string | RegExp
    ): Promise<void> {
        await Promise.all([
            urlPattern ? page.waitForURL(urlPattern) : page.waitForLoadState('networkidle'),
            locator.click()
        ]);
    }

    /**
     * Fill form fields from object
     */
    static async fillForm(
        page: Page, 
        formData: Record<string, { locator: Locator; value: string }>
    ): Promise<void> {
        for (const [field, data] of Object.entries(formData)) {
            Logger.debug(`Filling field: ${field}`);
            await this.fill(data.locator, data.value);
        }
    }

    /**
     * Get text content with retry
     */
    static async getText(
        locator: Locator, 
        retries: number = 3
    ): Promise<string> {
        for (let i = 0; i < retries; i++) {
            try {
                const text = await locator.textContent();
                return text || '';
            } catch (error) {
                if (i === retries - 1) throw error;
                await this.wait(500);
            }
        }
        return '';
    }

    /**
     * Get attribute value
     */
    static async getAttribute(
        locator: Locator, 
        attribute: string
    ): Promise<string | null> {
        return await locator.getAttribute(attribute);
    }

    /**
     * Check if element is visible
     */
    static async isVisible(
        locator: Locator, 
        timeout: number = 5000
    ): Promise<boolean> {
        try {
            await locator.waitFor({ state: 'visible', timeout });
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Check if element is enabled
     */
    static async isEnabled(locator: Locator): Promise<boolean> {
        return await locator.isEnabled();
    }
}
