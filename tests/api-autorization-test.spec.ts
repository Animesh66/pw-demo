import { test, expect } from '@playwright/test';

test.describe('API Authorization scenarios', () => {

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
