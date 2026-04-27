import { test as base } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { CartPage } from '../../pages/CartPage';
import { CheckoutPage } from '../../pages/CheckoutPage';
import { ErrorPage } from '../../pages/ErrorPage';
import { LoginPage } from '../../pages/LoginPage';

/**
 * BaseTest - Extended test fixture with page objects
 * Automatically initializes page objects for each test
 */
type PageObjects = {
    homePage: HomePage;
    cartPage: CartPage;
    checkoutPage: CheckoutPage;
    errorPage: ErrorPage;
    loginPage: LoginPage;
};

/**
 * Extended test with page object fixtures
 * Usage: test('test name', async ({ homePage, cartPage }) => { ... })
 */
export const test = base.extend<PageObjects>({
    homePage: async ({ page }, use) => {
        const homePage = new HomePage(page);
        await use(homePage);
    },
    
    cartPage: async ({ page }, use) => {
        const cartPage = new CartPage(page);
        await use(cartPage);
    },
    
    checkoutPage: async ({ page }, use) => {
        const checkoutPage = new CheckoutPage(page);
        await use(checkoutPage);
    },
    
    errorPage: async ({ page }, use) => {
        const errorPage = new ErrorPage(page);
        await use(errorPage);
    },
    
    loginPage: async ({ page }, use) => {
        const loginPage = new LoginPage(page);
        await use(loginPage);
    }
});

export { expect } from '@playwright/test';
