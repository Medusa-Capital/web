import { afterEach, describe, expect, test } from "bun:test";

import { trackSistemaMedusaEvent } from "@/lib/analytics";

describe("trackSistemaMedusaEvent", () => {
  afterEach(() => {
    // @ts-expect-error - tests own the browser global shim.
    delete globalThis.window;
  });

  test("emits prefixed GA4 event names with engagement category", () => {
    const calls: unknown[][] = [];
    // @ts-expect-error - minimal gtag shim for the client analytics helper.
    globalThis.window = {
      gtag: (...args: unknown[]) => calls.push(args),
    };

    trackSistemaMedusaEvent("view_detail", {
      ticker: "AERO",
      version_number: 1,
    });

    expect(calls).toEqual([
      [
        "event",
        "sistema_medusa_view_detail",
        {
          category: "engagement",
          ticker: "AERO",
          version_number: 1,
        },
      ],
    ]);
  });
});
