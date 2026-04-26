# Playwright Test Automation Framework

A robust, scalable test automation framework built with Playwright and TypeScript, following industry best practices and design patterns.

## 🚀 Features

- **Page Object Model (POM)** - Clean separation of test logic and page interactions
- **Component-Based Architecture** - Reusable UI components (e.g., HeaderComponent)
- **Data-Driven Testing** - CSV-based test data management
- **TypeScript** - Full type safety and IntelliSense support
- **Environment Configuration** - Centralized config with .env support
- **Custom Utilities** - Wait helpers, action helpers, assertion helpers
- **Comprehensive Logging** - Custom logger with file and console output
- **Test Fixtures** - Dependency injection pattern for page objects
- **Code Quality** - ESLint and Prettier configuration
- **CI/CD Ready** - GitHub Actions workflow included
- **Multiple Browsers** - Support for Chromium, Firefox, WebKit, and mobile
- **Parallel Execution** - Fast test execution with configurable workers
- **Rich Reporting** - HTML, JSON, and JUnit reports

## 📁 Project Structure

```
pw-demo/
├── config/                     # Configuration files
│   └── environment.config.ts   # Environment-specific settings
├── constants/                  # Constants and enums
│   └── test.constants.ts       # Test-wide constants
├── data/                       # Test data
│   └── csv/                    # CSV data files
│       ├── users.csv
│       ├── payment-cards.csv
│       └── test-scenarios.csv
├── fixtures/                   # Test data fixtures
│   ├── TestDataFixtures.ts    # Data access layer
│   └── index.ts
├── logs/                       # Test execution logs
├── pages/                      # Page Object Models
│   ├── BasePage.ts            # Base page with common methods
│   ├── HomePage.ts
│   ├── LoginPage.ts
│   ├── CartPage.ts
│   ├── CheckoutPage.ts
│   ├── ErrorPage.ts
│   └── components/            # Reusable page components
│       └── HeaderComponent.ts
├── playwright-report/          # HTML test reports
├── test-results/              # Test execution results
├── tests/                     # Test specifications
│   ├── base/
│   │   └── BaseTest.ts       # Custom test fixtures
│   └── order.spec.ts         # Test suites
├── types/                     # TypeScript type definitions
│   └── test-data.types.ts
├── utils/                     # Utility functions
│   ├── ActionHelpers.ts      # Common page actions
│   ├── AssertionHelpers.ts   # Custom assertions
│   ├── CSVOperations.ts      # CSV file operations
│   ├── Logger.ts             # Custom logging utility
│   ├── WaitHelpers.ts        # Wait utilities
│   └── index.ts
├── .env                       # Environment variables
├── .env.example              # Environment template
├── .eslintrc.js              # ESLint configuration
├── .prettierrc.json          # Prettier configuration
├── playwright.config.ts       # Playwright configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Dependencies and scripts
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

## 🎯 Running Tests

### Run all tests
```bash
npm test
```

### Run tests in headed mode (see browser)
```bash
npm run test:headed
```

### Run tests in debug mode
```bash
npm run test:debug
```

### Run tests with UI mode
```bash
npm run test:ui
```

### Run tests on specific browser
```bash
npm run test:chrome
npm run test:firefox
npm run test:webkit
```

### Run specific test tags
```bash
npm run test:smoke
npm run test:regression
```

### Run tests in parallel
```bash
npm run test:parallel
```

### Run tests serially
```bash
npm run test:serial
```

## 📊 Reports

### View HTML report
```bash
npm run test:report
```

### View trace
```bash
npm run test:trace
```

Reports are generated in `playwright-report/` directory.

## 🧪 Writing Tests

### Basic Test Structure

```typescript
import { test, expect } from './base/BaseTest';
import { TestDataFixtures } from '../fixtures';

test.describe('Feature Name', () => {
    test.beforeAll(async () => {
        // Setup before all tests
    });

    test.beforeEach(async ({ homePage }) => {
        // Setup before each test
        await homePage.navigateToHome();
    });

    test('should perform action', async ({ homePage, cartPage }) => {
        // Test steps
        await homePage.addFirstProductToCart();
        await homePage.header.clickCart();
        
        // Assertions
        expect(await cartPage.isPageLoaded()).toBeTruthy();
    });

    test.afterEach(async ({ page }, testInfo) => {
        // Cleanup after each test
    });
});
```

### Using Test Data Fixtures

```typescript
import { TestDataFixtures } from '../fixtures';

