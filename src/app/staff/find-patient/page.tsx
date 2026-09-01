import Link from "next/link";
import {
  ArrowLeft,
  Search,
  ArrowRight,
  Info,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { SAMPLE_PATIENT } from "@/lib/mock-data";

export default function FindPatientPage() {
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
          Patient Lookup
        </div>
        <div className="w-20" />
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-3xl mx-auto px-4 py-8 w-full space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Find Patient by MediBase ID</h1>
          <p className="text-sm text-slate-400 mt-1">
            Search patient record identifier to initiate the secure authorization request.
          </p>
        </div>

        {/* Search Input Simulation */}
        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm space-y-4">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Enter Patient MediBase ID
          </label>
          <div className="relative">
            <input
              type="text"
              defaultValue={SAMPLE_PATIENT.medibaseId}
              placeholder="e.g. MB-2026-89412"
              className="w-full px-4 py-3.5 pl-11 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-sm focus:outline-none focus:border-teal-500 transition-colors"
            />
            <Search className="w-5 h-5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>
          <p className="text-xs text-slate-500">
            Simulated search populated with patient ID: <span className="font-mono text-sky-400">{SAMPLE_PATIENT.medibaseId}</span>
          </p>
        </div>

        {/* Security Rule Banner */}
        <div className="p-4 rounded-xl border border-teal-500/30 bg-teal-950/30 flex items-start gap-3">
          <Info className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
          <div className="text-xs text-teal-200/90 leading-relaxed">
            <span className="font-bold text-white">Identification Phase:</span> Finding a patient confirms identity only. Protected longitudinal records remain locked until the patient formally authorizes access.
          </div>
        </div>

        {/* Identified Patient Match Card */}
        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/70 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-teal-950 border border-teal-800 flex items-center justify-center text-teal-400 font-bold text-lg">
                {SAMPLE_PATIENT.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base text-white">{SAMPLE_PATIENT.name}</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Identity Matched
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  ID: {SAMPLE_PATIENT.medibaseId} • Age {SAMPLE_PATIENT.age} ({SAMPLE_PATIENT.gender})
                </p>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 text-xs text-amber-400 px-3 py-1.5 rounded-lg bg-amber-950/40 border border-amber-800/60">
              <Lock className="w-3.5 h-3.5" />
              <span>Records Locked</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-slate-500">Blood Group</span>
              <div className="font-bold text-rose-400 mt-0.5">{SAMPLE_PATIENT.bloodGroup}</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-slate-500">Date of Birth</span>
              <div className="font-medium text-slate-200 mt-0.5">{SAMPLE_PATIENT.dob}</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-slate-500">Emergency Phone</span>
              <div className="font-medium text-slate-200 mt-0.5">{SAMPLE_PATIENT.emergencyContact.phone}</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-slate-500">Allergies</span>
              <div className="font-medium text-amber-300 mt-0.5">{SAMPLE_PATIENT.allergies.join(", ")}</div>
            </div>
          </div>

          {/* Primary Action Button */}
          <div className="pt-2">
            <Link
              href={`/staff/patient/${SAMPLE_PATIENT.medibaseId}/authorize`}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-teal-500/20"
            >
              <span>Request Access Authorization</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
