import { expect, test } from "@playwright/test";

test("home sells the gym and routes into inventory", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /master a subject/i })).toBeVisible();
  await page.getByRole("link", { name: /take your first quiz/i }).click();
  await expect(page).toHaveURL(/get-your-fill-restaurant/);
  await expect(page.getByRole("heading", { name: /get your fill/i })).toBeVisible();
});

test("a guest can finish a quiz and see a score", async ({ page }) => {
  await page.goto("/quizzes/us-capitals");
  for (let i = 0; i < 6; i++) {
    await page.getByTestId("choice-0").click();
    await expect(page.getByTestId("answer-fact")).toBeVisible();
    await expect(page.getByTestId("answer-fact")).toContainText(/correct answer:/i);
    await expect(page.getByTestId("answer-fact")).toContainText(/fact:/i);
    await page.getByTestId("quiz-next").click();
  }
  await expect(page.getByTestId("quiz-complete")).toBeVisible();
  await expect(page.getByText(/\d+\/6/)).toBeVisible();
});

test("register, secret ads, premium grant, then ads drop", async ({ page }) => {
  const id = `t${Date.now()}`;
  await page.goto("/register");
  await page.getByLabel("Email").fill(`${id}@quizforge.test`);
  await page.getByLabel("Username").fill(id);
  await page.getByLabel("Password").fill("testpass");
  await page.getByRole("button", { name: /sign up/i }).click();
  await expect(page).toHaveURL(/\/profile/);
  await expect(page.getByTestId("coin-balance")).toHaveText(/^100/);

  await page.goto("/secret");
  await expect(page.getByTestId("ad-slot")).toBeVisible();

  await page.goto("/premium");
  await page.getByRole("button", { name: /activate simulated premium/i }).click();
  await expect(page).toHaveURL(/\/profile/);
  await expect(page.getByTestId("premium-badge")).toBeVisible();
  await expect(page.getByTestId("coin-balance")).toHaveText(/^5,100|^5100/);

  await page.goto("/secret");
  await expect(page.getByText(/premium trail is clear/i)).toBeVisible();
  await expect(page.getByTestId("ad-slot")).toHaveCount(0);
});
