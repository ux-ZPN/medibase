"use client";

import React from "react";
import Link from "next/link";
import {
  Scale,
  FileCheck,
  Shield,
  AlertCircle,
  Stethoscope,
  UserCheck,
  ArrowLeft,
  Building,
  Lock,
  Gavel,
  CheckCircle,
} from "lucide-react";

export default function TermsOfServicePage() {
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
          <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Terms of Service</span>
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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#006699] text-xs font-bold mb-3">
            <Scale className="w-3.5 h-3.5 text-[#006699]" />
            <span>Health Information Exchange Legal Framework</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            MediBase Terms of Service &amp; Conditions
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Effective Date: January 1, 2026 | Governing Unified Health Interoperability
          </p>
        </div>
      </section>

      {/* Document Content */}
      <main className="max-w-4xl mx-auto w-full px-4 sm:px-8 py-10 space-y-10">
        {/* Important Notice Callout */}
        <div className="p-4 bg-sky-50/80 border border-sky-200 rounded-xl text-xs text-sky-950 flex items-start gap-3">
          <FileCheck className="w-5 h-5 text-[#006699] shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block mb-1">Binding Agreement for Patients &amp; Healthcare Facilities</span>
            By accessing or registering an account on MediBase (whether as a Patient, Doctor, Hospital Staff Member, or Clinical Administrator), you agree to be bound by these Terms of Service and all incorporated HIPAA/ABDM privacy guidelines.
          </div>
        </div>

        {/* Section 1 */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#006699]">
            <Building className="w-4 h-4" />
            <span>Article I</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">1. Platform Scope &amp; Medical Advice Disclaimer</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            MediBase is a secure, interoperable <strong>Health Information Exchange (HIE)</strong> and Electronic Health Record (EHR) synchronization system. MediBase enables patients to store, port, and grant time-limited consent to verified medical facilities.
          </p>
          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
            <strong>CRITICAL CLINICAL DISCLAIMER:</strong> MediBase is not a licensed healthcare provider and does not practice medicine. Information transmitted through MediBase is for clinical reference and record portability only. Diagnostic and treatment decisions remain the sole professional responsibility of the attending licensed physician.
          </div>
        </section>

        {/* Section 2 */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#006699]">
            <UserCheck className="w-4 h-4" />
            <span>Article II</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">2. Patient Rights, Data Ownership &amp; Verification</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Patients retain complete, irrevocable legal ownership over all submitted medical records, prescriptions, and health history:
          </p>
          <ul className="list-disc list-inside space-y-2 text-xs text-slate-700 leading-relaxed">
            <li><strong>Exclusive Consent Authority:</strong> No healthcare facility may view or query your health timeline without your active authorization.</li>
            <li><strong>Identity Verification:</strong> Patient registration requires verified OTP mobile authentication and cryptographic Aadhaar / ABHA verification.</li>
            <li><strong>Data Portability:</strong> Patients may download their complete longitudinal medical history in standardized digital formats at any time.</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#006699]">
            <Stethoscope className="w-4 h-4" />
            <span>Article III</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">3. Healthcare Staff &amp; Clinical Facility Obligations</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            All participating doctors, nurses, and hospital staff agree to strict compliance standards:
          </p>
          <div className="space-y-2.5 text-xs text-slate-700">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <strong className="text-slate-900 block mb-0.5">A. Professional Licensure:</strong>
              Providers must maintain active, unencumbered medical registration with their respective state or national medical councils.
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <strong className="text-slate-900 block mb-0.5">B. Confidentiality &amp; Purpose Limitation:</strong>
              Patient records accessed via MediBase may only be reviewed for direct patient care, diagnosis, and treatment. Commercial harvesting or redistribution of patient data is strictly prohibited.
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <strong className="text-slate-900 block mb-0.5">C. Accurate Clinical Record Submission:</strong>
              When hospital staff upload prescriptions, lab reports, or encounter notes, they certify the clinical accuracy of the documentation.
            </div>
          </div>
        </section>

        {/* Section 4 */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-600">
            <AlertCircle className="w-4 h-4" />
            <span>Article IV</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">4. Emergency Break-Glass Override Terms</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            The Break-Glass Emergency Override feature is strictly reserved for acute, life-threatening clinical circumstances where obtaining patient consent is impossible.
          </p>
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 space-y-1.5">
            <p className="font-bold">Statutory Misuse Penalties:</p>
            <p>
              Unauthorized or non-emergency use of the Break-Glass override constitutes a serious breach of privacy laws, resulting in immediate revocation of hospital credentials, notification to the patient, and mandatory reporting to clinical regulatory bodies.
            </p>
          </div>
        </section>

        {/* Section 5 */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#006699]">
            <Gavel className="w-4 h-4" />
            <span>Article V</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">5. Limitation of Liability &amp; Governing Law</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            To the maximum extent permitted by applicable law, MediBase shall not be liable for indirect, incidental, or consequential damages arising out of network interruptions, hospital server downtime, or inaccurate clinical data uploaded by healthcare facilities.
          </p>
          <p className="text-xs text-slate-600 leading-relaxed">
            These Terms are governed by and construed under the laws of India, including the Digital Personal Data Protection Act, 2023 and the National Digital Health Mission Guidelines.
          </p>
        </section>

        {/* Section 6: Governance Team */}
        <section className="bg-gradient-to-r from-slate-900 to-[#006699] text-white rounded-2xl p-6 sm:p-8 shadow-md space-y-3">
          <h2 className="text-lg font-bold">Institutional Inquiries &amp; Legal Notices</h2>
          <p className="text-xs text-slate-200 leading-relaxed">
            For institutional service level agreements, hospital network integrations, or legal inquiries, please reach out to our management team:
          </p>
          <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <p className="font-bold text-white">Maitrey Raj</p>
              <p className="text-slate-300">General Manager / Supervisor</p>
              <a href="mailto:maitreyraj2724@gmail.com" className="text-sky-300 hover:underline">
                maitreyraj2724@gmail.com
              </a>
            </div>
            <div>
              <p className="font-bold text-white">Anuj Dutta</p>
              <p className="text-slate-300">Technical / Development Lead</p>
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
          <Link href="/privacy-policy" className="hover:text-slate-900 transition-colors">Privacy Policy</Link>
          <Link href="/terms-of-service" className="font-semibold text-[#006699]">Terms of Service</Link>
          <Link href="/security-standards" className="hover:text-slate-900 transition-colors">Security Standards</Link>
          <Link href="/contact" className="hover:text-slate-900 transition-colors">Contact Support</Link>
        </div>
      </footer>
    </div>
  );
}
