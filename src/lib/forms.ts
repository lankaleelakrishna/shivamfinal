/**
 * Form definitions for the "Get started" section, ported from the reference.
 *
 * Submissions go to POST /api/enquiries (src/app/api/enquiries/route.ts), which
 * validates them again on the server and emails them via Gmail SMTP. The field
 * definitions below are the source of truth for the server-side validation too.
 */

import type { IconName } from "@/components/icons/Icon";

export type FormTabId = "hire" | "app" | "job" | "business" | "hirevaani";

export interface FormTab {
  id: FormTabId;
  label: string;
  submitLabel: string;
}

export interface FormSide {
  eyebrow: string;
  title: string;
  body: string;
  ticks: { icon: IconName; text: string }[];
}

export const FORM_TABS: FormTab[] = [
  { id: "hire", label: "Hire talent", submitLabel: "Send hiring request" },
  { id: "app", label: "Get an app quote", submitLabel: "Request a quote" },
  { id: "job", label: "I am looking for a job", submitLabel: "Share my profile" },
  { id: "business", label: "Business services", submitLabel: "Send enquiry" },
  { id: "hirevaani", label: "HireVaani", submitLabel: "Send enquiry" },
];

/** Tabs on the home page "Get started" section. */
export const HOME_FORM_IDS: FormTabId[] = ["hire", "app", "job"];

/** Tabs on the Contact Us page. */
export const CONTACT_FORM_IDS: FormTabId[] = ["business", "hirevaani"];

interface BaseField {
  id: string;
  name: string;
  label: string;
  required?: boolean;
  full?: boolean;
  placeholder?: string;
  autoComplete?: string;
}

export interface InputField extends BaseField {
  kind: "input";
  type?: "text" | "email" | "tel" | "number";
  min?: number;
  inputMode?: "numeric" | "text" | "email" | "tel";
}

export interface SelectField extends BaseField {
  kind: "select";
  options: string[];
}

export interface TextareaField extends BaseField {
  kind: "textarea";
}

export interface FileField extends BaseField {
  kind: "file";
  accept: string;
}

export type FormField = InputField | SelectField | TextareaField | FileField;

export const FORM_FIELDS: Record<FormTabId, FormField[]> = {
  hire: [
    { kind: "input", id: "h-company", name: "company", label: "Company name", required: true, autoComplete: "organization" },
    { kind: "input", id: "h-name", name: "name", label: "Your name", required: true, autoComplete: "name" },
    { kind: "input", id: "h-email", name: "email", label: "Work email", type: "email", required: true, autoComplete: "email" },
    { kind: "input", id: "h-phone", name: "phone", label: "Phone", type: "tel", autoComplete: "tel" },
    {
      kind: "select",
      id: "h-type",
      name: "type",
      label: "Type of hiring",
      options: ["IT staffing", "Non-IT staffing", "Permanent recruitment", "Contract staffing", "Payroll services", "Bulk hiring"],
    },
    { kind: "input", id: "h-count", name: "count", label: "Number of openings", type: "number", min: 1, inputMode: "numeric", placeholder: "e.g. 5" },
    { kind: "textarea", id: "h-details", name: "details", label: "Roles and requirements", full: true, placeholder: "Job titles, skills, experience, location, budget" },
  ],
  app: [
    { kind: "input", id: "a-name", name: "name", label: "Your name", required: true, autoComplete: "name" },
    { kind: "input", id: "a-email", name: "email", label: "Email", type: "email", required: true, autoComplete: "email" },
    { kind: "input", id: "a-phone", name: "phone", label: "Phone", type: "tel", autoComplete: "tel" },
    { kind: "select", id: "a-platform", name: "platform", label: "Platform", options: ["Android", "iOS", "Android and iOS", "Not sure yet"] },
    {
      kind: "select",
      id: "a-budget",
      name: "budget",
      label: "Budget range",
      options: ["Under ₹2 lakh", "₹2 to 5 lakh", "₹5 to 15 lakh", "Above ₹15 lakh", "Not decided"],
    },
    { kind: "select", id: "a-time", name: "timeline", label: "Target launch", options: ["Within 2 months", "2 to 4 months", "4 to 6 months", "Flexible"] },
    { kind: "textarea", id: "a-idea", name: "idea", label: "Your app idea", required: true, full: true, placeholder: "Who is it for, and what should they be able to do?" },
  ],
  job: [
    { kind: "input", id: "j-name", name: "name", label: "Full name", required: true, autoComplete: "name" },
    { kind: "input", id: "j-phone", name: "phone", label: "Phone", type: "tel", required: true, autoComplete: "tel" },
    { kind: "input", id: "j-role", name: "role", label: "Role you are looking for", placeholder: "e.g. Java developer, sales executive" },
    { kind: "select", id: "j-exp", name: "exp", label: "Experience", options: ["Fresher", "1 to 3 years", "3 to 6 years", "6 to 10 years", "10+ years"] },
    { kind: "file", id: "j-resume", name: "resume", label: "Resume", full: true, accept: ".pdf,.doc,.docx" },
  ],
  business: [
    { kind: "input", id: "b-company", name: "company", label: "Company name", required: true, autoComplete: "organization" },
    { kind: "input", id: "b-name", name: "name", label: "Your name", required: true, autoComplete: "name" },
    { kind: "input", id: "b-email", name: "email", label: "Work email", type: "email", required: true, autoComplete: "email" },
    { kind: "input", id: "b-phone", name: "phone", label: "Phone", type: "tel", autoComplete: "tel" },
    {
      kind: "select",
      id: "b-service",
      name: "service",
      label: "Service of interest",
      options: [
        "Web application development",
        "Mobile application development",
        "Custom software development",
        "AI-powered solutions",
        "UI/UX design",
        "Digital product development",
        "Staffing or payroll",
        "Not sure yet",
      ],
    },
    { kind: "textarea", id: "b-message", name: "message", label: "Message", required: true, full: true, placeholder: "Tell us about your project or requirement" },
  ],
  hirevaani: [
    { kind: "input", id: "v-name", name: "name", label: "Your name", required: true, autoComplete: "name" },
    { kind: "input", id: "v-email", name: "email", label: "Email", type: "email", required: true, autoComplete: "email" },
    { kind: "input", id: "v-phone", name: "phone", label: "Phone", type: "tel", autoComplete: "tel" },
    { kind: "input", id: "v-company", name: "company", label: "Company (optional)", autoComplete: "organization" },
    { kind: "select", id: "v-app", name: "app", label: "Which HireVaani app", options: ["HireVaani Worker", "HireVaani Recruiter", "Not sure yet"] },
    { kind: "textarea", id: "v-message", name: "message", label: "Message", required: true, full: true, placeholder: "What do you need help with?" },
  ],
};

