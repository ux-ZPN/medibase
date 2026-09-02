"use client";

import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  Eye,
  FileText,
  UserCheck,
  AlertTriangle,
  Database,
  ArrowLeft,
  Mail,
  Scale,
  Calendar,
  CheckCircle2,
  Server,
  Share2,
} from "lucide-react";

export default function PrivacyPolicyPage() {
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
          <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Privacy Policy</span>
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
            <span>ABDM &amp; HIPAA Compliant Data Governance</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            MediBase Global Privacy Policy
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Effective Date: January 1, 2026 | Last Updated: September 2026
          </p>
          <p className="mt-2 text-xs text-slate-500 max-w-xl mx-auto">
            Governing the collection, zero-knowledge encryption, storage, and patient-consented transmission of Electronic Health Records (EHR).
          </p>
        </div>
      </section>

      {/* Document Body */}
      <main className="max-w-4xl mx-auto w-full px-4 sm:px-8 py-10 space-y-10">
        {/* Core Principles Callout */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
            <Lock className="w-5 h-5 text-[#006699] mb-2" />
            <h3 className="text-xs font-bold text-slate-900 mb-1">Patient-Owned Data</h3>
            <p className="text-xs text-slate-500">You retain 100% legal ownership of your health records. No doctor or hospital can access them without your explicit consent.</p>
          </div>
          <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
            <Database className="w-5 h-5 text-emerald-600 mb-2" />
            <h3 className="text-xs font-bold text-slate-900 mb-1">Zero Plaintext Aadhaar</h3>
            <p className="text-xs text-slate-500">National IDs are irreversibly hashed using SHA-256. Plaintext Aadhaar numbers are never stored in our databases.</p>
          </div>
          <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
            <Eye className="w-5 h-5 text-purple-600 mb-2" />
            <h3 className="text-xs font-bold text-slate-900 mb-1">Immutable Audits</h3>
            <p className="text-xs text-slate-500">Every single view, report upload, or emergency access creates an indelible log visible directly on your dashboard.</p>
          </div>
        </div>

        {/* Section 1 */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#006699]">
            <FileText className="w-4 h-4" />
            <span>Section 1</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">1. Information We Collect &amp; Process</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            MediBase operates as a specialized Healthcare Information Exchange (HIE) conforming to the <strong>Ayushman Bharat Digital Mission (ABDM)</strong> framework, the <strong>Digital Personal Data Protection (DPDP) Act</strong>, and <strong>Health Insurance Portability and Accountability Act (HIPAA)</strong> security rules.
          </p>
          <div className="space-y-2 text-xs text-slate-700">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <strong className="text-slate-900 block mb-0.5">A. Demographic &amp; Identity Data:</strong>
              Full legal name, date of birth, contact phone number, emergency contact, blood group, gender, and encrypted ABHA / MediBase ID.
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <strong className="text-slate-900 block mb-0.5">B. Clinical &amp; Longitudinal Health Records (EHR):</strong>
              Diagnoses, prescription orders, lab test reports, radiological scans (X-Ray, MRI, CT), discharge summaries, vitals, allergies, and chronic condition registries.
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <strong className="text-slate-900 block mb-0.5">C. Healthcare Provider Credentials:</strong>
              Doctor license numbers, hospital affiliations, department registries, and biometric digital sign-in tokens.
            </div>
          </div>
        </section>

        {/* Section 2 */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#006699]">
            <Lock className="w-4 h-4" />
            <span>Section 2</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">2. Zero-Knowledge Cryptographic Architecture</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            To ensure absolute confidentiality and immunity against database breach vectors:
          </p>
          <ul className="list-disc list-inside space-y-2 text-xs text-slate-700 leading-relaxed">
            <li><strong>AES-256-GCM Encryption at Rest:</strong> All clinical documents, medical images, and encounter notes are encrypted prior to persistence.</li>
            <li><strong>TLS 1.3 In-Transit Protection:</strong> All API communication is strictly enforced over TLS 1.3 with Perfect Forward Secrecy (PFS).</li>
            <li><strong>National Identity Hashing:</strong> Aadhaar numbers are salted and processed through cryptographic one-way hashing (SHA-256). Only the last 4 digits are retained for human visual verification.</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#006699]">
            <UserCheck className="w-4 h-4" />
            <span>Section 3</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">3. Dynamic Patient Consent Architecture</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            MediBase enforces a strict <strong>Consent-First</strong> model:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 bg-sky-50/60 border border-sky-200 rounded-xl">
              <strong className="text-slate-900 block mb-1">Time-Bound Access</strong>
              Access granted to doctors is automatically terminated upon expiry of the authorized consultation window (e.g., 24 hours, 7 days, or 30 days).
            </div>
            <div className="p-3.5 bg-sky-50/60 border border-sky-200 rounded-xl">
              <strong className="text-slate-900 block mb-1">Instant One-Click Revocation</strong>
              Patients can revoke access for any hospital or practitioner at any moment directly from their Access Requests portal.
            </div>
          </div>
        </section>

        {/* Section 4 */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-600">
            <AlertTriangle className="w-4 h-4" />
            <span>Section 4</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">4. Emergency Break-Glass Override Protocol</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            In critical life-threatening situations where the patient is unconscious or incapacitated, authorized emergency physicians may invoke the <strong>Break-Glass Protocol</strong> to view vital allergies, blood type, and emergency records.
          </p>
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 space-y-2">
            <p className="font-bold">Break-Glass Accountability Guarantees:</p>
            <ul className="list-disc list-inside space-y-1 text-rose-700">
              <li>Instant SMS &amp; Email alerts are dispatched to the patient and their emergency contacts.</li>
              <li>A mandatory clinical justification note is recorded into the immutable audit trail.</li>
              <li>Emergency access automatically expires in 12 hours.</li>
            </ul>
          </div>
        </section>

        {/* Section 5 */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#006699]">
            <Scale className="w-4 h-4" />
            <span>Section 5</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">5. Patient Statutory Rights</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Under applicable health data protection laws, you enjoy the following rights:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <strong>Right to Access &amp; Export:</strong> Download full FHIR-compliant medical records and timeline data anytime.
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <strong>Right to Rectification:</strong> Request corrections to erroneous clinical or demographic metadata.
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <strong>Right to Revoke Consent:</strong> Terminate third-party healthcare facility access immediately.
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <strong>Right to Grievance Redressal:</strong> Direct escalation to our appointed Data Protection Officer.
            </div>
          </div>
        </section>

        {/* Section 6: Grievance Officer */}
        <section className="bg-gradient-to-r from-slate-900 to-[#006699] text-white rounded-2xl p-6 sm:p-8 shadow-md space-y-3">
          <h2 className="text-lg font-bold">Data Protection Officer &amp; Grievance Redressal</h2>
          <p className="text-xs text-slate-200 leading-relaxed">
            For inquiries regarding privacy governance, data rectification, or compliance audits, please contact our supervisory team:
          </p>
          <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <p className="font-bold text-white">Maitrey Raj</p>
              <p className="text-slate-300">General Manager / Platform Supervisor</p>
              <a href="mailto:maitreyraj2724@gmail.com" className="text-sky-300 hover:underline">
                maitreyraj2724@gmail.com
              </a>
            </div>
            <div>
              <p className="font-bold text-white">Anuj Dutta</p>
              <p className="text-slate-300">Technical &amp; Development Lead</p>
              <a href="mailto:anujduttacodr@gmail.com" className="text-sky-300 hover:underline">
                anujduttacodr@gmail.com
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
          <Link href="/privacy-policy" className="font-semibold text-[#006699]">Privacy Policy</Link>
          <Link href="/terms-of-service" className="hover:text-slate-900 transition-colors">Terms of Service</Link>
          <Link href="/security-standards" className="hover:text-slate-900 transition-colors">Security Standards</Link>
          <Link href="/contact" className="hover:text-slate-900 transition-colors">Contact Support</Link>
        </div>
      </footer>
    </div>
  );
}
