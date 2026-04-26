# Use official Playwright image with Node.js
FROM mcr.microsoft.com/playwright:v1.57.0-noble

# Set working directory
WORKDIR /app

# Set environment variables
ENV NODE_ENV=ci
ENV CI=true
ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm ci --only=production=false

# Copy application code
COPY . .

# Run type checking
RUN npm run type-check

# Create necessary directories
RUN mkdir -p test-results playwright-report logs allure-results

# Set default command
CMD ["npm", "run", "ci:test"]
