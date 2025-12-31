import React from "react";
import { cn } from "../utils/cn";

type Props = React.HTMLAttributes<HTMLDivElement>;

export default function Card({ className, ...props }: Props) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/10 bg-[rgb(var(--card))] shadow-[0_10px_30px_rgba(0,0,0,0.25)]",
        className
      )}
      {...props}
    />
  );
}
