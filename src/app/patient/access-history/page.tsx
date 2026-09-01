import Link from "next/link";
import { ArrowLeft, Clock, ShieldCheck, Building2, User } from "lucide-react";
import { SAMPLE_AUDIT_LOGS } from "@/lib/mock-data";

export default function AccessHistoryPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-sky-500 selection:text-white">
      {/* Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md px-6 h-16 flex items-center justify-between sticky top-0 z-50">
        <Link
          href="/patient/dashboard"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
        <div className="font-bold text-sm text-slate-200">
          Audit Logs & Transparency
        </div>
        <div className="w-20" />
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto px-4 py-8 w-full space-y-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold px-2.5 py-1 rounded-md bg-teal-950/60 border border-teal-800 text-teal-400 w-fit mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Immutable Append-Only Audit Log</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Record Access History</h1>
          <p className="text-sm text-slate-400 mt-1">
            Complete transparency into every healthcare provider, hospital facility, and system action involving your longitudinal medical record.
          </p>
        </div>

        {/* Audit Log Table / List */}
        <div className="space-y-3">
          {SAMPLE_AUDIT_LOGS.map((log) => (
            <div
              key={log.id}
              className="p-5 rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      log.action === "Record Viewed"
                        ? "bg-sky-950 text-sky-400 border border-sky-800"
                        : log.action === "Visit Created"
                        ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                        : log.action === "Consent Approved"
                        ? "bg-indigo-950 text-indigo-400 border border-indigo-800"
                        : "bg-slate-800 text-slate-300 border border-slate-700"
                    }`}
                  >
                    {log.action}
                  </span>
                  <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {log.timestamp}
                  </span>
                </div>

                <span className="text-[11px] font-mono text-slate-400">{log.ipAddress}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2 border-t border-slate-800/60">
                <div>
                  <span className="text-slate-400 font-medium">Healthcare Actor:</span>
                  <div className="font-semibold text-slate-200 mt-0.5 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-sky-400" />
                    <span>{log.actorName}</span>
                    <span className="text-slate-400 font-normal">({log.actorRole})</span>
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                    <Building2 className="w-3 h-3" />
                    <span>{log.hospital}</span>
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 font-medium">Target Resource & Scope:</span>
                  <p className="text-slate-300 mt-0.5">{log.resource}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
