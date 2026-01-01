import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, Ticket, LogOut } from "lucide-react";
import Button from "../components/Button";
import { useAuth } from "../auth/AuthContext";

export default function AppLayout() {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  function onLogout() {
    logout();
    nav("/login", { replace: true });
  }

  const roleText = user?.roles?.[0] ?? "USER";
  const emailText = user?.email ?? "Unknown";

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
          <aside className="rounded-2xl border border-white/10 bg-[rgb(var(--card))] shadow-[0_10px_30px_rgba(0,0,0,0.25)] p-4">
            <div className="flex items-center gap-2 px-2 py-3">
              <div className="h-10 w-10 rounded-xl bg-linear-to-br from-[rgb(var(--brand))] to-[rgb(var(--brand2))]" />
              <div>
                <p className="text-sm font-semibold">SupportHub</p>
                <p className="text-xs text-slate-400">Ticket System</p>
              </div>
            </div>

            <nav className="mt-4 space-y-1">
              <SideLink
                to="/"
                icon={<LayoutDashboard size={18} />}
                label="Dashboard"
                end
              />
              <SideLink
                to="/tickets"
                icon={<Ticket size={18} />}
                label="Tickets"
              />
            </nav>

            <div className="mt-6 border-t border-white/10 pt-4">
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={onLogout}
              >
                <LogOut size={18} />
                Logout
              </Button>
            </div>
          </aside>

          <main className="space-y-6">
            <Topbar email={emailText} role={roleText} />
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

function SideLink({
  to,
  icon,
  label,
  end,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
  end?: boolean;
}) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition
        ${isActive ? "bg-white/10 border border-white/10" : "hover:bg-white/5"}`
      }
    >
      {icon}
      {label}
    </NavLink>
  );
}

function Topbar({ email, role }: { email: string; role: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[rgb(var(--card))] shadow-[0_10px_30px_rgba(0,0,0,0.25)] px-4 py-3 flex items-center justify-between">
      <div>
        <p className="text-sm text-slate-400">Welcome back</p>
        <p className="text-lg font-semibold">SupportHub Console</p>
      </div>

      <div className="flex items-center gap-2">
        <div className="hidden sm:block text-right">
          <p className="text-sm font-semibold">{email}</p>
          <p className="text-xs text-slate-400">{role}</p>
        </div>
        <div className="h-10 w-10 rounded-xl bg-white/10 border border-white/10" />
      </div>
    </div>
  );
}
