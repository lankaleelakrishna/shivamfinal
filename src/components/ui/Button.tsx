import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./Button.module.css";

export type ButtonVariant = "primary" | "ghost" | "line";

interface CommonProps {
  variant?: ButtonVariant;
  compact?: boolean;
  className?: string;
  children: ReactNode;
}

export function buttonClass(variant: ButtonVariant = "primary", compact = false, extra?: string): string {
  return [styles.btn, styles[variant], compact ? styles.compact : "", extra ?? ""].filter(Boolean).join(" ");
}

type ButtonLinkProps = CommonProps & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className">;

export function ButtonLink({ variant, compact, className, children, ...rest }: ButtonLinkProps) {
  return (
    <a className={buttonClass(variant, compact, className)} {...rest}>
      {children}
    </a>
  );
}

type ButtonProps = CommonProps & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className">;

export function Button({ variant, compact, className, children, type = "button", ...rest }: ButtonProps) {
  return (
    <button type={type} className={buttonClass(variant, compact, className)} {...rest}>
      {children}
    </button>
  );
}
