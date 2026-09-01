import React from "react";
import Link from "next/link";
import { User, PlusSquare, HelpCircle, ArrowRight } from "lucide-react";

export default function RoleSelectionPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-white">
      {/* Top Header */}
      <header className="px-8 py-5 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-serif font-bold text-2xl tracking-tight text-slate-900">
            MediBase
          </span>
        </div>
        <button className="text-slate-700 hover:text-slate-900 transition-colors p-1" title="Help">
          <HelpCircle className="w-5 h-5" />
        </button>
      </header>

      {/* Main Role Selection Area */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 max-w-5xl mx-auto w-full">
        <div className="text-center mb-10 max-w-xl">
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-3">
            How are you accessing MediBase?
          </h1>
          <p className="text-slate-600 text-sm sm:text-base">
            Choose the experience that matches your role.
          </p>
        </div>

        {/* Two Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
          {/* Patient Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-8 flex flex-col justify-between hover:border-slate-300 hover:shadow-md transition-all">
            <div>
              <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-slate-800 mb-6">
                <User className="w-6 h-6 stroke-[1.75]" />
              </div>
              <h2 className="font-serif font-bold text-lg text-slate-900 tracking-wider mb-2">
                PATIENT
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed mb-8">
                Access your MediBase profile, QR card, medical timeline and record activity.
              </p>
            </div>
            <Link
              href="/patient/login"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-black hover:bg-slate-800 text-white font-medium text-sm rounded-lg transition-colors"
            >
              <span>Continue as Patient</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Hospital Staff Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-8 flex flex-col justify-between hover:border-slate-300 hover:shadow-md transition-all">
            <div>
              <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-slate-800 mb-6">
                <PlusSquare className="w-6 h-6 stroke-[1.75]" />
              </div>
              <h2 className="font-serif font-bold text-lg text-slate-900 tracking-wider mb-2">
                HOSPITAL STAFF
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed mb-8">
                Identify patients, access authorized records, add visits and manage clinical workflows.
              </p>
            </div>
            <Link
              href="/staff/login"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-black hover:bg-slate-800 text-white font-medium text-sm rounded-lg transition-colors"
            >
              <span>Continue as Hospital Staff</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-100 px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
        <div>
          <span>© 2024 MediBase Secure Systems</span>
        </div>
        <div className="flex flex-wrap items-center gap-6">
          <Link href="#" className="hover:text-slate-900 transition-colors">
            Learn how MediBase protects your records
          </Link>
          <Link href="#" className="hover:text-slate-900 transition-colors">
            Privacy Policy
          </Link>
          <Link href="#" className="hover:text-slate-900 transition-colors">
            Terms of Service
          </Link>
        </div>
      </footer>
    </div>
  );
}
