import {test, expect} from '@playwright/test';

test('this is my first test', async ({page}) => {
    await page.goto('http://localhost:5173/home');
    await expect(page).toHaveTitle('learnwithanimesh');
})