import { useEffect, useState } from "react";
import Card from "../../components/Card";
import Button from "../../components/Button";
import Input from "../../components/Input";
import type { Priority } from "../../types/api";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreate: (data: { title: string; priority: Priority }) => void;
};

export default function CreateTicketModal({ open, onClose, onCreate }: Props) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Priority>("MED");

  useEffect(() => {
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
      <Card className="w-full max-w-lg p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-lg font-bold">Create Ticket</p>
            <p className="text-sm text-slate-400">Add a new support request.</p>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-sm hover:bg-white/10"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <div className="mt-5 space-y-4">
          <div>
            <p className="mb-2 text-sm text-slate-400">Title</p>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Cannot login"
            />
          </div>

          <div>
            <p className="mb-2 text-sm text-slate-400">Priority</p>
            <div className="flex gap-2">
              {(["LOW", "MED", "HIGH"] as Priority[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setPriority(p)}
                  className={`rounded-xl px-4 py-2 text-sm font-semibold border transition
                  ${
                    priority === p
                      ? "bg-white/10 border-white/10"
                      : "bg-white/5 border-white/10 hover:bg-white/10"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (!title.trim()) return;
                onCreate({ title: title.trim(), priority });
                setTitle("");
                setPriority("MED");
              }}
            >
              Create
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
