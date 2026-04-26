# Playwright Test Automation Framework

A robust, scalable test automation framework built with Playwright and TypeScript, following industry best practices and design patterns.

## 🚀 Features

- **Page Object Model (POM)** - Clean separation of test logic and page interactions
- **Component-Based Architecture** - Reusable UI components (e.g., HeaderComponent)
- **Storage State Authentication** - Login once, reuse across all tests
- **Setup Project Pattern** - Playwright's recommended authentication approach
- **Data-Driven Testing** - CSV-based test data management
- **TypeScript** - Full type safety and IntelliSense support
- **Environment Configuration** - Centralized config with .env support
- **Custom Utilities** - Wait helpers, action helpers, assertion helpers
- **Comprehensive Logging** - Custom logger with file and console output
- **Test Fixtures** - Dependency injection pattern for page objects
- **Allure Reporting** - Beautiful, detailed test reports
- **Code Quality** - ESLint and Prettier configuration
- **CI/CD Ready** - GitHub Actions workflow included
- **Multiple Browsers** - Support for Chromium, Firefox, WebKit, and mobile
- **Parallel Execution** - Fast test execution with configurable workers

## 🏛️ Framework Architecture

### Authentication Strategy

The framework uses Playwright's recommended **Setup Project Pattern** for authentication:

```
┌─────────────────────────────────────────────────────────┐
│  Setup Project (auth.setup.ts)                          │
│  • Runs once before all tests                           │
│  • Authenticates with test credentials                  │
│  • Saves storage state to playwright/.auth/user.json    │
└─────────────────────────────────────────────────────────┘
                          ↓
        ┌─────────────────┴─────────────────┐
        ↓                                     ↓
┌───────────────────┐              ┌───────────────────┐
│  Browser Projects │              │  Non-Auth Tests   │
│  (chromium, etc.) │              │  (registration)   │
│  • Depend on setup│              │  • No storage     │
│  • Use saved auth │              │  • Reset state    │
└───────────────────┘              └───────────────────┘
```

**Benefits:**
- ✅ **Fast**: Login happens once, not before each test
- ✅ **Reliable**: Reuses authenticated state via cookies/localStorage
- ✅ **Maintainable**: Single source of authentication logic
- ✅ **Flexible**: Easy to add non-authenticated tests

### Project Structure

```
pw-demo/
├── config/                         # Configuration files
│   ├── auth.config.ts             # Authentication paths
│   └── environment.config.ts      # Environment settings
├── constants/                      # Constants and enums
│   └── test.constants.ts
├── data/                          # Test data
│   └── csv/                       # CSV data files
│       ├── users.csv
│       ├── payment-cards.csv
│       └── test-scenarios.csv
├── fixtures/                      # Test data fixtures
│   ├── TestDataFixtures.ts
│   └── index.ts
├── logs/                          # Test execution logs (gitignored)
├── pages/                         # Page Object Models
│   ├── BasePage.ts               # Base page with common methods
│   ├── HomePage.ts
│   ├── LoginPage.ts
│   ├── CartPage.ts
│   ├── CheckoutPage.ts
│   ├── ErrorPage.ts
│   └── components/               # Reusable page components
│       └── HeaderComponent.ts
├── playwright/.auth/              # Authentication storage (gitignored)
│   └── user.json                 # Saved login state
├── playwright-report/             # HTML test reports (gitignored)
├── allure-results/               # Allure raw data (gitignored)
├── allure-report/                # Allure HTML report (gitignored)
├── test-results/                 # Test execution results (gitignored)
├── tests/                        # Test specifications
│   ├── auth.setup.ts            # Authentication setup (runs first)
│   ├── order-happy-path.spec.ts # Positive order tests
│   ├── order-negative.spec.ts   # Negative order tests
│   ├── user-registration.spec.ts # Non-authenticated tests
│   └── base/
│       └── BaseTest.ts          # Custom test fixtures
├── types/                        # TypeScript type definitions
│   └── test-data.types.ts
├── utils/                        # Utility functions
│   ├── ActionHelpers.ts
│   ├── AssertionHelpers.ts
│   ├── CSVOperations.ts
│   ├── Logger.ts
│   ├── WaitHelpers.ts
│   └── index.ts
├── .env                          # Environment variables
├── .eslintrc.js                  # ESLint configuration
├── .prettierrc.json              # Prettier configuration
├── playwright.config.ts          # Playwright configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Dependencies and scripts
```

### Test Execution Flow

