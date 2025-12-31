import React from "react";
import { cn } from "../utils/cn";

type Variant = "primary" | "ghost" | "danger";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
};

export default function Button({
  className,
  variant = "primary",
  ...props
}: Props) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed";

  const variants: Record<Variant, string> = {
    primary:
      "bg-gradient-to-r from-[rgb(var(--brand))] to-[rgb(var(--brand2))] text-slate-950 hover:brightness-110 shadow-[0_10px_30px_rgba(0,0,0,0.25)]",
    ghost:
      "bg-white/5 hover:bg-white/10 border border-white/10 text-[rgb(var(--text))]",
    danger: "bg-[rgb(var(--danger))] text-slate-950 hover:brightness-110",
  };

  return (
    <button className={cn(base, variants[variant], className)} {...props} />
  );
}
