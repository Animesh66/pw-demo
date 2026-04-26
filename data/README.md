# Test Data

This folder contains all test data used by the automation framework.

## Structure

```
data/
└── csv/
    ├── users.csv           - User credentials for login tests
    ├── payment-cards.csv   - Payment card details for checkout tests
    └── test-scenarios.csv  - Test scenario configurations
```

## CSV Files

### users.csv
Contains user credentials for login testing.
- **Columns**: testName, email, password, description

### payment-cards.csv
Contains payment card details for checkout and payment testing.
- **Columns**: cardType, cardNumber, holderName, expiryDate, cvv, isValid, description

### test-scenarios.csv
Contains test scenario configurations for data-driven testing.
- **Columns**: testCaseId, testName, productIndex, cardType, expectedResult, description

## Usage

The CSV files are accessed through the `CSVOperations` utility class:

```typescript
import { CSVOperations } from '../utils';

// Read all rows from a CSV file
const users = CSVOperations.readCSV('users');

// Read specific row by index
const user = CSVOperations.readCSVRow('users', 0);

// Filter rows by column value
const validCards = CSVOperations.filterCSVByColumn('payment-cards', 'isValid', 'true');
```

## Adding New Data

1. Create a new CSV file in the `data/csv/` directory
2. Ensure the first row contains column headers
3. Add data rows following the CSV format
4. Access the data using `CSVOperations` utility methods
