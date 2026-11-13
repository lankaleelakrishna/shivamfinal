import { NextResponse } from "next/server";
import { readEnquiryConfig, sendEnquiryEmail } from "@/lib/enquiry/email";
import { checkRateLimit, claimSubmission, releaseSubmission } from "@/lib/enquiry/store";
import { MAX_BODY_BYTES, parseEnquiry } from "@/lib/enquiry/validation";

/**
 * POST /api/enquiries
 *
 * Vercel Serverless Function (Node runtime). Validates a submission from any
 * of the three enquiry forms and emails it through Gmail SMTP (Nodemailer). Nothing is stored.
 * Responses never include internal errors, credentials, or SMTP server responses.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MSG = {
  success: "Thank you. Your enquiry has been sent. We will get back to you shortly.",
  tooMany: "You have sent several enquiries in a short time. Please wait a few minutes and try again.",
  tooLarge: "Your submission is too large. Please remove the attachment or shorten your message and try again.",
  badRequest: "We could not read your submission. Please refresh the page and try again.",
  forbidden: "Your request could not be verified. Please refresh the page and try again.",
  delivery: "We could not send your enquiry right now. Your details are still in the form, so please try again in a few minutes.",
  unavailable: "Enquiries are temporarily unavailable. Please try again later or contact us directly.",
} as const;

function json(status: number, body: Record<string, unknown>, headers?: Record<string, string>) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });
}

/** Browsers send Origin on cross-site POSTs. Requests from another site are refused. */
function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    return origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}

/** Vercel sets x-vercel-forwarded-for itself, so clients cannot forge it. */
function clientKey(request: Request): string {
  const h = request.headers;
  const first = (v: string | null) => v?.split(",")[0]?.trim() || undefined;
  return first(h.get("x-vercel-forwarded-for")) ?? h.get("x-real-ip")?.trim() ?? first(h.get("x-forwarded-for")) ?? "unknown";
}

export async function POST(request: Request) {
  try {
    if (!isSameOrigin(request)) {
      return json(403, { ok: false, message: MSG.forbidden });
    }

    const limit = checkRateLimit(clientKey(request));
    if (!limit.ok) {
      return json(429, { ok: false, message: MSG.tooMany }, { "Retry-After": String(limit.retryAfterSeconds) });
    }

    const declared = Number(request.headers.get("content-length") ?? "0");
    if (Number.isFinite(declared) && declared > MAX_BODY_BYTES) {
      return json(413, { ok: false, message: MSG.tooLarge });
    }

    // Read the body with a hard cap, whatever the header says, then parse the multipart form.
    let formData: FormData;
    try {
      const body = await request.arrayBuffer();
      if (body.byteLength > MAX_BODY_BYTES) {
        return json(413, { ok: false, message: MSG.tooLarge });
      }
      formData = await new Response(body, {
        headers: { "content-type": request.headers.get("content-type") ?? "" },
      }).formData();
    } catch {
      return json(400, { ok: false, message: MSG.badRequest });
    }

    const outcome = await parseEnquiry(formData);

    if (outcome.status === "honeypot") {
      // Answer like a success so bots learn nothing and nothing is sent.
      return json(200, { ok: true, message: MSG.success });
    }
    if (outcome.status === "invalid") {
      return json(400, { ok: false, message: outcome.message, errors: outcome.errors });
    }

    const { enquiry } = outcome;
    if (!claimSubmission(enquiry.submissionId)) {
      // Same submission id seen again (double send or client retry). Already handled.
      return json(200, { ok: true, message: MSG.success, duplicate: true });
    }

    const config = readEnquiryConfig();
    if (!config) {
      releaseSubmission(enquiry.submissionId);
      return json(503, { ok: false, message: MSG.unavailable });
    }

    const result = await sendEnquiryEmail(enquiry, config);
    if (!result.ok) {
      releaseSubmission(enquiry.submissionId);
      return json(502, { ok: false, message: MSG.delivery });
    }

    return json(200, { ok: true, message: MSG.success });
  } catch (err) {
    console.error(`[enquiries] Unexpected error (${err instanceof Error ? err.name : "unknown"})`);
    return json(500, { ok: false, message: MSG.delivery });
  }
}
