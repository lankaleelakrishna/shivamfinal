"use client";

import { useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { Icon } from "@/components/icons/Icon";
import { useFormTab } from "@/components/providers/FormTabProvider";
import { Button } from "@/components/ui/Button";
import {
  FORM_FIELDS,
  FORM_MESSAGES,
  FORM_SIDE,
  FORM_TABS,
  filesMatchAccept,
  submitEnquiry,
  type FormField,
  type FormTabId,
} from "@/lib/forms";
import styles from "./ContactForms.module.css";

type Status = { tone: "idle" | "error" | "done"; text: string };

/** Hidden from people and screen readers. Bots that fill every input trip it. */
const HONEYPOT_NAME = "website_url";

function Field({ field }: { field: FormField }) {
  const cls = field.full ? `${styles.field} ${styles.full}` : styles.field;
  const common = {
    id: field.id,
    name: field.name,
    required: field.required,
    placeholder: field.placeholder,
    autoComplete: field.autoComplete,
    "aria-required": field.required || undefined,
  };
  let control;
  switch (field.kind) {
    case "select":
      control = (
        <select {...common} defaultValue={field.options[0]}>
          {field.options.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      );
      break;
    case "textarea":
      control = <textarea {...common} />;
      break;
    case "file":
      control = <input {...common} type="file" accept={field.accept} aria-describedby={`${field.id}-hint`} />;
      break;
    default:
      control = <input {...common} type={field.type ?? "text"} min={field.min} inputMode={field.inputMode} />;
  }
  return (
    <div className={cls}>
      <label htmlFor={field.id}>
        {field.label}
      </label>
      {control}
      {field.kind === "file" ? (
        <p id={`${field.id}-hint`} className={styles.hint}>
          PDF, DOC or DOCX
        </p>
      ) : null}
    </div>
  );
}

function EnquiryForm({ id, hidden }: { id: FormTabId; hidden: boolean }) {
  const [status, setStatus] = useState<Status>({ tone: "idle", text: "" });
  const [busy, setBusy] = useState(false);
  // State updates are async, so a ref blocks a second submit fired before the button disables.
  const inFlight = useRef(false);
  const tab = FORM_TABS.find((t) => t.id === id)!;

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inFlight.current) return;
    const form = e.currentTarget;
    const controls = Array.from(form.elements).filter(
      (el): el is HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement =>
        el instanceof HTMLInputElement || el instanceof HTMLSelectElement || el instanceof HTMLTextAreaElement,
    );

    // Resume type check: `accept` is only a hint to the file picker.
    let fileOk = true;
    for (const el of controls) {
      if (el instanceof HTMLInputElement && el.type === "file") {
        const ok = filesMatchAccept(el);
        el.setCustomValidity(ok ? "" : FORM_MESSAGES.badFile);
        fileOk &&= ok;
      }
    }

    controls
      .filter((el) => el.name !== HONEYPOT_NAME)
      .forEach((el) => el.setAttribute("aria-invalid", String(!el.checkValidity())));

    if (!form.checkValidity()) {
      form.reportValidity();
      setStatus({ tone: "error", text: fileOk ? FORM_MESSAGES.invalid : FORM_MESSAGES.badFile });
      return;
    }

    inFlight.current = true;
    setBusy(true);
    setStatus({ tone: "idle", text: "" });
    try {
      const res = await submitEnquiry(id, new FormData(form));
      if (res.ok) {
        // Reset only after the server confirms delivery. Failures keep what the visitor typed.
        form.reset();
        controls.forEach((el) => {
          el.setAttribute("aria-invalid", "false");
          el.setCustomValidity("");
        });
        setStatus({ tone: "done", text: res.message });
      } else {
        const fieldErrors = res.fieldErrors ?? {};
        controls.forEach((el) => {
          if (el.name !== HONEYPOT_NAME && el.name in fieldErrors) el.setAttribute("aria-invalid", "true");
        });
        setStatus({ tone: "error", text: res.message });
      }
    } finally {
      inFlight.current = false;
      setBusy(false);
    }
  };

  // Clear a field's error state as soon as it becomes valid again.
  const onInput = (e: FormEvent<HTMLFormElement>) => {
    const el = e.target as HTMLInputElement;
    if (el.type === "file") el.setCustomValidity("");
    if (el.getAttribute("aria-invalid") === "true" && el.checkValidity()) el.setAttribute("aria-invalid", "false");
  };

  return (
    <form
      id={`panel-${id}`}
      className={styles.form}
      role="tabpanel"
      aria-labelledby={`tab-${id}`}
      hidden={hidden}
      noValidate
      onSubmit={onSubmit}
      onInput={onInput}
      onChange={onInput}
      aria-busy={busy || undefined}
    >
      <div className={styles.honeypot} aria-hidden="true">
        <label htmlFor={`${id}-${HONEYPOT_NAME}`}>Website (leave empty)</label>
        <input id={`${id}-${HONEYPOT_NAME}`} name={HONEYPOT_NAME} type="text" tabIndex={-1} autoComplete="off" />
      </div>
      {FORM_FIELDS[id].map((f) => (
        <Field key={f.id} field={f} />
      ))}
      <div className={styles.foot}>
        <Button type="submit" disabled={busy}>
          {busy ? "Sending…" : tab.submitLabel}
        </Button>
        <p
          className={`${styles.status} ${status.tone === "done" ? styles.done : ""} ${status.tone === "error" ? styles.error : ""}`}
          role="status"
          aria-live="polite"
        >
          {status.text}
        </p>
      </div>
    </form>
  );
}

export function ContactForms() {
  const { tab, setTab } = useFormTab();
  const tabRefs = useRef<Partial<Record<FormTabId, HTMLButtonElement | null>>>({});

  const onKey = (e: KeyboardEvent<HTMLButtonElement>, idx: number) => {
    const n = FORM_TABS.length;
    let next: number | null = null;
    if (e.key === "ArrowRight") next = (idx + 1) % n;
    if (e.key === "ArrowLeft") next = (idx - 1 + n) % n;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = n - 1;
    if (next === null) return;
    e.preventDefault();
    const id = FORM_TABS[next].id;
    setTab(id);
    tabRefs.current[id]?.focus();
  };

  return (
    <section id="hire" className="band alt" aria-labelledby="hire-title">
      <div className="wrap">
        <div className={styles.shell}>
          <div className={styles.side}>
            <p className="eyebrow">{FORM_SIDE.eyebrow}</p>
            <h2 id="hire-title">{FORM_SIDE.title}</h2>
            <p className={styles.sideBody}>{FORM_SIDE.body}</p>
            <ul className={styles.tick}>
              {FORM_SIDE.ticks.map((t) => (
                <li key={t.text}>
                  <span className={styles.icBox}>
                    <Icon name={t.icon} />
                  </span>
                  <span className={styles.tickText}>{t.text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.card}>
            <div className={styles.tabs} role="tablist" aria-label="Request type">
              {FORM_TABS.map((t, idx) => (
                <button
                  key={t.id}
                  ref={(el) => {
                    tabRefs.current[t.id] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`tab-${t.id}`}
                  aria-selected={tab === t.id}
                  aria-controls={`panel-${t.id}`}
                  tabIndex={tab === t.id ? 0 : -1}
                  onClick={() => setTab(t.id)}
                  onKeyDown={(e) => onKey(e, idx)}
                >
                  {t.label}
                </button>
              ))}
            </div>
            {FORM_TABS.map((t) => (
              <EnquiryForm key={t.id} id={t.id} hidden={tab !== t.id} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