```
1. Setup Project (auth.setup.ts)
   └─> Login with test credentials
   └─> Save storage state
   
2. Browser Projects (chromium, firefox, webkit, etc.)
   └─> Load storage state (already authenticated)
   └─> Run tests in parallel
   └─> Each test starts on home page (logged in)
   
3. Non-Auth Tests (registration, etc.)
   └─> Reset storage state
   └─> Run without authentication
```

### Page Object Model

```
BasePage (Abstract)
  ├─ Common methods (goto, click, fill, etc.)
  ├─ Wait helpers
  └─ Logging integration
     ↓
HomePage, CartPage, CheckoutPage, ErrorPage
  ├─ Page-specific locators
  ├─ Page-specific methods
  └─ Component composition (HeaderComponent)
```

## 🛠️ Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd pw-demo
```

2. Install dependencies
```bash
npm install
```

3. Install Playwright browsers
```bash
npm run test:install
```

4. Configure environment variables
```bash
cp .env.example .env
# Edit .env with your configuration
```

5. Verify installation
```bash
npm test
```

## 🎯 Running Tests

### Quick Start Commands

```bash
# Run all tests (with authentication setup)
npm test

# Run specific test suites
npm run test:happy-path      # Order placement - happy path
npm run test:negative        # Order placement - negative scenarios
npm run test:registration    # User registration (no auth)
npm run test:order          # All order tests (@order tag)

# Run with different browsers
npm run test:chrome         # Chromium only
npm run test:firefox        # Firefox only
npm run test:webkit         # Safari/WebKit only
npm run test:mobile         # Mobile Chrome & Safari
npm run test:all-browsers   # All desktop browsers

# Run with different modes
npm run test:headed         # See browser window
npm run test:debug          # Debug mode with inspector
npm run test:ui             # Interactive UI mode
npm run test:parallel       # Parallel execution (4 workers)
npm run test:serial         # Serial execution (1 worker)

# Run by tags
npm run test:smoke          # Smoke tests only
npm run test:regression     # Regression tests only
```

### Advanced Test Execution

```bash
# Run specific test file
npx playwright test tests/order-happy-path.spec.ts

# Run specific test by name
npx playwright test -g "TC01"

# Run tests and update snapshots
npx playwright test --update-snapshots

# Run with maximum workers
npx playwright test --workers=8

# Run only failed tests
npx playwright test --last-failed

# Run with specific timeout
npx playwright test --timeout=60000
```

## 📊 Reports

### Playwright HTML Report (Default)

```bash
# View HTML report (opens automatically on failure)
npm run test:report

# Or manually
npx playwright show-report
```

### Allure Report (Enhanced)

```bash
# Run tests with Allure reporting
npm run test:allure

# Generate Allure HTML report
npm run allure:generate

# Open Allure report in browser
npm run allure:open

# Serve Allure report (with live reload)
npm run allure:serve

# Complete workflow: test + generate + open
npm run test:with-allure

# Clean Allure artifacts
npm run allure:clean
```

**Allure Features:**
- ✅ Beautiful, detailed reports
- ✅ Test categorization and trends
- ✅ Screenshot attachments
- ✅ Execution timeline
- ✅ Test history and retries
- ✅ Environment info

### Trace Viewer

```bash
# View trace for debugging
npm run test:trace

# Or run with trace
npx playwright test --trace on
```

## 🧪 Writing Tests

### Authenticated Tests (Default)

Tests automatically start with authenticated state:

```typescript
import { test, expect } from './base/BaseTest';
import { Logger } from '../utils';

test.describe('Order Placement', () => {
    test.beforeEach(async ({ homePage }, testInfo) => {
        Logger.testStart(testInfo.title);
        // Already authenticated via storage state!
        await homePage.navigateToHome();
    });

    test('TC01 - Place order', { tag: '@order' }, async ({ 
        homePage, 
        cartPage, 
        checkoutPage 
    }) => {
        // User is already logged in
        await homePage.addFirstProductToCart();
        await homePage.header.clickCart();
        
        expect(await cartPage.isPageLoaded()).toBeTruthy();
    });
});
```

### Non-Authenticated Tests

For tests that don't need authentication (registration, login, etc.):

```typescript
import { test, expect } from '@playwright/test';
import { Logger } from '../utils';

// Reset storage state to avoid authentication
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('User Registration', () => {
    test('TC_REG_01 - Access registration page', async ({ page }) => {
        // User is NOT logged in
        await page.goto('/register');
        
        expect(page.url()).toContain('/register');
    });
});
```

### Using Test Data

```typescript
import { CSVOperations } from '../utils';

