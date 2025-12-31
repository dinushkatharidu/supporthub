import { Link } from "react-router-dom";

export default function Unauthorized() {
  return (
    <div className="min-h-screen grid place-items-center bg-slate-950 text-slate-100">
      <div className="max-w-md w-full rounded-2xl border border-white/10 bg-white/5 p-8">
        <h1 className="text-2xl font-bold">Unauthorized</h1>
        <p className="mt-2 text-slate-300">
          You don’t have permission to access this page.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex rounded-xl bg-emerald-500 px-4 py-2 font-semibold text-slate-950"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
