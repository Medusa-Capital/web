import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";

// --- Airtable config ---

const AIRTABLE_BASE_ID = "appOy27N5Wx2OdFX3";
const AIRTABLE_API_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}`;

const TABLE = {
  people: "tblfMh8VJ7kk9vVZf",
  bookings: "tbldExV63rXedIKHe",
} as const;

const FIELD = {
  // People
  people_email_raw: "fldb3Oy4wPCuH3Ca2",
  people_first_name: "flddXG9EvIyOlqnqK",
  people_last_name: "fld0sN8MkbtpIVIq2",
  people_lifecycle: "fldnF6fQPYMZu5JfO",
  people_source_channel: "fld9Ae6Fm7NneTJCd",
  // Bookings
  bookings_persona: "fldE6SVbjftpUYill",
  bookings_source: "fldFWXvjJGmP8FX9c",
  bookings_event_type: "fldPP3nG8IC3jDL4F",
  bookings_status: "fldGSZddUDVA93bbr",
  bookings_scheduled_at: "fldVCst98xn5cJZhb",
  bookings_cancelled_at: "fldY4uG6CB1iBnDUX",
  bookings_cancel_reason: "fldvXInPywZ13WUVK",
  bookings_utm_source: "fldiVOVpSoD9rLrU7",
  bookings_utm_medium: "fldt9kFCDpXj3Xi80",
  bookings_utm_campaign: "fldYaMFO4l3gBFVjB",
  bookings_utm_content: "fldOY9KZ0yrPnr48p",
  bookings_utm_term: "fldLvZEr7IothDnph",
  bookings_owner: "fldjHm5s8bag4DXea",
  bookings_calendly_uri: "fldzWjX9HyTLqb2Du",
  bookings_raw_payload: "fld8zAvufIRsUOzsa",
} as const;

// Same mapping as lead-capture/route.ts
const SOURCE_CHANNEL_MAP: Record<string, string> = {
  youtube: "Youtube",
  x: "Twitter (X)",
  instagram: "Instagram",
  newsletter: "Email",
  google: "Google Ads",
  telegram: "Telegram",
};

// Map Calendly host emails to Equipo record IDs.
// Shared account maps to Axel by default. Add individual emails if
// Calendly event_memberships exposes per-user emails in the future.
const OWNER_MAP: Record<string, string> = {
  "contacto@medusacapital.xyz": "recZAkBzAMtR6pgOy", // Axel (shared account)
};

// --- Helpers ---

function titleCase(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

function verifySignature(
  payload: string,
  header: string,
  secret: string
): boolean {
  try {
    const parts = header.split(",");
    const tPart = parts.find((p) => p.startsWith("t="));
    const v1Part = parts.find((p) => p.startsWith("v1="));
    if (!tPart || !v1Part) return false;

    const timestamp = tPart.slice(2);
    const signature = v1Part.slice(3);
    const data = `${timestamp}.${payload}`;
    const expected = createHmac("sha256", secret).update(data).digest("hex");

    return timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  } catch {
    return false;
  }
}

async function airtableRequest(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = process.env.AIRTABLE_API_TOKEN;
  if (!token) throw new Error("AIRTABLE_API_TOKEN not configured");

  return fetch(`${AIRTABLE_API_URL}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
}

async function airtableSearch(
  tableId: string,
  formula: string
): Promise<Array<{ id: string; fields: Record<string, unknown> }>> {
  const params = new URLSearchParams({ filterByFormula: formula, maxRecords: "5" });
  const res = await airtableRequest(`/${tableId}?${params}`);
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Airtable search failed: ${res.status} ${err}`);
  }
  const data = await res.json();
  return data.records;
}

async function airtableCreate(
  tableId: string,
  fields: Record<string, unknown>
): Promise<{ id: string; fields: Record<string, unknown> }> {
  const res = await airtableRequest(`/${tableId}`, {
    method: "POST",
    body: JSON.stringify({ fields }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Airtable create failed: ${res.status} ${err}`);
  }
  return res.json();
}

