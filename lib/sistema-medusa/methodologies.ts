export type MethodologyMetadata<Version extends string = string> = {
  label: string;
  introducedAt: string;
  notes: string;
  deprecated?: true;
  supersededBy?: Version;
};

export const METHODOLOGIES = {
  "V2-Guardrail": {
    label: "V2 Guardrail",
    introducedAt: "2025-09-01",
    notes: "Sistema original - 6 filtros descarte.",
    deprecated: true,
    supersededBy: "V4.1",
  },
  V4: {
    label: "V4",
    introducedAt: "2026-01-15",
    notes:
      "Primera iteración con ITA + 4 pilares fundamentales. Reemplazada por V4.1.",
    deprecated: true,
    supersededBy: "V4.1",
  },
  "V4.1": {
    label: "V4.1",
    introducedAt: "2026-03-15",
    notes: "Añade ITA + 4 pilares fundamentales.",
  },
} as const satisfies Record<string, MethodologyMetadata>;

export type MethodologyVersion = keyof typeof METHODOLOGIES;

export function isKnownMethodologyVersion(
  value: string
): value is MethodologyVersion {
  return Object.hasOwn(METHODOLOGIES, value);
}

export function isDeprecatedMethodologyVersion(
  value: MethodologyVersion
): boolean {
  const entry = METHODOLOGIES[value];
  return "deprecated" in entry && entry.deprecated === true;
}
