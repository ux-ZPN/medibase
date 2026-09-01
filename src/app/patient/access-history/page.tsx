"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PatientShell } from "@/components/layout/patient-shell";
import {
  Eye,
  FileText,
  AlertTriangle,
  Clock,
  Building2,
  Shield,
  Asterisk,
} from "lucide-react";

export default function PatientAccessHistoryPage() {
  const [filter, setFilter] = useState("all");

  return (
    <PatientShell activeNav="history">
      <div className="space-y-6">
        {/* Title */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Who accessed your records?
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            A transparent log of all views and updates to your medical records.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-wrap items-center gap-3 text-xs">
          <span className="font-bold text-slate-500">Filter by:</span>
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-1.5 rounded-full font-semibold transition-colors ${
              filter === "all"
                ? "bg-[#0F172A] text-white"
                : "bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("viewed")}
            className={`px-4 py-1.5 rounded-full font-semibold transition-colors ${
              filter === "viewed"
                ? "bg-[#0F172A] text-white"
                : "bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100"
            }`}
          >
            Viewed
          </button>
          <button
            onClick={() => setFilter("added")}
            className={`px-4 py-1.5 rounded-full font-semibold transition-colors ${
              filter === "added"
                ? "bg-[#0F172A] text-white"
                : "bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100"
            }`}
          >
            Added
          </button>
          <button
            onClick={() => setFilter("emergency")}
            className={`px-4 py-1.5 rounded-full font-semibold transition-colors ${
              filter === "emergency"
                ? "bg-rose-600 text-white"
                : "bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100"
            }`}
          >
            ✳ Emergency
          </button>
        </div>

        {/* Vertical Timeline List */}
        <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-2 sm:before:left-3 before:top-6 before:bottom-6 before:w-0.5 before:bg-slate-200">
          {/* Item 1: Dr. Sharma */}
          {(filter === "all" || filter === "viewed") && (
            <div className="relative">
              <div className="absolute -left-6 sm:-left-8 top-6 w-3 h-3 rounded-full border-2 border-[#006699] bg-white ring-4 ring-[#F8FAFC]" />

              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-sky-50 text-[#006699] flex items-center justify-center shrink-0">
                      <Eye className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-900 text-base">Dr. Sharma</h3>
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-semibold">
                          City Hospital
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      31 Aug 2026, 10:42 AM
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200 text-[10px] font-semibold">
                      Normal
                    </span>
                  </div>
                </div>

                <div className="text-xs text-slate-700 space-y-1">
                  <p><span className="font-semibold text-slate-900">Action:</span> Viewed medical history</p>
                  <p><span className="font-semibold text-slate-900">Purpose:</span> Consultation</p>
                </div>
              </div>
            </div>
          )}

          {/* Item 2: Dr. Patel */}
          {(filter === "all" || filter === "added") && (
            <div className="relative">
              <div className="absolute -left-6 sm:-left-8 top-6 w-3 h-3 rounded-full border-2 border-[#006699] bg-white ring-4 ring-[#F8FAFC]" />

              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-sky-50 text-[#006699] flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-900 text-base">Dr. Patel</h3>
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-semibold">
                          Metro Hospital
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      31 Aug 2026, 11:12 AM
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200 text-[10px] font-semibold">
                      Normal
                    </span>
                  </div>
                </div>

                <div className="text-xs text-slate-700">
                  <p><span className="font-semibold text-slate-900">Action:</span> Added visit</p>
                </div>
              </div>
            </div>
          )}

          {/* Item 3: Emergency Access */}
          {(filter === "all" || filter === "emergency") && (
            <div className="relative">
              <div className="absolute -left-6 sm:-left-8 top-6 w-3.5 h-3.5 rounded-full bg-rose-600 ring-4 ring-[#F8FAFC]" />

              <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-5 shadow-sm space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-rose-200/60 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-rose-900 text-base">Emergency Access</h3>
                        <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-800 text-[10px] font-semibold">
                          Dr. Kumar
                        </span>
                        <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-800 text-[10px] font-semibold">
                          Emergency Dept
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-rose-700/80 flex items-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5" />
                      31 Aug 2026, 2:31 PM
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-600 text-white font-bold text-[10px]">
                      ✳ Emergency
                    </span>
                  </div>
                </div>

                <div className="text-xs text-rose-950 space-y-1">
                  <p><span className="font-semibold">Action:</span> Full Access Granted</p>
                  <p><span className="font-semibold">Reason:</span> Unconscious patient</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </PatientShell>
  );
}
