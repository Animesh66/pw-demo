import { test, expect } from '@playwright/test';

test.describe('API PATCH Request scenarios', () => {
  let orderId: string;
  let authToken: string;

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
    authToken = loginData.token;
    
    // Create a new order
    const orderPayload = {
      items: [
        {
          productId: '69c8ba0fb7dcc4fc6c590571',
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
    console.log('Order Creation Response:', orderData);
    orderId = orderData.order._id;
    console.log('Created Order ID:', orderId);
  });

  test('should cancel an order', async ({ request }) => {
    const response = await request.patch(`http://localhost:3000/api/orders/${orderId}/cancel`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    const responseBody = await response.json();
    console.log('Cancel Order Response:', responseBody);
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
    // Verify response structure
    expect(responseBody).toHaveProperty('message');
    expect(responseBody.message).toBe('Order cancelled successfully');
    expect(responseBody).toHaveProperty('order');
    expect(responseBody.order).toHaveProperty('status');
    expect(responseBody.order.status).toBe('cancelled');
  });

});
