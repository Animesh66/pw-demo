import { test, expect } from '@playwright/test';

test.describe('API PATCH Request scenarios', () => {
  let orderId: string;

  test.beforeEach(async ({ request }) => {
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
    const authToken = loginData.token;
    
    // Create a new order
    const orderPayload = {
      items: [
        {
          productId: '69c25db1a6946c94730b9026',
          quantity: 1,
          productName: 'Premium Wireless Headphones',
          productPrice: 299
        }
      ],
      total: 299,
      paymentMethod: 'VISA'
    };

    const orderResponse = await request.post('http://localhost:3000/api/orders', {
      data: orderPayload,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      }
    });

    expect(orderResponse.ok()).toBeTruthy();
    const orderData = await orderResponse.json();
    orderId = orderData.orderId || orderData._id || orderData.id;
    console.log('Created Order ID:', orderId);
  });

  test('should cancel an order', async ({ request }) => {
    const response = await request.patch(`http://localhost:3000/api/orders/${orderId}/cancel`);

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
    
    const responseBody = await response.json();
    console.log('Cancel Order Response:', responseBody);
    
    // Verify response structure
    expect(responseBody).toHaveProperty('success');
    expect(responseBody.success).toBe(true);
    expect(responseBody).toHaveProperty('message');
    expect(responseBody.message).toBe(`Order ID ${orderId} cancelled successfully`);
  });

});
