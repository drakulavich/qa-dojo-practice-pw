import { test, expect } from '@playwright/test';

const allowedDomains = [
  'demoqa.com',
  'jquery.com',
  'bootstrapcdn.com'
];

const USER = {
    fullname: 'John Dow',
    email: 'qadojo@gmail.miu',
    currentAddress: 'Abu Dhabi',
    permanentAddress: 'UAE',
}

const toggleButton = (itemName: string) => 
    `//*[text()='${itemName}']/parent::label/preceding-sibling::button`;

const checkBox = (itemName: string) => 
    `//*[text()='${itemName}']/preceding-sibling::span[@class='rct-checkbox']`;

const radioButton = (option: string) =>
    `//label[text() = '${option}']`;

test.beforeEach(async ({ page }) => {
  await page.route('**/*', route => {
    const url = route.request().url();
    if (allowedDomains.some(domain => url.includes(domain))) {
      return route.continue();
    }
    return route.abort();
  });
});

test('text box', async ({ page }) => {
  await page.goto('https://demoqa.com/text-box');

  await page.locator("//input[@placeholder='Full Name']").fill(USER.fullname);
  await page.locator("//input[@placeholder='name@example.com']").fill(USER.email);
  await page.locator("//textarea[@placeholder='Current Address']").fill(USER.currentAddress);
  await page.locator("//textarea[@id='permanentAddress']").fill(USER.permanentAddress);
  await page.locator("//button[@id='submit']").click();

  for (const [key, value] of Object.entries(USER)) {
    console.log(`Checking ${key} value`);
    await expect(page.locator("//div[@id='output']")).toContainText(value);
  };
});

test('check box', async ({ page }) => {
  await page.goto('https://demoqa.com/checkbox');

  await page.locator(toggleButton('Home')).click();
  await page.locator(toggleButton('Documents')).click();
  await page.locator(toggleButton('Office')).click();
  await page.locator(checkBox('Private')).click();

  await expect(page.locator("//*[@id='result']")).toContainText('You have selected :private');
});

test('radio button', async ({ page }) => {
  const resultLocator = page.locator("//*[@id='app']//p");
  await page.goto('https://demoqa.com/radio-button');

  await page.locator(radioButton('Impressive')).click();
  await expect(resultLocator).toContainText('You have selected Impressive');

  await page.locator(radioButton('Yes')).click();
  await expect(resultLocator).toContainText('You have selected Yes');

  await expect(page.locator(radioButton('No'))).toBeDisabled();
});

test('buttons', async ({ page }) => {
  await page.goto('https://demoqa.com/buttons');

  await page.locator("//button[text() = 'Double Click Me']").dblclick();
  await expect(page.locator("//*[@id='doubleClickMessage']")).toContainText('You have done a double click');

  await page.locator("//button[text() = 'Right Click Me']").click({ button: 'right' });
  await expect(page.locator("//*[@id='rightClickMessage']")).toContainText('You have done a right click');

  await page.locator("//button[text() = 'Click Me']").click();
  await expect(page.locator("//*[@id='dynamicClickMessage']")).toContainText('You have done a dynamic click');
});
