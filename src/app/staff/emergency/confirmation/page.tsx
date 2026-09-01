"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { StaffShell } from "@/components/layout/staff-shell";
import {
  Check,
  User,
  Building2,
  Clock,
  Eye,
  Asterisk,
  ArrowRight,
} from "lucide-react";

function EmergencyConfirmationContent() {
  const searchParams = useSearchParams();
  const patientId = searchParams.get("patient") || "MB-100003";
  const auditId = searchParams.get("auditId") || "AUD-839291";
  const reason = searchParams.get("reason") || "Unconscious patient; immediate emergency review required.";

  const startTimeFormatted = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] py-6">
      <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden text-center">
        {/* Top Green Highlight Bar */}
        <div className="h-1.5 bg-emerald-500 w-full" />

        <div className="p-8 sm:p-10 space-y-6">
          {/* Green Check Icon */}
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
            <Check className="w-6 h-6 stroke-[2.5]" />
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-1">
              Emergency Access Recorded
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
              Patient record unlocked. This event has been immutably recorded for accountability and review.
            </p>
          </div>

          {/* Audit Details Card */}
          <div className="bg-sky-50/40 border border-sky-100 rounded-xl p-6 text-left space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  PATIENT ID
                </span>
                <p className="font-bold text-slate-900 flex items-center gap-1.5 mt-0.5">
                  <User className="w-3.5 h-3.5 text-[#006699]" />
                  {patientId}
                </p>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  PROVIDER
                </span>
                <p className="font-bold text-slate-900 mt-0.5">
                  Dr. Rahul Sharma
                </p>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  FACILITY
                </span>
                <p className="font-bold text-slate-900 flex items-center gap-1.5 mt-0.5">
                  <Building2 className="w-3.5 h-3.5 text-[#006699]" />
                  City General Hospital
                </p>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  AUDIT ID
                </span>
                <span className="inline-block px-2 py-0.5 rounded bg-sky-100 text-sky-800 text-[11px] font-bold font-mono mt-0.5">
                  {auditId}
                </span>
              </div>
            </div>

            <hr className="border-sky-100" />

            <div className="text-xs text-slate-600 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                ACCESS DETAILS
              </span>
              <div className="flex flex-wrap items-center gap-4 text-[11px] pt-1">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  Started: {startTimeFormatted}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Asterisk className="w-3.5 h-3.5 text-rose-500" />
                  Reason: {reason}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-slate-400" />
                  Scope: Time-bounded emergency access (60 min)
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href={`/staff/emergency/${patientId}`}
              className="w-full sm:w-auto px-6 py-2.5 bg-[#006699] hover:bg-[#005580] text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 shadow cursor-pointer"
            >
              <span>Access Emergency Patient Record</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/staff/audit-log"
              className="w-full sm:w-auto px-6 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-lg transition-colors cursor-pointer"
            >
              View Audit Log
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EmergencyConfirmationPage() {
  return (
    <StaffShell activeNav="emergency">
      <Suspense fallback={<div className="p-12 text-center text-xs text-slate-400">Loading confirmation...</div>}>
        <EmergencyConfirmationContent />
      </Suspense>
    </StaffShell>
  );
}
