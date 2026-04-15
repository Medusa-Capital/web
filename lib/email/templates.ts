// Plain HTML email templates. Spanish copy. No external image deps.
//
// Why HTML strings instead of React Email: 3 templates with simple
// structure, no need to bundle a renderer, easy to inspect at the wire.
// Move to react-email if templates grow past ~5 or need shared layouts.

import { STATUS_LABELS, type PostStatus } from "@/components/ideas/status";

const BG = "#0a0a0f";
const TEXT = "#e6e6f0";
const MUTED = "#9b9ab8";
const ACCENT = "#6366f1";

function escape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function layout(opts: {
  preheader: string;
  body: string;
  unsubscribeUrl: string;
}): string {
  return `<!doctype html>
<html lang="es">
<body style="margin:0;padding:0;background:${BG};color:${TEXT};font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Inter,sans-serif;">
  <span style="display:none;visibility:hidden;opacity:0;height:0;width:0;overflow:hidden;">${escape(opts.preheader)}</span>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BG};">
    <tr><td align="center" style="padding:32px 16px;">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;background:#0f0f17;border:1px solid rgba(99,102,241,0.2);border-radius:12px;">
        <tr><td style="padding:32px;">
          <h1 style="margin:0 0 24px;font-family:'Cormorant',Georgia,serif;font-size:26px;color:${TEXT};">Medusa Capital</h1>
          ${opts.body}
          <hr style="border:none;border-top:1px solid rgba(99,102,241,0.15);margin:32px 0 16px;">
          <p style="margin:0;font-size:12px;color:${MUTED};">
            ¿No quieres recibir más correos del tablero de ideas?
            <a href="${opts.unsubscribeUrl}" style="color:${MUTED};text-decoration:underline;">Date de baja</a>.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function button(href: string, label: string): string {
  return `<a href="${href}" style="display:inline-block;background:${ACCENT};color:#fff;text-decoration:none;font-weight:600;padding:10px 18px;border-radius:8px;font-size:14px;">${escape(label)}</a>`;
}

// ---------------------------------------------------------------------------
// New comment on your idea
// ---------------------------------------------------------------------------

export function newCommentEmail(opts: {
  recipientName: string | null;
  postTitle: string;
  postUrl: string;
  commenterName: string;
  commentBody: string;
  unsubscribeUrl: string;
}): { subject: string; html: string; text: string } {
  const subject = `Nuevo comentario en tu idea: ${opts.postTitle}`;
  const greeting = opts.recipientName ? `Hola ${escape(opts.recipientName)},` : "Hola,";

  const html = layout({
    preheader: `${opts.commenterName} comentó tu idea`,
    unsubscribeUrl: opts.unsubscribeUrl,
    body: `
      <p style="margin:0 0 16px;color:${TEXT};font-size:15px;line-height:1.6;">${greeting}</p>
      <p style="margin:0 0 16px;color:${TEXT};font-size:15px;line-height:1.6;">
        <strong>${escape(opts.commenterName)}</strong> comentó tu idea
        <em style="color:${MUTED};">"${escape(opts.postTitle)}"</em>:
      </p>
      <blockquote style="margin:0 0 24px;padding:12px 16px;border-left:3px solid ${ACCENT};background:rgba(99,102,241,0.06);color:${TEXT};font-size:14px;line-height:1.6;border-radius:0 6px 6px 0;">
        ${escape(opts.commentBody).replace(/\n/g, "<br>")}
      </blockquote>
      <p style="margin:0;">${button(opts.postUrl, "Ver el comentario")}</p>
    `,
  });

  const text = [
    greeting.replace(/<[^>]+>/g, ""),
    "",
    `${opts.commenterName} comentó tu idea "${opts.postTitle}":`,
    "",
    opts.commentBody,
    "",
    `Ver: ${opts.postUrl}`,
    "",
    `Date de baja: ${opts.unsubscribeUrl}`,
  ].join("\n");

  return { subject, html, text };
}

// ---------------------------------------------------------------------------
// Status change on a post you authored or voted for
// ---------------------------------------------------------------------------

export function statusChangeEmail(opts: {
  recipientName: string | null;
  postTitle: string;
  postUrl: string;
  fromStatus: PostStatus;
  toStatus: PostStatus;
  reason: string | null;
  unsubscribeUrl: string;
  isAuthor: boolean;
}): { subject: string; html: string; text: string } {
  const toLabel = STATUS_LABELS[opts.toStatus];
  const fromLabel = STATUS_LABELS[opts.fromStatus];
  const subject = `${toLabel}: ${opts.postTitle}`;
  const greeting = opts.recipientName ? `Hola ${escape(opts.recipientName)},` : "Hola,";

  const intro = opts.isAuthor
    ? `Tu idea <em style="color:${MUTED};">"${escape(opts.postTitle)}"</em> ahora está marcada como <strong>${escape(toLabel)}</strong>.`
    : `Una idea que votaste <em style="color:${MUTED};">"${escape(opts.postTitle)}"</em> ahora está marcada como <strong>${escape(toLabel)}</strong>.`;

  const reasonBlock = opts.reason
    ? `<blockquote style="margin:16px 0 24px;padding:12px 16px;border-left:3px solid ${ACCENT};background:rgba(99,102,241,0.06);color:${TEXT};font-size:14px;line-height:1.6;border-radius:0 6px 6px 0;">${escape(opts.reason).replace(/\n/g, "<br>")}</blockquote>`
    : `<div style="margin:16px 0;"></div>`;

  const html = layout({
    preheader: `${fromLabel} → ${toLabel}`,
    unsubscribeUrl: opts.unsubscribeUrl,
    body: `
      <p style="margin:0 0 16px;color:${TEXT};font-size:15px;line-height:1.6;">${greeting}</p>
      <p style="margin:0 0 8px;color:${TEXT};font-size:15px;line-height:1.6;">${intro}</p>
      <p style="margin:0;color:${MUTED};font-size:13px;">Antes: ${escape(fromLabel)}</p>
      ${reasonBlock}
      <p style="margin:0;">${button(opts.postUrl, "Ver la idea")}</p>
    `,
  });

  const text = [
    greeting.replace(/<[^>]+>/g, ""),
    "",
    opts.isAuthor
      ? `Tu idea "${opts.postTitle}" ahora está marcada como ${toLabel} (antes: ${fromLabel}).`
      : `Una idea que votaste "${opts.postTitle}" ahora está marcada como ${toLabel} (antes: ${fromLabel}).`,
    opts.reason ? `\n${opts.reason}\n` : "",
    `Ver: ${opts.postUrl}`,
    "",
    `Date de baja: ${opts.unsubscribeUrl}`,
  ].join("\n");

  return { subject, html, text };
}