const user = TestDataFixtures.getValidUser();
const card = TestDataFixtures.getValidCard();

await loginPage.login(user.email, user.password);
await checkoutPage.completeCheckout(
    card.number,
    card.holderName,
    card.expiry,
    card.cvv
);
```

### Using Helper Utilities

```typescript
import { WaitHelpers, ActionHelpers, AssertionHelpers } from '../utils';

// Wait helpers
await WaitHelpers.waitForVisible(locator);
await WaitHelpers.waitForUrlContains(page, '/cart');

// Action helpers
await ActionHelpers.click(button, { retries: 3 });
await ActionHelpers.fill(input, 'value', { validate: true });

// Assertion helpers
await AssertionHelpers.assertElementInteractive(button);
await AssertionHelpers.assertPriceFormat('$99.99');
```

## 🏗️ Page Object Model

### Creating a New Page Object

```typescript
import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { HeaderComponent } from './components/HeaderComponent';
import { EnvironmentConfig } from '../config/environment.config';

export class NewPage extends BasePage {
    readonly header: HeaderComponent;
    
    private readonly elementLocator: Locator;

    constructor(page: Page) {
        super(page);
        this.header = new HeaderComponent(page);
        this.elementLocator = page.locator('#element-id');
    }

    async navigateToPage(): Promise<void> {
        await this.goto(EnvironmentConfig.URLS.NEW_PAGE);
    }

    async performAction(): Promise<void> {
        await this.elementLocator.click();
    }
}
```

### Adding to Base Test Fixtures

```typescript
// In tests/base/BaseTest.ts
type PageObjects = {
    // ... existing pages
    newPage: NewPage;
};

export const test = base.extend<PageObjects>({
    // ... existing fixtures
    newPage: async ({ page }, use) => {
        const newPage = new NewPage(page);
        await use(newPage);
    },
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
HEADLESS=false
SLOW_MO=0

# Logging
LOG_LEVEL=info
```

### Playwright Configuration

Edit `playwright.config.ts` to customize:
- Test directory
- Timeouts
- Retries
- Parallel execution
- Browser projects
- Reporting

## 📝 Logging

The framework includes a custom logger that writes to both console and file:

```typescript
import { Logger } from '../utils/Logger';

Logger.info('Information message');
Logger.debug('Debug message');
Logger.warn('Warning message');
Logger.error('Error message');
Logger.success('Success message');
Logger.step(1, 'Step description');
```

Logs are saved in `logs/` directory with timestamps.

## 🧹 Code Quality

### Run linter
```bash
npm run lint
```

### Fix linting issues
```bash
npm run lint:fix
```

### Format code
```bash
npm run format
```

### Check formatting
```bash
npm run format:check
```

### Type checking
```bash
npm run type-check
```

## 🔄 CI/CD

The framework includes GitHub Actions workflow for continuous integration:

- Runs on push and pull requests
- Executes tests on multiple browsers
- Generates and uploads test reports
- Archives test results

Workflow file: `.github/workflows/playwright.yml`

## 📚 Best Practices

1. **Keep tests independent** - Each test should be able to run standalone
2. **Use meaningful test names** - Describe what the test does
3. **Follow AAA pattern** - Arrange, Act, Assert
4. **Use page objects** - Don't put selectors in tests
5. **Avoid hard waits** - Use built-in waiting mechanisms
6. **Keep tests focused** - One test should verify one thing
7. **Use test data fixtures** - Centralize test data management
8. **Log important steps** - Use Logger for better debugging
9. **Handle cleanup** - Use afterEach/afterAll hooks
10. **Keep selectors resilient** - Use data-testid or role-based selectors

## 🐛 Debugging

### Debug mode
```bash
npm run test:debug
```

### UI mode
```bash
npm run test:ui
```

### Playwright Inspector
Automatically opens when using `--debug` flag.

### VS Code Debugging
Use the built-in debugger with breakpoints in tests.

## 📖 Documentation

- [Playwright Documentation](https://playwright.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Page Object Model Pattern](https://playwright.dev/docs/pom)

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## 📄 License

ISC

## 👥 Support

For issues and questions, please create an issue in the repository.
