import { test, expect } from "@playwright/test";

const allowedDomains = ["demoqa.com", "jquery.com", "bootstrapcdn.com"];

const USER = {
  fullname: "John Dow",
  email: "qadojo@gmail.miu",
  currentAddress: "Abu Dhabi",
  permanentAddress: "UAE",
};

const toggleButton = (itemName: string) =>
  `//*[text()='${itemName}']/parent::label/preceding-sibling::button`;

const checkBox = (itemName: string) =>
  `//*[text()='${itemName}']/preceding-sibling::span[@class='rct-checkbox']`;

const radioButton = (option: string) => `//label[text() = '${option}']`;

test.beforeEach(async ({ page }) => {
  await page.route("**/*", (route) => {
    const url = route.request().url();
    if (allowedDomains.some((domain) => url.includes(domain))) {
      return route.continue();
    }
    return route.abort();
  });
});

test("QA-01 text box", { tag: ["@xpath"] }, async ({ page }) => {
  const nameInput = page.locator("//input[@placeholder='Full Name']");
  const emailInput = page.locator("//input[@placeholder='name@example.com']");
  const currentAddressInput = page.locator(
    "//textarea[@placeholder='Current Address']"
  );
  const permanentAddressInput = page.locator(
    "//textarea[@id='permanentAddress']"
  );
  const submitButtonInput = page.locator("//button[@id='submit']");

  await page.goto("https://demoqa.com/text-box");

  await nameInput.fill(USER.fullname);
  await emailInput.fill(USER.email);
  await currentAddressInput.fill(USER.currentAddress);
  await permanentAddressInput.fill(USER.permanentAddress);
  await submitButtonInput.click();

  for (const [key, value] of Object.entries(USER)) {
    console.log(`Checking ${key} value`);
    await expect(page.locator("//*[@id='output']")).toContainText(value);
  }
});

test("QA-02 check box", { tag: ["@xpath"] }, async ({ page }) => {
  await page.goto("https://demoqa.com/checkbox");

  await page.locator(toggleButton("Home")).click();
  await page.locator(toggleButton("Documents")).click();
  await page.locator(toggleButton("Office")).click();
  await page.locator(checkBox("Private")).click();

  await expect(page.locator("//*[@id='result']")).toContainText(
    "You have selected :private"
  );
});

test("QA-3 radio button", { tag: ["@xpath"] }, async ({ page }) => {
  const resultLocator = page.locator("//*[@id='app']//p");
  await page.goto("https://demoqa.com/radio-button");

  await page.locator(radioButton("Impressive")).click();
  await expect(resultLocator).toContainText("You have selected Impressive");

  await page.locator(radioButton("Yes")).click();
  await expect(resultLocator).toContainText("You have selected Yes");

  await expect(page.locator(radioButton("No"))).toBeDisabled();
});

test("QA-4 buttons", { tag: ["@xpath"] }, async ({ page }) => {
  const dblClickButton = page.locator("//button[text() = 'Double Click Me']");
  const dblClickMessage = page.locator("//*[@id='doubleClickMessage']");
  const rightClickButton = page.locator("//button[text() = 'Right Click Me']");
  const rightClickMessage = page.locator("//*[@id='rightClickMessage']");
  const clickMeButton = page.locator("//button[text() = 'Click Me']");
  const clickMeMessage = page.locator("//*[@id='dynamicClickMessage']");

  await page.goto("https://demoqa.com/buttons");

  await dblClickButton.dblclick();
  await expect(dblClickMessage).toContainText("You have done a double click");

  await rightClickButton.click({ button: "right" });
  await expect(rightClickMessage).toContainText("You have done a right click");

  await clickMeButton.click();
  await expect(clickMeMessage).toContainText("You have done a dynamic click");
});
