"use client";

import React, { use } from "react";
import Link from "next/link";
import { StaffShell } from "@/components/layout/staff-shell";
import {
  Stethoscope,
  Microscope,
  FileText,
  AlertTriangle,
  Plus,
  Edit,
  ExternalLink,
  ChevronRight,
} from "lucide-react";

export default function StaffPatientTimelinePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const patientId = resolvedParams.id || "MB-102394";

  return (
    <StaffShell activeNav="recent-patients">
      <div className="space-y-6 max-w-5xl mx-auto">
        {/* Patient Subheader Card */}
        <div className="bg-white border-l-4 border-l-[#006699] border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-800 font-bold text-base flex items-center justify-center shrink-0">
              RS
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-xl font-bold text-slate-900">Rahul Sharma</h1>
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-600">
                  {patientId}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                <span>32 yrs (M)</span>
                <span>•</span>
                <span>🩸 O+</span>
                <span>•</span>
                <span className="text-rose-600 font-semibold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Penicillin Allergy
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button className="px-3.5 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5">
              <Edit className="w-3.5 h-3.5" />
              <span>Edit Info</span>
            </button>
            <Link
              href={`/staff/patient/${patientId}/new-visit`}
              className="px-4 py-2 bg-black hover:bg-slate-800 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Visit</span>
            </Link>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-slate-200 flex items-center gap-8 text-sm font-semibold">
          <Link
            href={`/staff/patient/${patientId}`}
            className="pb-3 text-slate-500 hover:text-slate-900"
          >
            Overview
          </Link>
          <button className="pb-3 text-[#006699] border-b-2 border-[#006699]">
            Timeline
          </button>
          <Link
            href={`/staff/patient/${patientId}/upload-report`}
            className="pb-3 text-slate-500 hover:text-slate-900"
          >
            Reports
          </Link>
          <Link
            href="/staff/audit-log"
            className="pb-3 text-slate-500 hover:text-slate-900"
          >
            Access Activity
          </Link>
        </div>

        {/* Vertical Timeline */}
        <div className="relative pl-12 space-y-8 before:absolute before:left-5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
          {/* Timeline Node 1 */}
          <div className="relative">
            <div className="absolute -left-12 top-0 w-10 h-10 rounded-xl bg-sky-100 text-[#006699] flex items-center justify-center ring-4 ring-[#F8FAFC]">
              <Stethoscope className="w-5 h-5" />
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Outpatient Consultation
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    📅 Oct 24, 2023 • City General Hospital
                  </p>
                </div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                  <span className="w-4 h-4 rounded-full bg-slate-800 text-white flex items-center justify-center text-[9px]">DS</span>
                  <span>Dr. Sharma</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="font-bold text-slate-400 uppercase text-[10px] tracking-wider">
                    CHIEF COMPLAINT
                  </span>
                  <p className="text-slate-800 mt-1 leading-relaxed">
                    Routine check-up and medication review. Reports mild fatigue.
                  </p>
                </div>
                <div>
                  <span className="font-bold text-slate-400 uppercase text-[10px] tracking-wider">
                    DIAGNOSIS
                  </span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    <span className="px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-sky-200 font-semibold">
                      Type 2 Diabetes, controlled
                    </span>
                    <span className="px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-sky-200 font-semibold">
                      Essential Hypertension
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
                <div>
                  <span className="font-bold text-slate-400 uppercase text-[10px] tracking-wider">
                    PRESCRIPTION
                  </span>
                  <div className="space-y-1 mt-1 text-slate-800 font-medium">
                    <p className="flex items-center gap-1.5 text-sky-900">
                      <span className="w-3.5 h-3.5 rounded-sm bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-[9px]">+</span>
                      Metformin 500mg, 1 tablet twice daily
                    </p>
                    <p className="flex items-center gap-1.5 text-sky-900">
                      <span className="w-3.5 h-3.5 rounded-sm bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-[9px]">+</span>
                      Lisinopril 10mg, 1 tablet daily
                    </p>
                  </div>
                </div>

                <div>
                  <span className="font-bold text-slate-400 uppercase text-[10px] tracking-wider">
                    INVESTIGATIONS ORDERED
                  </span>
                  <p className="text-slate-800 mt-1">
                    HbA1c, Fasting Lipid Profile, Renal Function Panel
                  </p>
                </div>
              </div>

              {/* Attached Documents */}
              <div className="bg-sky-50/60 border border-sky-100 rounded-lg p-3">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                  ATTACHED DOCUMENTS
                </span>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:border-slate-300 cursor-pointer">
                  <FileText className="w-3.5 h-3.5 text-rose-500" />
                  <span>Lab_Results_Oct24.pdf</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button className="text-xs font-semibold text-[#006699] hover:underline">
                  View Report
                </button>
                <button className="px-4 py-1.5 border border-[#006699] text-[#006699] hover:bg-sky-50 font-semibold text-xs rounded-lg transition-colors">
                  View Visit Details
                </button>
              </div>
            </div>
          </div>

          {/* Timeline Node 2 */}
          <div className="relative">
            <div className="absolute -left-12 top-0 w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-600 flex items-center justify-center ring-4 ring-[#F8FAFC]">
              <Microscope className="w-5 h-5" />
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">
                  Laboratory Diagnostics
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  📅 Jul 15, 2023 • Central City Labs
                </p>
              </div>

              <div>
                <span className="font-bold text-slate-400 uppercase text-[10px] tracking-wider block mb-2">
                  RESULTS SUMMARY
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-lg text-xs">
                  <div>
                    <span className="text-slate-500 text-[11px]">HbA1c</span>
                    <p className="text-base font-bold text-slate-900 mt-0.5">
                      6.8% <span className="text-rose-600 text-xs">↑</span>
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px]">Fasting Glucose</span>
                    <p className="text-base font-bold text-slate-900 mt-0.5">
                      115 mg/dL
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px]">LDL Chol</span>
                    <p className="text-base font-bold text-slate-900 mt-0.5">
                      98 mg/dL
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-sky-50/60 border border-sky-100 rounded-lg p-3">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:border-slate-300 cursor-pointer">
                  <FileText className="w-3.5 h-3.5 text-rose-500" />
                  <span>Comprehensive_Panel_Jul15.pdf</span>
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button className="px-4 py-1.5 border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold text-xs rounded-lg transition-colors">
                  View Full Results
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StaffShell>
  );
}
