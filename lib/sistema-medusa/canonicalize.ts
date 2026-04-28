type JsonPrimitive = string | number | boolean | null;
type CanonicalValue = JsonPrimitive | CanonicalValue[] | Record<string, CanonicalValue>;

export function canonicalize(payload: unknown): string {
  return JSON.stringify(toCanonicalValue(payload));
}

function toCanonicalValue(value: unknown): CanonicalValue | undefined {
  if (value === undefined) return undefined;
  if (value === null) return null;

  if (typeof value === "string") {
    return value.trim().replace(/\s+/g, " ");
  }

  if (typeof value === "number") {
    if (!Number.isFinite(value)) {
      throw new TypeError("Cannot canonicalize non-finite number");
    }

    return Object.is(value, -0) ? 0 : value;
  }

  if (typeof value === "boolean") return value;

  if (Array.isArray(value)) {
    return value
      .map((item) => toCanonicalValue(item))
      .filter((item): item is CanonicalValue => item !== undefined);
  }

  if (isPlainObject(value)) {
    const entries = Object.entries(value)
      .map(([key, child]) => [key, toCanonicalValue(child)] as const)
      .filter((entry): entry is readonly [string, CanonicalValue] => {
        return entry[1] !== undefined;
      })
      .sort(([left], [right]) => left.localeCompare(right));

    return Object.fromEntries(entries);
  }

  throw new TypeError(`Cannot canonicalize ${typeof value}`);
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
