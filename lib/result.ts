// Discriminated union returned by all server actions.
// Clients narrow on `result.ok` before accessing `result.data`.

export type ActionResult<T = void> =
  | { ok: true; data: T }
  | {
      ok: false;
      error: string;
      code: "VALIDATION" | "UNAUTHORIZED" | "NOT_FOUND" | "INTERNAL";
    };

export function ok<T>(data: T): ActionResult<T> {
  return { ok: true, data };
}

export function err(
  error: string,
  code: "VALIDATION" | "UNAUTHORIZED" | "NOT_FOUND" | "INTERNAL"
): ActionResult<never> {
  return { ok: false, error, code };
}
