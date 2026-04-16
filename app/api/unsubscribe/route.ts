// GET  /api/unsubscribe?token=<userId.<hmac>>
// POST /api/unsubscribe?token=<userId.<hmac>>
//
// Both methods accepted: inbox providers issue POST for one-click unsubscribe,
// users clicking the link in mail clients hit GET. Idempotent — flipping the
// flag on an already-unsubscribed user is a no-op.

import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { verifyUnsubscribeToken } from "@/lib/email/unsubscribe-token";
import { captureError } from "@/lib/logger";

function requireEnv(name: string): string {
  const val = process.env[name];
  if (!val) throw new Error(`${name} environment variable is not set`);
  return val;
}

async function handle(req: NextRequest): Promise<NextResponse> {
  const appOrigin = requireEnv("NEXT_PUBLIC_APP_URL");
  const token = req.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(
      new URL("/login?error=unsubscribe-bad", appOrigin),
      303
    );
  }

  const userId = await verifyUnsubscribeToken(token);
  if (!userId) {
    return NextResponse.redirect(
      new URL("/login?error=unsubscribe-bad", appOrigin),
      303
    );
  }

  try {
    await db
      .update(users)
      .set({ emailNotificationsEnabled: false, updatedAt: new Date() })
      .where(eq(users.id, userId));
  } catch (e) {
    await captureError(e, { step: "unsubscribe_update" });
    return NextResponse.redirect(
      new URL("/login?error=unsubscribe-fail", appOrigin),
      303
    );
  }

  // Confirmation page: keep simple, served as plain HTML so the user doesn't
  // need to be logged in (the token is the auth).
  return new NextResponse(
    `<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Baja confirmada</title>
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <style>body{margin:0;background:#0a0a0f;color:#e6e6f0;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Inter,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;padding:24px;text-align:center;}h1{font-family:Cormorant,Georgia,serif;font-size:28px;margin:0 0 12px;}p{color:#9b9ab8;max-width:480px;}a{color:#B9B8EB;}</style>
    </head><body><div><h1>Te has dado de baja</h1>
    <p>No volverás a recibir correos del tablero de ideas. Si fue un error, vuelve a activar las notificaciones desde tu perfil.</p>
    <p><a href="${appOrigin}/ideas">Volver al tablero</a></p></div></body></html>`,
    {
      status: 200,
      headers: { "content-type": "text/html; charset=utf-8" },
    }
  );
}

export async function GET(req: NextRequest) {
  return handle(req);
}

export async function POST(req: NextRequest) {
  return handle(req);
}
