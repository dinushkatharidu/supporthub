import { useEffect, useMemo, useState } from "react";
import { Plus, Search, RefreshCcw } from "lucide-react";
import toast from "react-hot-toast";
import Card from "../components/Card";
import Button from "../components/Button";
import Input from "../components/Input";
import Badge from "../components/Badge";
import CreateTicketModal from "./tickets/CreateTicketModal";
import type { Priority, Ticket, TicketStatus } from "../types/api";
import { createTicket, fetchTickets, updateTicketStatus } from "../api/tickets";

export default function TicketsPage() {
  const [openModal, setOpenModal] = useState(false);

  // server state
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  // filters
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<TicketStatus | "ALL">("ALL");

  async function load() {
    setLoading(true);
    try {
      const page = await fetchTickets({
        q,
        status,
        page: 0,
        size: 50,
        sort: "createdAt,desc",
      });
      setTickets(page.content);
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? "Failed to load tickets");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // re-load when filters change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, status]);

  const filtered = useMemo(() => tickets, [tickets]);

  async function onCreate(data: { title: string; priority: Priority }) {
    try {
      const created = await createTicket(data);
      setTickets((prev) => [created, ...prev]);
      toast.success("Ticket created");
      setOpenModal(false);
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? "Create failed");
    }
  }

  async function quickNextStatus(t: Ticket) {
    const next = nextStatus(t.status);
    if (!next) return;

    try {
      const updated = await updateTicketStatus(t.id, next);
      setTickets((prev) =>
        prev.map((x) => (x.id === updated.id ? updated : x))
      );
      toast.success(`Status → ${updated.status.replace("_", " ")}`);
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? "Update failed");
    }
  }

  return (
    <>
      <Card className="p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xl font-bold">Tickets</p>
            <p className="text-sm text-slate-400">
              Connected to Spring Boot + Neo4j Aura.
            </p>
          </div>

          <div className="flex gap-2">
            <Button variant="ghost" onClick={load} disabled={loading}>
              <RefreshCcw size={18} />
              Refresh
            </Button>
            <Button onClick={() => setOpenModal(true)}>
              <Plus size={18} />
              Create Ticket
            </Button>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-md">
            <Search
              size={18}
              className="absolute left-3 top-2.5 text-slate-400"
            />
            <Input
              className="pl-10"
              placeholder="Search tickets..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {(
              ["ALL", "OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"] as const
            ).map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`rounded-xl px-3 py-2 text-xs font-semibold border transition
                ${
                  status === s
                    ? "bg-white/10 border-white/10"
                    : "bg-transparent border-white/10 hover:bg-white/5"
                }`}
              >
                {s.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-slate-400">
              <tr className="border-b border-white/10">
                <th className="py-3 text-left">ID</th>
                <th className="py-3 text-left">Title</th>
                <th className="py-3 text-left">Priority</th>
                <th className="py-3 text-left">Status</th>
                <th className="py-3 text-left">Created</th>
                <th className="py-3 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td className="py-6 text-slate-400" colSpan={6}>
                    Loading...
                  </td>
                </tr>
              ) : (
                filtered.map((t) => (
                  <tr
                    key={t.id}
                    className="border-b border-white/5 hover:bg-white/3 transition"
                  >
                    <td className="py-3 text-xs text-slate-400">
                      {t.id.slice(0, 8)}...
                    </td>
                    <td className="py-3 font-semibold">{t.title}</td>
                    <td className="py-3">
                      <PriorityChip p={t.priority} />
                    </td>
                    <td className="py-3">
                      <Badge status={t.status} />
                    </td>
                    <td className="py-3 text-slate-400">{t.createdAt}</td>
                    <td className="py-3">
                      <Button
                        variant="ghost"
                        className="px-3 py-1.5"
                        onClick={() => quickNextStatus(t)}
                        disabled={!nextStatus(t.status)}
                      >
                        Next Status
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {!loading && filtered.length === 0 && (
            <div className="py-10 text-center text-slate-400">
              No tickets found.
            </div>
          )}
        </div>
      </Card>

      <CreateTicketModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onCreate={onCreate}
      />
    </>
  );
}

function nextStatus(s: TicketStatus) {
  if (s === "OPEN") return "IN_PROGRESS";
  if (s === "IN_PROGRESS") return "RESOLVED";
  if (s === "RESOLVED") return "CLOSED";
  return null;
}

function PriorityChip({ p }: { p: Priority }) {
  const map: Record<Priority, string> = {
    LOW: "bg-white/5 text-slate-300 border-white/10",
    MED: "bg-[rgba(56,189,248,0.12)] text-[rgb(var(--brand2))] border-[rgba(56,189,248,0.25)]",
    HIGH: "bg-[rgba(248,113,113,0.12)] text-[rgb(var(--danger))] border-[rgba(248,113,113,0.25)]",
  };

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${map[p]}`}
    >
      {p}
    </span>
  );
}
