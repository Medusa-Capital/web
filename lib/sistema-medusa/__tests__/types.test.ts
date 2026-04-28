import { describe, expect, test } from "bun:test";

import { FIELD_VISIBILITY } from "@/lib/sistema-medusa/visibility";
import { PUBLIC_ANALYSIS_KEYS } from "@/lib/sistema-medusa/types";

describe("Sistema Medusa view types", () => {
  test("public view keys match FIELD_VISIBILITY public top-level fields", () => {
    const publicVisibilityKeys = Object.entries(FIELD_VISIBILITY)
      .filter(([path, visibility]) => !path.includes(".") && visibility === "public")
      .map(([path]) => path)
      .sort();

    expect([...PUBLIC_ANALYSIS_KEYS].sort()).toEqual(publicVisibilityKeys);
  });
});
