import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";

// --- Airtable config ---

const AIRTABLE_BASE_ID = "appOy27N5Wx2OdFX3";
const AIRTABLE_API_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}`;

const TABLE = {
  people: "tblfMh8VJ7kk9vVZf",
  bookings: "tbldExV63rXedIKHe",
  submissions: "tblsb2EHPks208wQ8",
  answers: "tbljgkuPhHpWw6MDr",
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
  bookings_submission: "fldJBLqhyfDBCHh2Y",
  // Submissions
  submissions_person: "fldmlyQBRBr95TlLg",
  submissions_form_version: "fldA30BPQNBOqEdRf",
  submissions_submitted_at: "fldDtsNxl7lURPFZc",
  submissions_utm_source: "fldwR4eFvPT2RmV0K",
  submissions_utm_medium: "fld8Y4rXRLDqGiyLh",
  submissions_utm_campaign: "fldk3C1YCqPZGYPRv",
  submissions_utm_content: "fldoIpAN2CLWLEKfM",
  submissions_utm_term: "fldupzTStyPuONKd6",
  submissions_raw_payload: "fldXcorI85omM8EpI",
  // Answers
  answers_submission: "fldZhvAuGInrLK0da",
  answers_question: "fldYddbALGlOYITa3",
  answers_option: "fld0lt1NTeiCOMfkS",
  answers_answer_text: "fldtwdwb2QMXX4uw6",
  answers_captured_at: "fldv6ASAwE3aCIWcw",
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

// Live Calendly Form Version ID (v1, 2026-04-20). When Calendly questions change:
// create a new Form Version in Airtable + new Question records, archive the prior
// version, update this constant, and redeploy.
const CALENDLY_LIVE_FORM_VERSION_ID = "recbVJCYRsHd75T9i";

// Question text (exact match from Calendly payload) → Airtable Question record ID.
// Add entries here when new questions are added to the Calendly form.
const CALENDLY_QUESTION_MAP: Record<string, string> = {
  "Para preparar bien la sesión y no hacerte perder el tiempo, ¿en qué rango se mueve tu cartera cripto actual?":
    "recCcgosQ6P6IDxbd",
  '¿Cuál es tu objetivo económico concreto con cripto a 2-3 años? (ej: "llegar a 100k", "generar 1.500€/mes")':
    "recduXlPJlhO1xQrL",
  "¿Cuál describe mejor tu situación actual?": "recCMWd4EUzUors1a",
  "¿Cuál ha sido tu mayor error o pérdida en cripto hasta ahora? Sé concreto.":
    "recrXkyiCx1RJPVED",
  "¿Hay algo concreto que quieras resolver en esta llamada?": "recuKImcMKBgITsp7",
  "Acepto recibir material relacionado con la sesión por WhatsApp":
    "recw6fPiS3nXblMCW",
};
// Fallback for questions not yet in the map — preserves data without losing context.
const CAL_UNMAPPED_QUESTION_ID = "recq8Z9BSU6VjNHOo";

// For select-type Calendly questions, map the exact answer text → Option record ID
// so Answers link to an Option (like other forms) instead of storing free text.
// Free-text questions (goal, biggest mistake, call objective) are absent from this map
// and fall through to answer_text. If Calendly's option label drifts (typo fix, emoji,
// etc.) the match will miss → we log + fall back to answer_text instead of failing.
const CALENDLY_OPTION_MAP: Record<string, Record<string, string>> = {
  // cal_portfolio_range_v1
  recCcgosQ6P6IDxbd: {
    "Menos de 5.000€": "rectHW0Sx4VYYLdCb",
    "Entre 5.000€ y 20.000€": "recdBo56T9IuXxGuP",
    "Entre 20.000€ y 50.000€": "recbjUcoRGwKoI9Dg",
    "Más de 50.000€": "recVUUOKn2q7W3u0U",
  },
  // cal_situation_v1
  recCMWd4EUzUors1a: {
    "Llevo tiempo invirtiendo pero sin sistema, y he tenido pérdidas importantes":
      "recD1lCdncu2M8eKK",
    "Invierto pero sigo señales de otros sin entender bien por qué":
      "recPdQdGVN56dqI0J",
    "Tengo capital pero no sé cómo empezar de forma seria": "recvlSwHHOsMc1O4F",
    "Estoy en otra comunidad pero no estoy obteniendo resultados":
      "recBojxbaYjkxQ0Da",
  },
  // cal_whatsapp_consent_v1
  recw6fPiS3nXblMCW: {
    Si: "reclZKUa52MrNVVB1",
    No: "recdphH0v9N3INoJ0",
  },
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

async function airtableBatchCreate(
  tableId: string,
  records: Array<Record<string, unknown>>
): Promise<void> {
  if (records.length === 0) return;
  // Airtable supports up to 10 records per batch request.
  for (let i = 0; i < records.length; i += 10) {
    const batch = records.slice(i, i + 10);
    const res = await airtableRequest(`/${tableId}`, {
      method: "POST",
      body: JSON.stringify({ records: batch.map((fields) => ({ fields })) }),
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Airtable batch create failed: ${res.status} ${err}`);
    }
  }
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

// --- Calendly-specific write helpers ---

