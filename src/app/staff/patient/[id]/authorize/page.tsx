import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  ArrowRight,
  Key,
} from "lucide-react";
import { SAMPLE_PATIENT } from "@/lib/mock-data";

export default async function PatientAccessAuthorizationPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const patientId = params.id;

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
          Access Authorization Gateway
        </div>
        <div className="w-20" />
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 max-w-2xl mx-auto w-full">
        <div className="w-full rounded-3xl border border-slate-800 bg-slate-900/80 backdrop-blur-md p-7 sm:p-9 shadow-2xl space-y-8">
          {/* Top Status */}
          <div className="flex items-center justify-between pb-6 border-b border-slate-800">
            <div className="space-y-1">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 uppercase tracking-wider">
                Step 2 of 3: Consent Verification
              </span>
              <h1 className="text-2xl font-bold text-white mt-2">
                Patient Record Access Authorization
              </h1>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-teal-950 border border-teal-800 flex items-center justify-center text-teal-400">
              <Key className="w-6 h-6" />
            </div>
          </div>

          {/* Authorization Contract Matrix */}
          <div className="space-y-4 text-xs">
            {/* Identified Patient */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
              <span className="text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                Target Patient Identified
              </span>
              <div className="flex items-center justify-between">
                <div className="text-base font-bold text-white">{SAMPLE_PATIENT.name}</div>
                <div className="font-mono text-sky-400 font-bold">{patientId || SAMPLE_PATIENT.medibaseId}</div>
              </div>
              <p className="text-slate-400">
                Age: {SAMPLE_PATIENT.age} ({SAMPLE_PATIENT.gender}) • Blood Group: {SAMPLE_PATIENT.bloodGroup}
              </p>
            </div>

            {/* Requesting Clinician & Hospital */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                <span className="text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                  Attending Clinician
                </span>
                <div className="font-semibold text-slate-200">Dr. Sarah Jenkins, MD</div>
                <div className="text-slate-400">Cardiology Specialist</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                <span className="text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                  Healthcare Facility
                </span>
                <div className="font-semibold text-slate-200">Apollo Specialty Hospital</div>
                <div className="text-slate-400">License #MED-CARD-89021</div>
              </div>
            </div>

            {/* Purpose & Window */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                  Authorized Scope & Duration
                </span>
                <span className="text-teal-400 font-semibold">24-Hour Active Window</span>
              </div>
              <p className="text-slate-300">
                View longitudinal medical encounters, diagnostic lab reports, and append new clinical consultation notes.
              </p>
            </div>

            {/* Simulation Status */}
            <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-800/60 flex items-center gap-3 text-emerald-300">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <span className="font-bold text-white">Patient Consent Granted:</span> Patient approved access request via MediBase Patient Portal. Session token is active and ready.
              </div>
            </div>
          </div>

          {/* Proceed CTA */}
          <div className="pt-2">
            <Link
              href={`/staff/patient/${patientId || SAMPLE_PATIENT.medibaseId}/overview`}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-base transition-all shadow-xl shadow-teal-500/20 hover:scale-[1.01]"
            >
              <span>Open Patient Clinical Record Overview</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
