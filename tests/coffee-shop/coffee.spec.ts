import { test, expect } from "@playwright/test";

test(
  "QD-001 should update checkout on coffee item click",
  { tag: "@coffee" },
  async ({ page }) => {
    await page.goto("https://coffee-cart.app/");

    await page.locator('[data-test="Espresso"]').click();

    await expect(page.locator('[data-test="checkout"]')).toContainText(
      "Total: $10.00"
    );
  }
);

test(
  "QD-002 should sum multiple items",
  { tag: "@coffee" },
  async ({ page }) => {
    await page.goto("https://coffee-cart.app/");

    await page.locator('[data-test="Espresso"]').click();
    await page.locator('[data-test="Cappuccino"]').click();

    await expect(page.locator('[data-test="checkout"]')).toContainText(
      "Total: $29.00"
    );
    await expect(page.getByLabel("Cart page")).toHaveText("cart (2)");
  }
);

test("QD-003 should order an item", { tag: "@coffee" }, async ({ page }) => {
  await page.goto("https://coffee-cart.app/");
  await page.locator('[data-test="Americano"]').click();
  await page.locator('[data-test="checkout"]').click();

  await page.getByRole("textbox", { name: "Name" }).fill("Anton");
  await page.getByRole("textbox", { name: "Email" }).fill("test@email.com");
  await page.getByRole("button", { name: "Submit" }).click();

  await expect(page.locator("#app")).toContainText(
    "Thanks for your purchase. Please check your email for payment."
  );
});

test(
  "QD-004 should have an error for invalid email",
  { tag: "@coffee" },
  async ({ page }) => {
    await page.goto("https://coffee-cart.app/");

    await page.locator('[data-test="Americano"]').click();
    await page.locator('[data-test="checkout"]').click();

    await page.getByRole("textbox", { name: "Name" }).fill("Anton");
    await page.getByRole("textbox", { name: "Email" }).fill("testcom");
    await page.getByRole("button", { name: "Submit" }).click();

    const validationMessage = await page
      .locator("#email")
      .evaluate((el) => el.validationMessage);
    expect(validationMessage).toContain(
      "Please include an '@' in the email address"
    );
  }
);
