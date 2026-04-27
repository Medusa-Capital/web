import { describe, expect, test } from "bun:test";
import { sanitizeReturnTo } from "@/lib/auth/return-to";

const ORIGIN = "https://medusacapital.xyz";

describe("Sistema Medusa returnTo sanitizer", () => {
  test("preserves valid detail version deep links", () => {
    expect(sanitizeReturnTo("/sistema-medusa/aero?v=2", ORIGIN)).toBe(
      "/sistema-medusa/aero?v=2"
    );
  });

  test("strips oversized version queries", () => {
    expect(sanitizeReturnTo("/sistema-medusa/aero?v=99999", ORIGIN)).toBe(
      "/sistema-medusa/aero"
    );
  });

  test("strips disallowed query parameters", () => {
    expect(sanitizeReturnTo("/sistema-medusa/aero?other=x", ORIGIN)).toBe(
      "/sistema-medusa/aero"
    );
  });

  test("rejects cross-origin redirects", () => {
    expect(sanitizeReturnTo("//evil.com/sistema-medusa/aero", ORIGIN)).toBe(
      "/ideas"
    );
  });

  test("rejects paths outside the allowlist", () => {
    expect(sanitizeReturnTo("/etc/passwd", ORIGIN)).toBe("/ideas");
  });
});
