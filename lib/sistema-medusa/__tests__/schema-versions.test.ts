import { describe, expect, test } from "bun:test";

import { analysisSchema } from "@/lib/sistema-medusa/schemas";
import { SCHEMA_VERSIONS } from "@/lib/sistema-medusa/schema-versions";

describe("SCHEMA_VERSIONS", () => {
  test("dispatches payload schema version 1 to analysisSchema", () => {
    expect(SCHEMA_VERSIONS[1]).toBe(analysisSchema);
  });
});
