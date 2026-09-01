import Link from "next/link";
import {
  CheckCircle2,
  AlertOctagon,
  ArrowRight,
} from "lucide-react";
import { SAMPLE_PATIENT } from "@/lib/mock-data";

export default function EmergencyAccessAuditConfirmationPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-rose-500 selection:text-white">
      {/* Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md px-6 h-16 flex items-center justify-between sticky top-0 z-50">
        <div className="font-bold text-sm text-slate-200">
          Emergency Audit Confirmation
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Audit Logged & Verified</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 max-w-2xl mx-auto w-full">
        <div className="w-full rounded-3xl border border-slate-800 bg-slate-900/80 backdrop-blur-md p-7 sm:p-9 shadow-2xl space-y-8 text-center">
          {/* Confirmation Icon */}
          <div className="w-16 h-16 rounded-3xl bg-rose-950 border-2 border-rose-500/60 flex items-center justify-center text-rose-400 mx-auto shadow-xl shadow-rose-900/30">
            <AlertOctagon className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Emergency Access Protocol Logged
            </h1>
            <p className="text-sm text-slate-400 max-w-md mx-auto">
              Your clinical override has been verified and committed to the immutable PostgreSQL audit log with high-priority notifications dispatched.
            </p>
          </div>

          {/* Audit Verification Card */}
          <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 text-left space-y-3 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-slate-400 font-medium">Protocol Action</span>
              <span className="font-bold text-rose-400 font-mono">EMERGENCY_OVERRIDE_BREAK_GLASS</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span className="text-slate-500">Patient Identifier</span>
                <div className="font-semibold text-slate-200 mt-0.5">{SAMPLE_PATIENT.name} ({SAMPLE_PATIENT.medibaseId})</div>
              </div>
              <div>
                <span className="text-slate-500">Authorized Clinician</span>
                <div className="font-semibold text-slate-200 mt-0.5">Dr. Sarah Jenkins, MD</div>
              </div>
              <div>
                <span className="text-slate-500">Facility / Department</span>
                <div className="font-semibold text-slate-200 mt-0.5">Apollo Specialty Hospital • Emergency Dept</div>
              </div>
              <div>
                <span className="text-slate-500">Access Expiry</span>
                <div className="font-semibold text-teal-400 mt-0.5">12 Hours (2026-09-01 23:30)</div>
              </div>
              <div className="sm:col-span-2">
                <span className="text-slate-500">Cryptographic Audit Hash</span>
                <div className="font-mono text-[10px] text-sky-400 truncate mt-0.5">
                  sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069
                </div>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <Link
              href={`/staff/patient/${SAMPLE_PATIENT.medibaseId}/overview`}
              className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-teal-500/20"
            >
              <span>Proceed to Full Patient Clinical Overview</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/staff/audit-log"
              className="w-full sm:w-auto px-6 py-4 rounded-xl border border-slate-800 hover:bg-slate-900 text-slate-300 text-sm font-semibold transition-colors"
            >
              Inspect Audit Log
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
