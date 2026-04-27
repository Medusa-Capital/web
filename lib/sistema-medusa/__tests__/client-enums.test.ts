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
  VERDICT_DOT,
  VERDICT_LABELS,
  VERDICT_TONE,
  verdictEnum,
} from "@/lib/sistema-medusa/enums/verdict";
import {
  CATEGORY_DOT,
  CATEGORY_LABELS,
  CATEGORY_TONE,
  categoryEnum,
} from "@/lib/sistema-medusa/enums/category";
import {
  CHAIN_DOT,
  CHAIN_LABELS,
  CHAIN_TONE,
  chainEnum,
} from "@/lib/sistema-medusa/enums/chain";
import {
  FILTER_STATUS_DOT,
  FILTER_STATUS_LABELS,
  FILTER_STATUS_TONE,
  filterStatusEnum,
} from "@/lib/sistema-medusa/enums/filter-status";
import {
  PILLAR_STATUS_DOT,
  PILLAR_STATUS_LABELS,
  PILLAR_STATUS_TONE,
  pillarStatusEnum,
} from "@/lib/sistema-medusa/enums/pillar-status";
import {
  ITA_ANSWER_DOT,
  ITA_ANSWER_LABELS,
  ITA_ANSWER_TONE,
  itaAnswerEnum,
} from "@/lib/sistema-medusa/enums/ita-answer";
import {
  CONFIDENCE_LEVEL_DOT,
  CONFIDENCE_LEVEL_LABELS,
  CONFIDENCE_LEVEL_TONE,
  confidenceLevelEnum,
} from "@/lib/sistema-medusa/enums/confidence-level";

const sortedKeys = (value: Record<string, unknown>) => Object.keys(value).sort();

describe("client-safe enum modules", () => {
  test("reuse the canonical enum values in Zod enums", () => {
    expect(verdictEnum.options).toEqual(VERDICT_VALUES);
    expect(categoryEnum.options).toEqual(CATEGORY_VALUES);
    expect(chainEnum.options).toEqual(CHAIN_VALUES);
    expect(filterStatusEnum.options).toEqual(FILTER_STATUS_VALUES);
    expect(pillarStatusEnum.options).toEqual(PILLAR_STATUS_VALUES);
    expect(itaAnswerEnum.options).toEqual(ITA_ANSWER_VALUES);
    expect(confidenceLevelEnum.options).toEqual(CONFIDENCE_LEVEL_VALUES);
  });

  test("exports complete label, tone, and dot maps", () => {
    const cases = [
      [VERDICT_VALUES, VERDICT_LABELS, VERDICT_TONE, VERDICT_DOT],
      [CATEGORY_VALUES, CATEGORY_LABELS, CATEGORY_TONE, CATEGORY_DOT],
      [CHAIN_VALUES, CHAIN_LABELS, CHAIN_TONE, CHAIN_DOT],
      [
        FILTER_STATUS_VALUES,
        FILTER_STATUS_LABELS,
        FILTER_STATUS_TONE,
        FILTER_STATUS_DOT,
      ],
      [
        PILLAR_STATUS_VALUES,
        PILLAR_STATUS_LABELS,
        PILLAR_STATUS_TONE,
        PILLAR_STATUS_DOT,
      ],
      [ITA_ANSWER_VALUES, ITA_ANSWER_LABELS, ITA_ANSWER_TONE, ITA_ANSWER_DOT],
      [
        CONFIDENCE_LEVEL_VALUES,
        CONFIDENCE_LEVEL_LABELS,
        CONFIDENCE_LEVEL_TONE,
        CONFIDENCE_LEVEL_DOT,
      ],
    ] as const;

    for (const [values, labels, tone, dot] of cases) {
      expect(sortedKeys(labels)).toEqual([...values].sort());
      expect(sortedKeys(tone)).toEqual([...values].sort());
      expect(sortedKeys(dot)).toEqual([...values].sort());
    }
  });

  test("uses Spanish display labels for member-facing codes", () => {
    expect(VERDICT_LABELS.AVANZA_A_AT).toBe("Avanza a análisis técnico");
    expect(CATEGORY_LABELS.AI_DEPIN).toBe("AI / DePIN");
    expect(FILTER_STATUS_LABELS.NO_VERIFICABLE).toBeUndefined();
    expect(PILLAR_STATUS_LABELS.NO_VERIFICABLE).toBe("No verificable");
    expect(ITA_ANSWER_LABELS.SI_CON_RESERVAS).toBe("Sí, con reservas");
  });
});
