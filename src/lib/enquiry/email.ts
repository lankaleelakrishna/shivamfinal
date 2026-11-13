import nodemailer, { type Transporter } from "nodemailer";
import type { FormTabId } from "@/lib/forms";
import type { EnquiryRow, ValidEnquiry } from "./validation";

/**
 * Builds and sends the enquiry notification through Gmail SMTP (Nodemailer).
 * Server-only. GMAIL_APP_PASSWORD must never reach client code.
 */

const SUBJECTS: Record<FormTabId, string> = {
  hire: "New Hire Talent Enquiry – Shivam Technologies",
  app: "New App Development Quote Request – Shivam Technologies",
  job: "New Job Seeker Enquiry – Shivam Technologies",
};

const CATEGORIES: Record<FormTabId, string> = {
  hire: "Hire Talent Enquiry",
  app: "App Development Quote Request",
  job: "Job Seeker Enquiry",
};

export interface EnquiryConfig {
  gmailUser: string;
  appPassword: string;
  to: string[];
}

const GMAIL_SMTP = { host: "smtp.gmail.com", port: 465, secure: true } as const;
const EMAIL_RE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

/**
 * Reads and validates configuration from the environment.
 * Logs only variable names and problem types, never values.
 */
export function readEnquiryConfig(): EnquiryConfig | null {
  const gmailUser = process.env.GMAIL_USER?.trim() ?? "";
  // Google shows app passwords in groups of four with spaces. Spaces are not part of the password.
  const appPassword = (process.env.GMAIL_APP_PASSWORD ?? "").replace(/\s+/g, "");
  const toRaw = process.env.ENQUIRY_TO_EMAIL?.trim() ?? "";
  const to = toRaw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const missing = [
    ["GMAIL_USER", gmailUser],
    ["GMAIL_APP_PASSWORD", appPassword],
    ["ENQUIRY_TO_EMAIL", toRaw],
  ]
    .filter(([, value]) => !value)
    .map(([name]) => name);

  if (missing.length > 0) {
    console.error(`[enquiries] Missing environment variables: ${missing.join(", ")}`);
    return null;
  }

  const invalid: string[] = [];
  if (!EMAIL_RE.test(gmailUser)) invalid.push("GMAIL_USER");
  if (to.some((addr) => !EMAIL_RE.test(addr))) invalid.push("ENQUIRY_TO_EMAIL");
  if (appPassword.length !== 16) invalid.push("GMAIL_APP_PASSWORD (expected 16 characters)");
  if (invalid.length > 0) {
    console.error(`[enquiries] Invalid environment variables: ${invalid.join(", ")}`);
    return null;
  }

  return { gmailUser, appPassword, to };
}

/** Created per send and closed afterwards: a serverless instance should not keep SMTP sockets open. */
function createTransporter(config: EnquiryConfig): Transporter {
  return nodemailer.createTransport({
    ...GMAIL_SMTP,
    auth: { user: config.gmailUser, pass: config.appPassword },
    pool: false,
    // Fail fast so the visitor gets an answer well inside the Vercel function limit.
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
  });
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function formatIst(date: Date): string {
  const formatted = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).format(date);
  return `${formatted} IST`;
}

const NOT_PROVIDED = "Not provided";

function valueHtml(row: EnquiryRow): string {
  if (!row.value) return `<span style="color:#8a94a1;">${NOT_PROVIDED}</span>`;
  const escaped = escapeHtml(row.value);
  return row.multiline ? escaped.replace(/\r?\n/g, "<br>") : escaped;
}

function tableRow(label: string, valueMarkup: string): string {
  return `<tr>
  <td style="padding:10px 0;width:38%;vertical-align:top;font-size:13px;font-weight:bold;color:#56606d;border-bottom:1px solid #eef1f5;">${escapeHtml(label)}</td>
  <td style="padding:10px 0;vertical-align:top;font-size:15px;color:#1d2733;border-bottom:1px solid #eef1f5;">${valueMarkup}</td>
</tr>`;
}

function section(title: string, body: string): string {
  return `<tr><td style="padding:20px 28px 0;">
  <p style="margin:0 0 8px;font-size:12px;font-weight:bold;letter-spacing:.08em;text-transform:uppercase;color:#6b7785;">${escapeHtml(title)}</p>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">${body}</table>
</td></tr>`;
}

