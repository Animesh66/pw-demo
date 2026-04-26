import * as path from 'path';

// Load environment variables from .env file
// Note: Install dotenv with 'npm install' if not already installed
try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const dotenv = require('dotenv');
    dotenv.config({ path: path.resolve(process.cwd(), '.env') });
} catch (error) {
    // dotenv not installed yet, will use process.env defaults
    console.warn('dotenv not found. Run "npm install" to use .env file configuration.');
}

/**
 * Environment Configuration
 * Centralized configuration for all environment-specific values
 */
export class EnvironmentConfig {
    /**
     * Application URLs
     */
    static readonly BASE_URL = process.env.BASE_URL || 'http://localhost:5173';
    
    static readonly URLS = {
        HOME: `${this.BASE_URL}/`,
        LOGIN: `${this.BASE_URL}/login`,
        CART: `${this.BASE_URL}/cart`,
        CHECKOUT: `${this.BASE_URL}/checkout`,
    };

    /**
     * Test Timeouts (in milliseconds)
     */
    static readonly TIMEOUTS = {
        DEFAULT: parseInt(process.env.TEST_TIMEOUT || '30000'),
        NAVIGATION: parseInt(process.env.DEFAULT_NAVIGATION_TIMEOUT || '30000'),
        ACTION: parseInt(process.env.DEFAULT_ACTION_TIMEOUT || '10000'),
        SHORT: 5000,
        MEDIUM: 10000,
        LONG: 30000,
    };

    /**
     * Browser Configuration
     */
    static readonly BROWSER = {
        HEADLESS: process.env.HEADLESS === 'true',
        SLOW_MO: parseInt(process.env.SLOW_MO || '0'),
        VIEWPORT: {
            width: 1920,
            height: 1080,
        },
    };

    /**
     * Test Data Configuration
     */
    static readonly TEST_DATA = {
        DIR: process.env.TEST_DATA_DIR || './data/csv',
        CSV_FILES: {
            USERS: 'users',
            PAYMENT_CARDS: 'payment-cards',
            SCENARIOS: 'test-scenarios',
        },
    };

    /**
     * Logging Configuration
     */
    static readonly LOGGING = {
        LEVEL: process.env.LOG_LEVEL || 'info',
        DIR: process.env.LOG_DIR || './logs',
    };

    /**
     * Screenshot & Video Configuration
     */
    static readonly CAPTURE = {
        SCREENSHOT_ON_FAILURE: process.env.SCREENSHOT_ON_FAILURE === 'true',
        VIDEO_ON_FAILURE: process.env.VIDEO_ON_FAILURE === 'true',
        TRACE_ON_FAILURE: process.env.TRACE_ON_FAILURE === 'true',
    };

    /**
     * Parallel Execution Configuration
     */
    static readonly EXECUTION = {
        WORKERS: parseInt(process.env.WORKERS || '4'),
        FULLY_PARALLEL: process.env.FULLY_PARALLEL === 'true',
    };

    /**
     * Retry Configuration
     */
    static readonly RETRY = {
        RETRIES: parseInt(process.env.RETRIES || '0'),
        RETRIES_CI: parseInt(process.env.RETRIES_CI || '2'),
    };

    /**
     * Environment Type
     */
    static readonly ENV = process.env.NODE_ENV || 'development';
    static readonly IS_CI = !!process.env.CI;
    static readonly IS_DEV = this.ENV === 'development';
    static readonly IS_PROD = this.ENV === 'production';

    /**
     * Get configuration summary for logging
     */
    static getConfigSummary(): Record<string, any> {
        return {
            baseUrl: this.BASE_URL,
            environment: this.ENV,
            isCI: this.IS_CI,
            headless: this.BROWSER.HEADLESS,
            workers: this.EXECUTION.WORKERS,
            retries: this.IS_CI ? this.RETRY.RETRIES_CI : this.RETRY.RETRIES,
        };
    }
}
