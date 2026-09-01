"use client";

import React, { use } from "react";
import Link from "next/link";
import { StaffShell } from "@/components/layout/staff-shell";
import {
  AlertTriangle,
  ShieldCheck,
  Calendar,
  FileText,
  Activity,
  ArrowRight,
  Plus,
  Clock,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";

export default function PatientOverviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const patientId = resolvedParams.id || "MB-102394";

  return (
    <StaffShell activeNav="recent-patients">
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Patient Identity Header Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              Rahul Sharma
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              MediBase ID: <span className="font-semibold text-slate-700">{patientId}</span> • Age: 32
            </p>
          </div>

          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
              Authorized Access
            </span>
          </div>
        </div>

        {/* Clinical Snapshot & What's Changed Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Clinical Snapshot (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <h2 className="text-xl font-bold text-slate-900">Clinical Snapshot</h2>

            {/* Allergy Alert */}
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-rose-800 uppercase tracking-wider">
                  Important Alert
                </p>
                <p className="text-sm font-semibold text-rose-900 mt-0.5">
                  Penicillin Allergy
                </p>
              </div>
            </div>

            {/* 4 Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Last Visit */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  LAST VISIT
                </span>
                <p className="text-base font-bold text-slate-900 mt-2">Oct 12, 2023</p>
              </div>

              {/* Active Conditions */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  ACTIVE CONDITIONS
                </span>
                <div className="mt-2 text-sm text-slate-800 font-medium space-y-0.5">
                  <p>Hypertension</p>
                  <p>Seasonal Allergies</p>
                </div>
              </div>

              {/* Current Medications */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  CURRENT MEDICATIONS
                </span>
                <div className="mt-2 text-sm text-slate-800 font-medium space-y-0.5">
                  <p>Lisinopril 10mg</p>
                  <p>Cetirizine 10mg</p>
                </div>
              </div>

              {/* Recent Investigations */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  RECENT INVESTIGATIONS
                </span>
                <div className="mt-2 text-sm text-slate-800 font-medium space-y-1">
                  <div className="flex items-center justify-between">
                    <span>Lipid Profile</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-sky-50 text-sky-700 border border-sky-200">
                      Normal
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>HbA1c</span>
                    <span className="font-bold text-slate-900">6.2%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right What's Changed Preview (4 cols) */}
          <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900">What&apos;s Changed?</h2>
                <Link
                  href={`/staff/patient/${patientId}/whats-changed`}
                  className="text-xs font-semibold text-[#006699] hover:underline flex items-center"
                >
                  Details <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Updates since previous encounter.
              </p>
            </div>

            <div className="space-y-3">
              {/* Diagnosis Item */}
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-slate-500 uppercase text-[10px]">DIAGNOSIS</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-sky-500 text-white">
                    NEW
                  </span>
                </div>
                <p className="text-sm font-bold text-slate-900">Type 2 Diabetes</p>
              </div>

              {/* Medication Item */}
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-slate-500 uppercase text-[10px]">MEDICATION</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-sky-500 text-white">
                    NEW
                  </span>
                </div>
                <p className="text-sm font-bold text-slate-900">Metformin</p>
              </div>

              {/* Investigation Item */}
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-slate-500 uppercase text-[10px]">INVESTIGATION</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-sky-100 text-sky-800">
                    UPDATED
                  </span>
                </div>
                <p className="text-sm font-bold text-slate-900">Blood glucose</p>
              </div>
            </div>
          </div>
        </div>

        {/* Medical Timeline Table */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-slate-900">Medical Timeline</h2>
            <div className="flex items-center gap-3">
              <Link
                href={`/staff/patient/${patientId}/timeline`}
                className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold text-xs rounded-lg transition-colors"
              >
                View Full Timeline
              </Link>
              <Link
                href={`/staff/patient/${patientId}/new-visit`}
                className="px-4 py-2 bg-black hover:bg-slate-800 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Visit</span>
              </Link>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0F172A] text-white uppercase text-[11px] tracking-wider">
                  <tr>
                    <th className="py-3 px-5 font-semibold">Date</th>
                    <th className="py-3 px-5 font-semibold">Encounter Type</th>
                    <th className="py-3 px-5 font-semibold">Primary Provider</th>
                    <th className="py-3 px-5 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-5 font-medium text-slate-900">Oct 12, 2023</td>
                    <td className="py-3.5 px-5">Routine Checkup</td>
                    <td className="py-3.5 px-5 text-slate-600">Dr. A. Smith</td>
                    <td className="py-3.5 px-5 text-right">
                      <Link
                        href={`/staff/patient/${patientId}/timeline`}
                        className="text-[#006699] font-semibold hover:underline"
                      >
                        Details
                      </Link>
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-5 font-medium text-slate-900">Aug 05, 2023</td>
                    <td className="py-3.5 px-5">Lab Results Review</td>
                    <td className="py-3.5 px-5 text-slate-600">Dr. A. Smith</td>
                    <td className="py-3.5 px-5 text-right">
                      <Link
                        href={`/staff/patient/${patientId}/timeline`}
                        className="text-[#006699] font-semibold hover:underline"
                      >
                        Details
                      </Link>
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-5 font-medium text-slate-900">Mar 22, 2023</td>
                    <td className="py-3.5 px-5">Urgent Care - Allergic Reaction</td>
                    <td className="py-3.5 px-5 text-slate-600">Dr. J. Doe</td>
                    <td className="py-3.5 px-5 text-right">
                      <Link
                        href={`/staff/patient/${patientId}/timeline`}
                        className="text-[#006699] font-semibold hover:underline"
                      >
                        Details
                      </Link>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Emergency Override Banner */}
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1 max-w-2xl">
            <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
              <ShieldAlert className="w-5 h-5" />
              <span>Emergency Override</span>
            </div>
            <p className="text-xs text-rose-800 leading-relaxed">
              Only for life-threatening situations where immediate data access is critical. Actions taken under override are strictly audited.
            </p>
          </div>

          <Link
            href={`/staff/emergency`}
            className="px-6 py-2.5 bg-[#DC2626] hover:bg-rose-700 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow transition-colors text-center shrink-0"
          >
            Emergency Access
          </Link>
        </div>
      </div>
    </StaffShell>
  );
}
