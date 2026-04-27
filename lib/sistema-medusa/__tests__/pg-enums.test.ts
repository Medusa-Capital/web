import { describe, expect, test } from "bun:test";

import {
  CATEGORY_VALUES,
  CHAIN_VALUES,
  CONFIDENCE_LEVEL_VALUES,
  FILTER_STATUS_VALUES,
  ITA_ANSWER_VALUES,
  PILLAR_STATUS_VALUES,
  VERDICT_VALUES,
} from "@/lib/sistema-medusa/enum-values";
import {
  categoryPgEnum,
  chainPgEnum,
  confidenceLevelPgEnum,
  filterStatusPgEnum,
  itaAnswerPgEnum,
  pillarStatusPgEnum,
  verdictPgEnum,
} from "@/db/schema/enums";

describe("Sistema Medusa pgEnum declarations", () => {
  test("reuse the canonical enum values", () => {
    expect(verdictPgEnum.enumValues).toEqual(VERDICT_VALUES);
    expect(categoryPgEnum.enumValues).toEqual(CATEGORY_VALUES);
    expect(chainPgEnum.enumValues).toEqual(CHAIN_VALUES);
    expect(filterStatusPgEnum.enumValues).toEqual(FILTER_STATUS_VALUES);
    expect(pillarStatusPgEnum.enumValues).toEqual(PILLAR_STATUS_VALUES);
    expect(itaAnswerPgEnum.enumValues).toEqual(ITA_ANSWER_VALUES);
    expect(confidenceLevelPgEnum.enumValues).toEqual(CONFIDENCE_LEVEL_VALUES);
  });

  test("uses stable Postgres enum type names", () => {
    expect(verdictPgEnum.enumName).toBe("verdict");
    expect(categoryPgEnum.enumName).toBe("category");
    expect(chainPgEnum.enumName).toBe("chain");
    expect(filterStatusPgEnum.enumName).toBe("filter_status");
    expect(pillarStatusPgEnum.enumName).toBe("pillar_status");
    expect(itaAnswerPgEnum.enumName).toBe("ita_answer");
    expect(confidenceLevelPgEnum.enumName).toBe("confidence_level");
  });
});
