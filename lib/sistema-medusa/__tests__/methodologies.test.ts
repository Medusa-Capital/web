import { describe, expect, test } from "bun:test";

import {
  isDeprecatedMethodologyVersion,
  isKnownMethodologyVersion,
  METHODOLOGIES,
} from "@/lib/sistema-medusa/methodologies";

describe("Sistema Medusa methodologies registry", () => {
  test("keeps deprecated methodologies addressable for old rows", () => {
    expect(isKnownMethodologyVersion("V2-Guardrail")).toBe(true);
    expect(METHODOLOGIES["V2-Guardrail"].deprecated).toBe(true);
    expect(isDeprecatedMethodologyVersion("V2-Guardrail")).toBe(true);
  });

  test("keeps the current methodology active", () => {
    expect(isKnownMethodologyVersion("V4.1")).toBe(true);
    expect(METHODOLOGIES["V4.1"].deprecated).toBeUndefined();
    expect(isDeprecatedMethodologyVersion("V4.1")).toBe(false);
  });
});
