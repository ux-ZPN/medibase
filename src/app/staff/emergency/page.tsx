import Link from "next/link";
import {
  ArrowLeft,
  AlertOctagon,
  ShieldAlert,
  Flame,
  ArrowRight,
} from "lucide-react";
import { SAMPLE_PATIENT } from "@/lib/mock-data";

export default function EmergencyAccessPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-rose-500 selection:text-white">
      {/* Header */}
      <header className="border-b border-rose-900/60 bg-slate-950/80 backdrop-blur-md px-6 h-16 flex items-center justify-between sticky top-0 z-50">
        <Link
          href="/staff/dashboard"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit Emergency Mode</span>
        </Link>
        <div className="flex items-center gap-2 text-xs font-bold px-3 py-1 rounded-full bg-rose-950 text-rose-300 border border-rose-800 animate-pulse">
          <AlertOctagon className="w-3.5 h-3.5" />
          <span>BREAK-GLASS PROTOCOL</span>
        </div>
        <div className="w-20" />
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 max-w-2xl mx-auto w-full">
        <div className="w-full rounded-3xl border-2 border-rose-600/50 bg-gradient-to-b from-slate-900 via-slate-900/90 to-rose-950/20 p-7 sm:p-9 shadow-2xl shadow-rose-900/20 space-y-8">
          {/* Card Top Notice */}
          <div className="flex items-start gap-4 pb-6 border-b border-slate-800">
            <div className="w-12 h-12 rounded-2xl bg-rose-950 border border-rose-700 flex items-center justify-center text-rose-400 shrink-0">
              <Flame className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <div className="text-xs font-bold text-rose-400 uppercase tracking-widest">
                Emergency Care Override
              </div>
              <h1 className="text-2xl font-extrabold text-white">
                Emergency Break-Glass Access
              </h1>
              <p className="text-xs text-slate-400 leading-relaxed">
                Used strictly when a patient is unconscious, unresponsive, or experiencing life-threatening trauma and unable to provide direct consent.
              </p>
            </div>
          </div>

          {/* Form */}
          <form action="/staff/emergency/critical-info" className="space-y-6 text-xs">
            {/* Target Patient Identifier */}
            <div className="space-y-2">
              <label className="font-semibold uppercase tracking-wider text-slate-300">
                Patient Identification (MediBase ID or QR Token)
              </label>
              <input
                type="text"
                name="patientId"
                defaultValue={SAMPLE_PATIENT.medibaseId}
                placeholder="e.g. MB-2026-89412"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-sm focus:outline-none focus:border-rose-500 transition-colors"
              />
              <p className="text-[11px] text-slate-500">
                Identified: <span className="text-slate-300 font-medium">{SAMPLE_PATIENT.name}</span> ({SAMPLE_PATIENT.gender}, Age {SAMPLE_PATIENT.age})
              </p>
            </div>

            {/* Mandatory Clinical Justification */}
            <div className="space-y-2">
              <label className="font-semibold uppercase tracking-wider text-rose-300 flex items-center justify-between">
                <span>Mandatory Clinical Justification</span>
                <span className="text-rose-400 font-bold">* Required for Audit Trail</span>
              </label>
              <textarea
                name="justification"
                rows={3}
                defaultValue="Patient admitted to Emergency Department following acute road traffic trauma. Unresponsive with low GCS. Immediate surgical triage and blood group / allergy verification required."
                placeholder="Detail the urgent clinical emergency justifying consent bypass..."
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-rose-900/60 text-slate-200 text-xs focus:outline-none focus:border-rose-500 transition-colors resize-none"
              />
            </div>

            {/* Legal / Audit Notice */}
            <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-900/50 space-y-2 text-rose-200">
              <div className="flex items-center gap-2 font-bold text-rose-300 text-xs">
                <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                <span>Legal Compliance & Audit Notice</span>
              </div>
              <p className="text-[11px] text-rose-200/80 leading-relaxed">
                Initiating this break-glass protocol records an immutable audit log, triggers an immediate high-priority alert to the patient and hospital compliance officer, and grants a 12-hour emergency viewing window. Unauthorized use is subject to severe medical board sanctions.
              </p>
            </div>

            {/* Submit CTA */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-sm transition-all shadow-xl shadow-rose-600/30 hover:scale-[1.01]"
              >
                <AlertOctagon className="w-5 h-5" />
                <span>Authorize Break-Glass & View Critical Emergency Data</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
