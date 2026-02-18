import { test, expect } from "@playwright/test";

test.describe("Lead Capture Form → Airtable", () => {
  test("submits correct payload to /api/lead-capture", async ({ page }) => {
    // Intercept the API call so we can inspect the payload without hitting Airtable
    let capturedPayload: Record<string, unknown> | null = null;

    await page.route("/api/lead-capture", async (route) => {
      capturedPayload = route.request().postDataJSON();
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true }),
      });
    });

    await page.goto("/");

    // Modal auto-opens after 1s delay (only if localStorage flag is unset)
    const modal = page.getByRole("dialog");
    await expect(modal).toBeVisible({ timeout: 5_000 });

    // Fill out the form
    await modal.getByPlaceholder("Nombre").fill("Test");
    await modal.getByPlaceholder("Apellido").fill("User");
    await modal.getByPlaceholder("Email").fill("test@example.com");
    await modal.getByPlaceholder("Teléfono (opcional)").fill("612345678");

    // Accept terms
    await modal.getByLabel(/Acepto recibir/).click();

    // Submit
    await modal.getByRole("button", { name: "Lo Quiero Ya" }).click();

    // Wait for success state
    await expect(modal.getByText("¡Acceso Concedido!")).toBeVisible({
      timeout: 10_000,
    });

    // Verify the payload sent to the API route
    expect(capturedPayload).not.toBeNull();
    expect(capturedPayload).toMatchObject({
      first_name: "TEST",
      last_name: "USER",
      email: "test@example.com",
      consent: true,
    });

    // Phone should be E.164 formatted with Spain prefix
    expect(capturedPayload!.phone).toMatch(/^\+34/);
  });

  test("does not submit when required fields are empty", async ({ page }) => {
    let apiCalled = false;

    await page.route("/api/lead-capture", async (route) => {
      apiCalled = true;
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true }),
      });
    });

    await page.goto("/");

    const modal = page.getByRole("dialog");
    await expect(modal).toBeVisible({ timeout: 5_000 });

    // Accept terms but leave fields empty
    await modal.getByLabel(/Acepto recibir/).click();

    // Button should be disabled
    const submitButton = modal.getByRole("button", { name: "Lo Quiero Ya" });
    await expect(submitButton).toBeDisabled();

    // Force-click to be sure
    await submitButton.click({ force: true });

    // API should not have been called
    expect(apiCalled).toBe(false);
  });

  test("shows error state when API returns 500", async ({ page }) => {
    await page.route("/api/lead-capture", async (route) => {
      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ error: "Internal server error" }),
      });
    });

    await page.goto("/");

    const modal = page.getByRole("dialog");
    await expect(modal).toBeVisible({ timeout: 5_000 });

    // Fill out the form
    await modal.getByPlaceholder("Nombre").fill("Test");
    await modal.getByPlaceholder("Apellido").fill("User");
    await modal.getByPlaceholder("Email").fill("test@example.com");
    await modal.getByLabel(/Acepto recibir/).click();

    await modal.getByRole("button", { name: "Lo Quiero Ya" }).click();

    // Error message should appear
    await expect(
      modal.getByText("Ha ocurrido un error. Por favor, inténtalo de nuevo.")
    ).toBeVisible({ timeout: 5_000 });

    // Success state should NOT appear
    await expect(modal.getByText("¡Acceso Concedido!")).not.toBeVisible();
  });

  test("rejects Spanish phone numbers that are too short or too long", async ({
    page,
  }) => {
    let apiCalled = false;

    await page.route("/api/lead-capture", async (route) => {
      apiCalled = true;
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true }),
      });
    });

    await page.goto("/");

    const modal = page.getByRole("dialog");
    await expect(modal).toBeVisible({ timeout: 5_000 });

    // Fill all required fields so phone is the only blocker
    await modal.getByPlaceholder("Nombre").fill("Test");
    await modal.getByPlaceholder("Apellido").fill("User");
    await modal.getByPlaceholder("Email").fill("test@example.com");
    await modal.getByLabel(/Acepto recibir/).click();

    const phoneInput = modal.getByPlaceholder("Teléfono (opcional)");
    const submitButton = modal.getByRole("button", { name: "Lo Quiero Ya" });

    // Too short (8 digits — Spanish mobile numbers are 9)
    await phoneInput.fill("61234567");
    await phoneInput.blur();
    await expect(submitButton).toBeDisabled();

    // Too long (10 digits)
    await phoneInput.fill("6123456789");
    await phoneInput.blur();
    await expect(submitButton).toBeDisabled();

    // Valid 9-digit Spanish mobile number — should enable submit
    await phoneInput.fill("612345678");
    await phoneInput.blur();
    await expect(submitButton).toBeEnabled();

    // Verify the invalid attempts never triggered an API call
    expect(apiCalled).toBe(false);
  });
});
