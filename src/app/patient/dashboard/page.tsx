import Link from "next/link";
import {
  QrCode,
  History,
  ShieldAlert,
  Clock,
  ArrowRight,
  LogOut,
  Heart,
  AlertTriangle,
  FileText,
  Activity,
  CheckCircle2,
} from "lucide-react";
import { SAMPLE_PATIENT, SAMPLE_ACCESS_REQUESTS } from "@/lib/mock-data";

export default function PatientDashboardPage() {
  const pendingRequests = SAMPLE_ACCESS_REQUESTS.filter(
    (r) => r.status === "pending"
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-sky-500 selection:text-white">
      {/* Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-500 flex items-center justify-center text-slate-950 font-bold">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-base text-white">MediBase</span>
              <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-sky-950 text-sky-400 border border-sky-800">
                Patient Portal
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/patient/notifications"
              className="relative p-2 rounded-lg border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-900 transition-colors"
              title="Notifications"
            >
              <span className="w-2 h-2 rounded-full bg-sky-400 absolute top-1.5 right-1.5" />
              <Activity className="w-4 h-4 text-sky-400" />
            </Link>
            <Link
              href="/role-select"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900 text-xs font-medium transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Switch Role</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto px-4 py-8 w-full space-y-8">
        {/* Patient Identity Banner */}
        <div className="p-6 rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/90 to-sky-950/40 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-sky-950 border border-sky-800 flex items-center justify-center text-sky-400 font-bold text-xl">
              {SAMPLE_PATIENT.name.charAt(0)}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-white">{SAMPLE_PATIENT.name}</h1>
                <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Verified ID
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                MediBase ID: <span className="text-sky-300 font-semibold">{SAMPLE_PATIENT.medibaseId}</span> • Age: {SAMPLE_PATIENT.age} ({SAMPLE_PATIENT.gender})
              </p>
            </div>
          </div>

          {/* Quick Badges */}
          <div className="flex flex-wrap gap-2.5">
            <div className="px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-950/60 text-xs">
              <span className="text-slate-400">Blood Group: </span>
              <span className="font-bold text-rose-400">{SAMPLE_PATIENT.bloodGroup}</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl border border-amber-900/40 bg-amber-950/20 text-xs text-amber-300 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>Allergies: {SAMPLE_PATIENT.allergies.join(", ")}</span>
            </div>
          </div>
        </div>

        {/* Pending Request Alert Notice (if any) */}
        {pendingRequests.length > 0 && (
          <div className="p-4 rounded-xl border border-amber-500/40 bg-amber-950/30 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-900/60 flex items-center justify-center text-amber-400 shrink-0">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-amber-200">
                  {pendingRequests.length} Pending Hospital Access Request
                </h4>
                <p className="text-xs text-amber-300/80">
                  {pendingRequests[0].doctorName} ({pendingRequests[0].hospital}) has requested 24-hour access to your records.
                </p>
              </div>
            </div>
            <Link
              href="/patient/access-requests"
              className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shrink-0 transition-colors"
            >
              Review Request
            </Link>
          </div>
        )}

        {/* 4 Core Patient Feature Navigation Cards */}
        <div>
          <h2 className="text-lg font-bold text-slate-200 mb-4">Patient Health Services</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* 1. Digital Identity & QR */}
            <Link
              href="/patient/identity"
              className="group p-6 rounded-2xl border border-slate-800 bg-slate-900/50 hover:bg-slate-900 hover:border-sky-500/50 transition-all duration-200 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-sky-950/80 border border-sky-800/60 flex items-center justify-center text-sky-400 group-hover:bg-sky-500 group-hover:text-slate-950 transition-all">
                  <QrCode className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-base text-white group-hover:text-sky-300">
                  Digital Identity Card
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Your secure identification QR code and MediBase ID token for hospital check-in.
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-sky-400">
                <span>View Identity Card</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* 2. Medical Timeline */}
            <Link
              href="/patient/timeline"
              className="group p-6 rounded-2xl border border-slate-800 bg-slate-900/50 hover:bg-slate-900 hover:border-indigo-500/50 transition-all duration-200 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-indigo-950/80 border border-indigo-800/60 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500 group-hover:text-slate-950 transition-all">
                  <History className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-base text-white group-hover:text-indigo-300">
                  Medical Timeline
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Read-only chronological record of all past clinical visits, prescriptions, and lab tests.
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-indigo-400">
                <span>Open Timeline</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* 3. Access Requests */}
            <Link
              href="/patient/access-requests"
              className="group p-6 rounded-2xl border border-slate-800 bg-slate-900/50 hover:bg-slate-900 hover:border-amber-500/50 transition-all duration-200 flex flex-col justify-between relative"
            >
              {pendingRequests.length > 0 && (
                <span className="absolute top-4 right-4 px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px]">
                  {pendingRequests.length} Pending
                </span>
              )}
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-amber-950/80 border border-amber-800/60 flex items-center justify-center text-amber-400 group-hover:bg-amber-500 group-hover:text-slate-950 transition-all">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-base text-white group-hover:text-amber-300">
                  Access Requests
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Manage incoming provider consent requests and review or revoke active access grants.
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-amber-400">
                <span>Review Requests</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* 4. Access History */}
            <Link
              href="/patient/access-history"
              className="group p-6 rounded-2xl border border-slate-800 bg-slate-900/50 hover:bg-slate-900 hover:border-teal-500/50 transition-all duration-200 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-teal-950/80 border border-teal-800/60 flex items-center justify-center text-teal-400 group-hover:bg-teal-400 group-hover:text-slate-950 transition-all">
                  <Clock className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-base text-white group-hover:text-teal-300">
                  Access History
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Tamper-evident audit trail showing exactly which hospitals and doctors viewed your files.
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-teal-400">
                <span>View Audit Logs</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>

        {/* Current Active Care Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-4">
            <h3 className="font-bold text-sm text-slate-200 flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-400" />
              <span>Current Chronic Conditions & Baseline</span>
            </h3>
            <div className="space-y-2">
              {SAMPLE_PATIENT.chronicConditions.map((cond, idx) => (
                <div key={idx} className="p-3 rounded-xl border border-slate-800/80 bg-slate-950/40 text-xs flex items-center justify-between">
                  <span className="text-slate-300 font-medium">{cond}</span>
                  <span className="text-slate-500">Monitored</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-4">
            <h3 className="font-bold text-sm text-slate-200 flex items-center gap-2">
              <FileText className="w-4 h-4 text-sky-400" />
              <span>Active Prescriptions</span>
            </h3>
            <div className="space-y-2">
              {SAMPLE_PATIENT.currentMedications.map((med, idx) => (
                <div key={idx} className="p-3 rounded-xl border border-slate-800/80 bg-slate-950/40 text-xs flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-slate-200">{med.name} ({med.dosage})</div>
                    <div className="text-slate-400 text-[11px]">{med.frequency}</div>
                  </div>
                  <div className="text-right text-[11px] text-slate-400">
                    <div>{med.prescribedBy}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
