import Link from "next/link";
import {
  ArrowLeft,
  ShieldCheck,
  XCircle,
  Building2,
  User,
  Clock,
  Lock,
} from "lucide-react";
import { SAMPLE_ACCESS_REQUESTS } from "@/lib/mock-data";

export default async function ReviewAccessRequestPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const requestId = params.id;
  const request =
    SAMPLE_ACCESS_REQUESTS.find((r) => r.id === requestId) ||
    SAMPLE_ACCESS_REQUESTS[0];

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-sky-500 selection:text-white">
      {/* Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md px-6 h-16 flex items-center justify-between sticky top-0 z-50">
        <Link
          href="/patient/access-requests"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Requests</span>
        </Link>
        <div className="font-bold text-sm text-slate-200">
          Consent Review
        </div>
        <div className="w-20" />
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 max-w-2xl mx-auto w-full">
        <div className="w-full rounded-3xl border border-slate-800 bg-slate-900/80 backdrop-blur-md p-7 sm:p-9 shadow-2xl space-y-8">
          {/* Card Top */}
          <div className="flex items-center justify-between pb-6 border-b border-slate-800">
            <div className="space-y-1">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wider">
                Action Required
              </span>
              <h1 className="text-2xl font-bold text-white mt-2">
                Review Healthcare Access Request
              </h1>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-sky-950 border border-sky-800 flex items-center justify-center text-sky-400">
              <Lock className="w-6 h-6" />
            </div>
          </div>

          {/* Request Details */}
          <div className="space-y-4 text-xs">
            {/* Requesting Clinician */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
              <span className="text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                Requesting Healthcare Provider
              </span>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-sky-400 font-bold shrink-0">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{request.doctorName}</h3>
                  <p className="text-slate-300">{request.doctorRole}</p>
                  <p className="text-slate-400 flex items-center gap-1 mt-0.5">
                    <Building2 className="w-3.5 h-3.5" />
                    {request.hospital} • {request.department}
                  </p>
                </div>
              </div>
            </div>

            {/* Purpose & Scope */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                <span className="text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                  Clinical Purpose
                </span>
                <p className="text-slate-200 font-medium">{request.purpose}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                <span className="text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                  Requested Scope
                </span>
                <p className="text-slate-200 font-medium">{request.requestedScope}</p>
              </div>
            </div>

            {/* Duration Notice */}
            <div className="p-4 rounded-xl bg-sky-950/20 border border-sky-900/40 flex items-start gap-3 text-sky-200">
              <Clock className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white">Time-Bounded Access Window:</span> If approved, this healthcare provider will hold active view and contribution privileges for exactly <span className="font-bold text-sky-300">24 hours</span>. You may revoke access at any time from your dashboard.
              </div>
            </div>
          </div>

          {/* Action Buttons: Approve vs Deny */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 border-t border-slate-800">
            <Link
              href="/patient/access-requests?status=approved"
              className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-emerald-500/20"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Approve & Grant 24h Access</span>
            </Link>

            <Link
              href="/patient/access-requests?status=denied"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-rose-800/80 hover:bg-rose-950/40 text-rose-300 font-semibold text-sm transition-colors"
            >
              <XCircle className="w-4 h-4" />
              <span>Deny Request</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
