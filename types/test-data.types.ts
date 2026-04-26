/**
 * Type Definitions for Test Data
 * Provides strong typing for CSV data and test objects
 */

/**
 * User data structure from users.csv
 */
export interface UserData {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    userType?: string;
}

/**
 * Payment card data structure from payment-cards.csv
 */
export interface PaymentCardData {
    cardNumber: string;
    holderName: string;
    expiryDate: string;
    cvv: string;
    cardType: string;
    isValid: string;
}

/**
 * Test scenario data structure
 */
export interface TestScenarioData {
    scenarioId: string;
    description: string;
    expectedResult: string;
    priority?: string;
    tags?: string;
}

/**
 * Product data structure
 */
export interface ProductData {
    id?: string;
    name: string;
    price: number;
    category?: string;
    description?: string;
    inStock?: boolean;
}

/**
 * Cart item structure
 */
export interface CartItem {
    productName: string;
    quantity: number;
    price: string;
    total: string;
}

/**
 * Order summary structure
 */
export interface OrderSummary {
    subtotal: string;
    shipping: string;
    tax: string;
    total: string;
    itemCount: number;
}

/**
 * Test credentials structure
 */
export interface TestCredentials {
    email: string;
    password: string;
}

/**
 * Payment card input structure
 */
export interface PaymentCard {
    number: string;
    holderName: string;
    expiry: string;
    cvv: string;
}

/**
 * Test configuration options
 */
export interface TestOptions {
    slowMo?: number;
    screenshot?: boolean;
    video?: boolean;
    trace?: boolean;
}

/**
 * API response structure
 */
export interface ApiResponse<T = any> {
    status: number;
    data: T;
    message?: string;
    error?: string;
}

/**
 * Test result structure
 */
export interface TestResult {
    testName: string;
    status: 'PASSED' | 'FAILED' | 'SKIPPED';
    duration: number;
    error?: string;
    retries?: number;
}

/**
 * Browser context options
 */
export interface BrowserContextOptions {
    viewport?: { width: number; height: number };
    userAgent?: string;
    locale?: string;
    timezoneId?: string;
    permissions?: string[];
}

/**
 * Logger configuration
 */
export interface LoggerConfig {
    level: 'debug' | 'info' | 'warn' | 'error';
    directory: string;
    fileName: string;
}
