import { z } from "zod";
import { CHAIN_VALUES, type Chain } from "../enum-values";

export const chainEnum = z.enum(CHAIN_VALUES);

export const CHAIN_LABELS = {
  Ethereum: "Ethereum",
  Base: "Base",
  Solana: "Solana",
  Arbitrum: "Arbitrum",
  Optimism: "Optimism",
  Bitcoin: "Bitcoin",
  Other: "Otra",
} as const satisfies Record<Chain, string>;

export const CHAIN_TONE = {
  Ethereum: "indigo",
  Base: "blue",
  Solana: "violet",
  Arbitrum: "sky",
  Optimism: "red",
  Bitcoin: "amber",
  Other: "zinc",
} as const satisfies Record<Chain, string>;

export const CHAIN_DOT = {
  Ethereum: "bg-indigo-400",
  Base: "bg-blue-400",
  Solana: "bg-violet-400",
  Arbitrum: "bg-sky-400",
  Optimism: "bg-red-400",
  Bitcoin: "bg-amber-400",
  Other: "bg-zinc-400",
} as const satisfies Record<Chain, string>;
