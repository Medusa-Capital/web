import { NextRequest, NextResponse } from "next/server";

const AIRTABLE_WEBHOOK_URL =
  "https://hooks.airtable.com/workflows/v1/genericWebhook/appOy27N5Wx2OdFX3/wflIzSnlqhrpPnT5Q/wtrRMao3I6PL7jKvD";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Forward all fields to Airtable, including UTM params:
    // utm_source, utm_medium, utm_campaign, utm_term, utm_content
    const response = await fetch(AIRTABLE_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to submit to Airtable" },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
