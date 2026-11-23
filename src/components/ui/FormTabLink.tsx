"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useFormTab } from "@/components/providers/FormTabProvider";
import type { FormTabId } from "@/lib/forms";

/** A plain link to the home page form that also selects the matching form tab. */
export function FormTabLink({
  href,
  pick,
  children,
  className,
}: {
  href: string;
  pick?: FormTabId;
  children: ReactNode;
  className?: string;
}) {
  const { setTab } = useFormTab();
  return (
    <Link href={href} className={className} onClick={pick ? () => setTab(pick) : undefined}>
      {children}
    </Link>
  );
}
