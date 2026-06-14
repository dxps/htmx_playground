const { test, expect } = require("@playwright/test");

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.locator("#movie-list").waitFor();
  await page.waitForFunction(() => window.movieApp?.ready);
  await page.evaluate(() => window.movieApp.ready);
});

test("creates, edits, deletes, and persists movies locally", async ({ page }) => {
  await page.evaluate(() => window.movieApp.clear());
  await page.reload();
  await page.locator("#movie-list").waitFor();
  await page.waitForFunction(() => window.movieApp?.ready);
  await page.evaluate(() => window.movieApp.ready);

  await page.getByLabel("Title").fill("Arrival");
  await page.getByLabel("Description").fill("Linguists, time, and a very human first contact story.");
  await page.getByLabel("Year").fill("2016");
  await page.getByRole("button", { name: "Add movie" }).click();

  await expect(page.getByRole("heading", { name: "Arrival" })).toBeVisible();
  await expect.poll(() =>
    page.evaluate(
      () =>
        new Promise((resolve, reject) => {
          const request = indexedDB.open("htmx4mobile", 1);
          request.onerror = () => reject(request.error);
          request.onsuccess = () => {
            const db = request.result;
            const transaction = db.transaction("movies", "readonly");
            const getRequest = transaction.objectStore("movies").getAll();
            getRequest.onerror = () => reject(getRequest.error);
            getRequest.onsuccess = () => resolve(getRequest.result.map((movie) => movie.title));
          };
        })
    )
  ).toContain("Arrival");

  await page.reload();
  await page.locator("#movie-list").waitFor();
  await page.waitForFunction(() => window.movieApp?.ready);
  await page.evaluate(() => window.movieApp.ready);
  await expect(page.getByRole("heading", { name: "Arrival" })).toBeVisible();

  await page.getByRole("button", { name: "Edit" }).first().click();
  await expect(page.getByRole("button", { name: "Save changes" })).toBeVisible();
  await page.getByLabel("Title").fill("Arrival: Edited");
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page.getByRole("heading", { name: "Arrival: Edited" })).toBeVisible();

  await page.getByRole("button", { name: "Delete" }).first().click();
  await expect(page.getByRole("heading", { name: "Arrival: Edited" })).toHaveCount(0);
});

test("loads HTMX v4 in the Capacitor web bundle", async ({ page }) => {
  await expect(page.locator('link[rel="manifest"]')).toHaveCount(0);
  await expect.poll(() => page.evaluate(() => window.htmx?.version)).toBe("4.0.0-beta4");
});

test("keeps movie data in IndexedDB across reloads", async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto("/");
  await page.locator("#movie-list").waitFor();
  await page.waitForFunction(() => window.movieApp?.ready);
  await page.evaluate(() => window.movieApp.ready);
  await page.getByRole("heading", { name: "Spirited Away" }).waitFor();

  await page.reload();
  await page.locator("#movie-list").waitFor();
  await page.waitForFunction(() => window.movieApp?.ready);
  await page.evaluate(() => window.movieApp.ready);

  await expect(page.getByRole("heading", { name: "Spirited Away" })).toBeVisible();
  await context.close();
});
