"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { FormTabId } from "@/lib/forms";

interface FormTabContextValue {
  tab: FormTabId;
  setTab: (tab: FormTabId) => void;
}

const FormTabContext = createContext<FormTabContextValue | null>(null);

/**
 * Shares the selected "Get started" form tab, so CTAs anywhere on the page
 * ("Hire talent", "Start an app project") can open the matching form, the
 * same as the reference's data-pick links.
 */
export function FormTabProvider({ children }: { children: ReactNode }) {
  const [tab, setTab] = useState<FormTabId>("hire");
  const value = useMemo(() => ({ tab, setTab }), [tab]);
  return <FormTabContext.Provider value={value}>{children}</FormTabContext.Provider>;
}

export function useFormTab(): FormTabContextValue {
  const ctx = useContext(FormTabContext);
  if (!ctx) throw new Error("useFormTab must be used inside <FormTabProvider>");
  return ctx;
}
