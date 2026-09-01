"use client";

import React, { use } from "react";
import Link from "next/link";
import { StaffShell } from "@/components/layout/staff-shell";
import {
  Check,
  FileText,
  ShieldCheck,
  Info,
  ArrowRight,
} from "lucide-react";

export default function UploadSuccessPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const patientId = resolvedParams.id || "MB-102394";

  return (
    <StaffShell activeNav="recent-patients">
      <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
        <div className="w-full max-w-xl text-center space-y-6">
          {/* Top Check Icon */}
          <div className="w-14 h-14 rounded-2xl bg-sky-100 text-[#006699] flex items-center justify-center mx-auto shadow-sm">
            <Check className="w-7 h-7 stroke-[2.5]" />
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-1">
              Upload Complete
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Patient: Rahul Sharma ({patientId})
            </p>
          </div>

          {/* Uploaded File Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm text-left space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-sky-50 text-[#006699] flex items-center justify-center shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Lab_Results_Oct24.pdf
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Laboratory Diagnostics • Oct 24, 2023, 11:45 AM
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-sky-50 text-sky-700">
                <ShieldCheck className="w-3.5 h-3.5" />
                Securely stored
              </span>
            </div>
          </div>

          {/* Info callout */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center gap-3 text-left text-xs text-slate-600">
            <Info className="w-5 h-5 text-slate-400 shrink-0" />
            <p>
              Medical files are stored separately from structured patient data and are accessible only through authorized workflows.
            </p>
          </div>

          {/* Action CTA */}
          <div className="pt-2">
            <Link
              href={`/staff/patient/${patientId}/timeline`}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-black hover:bg-slate-800 text-white font-medium text-xs rounded-lg transition-colors shadow"
            >
              <span>Continue to Visit</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </StaffShell>
  );
}
