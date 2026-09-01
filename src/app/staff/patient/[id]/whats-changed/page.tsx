"use client";

import React, { use } from "react";
import Link from "next/link";
import { StaffShell } from "@/components/layout/staff-shell";
import {
  ArrowRight,
  Pill,
  Ban,
  FlaskConical,
  Activity,
  TrendingUp,
  RefreshCw,
  Plus,
} from "lucide-react";

export default function WhatsChangedPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const patientId = resolvedParams.id || "MB-102394";

  return (
    <StaffShell activeNav="recent-patients">
      <div className="space-y-6 max-w-5xl mx-auto">
        {/* Header & Visit Range */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              What&apos;s Changed?
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Patient Record Delta Analysis
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-3 flex items-center gap-4 text-xs font-semibold text-slate-700 shadow-sm shrink-0">
            <div>
              <span className="text-[10px] uppercase text-slate-400 font-bold block">
                PREVIOUS VISIT
              </span>
              <span>Oct 12, 2023</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400" />
            <div>
              <span className="text-[10px] uppercase text-slate-400 font-bold block">
                CURRENT VISIT
              </span>
              <span className="text-slate-900 font-bold">Oct 24, 2023</span>
            </div>
          </div>
        </div>

        {/* Top Dark Banner Alert */}
        <div className="bg-[#111827] rounded-xl p-6 text-white shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white">Clinical Diagnosis Delta</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-sky-500 text-white text-[11px] font-bold">
              1 Alert
            </span>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg font-bold text-white">Type 2 Diabetes</span>
                <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-400/30 text-[10px] font-bold">
                  + NEW
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-6 text-xs text-slate-300">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">KEY DETAIL</span>
                  <span className="font-semibold text-white">HbA1c: 7.2%</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">SOURCE</span>
                  <span>⊞ City General Hospital</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column Medication Deltas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* New Medications */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <Pill className="w-4 h-4 text-[#006699]" />
              <span>New Medications</span>
            </div>

            <div className="bg-sky-50/70 border-l-4 border-l-[#006699] border border-sky-100 rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-sm">Metformin 500mg</h3>
                <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-800 text-[10px] font-bold">
                  + NEW
                </span>
              </div>
              <p className="text-xs text-slate-600 bg-white/60 p-2 rounded border border-dashed border-sky-200">
                Sig: 1 tablet twice daily
              </p>
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <span>👤 Dr. Sharma</span>
                <span>Oct 24, 2023</span>
              </div>
            </div>
          </div>

          {/* Discontinued Medications */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <Ban className="w-4 h-4 text-rose-600" />
              <span>Discontinued</span>
            </div>

            <div className="bg-rose-50/60 border-l-4 border-l-rose-500 border border-rose-100 rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-sm">Lisinopril 10mg</h3>
                <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-700 text-[10px] font-bold">
                  – REMOVED
                </span>
              </div>
              <p className="text-xs text-slate-600 italic">
                Reason: Discontinued due to improved blood pressure
              </p>
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <span>🔄 System Update</span>
                <span>Oct 24, 2023</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column Investigations & Glucose Updates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Investigations */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <FlaskConical className="w-4 h-4 text-slate-700" />
              <span>Investigations</span>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-base">Lipid Profile</h3>
                <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-800 text-[10px] font-bold">
                  NEW
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 pt-2">
                <RefreshCw className="w-3.5 h-3.5 text-slate-400 animate-spin" />
                <span>Results pending</span>
              </div>
            </div>
          </div>

          {/* Clinical Updates (Glucose Delta) */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <Activity className="w-4 h-4 text-slate-700" />
                <span>Clinical Updates</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold">
                ⟳ UPDATED
              </span>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-100 rounded-lg space-y-3">
              <h3 className="font-bold text-slate-900 text-base">Blood Glucose</h3>
              <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-slate-200">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    PREVIOUS (OCT 12)
                  </span>
                  <p className="text-2xl font-bold text-slate-900">
                    110 <span className="text-xs font-medium text-slate-500">mg/dL</span>
                  </p>
                </div>

                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                  <ArrowRight className="w-4 h-4" />
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    CURRENT (OCT 24)
                  </span>
                  <p className="text-2xl font-bold text-rose-600">
                    145 <span className="text-xs font-medium text-slate-500">mg/dL</span>
                  </p>
                  <p className="text-[10px] font-semibold text-rose-600 flex items-center justify-end gap-1">
                    <TrendingUp className="w-3 h-3" />
                    Increased
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="flex justify-end pt-4">
          <Link
            href={`/staff/patient/${patientId}/timeline`}
            className="px-6 py-3 bg-black hover:bg-slate-800 text-white font-medium text-xs rounded-lg transition-colors flex items-center gap-2"
          >
            <span>View Full Timeline</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Disclaimer */}
        <div className="text-center text-[11px] text-slate-400 pt-6 border-t border-slate-200">
          Generated by MediCore Intelligence Engine © 2023 City General Hospital. For internal clinical use only. Do not distribute.
        </div>
      </div>
    </StaffShell>
  );
}
