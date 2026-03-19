import { NextRequest, NextResponse } from "next/server";

const AIRTABLE_WEBHOOKS = {
  masterclass:
    "https://hooks.airtable.com/workflows/v1/genericWebhook/appOy27N5Wx2OdFX3/wflIzSnlqhrpPnT5Q/wtrRMao3I6PL7jKvD",
  pdf_5_errores:
    "https://hooks.airtable.com/workflows/v1/genericWebhook/appOy27N5Wx2OdFX3/wflvb7Dlk2BSdaJUe/wtrEopE3CRZev6Ak1",
};

// Map lead_source to utm_campaign (Airtable UTM table uses different naming)
const LEAD_SOURCE_TO_CAMPAIGN: Record<string, string> = {
  pdf_5_errores_cripto: "pdf_5_errores",
};

// Map utm_source to Airtable Source_channel select option
const SOURCE_CHANNEL_MAP: Record<string, string> = {
  youtube: "Youtube",
  x: "Twitter (X)",
  instagram: "Instagram",
  newsletter: "Email",
  google: "Google Ads",
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const webhookUrl =
      body.lead_source === "pdf_5_errores_cripto"
        ? AIRTABLE_WEBHOOKS.pdf_5_errores
        : AIRTABLE_WEBHOOKS.masterclass;

    // Always normalize utm_campaign to match Airtable UTM table naming
    if (body.lead_source && LEAD_SOURCE_TO_CAMPAIGN[body.lead_source]) {
      body.utm_campaign = LEAD_SOURCE_TO_CAMPAIGN[body.lead_source];
    }

    // Provide default UTM values for organic/direct traffic so Airtable
    // always creates a UTM record linked to the Submission
    if (!body.utm_source) {
      body.utm_source = "website";
      body.utm_medium = "website";
      body.utm_campaign = body.utm_campaign || body.lead_source || "direct";
    }

    // Compute source_channel from utm_source so Airtable doesn't need conditional logic
    if (!body.source_channel) {
      body.source_channel =
        SOURCE_CHANNEL_MAP[body.utm_source] || "Formulario";
    }

    // Forward all fields to Airtable, including UTM params and computed source_channel
    const response = await fetch(webhookUrl, {
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
  } catch (error) {
    console.error("Lead capture error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
