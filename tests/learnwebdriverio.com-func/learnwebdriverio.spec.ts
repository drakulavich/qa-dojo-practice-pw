import { test, expect, Page } from "@playwright/test";
import { faker } from "@faker-js/faker";

const appLocator = (page: Page) => page.locator("#app");
const errorMessageLocator = (page: Page) => page.locator(".error-messages");

const editorLink = (page: Page) => page.locator('a[href="/editor"]');
const settingsLink = (page: Page) => page.locator('a[href="/settings"]');
const editorTitleInput = (page: Page) =>
  page.locator('[data-qa-id="editor-title"]');
const editorDescriptionInput = (page: Page) =>
  page.locator('[data-qa-id="editor-description"]');
const editorBodyText = (page: Page) =>
  page.locator('[data-qa-id="editor-body"] textarea');
const editorTagsInput = (page: Page) =>
  page.locator('[data-qa-id="editor-tags"]');
const publishButton = (page: Page) =>
  page.locator('[data-qa-id="editor-publish"]');

const articleTitle = (page: Page) =>
  page.locator('[data-qa-type="preview-title"]');

const registerLink = (page: Page) => page.locator('a[href="/register"]');
const loginLink = (page: Page) => page.locator('a[href="/login"]');
const logoutButton = (page: Page) => page.locator(".btn-outline-danger");

const usernameInput = (page: Page) =>
  page.locator('input[placeholder="Username"]');
const emailInput = (page: Page) => page.locator('input[placeholder="Email"]');
const passwordInput = (page: Page) =>
  page.locator('input[placeholder="Password"]');
const signInButton = (page: Page) => page.locator("form button");

const USER = {
  email: "dra@kula.vich",
  username: "drakulavich",
  password: "12345",
};

const randomUser = () => {
  return {
    email: faker.internet.email(),
    username: faker.internet.username().replace(".", "").replace("_", ""),
    password: faker.internet.password(),
  };
};

const randomArticle = () => {
  return {
    title: faker.commerce.productName(),
    about: faker.commerce.productMaterial(),
    content: faker.commerce.productDescription(),
    tags: faker.commerce.productAdjective(),
  };
};

const openEditor = async (page: Page) => {
  await editorLink(page).click();
};

const publishArticle = async (page: Page) => {
  await publishButton(page).click();
};

const createArticle = async (page: Page, article) => {
  if (article.title !== undefined) {
    await editorTitleInput(page).fill(article.title);
  }
  if (article.about !== undefined) {
    await editorDescriptionInput(page).fill(article.about);
  }
  if (article.content !== undefined) {
    await editorBodyText(page).fill(article.content);
  }
  if (article.tags !== undefined) {
    await editorTagsInput(page).fill(article.tags);
  }
};

const registerUser = async (page: Page, user) => {
  await registerLink(page).click();
  await usernameInput(page).fill(user.username);
  await emailInput(page).fill(user.email);
  await passwordInput(page).fill(user.password);
  await signInButton(page).click();
};

const loginUser = async (page: Page, user) => {
  await loginLink(page).click();
  await emailInput(page).fill(user.email);
  await passwordInput(page).fill(user.password);
  await signInButton(page).click();
};

const goToMain = async (page: Page) => {
  await page.goto("https://demo.learnwebdriverio.com/");
};

test(
  "QD-010 Sign up and create 3 articles",
  { tag: "@auth" },
  async ({ page }) => {
    await goToMain(page);

    const user = randomUser();
    registerUser(page, user);

    for (let i = 0; i < 3; i++) {
      const article = randomArticle();
      await openEditor(page);
      await createArticle(page, article);
      await publishArticle(page);

      await goToMain(page);

      await expect(
        articleTitle(page).filter({ hasText: article.title })
      ).toBeVisible();
    }
  }
);

test(
  "QD-011 login with correct user creds",
  { tag: "@auth" },
  async ({ page }) => {
    await goToMain(page);

    await loginUser(page, USER);

    await expect(appLocator(page)).toContainText(USER.username);
  }
);

test(
  "QD-012 login with incorrect creds",
  { tag: "@auth" },
  async ({ page }) => {
    await goToMain(page);

    const user = randomUser();
    user.email = USER.email;

    await loginUser(page, user);

    await expect(errorMessageLocator(page)).toContainText(
      "email or password is invalid"
    );
  }
);

test.describe("Logged user", async () => {
  test.beforeEach(async ({ page }) => {
    await goToMain(page);

    await loginUser(page, USER);
  });

  test("QD-013 create new article", { tag: "@article" }, async ({ page }) => {
    const article = randomArticle();

    await openEditor(page);
    await createArticle(page, article);
    await publishArticle(page);

    await expect(page.locator('[data-qa-id="article-title"]')).toContainText(
      article.title
    );
    await expect(page.locator('[data-qa-id="article-body"]')).toContainText(
      article.content
    );
    await expect(
      page.locator('[data-qa-id="article-delete"]').first()
    ).toBeVisible();
    await expect(page.locator("form button")).toBeVisible();
  });

  test("QD-014 show my articles", { tag: "@article" }, async ({ page }) => {
    const article = randomArticle();
    await openEditor(page);
    await createArticle(page, article);
    await publishArticle(page);

    await page.goto(`https://demo.learnwebdriverio.com/@${USER.username}`);

    await expect(
      articleTitle(page).filter({ hasText: article.title })
    ).toBeVisible();
  });

  test("QD-015 can log out", { tag: "@auth" }, async ({ page }) => {
    await settingsLink(page).click();
    await logoutButton(page).click();

    await expect(page).toHaveURL("https://demo.learnwebdriverio.com/");
    await expect(loginLink(page)).toBeVisible();
  });
});
