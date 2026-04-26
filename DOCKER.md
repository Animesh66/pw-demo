# Docker Setup for Playwright Tests

This document explains how to run the Playwright test framework using Docker.

## Prerequisites

- Docker installed on your machine
- Docker Compose installed (usually comes with Docker Desktop)

## Quick Start

### 1. Build the Docker Image

```bash
docker build -t pw-demo-tests:latest .
```

### 2. Run Tests Using Docker Compose

```bash
# Run all tests
docker-compose up playwright-tests

# Run smoke tests
docker-compose --profile smoke up playwright-smoke

# Run regression tests
docker-compose --profile regression up playwright-regression

# Clean up containers after run
docker-compose down
```

### 3. Run Tests Using Docker Directly

```bash
# Run all tests
docker run --rm \
  -v $(pwd)/test-results:/app/test-results \
  -v $(pwd)/playwright-report:/app/playwright-report \
  -v $(pwd)/allure-results:/app/allure-results \
  -v $(pwd)/logs:/app/logs \
  -e CI=true \
  pw-demo-tests:latest

# Run specific browser tests
docker run --rm \
  -v $(pwd)/test-results:/app/test-results \
  -v $(pwd)/playwright-report:/app/playwright-report \
  pw-demo-tests:latest \
  npx playwright test --project=chromium

# Run specific test suite
docker run --rm \
  -v $(pwd)/test-results:/app/test-results \
  pw-demo-tests:latest \
  npm run test:smoke
```

## NPM Scripts for Docker

```bash
# Build Docker image
npm run docker:build

# Run tests in Docker
npm run docker:test

# Run tests with specific browser
npm run docker:test:chromium
npm run docker:test:firefox
npm run docker:test:webkit

# Run test suites
npm run docker:test:smoke
npm run docker:test:regression

# Clean up Docker resources
npm run docker:clean
```

## Environment Variables

You can pass environment variables to the container:

```bash
docker run --rm \
  -e BASE_URL=https://your-app-url.com \
  -e NODE_ENV=production \
  -e CI=true \
  -v $(pwd)/test-results:/app/test-results \
  pw-demo-tests:latest
```

## Volume Mounts

The Docker setup mounts the following directories to persist test results:

- `/app/test-results` - Test execution results
- `/app/playwright-report` - HTML test reports
- `/app/allure-results` - Allure test results
- `/app/logs` - Test execution logs

## CI/CD Integration

The GitHub Actions workflow automatically:

1. Builds the Docker image
2. Runs tests in parallel across multiple browsers
3. Uploads test results and reports as artifacts
4. Publishes test reports

## Troubleshooting

### Permission Issues

If you encounter permission issues with mounted volumes:

```bash
docker run --rm \
  --user $(id -u):$(id -g) \
  -v $(pwd)/test-results:/app/test-results \
  pw-demo-tests:latest
```

### Viewing Logs

```bash
# Follow logs during test execution
docker-compose up playwright-tests --follow

# View logs from a specific container
docker logs playwright-test-runner
```

### Cleaning Up

```bash
# Remove all test artifacts
npm run clean

# Remove Docker image
docker rmi pw-demo-tests:latest

# Remove all Docker containers and images
docker-compose down --rmi all -v
```

## Benefits of Docker Setup

1. **Consistency**: Same environment across local and CI
2. **Isolation**: Tests run in isolated containers
3. **Portability**: Easy to run on any system with Docker
4. **No Local Dependencies**: No need to install Node.js or browsers locally
5. **Parallel Execution**: Easy to scale with multiple containers
6. **Version Control**: Docker image versions match your code versions
