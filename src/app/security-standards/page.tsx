"use client";

import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  KeyRound,
  Server,
  Activity,
  AlertOctagon,
  CheckCircle2,
  FileCode,
  ArrowLeft,
  Cpu,
  RefreshCw,
  Award,
} from "lucide-react";

export default function SecurityStandardsPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-sky-100 selection:text-sky-900">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-lg bg-[#006699] flex items-center justify-center text-white font-bold">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="M12 8v8m-4-4h8" strokeWidth="2.5" />
              </svg>
            </div>
            <span className="font-bold text-xl text-slate-900 tracking-tight">MediBase</span>
          </Link>
          <span className="text-slate-300">/</span>
          <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Security Architecture</span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#006699] hover:bg-[#005580] rounded-lg shadow transition-colors"
          >
            <span>Contact Support</span>
          </Link>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="bg-gradient-to-b from-white via-sky-50/40 to-slate-50 border-b border-slate-200 pt-10 pb-12 px-4 sm:px-8 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Bank-Grade Healthcare Cryptography</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            MediBase Security Standards &amp; Architecture
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Zero-Trust Access Control, End-to-End Encryption &amp; Immutable Audit Trails
          </p>
        </div>
      </section>

      {/* Document Content */}
      <main className="max-w-4xl mx-auto w-full px-4 sm:px-8 py-10 space-y-10">
        {/* Compliance Highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
            <Award className="w-6 h-6 text-[#006699] mx-auto mb-1.5" />
            <span className="text-xs font-bold text-slate-900 block">ABDM M1 / M2 / M3</span>
            <span className="text-[10px] text-slate-500">Milestone Compliant</span>
          </div>
          <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
            <Lock className="w-6 h-6 text-emerald-600 mx-auto mb-1.5" />
            <span className="text-xs font-bold text-slate-900 block">AES-256-GCM</span>
            <span className="text-[10px] text-slate-500">At-Rest Encryption</span>
          </div>
          <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
            <KeyRound className="w-6 h-6 text-purple-600 mx-auto mb-1.5" />
            <span className="text-xs font-bold text-slate-900 block">TLS 1.3 Strict</span>
            <span className="text-[10px] text-slate-500">In-Transit Protection</span>
          </div>
          <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
            <Activity className="w-6 h-6 text-rose-600 mx-auto mb-1.5" />
            <span className="text-xs font-bold text-slate-900 block">Immutable Logs</span>
            <span className="text-[10px] text-slate-500">Zero-Tamper Trail</span>
          </div>
        </div>

        {/* Pillar 1: Encryption Architecture */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#006699]">
            <Lock className="w-4 h-4" />
            <span>Pillar I</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">1. Cryptographic Protection Pipeline</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            MediBase protects electronic health data across every stage of the data lifecycle:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-700">
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <strong className="text-slate-900 block mb-1">Encrypted Record Storage:</strong>
              Clinical encounters, scanned prescriptions, and lab telemetry are encrypted with AES-256 authenticated Galois/Counter Mode (GCM).
            </div>
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <strong className="text-slate-900 block mb-1">Irreversible Identity Hashing:</strong>
              Patient Aadhaar and national ID credentials undergo SHA-256 cryptographic hashing with institutional salts, preventing reverse extraction even in the event of an infrastructure breach.
            </div>
          </div>
        </section>

        {/* Pillar 2: Zero-Trust & RBAC */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#006699]">
            <KeyRound className="w-4 h-4" />
            <span>Pillar II</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">2. Zero-Trust Access &amp; Granular RBAC</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Access to health data is never presumed. Every request is verified, authenticated, and checked against explicit patient consent scopes:
          </p>
          <ul className="list-disc list-inside space-y-2 text-xs text-slate-700 leading-relaxed">
            <li><strong>Role-Based Access Control (RBAC):</strong> Strict separation between patient users, attending physicians, registered nurses, and clinical administrators.</li>
            <li><strong>Time-Bounded Access Sessions:</strong> Doctor authorization tokens expire automatically, requiring fresh patient re-authorization for subsequent clinical visits.</li>
            <li><strong>Departmental Scoping:</strong> Access can be restricted by clinical category (e.g., Cardiology only, Orthopedics only) according to the patient&apos;s preference.</li>
          </ul>
        </section>

        {/* Pillar 3: Immutable Audit Trails */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#006699]">
            <Activity className="w-4 h-4" />
            <span>Pillar III</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">3. Immutable Auditing &amp; Forensic Logging</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            MediBase maintains an indelible, append-only audit trail for all operations across the platform:
          </p>
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-2 text-slate-700">
            <p>Every audit entry captures:</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-[11px] text-slate-800">
              <span className="p-1.5 bg-white border border-slate-200 rounded">✓ Actor UID &amp; Role</span>
              <span className="p-1.5 bg-white border border-slate-200 rounded">✓ Hospital Affiliation</span>
              <span className="p-1.5 bg-white border border-slate-200 rounded">✓ Millisecond Timestamp</span>
              <span className="p-1.5 bg-white border border-slate-200 rounded">✓ Action / Purpose</span>
              <span className="p-1.5 bg-white border border-slate-200 rounded">✓ Emergency Flag</span>
              <span className="p-1.5 bg-white border border-slate-200 rounded">✓ Resource Identifier</span>
            </div>
          </div>
        </section>

        {/* Security Contacts */}
        <section className="bg-gradient-to-r from-slate-900 to-[#006699] text-white rounded-2xl p-6 sm:p-8 shadow-md space-y-3">
          <h2 className="text-lg font-bold">Vulnerability Disclosure &amp; Security Engineering</h2>
          <p className="text-xs text-slate-200 leading-relaxed">
            To report a security vulnerability or coordinate with our security operations team:
          </p>
          <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <p className="font-bold text-white">Anuj Dutta</p>
              <p className="text-slate-300">Technical / Development Lead</p>
              <a href="mailto:anujduttacodr@gmail.com" className="text-sky-300 hover:underline">
                anujduttacodr@gmail.com
              </a>
            </div>
            <div>
              <p className="font-bold text-white">Maitrey Raj</p>
              <p className="text-slate-300">General Manager / Supervisor</p>
              <a href="mailto:maitreyraj2724@gmail.com" className="text-sky-300 hover:underline">
                maitreyraj2724@gmail.com
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white px-6 sm:px-12 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-800">MediBase</span>
          <span>© 2026 MediBase Secure Health Systems. All rights reserved.</span>
        </div>
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-slate-600">
          <Link href="/privacy-policy" className="hover:text-slate-900 transition-colors">Privacy Policy</Link>
          <Link href="/terms-of-service" className="hover:text-slate-900 transition-colors">Terms of Service</Link>
          <Link href="/security-standards" className="font-semibold text-[#006699]">Security Standards</Link>
          <Link href="/contact" className="hover:text-slate-900 transition-colors">Contact Support</Link>
        </div>
      </footer>
    </div>
  );
}
