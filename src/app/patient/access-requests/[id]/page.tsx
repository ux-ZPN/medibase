"use client";

import React, { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PatientShell } from "@/components/layout/patient-shell";
import {
  ArrowLeft,
  Clock,
  Shield,
  CheckCircle2,
  Building2,
  Lock,
} from "lucide-react";

export default function ReviewAccessRequestPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [approving, setApproving] = useState(false);

  const handleApprove = () => {
    setApproving(true);
    setTimeout(() => {
      router.push("/patient/access-requests");
    }, 600);
  };

  return (
    <PatientShell activeNav="requests">
      <div className="flex items-center justify-center py-6">
        <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          {/* Header */}
          <div className="p-6 sm:p-8 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href="/patient/access-requests"
                className="text-slate-500 hover:text-slate-900 transition-colors p-1"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                Review Access Request
              </h1>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-sky-50 text-[#006699] border border-sky-200">
              🕒 Pending
            </span>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* Doctor Info & Purpose Card */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-slate-800 text-white font-bold text-base flex items-center justify-center shrink-0">
                  DS
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Dr. Sharma</h2>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <Building2 className="w-3.5 h-3.5 text-[#006699]" />
                    <span>City Hospital</span>
                  </p>
                </div>
              </div>

              <div className="p-3 bg-sky-50/70 border border-sky-100 rounded-lg text-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                  PURPOSE
                </span>
                <span className="font-semibold text-slate-900">
                  Follow-up consultation
                </span>
              </div>
            </div>

            {/* Requested Data Scope (2x2 Grid) */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                REQUESTED DATA SCOPE
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 bg-white border border-slate-200 rounded-lg flex items-center gap-2.5 font-semibold text-slate-800 shadow-xs">
                  <CheckCircle2 className="w-4 h-4 text-[#006699]" />
                  <span>Visit history</span>
                </div>

                <div className="p-3.5 bg-white border border-slate-200 rounded-lg flex items-center gap-2.5 font-semibold text-slate-800 shadow-xs">
                  <CheckCircle2 className="w-4 h-4 text-[#006699]" />
                  <span>Diagnoses</span>
                </div>

                <div className="p-3.5 bg-white border border-slate-200 rounded-lg flex items-center gap-2.5 font-semibold text-slate-800 shadow-xs">
                  <CheckCircle2 className="w-4 h-4 text-[#006699]" />
                  <span>Prescriptions</span>
                </div>

                <div className="p-3.5 bg-white border border-slate-200 rounded-lg flex items-center gap-2.5 font-semibold text-slate-800 shadow-xs">
                  <CheckCircle2 className="w-4 h-4 text-[#006699]" />
                  <span>Diagnostic reports</span>
                </div>
              </div>
            </div>

            {/* Blue Duration & Control Box */}
            <div className="bg-sky-50/60 border border-sky-100 rounded-xl p-5 space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <Clock className="w-4 h-4 text-[#006699]" />
                <span>Access Duration: <span className="font-normal">30 minutes</span></span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Shield className="w-4 h-4 text-[#006699]" />
                <span>You control whether normal access is granted.</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <Link
                href="/patient/access-requests"
                className="px-5 py-2.5 border border-[#006699] text-[#006699] hover:bg-sky-50 font-semibold text-xs rounded-lg transition-colors"
              >
                Deny Request
              </Link>
              <button
                onClick={handleApprove}
                disabled={approving}
                className="px-6 py-2.5 bg-black hover:bg-slate-800 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-2 shadow"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{approving ? "Approving..." : "Approve Access"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </PatientShell>
  );
}
