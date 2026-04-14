import { test, expect } from '@playwright/test';

test.describe('API POST Request scenarios', () => {

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

});
