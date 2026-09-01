import Link from "next/link";
import {
  ArrowLeft,
  ShieldCheck,
  Sparkles,
  History,
  FilePlus,
  FileText,
  Heart,
  AlertTriangle,
  Pill,
  ArrowRight,
} from "lucide-react";
import { SAMPLE_PATIENT } from "@/lib/mock-data";

export default async function PatientOverviewStaffPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const patientId = params.id || SAMPLE_PATIENT.medibaseId;

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-teal-500 selection:text-white">
      {/* Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md px-6 h-16 flex items-center justify-between sticky top-0 z-50">
        <Link
          href="/staff/dashboard"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit Patient Record</span>
        </Link>
        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800 text-emerald-300">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Active Authorized Session (23h 48m remaining)</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto px-4 py-8 w-full space-y-8">
        {/* Patient Clinical Profile Header */}
        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-extrabold text-white">{SAMPLE_PATIENT.name}</h1>
              <span className="font-mono text-xs px-2.5 py-1 rounded-md bg-sky-950 text-sky-400 border border-sky-800 font-bold">
                {patientId}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
              <span>{SAMPLE_PATIENT.age} Years ({SAMPLE_PATIENT.gender})</span>
              <span>•</span>
              <span>DOB: {SAMPLE_PATIENT.dob}</span>
              <span>•</span>
              <span className="text-rose-400 font-bold">Blood Group: {SAMPLE_PATIENT.bloodGroup}</span>
              <span>•</span>
              <span>Primary Phone: {SAMPLE_PATIENT.phone}</span>
            </div>
          </div>

          {/* Clinical Alert Badges */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="px-3 py-1.5 rounded-xl border border-amber-900/50 bg-amber-950/30 text-xs text-amber-300 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>Allergies: {SAMPLE_PATIENT.allergies.join(", ")}</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-950/70 text-xs text-slate-300">
              <span>Emergency: {SAMPLE_PATIENT.emergencyContact.name} ({SAMPLE_PATIENT.emergencyContact.relationship})</span>
            </div>
          </div>
        </div>

        {/* 3 Primary Clinical CTAs */}
        <div>
          <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4">
            Clinical Tools & Longitudinal Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* 1. What's Changed? */}
            <Link
              href={`/staff/patient/${patientId}/whats-changed`}
              className="group p-5 rounded-2xl border-2 border-teal-500/40 bg-gradient-to-b from-teal-950/20 to-slate-900/60 hover:bg-slate-900 hover:border-teal-400 transition-all duration-200 flex flex-col justify-between shadow-xl shadow-teal-500/5"
            >
              <div className="space-y-3">
                <div className="w-11 h-11 rounded-xl bg-teal-950 border border-teal-700/60 flex items-center justify-center text-teal-400 group-hover:bg-teal-400 group-hover:text-slate-950 transition-all">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-teal-400 mb-1">
                    Delta Summary
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-teal-300">
                    What&apos;s Changed?
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Review structured updates (new diagnoses, medications, and labs).
                  </p>
                </div>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-semibold text-teal-400 group-hover:text-teal-300">
                <span>View Changes</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* 2. Medical Timeline */}
            <Link
              href={`/staff/patient/${patientId}/timeline`}
              className="group p-5 rounded-2xl border border-slate-800 bg-slate-900/50 hover:bg-slate-900 hover:border-sky-500/60 transition-all duration-200 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-11 h-11 rounded-xl bg-sky-950 border border-sky-800/60 flex items-center justify-center text-sky-400 group-hover:bg-sky-500 group-hover:text-slate-950 transition-all">
                  <History className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-sky-300">
                    Medical Timeline
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Explore multi-hospital records, consultations, and lab files.
                  </p>
                </div>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-semibold text-sky-400 group-hover:text-sky-300">
                <span>Explore Timeline</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* 3. Record New Visit */}
            <Link
              href={`/staff/patient/${patientId}/new-visit`}
              className="group p-5 rounded-2xl border border-slate-800 bg-slate-900/50 hover:bg-slate-900 hover:border-emerald-500/60 transition-all duration-200 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-11 h-11 rounded-xl bg-emerald-950 border border-emerald-800/60 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-400 group-hover:text-slate-950 transition-all">
                  <FilePlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-emerald-300">
                    Record New Visit
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Document today&apos;s consultation, diagnosis, vitals, and Rx.
                  </p>
                </div>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-semibold text-emerald-400 group-hover:text-emerald-300">
                <span>Start Visit</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* 4. Upload Medical Report */}
            <Link
              href={`/staff/patient/${patientId}/upload-report`}
              className="group p-5 rounded-2xl border border-slate-800 bg-slate-900/50 hover:bg-slate-900 hover:border-indigo-500/60 transition-all duration-200 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-11 h-11 rounded-xl bg-indigo-950 border border-indigo-800/60 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500 group-hover:text-slate-950 transition-all">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-indigo-300">
                    Upload Report
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Upload and attach diagnostic lab, imaging, or ECG files.
                  </p>
                </div>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-semibold text-indigo-400 group-hover:text-indigo-300">
                <span>Upload Report</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>

        {/* Current Regimen & Baseline Data */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-4">
            <h3 className="font-bold text-sm text-slate-200 flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-400" />
              <span>Chronic Diagnoses & Conditions</span>
            </h3>
            <div className="space-y-2">
              {SAMPLE_PATIENT.chronicConditions.map((cond, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs flex items-center justify-between">
                  <span className="text-slate-200 font-semibold">{cond}</span>
                  <span className="text-slate-500">Active</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-4">
            <h3 className="font-bold text-sm text-slate-200 flex items-center gap-2">
              <Pill className="w-4 h-4 text-emerald-400" />
              <span>Current Prescriptions</span>
            </h3>
            <div className="space-y-2">
              {SAMPLE_PATIENT.currentMedications.map((med, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-slate-200">{med.name} ({med.dosage})</div>
                    <div className="text-slate-400 text-[11px]">{med.frequency}</div>
                  </div>
                  <div className="text-right text-[11px] text-slate-400">
                    <span>{med.prescribedBy}</span>
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
