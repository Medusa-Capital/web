// TEMPORARY — delete after confirming Sentry receives the event
export const dynamic = "force-dynamic";

import * as Sentry from "@sentry/nextjs";
import { NextResponse } from "next/server";

export async function GET() {
  Sentry.captureException(new Error("sentry test — safe to delete this file"));
  await Sentry.flush(2000);
  return NextResponse.json({ ok: true, message: "Event sent to Sentry" });
}
