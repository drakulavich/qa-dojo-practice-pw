import { test, expect } from "@playwright/test";

const USER = {
  email: "dra@kula.vich",
  name: "drakulavich",
  password: "12345",
};

test(
  "QD-011 login with correct user creds",
  { tag: "@auth" },
  async ({ page }) => {
    await page.goto("https://demo.learnwebdriverio.com/");

    await page.getByRole("link", { name: "Sign in" }).click();
    await page.getByRole("textbox", { name: "Email" }).fill(USER.email);
    await page.getByRole("textbox", { name: "Password" }).fill(USER.password);
    await page.getByRole("button", { name: "Sign in" }).click();

    await expect(page.locator("#app")).toContainText("drakulavich");
  }
);

test(
  "QD-012 login with incorrect creds",
  { tag: "@auth" },
  async ({ page }) => {
    await page.goto("https://demo.learnwebdriverio.com/");

    await page.getByRole("link", { name: "Sign in" }).click();
    await page.getByRole("textbox", { name: "Email" }).fill(USER.email);
    await page
      .getByRole("textbox", { name: "Password" })
      .fill(USER.password + "something");
    await page.getByRole("button", { name: "Sign in" }).click();

    await expect(page.getByText("email or password is invalid")).toBeVisible();
  }
);

test.describe("Logged user", async () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("https://demo.learnwebdriverio.com/");

    await page.getByRole("link", { name: "Sign in" }).click();
    await page.getByRole("textbox", { name: "Email" }).fill(USER.email);
    await page.getByRole("textbox", { name: "Password" }).fill(USER.password);
    await page.getByRole("button", { name: "Sign in" }).click();
  });

  test("QD-013 create new article", { tag: "@article" }, async ({ page }) => {
    const article = {
      title: "Test Article ayak 4",
      about: "about future",
      content: "My text here",
      tags: "pw, testing",
    };

    await page.getByRole("link", { name: "New Article" }).click();
    await page
      .getByRole("textbox", { name: "Article Title" })
      .fill(article.title);
    await page
      .getByRole("textbox", { name: "What's this article about?" })
      .fill(article.about);
    await page
      .getByRole("textbox", { name: "Write your article (in" })
      .fill(article.content);
    await page.getByRole("textbox", { name: "Enter tags" }).fill(article.tags);
    await page.getByRole("button", { name: "Publish Article" }).click();

    await expect(
      page.getByRole("heading", { name: article.title })
    ).toBeVisible();
    await expect(page.getByText(article.content)).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Delete Article" }).first()
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Post Comment" })
    ).toBeVisible();
  });

  test("QD-014 show my articles", { tag: "@article" }, async ({ page }) => {
    await page
      .locator(".navbar")
      .getByRole("link", { name: USER.name })
      .click();

    await page.getByRole("link", { name: "My Articles" }).click();
    await expect(page).toHaveURL(
      "https://demo.learnwebdriverio.com/@drakulavich/"
    );
    await expect(
      page.getByRole("link", { name: "Test Article ayak 2" })
    ).toBeVisible();

    await page.getByRole("link", { name: "Favorited Articles" }).click();
    await expect(page).toHaveURL(
      "https://demo.learnwebdriverio.com/@drakulavich/favorites"
    );
    await expect(
      page.getByRole("link", { name: "NEW TITLE UPDATE" })
    ).toBeVisible();
  });

  test("QD-015 can log out", { tag: "@auth" }, async ({ page }) => {
    await page.getByRole("link", { name: "Settings" }).click();

    await page.getByRole("button", { name: "click here to logout" }).click();

    await expect(page).toHaveURL("https://demo.learnwebdriverio.com/");
    await expect(page.getByRole("link", { name: "Sign in" })).toBeVisible();
  });
});
