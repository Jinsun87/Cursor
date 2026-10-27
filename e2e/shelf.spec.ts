import { expect, test, type Page } from "@playwright/test";

/** Open a book on the Sleep shelf, tap a chapter, and expect its Play button on screen without scrolling. */
async function playIsOnScreen(page: Page, book: string, chapter: number) {
  await page.locator(".shelf-book", { hasText: book }).click();
  await page.getByRole("button", { name: new RegExp(`^${book} ${chapter},`) }).click();
  const card = page.locator("#shelf-chapter-card");
  await expect(card.locator(".shelf-play")).toBeInViewport({ ratio: 1 });
  // The card sits under the tapped chapter's row, not after the whole story group.
  const tile = await page.getByRole("button", { name: new RegExp(`^${book} ${chapter},`) }).boundingBox();
  const box = await card.boundingBox();
  expect(box!.y - (tile!.y + tile!.height)).toBeLessThan(40);
  await page.getByRole("button", { name: "All books" }).click();
}

for (const [name, size] of [
  ["phone", { width: 375, height: 812 }],
  ["desktop", { width: 1280, height: 800 }],
] as const) {
  test(`tapping a chapter shows Play right under it (${name})`, async ({ page }) => {
    await page.setViewportSize(size);
    await page.addInitScript(() => localStorage.setItem("lampstand-onboarding", JSON.stringify({ done: true })));
    await page.goto("/?tab=sleep");
    await playIsOnScreen(page, "Psalms", 18);
    await playIsOnScreen(page, "Psalms", 41);
    await playIsOnScreen(page, "Psalms", 3);
    await playIsOnScreen(page, "Genesis", 37);
    await playIsOnScreen(page, "Exodus", 12);
  });
}
