import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { HeaderComponent } from './components/HeaderComponent';

/**
 * LoginPage - Represents the login page
 * Contains locators and actions for login form elements
 */
export class LoginPage extends BasePage {
    readonly header: HeaderComponent;
    
    // Locators
    private readonly pageHeading: Locator;
    private readonly emailInput: Locator;
    private readonly passwordInput: Locator;
    private readonly signInButton: Locator;
    private readonly createAccountLink: Locator;
    private readonly subHeading: Locator;

    constructor(page: Page) {
        super(page);
        this.header = new HeaderComponent(page);
        
        // Initialize locators
        this.pageHeading = page.getByRole('heading', { name: 'Welcome Back' });
        this.emailInput = page.getByPlaceholder('you@example.com');
        this.passwordInput = page.getByPlaceholder('Enter your password');
        this.signInButton = page.getByRole('button', { name: 'Sign In' });
        this.createAccountLink = page.getByRole('link', { name: 'Create one now' });
        this.subHeading = page.locator('p').filter({ hasText: 'Sign in to continue shopping' });
    }

    /**
     * Navigate to login page
     */
    async navigateToLogin(): Promise<void> {
        await this.goto('http://localhost:5173/login');
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Fill email field
     */
    async fillEmail(email: string): Promise<void> {
        await this.emailInput.fill(email);
    }

    /**
     * Fill password field
     */
    async fillPassword(password: string): Promise<void> {
        await this.passwordInput.fill(password);
    }

    /**
     * Click sign in button
     */
    async clickSignIn(): Promise<void> {
        await this.signInButton.click();
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Perform complete login
     */
    async login(email: string, password: string): Promise<void> {
        await this.fillEmail(email);
        await this.fillPassword(password);
        await this.clickSignIn();
    }

    /**
     * Navigate to create account page
     */
    async clickCreateAccount(): Promise<void> {
        await this.createAccountLink.click();
    }

    /**
     * Check if login page is loaded
     */
    async isPageLoaded(): Promise<boolean> {
        return await this.pageHeading.isVisible();
    }

    /**
     * Check if login form is displayed
     */
    async isLoginFormDisplayed(): Promise<boolean> {
        return await this.emailInput.isVisible() &&
               await this.passwordInput.isVisible() &&
               await this.signInButton.isVisible();
    }
}
