import Link from "next/link";
import { ArrowLeft, CheckCircle2, Phone, Info } from "lucide-react";
import { SAMPLE_PATIENT } from "@/lib/mock-data";

export default function DigitalIdentityCardPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-sky-500 selection:text-white">
      {/* Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md px-6 h-16 flex items-center justify-between sticky top-0 z-50">
        <Link
          href="/patient/dashboard"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Patient Dashboard</span>
        </Link>
        <div className="font-bold text-sm text-slate-200">
          MediBase Digital Identity
        </div>
        <div className="w-20" />
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 max-w-2xl mx-auto w-full">
        {/* Important Product Rule Banner */}
        <div className="w-full mb-6 p-4 rounded-xl border border-sky-500/30 bg-sky-950/30 flex items-start gap-3">
          <Info className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
          <div className="text-xs text-sky-200/90 leading-relaxed">
            <span className="font-bold text-white">Patient Identification Only:</span> This QR code and MediBase ID are strictly for identity lookup. They contain zero clinical records. When a healthcare provider scans this token, a formal consent authorization request must still be approved by you before any medical history is unlocked.
          </div>
        </div>

        {/* Digital Identity Card (High Fidelity) */}
        <div className="w-full rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-sky-950/70 p-7 sm:p-9 shadow-2xl shadow-sky-500/10 relative overflow-hidden space-y-8">
          {/* Card Top Branding */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center text-slate-950 font-bold">
                M
              </div>
              <span className="font-extrabold text-lg tracking-tight text-white">
                Medi<span className="text-sky-400">Base</span> ID
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Active National ID</span>
            </div>
          </div>

          {/* Patient Details & Simulated QR Code */}
          <div className="flex flex-col sm:flex-row items-center gap-8">
            {/* QR Code Container */}
            <div className="p-4 rounded-2xl bg-white text-slate-950 shadow-inner flex flex-col items-center justify-center shrink-0 border-4 border-sky-400/30">
              {/* Crisp SVG QR Code Representation */}
              <div className="w-40 h-40 flex items-center justify-center relative">
                <svg viewBox="0 0 100 100" className="w-full h-full text-slate-950 fill-current">
                  {/* Outer corner markers */}
                  <rect x="5" y="5" width="26" height="26" rx="4" fill="#0284c7" />
                  <rect x="10" y="10" width="16" height="16" fill="white" />
                  <rect x="14" y="14" width="8" height="8" fill="#0f172a" />

                  <rect x="69" y="5" width="26" height="26" rx="4" fill="#0284c7" />
                  <rect x="74" y="10" width="16" height="16" fill="white" />
                  <rect x="78" y="14" width="8" height="8" fill="#0f172a" />

                  <rect x="5" y="69" width="26" height="26" rx="4" fill="#0284c7" />
                  <rect x="10" y="74" width="16" height="16" fill="white" />
                  <rect x="14" y="78" width="8" height="8" fill="#0f172a" />

                  {/* Simulated matrix cells */}
                  <rect x="36" y="8" width="8" height="8" />
                  <rect x="48" y="14" width="8" height="8" />
                  <rect x="36" y="24" width="8" height="8" />
                  <rect x="56" y="8" width="8" height="8" />

                  <rect x="10" y="38" width="8" height="8" />
                  <rect x="22" y="44" width="8" height="8" />
                  <rect x="10" y="52" width="8" height="8" />

                  <rect x="38" y="38" width="24" height="24" rx="4" fill="#0284c7" />
                  <rect x="44" y="44" width="12" height="12" fill="white" />

                  <rect x="68" y="38" width="8" height="8" />
                  <rect x="80" y="44" width="8" height="8" />
                  <rect x="72" y="54" width="8" height="8" />

                  <rect x="36" y="70" width="8" height="8" />
                  <rect x="48" y="78" width="8" height="8" />
                  <rect x="60" y="70" width="8" height="8" />
                  <rect x="76" y="74" width="8" height="8" />
                  <rect x="84" y="84" width="8" height="8" />
                </svg>
              </div>
              <span className="text-[10px] font-mono font-bold text-slate-700 mt-2">
                SCAN FOR ID VERIFICATION
              </span>
            </div>

            {/* Patient Attributes */}
            <div className="space-y-4 flex-1 text-left w-full">
              <div>
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Patient Full Name</span>
                <h2 className="text-2xl font-bold text-white mt-0.5">{SAMPLE_PATIENT.name}</h2>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-slate-400 font-medium">MediBase ID</span>
                  <div className="font-mono text-sm font-bold text-sky-400 mt-0.5">
                    {SAMPLE_PATIENT.medibaseId}
                  </div>
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-medium">Blood Group</span>
                  <div className="text-sm font-bold text-rose-400 mt-0.5">
                    {SAMPLE_PATIENT.bloodGroup}
                  </div>
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-medium">Date of Birth</span>
                  <div className="text-sm font-semibold text-slate-200 mt-0.5">
                    {SAMPLE_PATIENT.dob}
                  </div>
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-medium">Gender</span>
                  <div className="text-sm font-semibold text-slate-200 mt-0.5">
                    {SAMPLE_PATIENT.gender}
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="pt-3 border-t border-slate-800">
                <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                  <Phone className="w-3 h-3 text-emerald-400" />
                  <span>Emergency Contact</span>
                </span>
                <div className="text-xs text-slate-200 font-medium mt-1">
                  {SAMPLE_PATIENT.emergencyContact.name} ({SAMPLE_PATIENT.emergencyContact.relationship}) — {SAMPLE_PATIENT.emergencyContact.phone}
                </div>
              </div>
            </div>
          </div>

          {/* Footer of Card */}
          <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>ISSUED: 2026-01-01</span>
            <span>STATUS: VERIFIED & COMPLIANT</span>
          </div>
        </div>

        {/* Back Action */}
        <div className="mt-8">
          <Link
            href="/patient/dashboard"
            className="px-6 py-2.5 rounded-xl border border-slate-800 hover:bg-slate-900 text-slate-300 text-sm font-semibold transition-colors"
          >
            Return to Dashboard
          </Link>
        </div>
      </main>
    </div>
  );
}
