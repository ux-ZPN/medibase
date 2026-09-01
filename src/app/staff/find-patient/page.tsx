"use client";

import React, { useState } from "react";
import Link from "next/link";
import { StaffShell } from "@/components/layout/staff-shell";
import { Search, QrCode, ArrowRight, ShieldCheck, Calendar, User, UserCheck } from "lucide-react";

export default function FindPatientPage() {
  const [searchQuery, setSearchQuery] = useState("MB-102394");

  return (
    <StaffShell activeNav="find-patient">
      <div className="space-y-8 max-w-5xl">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Find a Patient
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Search by MediBase ID or scan their QR code to securely access records.
          </p>
        </div>

        {/* Search Box Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Patient ID
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter MediBase ID (e.g., MB-102394)"
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#006699]"
              />
            </div>
            <button className="px-6 py-3 bg-[#0F172A] hover:bg-slate-800 text-white font-medium text-sm rounded-lg transition-colors">
              Search
            </button>
          </div>

          <div className="mt-4 text-center">
            <Link
              href="/staff/scan-qr"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#006699] hover:underline"
            >
              <span>or</span>
              <QrCode className="w-3.5 h-3.5" />
              <span>Scan QR instead</span>
            </Link>
          </div>
        </div>

        {/* Search Result */}
        <div>
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
            SEARCH RESULT
          </h2>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-800 font-bold text-base flex items-center justify-center shrink-0">
                RS
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-base font-bold text-slate-900">Rahul Sharma</h3>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-sky-50 text-sky-700 border border-sky-200">
                    <ShieldCheck className="w-3 h-3" />
                    Authorized
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5" />
                    MB-102394
                  </span>
                  <span>•</span>
                  <span>Age: 32</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    Last visit: Oct 12, 2023
                  </span>
                </div>
              </div>
            </div>

            <Link
              href="/staff/patient/MB-102394"
              className="px-5 py-2 border border-[#006699] text-[#006699] hover:bg-sky-50 font-semibold text-xs rounded-lg transition-colors text-center"
            >
              View Patient
            </Link>
          </div>
        </div>

        {/* Recently Accessed Section */}
        <div>
          <h2 className="text-base font-bold text-slate-900 mb-3">
            Recently Accessed
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Patient 1 */}
            <Link
              href="/staff/patient/MB-992817"
              className="bg-white border border-slate-200 rounded-xl p-4 hover:border-slate-300 hover:shadow-sm transition-all flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-slate-900 text-sm">Sarah Jenkins</h4>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </div>
              <p className="text-xs text-slate-500 mb-3">MB-992817</p>
              <p className="text-[11px] text-slate-400">Accessed: Today, 09:14 AM</p>
            </Link>

            {/* Patient 2 */}
            <Link
              href="/staff/patient/MB-883716"
              className="bg-white border border-slate-200 rounded-xl p-4 hover:border-slate-300 hover:shadow-sm transition-all flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-slate-900 text-sm">David Chen</h4>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </div>
              <p className="text-xs text-slate-500 mb-3">MB-883716</p>
              <p className="text-[11px] text-slate-400">Accessed: Yesterday</p>
            </Link>

            {/* Patient 3 */}
            <Link
              href="/staff/patient/MB-774625"
              className="bg-white border border-slate-200 rounded-xl p-4 hover:border-slate-300 hover:shadow-sm transition-all flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-slate-900 text-sm">Maria Rodriguez</h4>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </div>
              <p className="text-xs text-slate-500 mb-3">MB-774625</p>
              <p className="text-[11px] text-slate-400">Accessed: Oct 24, 2023</p>
            </Link>
          </div>
        </div>
      </div>
    </StaffShell>
  );
}
