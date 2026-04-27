@echo off
REM Script to run tests with demo application and ensure cleanup
REM This script ensures Docker services are stopped after tests complete

setlocal enabledelayedexpansion

echo.
echo [92m🚀 Starting test execution with demo application...[0m
echo.

REM Step 1: Setup demo application
echo [93m📦 Step 1/4: Setting up demo application...[0m
call npm run setup:demo-app
if errorlevel 1 (
    echo [91mFailed to setup demo application[0m
    goto :cleanup
)
echo.

REM Step 2: Start Docker services
echo [93m🐳 Step 2/4: Starting Docker services (MongoDB, Backend, Frontend)...[0m
docker-compose up -d mongodb backend frontend
if errorlevel 1 (
    echo [91mFailed to start Docker services[0m
    goto :cleanup
)
echo.

REM Step 3: Wait for services to be healthy
echo [93m⏳ Step 3/4: Waiting for services to be ready...[0m
timeout /t 30 /nobreak >nul
echo.

REM Verify services are healthy
echo Checking service health...
curl -f http://localhost:3000/api/products >nul 2>&1
if errorlevel 1 (
    echo [91m✗ Backend is not responding[0m
    docker-compose logs backend
    goto :cleanup
)
echo [92m✓ Backend is healthy[0m

curl -f http://localhost:5173 >nul 2>&1
if errorlevel 1 (
    echo [91m✗ Frontend is not responding[0m
    docker-compose logs frontend
    goto :cleanup
)
echo [92m✓ Frontend is healthy[0m

echo [92m✓ All services are healthy[0m
echo.

REM Step 4: Run tests
echo [93m🧪 Step 4/4: Running Playwright tests...[0m
echo.

if "%1"=="docker" (
    echo Running tests in Docker container...
    docker-compose up --abort-on-container-exit --exit-code-from playwright-tests playwright-tests
) else if "%1"=="smoke" (
    echo Running smoke tests locally...
    set BASE_URL=http://localhost:5173
    call npm run test:smoke
) else if "%1"=="regression" (
    echo Running regression tests locally...
    set BASE_URL=http://localhost:5173
    call npm run test:regression
) else (
    echo Running all tests locally...
    set BASE_URL=http://localhost:5173
    call npm test
)

set TEST_EXIT_CODE=%errorlevel%

REM Cleanup
:cleanup
echo.
echo [93m🧹 Cleaning up Docker services...[0m
docker-compose down

if %TEST_EXIT_CODE%==0 (
    echo [92m✅ Tests completed successfully and services stopped[0m
    exit /b 0
) else (
    echo [91m❌ Tests failed but services were stopped[0m
    exit /b %TEST_EXIT_CODE%
)
