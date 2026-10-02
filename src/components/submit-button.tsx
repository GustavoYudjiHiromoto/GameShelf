"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton({ children, pendingLabel, className = "button button-primary" }: {
  children: React.ReactNode;
  pendingLabel?: string;
  className?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button className={className} type="submit" disabled={pending}>
      {pending && <span className="spinner" aria-hidden="true" />}
      {pending ? pendingLabel ?? "Salvando…" : children}
    </button>
  );
}
