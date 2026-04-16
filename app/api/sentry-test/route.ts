// TEMPORARY — delete after confirming Sentry receives the error
export const dynamic = "force-dynamic";

export function GET() {
  throw new Error("sentry test — safe to delete this file");
}
