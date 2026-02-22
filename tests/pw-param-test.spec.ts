import { test, expect } from '@playwright/test';
import { testData } from '../data/data';


  test('This is a non parameterized test', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await expect(page).toHaveTitle(/learnwithanimesh/);
    await expect(page).toHaveURL(/.*\/home/);
    await page.getByTestId('firstname').fill('test2');
    await page.getByTestId('lastname').fill('test3');
    await page.getByTestId('email').fill('test123@email.com');
    await page.locator('#phoneNumber').fill('1234567890');
    await page.getByPlaceholder('Password').fill('Welcome1');
    await page.locator('#confirm-password').fill('Welcome1');
    await page.locator('#term-checkbox').check();
    await page.getByRole('button', { name: 'Register Now' }).click();
    await page.getByText(/Registration Successful/).waitFor();
    // await page.close();
  });

  // Parameterized test
  testData.forEach((data, index) => {
    test(`This is a parameterized test - Dataset ${index + 1}: ${data.firstname} ${data.lastname}`, async ({ page }) => {
      await page.goto('http://localhost:5173/');
      await expect(page).toHaveTitle(/learnwithanimesh/);
      await expect(page).toHaveURL(/.*\/home/);
      await page.getByTestId('firstname').fill(data.firstname);
      await page.getByTestId('lastname').fill(data.lastname);
      await page.getByTestId('email').fill(data.email);
      await page.locator('#phoneNumber').fill(data.phoneNumber);
      await page.getByPlaceholder('Password').fill(data.password);
      await page.locator('#confirm-password').fill(data.confirmPassword);
      await page.locator('#term-checkbox').check();
      await page.getByRole('button', { name: 'Register Now' }).click();
      await page.getByText(/Registration Successful/).waitFor();
    });
  });
