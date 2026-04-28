import { z } from "zod";
import {
  CATEGORY_VALUES,
  CHAIN_VALUES,
  CONFIDENCE_LEVEL_VALUES,
  FILTER_STATUS_VALUES,
  ITA_ANSWER_VALUES,
  PILLAR_STATUS_VALUES,
  VERDICT_VALUES,
} from "./enum-values";
import { isKnownMethodologyVersion } from "./methodologies";

export const SUMMARY_MAX = 600;
export const VERDICT_SUMMARY_MAX = 300;
export const REVISION_NOTE_MAX = 500;
export const STRING_MAX = 2000;
export const SHORT_STRING_MAX = 200;
export const TAGS_MAX = 20;
export const FILTERS_MAX = 20;
export const PILLARS_MAX = 10;
export const KEY_METRICS_MAX = 20;
export const PEER_TOKENS_MAX = 25;
export const RISKS_MAX = 25;
export const SOURCES_MAX = 50;

const dateString = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
  message: "must be YYYY-MM-DD",
});

const boundedString = (max = STRING_MAX) => z.string().trim().min(1).max(max);

const safeProse = (max = STRING_MAX) =>
  boundedString(max)
    .refine((s) => !/<script|<iframe|on\w+=/i.test(s), {
      message: "no script-like content",
    })
    .refine((s) => !/[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(s), {
      message: "no control characters",
    });

const safeUrl = z
  .string()
  .url()
  .refine((u) => /^https:\/\//i.test(u), { message: "https only" })
  .refine((u) => !/[<>"'\s]/.test(u), { message: "no control chars" });

export const filterIdEnum = z.enum([
  "inflationary",
  "equity_token_duality",
  "low_float_high_fdv",
  "egotistical_founder",
  "excessive_tge_hype",
  "not_understandable",
]);

export const pillarIdEnum = z.enum([
  "pmf",
  "real_revenue",
  "value_capture",
  "aligned_incentives",
]);

const verdictEnum = z.enum(VERDICT_VALUES);
const categoryEnum = z.enum(CATEGORY_VALUES);
const chainEnum = z.enum(CHAIN_VALUES);
const filterStatusEnum = z.enum(FILTER_STATUS_VALUES);
const pillarStatusEnum = z.enum(PILLAR_STATUS_VALUES);
const itaAnswerEnum = z.enum(ITA_ANSWER_VALUES);
const confidenceLevelEnum = z.enum(CONFIDENCE_LEVEL_VALUES);

const keyMetricSchema = z.object({
  metric: boundedString(SHORT_STRING_MAX),
  value: boundedString(SHORT_STRING_MAX),
  source_url: safeUrl,
});

const discardFilterSchema = z.object({
  id: filterIdEnum,
  name: boundedString(SHORT_STRING_MAX),
  status: filterStatusEnum,
  justification: safeProse(),
  key_metric: safeProse(SHORT_STRING_MAX),
  metric_source: safeUrl,
});

const fundamentalPillarSchema = z.object({
  id: pillarIdEnum,
  name: boundedString(SHORT_STRING_MAX),
  status: pillarStatusEnum,
  analysis: safeProse(),
  key_metrics: z.array(keyMetricSchema).max(KEY_METRICS_MAX),
});

const nullableNumber = z.number().finite().nullable();

const baseDataSchema = z.object({
  price_usd: z.number().finite().nonnegative(),
  market_cap_usd: z.number().finite().nonnegative(),
  fdv_usd: z.number().finite().nonnegative(),
  mc_fdv_ratio: z.number().finite().nonnegative(),
  circulating_supply: z.number().finite().nonnegative(),
  total_supply: z.number().finite().nonnegative(),
  max_supply: nullableNumber,
  revenue_annualized_usd: nullableNumber,
  mc_revenue_ratio: nullableNumber,
  tvl_usd: nullableNumber,
  data_source_primary: safeUrl,
  data_date: dateString,
});

const comparativePeerSchema = z.object({
  ticker: boundedString(20),
  mc: nullableNumber,
  revenue: nullableNumber,
  ps_ratio: nullableNumber,
  value_capture_pct: nullableNumber,
  notes: safeProse(SHORT_STRING_MAX),
  url: safeUrl.optional(),
});

const sourceTypeEnum = z.enum([
  "onchain",
  "aggregator",
  "official_docs",
  "research",
]);

const sourceSchema = z.object({
  name: boundedString(SHORT_STRING_MAX),
  url: safeUrl,
});

export const analysisSchema = z
  .object({
    ticker: boundedString(20),
    project_name: boundedString(SHORT_STRING_MAX),
    contract_address: boundedString(SHORT_STRING_MAX).nullable().optional(),
    chain: chainEnum,
    category: categoryEnum,
    tags: z.array(boundedString(SHORT_STRING_MAX)).max(TAGS_MAX),
    analysis_date: dateString,
    methodology_version: boundedString(SHORT_STRING_MAX).refine(
      isKnownMethodologyVersion,
      { message: "unknown methodology version" }
    ),
    analyst: boundedString(SHORT_STRING_MAX),
    verdict: verdictEnum,
    verdict_summary: safeProse(VERDICT_SUMMARY_MAX),
    executive_summary: safeProse(SUMMARY_MAX),
    base_data: baseDataSchema,
    discard_filters: z.object({
      filters: z.array(discardFilterSchema).max(FILTERS_MAX),
      step_1_result: z.enum(["PASA", "DESCARTE_AUTOMATICO"]),
      step_1_summary: safeProse(),
    }),
    fundamental_pillars: z.object({
      pillars: z.array(fundamentalPillarSchema).max(PILLARS_MAX),
      step_2_result: z.enum(["PASA", "NO_PASA", "PARCIAL"]),
      step_2_summary: safeProse(),
    }),
    ita_definitiva: z.object({
      question: safeProse(SHORT_STRING_MAX),
      answer: itaAnswerEnum,
      rationale: safeProse(),
    }),
    comparative_analysis: z.object({
      peer_tokens: z.array(comparativePeerSchema).max(PEER_TOKENS_MAX),
      summary: safeProse(),
    }),
    risks_and_watchpoints: z.object({
      structural_risks: z.array(safeProse()).max(RISKS_MAX),
      operational_risks: z.array(safeProse()).max(RISKS_MAX),
      things_to_monitor: z.array(safeProse()).max(RISKS_MAX),
    }),
    verdict_section: z.object({
      final_verdict: verdictEnum,
      confidence_level: confidenceLevelEnum,
      next_step: safeProse(),
    }),
    sources: z.object({
      primary: z
        .array(sourceSchema.extend({ type: sourceTypeEnum }))
        .max(SOURCES_MAX),
      secondary: z.array(sourceSchema).max(SOURCES_MAX),
    }),
  })
  .superRefine((payload, ctx) => {
    if (payload.verdict !== payload.verdict_section.final_verdict) {
      ctx.addIssue({
        code: "custom",
        path: ["verdict_section", "final_verdict"],
        message: "verdict must match verdict_section.final_verdict",
      });
    }
  });

export type Analysis = z.infer<typeof analysisSchema>;