export function buildEnquiryEmail(enquiry: ValidEnquiry, submittedAt: Date): { subject: string; html: string; text: string } {
  const subject = SUBJECTS[enquiry.form];
  const category = CATEGORIES[enquiry.form];
  const submitted = formatIst(submittedAt);

  const contactFields: Array<[string, string]> = [
    ["Name", enquiry.values.name ?? ""],
    ["Email", enquiry.values.email ?? ""],
    ["Phone", enquiry.values.phone ?? ""],
    ["Company", enquiry.values.company ?? ""],
  ];
  const contactRows = contactFields.filter(([, v]) => v !== "");

  const contactHtml = contactRows
    .map(([label, value]) => {
      const markup =
        label === "Email"
          ? `<a href="mailto:${escapeHtml(value)}" style="color:#0b5cad;">${escapeHtml(value)}</a>`
          : escapeHtml(value);
      return tableRow(label, markup);
    })
    .join("\n");

  const detailsHtml = enquiry.rows.map((row) => tableRow(row.label, valueHtml(row))).join("\n");

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background:#f3f5f8;font-family:Arial,Helvetica,sans-serif;color:#1d2733;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f5f8;padding:24px 12px;">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;background:#ffffff;border:1px solid #dfe5ec;border-radius:12px;">
<tr><td style="padding:24px 28px;border-bottom:1px solid #e6ebf1;">
  <p style="margin:0;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#6b7785;">Shivam Technologies · Website enquiry</p>
  <h1 style="margin:6px 0 0;font-size:22px;line-height:1.3;color:#14243a;">${escapeHtml(category)}</h1>
</td></tr>
<tr><td style="padding:20px 28px 0;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
    ${tableRow("Enquiry type", escapeHtml(category))}
    ${tableRow("Submitted", escapeHtml(submitted))}
  </table>
</td></tr>
${section("Sender contact", contactHtml)}
${section("Submitted details", detailsHtml)}
<tr><td style="padding:24px 28px 28px;">
  <p style="margin:0;font-size:12px;line-height:1.5;color:#6b7785;">${
    enquiry.values.email
      ? "Reply to this email to contact the sender directly."
      : "This sender did not share an email address. Use the phone number above."
  }</p>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;

  const textLines = [
    category,
    "Shivam Technologies, website enquiry",
    "",
    `Submitted: ${submitted}`,
    "",
    "SENDER CONTACT",
    ...contactRows.map(([label, value]) => `${label}: ${value}`),
    "",
    "SUBMITTED DETAILS",
    ...enquiry.rows.map((row) => `${row.label}: ${row.value || NOT_PROVIDED}`),
  ];

  return { subject, html, text: textLines.join("\n") };
}

export type SendOutcome = { ok: true } | { ok: false };

/** Nodemailer reports accepted and rejected recipients as strings or address objects. */
function addressOf(entry: string | { address: string }): string {
  return (typeof entry === "string" ? entry : entry.address).toLowerCase();
}

export async function sendEnquiryEmail(
  enquiry: ValidEnquiry,
  config: EnquiryConfig,
  now: Date = new Date(),
): Promise<SendOutcome> {
  const { subject, html, text } = buildEnquiryEmail(enquiry, now);
  const transporter = createTransporter(config);

  try {
    const info = await transporter.sendMail({
      from: { name: "Shivam Technologies Website", address: config.gmailUser },
      to: config.to,
      // Replies go to the visitor. Job Seeker has no email field, so none is set there.
      replyTo: enquiry.values.email || undefined,
      subject,
      html,
      text,
      attachments: enquiry.resume
        ? [{ filename: enquiry.resume.filename, content: enquiry.resume.content, contentType: enquiry.resume.contentType }]
        : undefined,
    });

    // SMTP accepted the message only if every recipient was accepted and none was rejected.
    const acceptedList = info.accepted ?? [];
    const rejectedList = info.rejected ?? [];
    const accepted = new Set(acceptedList.map(addressOf));
    const allAccepted = config.to.every((addr) => accepted.has(addr.toLowerCase()));
    if (!allAccepted || rejectedList.length > 0) {
      console.error(`[enquiries] SMTP did not accept all recipients for ${enquiry.form} enquiry`);
      return { ok: false };
    }
    return { ok: true };
  } catch (err) {
    // Log the error class and SMTP reply code only. Messages can echo server text.
    const code = (err as { code?: string })?.code ?? "UNKNOWN";
    const responseCode = (err as { responseCode?: number })?.responseCode;
    const reason =
      code === "EAUTH"
        ? "authentication failed: check GMAIL_USER and GMAIL_APP_PASSWORD"
        : `code ${code}${responseCode ? `, SMTP ${responseCode}` : ""}`;
    console.error(`[enquiries] Gmail SMTP send failed for ${enquiry.form} enquiry (${reason})`);
    return { ok: false };
  } finally {
    transporter.close();
  }
}
