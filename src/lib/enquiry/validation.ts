import {
  FORM_FIELDS,
  FORM_TABS,
  type FileField,
  type FormField,
  type FormTabId,
  type InputField,
  type TextareaField,
} from "@/lib/forms";

/**
 * Server-side validation for POST /api/enquiries.
 *
 * Field rules are derived from FORM_FIELDS (src/lib/forms.ts), so the server
 * accepts exactly the fields the forms render. Browser checks are never trusted.
 * Server-only: do not import this from client components.
 */

/** Vercel caps request bodies at about 4.5 MB, so this sits below that. */
export const MAX_BODY_BYTES = 3.5 * 1024 * 1024;
export const MAX_RESUME_BYTES = 3 * 1024 * 1024;

const MAX_SHORT_TEXT = 200;
const MAX_LONG_TEXT = 3000;
const MAX_EMAIL = 254;
const MAX_OPENINGS = 1000;
const SUBMISSION_ID_RE = /^[A-Za-z0-9-]{8,64}$/;

/** Bots fill every input, so this one is hidden from people and rejected silently. */
export const HONEYPOT_FIELD = "website_url";
const META_FIELDS = ["form", "submissionId", HONEYPOT_FIELD];

const EMAIL_RE =
  /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)+$/;

const DOCX_TYPE = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
const OLE_MAGIC = Buffer.from([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]);
const ZIP_MAGIC = Buffer.from([0x50, 0x4b, 0x03, 0x04]);

/** Resume types are checked by extension and by file signature, not by the browser's MIME guess. */
const RESUME_TYPES: Record<string, { contentType: string; signature: (b: Buffer) => boolean }> = {
  ".pdf": { contentType: "application/pdf", signature: (b) => b.subarray(0, 5).toString("latin1") === "%PDF-" },
  ".doc": { contentType: "application/msword", signature: (b) => b.subarray(0, 8).equals(OLE_MAGIC) },
  ".docx": { contentType: DOCX_TYPE, signature: (b) => b.subarray(0, 4).equals(ZIP_MAGIC) },
};

export interface EnquiryRow {
  label: string;
  value: string;
  multiline: boolean;
}

export interface ValidEnquiry {
  form: FormTabId;
  submissionId: string;
  /** Normalised values keyed by field name (phone normalised, numbers as digits). */
  values: Record<string, string>;
  /** Every field of the form, in display order, for the email body. */
  rows: EnquiryRow[];
  resume?: { filename: string; contentType: string; content: Buffer };
}

export type ParseOutcome =
  | { status: "ok"; enquiry: ValidEnquiry }
  | { status: "honeypot" }
  | { status: "invalid"; message: string; errors: Record<string, string> };

type CheckResult = { value: string } | { error: string };

/** Detects a bot that filled the hidden field. Any non-empty value counts. */
export function honeypotTripped(data: FormData): boolean {
  const v = data.get(HONEYPOT_FIELD);
  if (v === null) return false;
  return typeof v !== "string" || v.trim() !== "";
}

/** Indian mobiles (with or without +91 or 0), or international numbers in E.164 form. Returns the normalised number or null. */
export function normalizePhone(raw: string): string | null {
  const compact = raw.replace(/[\s\-().]/g, "");
  const indian = /^(?:\+?91|0)?([6-9]\d{4})(\d{5})$/.exec(compact);
  if (indian) return `+91 ${indian[1]} ${indian[2]}`;
  if (/^\+[1-9]\d{6,14}$/.test(compact)) return compact;
  return null;
}

function hasControlChars(s: string, allowLineBreaks: boolean): boolean {
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i);
    if (c === 0x7f) return true;
    if (c < 0x20) {
      if (allowLineBreaks && (c === 0x0a || c === 0x0d || c === 0x09)) continue;
      return true;
    }
  }
  return false;
}

function checkValue(field: Exclude<FormField, FileField>, value: string): CheckResult {
  if (!value) {
    return field.required ? { error: `${field.label} is required.` } : { value: "" };
  }
  switch (field.kind) {
    case "select":
      return field.options.includes(value) ? { value } : { error: `Please choose a valid option for ${field.label}.` };
    case "textarea":
      return checkTextarea(field, value);
    case "input":
      return checkInput(field, value);
  }
}

function checkTextarea(field: TextareaField, value: string): CheckResult {
  if (value.length > MAX_LONG_TEXT) {
    return { error: `${field.label} must be ${MAX_LONG_TEXT} characters or fewer.` };
  }
  if (hasControlChars(value, true)) return { error: `${field.label} contains characters that are not allowed.` };
  return { value };
}

