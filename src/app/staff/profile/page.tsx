import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  ShieldCheck,
  CheckCircle2,
  Stethoscope,
} from "lucide-react";

export default function StaffProfileSecurityPage() {
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
          Staff Profile & Security
        </div>
        <div className="w-20" />
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto px-4 py-8 w-full space-y-8">
        {/* Clinician Profile Banner */}
        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-teal-950 border border-teal-800 flex items-center justify-center text-teal-400 font-bold text-2xl">
              SJ
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-white">Dr. Sarah Jenkins, MD</h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified Provider
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <span>Apollo Specialty Hospital • Department of Cardiology</span>
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right text-xs text-slate-400 space-y-1 font-mono">
            <div>Staff UUID: <span className="text-teal-400">stf-89021-sj</span></div>
            <div>License: <span className="text-slate-200">MED-CARD-89021</span></div>
          </div>
        </div>

        {/* Security & Credentials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Clinical Credentials */}
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-4">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-teal-400" />
              <span>Clinical Authorization Credentials</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Medical Council Registration</span>
                <span className="font-semibold text-slate-200">National Medical Commission (NMC)</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Prescribing Privileges</span>
                <span className="font-semibold text-emerald-400">Level 3 Full Prescriber</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Emergency Override Authorization</span>
                <span className="font-semibold text-amber-300">Authorized (Emergency / Break-Glass)</span>
              </div>
            </div>
          </div>

          {/* Card 2: Security & Authentication */}
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-4">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-sky-400" />
              <span>Security & Session Protection</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Two-Factor Authentication (2FA)</span>
                <span className="font-semibold text-emerald-400">Hardware Token (FIDO2 Active)</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Active Cryptographic Session</span>
                <span className="font-mono text-sky-300 text-[11px]">TLS 1.3 • AES-256-GCM</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Audit Trail Logging</span>
                <span className="font-semibold text-teal-400">Full Compliance Enabled</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div>
            <h4 className="font-bold text-sm text-slate-200">Compliance & Audit History</h4>
            <p className="text-slate-400 mt-0.5">Inspect all clinical record views and emergency access events performed by your account.</p>
          </div>
          <Link
            href="/staff/audit-log"
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 font-semibold transition-colors shrink-0"
          >
            Open Staff Audit Logs
          </Link>
        </div>
      </main>
    </div>
  );
}