async function createSubmission(
  personId: string,
  tracking: {
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_content?: string;
    utm_term?: string;
  },
  rawPayload: string
): Promise<string> {
  const fields: Record<string, unknown> = {
    [FIELD.submissions_person]: [personId],
    [FIELD.submissions_form_version]: [CALENDLY_LIVE_FORM_VERSION_ID],
    [FIELD.submissions_submitted_at]: new Date().toISOString(),
    [FIELD.submissions_raw_payload]: rawPayload.slice(0, 99000),
  };
  if (tracking.utm_source) fields[FIELD.submissions_utm_source] = tracking.utm_source;
  if (tracking.utm_medium) fields[FIELD.submissions_utm_medium] = tracking.utm_medium;
  if (tracking.utm_campaign) fields[FIELD.submissions_utm_campaign] = tracking.utm_campaign;
  if (tracking.utm_content) fields[FIELD.submissions_utm_content] = tracking.utm_content;
  if (tracking.utm_term) fields[FIELD.submissions_utm_term] = tracking.utm_term;
  const created = await airtableCreate(TABLE.submissions, fields);
  return created.id;
}

async function createAnswersForBooking(
  submissionId: string,
  questionsAndAnswers: Array<{ question: string; answer: string; position: number }>
): Promise<void> {
  if (questionsAndAnswers.length === 0) return;
  const now = new Date().toISOString();
  const records = questionsAndAnswers.map(({ question, answer }) => {
    const questionId = CALENDLY_QUESTION_MAP[question];
    if (!questionId) {
      console.warn(`Unmapped Calendly question (update CALENDLY_QUESTION_MAP): "${question}"`);
    }
    const resolvedQuestionId = questionId ?? CAL_UNMAPPED_QUESTION_ID;
    const optionId = questionId
      ? CALENDLY_OPTION_MAP[questionId]?.[answer.trim()]
      : undefined;

    // Log option drift so we can add the missing label to the map.
    if (questionId && CALENDLY_OPTION_MAP[questionId] && !optionId) {
      console.warn(
        `Unmapped Calendly option for question "${question}" (update CALENDLY_OPTION_MAP): "${answer}"`
      );
    }

    const fields: Record<string, unknown> = {
      [FIELD.answers_submission]: [submissionId],
      [FIELD.answers_question]: [resolvedQuestionId],
      [FIELD.answers_captured_at]: now,
    };
    if (optionId) {
      fields[FIELD.answers_option] = [optionId];
    } else {
      fields[FIELD.answers_answer_text] = questionId ? answer : `[${question}]: ${answer}`;
    }
    return fields;
  });
  await airtableBatchCreate(TABLE.answers, records);
}

// --- Webhook handler ---

async function handleInviteeCreated(
  payload: Record<string, unknown>
): Promise<void> {
  const invitee = payload as {
    email: string;
    name: string;
    event: string;
    scheduled_event: {
      name: string;
      start_time: string;
      event_memberships: Array<{ user_email: string }>;
    };
    tracking: {
      utm_source?: string;
      utm_medium?: string;
      utm_campaign?: string;
      utm_content?: string;
      utm_term?: string;
    };
    questions_and_answers?: Array<{
      question: string;
      answer: string;
      position: number;
    }>;
  };

  const eventUri = invitee.event;
  const email = invitee.email.toLowerCase().trim();
  const name = titleCase(invitee.name);
  const [firstName, ...lastParts] = name.split(" ");
  const lastName = lastParts.join(" ");
  const tracking = invitee.tracking || {};
  const hostEmail = invitee.scheduled_event?.event_memberships?.[0]?.user_email;

  // Idempotency: check if booking already exists (fires before any write)
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

  const rawPayload = JSON.stringify(payload);

  // Create Submission (before Booking — if Booking fails, orphaned Submission is
  // traceable in Airtable and cleanable manually)
  const submissionId = await createSubmission(personId, tracking, rawPayload);

  // Create one Answer per Q&A entry from the Calendly form
  await createAnswersForBooking(
    submissionId,
    invitee.questions_and_answers ?? []
  );

  // Map owner from Calendly host
  const ownerId = hostEmail ? OWNER_MAP[hostEmail.toLowerCase()] : undefined;

  // Create Booking, linked to the Submission
  const bookingFields: Record<string, unknown> = {
    [FIELD.bookings_persona]: [personId],
    [FIELD.bookings_source]: "Calendly",
    [FIELD.bookings_event_type]: invitee.scheduled_event?.name || "",
    [FIELD.bookings_status]: "Agendada",
    [FIELD.bookings_scheduled_at]: invitee.scheduled_event?.start_time,
    [FIELD.bookings_calendly_uri]: eventUri,
    [FIELD.bookings_raw_payload]: rawPayload.slice(0, 99000),
    [FIELD.bookings_submission]: [submissionId],
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
  const rawBody = await request.text();

  // Signature verification is only enforced when both the secret env var is
  // set AND Calendly includes the header (signing is plan-dependent).
  const secret = process.env.CALENDLY_WEBHOOK_SECRET;
  const signature = request.headers.get("calendly-webhook-signature") || "";
  if (secret && signature) {
    if (!verifySignature(rawBody, signature, secret)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
    }
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
