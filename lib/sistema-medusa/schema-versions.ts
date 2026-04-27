import { analysisSchema } from "./schemas";

export const SCHEMA_VERSIONS = { 1: analysisSchema } as const;
export type SchemaVersion = keyof typeof SCHEMA_VERSIONS;
