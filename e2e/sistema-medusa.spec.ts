import { test, expect } from "@playwright/test";

test.describe.skip("Sistema Medusa member library", () => {
  // TODO(MED-40): Implement a real member auth fixture before enabling.
  //
  // The current auth cookie is `__Host-medusa-session` with `secure: true`.
  // Playwright runs the app at http://localhost:9090, so a robust fixture needs
  // either local HTTPS support or a test-only session configuration plus DB
  // user/session seeding. That exceeds the Phase 4 half-day budget called out
  // in the plan, so v1 ships these specs as explicit skipped coverage.
  //
  // Local verification note: this workstation also lacks the Playwright
  // Chromium binary, so unskipped browser specs currently fail before reaching
  // application assertions.

  test("anonymous list visits redirect to login with returnTo", async ({ page }) => {
    await page.goto("/sistema-medusa");
    await expect(page).toHaveURL(/\/login\?returnTo=%2Fsistema-medusa$/);
  });

  test("hostile returnTo values are rejected by login page", async ({ page }) => {
    await page.goto("/login?returnTo=//evil.com/x");
    await expect(page.getByRole("link", { name: /entrar/i })).toBeVisible();
  });

  test.describe("member happy path", () => {
    test("anonymous detail returns to /sistema-medusa/aero after auth", async () => {});
    test("member filters the list, opens AERO, and sees detail content", async () => {});
    test("member navigates to v1 from the version selector", async () => {});
    test("member cold-loads a /sistema-medusa/aero?v=1 deep link", async () => {});
  });
});
