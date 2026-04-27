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
import { VERDICT_LABELS } from "@/lib/sistema-medusa/enums/verdict";
import { CATEGORY_LABELS } from "@/lib/sistema-medusa/enums/category";
import { CHAIN_LABELS } from "@/lib/sistema-medusa/enums/chain";
import { FILTER_STATUS_LABELS } from "@/lib/sistema-medusa/enums/filter-status";
import { PILLAR_STATUS_LABELS } from "@/lib/sistema-medusa/enums/pillar-status";
import { ITA_ANSWER_LABELS } from "@/lib/sistema-medusa/enums/ita-answer";
import { CONFIDENCE_LEVEL_LABELS } from "@/lib/sistema-medusa/enums/confidence-level";

const sortedKeys = (value: Record<string, string>) => Object.keys(value).sort();

describe("Sistema Medusa label completeness", () => {
  test("every enum value has a Spanish label", () => {
    expect(sortedKeys(VERDICT_LABELS)).toEqual([...VERDICT_VALUES].sort());
    expect(sortedKeys(CATEGORY_LABELS)).toEqual([...CATEGORY_VALUES].sort());
    expect(sortedKeys(CHAIN_LABELS)).toEqual([...CHAIN_VALUES].sort());
    expect(sortedKeys(FILTER_STATUS_LABELS)).toEqual([
      ...FILTER_STATUS_VALUES,
    ].sort());
    expect(sortedKeys(PILLAR_STATUS_LABELS)).toEqual([
      ...PILLAR_STATUS_VALUES,
    ].sort());
    expect(sortedKeys(ITA_ANSWER_LABELS)).toEqual([...ITA_ANSWER_VALUES].sort());
    expect(sortedKeys(CONFIDENCE_LEVEL_LABELS)).toEqual([
      ...CONFIDENCE_LEVEL_VALUES,
    ].sort());
  });
});
