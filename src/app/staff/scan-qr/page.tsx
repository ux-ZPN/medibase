import Link from "next/link";
import {
  ArrowLeft,
  QrCode,
  Search,
  Camera,
  ArrowRight,
} from "lucide-react";
import { SAMPLE_PATIENT } from "@/lib/mock-data";

export default function ScanPatientQrPage() {
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
          QR Token Scanner
        </div>
        <div className="w-20" />
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 max-w-xl mx-auto w-full space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Scan Patient QR Badge</h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
            Point camera at the patient&apos;s MediBase digital identity badge to read their identification token.
          </p>
        </div>

        {/* Scanner Viewfinder Box */}
        <div className="w-full aspect-square max-w-sm rounded-3xl border-2 border-dashed border-teal-500/50 bg-slate-900/80 relative flex flex-col items-center justify-center p-6 shadow-2xl overflow-hidden">
          {/* Animated Scanning Beam */}
          <div className="absolute inset-x-8 top-12 h-1 bg-gradient-to-r from-transparent via-teal-400 to-transparent animate-pulse shadow-lg shadow-teal-500/50" />

          {/* Corner Guides */}
          <div className="absolute top-6 left-6 w-8 h-8 border-t-4 border-l-4 border-teal-400 rounded-tl-lg" />
          <div className="absolute top-6 right-6 w-8 h-8 border-t-4 border-r-4 border-teal-400 rounded-tr-lg" />
          <div className="absolute bottom-6 left-6 w-8 h-8 border-b-4 border-l-4 border-teal-400 rounded-bl-lg" />
          <div className="absolute bottom-6 right-6 w-8 h-8 border-b-4 border-r-4 border-teal-400 rounded-br-lg" />

          <div className="w-20 h-20 rounded-2xl bg-teal-950/60 border border-teal-800/60 flex items-center justify-center text-teal-400 mb-4">
            <Camera className="w-10 h-10" />
          </div>

          <p className="text-xs font-semibold text-slate-300">Align QR badge within frame</p>
          <span className="text-[11px] text-slate-500 mt-1">Camera active • Auto-detecting</span>
        </div>

        {/* Simulate Scan Trigger */}
        <div className="w-full space-y-3">
          <Link
            href={`/staff/patient/${SAMPLE_PATIENT.medibaseId}/authorize`}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-teal-500/20 hover:scale-[1.01]"
          >
            <QrCode className="w-4 h-4" />
            <span>Simulate QR Scan (Found: {SAMPLE_PATIENT.medibaseId})</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>

          <Link
            href="/staff/find-patient"
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-slate-800 hover:bg-slate-900 text-slate-300 text-xs font-semibold transition-colors"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search by MediBase ID instead</span>
          </Link>
        </div>

        {/* Security Notice */}
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 text-[11px] text-slate-400 text-center leading-relaxed">
          The QR code serves exclusively as an identification token. Scanning forwards you to the authorization screen and does not bypass patient consent.
        </div>
      </main>
    </div>
  );
}
