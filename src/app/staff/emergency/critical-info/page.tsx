import Link from "next/link";
import {
  ArrowLeft,
  Heart,
  AlertTriangle,
  Phone,
  Pill,
  ArrowRight,
  Flame,
} from "lucide-react";
import { SAMPLE_PATIENT } from "@/lib/mock-data";

export default function EmergencyCriticalInfoPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-rose-500 selection:text-white">
      {/* Header */}
      <header className="border-b border-rose-900/60 bg-slate-950/80 backdrop-blur-md px-6 h-16 flex items-center justify-between sticky top-0 z-50">
        <Link
          href="/staff/emergency"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Emergency Input</span>
        </Link>
        <div className="flex items-center gap-2 text-xs font-bold px-3 py-1 rounded-full bg-rose-950 text-rose-300 border border-rose-800">
          <Flame className="w-3.5 h-3.5 text-rose-400" />
          <span>ACTIVE EMERGENCY BREAK-GLASS</span>
        </div>
        <div className="w-20" />
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto px-4 py-8 w-full space-y-8">
        {/* Emergency Triage Header */}
        <div className="p-6 rounded-3xl border-2 border-rose-600/60 bg-gradient-to-r from-slate-900 via-rose-950/30 to-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl shadow-rose-900/20">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-600 text-white uppercase tracking-wider">
                Critical Triage Summary
              </span>
              <span className="text-xs font-mono text-slate-400">{SAMPLE_PATIENT.medibaseId}</span>
            </div>
            <h1 className="text-3xl font-black text-white">{SAMPLE_PATIENT.name}</h1>
            <p className="text-xs text-slate-300">
              Age {SAMPLE_PATIENT.age} ({SAMPLE_PATIENT.gender}) • DOB: {SAMPLE_PATIENT.dob}
            </p>
          </div>

          {/* High Visibility Blood Group Block */}
          <div className="p-4 rounded-2xl bg-rose-950/80 border-2 border-rose-500 flex items-center gap-4 shrink-0 shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-rose-600 flex items-center justify-center text-white font-black text-2xl">
              {SAMPLE_PATIENT.bloodGroup}
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-rose-300">Blood Type</div>
              <div className="text-base font-bold text-white">Universal Red Cell Donor</div>
            </div>
          </div>
        </div>

        {/* Critical Clinical Alerts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Severe Allergies */}
          <div className="p-6 rounded-3xl border-2 border-rose-500/50 bg-rose-950/20 space-y-4 shadow-lg">
            <div className="flex items-center justify-between pb-3 border-b border-rose-900/40">
              <h2 className="font-extrabold text-base text-rose-200 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
                <span>Severe Drug & Clinical Allergies</span>
              </h2>
              <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-rose-600 text-white">
                HIGH ALERT
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              {SAMPLE_PATIENT.allergies.map((allergy, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-950 border border-rose-800/60 flex items-center justify-between font-bold text-rose-300"
                >
                  <span>⚠️ {allergy}</span>
                  <span className="text-rose-400 text-[11px]">CONTRAINDICATED</span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: Emergency Contact */}
          <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/60 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="font-bold text-base text-white flex items-center gap-2">
                <Phone className="w-5 h-5 text-emerald-400" />
                <span>Primary Emergency Contact</span>
              </h2>
              <span className="text-xs text-emerald-400 font-semibold">Immediate Dispatch</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <div className="text-base font-bold text-white">{SAMPLE_PATIENT.emergencyContact.name}</div>
              <div className="text-slate-400">Relationship: {SAMPLE_PATIENT.emergencyContact.relationship}</div>
              <div className="pt-2">
                <a
                  href={`tel:${SAMPLE_PATIENT.emergencyContact.phone}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call {SAMPLE_PATIENT.emergencyContact.phone}</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Chronic Conditions & Current Medications */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-3 text-xs">
            <h3 className="font-bold text-sm text-slate-200 flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-400" />
              <span>Known Chronic Conditions</span>
            </h3>
            <div className="space-y-2">
              {SAMPLE_PATIENT.chronicConditions.map((cond, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-medium">
                  {cond}
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-3 text-xs">
            <h3 className="font-bold text-sm text-slate-200 flex items-center gap-2">
              <Pill className="w-4 h-4 text-emerald-400" />
              <span>Active Pharmacotherapy</span>
            </h3>
            <div className="space-y-2">
              {SAMPLE_PATIENT.currentMedications.map((med, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <span className="font-semibold text-slate-200">{med.name} ({med.dosage})</span>
                  <span className="text-slate-400 text-[11px]">{med.frequency}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Confirmation Action */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-end gap-3">
          <Link
            href="/staff/emergency/audit-confirmation"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-sm transition-all shadow-xl shadow-rose-600/30 hover:scale-[1.01]"
          >
            <span>Confirm Emergency Audit & View Full Clinical History</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>
    </div>
  );
}
