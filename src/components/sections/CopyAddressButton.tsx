"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";

const IDLE = "Copy address";

export function CopyAddressButton({ text }: { text: string }) {
  const [label, setLabel] = useState(IDLE);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const flash = (msg: string) => {
    setLabel(msg);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setLabel(IDLE), 1800);
  };

  const copy = async () => {
    try {
      if (!navigator.clipboard) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(text);
      flash("Copied");
    } catch {
      flash("Select and copy");
    }
  };

  return (
    <Button variant="line" onClick={copy} aria-live="polite">
      {label}
    </Button>
  );
}
