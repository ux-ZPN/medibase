import Link from "next/link";
import {
  ArrowLeft,
  ShieldCheck,
  Clock,
  User,
  ArrowRight,
} from "lucide-react";
import { SAMPLE_AUDIT_LOGS } from "@/lib/mock-data";

export default function StaffAccessAuditLogPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-teal-500 selection:text-white">
      {/* Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md px-6 h-16 flex items-center justify-between sticky top-0 z-50">
        <Link
          href="/staff/dashboard"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Staff Dashboard</span>
        </Link>
        <div className="font-bold text-sm text-slate-200">
          Clinical Audit & Compliance Trail
        </div>
        <div className="w-20" />
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto px-4 py-8 w-full space-y-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold px-2.5 py-1 rounded-md bg-teal-950/60 border border-teal-800 text-teal-400 w-fit mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Immutable Hospital Audit System</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Access Audit Log</h1>
          <p className="text-sm text-slate-400 mt-1">
            Complete compliance logging of all longitudinal patient consultations, emergency overrides, and diagnostic report uploads performed by Apollo Specialty Hospital staff.
          </p>
        </div>

        {/* Audit Log Table */}
        <div className="space-y-3">
          {SAMPLE_AUDIT_LOGS.map((log) => (
            <Link
              key={log.id}
              href={`/staff/audit-log/${log.id}`}
              className="group p-5 rounded-2xl border border-slate-800 bg-slate-900/50 hover:bg-slate-900 hover:border-teal-500/50 transition-all duration-200 block space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      log.action === "Emergency Override"
                        ? "bg-rose-950 text-rose-400 border border-rose-800"
                        : log.action === "Visit Created"
                        ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                        : log.action === "Record Viewed"
                        ? "bg-sky-950 text-sky-400 border border-sky-800"
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

                <div className="flex items-center gap-2 text-xs font-semibold text-teal-400 group-hover:text-teal-300">
                  <span>Inspect Event Details</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2 border-t border-slate-800/60">
                <div>
                  <span className="text-slate-400 font-medium">Clinician / Actor:</span>
                  <div className="font-semibold text-slate-200 mt-0.5 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-teal-400" />
                    <span>{log.actorName}</span>
                    <span className="text-slate-400 font-normal">({log.actorRole})</span>
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 font-medium">Target Resource & Scope:</span>
                  <p className="text-slate-300 mt-0.5 truncate">{log.resource}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
