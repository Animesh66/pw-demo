@echo off
REM Script to clone and setup the demo application for testing
REM This script prepares the demo-front-end application to be used with Docker

echo.
echo Setting up Demo Application for Testing...
echo.

REM Check if demo-app directory exists
if exist demo-app (
    echo WARNING: demo-app directory already exists
    set /p REPLY="Do you want to remove it and clone fresh? (y/n): "
    if /i "%REPLY%"=="y" (
        echo Removing existing demo-app directory...
        rmdir /s /q demo-app
    ) else (
        echo Using existing demo-app directory
        exit /b 0
    )
)

REM Clone the repository
echo Cloning demo-front-end repository...
git clone https://github.com/Animesh66/demo-front-end.git demo-app

if %errorlevel% neq 0 (
    echo Failed to clone repository
    exit /b 1
)

echo Repository cloned successfully
echo.

REM Copy Dockerfiles to demo-app directory
echo Copying Dockerfiles...
copy Dockerfile.backend demo-app\Dockerfile.backend
copy Dockerfile.frontend demo-app\Dockerfile.frontend

if %errorlevel% equ 0 (
    echo Dockerfiles copied successfully
) else (
    echo Failed to copy Dockerfiles
    exit /b 1
)

echo.
echo Demo application setup complete!
echo.
echo Next steps:
echo   1. Run 'npm run docker:up' to start all services (MongoDB, Backend, Frontend)
echo   2. Run 'npm run docker:test' to run tests against the application
echo   3. Or use 'npm run test:with-app' to do both in one command
echo.
