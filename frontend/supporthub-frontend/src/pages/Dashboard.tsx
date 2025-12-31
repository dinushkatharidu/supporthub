import Card from "../components/Card";
import { useEffect, useState } from "react";
import { fetchTicketStats } from "../api/tickets"; // path might be ../api/tickets


export default function Dashboard() {
  const [stats, setStats] = useState({ open: 0, inProgress: 0, resolved: 0 });

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchTicketStats();
        setStats(data);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Stat title="Open Tickets" value={stats.open} />
      <Stat title="In Progress" value={stats.inProgress}/>
      <Stat title="Resolved Today" value={stats.resolved} />
    </div>
  );
}

function Stat({ title, value }: { title: string; value: number}) {
  return (
    <Card className="p-5">
      <p className="text-sm text-slate-400">{title}</p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
      <div className="mt-4 h-1.5 rounded-full bg-white/5 overflow-hidden">
        <div className="h-full w-2/3 bg-linear-to-r from-[rgb(var(--brand))] to-[rgb(var(--brand2))]" />
      </div>
    </Card>
  );
}
