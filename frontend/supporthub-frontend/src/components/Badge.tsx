import type { TicketStatus } from "../types/api";

export default function Badge({ status }: { status?: TicketStatus | null }) {
  const safe = status ?? "OPEN"; // fallback if null

  const label = safe.replace("_", " ");

  const styles: Record<TicketStatus, string> = {
    OPEN: "bg-amber-500/10 text-amber-300 border-amber-500/20",
    IN_PROGRESS: "bg-sky-500/10 text-sky-300 border-sky-500/20",
    RESOLVED: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
    CLOSED: "bg-slate-500/10 text-slate-300 border-slate-500/20",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${styles[safe]}`}
    >
      {label}
    </span>
  );
}
