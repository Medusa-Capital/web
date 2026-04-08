import { NextRequest, NextResponse } from "next/server";

const AIRTABLE_WEBHOOKS = {
  masterclass: process.env.AIRTABLE_WEBHOOK_MASTERCLASS,
  pdf_5_errores: process.env.AIRTABLE_WEBHOOK_PDF_5_ERRORES,
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
  telegram: "Telegram",
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const webhookUrl =
      body.lead_source === "pdf_5_errores_cripto"
        ? AIRTABLE_WEBHOOKS.pdf_5_errores
        : AIRTABLE_WEBHOOKS.masterclass;

    if (!webhookUrl) {
      return NextResponse.json(
        { error: "Webhook not configured" },
        { status: 500 }
      );
    }

    // Defensive: some URL shorteners (e.g. TinyURL) encode ampersands in
    // redirects, causing URLSearchParams to jam all UTM params into
    // utm_source as one concatenated string like
    // "telegram&utm_medium=social&utm_campaign=...". Detect and re-parse.
    if (body.utm_source && body.utm_source.includes("&utm_")) {
      const reparsed = new URLSearchParams(
        body.utm_source.replace(/^([^&]+)/, "utm_source=$1")
      );
      body.utm_source = reparsed.get("utm_source") || body.utm_source;
      if (reparsed.has("utm_medium")) body.utm_medium = reparsed.get("utm_medium");
      if (reparsed.has("utm_campaign")) body.utm_campaign = reparsed.get("utm_campaign");
      if (reparsed.has("utm_term")) body.utm_term = reparsed.get("utm_term");
      if (reparsed.has("utm_content")) {
        // Strip any trailing URL fragment (e.g. #5-errores-cripto)
        body.utm_content = (reparsed.get("utm_content") || "").replace(/#.*$/, "");
      }
    }

    // Provide default UTM values for organic/direct traffic so Airtable
    // always creates a UTM record linked to the Submission.
    // Only override when no UTM params exist — preserve original UTM params
    // from campaign links (e.g. Telegram, Instagram) so they match the
    // correct UTM record in Airtable.
    if (!body.utm_source) {
      body.utm_source = "website";
      body.utm_medium = "website";
      body.utm_campaign =
        LEAD_SOURCE_TO_CAMPAIGN[body.lead_source] ||
        body.lead_source ||
        "direct";
    }

    // Compute source_channel from utm_source so Airtable doesn't need conditional logic
    if (!body.source_channel) {
      body.source_channel =
        SOURCE_CHANNEL_MAP[body.utm_source] || "Formulario";
    }

    // Forward all fields to Airtable, including UTM params and computed source_channel
    const response = await fetch(webhookUrl as string, {
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
