import { defineConfig, devices } from '@playwright/test';
import { EnvironmentConfig } from './config/environment.config';

/**
 * Playwright Test Configuration
 * See https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
    testDir: './tests',
    
    /* Maximum time one test can run */
    timeout: EnvironmentConfig.TIMEOUTS.DEFAULT,
    
    /* Run tests in files in parallel */
    fullyParallel: EnvironmentConfig.EXECUTION.FULLY_PARALLEL,
    
    /* Fail the build on CI if you accidentally left test.only in the source code */
    forbidOnly: EnvironmentConfig.IS_CI,
    
    /* Retry on CI only */
    retries: EnvironmentConfig.IS_CI 
        ? EnvironmentConfig.RETRY.RETRIES_CI 
        : EnvironmentConfig.RETRY.RETRIES,
    
    /* Opt out of parallel tests on CI for stability */
    workers: EnvironmentConfig.IS_CI ? 1 : EnvironmentConfig.EXECUTION.WORKERS,
    
    /* Reporter configuration */
    reporter: [
        ['html', { outputFolder: 'playwright-report', open: 'never' }],
        ['list'],
        ['json', { outputFile: 'test-results/test-results.json' }],
        ...(EnvironmentConfig.IS_CI 
            ? [['junit', { outputFile: 'test-results/junit.xml' }] as const] 
            : []
        ),
    ],
    
    /* Shared settings for all projects */
    use: {
        /* Base URL to use in actions like `await page.goto('/')` */
        baseURL: EnvironmentConfig.BASE_URL,
        
        /* Collect trace when retrying the failed test */
        trace: EnvironmentConfig.CAPTURE.TRACE_ON_FAILURE ? 'on-first-retry' : 'off',
        
        /* Screenshot configuration */
        screenshot: EnvironmentConfig.CAPTURE.SCREENSHOT_ON_FAILURE 
            ? 'only-on-failure' 
            : 'off',
        
        /* Video configuration */
        video: EnvironmentConfig.CAPTURE.VIDEO_ON_FAILURE 
            ? 'retain-on-failure' 
            : 'off',
        
        /* Navigation timeout */
        navigationTimeout: EnvironmentConfig.TIMEOUTS.NAVIGATION,
        
        /* Action timeout */
        actionTimeout: EnvironmentConfig.TIMEOUTS.ACTION,
        
        /* Emulate user locale */
        locale: 'en-US',
        
        /* Emulate timezone */
        timezoneId: 'America/New_York',
        
        /* Ignore HTTPS errors */
        ignoreHTTPSErrors: true,
        
        /* Browser context options */
        contextOptions: {
            strictSelectors: false,
        },
    },

    /* Configure projects for major browsers */
    projects: [
        {
            name: 'chromium',
            use: { 
                ...devices['Desktop Chrome'],
                viewport: EnvironmentConfig.BROWSER.VIEWPORT,
                launchOptions: {
                    slowMo: EnvironmentConfig.BROWSER.SLOW_MO,
                },
            },
        },

        {
            name: 'firefox',
            use: { 
                ...devices['Desktop Firefox'],
                viewport: EnvironmentConfig.BROWSER.VIEWPORT,
                launchOptions: {
                    slowMo: EnvironmentConfig.BROWSER.SLOW_MO,
                },
            },
        },

        {
            name: 'webkit',
            use: { 
                ...devices['Desktop Safari'],
                viewport: EnvironmentConfig.BROWSER.VIEWPORT,
                launchOptions: {
                    slowMo: EnvironmentConfig.BROWSER.SLOW_MO,
                },
            },
        },

        /* Test against mobile viewports */
        {
            name: 'Mobile Chrome',
            use: { 
                ...devices['Pixel 5'],
                launchOptions: {
                    slowMo: EnvironmentConfig.BROWSER.SLOW_MO,
                },
            },
        },
        
        {
            name: 'Mobile Safari',
            use: { 
                ...devices['iPhone 12'],
                launchOptions: {
                    slowMo: EnvironmentConfig.BROWSER.SLOW_MO,
                },
            },
        },
    ],

    /* Global setup and teardown */
    // globalSetup: require.resolve('./tests/global-setup.ts'),
    // globalTeardown: require.resolve('./tests/global-teardown.ts'),

    /* Run your local dev server before starting the tests */
    // webServer: {
    //     command: 'npm run start',
    //     url: EnvironmentConfig.BASE_URL,
    //     reuseExistingServer: !EnvironmentConfig.IS_CI,
    //     timeout: 120000,
    // },
});
