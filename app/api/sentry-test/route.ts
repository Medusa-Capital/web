// TEMPORARY — delete after confirming Sentry receives the event
export const dynamic = "force-dynamic";

import * as Sentry from "@sentry/nextjs";
import { NextResponse } from "next/server";

export function GET() {
  Sentry.captureMessage("sentry test — safe to delete this file", "info");
  return NextResponse.json({ ok: true, message: "Event sent to Sentry" });
}
