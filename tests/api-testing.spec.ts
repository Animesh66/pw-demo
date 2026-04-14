import { test, expect } from '@playwright/test';

test.describe('API Testing scenarios', () => {

  test('should retrieve all products', async ({ request }) => {
    const response = await request.get('http://localhost:3000/api/products');

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
    
    const responseBody = await response.json();
    console.log('Products Response:', responseBody);
    
    // Verify there are exactly 40 products
    expect(responseBody).toHaveLength(40);
  });

  test('should retrieve a product by id', async ({ request }) => {
    const productId = '69c25db1a6946c94730b9026';
    const response = await request.get(`http://localhost:3000/api/products/${productId}`);

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
    
    const responseBody = await response.json();
    console.log('Product Response:', responseBody);
    
    // Verify the product name is Premium Wireless Headphones
    expect(responseBody).toHaveProperty('name');
    expect(responseBody.name).toBe('Premium Wireless Headphones');
  });

  test('should login with existing user credentials', async ({ request }) => {
    const loginPayload = {
      email: 'test.user@email.com',
      password: 'test1234'
    };

    const response = await request.post('http://localhost:3000/api/auth/login', {
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
    expect(responseBody.token.length).toBeGreaterThan(0);
    expect(responseBody).toHaveProperty('email');
    expect(responseBody.email).toBe(loginPayload.email);
  });
  
  test('should register a new user', async ({ request }) => {
    const registerPayload = {
      email: 'testuser@email.com',
      password: 'test1234',
      name: 'Test User',
      gender: 'Male',
      dateOfBirth: '1990-01-15'
    };

    const response = await request.post('http://localhost:3000/api/auth/register', {
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
    expect(responseBody).toHaveProperty('message');
    expect(responseBody.message).toBe('User registered successfully');
  });

  test('should retrieve orders with valid authorization token', async ({ request }) => {
    // First, login to get the authorization token
    const loginPayload = {
      email: 'test.user@email.com',
      password: 'test1234'
    };

    const loginResponse = await request.post('http://localhost:3000/api/auth/login', {
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
    const ordersResponse = await request.get(`http://localhost:3000/api/orders?userId=${userId}`, {
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

