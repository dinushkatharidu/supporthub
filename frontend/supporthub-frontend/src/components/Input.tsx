import React from "react";
import { cn } from "../utils/cn";

type Props = React.InputHTMLAttributes<HTMLInputElement>;

export default function Input({ className, ...props }: Props) {
  return (
    <input
      className={cn(
        "w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2 text-sm outline-none",
        "focus:border-[rgb(var(--brand))] focus:ring-2 focus:ring-[rgba(45,212,191,0.25)]",
        className
      )}
      {...props}
    />
  );
}
