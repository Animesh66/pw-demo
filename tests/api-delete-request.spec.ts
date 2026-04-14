import { test, expect } from '@playwright/test';

test.describe('API DELETE Request scenarios', () => {

  test('should delete a product by id', async ({ request }) => {
    const productId = '69c25db1a6946c94730b9029';
    const response = await request.delete(`http://localhost:3000/api/products/${productId}`);

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
    
    const responseBody = await response.json();
    console.log('Delete Product Response:', responseBody);
    
    // Verify response structure
    expect(responseBody).toHaveProperty('success');
    expect(responseBody.success).toBe(true);
    expect(responseBody).toHaveProperty('message');
    expect(responseBody.message).toBe('Product ID 69c25db1a6946c94730b9029 deleted successfully');
  });

});
