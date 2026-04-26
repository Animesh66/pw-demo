/**
 * Constants used across the test framework
 * Centralized location for all constant values
 */

/**
 * Test timeouts in milliseconds
 */
export const TIMEOUTS = {
    VERY_SHORT: 2000,
    SHORT: 5000,
    MEDIUM: 10000,
    LONG: 30000,
    VERY_LONG: 60000,
} as const;

/**
 * Test data file names
 */
export const DATA_FILES = {
    USERS: 'users',
    PAYMENT_CARDS: 'payment-cards',
    TEST_SCENARIOS: 'test-scenarios',
} as const;

/**
 * Test user types
 */
export const USER_TYPES = {
    VALID: 'valid',
    INVALID: 'invalid',
    ADMIN: 'admin',
    GUEST: 'guest',
} as const;

/**
 * Payment card types
 */
export const CARD_TYPES = {
    VISA: 'VISA',
    MASTERCARD: 'MasterCard',
    AMEX: 'Amex',
    INVALID: 'Invalid',
} as const;

/**
 * Test priorities
 */
export const TEST_PRIORITY = {
    CRITICAL: 'P0',
    HIGH: 'P1',
    MEDIUM: 'P2',
    LOW: 'P3',
} as const;

/**
 * Test tags for filtering
 */
export const TEST_TAGS = {
    SMOKE: '@smoke',
    REGRESSION: '@regression',
    E2E: '@e2e',
    PAYMENT: '@payment',
    CART: '@cart',
    LOGIN: '@login',
    NEGATIVE: '@negative',
} as const;

/**
 * HTTP Status Codes
 */
export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
} as const;

/**
 * Wait conditions
 */
export const WAIT_CONDITIONS = {
    VISIBLE: 'visible',
    HIDDEN: 'hidden',
    ATTACHED: 'attached',
    DETACHED: 'detached',
} as const;

/**
 * Browser types
 */
export const BROWSERS = {
    CHROMIUM: 'chromium',
    FIREFOX: 'firefox',
    WEBKIT: 'webkit',
} as const;

/**
 * Log levels
 */
export const LOG_LEVELS = {
    DEBUG: 'debug',
    INFO: 'info',
    WARN: 'warn',
    ERROR: 'error',
} as const;

/**
 * Common error messages
 */
export const ERROR_MESSAGES = {
    ELEMENT_NOT_FOUND: 'Element not found',
    TIMEOUT: 'Timeout exceeded',
    NETWORK_ERROR: 'Network error occurred',
    INVALID_CREDENTIALS: 'Invalid credentials',
    PAYMENT_FAILED: 'Payment failed',
    CART_EMPTY: 'Cart is empty',
} as const;

/**
 * Success messages
 */
export const SUCCESS_MESSAGES = {
    LOGIN_SUCCESS: 'Login successful',
    PRODUCT_ADDED: 'Product added to cart',
    ORDER_PLACED: 'Order placed successfully',
    PAYMENT_SUCCESS: 'Payment processed successfully',
} as const;

/**
 * Product categories
 */
export const CATEGORIES = {
    ELECTRONICS: 'Electronics',
    CLOTHING: 'Clothing',
    BOOKS: 'Books',
    HOME: 'Home & Garden',
} as const;

/**
 * Environment types
 */
export const ENVIRONMENTS = {
    DEV: 'development',
    QA: 'qa',
    STAGING: 'staging',
    PROD: 'production',
} as const;