export const FORM_MESSAGES = {
  invalid: "Please fill the required fields.",
  badFile: "Please attach your resume as a PDF, DOC or DOCX file.",
  sent: "Thank you. Your enquiry has been sent. We will get back to you shortly.",
  failed: "We could not send your enquiry right now. Your details are still in the form, so please try again in a few minutes.",
  network: "Network problem. Check your connection and try again. Your details are still in the form.",
} as const;

export const FORM_SIDE: FormSide = {
  eyebrow: "Get started",
  title: "Tell us what you need",
  body: "Pick the form that fits. Share as much or as little as you know, and we will come back with questions, not a sales pitch.",
  ticks: [
    { icon: "users", text: "Hiring: roles, number of openings, contract or permanent" },
    { icon: "phone", text: "Apps: platform, budget range and target timeline" },
    { icon: "file", text: "Job seekers: share your profile and skills" },
  ],
};

/** Copy for the Contact Us page's enquiry section. */
export const CONTACT_SIDE: FormSide = {
  eyebrow: "Contact us",
  title: "Tell us how we can help",
  body: "Choose the option that fits. Business enquiries and HireVaani questions both reach our team, and we will come back to you.",
  ticks: [
    { icon: "building", text: "Business services: staffing, software, AI and design projects" },
    { icon: "phone", text: "HireVaani: questions from workers and recruiters using the apps" },
  ],
};

/** Returns true when every chosen file matches the input's accept list. */
export function filesMatchAccept(input: HTMLInputElement): boolean {
  const accept = input.accept
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  if (!accept.length || !input.files) return true;
  return Array.from(input.files).every((f) => accept.some((ext) => f.name.toLowerCase().endsWith(ext)));
}

export interface SubmitResult {
  ok: boolean;
  /** Safe, user-facing text. Server messages are authored in the route, never raw error output. */
  message: string;
  /** Field name to message, for fields the server rejected. */
  fieldErrors?: Record<string, string>;
}

function newSubmissionId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") return crypto.randomUUID();
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Sends one enquiry to POST /api/enquiries. Each call gets a fresh submission id,
 * so the server can drop a repeated request but never a new one.
 */
export async function submitEnquiry(form: FormTabId, data: FormData): Promise<SubmitResult> {
  data.set("form", form);
  data.set("submissionId", newSubmissionId());

  try {
    const res = await fetch("/api/enquiries", { method: "POST", body: data, cache: "no-store" });
    const body = (await res.json().catch(() => null)) as {
      ok?: boolean;
      message?: string;
      errors?: Record<string, string>;
    } | null;

    if (res.ok && body?.ok) {
      return { ok: true, message: body.message ?? FORM_MESSAGES.sent };
    }
    return {
      ok: false,
      message: body?.message ?? FORM_MESSAGES.failed,
      fieldErrors: body?.errors,
    };
  } catch {
    return { ok: false, message: FORM_MESSAGES.network };
  }
}
