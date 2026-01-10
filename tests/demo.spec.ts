import {test, expect} from '@playwright/test';

test('this is my first test', async ({page}) => {
    await page.goto('http://localhost:5173/home');
    await expect(page).toHaveTitle('learnwithanimesh');
    await page.locator('//input[@id="firstname"]').fill('Animesh');
    await page.getByRole('button', { name: 'Single Click Me' }).click();
    await page.getByText('Register Now').click();
    await page.getByPlaceholder('Type Text').fill('Animesh');
    await page.getByTestId('firstname').fill('Animesh');
    await page.getByRole('button', {name: 'Home'}).nth(1).click();
    console.log(await page.locator('.nav-links li').allTextContents());
    const navLinks = page.locator('.nav-links li')
    for (let element of await navLinks.elementHandles()) {
        console.log(await element.textContent());
    }
})