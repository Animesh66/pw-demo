#!/bin/bash

# Script to clone and setup the demo application for testing
# This script prepares the demo-front-end application to be used with Docker

echo "🚀 Setting up Demo Application for Testing..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if demo-app directory exists
if [ -d "demo-app" ]; then
    echo -e "${YELLOW}⚠️  demo-app directory already exists${NC}"
    read -p "Do you want to remove it and clone fresh? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${BLUE}🗑️  Removing existing demo-app directory...${NC}"
        rm -rf demo-app
    else
        echo -e "${GREEN}✅ Using existing demo-app directory${NC}"
        exit 0
    fi
fi

# Clone the repository
echo -e "${BLUE}📥 Cloning demo-front-end repository...${NC}"
git clone https://github.com/Animesh66/demo-front-end.git demo-app

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to clone repository${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Repository cloned successfully${NC}"
echo ""

# Copy Dockerfiles to demo-app directory
echo -e "${BLUE}📋 Copying Dockerfiles...${NC}"
cp Dockerfile.backend demo-app/Dockerfile.backend
cp Dockerfile.frontend demo-app/Dockerfile.frontend

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Dockerfiles copied successfully${NC}"
else
    echo -e "${RED}❌ Failed to copy Dockerfiles${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}✨ Demo application setup complete!${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "  1. Run 'npm run docker:up' to start all services (MongoDB, Backend, Frontend)"
echo "  2. Run 'npm run docker:test' to run tests against the application"
echo "  3. Or use 'npm run test:with-app' to do both in one command"
echo ""
