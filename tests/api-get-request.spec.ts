import { test, expect } from '@playwright/test';

test.describe('API GET Request scenarios', () => {

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

});
