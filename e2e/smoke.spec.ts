import { expect, test } from "@playwright/test";

test("home sells Scripture and routes into Open the Book", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /know the text/i })).toBeVisible();
  await page.getByRole("link", { name: /take your first quiz/i }).click();
  await expect(page).toHaveURL(/open-the-book/);
  await expect(page.getByRole("heading", { name: /open the book/i })).toBeVisible();
  await expect(page.getByTestId("course-medals")).toBeVisible();
  await expect(page.getByTestId("course-medal-1")).toHaveAttribute("data-plated", "false");
});

test("a guest can finish a quiz and see a score", async ({ page }) => {
  await page.goto("/quizzes/us-capitals");
  await expect(page.getByTestId("quiz-hud")).toBeVisible();
  await expect(page.getByTestId("hud-question")).toContainText("Question 1");
  await expect(page.getByTestId("hud-accuracy")).toContainText("0%");
  await expect(page.getByTestId("hud-coins")).toContainText("0");
  await expect(page.getByTestId("hud-streak")).toContainText("0");
  await expect(page.getByTestId("choice-0")).toHaveText(/.+/);
  for (let i = 0; i < 6; i++) {
    await expect(page.getByTestId("choice-0")).toHaveText(/.+/);
    await page.getByTestId("choice-0").click();
    await expect(page.getByTestId("answer-fact")).toBeVisible();
    await expect(page.getByTestId("answer-fact")).toContainText(/correct answer:/i);
    await expect(page.getByTestId("answer-fact")).toContainText(/fact:/i);
    await page.getByTestId("quiz-next").click();
  }
  await expect(page.getByTestId("quiz-complete")).toBeVisible();
  await expect(page.getByTestId("end-grade")).toBeVisible();
  await expect(page.getByTestId("share-score")).toBeVisible();
  await expect(page.getByText(/\d+\/6/)).toBeVisible();
  await page.getByTestId("hud-restart").click();
  await expect(page.getByTestId("hud-question")).toContainText("Question 1");
  await expect(page.getByTestId("hud-accuracy")).toContainText("0%");
  await expect(page.getByRole("heading", { name: /capital of california/i })).toBeVisible();
});

test("guests see quiet-room ads and need an account before checkout", async ({ page }) => {
  await page.goto("/secret");
  await expect(page.getByTestId("ad-slot")).toBeVisible();

  await page.goto("/premium");
  await page.getByRole("button", { name: /create a free account to upgrade/i }).click();
  await expect(page).toHaveURL(/\/register\?next=%2Fpremium|\/register\?next=\/premium/);
  await expect(page.getByRole("button", { name: /create my account/i })).toBeVisible();
});

test("sign-in offers an email link, with a password option", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByRole("button", { name: /email me a sign-in link/i })).toBeVisible();
  await expect(page.getByLabel("Password")).toHaveCount(0);
  await page.getByRole("button", { name: /use a password instead/i }).click();
  await expect(page.getByLabel("Password")).toBeVisible();
  await expect(page.getByRole("button", { name: /^sign in$/i })).toBeVisible();
});

test("a guest can resume a sitting after reload", async ({ page }) => {
  await page.goto("/quizzes/us-capitals");
  await expect(page.getByTestId("choice-0")).toHaveText(/.+/);
  await expect(page.getByTestId("course-medals")).toHaveCount(0);
  await page.getByTestId("choice-0").click();
  await expect(page.getByTestId("answer-fact")).toBeVisible();
  const prompt = await page.getByRole("heading", { level: 2 }).innerText();
  await page.reload();
  await expect(page.getByTestId("answer-fact")).toBeVisible();
  await expect(page.getByRole("heading", { level: 2 })).toHaveText(prompt);
  await expect(page.getByTestId("hud-question")).toContainText("Question 1");
  await page.getByTestId("quiz-next").click();
  await expect(page.getByTestId("hud-question")).toContainText("Question 2");
});

test("restart wipes a saved sitting", async ({ page }) => {
  await page.goto("/quizzes/us-capitals");
  await expect(page.getByTestId("choice-0")).toHaveText(/.+/);
  await page.getByTestId("choice-0").click();
  await expect(page.getByTestId("answer-fact")).toBeVisible();
  await page.getByTestId("hud-restart").click();
  await expect(page.getByTestId("answer-fact")).toHaveCount(0);
  await expect(page.getByTestId("hud-question")).toContainText("Question 1");
  await page.reload();
  await expect(page.getByTestId("answer-fact")).toHaveCount(0);
  await expect(page.getByTestId("hud-question")).toContainText("Question 1");
});

test("daily sitting is ten questions", async ({ page }) => {
  await page.goto("/daily");
  await expect(page.getByTestId("hud-question")).toContainText("/ 10");
  await expect(page.getByTestId("choice-0")).toHaveText(/.+/);
});

test("guests are invited to join before using a 50/50", async ({ page }) => {
  await page.goto("/quizzes/us-capitals");
  await expect(page.getByTestId("choice-0")).toHaveText(/.+/);
  await expect(page.getByTestId("lifeline-5050-locked")).toHaveAttribute("href", "/register");
});

// Signed-in flows (sign-up, 50/50 purchase, Premium via webhook) need a Supabase
// test project and Paddle sandbox; see docs/accounts-setup.md.

test("privacy and ads.txt are on the quiz host", async ({ page, request }) => {
  const ads = await request.get("/ads.txt", { maxRedirects: 0 });
  expect([301, 302, 307, 308]).toContain(ads.status());
  expect(ads.headers()["location"] ?? "").toContain("srv.adstxtmanager.com/85097/mediareferee.com");
  await page.goto("/privacy");
  await expect(page.getByRole("heading", { name: /privacy/i })).toBeVisible();
  await expect(page.getByText("Lampstand on lampstandbible.com")).toBeVisible();
  await expect(
    page.getByText("The Ezoic dashboard site is the registrable domain"),
  ).toBeVisible();
});
