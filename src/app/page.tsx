import Link from "next/link";
import {
  ShieldCheck,
  QrCode,
  History,
  Lock,
  ArrowRight,
  Activity,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-sky-500 selection:text-white">
      {/* Navigation Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-sky-500/20">
              <Activity className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">
              Medi<span className="text-sky-400">Base</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/role-select"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-sm transition-all duration-200 shadow-md shadow-sky-500/25 hover:shadow-sky-500/40"
            >
              <span>Enter Platform</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col justify-center items-center text-center px-4 py-16 md:py-24 max-w-5xl mx-auto relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-sky-500/30 bg-sky-950/50 text-sky-300 text-xs font-semibold uppercase tracking-wider mb-6">
          <ShieldCheck className="w-4 h-4 text-sky-400" />
          Secure Healthcare Record-Sharing Platform
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight max-w-4xl">
          Unified Longitudinal Health History,{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-teal-300 to-indigo-400">
            Controlled by the Patient.
          </span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl font-normal leading-relaxed">
          MediBase enables authorized healthcare providers to access and contribute to a patient&apos;s
          longitudinal medical history across hospitals and clinics through granular consent.
        </p>

        {/* Primary CTA */}
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
          <Link
            href="/role-select"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-teal-400 hover:from-sky-400 hover:to-teal-300 text-slate-950 font-bold text-base transition-all duration-200 shadow-xl shadow-sky-500/20 hover:scale-[1.02]"
          >
            <span>Launch MediBase Prototype</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Core Product Workflow */}
        <div className="mt-16 w-full pt-10 border-t border-slate-800/80">
          <p className="text-xs uppercase font-semibold text-slate-400 tracking-widest mb-6">
            Core Clinical Continuum Architecture
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-left">
            {[
              { step: "01", name: "IDENTIFY", desc: "Digital QR or MediBase ID token" },
              { step: "02", name: "AUTHORIZE", desc: "Patient approves time-bound consent" },
              { step: "03", name: "UNDERSTAND", desc: "Structured 'What's Changed?' summary" },
              { step: "04", name: "TREAT", desc: "Informed clinical care with full history" },
              { step: "05", name: "RECORD", desc: "Append new visit & diagnostic reports" },
              { step: "06", name: "AUDIT", desc: "Immutable patient access transparency" },
            ].map((item) => (
              <div
                key={item.step}
                className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm"
              >
                <div className="text-sky-400 font-mono text-xs font-bold">{item.step}</div>
                <div className="font-semibold text-sm text-slate-100 mt-1">{item.name}</div>
                <div className="text-xs text-slate-400 mt-1 leading-snug">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Value Pillars */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-left w-full">
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-sky-950 border border-sky-800/50 flex items-center justify-center text-sky-400">
              <QrCode className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white">QR Patient Identification</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              QR tokens act purely as a cryptographic identification mechanism without storing medical records on the badge itself.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-950 border border-teal-800/50 flex items-center justify-center text-teal-400">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white">Granular Patient Consent</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Patients review incoming access requests from specific providers and grant time-bounded record viewing permissions.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-950 border border-indigo-800/50 flex items-center justify-center text-indigo-400">
              <History className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white">Longitudinal Continuity</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Healthcare providers access a unified chronological timeline of all consultations, prescriptions, and lab tests across facilities.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        <p>MediBase Continuity Platform • Smart India Hackathon Prototype</p>
      </footer>
    </div>
  );
}