async function airtableUpdate(
  tableId: string,
  recordId: string,
  fields: Record<string, unknown>
): Promise<void> {
  const res = await airtableRequest(`/${tableId}/${recordId}`, {
    method: "PATCH",
    body: JSON.stringify({ fields }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Airtable update failed: ${res.status} ${err}`);
  }
}

// --- Webhook handler ---

async function handleInviteeCreated(
  payload: Record<string, unknown>
): Promise<void> {
  const invitee = payload as {
    email: string;
    name: string;
    event: string;
    scheduled_event: { name: string; start_time: string; event_memberships: Array<{ user_email: string }> };
    tracking: { utm_source?: string; utm_medium?: string; utm_campaign?: string; utm_content?: string; utm_term?: string };
  };

  const eventUri = invitee.event;
  const email = invitee.email.toLowerCase().trim();
  const name = titleCase(invitee.name);
  const [firstName, ...lastParts] = name.split(" ");
  const lastName = lastParts.join(" ");
  const tracking = invitee.tracking || {};
  const hostEmail = invitee.scheduled_event?.event_memberships?.[0]?.user_email;

  // Idempotency: check if booking already exists
  const existingBookings = await airtableSearch(
    TABLE.bookings,
    `{Calendly event URI} = "${eventUri}"`
  );
  if (existingBookings.length > 0) {
    console.log(`Duplicate webhook: booking already exists for ${eventUri}`);
    return;
  }

  // Find or create Person
  let personId: string;
  const people = await airtableSearch(
    TABLE.people,
    `LOWER({email_raw}) = "${email}"`
  );

  if (people.length === 0) {
    // Create new Person
    const sourceChannel = SOURCE_CHANNEL_MAP[tracking.utm_source || ""];
    const fields: Record<string, unknown> = {
      [FIELD.people_first_name]: firstName,
      [FIELD.people_last_name]: lastName || undefined,
      [FIELD.people_email_raw]: email,
      [FIELD.people_lifecycle]: "Engaged",
    };
    if (sourceChannel) {
      fields[FIELD.people_source_channel] = sourceChannel;
    }
    const created = await airtableCreate(TABLE.people, fields);
    personId = created.id;
  } else {
    personId = people[0].id;
    const lifecycle = people[0].fields[FIELD.people_lifecycle] as
      | { name: string }
      | undefined;
    const lifecycleName = lifecycle?.name;

    // Promote Lead or empty to Engaged (never downgrade)
    if (!lifecycleName || lifecycleName === "Lead") {
      await airtableUpdate(TABLE.people, personId, {
        [FIELD.people_lifecycle]: "Engaged",
      });
    }
  }

  // Map owner from Calendly host
  const ownerId = hostEmail ? OWNER_MAP[hostEmail.toLowerCase()] : undefined;

  // Create Booking
  const bookingFields: Record<string, unknown> = {
    [FIELD.bookings_persona]: [personId],
    [FIELD.bookings_source]: "Calendly",
    [FIELD.bookings_event_type]: invitee.scheduled_event?.name || "",
    [FIELD.bookings_status]: "Agendada",
    [FIELD.bookings_scheduled_at]: invitee.scheduled_event?.start_time,
    [FIELD.bookings_calendly_uri]: eventUri,
    [FIELD.bookings_raw_payload]: JSON.stringify(payload).slice(0, 99000),
  };

  if (tracking.utm_source) bookingFields[FIELD.bookings_utm_source] = tracking.utm_source;
  if (tracking.utm_medium) bookingFields[FIELD.bookings_utm_medium] = tracking.utm_medium;
  if (tracking.utm_campaign) bookingFields[FIELD.bookings_utm_campaign] = tracking.utm_campaign;
  if (tracking.utm_content) bookingFields[FIELD.bookings_utm_content] = tracking.utm_content;
  if (tracking.utm_term) bookingFields[FIELD.bookings_utm_term] = tracking.utm_term;
  if (ownerId) bookingFields[FIELD.bookings_owner] = [ownerId];

  await airtableCreate(TABLE.bookings, bookingFields);
}

async function handleInviteeCanceled(
  payload: Record<string, unknown>
): Promise<void> {
  const invitee = payload as {
    event: string;
    cancellation: { canceled_by: string; reason: string };
  };

  const eventUri = invitee.event;
  const cancellation = invitee.cancellation || { canceled_by: "", reason: "" };
  const isReschedule = (cancellation.reason || "").toLowerCase().includes("reschedule");

  const bookings = await airtableSearch(
    TABLE.bookings,
    `{Calendly event URI} = "${eventUri}"`
  );

  if (bookings.length === 0) {
    console.warn(`Cancellation for unknown booking: ${eventUri}`);
    return;
  }

  await airtableUpdate(TABLE.bookings, bookings[0].id, {
    [FIELD.bookings_status]: isReschedule ? "Re-agendada" : "Cancelada",
    [FIELD.bookings_cancelled_at]: new Date().toISOString(),
    [FIELD.bookings_cancel_reason]: cancellation.reason || cancellation.canceled_by || "",
  });
}

// --- Route ---

export async function POST(request: NextRequest) {
  const secret = process.env.CALENDLY_WEBHOOK_SECRET;
  if (!secret) {
    console.error("CALENDLY_WEBHOOK_SECRET not configured");
    return NextResponse.json({ error: "Not configured" }, { status: 500 });
  }

  // Read raw body for signature verification
  const rawBody = await request.text();
  const signature = request.headers.get("calendly-webhook-signature") || "";

  if (!verifySignature(rawBody, signature, secret)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
  }

  const body = JSON.parse(rawBody);
  const event = body.event as string;
  const payload = body.payload as Record<string, unknown>;

  try {
    if (event === "invitee.created") {
      await handleInviteeCreated(payload);
    } else if (event === "invitee.canceled") {
      await handleInviteeCanceled(payload);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(`Calendly webhook error (${event}):`, error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