// Read CSV data
const userData = CSVOperations.readCSVRow('users', 0);
const validCards = CSVOperations.filterCSVByColumn('payment-cards', 'isValid', 'true');

// Use in tests
await loginPage.login(userData.email, userData.password);
await checkoutPage.fillPaymentForm(
    validCards[0].cardNumber,
    validCards[0].holderName,
    validCards[0].expiryDate,
    validCards[0].cvv
);
```

### Using Logger

```typescript
import { Logger } from '../utils';

test.beforeAll(async () => {
    Logger.initialize();
    Logger.info('=== Test Suite Started ===');
});

test('example', async ({ page }) => {
    Logger.step(1, 'Navigate to login page');
    await page.goto('/login');
    Logger.success('Navigation successful');
    
    Logger.step(2, 'Fill credentials');
    // ... test steps
    Logger.warn('Using test credentials');
    
    Logger.error('Test failed');  // Only if something goes wrong
});
```

## 🏗️ Creating New Page Objects

### 1. Create the Page Class

```typescript
// pages/ProductPage.ts
import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { HeaderComponent } from './components/HeaderComponent';

export class ProductPage extends BasePage {
    readonly header: HeaderComponent;
    
    private readonly productTitle: Locator;
    private readonly addToCartButton: Locator;
    private readonly priceLabel: Locator;

    constructor(page: Page) {
        super(page);
        this.header = new HeaderComponent(page);
        
        this.productTitle = page.locator('h1.product-title');
        this.addToCartButton = page.locator('button[data-testid="add-to-cart"]');
        this.priceLabel = page.locator('.price');
    }

    async navigateToProduct(productId: string): Promise<void> {
        await this.goto(`/product/${productId}`);
    }

    async addToCart(): Promise<void> {
        await this.addToCartButton.click();
        await this.page.waitForLoadState('networkidle');
    }

    async getPrice(): Promise<string> {
        return await this.priceLabel.textContent() || '';
    }

    async isPageLoaded(): Promise<boolean> {
        await this.productTitle.waitFor({ state: 'visible', timeout: 10000 });
        return await this.productTitle.isVisible();
    }
}
```

### 2. Add to BaseTest Fixtures

```typescript
// tests/base/BaseTest.ts
import { ProductPage } from '../../pages/ProductPage';

type PageObjects = {
    // ... existing pages
    productPage: ProductPage;
};

export const test = base.extend<PageObjects>({
    // ... existing fixtures
    productPage: async ({ page }, use) => {
        const productPage = new ProductPage(page);
        await use(productPage);
    },
});
```

### 3. Use in Tests

```typescript
test('should view product details', async ({ productPage }) => {
    await productPage.navigateToProduct('123');
    expect(await productPage.isPageLoaded()).toBeTruthy();
    
    const price = await productPage.getPrice();
    expect(price).toMatch(/\$\d+/);
});
```

## 🔧 Configuration

### Environment Variables (.env)

```bash
# Application Configuration
BASE_URL=http://localhost:5173

# Test Configuration
TEST_TIMEOUT=30000
WORKERS=4

# Browser Configuration
HEADLESS=true
SLOW_MO=0

# Capture Settings
SCREENSHOT_ON_FAILURE=true
VIDEO_ON_FAILURE=false
TRACE_ON_FAILURE=true

# Logging
LOG_LEVEL=info
```

### Playwright Configuration

Key settings in `playwright.config.ts`:

```typescript
{
    testDir: './tests',
    timeout: 30000,
    fullyParallel: true,
    retries: 0, // 2 on CI
    workers: 4, // 1 on CI
    
    reporter: [
        ['html'],
        ['list'],
        ['json'],
        ['allure-playwright']
    ],
    
    projects: [
        { name: 'setup', testMatch: /.*\.setup\.ts/ },
        { 
            name: 'chromium',
            use: { storageState: 'playwright/.auth/user.json' },
            dependencies: ['setup']
        },
        // ... more browsers
    ]
}
```

## 📝 Logging

The framework includes a custom logger that writes to both console and file:

```typescript
import { Logger } from '../utils/Logger';

// Initialize (usually in beforeAll)
Logger.initialize();

// Log levels
Logger.info('Information message');
Logger.debug('Debug message');
Logger.warn('Warning message');
Logger.error('Error message');
Logger.success('Success message');

// Test lifecycle
Logger.testStart('Test Name');
Logger.step(1, 'Step description');
Logger.testEnd('Test Name', 'PASSED');

