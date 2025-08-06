import { test, expect } from "@playwright/test";

const USER = {
  email: "dra@kula.vich",
  name: "drakulavich",
  password: "12345"
};

test(
  "QD-011 login with correct user creds",
  { tag: "@auth" },
  async ({ page }) => {
    await page.goto("https://demo.learnwebdriverio.com/");

    await page.locator('a[href="/login"]').click();
    await page.locator('input[type="email"]').fill(USER.email);
    await page.locator('input[type="password"]').fill(USER.password);
    await page.locator('form button').click();

    await expect(page.locator("#app")).toContainText("drakulavich");
  }
);

test(
  "QD-012 login with incorrect creds",
  { tag: "@auth" },
  async ({ page }) => {
    await page.goto("https://demo.learnwebdriverio.com/");

    await page.locator('a[href="/login"]').click();
    await page.locator('input[type="email"]').fill(USER.email);
    await page.locator('input[type="password"]').fill(USER.password + 'something');
    await page.locator('form button').click();

    await expect(page.locator('.error-messages')).toContainText('email or password is invalid');
  }
);

test.describe("Logged user", async () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("https://demo.learnwebdriverio.com/");

    await page.locator('a[href="/login"]').click();
    await page.locator('input[type="email"]').fill(USER.email);
    await page.locator('input[type="password"]').fill(USER.password);
    await page.locator('form button').click();
  });

  test("QD-013 create new article", { tag: "@article" }, async ({ page }) => {
    const article = {
      title: "Test Article ayak 4",
      about: "about future",
      content: "My text here",
      tags: "pw, testing",
    };

    await page.locator('a[href="/editor"]').click();
    await page.locator('[data-qa-id="editor-title"]').fill(article.title);
    await page.locator('[data-qa-id="editor-description"]').fill(article.about);
    await page.locator('[data-qa-id="editor-body"] textarea').fill(article.content);
    await page.locator('[data-qa-id="editor-tags"]').fill(article.tags);
    await page.locator('[data-qa-id="editor-publish"]').click();

    await expect(page.locator('[data-qa-id="article-title"]')).toContainText(article.title);
    await expect(page.locator('[data-qa-id="article-body"]')).toContainText(article.content);
    await expect(page.locator('[data-qa-id="article-delete"]').first()).toBeVisible();
    await expect(page.locator('form button')).toBeVisible();
  });

  test("QD-014 show my articles", { tag: "@article" }, async ({ page }) => {
    await page.locator(`a[href="/@${USER.name}/"].nav-link`).click();
    await expect(page.locator('[data-qa-type="preview-title"]').filter({ hasText: 'Test Article ayak 2'})).toBeVisible();

    await page.locator(`a[href="/@${USER.name}/favorites"].nav-link`).click();
    await expect(page.locator('[data-qa-type="preview-title"]').filter({ hasText: 'NEW TITLE UPDATE'})).toBeVisible();
  });

  test("QD-015 can log out", { tag: "@auth" }, async ({ page }) => {
    await page.locator('a[href="/settings"]').click();

    await page.locator('.btn-outline-danger').click();

    await expect(page).toHaveURL("https://demo.learnwebdriverio.com/");
    await expect(page.locator('a[href="/login"]')).toBeVisible();
  });  
});
