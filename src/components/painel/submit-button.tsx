"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton({
  filhos,
  className,
  pendenteLabel = "Enviando…",
}: {
  filhos: string;
  className?: string;
  pendenteLabel?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={
        className ??
        "rounded-md bg-[color:var(--wp-red)] px-4 py-2 text-sm font-medium text-white transition hover:brightness-110 disabled:opacity-50"
      }
    >
      {pending ? pendenteLabel : filhos}
    </button>
  );
}
