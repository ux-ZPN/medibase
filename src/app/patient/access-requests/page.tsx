"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PatientShell } from "@/components/layout/patient-shell";
import { Clock, CheckCircle2, AlertCircle, Info, Shield } from "lucide-react";

export default function PatientAccessRequestsPage() {
  const [denied, setDenied] = useState<string[]>([]);

  return (
    <PatientShell activeNav="requests">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Access Requests
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Review requests from healthcare providers before granting normal record access.
          </p>
        </div>

        {/* Requests List */}
        <div className="space-y-5">
          {/* Card 1: Dr. Sharma (Pending) */}
          {!denied.includes("sharma") && (
            <div className="bg-white border-l-4 border-l-[#006699] border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      ACCESS REQUEST
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-sky-50 text-[#006699] border border-sky-200">
                      🕒 Pending
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Dr. Sharma</h3>
                  <p className="text-xs text-slate-500">City Hospital</p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <Link
                    href="/patient/access-requests/REQ-101"
                    className="px-5 py-2 bg-[#0F172A] hover:bg-slate-800 text-white font-semibold text-xs rounded-lg transition-colors shadow"
                  >
                    Review Request
                  </Link>
                  <button
                    onClick={() => setDenied([...denied, "sharma"])}
                    className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-lg transition-colors"
                  >
                    Deny
                  </button>
                </div>
              </div>

              {/* Details Box */}
              <div className="bg-sky-50/50 border border-sky-100 rounded-xl p-4 space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Purpose
                    </span>
                    <p className="text-slate-800 font-medium mt-0.5">Consultation</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Requested Duration
                    </span>
                    <p className="text-slate-800 font-medium mt-0.5 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      30 minutes
                    </p>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Requested Information
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="px-2.5 py-1 rounded bg-white border border-slate-200 text-slate-800 font-medium text-[11px]">
                      Medical history
                    </span>
                    <span className="px-2.5 py-1 rounded bg-white border border-slate-200 text-slate-800 font-medium text-[11px]">
                      Prescriptions
                    </span>
                    <span className="px-2.5 py-1 rounded bg-white border border-slate-200 text-slate-800 font-medium text-[11px]">
                      Diagnostic reports
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Card 2: Dr. Anjali Rao (Approved) */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    ACCESS REQUEST
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    ● Approved
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">Dr. Anjali Rao</h3>
                <p className="text-xs text-slate-500">Metro Health Center</p>
              </div>

              <div className="text-xs text-slate-500">
                <span className="block text-[10px] font-semibold text-slate-400 uppercase">Active until</span>
                <span className="font-bold text-slate-800">Today, 5:00 PM</span>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 text-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Purpose
              </span>
              <p className="text-slate-800 font-medium mt-0.5">Follow-up</p>
            </div>
          </div>

          {/* Card 3: Apollo Hospital (Expired) */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4 opacity-75">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    ACCESS REQUEST
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600">
                    🕒 Expired
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">Apollo Hospital</h3>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 text-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Purpose
              </span>
              <p className="text-slate-800 font-medium mt-0.5">Emergency Triage (History)</p>
            </div>
          </div>
        </div>

        {/* Info callout */}
        <div className="bg-sky-50/60 border border-sky-100 rounded-xl p-4 flex items-center gap-3 text-xs text-slate-600">
          <Info className="w-5 h-5 text-[#006699] shrink-0" />
          <p>
            Emergency access is handled through a separate controlled workflow.
          </p>
        </div>
      </div>
    </PatientShell>
  );
}
