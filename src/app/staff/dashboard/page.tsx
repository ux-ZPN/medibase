import Link from "next/link";
import {
  QrCode,
  Search,
  Stethoscope,
  Building2,
  LogOut,
  ArrowRight,
} from "lucide-react";
import { SAMPLE_PATIENT } from "@/lib/mock-data";

export default function HospitalStaffDashboardPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-teal-500 selection:text-white">
      {/* Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-500 flex items-center justify-center text-slate-950 font-bold">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-base text-white">MediBase</span>
              <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-950 text-teal-400 border border-teal-800">
                Hospital Staff Portal
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
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
        {/* Clinician Identity Banner */}
        <div className="p-6 rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/90 to-teal-950/40 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-teal-950 border border-teal-800 flex items-center justify-center text-teal-400 font-bold text-xl">
              SJ
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-white">Dr. Sarah Jenkins, MD</h1>
                <span className="text-xs px-2 py-0.5 rounded-md bg-teal-950 text-teal-300 border border-teal-800">
                  Cardiology
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <span>Apollo Specialty Hospital • License #MED-CARD-89021</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3.5 py-1.5 rounded-xl border border-slate-800 bg-slate-950/60 text-xs text-slate-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Clinical Session Active</span>
            </div>
          </div>
        </div>

        {/* Primary Identification CTAs */}
        <div>
          <h2 className="text-lg font-bold text-slate-200 mb-4">Patient Identification & Intake</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Action 1: Scan Patient QR */}
            <Link
              href="/staff/scan-qr"
              className="group p-8 rounded-2xl border border-slate-800 bg-slate-900/50 hover:bg-slate-900 hover:border-teal-500/60 transition-all duration-200 flex flex-col justify-between shadow-lg hover:shadow-teal-500/10"
            >
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-teal-950 border border-teal-800/60 flex items-center justify-center text-teal-400 group-hover:bg-teal-400 group-hover:text-slate-950 transition-all">
                  <QrCode className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-teal-300">
                    Scan Patient QR Code
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Instantly read patient digital badge token for identification. Initiates the secure authorization request flow.
                  </p>
                </div>
              </div>
              <div className="mt-8 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-teal-400 group-hover:text-teal-300">
                <span>Launch QR Scanner</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Action 2: Search Patient ID */}
            <Link
              href="/staff/find-patient"
              className="group p-8 rounded-2xl border border-slate-800 bg-slate-900/50 hover:bg-slate-900 hover:border-sky-500/60 transition-all duration-200 flex flex-col justify-between shadow-lg hover:shadow-sky-500/10"
            >
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-sky-950 border border-sky-800/60 flex items-center justify-center text-sky-400 group-hover:bg-sky-500 group-hover:text-slate-950 transition-all">
                  <Search className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-sky-300">
                    Find Patient by MediBase ID
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Lookup patient record via human-readable MediBase ID (e.g. MB-2026-89412) to request access authorization.
                  </p>
                </div>
              </div>
              <div className="mt-8 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-sky-400 group-hover:text-sky-300">
                <span>Search MediBase ID</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>

        {/* Active Intake Queue / Recent Patient */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
              Today&apos;s Identified Patients
            </h2>
            <span className="text-xs text-slate-500">1 Patient in Session</span>
          </div>

          <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300 font-bold">
                {SAMPLE_PATIENT.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-white">{SAMPLE_PATIENT.name}</h4>
                  <span className="text-[11px] font-mono text-sky-400 font-semibold">{SAMPLE_PATIENT.medibaseId}</span>
                </div>
                <div className="text-xs text-slate-400">
                  {SAMPLE_PATIENT.age} y/o {SAMPLE_PATIENT.gender} • Blood: {SAMPLE_PATIENT.bloodGroup} • Follow-up Consultation
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href={`/staff/patient/${SAMPLE_PATIENT.medibaseId}/authorize`}
                className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1.5"
              >
                <span>Authorize & View Patient</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
