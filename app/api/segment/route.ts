import { NextRequest, NextResponse } from "next/server";

const VALID_SEGMENTS = ["beginner", "intermediate", "advanced"] as const;

const SEGMENT_LABELS: Record<string, string> = {
  beginner: "Principiante",
  intermediate: "Intermedio",
  advanced: "Avanzado",
};

export async function POST(request: NextRequest) {
  try {
    const { email, segment } = await request.json();

    if (!email || !segment) {
      return NextResponse.json(
        { error: "Missing email or segment" },
        { status: 400 }
      );
    }

    if (!VALID_SEGMENTS.includes(segment)) {
      return NextResponse.json(
        { error: "Invalid segment" },
        { status: 400 }
      );
    }

    const webhookUrl = process.env.AIRTABLE_SEGMENT_WEBHOOK_URL;
    if (!webhookUrl) {
      console.error("AIRTABLE_SEGMENT_WEBHOOK_URL not configured");
      return NextResponse.json(
        { error: "Webhook not configured" },
        { status: 500 }
      );
    }

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        segment: SEGMENT_LABELS[segment],
      }),
    });

    if (!response.ok) {
      console.error("Airtable segment webhook failed:", response.status);
      return NextResponse.json(
        { error: "Failed to update segment" },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Segment API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
