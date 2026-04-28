import { describe, expect, test } from "bun:test";
import { readFileSync } from "fs";
import { join } from "path";

import { canonicalize } from "@/lib/sistema-medusa/canonicalize";

const readFixture = (name: string) =>
  readFileSync(
    join(process.cwd(), "lib/sistema-medusa/__tests__/fixtures", name),
    "utf8"
  ).trim();

describe("canonicalize", () => {
  test("matches the frozen basic golden fixture", () => {
    const payload = {
      z: "  hello \n\t world  ",
      a: {
        c: 1.0,
        b: undefined,
        a: [" x ", 2.0, undefined],
      },
      n: null,
    };

    expect(canonicalize(payload)).toBe(readFixture("canonicalize-basic.txt"));
  });

  test("is stable across object key order", () => {
    expect(canonicalize({ b: 2, a: { d: 4, c: 3 } })).toBe(
      canonicalize({ a: { c: 3, d: 4 }, b: 2 })
    );
  });

  test("rejects non-finite numbers", () => {
    expect(() => canonicalize({ value: Number.NaN })).toThrow(
      "Cannot canonicalize non-finite number"
    );
  });
});
