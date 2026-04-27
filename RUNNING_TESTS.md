# Running Tests with Demo Application

This guide explains how to run Playwright tests against the demo e-commerce application with backend and frontend services.

## Overview

The test framework now includes Docker Compose configuration to automatically spin up:
- **MongoDB** (Database)
- **Backend API** (Express + TypeScript)
- **Frontend** (React + Vite)
- **Playwright Tests**

## Prerequisites

- Docker and Docker Compose installed
- Node.js 20+ (for local test execution)
- Git

## Quick Start

### Option 1: Complete Automated Setup (Recommended)

Run everything with a single command:

```bash
npm run test:with-app
```

This will:
1. Clone the demo application repository
2. Start MongoDB, Backend, and Frontend services
3. Wait for services to be healthy
4. Run all Playwright tests
5. Generate test reports

### Option 2: Step-by-Step Setup

#### Step 1: Clone Demo Application

```bash
npm run setup:demo-app
```

Or manually:
```bash
git clone https://github.com/Animesh66/demo-front-end.git demo-app
cp Dockerfile.backend demo-app/
cp Dockerfile.frontend demo-app/
```

#### Step 2: Start Application Services

```bash
npm run docker:up
```

This starts:
- MongoDB on port 27017
- Backend API on port 3000
- Frontend on port 5173

Wait about 30 seconds for services to be ready.

#### Step 3: Run Tests

**Option A: Tests in Docker**
```bash
npm run docker:test
```

**Option B: Tests locally (faster, better for debugging)**
```bash
npm test
```

Or run specific test suites:
```bash
npm run test:order                    # All order tests
npm run test:registration             # All registration tests
npm run test:order-happy-path        # Happy path order tests
npm run test:chrome                  # Tests in Chrome only
```

#### Step 4: View Results

```bash
npm run test:report   # Open HTML report
```

## Running Tests Locally Against Docker Services

For faster test execution and easier debugging:

```bash
# 1. Start services
npm run docker:up

# 2. Wait 30 seconds, then run tests locally
npm run test:local-with-app

# Or run specific tests
npm test tests/order-test/
npm run test:headed   # With browser UI
npm run test:debug    # With debugger
npm run test:ui       # With Playwright UI mode
```

## Service URLs

When services are running:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000/api
- MongoDB: mongodb://localhost:27017/demo-app

You can manually test the application by opening http://localhost:5173 in your browser.

## Common Commands

### Docker Management

```bash
npm run docker:up              # Start services
npm run docker:down            # Stop services
npm run docker:logs            # View logs
npm run docker:clean           # Clean up everything
npm run docker:rebuild         # Rebuild from scratch
```

### Test Execution

```bash
npm run docker:test            # Run all tests in Docker
npm run docker:test:smoke      # Run smoke tests
npm run docker:test:regression # Run regression tests
npm test                       # Run tests locally
npm run test:headed            # Run with browser UI
npm run test:debug             # Run with debugger
```

### Reports

```bash
npm run test:report            # View HTML report
npm run test:with-allure       # Generate Allure report
npm run allure:serve           # View Allure report
```

## Troubleshooting

### Services not starting

```bash
# Check status
docker-compose ps

# View logs
docker-compose logs backend
docker-compose logs frontend
docker-compose logs mongodb

# Restart services
docker-compose restart backend
```

### Tests failing

1. **Verify services are healthy:**
```bash
curl http://localhost:3000/api/products  # Should return products
curl http://localhost:5173                # Should return HTML
```

2. **Check MongoDB:**
```bash
docker-compose logs mongodb
```

3. **Clean restart:**
```bash
npm run docker:clean
npm run setup:demo-app
npm run docker:up
```

### Port conflicts

If ports 3000, 5173, or 27017 are in use:
1. Stop the conflicting service
2. Or modify ports in `docker-compose.yml`

### Slow startup

First time startup takes longer because:
- Docker images need to be built
- npm dependencies are installed
- MongoDB initializes

Subsequent runs are much faster.

## Development Workflow

### Interactive Development

```bash
# Terminal 1: Start services
npm run docker:up

# Terminal 2: Run tests in UI mode
npm run test:ui

# Make changes to tests and see them update live
```

### Debugging Tests

```bash
# Start services
npm run docker:up

# Run with debugger
npm run test:debug

# Or run specific test with headed browser
npx playwright test tests/order-test/order-happy-path.spec.ts --headed
```

### Running Single Test

```bash
# Start services first
npm run docker:up

# Run single test file
npx playwright test tests/order-test/order-happy-path.spec.ts

# Run single test by title
npx playwright test -g "TC01 - Place order successfully"
```

## CI/CD Integration

The GitHub Actions workflow automatically:
1. Clones the demo application
2. Starts all services with Docker Compose
3. Waits for health checks
4. Runs tests in parallel across browsers
5. Publishes test reports as artifacts

See `.github/workflows/playwright.yml` for details.

## Project Structure

```
pw-demo/
├── demo-app/                    # Cloned demo application (not in git)
│   ├── client/                  # React frontend
│   ├── server/                  # Express backend
│   ├── Dockerfile.backend       # Copied from root
│   └── Dockerfile.frontend      # Copied from root
├── tests/                       # Playwright tests
├── pages/                       # Page Object Models
├── docker-compose.yml           # Multi-service orchestration
├── Dockerfile                   # Playwright test image
├── Dockerfile.backend           # Template for backend
├── Dockerfile.frontend          # Template for frontend
└── setup-demo-app.sh           # Setup script
```

## Cleanup

```bash
# Stop services
npm run docker:down

# Remove all Docker resources
npm run docker:clean

# Remove demo application
rm -rf demo-app
```

## Advanced Usage

### Run specific browser in Docker

```bash
docker-compose run --rm playwright-tests npx playwright test --project=chromium
```

### Override BASE_URL

```bash
BASE_URL=https://staging.example.com npm test
```

### Custom Docker network

```bash
# Run tests against external services
docker-compose run --rm -e BASE_URL=http://host.docker.internal:8080 playwright-tests
```

## Need Help?

- Check `DOCKER.md` for detailed Docker documentation
- See `README.md` for general framework documentation
- Review test examples in `tests/` directory
- Check logs: `docker-compose logs` or `./logs/` directory
