import { test, expect } from '@playwright/test';


  test('Perform actions in Playwright', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/learnwithanimesh/);
    // Perform double click
    await page.getByText('Double Click Me').dblclick();
    // Perform right click
    await page.getByText('Right Click Me').click({ button: 'right' });
    // Perform force click
    await page.getByText('Force Click Me').click({force: true});
    // Press sequentially
    await page.getByPlaceholder('First Name').first().pressSequentially('Animesh', { delay: 100 });
    // Perform checkbox check
    await page.locator('#term-checkbox').check();
    // Select dropdown option
    await page.locator('#select-dropdown').selectOption('Option 2');
    // Perform drag and drop
    const source = page.locator('#draggable');
    const target = page.locator('#drop-zone');
    await source.dragTo(target);
    // upload file
    const filePath = './sample_file/adobe-express-qr-code.png';
    await page.locator('#file-upload').setInputFiles(filePath); 
    // Press a key
    // await page.getByPlaceholder('First Name').first().press('A');
    await page.getByPlaceholder('First Name').first().press('Tab');
  });
