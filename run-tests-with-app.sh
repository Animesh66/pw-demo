#!/bin/bash

# Script to run tests with demo application and ensure cleanup
# This script ensures Docker services are stopped after tests complete

set -e  # Exit on error

# Add Docker to PATH if not already available (macOS Docker Desktop)
if ! command -v docker &> /dev/null; then
    if [ -f "/Applications/Docker.app/Contents/Resources/bin/docker" ]; then
        export PATH="/Applications/Docker.app/Contents/Resources/bin:$PATH"
    fi
fi

# Use 'docker compose' (V2) if available, otherwise fall back to 'docker-compose' (V1)
if docker compose version &> /dev/null; then
    DOCKER_COMPOSE="docker compose"
elif command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE="docker-compose"
else
    echo -e "${RED}❌ Docker Compose is not available. Please install Docker Desktop.${NC}"
    exit 1
fi

# Color codes for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Cleanup function to stop Docker services
cleanup() {
    local exit_code=$?
    echo ""
    echo -e "${YELLOW}🧹 Cleaning up Docker services...${NC}"
    
    # Stop all services
    $DOCKER_COMPOSE down
    
    if [ $exit_code -eq 0 ]; then
        echo -e "${GREEN}✅ Tests completed successfully and services stopped${NC}"
    else
        echo -e "${RED}❌ Tests failed (exit code: $exit_code) but services were stopped${NC}"
    fi
    
    exit $exit_code
}

# Register cleanup function to run on script exit
trap cleanup EXIT INT TERM

echo -e "${GREEN}🚀 Starting test execution with demo application...${NC}"
echo ""

# Step 1: Setup demo application
echo -e "${YELLOW}📦 Step 1/4: Setting up demo application...${NC}"
npm run setup:demo-app
echo ""

# Step 2: Start Docker services
echo -e "${YELLOW}🐳 Step 2/4: Starting Docker services (MongoDB, Backend, Frontend)...${NC}"
$DOCKER_COMPOSE up -d mongodb backend frontend
echo ""

# Step 3: Wait for services to be healthy
echo -e "${YELLOW}⏳ Step 3/4: Waiting for services to be ready...${NC}"
sleep 30

# Verify services are healthy
echo "Checking service health..."
if curl -f http://localhost:3000/api/products > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Backend is healthy${NC}"
else
    echo -e "${RED}✗ Backend is not responding${NC}"
    $DOCKER_COMPOSE logs backend
    exit 1
fi

if curl -f http://localhost:5173 > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Frontend is healthy${NC}"
else
    echo -e "${RED}✗ Frontend is not responding${NC}"
    $DOCKER_COMPOSE logs frontend
    exit 1
fi

echo -e "${GREEN}✓ All services are healthy${NC}"
echo ""

# Step 4: Run tests
echo -e "${YELLOW}🧪 Step 4/4: Running Playwright tests...${NC}"
echo ""

# Run tests based on first argument
if [ "$1" == "docker" ]; then
    echo "Running tests in Docker container..."
    $DOCKER_COMPOSE up --abort-on-container-exit --exit-code-from playwright-tests playwright-tests
elif [ "$1" == "smoke" ]; then
    echo "Running smoke tests locally..."
    BASE_URL=http://localhost:5173 npm run test:smoke
elif [ "$1" == "regression" ]; then
    echo "Running regression tests locally..."
    BASE_URL=http://localhost:5173 npm run test:regression
else
    echo "Running all tests locally..."
    BASE_URL=http://localhost:5173 npm test
fi

# Note: cleanup() will be called automatically due to trap
