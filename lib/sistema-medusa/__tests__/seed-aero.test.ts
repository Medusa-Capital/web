import { describe, expect, test } from "bun:test";
import { readFileSync } from "fs";
import { join } from "path";

import { analysisSchema } from "@/lib/sistema-medusa/schemas";
import { transformAeroInput } from "@/scripts/sistema-medusa/seed-aero";

const rawAero = () =>
  JSON.parse(
    readFileSync(
      join(process.cwd(), "sistema-medusa/medusa-web-example-aero.json"),
      "utf8"
    )
  );

describe("AERO seed transform", () => {
  test("transforms Alex's positional input into the canonical payload", () => {
    const payload = transformAeroInput(rawAero());
    const parsed = analysisSchema.parse(payload);

    expect(parsed.methodology_version).toBe("V4.1");
    expect(parsed.verdict).toBe("AVANZA_A_AT");
    expect(parsed.executive_summary).toContain("Aerodrome presenta");
    expect(parsed.verdict_section).toEqual({
      final_verdict: "AVANZA_A_AT",
      confidence_level: "ALTA",
      next_step:
        "Aplicar análisis técnico como filtro binario pass/no-pass antes de construcción de posición.",
    });
    expect(parsed.discard_filters.filters.map((filter) => filter.id)).toEqual([
      "inflationary",
      "equity_token_duality",
      "low_float_high_fdv",
      "egotistical_founder",
      "excessive_tge_hype",
      "not_understandable",
    ]);
    expect(parsed.fundamental_pillars.pillars.map((pillar) => pillar.id)).toEqual([
      "pmf",
      "real_revenue",
      "value_capture",
      "aligned_incentives",
    ]);
  });
});
