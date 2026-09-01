"use client";

import React, { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { StaffShell } from "@/components/layout/staff-shell";
import {
  ShieldAlert,
  Eye,
  CheckCircle2,
  Stethoscope,
  Building2,
  FileSpreadsheet,
  Send,
  ArrowRight,
} from "lucide-react";

export default function PatientAuthorizePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const patientId = resolvedParams.id || "MB-102394";
  const router = useRouter();
  const [requested, setRequested] = useState(false);

  const handleRequest = () => {
    setRequested(true);
    setTimeout(() => {
      router.push(`/staff/patient/${patientId}`);
    }, 1200);
  };

  return (
    <StaffShell activeNav="recent-patients">
      <div className="space-y-6 max-w-5xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Patient Access Authorization
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Review the request details to securely access protected health information.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Red Alert Callout */}
            <div className="bg-sky-50/50 border-l-4 border-l-rose-600 border border-slate-200 rounded-xl p-5 flex items-start gap-4">
              <ShieldAlert className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-rose-800 uppercase tracking-wider mb-1">
                  AUTHORIZATION REQUIRED
                </p>
                <p className="text-xs text-slate-700 leading-relaxed">
                  Access to protected medical information requires appropriate authorization. Do not show full medical history on this screen. Patient must authorize this request via their MediBase app.
                </p>
              </div>
            </div>

            {/* Patient Subject Box */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-800 font-bold text-base flex items-center justify-center shrink-0">
                RS
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Rahul Sharma</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  🪪 {patientId} • 📅 Age: 32
                </p>
              </div>
            </div>

            {/* Requesting Entity */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                REQUESTING ENTITY
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-lg flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-sky-50 text-[#006699] flex items-center justify-center shrink-0">
                    <Stethoscope className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Provider
                    </span>
                    <span className="text-xs font-bold text-slate-900">Dr. Sharma</span>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-100 rounded-lg flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-sky-50 text-[#006699] flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Facility
                    </span>
                    <span className="text-xs font-bold text-slate-900">City Hospital</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-100 rounded-lg flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-sky-50 text-[#006699] flex items-center justify-center shrink-0">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Purpose of Access
                  </span>
                  <span className="text-xs font-bold text-slate-900">Consultation</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm border-b border-slate-100 pb-3">
                <Eye className="w-4 h-4 text-[#006699]" />
                <span>Requested Scope</span>
              </div>

              <div className="space-y-3.5">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#006699] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-slate-900">Medical Timeline</p>
                    <p className="text-[11px] text-slate-500">Historical visits and procedures</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#006699] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-slate-900">Prescriptions</p>
                    <p className="text-[11px] text-slate-500">Active and past medications</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#006699] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-slate-900">Diagnostic Reports</p>
                    <p className="text-[11px] text-slate-500">Lab results and imaging</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <button
                onClick={handleRequest}
                disabled={requested}
                className="w-full py-3 px-4 bg-black hover:bg-slate-800 text-white font-semibold text-xs rounded-lg shadow transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{requested ? "Sending Request..." : "Request Patient Access"}</span>
              </button>

              <Link
                href={`/staff/patient/${patientId}`}
                className="w-full py-2.5 px-4 border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-lg transition-colors block text-center"
              >
                Cancel
              </Link>
            </div>
          </div>
        </div>
      </div>
    </StaffShell>
  );
}
