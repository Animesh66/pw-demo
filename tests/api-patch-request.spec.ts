import { test, expect } from '@playwright/test';

test.describe('API PATCH Request scenarios', () => {

  test('should cancel an order', async ({ request }) => {
    const orderId = '69c27617cc4f875e98000730';
    const response = await request.patch(`http://localhost:3000/api/orders/${orderId}/cancel`);

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
    
    const responseBody = await response.json();
    console.log('Cancel Order Response:', responseBody);
    
    // Verify response structure
    expect(responseBody).toHaveProperty('success');
    expect(responseBody.success).toBe(true);
    expect(responseBody).toHaveProperty('message');
  });

});
