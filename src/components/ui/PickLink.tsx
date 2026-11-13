"use client";

import type { ReactNode } from "react";
import { useFormTab } from "@/components/providers/FormTabProvider";
import type { FormTabId } from "@/lib/forms";
import { buttonClass, type ButtonVariant } from "./Button";

interface PickLinkProps {
  pick: FormTabId;
  variant?: ButtonVariant;
  compact?: boolean;
  className?: string;
  children: ReactNode;
}

/** A CTA that scrolls to the forms and opens the matching tab (reference: data-pick). */
export function PickLink({ pick, variant = "primary", compact, className, children }: PickLinkProps) {
  const { setTab } = useFormTab();
  return (
    <a href="#hire" className={buttonClass(variant, compact, className)} onClick={() => setTab(pick)}>
      {children}
    </a>
  );
}
