import { test, expect } from '@playwright/test';

test.describe('API Testing scenarios', () => {
  
  const baseURL = 'http://localhost:3000';
  
  test('should register a new user', async ({ request }) => {
    // Generate dynamic data for unique user registration
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 10000);
    
    const registerPayload = {
      email: `testuser${timestamp}${randomNum}@email.com`,
      password: `test${randomNum}1234`,
      name: `Test User ${randomNum}`,
      gender: Math.random() > 0.5 ? 'Male' : 'Female',
      dateOfBirth: `${1980 + Math.floor(Math.random() * 30)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`
    };

    const response = await request.post(`${baseURL}/api/auth/register`, {
      data: registerPayload,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(201);
    
    const responseBody = await response.json();
    console.log('Register Response:', responseBody);
    
    // Verify response contains expected fields
    expect(responseBody).toHaveProperty('email', registerPayload.email);
  });

  test('should login with existing user credentials', async ({ request }) => {
    const loginPayload = {
      email: 'test.user@email.com',
      password: 'test1234'
    };

    const response = await request.post(`${baseURL}/api/auth/login`, {
      data: loginPayload,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
    
    const responseBody = await response.json();
    console.log('Login Response:', responseBody);
    
    // Verify response contains authentication token
    expect(responseBody).toHaveProperty('token');
    expect(typeof responseBody.token).toBe('string');
    expect(responseBody.token.length).toBeGreaterThan(0);
  });

  test('should retrieve all products', async ({ request }) => {
    const response = await request.get(`${baseURL}/api/products`);

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
    
    const responseBody = await response.json();
    console.log('Products Response:', responseBody);
  });

  test('should retrieve orders with valid authorization token', async ({ request }) => {
    // First, login to get the authorization token
    const loginPayload = {
      email: 'test.user@email.com',
      password: 'test1234'
    };

    const loginResponse = await request.post(`${baseURL}/api/auth/login`, {
      data: loginPayload,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    expect(loginResponse.ok()).toBeTruthy();
    const loginData = await loginResponse.json();
    console.log('Login Response for Orders:', loginData);
    
    const authToken = loginData.token;
    expect(authToken).toBeDefined();

    // Use the token to retrieve orders
    const userId = '69c27617cc4f875e98000730';
    const ordersResponse = await request.get(`${baseURL}/api/orders?userId=${userId}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    expect(ordersResponse.ok()).toBeTruthy();
    expect(ordersResponse.status()).toBe(200);
    
    const ordersData = await ordersResponse.json();
    console.log('Orders Response:', ordersData);
  });

});

