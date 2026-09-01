"use client";

import React, { use } from "react";
import Link from "next/link";
import { StaffShell } from "@/components/layout/staff-shell";
import {
  AlertTriangle,
  Clock,
  Pill,
  Activity,
  Stethoscope,
  FlaskConical,
  ChevronRight,
  Shield,
  History,
} from "lucide-react";

export default function EmergencyCriticalInfoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const patientId = resolvedParams.id || "MB-102394";

  return (
    <StaffShell activeNav="emergency">
      <div className="space-y-6 max-w-5xl mx-auto">
        {/* Top Active Emergency Banner */}
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-5 flex items-start gap-4">
          <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <h2 className="text-base font-bold text-rose-800 uppercase tracking-wider">
              EMERGENCY ACCESS ACTIVE
            </h2>
            <p className="text-xs text-rose-700 mt-0.5 font-medium">
              Accessing restricted medical records. Time remaining: 2 hours.
            </p>
          </div>
        </div>

        {/* Patient & Access Metadata Header Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              Rahul Sharma
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              MediBase ID: <span className="font-semibold text-slate-700">{patientId}</span>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-xs text-slate-500">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Accessing Doctor</span>
              <span className="font-semibold text-slate-800">Dr. Sharma</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Facility</span>
              <span className="font-semibold text-slate-800">City General Hospital</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Access Start</span>
              <span>Oct 24, 2023, 11:45 AM</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-rose-600 block">Expires In</span>
              <span className="font-bold text-rose-600">2 Hours</span>
            </div>
          </div>
        </div>

        {/* Critical Information Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span className="text-rose-600">!</span> Critical Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Allergies (Red Highlight) */}
            <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-5 shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-rose-700 text-xs font-bold uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4" />
                <span>Allergies</span>
              </div>
              <p className="text-base font-bold text-rose-900">
                Penicillin (Severe)
              </p>
            </div>

            {/* Active Conditions */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-sky-700 text-xs font-bold uppercase tracking-wider">
                <Activity className="w-4 h-4" />
                <span>Active Conditions</span>
              </div>
              <div className="text-sm font-semibold text-slate-800 space-y-0.5">
                <p>Type 2 Diabetes</p>
                <p>Essential Hypertension</p>
              </div>
            </div>

            {/* Current Medications */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-[#006699] text-xs font-bold uppercase tracking-wider">
                <Pill className="w-4 h-4" />
                <span>Current Medications</span>
              </div>
              <div className="text-sm font-semibold text-slate-800 space-y-0.5">
                <p>Metformin 500mg</p>
                <p>Amlodipine 5mg</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Recent Diagnosis */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-1">
              <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider">
                <Stethoscope className="w-4 h-4 text-slate-700" />
                <span>Recent Diagnosis</span>
              </div>
              <p className="text-sm font-medium text-slate-800 pt-1">
                Outpatient Consultation - Oct 12, 2023
              </p>
            </div>

            {/* Most Recent Investigation */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-1">
              <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider">
                <FlaskConical className="w-4 h-4 text-slate-700" />
                <span>Most Recent Investigation</span>
              </div>
              <p className="text-sm font-medium text-slate-800 pt-1">
                HbA1c: 7.2%, Blood Glucose: 145 mg/dL
              </p>
            </div>
          </div>
        </div>

        {/* Recent Clinical History List */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900">Recent Clinical History</h2>

          <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-100 shadow-sm overflow-hidden text-xs">
            <Link
              href={`/staff/patient/${patientId}/timeline`}
              className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
            >
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Endocrinology Follow-up</h3>
                <p className="text-slate-500 mt-0.5">Oct 12, 2023 • Dr. R. Patel</p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </Link>

            <Link
              href={`/staff/patient/${patientId}/timeline`}
              className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
            >
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Comprehensive Metabolic Panel</h3>
                <p className="text-slate-500 mt-0.5">Sep 28, 2023 • City Lab Services</p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </Link>

            <Link
              href={`/staff/patient/${patientId}/timeline`}
              className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
            >
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Primary Care Visit</h3>
                <p className="text-slate-500 mt-0.5">Jul 15, 2023 • Dr. S. Lee</p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </Link>
          </div>

          <div className="flex justify-start pt-2">
            <Link
              href={`/staff/patient/${patientId}/timeline`}
              className="px-4 py-2 border border-[#006699] text-[#006699] hover:bg-sky-50 font-semibold text-xs rounded-lg transition-colors flex items-center gap-2"
            >
              <History className="w-4 h-4" />
              <span>View Full Authorized History</span>
            </Link>
          </div>
        </div>

        {/* Audit footer note */}
        <div className="pt-4 border-t border-slate-200 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
          <Shield className="w-3.5 h-3.5 text-slate-400" />
          <span>This emergency access event is being recorded in the secure audit log.</span>
        </div>
      </div>
    </StaffShell>
  );
}