function checkInput(field: InputField, value: string): CheckResult {
  if (field.type === "email") {
    if (value.length > MAX_EMAIL || !EMAIL_RE.test(value)) {
      return { error: "Please enter a valid email address." };
    }
    return { value };
  }
  if (field.type === "tel") {
    const phone = normalizePhone(value);
    if (!phone) {
      return {
        error:
          "Please enter a valid phone number: a 10-digit Indian mobile number, or an international number starting with + and the country code.",
      };
    }
    return { value: phone };
  }
  if (field.type === "number") {
    const min = field.min ?? 1;
    if (!/^\d{1,4}$/.test(value)) return { error: `${field.label} must be a whole number.` };
    const n = Number(value);
    if (n < min || n > MAX_OPENINGS) {
      return { error: `${field.label} must be between ${min} and ${MAX_OPENINGS}.` };
    }
    return { value: String(n) };
  }
  if (value.length > MAX_SHORT_TEXT) {
    return { error: `${field.label} must be ${MAX_SHORT_TEXT} characters or fewer.` };
  }
  if (hasControlChars(value, false)) return { error: `${field.label} contains characters that are not allowed.` };
  return { value };
}

function extensionOf(name: string): string {
  const m = /\.[A-Za-z0-9]{1,5}$/.exec(name);
  return m ? m[0].toLowerCase() : "";
}

function safeFilename(name: string): string {
  const base = name.split(/[\\/]/).pop() ?? "";
  const cleaned = base.replace(/[^A-Za-z0-9._ -]/g, "_").replace(/\s+/g, " ").trim().slice(-120);
  return cleaned || "resume";
}

async function readResume(
  data: FormData,
  field: FileField,
  errors: Record<string, string>,
): Promise<ValidEnquiry["resume"] | undefined> {
  const badFile = `Please attach your resume as a PDF, DOC or DOCX file.`;
  const raw = data.get(field.name);
  if (raw === null) return undefined;
  if (!(raw instanceof File)) {
    if (raw.trim() === "") return undefined;
    errors[field.name] = badFile;
    return undefined;
  }
  // The browser sends an empty file part when no file is chosen.
  if (raw.size === 0 && raw.name === "") return undefined;

  const ext = extensionOf(raw.name);
  const accepted = field.accept.split(",").map((s) => s.trim().toLowerCase());
  const type = RESUME_TYPES[ext];
  if (!type || !accepted.includes(ext)) {
    errors[field.name] = badFile;
    return undefined;
  }
  if (raw.size > MAX_RESUME_BYTES) {
    errors[field.name] = `Your resume must be ${MAX_RESUME_BYTES / (1024 * 1024)} MB or smaller.`;
    return undefined;
  }
  const content = Buffer.from(await raw.arrayBuffer());
  if (content.length === 0 || !type.signature(content)) {
    errors[field.name] = badFile;
    return undefined;
  }
  return { filename: safeFilename(raw.name), contentType: type.contentType, content };
}

/**
 * Validates a submitted multipart body against the server copy of the form.
 * Unknown or repeated fields are rejected; honeypot hits are reported separately
 * so the route can answer them like a success without doing any work.
 */
export async function parseEnquiry(data: FormData): Promise<ParseOutcome> {
  if (honeypotTripped(data)) return { status: "honeypot" };

  const errors: Record<string, string> = {};
  const tab = FORM_TABS.find((t) => t.id === data.get("form"));
  if (!tab) {
    return invalidOutcome({ _form: "Please choose an enquiry form and try again." });
  }
  const form = tab.id;

  const submissionId = data.get("submissionId");
  if (typeof submissionId !== "string" || !SUBMISSION_ID_RE.test(submissionId)) {
    errors._form = "Your submission could not be verified. Please try again.";
  }

  const fields = FORM_FIELDS[form];
  const allowed = new Set([...fields.map((f) => f.name), ...META_FIELDS]);
  for (const key of new Set(data.keys())) {
    if (!allowed.has(key)) {
      errors._form = "This submission contains a field that is not allowed.";
    } else if (data.getAll(key).length > 1) {
      errors[key] = "This field was submitted more than once.";
    }
  }

  const values: Record<string, string> = {};
  const rows: EnquiryRow[] = [];
  let resume: ValidEnquiry["resume"];

  for (const field of fields) {
    if (field.kind === "file") {
      resume = await readResume(data, field, errors);
      rows.push({ label: field.label, value: resume ? `Attached: ${resume.filename}` : "", multiline: false });
      continue;
    }
    const raw = data.get(field.name);
    if (raw instanceof File) {
      errors[field.name] = `Please check ${field.label}.`;
      continue;
    }
    const result = checkValue(field, (raw ?? "").trim());
    if ("error" in result) {
      errors[field.name] = result.error;
      continue;
    }
    values[field.name] = result.value;
    rows.push({ label: field.label, value: result.value, multiline: field.kind === "textarea" });
  }

  if (Object.keys(errors).length > 0) return invalidOutcome(errors);

  return {
    status: "ok",
    enquiry: {
      form,
      submissionId: submissionId as string,
      values,
      rows,
      resume,
    },
  };
}

function invalidOutcome(errors: Record<string, string>): ParseOutcome {
  const message = errors._form ?? Object.values(errors)[0] ?? "Please check the highlighted fields.";
  return { status: "invalid", message, errors };
}
