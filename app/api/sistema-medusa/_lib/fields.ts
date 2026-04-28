export type FieldsMode = "public" | "member";

export function parseFieldsMode(req: Request): FieldsMode {
  const url = new URL(req.url);
  const raw = url.searchParams.get("fields");
  return raw === "public" ? "public" : "member";
}
