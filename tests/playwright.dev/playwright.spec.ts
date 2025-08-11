import { test, expect } from "@playwright/test";

test(
  "QD-005 should have Docs page",
  { tag: "@playwright" },
  async ({ page }) => {
    await page.goto("https://playwright.dev/");

    await page.getByRole("link", { name: "Docs" }).click();

    await expect(page).toHaveURL("https://playwright.dev/docs/intro");
    await expect(
      page.getByRole("heading", { name: "Installation" })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Installing Playwright" })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Running the Example Test in" })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "HTML Test Reports" })
    ).toBeVisible();
  }
);

test(
  "QD-006 should switch documentation to Java Language",
  { tag: "@playwright" },
  async ({ page }) => {
    await page.goto("https://playwright.dev/");

    await page.getByRole("button", { name: "Node.js" }).click();
    await page
      .getByLabel("Main", { exact: true })
      .getByRole("link", { name: "Java" })
      .click();
    await page.getByRole("link", { name: "Docs" }).click();

    await expect(page).toHaveURL("https://playwright.dev/java/docs/intro");
    await expect(page.getByRole("link", { name: "Maven" })).toBeVisible();
  }
);

test(
  "QD-007 should open GitHub repo",
  { tag: "@playwright" },
  async ({ page }) => {
    await page.goto("https://playwright.dev/");

    const newTabPromise = page.waitForEvent("popup");
    await page.getByRole("link", { name: "GitHub repository" }).click();
    const page1 = await newTabPromise;

    await expect(page1).toHaveURL("https://github.com/microsoft/playwright");
    await expect(page1).toHaveTitle(
      "GitHub - microsoft/playwright: Playwright is a framework for Web Testing and Automation. It allows testing Chromium, Firefox and WebKit with a single API."
    );
  }
);

test(
  "QD-008 should search documentation by method name",
  { tag: "@playwright" },
  async ({ page }) => {
    await page.goto("https://playwright.dev/");

    await page.getByRole("button", { name: "Search (Command+K)" }).click();
    await page.getByRole("searchbox", { name: "Search" }).fill("getByRole");

    await page.getByRole("link", { name: "getByRole FrameLocator" }).click();

    await expect(
      page.getByRole("heading", { name: "getByRole" })
    ).toBeVisible();
  }
);
