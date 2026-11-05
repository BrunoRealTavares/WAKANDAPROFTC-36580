import Link from "next/link";
import type { ReactNode } from "react";

type ButtonProps = {
  href: string;
  variant?: "primary" | "outline";
  size?: "md" | "lg";
  className?: string;
  children: ReactNode;
};

const variantClasses = {
  primary: "bg-[var(--wp-red)] text-[var(--wp-white)] hover:bg-[var(--wp-red-deep)]",
  outline: "border border-[var(--wp-gold)] text-[var(--wp-gold-soft)] hover:bg-[var(--wp-gold)] hover:text-[var(--wp-void)]",
} as const;

const sizeClasses = {
  md: "h-11 px-6 text-xs",
  lg: "h-12 px-7 text-sm",
} as const;

export function Button({
  href,
  variant = "primary",
  size = "lg",
  className = "",
  children,
}: ButtonProps) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center rounded-full font-mono text-center uppercase tracking-[0.18em] transition-colors ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}
