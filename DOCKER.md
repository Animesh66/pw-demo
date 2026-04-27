# Docker Setup for Playwright Tests with Demo Application

This document explains how to run the Playwright test framework using Docker with the full demo application stack (MongoDB, Backend API, Frontend).

## Architecture

The Docker Compose setup includes:
- **MongoDB**: Database for the demo application (port 27017)
- **Backend**: Express API server (port 3000)
- **Frontend**: React application (port 5173)
- **Playwright Tests**: Test automation framework

All services are connected via a Docker network and include health checks to ensure proper startup order.

## Prerequisites

- Docker installed on your machine
- Docker Compose installed (usually comes with Docker Desktop)
- Git (for cloning the demo application)

## Quick Start

### 1. Setup Demo Application

First, clone and setup the demo application repository:

```bash
# On Linux/macOS
npm run setup:demo-app

# Or manually:
git clone https://github.com/Animesh66/demo-front-end.git demo-app
cp Dockerfile.backend demo-app/Dockerfile.backend
cp Dockerfile.frontend demo-app/Dockerfile.frontend
```

### 2. Start All Services

```bash
# Start MongoDB, Backend, and Frontend
npm run docker:up

# Wait for services to be ready (about 30 seconds)
# Check service status
docker-compose ps
```

### 3. Run Tests

```bash
# Run all tests using Docker
npm run docker:test

# Or run tests locally against Docker services
npm run test:local-with-app

# Run smoke tests
npm run docker:test:smoke

# Run regression tests
npm run docker:test:regression
```

### 4. Complete Workflow (One Command)

```bash
# Setup app, start services, and run tests
npm run test:with-app
```

## Docker Compose Commands

### Start Services

```bash
# Start only the application stack (MongoDB, Backend, Frontend)
docker-compose up -d mongodb backend frontend

# Start all services including tests
docker-compose up

# Start with specific profile (smoke/regression)
docker-compose --profile smoke up
```

### Stop Services

```bash
# Stop all services
npm run docker:down

# Stop and remove volumes (clean database)
docker-compose down -v
```

### View Logs

```bash
# View all logs
npm run docker:logs

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb
```

### Rebuild Services

```bash
# Rebuild all images
npm run docker:rebuild

# Rebuild specific service
docker-compose build backend
docker-compose build frontend
```

## Service URLs

When services are running:

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **MongoDB**: mongodb://localhost:27017/demo-app

## Health Checks

Each service includes health checks:

- **MongoDB**: Checks database ping response
- **Backend**: Checks `/api/products` endpoint
- **Frontend**: Checks if the Vite dev server is responding

Tests only start after all services report healthy status.

## Volume Mounts

Test results are persisted to the host machine:

- `./test-results` - Test execution results
- `./playwright-report` - HTML test reports
- `./allure-results` - Allure test results
- `./logs` - Test execution logs

Database data is stored in a Docker volume: `mongodb-data`

## Environment Variables

The following environment variables can be customized:

### Backend
```bash
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://mongodb:27017/demo-app
JWT_SECRET=your-secret-key-here
```

### Frontend
```bash
VITE_API_URL=http://backend:3000
```

### Tests
```bash
BASE_URL=http://frontend:5173
CI=true
NODE_ENV=ci
```

## Troubleshooting

### Services not starting

```bash
# Check service status
docker-compose ps

# View logs for errors
docker-compose logs

# Restart specific service
docker-compose restart backend
```

### Tests failing to connect

```bash
# Verify all services are healthy
docker-compose ps

# Check if ports are accessible
curl http://localhost:3000/api/products
curl http://localhost:5173

# Restart the network
docker-compose down
docker-compose up -d mongodb backend frontend
```

### Clean start

```bash
# Remove everything and start fresh
npm run docker:clean
npm run setup:demo-app
npm run docker:up
```

### Port conflicts

If ports 3000, 5173, or 27017 are already in use:

1. Stop the conflicting service
2. Or modify ports in `docker-compose.yml`

## Advanced Usage

### Run specific browser tests in Docker

```bash
docker-compose run --rm playwright-tests npx playwright test --project=chromium
docker-compose run --rm playwright-tests npx playwright test --project=firefox
```

### Run specific test file

```bash
docker-compose run --rm playwright-tests npm run test:order-happy-path
```

### Interactive debugging

```bash
# Run tests locally with UI mode
npm run docker:up
npm run test:ui
```

### Custom test commands

```bash
# Run with headed browser
docker-compose run --rm playwright-tests npm run test:headed

# Run with debug mode
docker-compose run --rm playwright-tests npm run test:debug
```

## CI/CD Integration

The GitHub Actions workflow automatically:

1. Clones the demo application
2. Starts all services with Docker Compose
3. Waits for services to be healthy
4. Runs tests across multiple browsers
5. Publishes test reports and artifacts

See `.github/workflows/playwright.yml` for details.

## Performance Tips

1. **Faster rebuilds**: Use Docker layer caching
2. **Parallel tests**: Already configured in Playwright config
3. **Reuse services**: Keep services running between test runs with `docker:up`
4. **Clean periodically**: Run `npm run docker:clean` to free disk space

## Cleanup

```bash
# Stop services and remove containers
npm run docker:down

# Remove all containers, volumes, and images
npm run docker:clean

# Remove demo-app directory
rm -rf demo-app
```
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
