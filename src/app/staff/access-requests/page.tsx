import Link from "next/link";
import {
  ArrowLeft,
  XCircle,
  Clock,
  ArrowRight,
  Plus,
  CheckCircle2,
} from "lucide-react";
import { SAMPLE_ACCESS_REQUESTS } from "@/lib/mock-data";

export default function StaffAccessRequestsPage() {
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
          Staff Outgoing Access Requests
        </div>
        <div className="w-20" />
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto px-4 py-8 w-full space-y-8">
        {/* Title & Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-white">Hospital Access Requests</h1>
            <p className="text-sm text-slate-400 mt-1">
              Track status of consent authorization requests sent to patients by your clinical team.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/staff/scan-qr"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition-colors shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Patient Request</span>
            </Link>
          </div>
        </div>

        {/* Requests List */}
        <div className="space-y-4">
          {SAMPLE_ACCESS_REQUESTS.map((req) => (
            <div
              key={req.id}
              className={`p-6 rounded-2xl border bg-slate-900/60 backdrop-blur-sm space-y-4 ${
                req.status === "pending"
                  ? "border-amber-500/40"
                  : req.status === "approved"
                  ? "border-emerald-500/40"
                  : "border-slate-800"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {req.status === "pending" && (
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Awaiting Patient Consent ({req.expiresIn})
                      </span>
                    )}
                    {req.status === "approved" && (
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Active Session (24h Granted)
                      </span>
                    )}
                    {req.status === "denied" && (
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-800 flex items-center gap-1">
                        <XCircle className="w-3 h-3 text-rose-400" /> Request Expired / Denied
                      </span>
                    )}
                    <span className="text-xs text-slate-400 font-mono">{req.requestedAt}</span>
                  </div>

                  <h3 className="text-lg font-bold text-white mt-1">
                    {req.patientName} <span className="text-xs font-mono text-sky-400">({req.patientId})</span>
                  </h3>
                  <div className="text-xs text-slate-400">
                    Purpose: {req.purpose} • Scope: {req.requestedScope}
                  </div>
                </div>

                <div>
                  {req.status === "approved" ? (
                    <Link
                      href={`/staff/patient/${req.patientId}/overview`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition-colors"
                    >
                      <span>Open Overview</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  ) : req.status === "pending" ? (
                    <span className="text-xs text-amber-300 font-medium px-3 py-1.5 rounded-lg bg-amber-950/40 border border-amber-800/50">
                      Pending Patient Action
                    </span>
                  ) : (
                    <Link
                      href="/staff/find-patient"
                      className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg border border-slate-800 hover:bg-slate-800 transition-colors"
                    >
                      Re-request Access
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
