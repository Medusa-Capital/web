// Resend client wrapper.
//
// All sends fail soft: we log via captureError and return false rather than
// throwing. Email failures must never block the underlying user action
// (comment, status change). Email fanout reliability is a v2 concern (outbox).

import { Resend } from "resend";
import { captureError } from "@/lib/logger";

function requireEnv(name: string): string {
  const val = process.env[name];
  if (!val) throw new Error(`${name} environment variable is not set`);
  return val;
}

let _resend: Resend | null = null;

function getResend(): Resend {
  if (!_resend) _resend = new Resend(requireEnv("RESEND_API_KEY"));
  return _resend;
}

export interface SendEmailInput {
  to: string;
  subject: string;
  html: string;
  text?: string;
  // List-Unsubscribe headers help inbox providers honor unsubscribe.
  listUnsubscribeUrl?: string;
}

export async function sendEmail(input: SendEmailInput): Promise<boolean> {
  const from = requireEnv("EMAIL_FROM");

  try {
    const headers: Record<string, string> = {};
    if (input.listUnsubscribeUrl) {
      headers["List-Unsubscribe"] = `<${input.listUnsubscribeUrl}>`;
      headers["List-Unsubscribe-Post"] = "List-Unsubscribe=One-Click";
    }

    const res = await getResend().emails.send({
      from,
      to: input.to,
      subject: input.subject,
      html: input.html,
      text: input.text,
      headers,
    });

    if (res.error) {
      await captureError(new Error(res.error.message), {
        step: "resend_send",
        to: input.to,
        subject: input.subject,
      });
      return false;
    }
    return true;
  } catch (err) {
    await captureError(err, {
      step: "resend_send",
      to: input.to,
      subject: input.subject,
    });
    return false;
  }
}