// Get log file path
const logPath = Logger.getLogFilePath();
```

Logs are saved in `logs/` directory with format: `test-execution-YYYY-MM-DD_HH-mm-ss.log`

## 🧹 Code Quality

### Linting

```bash
# Check for linting issues
npm run lint

# Auto-fix linting issues
npm run lint:fix
```

### Formatting

```bash
# Format all files
npm run format

# Check formatting (CI)
npm run format:check
```

### Type Checking

```bash
# Check TypeScript types
npm run type-check
```

### Clean Artifacts

```bash
# Clean all generated files
npm run clean

# Clean authentication state (force re-login)
npm run clean:auth
```

## 🔄 CI/CD

### GitHub Actions Workflow

The framework includes a CI/CD workflow that:
- ✅ Runs on push and pull requests
- ✅ Executes tests on multiple browsers
- ✅ Generates Allure and HTML reports
- ✅ Archives test results and logs
- ✅ Uploads artifacts

Workflow file: `.github/workflows/playwright.yml`

### CI Commands

```bash
# Install dependencies with browsers
npm run ci:install

# Run tests with multiple reporters
npm run ci:test
```

## 📚 Best Practices

### Test Design
1. **Keep tests independent** - Each test should run standalone
2. **Use meaningful test names** - Describe what the test verifies
3. **Follow AAA pattern** - Arrange, Act, Assert
4. **One assertion per test** - Focus on a single behavior
5. **Use test.describe** - Group related tests together

### Page Objects
6. **Keep selectors in page objects** - Never in test files
7. **Use data-testid attributes** - More stable than CSS selectors
8. **Create helper methods** - Abstract complex interactions
9. **Avoid test logic in pages** - Pages should be dumb
10. **Return page objects** - For method chaining

### Authentication
11. **Use storage state** - Don't login before each test
12. **Reset state for non-auth tests** - Use `test.use()`
13. **Clean auth state** - `npm run clean:auth` if needed

### Data Management
14. **Use CSV for test data** - Centralize in `data/csv/`
15. **Keep sensitive data in .env** - Never commit credentials
16. **Use data-driven tests** - Parameterize test inputs

### Logging & Debugging
17. **Log test steps** - Use Logger.step() for clarity
18. **Capture on failure** - Screenshots, videos, traces
19. **Use UI mode** - For interactive debugging
20. **Check Allure reports** - Rich test execution details

## 🐛 Debugging

### Debug Mode
```bash
# Opens Playwright Inspector
npm run test:debug

# Debug specific test
npx playwright test tests/order.spec.ts --debug
```

### UI Mode
```bash
# Interactive test exploration
npm run test:ui
```

### Trace Viewer
```bash
# View trace after test execution
npm run test:trace

# Generate trace
npx playwright test --trace on
```

### VS Code Debugging
1. Set breakpoints in test files
2. Run "Debug: Start Debugging" (F5)
3. Select "Playwright Test"

## 🔐 Authentication Deep Dive

### How Storage State Works

1. **Setup Phase** (`auth.setup.ts`):
   ```typescript
   setup('authenticate', async ({ page }) => {
       await page.goto('/login');
       await page.fill('[name="email"]', 'test@example.com');
       await page.fill('[name="password"]', 'password');
       await page.click('button[type="submit"]');
       
       // Save cookies, localStorage, sessionStorage
       await page.context().storageState({ 
           path: 'playwright/.auth/user.json' 
       });
   });
   ```

2. **Test Phase** (all authenticated tests):
   ```typescript
   // Browser context automatically loads saved state
   use: { storageState: 'playwright/.auth/user.json' }
   
   // Tests start already logged in!
   test('my test', async ({ page }) => {
       await page.goto('/'); // Already authenticated
   });
   ```

3. **Non-Auth Tests**:
   ```typescript
   // Reset storage state
   test.use({ storageState: { cookies: [], origins: [] } });
   ```

### Troubleshooting Authentication

```bash
# If auth state is corrupted or expired
npm run clean:auth

# Then re-run tests (will recreate auth state)
npm test
```

## 📖 Additional Resources

- [Playwright Documentation](https://playwright.dev/)
- [Playwright Authentication Guide](https://playwright.dev/docs/auth)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Allure Report Documentation](https://docs.qameta.io/allure/)
- [Page Object Model Pattern](https://playwright.dev/docs/pom)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👥 Support

For questions or issues, please open an issue in the repository.

---

**Happy Testing! 🎭**
