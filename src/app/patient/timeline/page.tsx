"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PatientShell } from "@/components/layout/patient-shell";
import {
  FileText,
  Activity,
  Pill,
  ChevronRight,
  Download,
  Calendar,
} from "lucide-react";

export default function PatientTimelinePage() {
  const [filter, setFilter] = useState("all");

  const filterOptions = [
    { label: "All", key: "all" },
    { label: "Visits", key: "visits" },
    { label: "Diagnoses", key: "diagnoses" },
    { label: "Prescriptions", key: "prescriptions" },
    { label: "Reports", key: "reports" },
  ];

  return (
    <PatientShell activeNav="timeline">
      <div className="space-y-6">
        {/* Title */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Medical Timeline
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Your healthcare journey across participating providers.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {filterOptions.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setFilter(opt.key)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                filter === opt.key
                  ? "bg-[#111827] text-white"
                  : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Timeline Items */}
        <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-2 sm:before:left-3 before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-200">
          {/* Item 1 */}
          <div className="relative">
            <div className="absolute -left-6 sm:-left-8 top-1.5 w-3 h-3 rounded-full bg-[#006699] ring-4 ring-[#F8FAFC]" />

            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-bold text-[#006699] uppercase tracking-wider">
                  28 AUG 2026
                </span>
                <span className="px-2 py-0.5 rounded bg-sky-50 text-sky-700 font-semibold text-[10px]">
                  Visit
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900">City Hospital</h3>
                <p className="text-xs text-slate-500 mt-0.5">Dr. Sharma</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
                <div>
                  <span className="font-bold text-slate-400 uppercase text-[10px] tracking-wider block">
                    COMPLAINT
                  </span>
                  <p className="text-slate-800 font-medium mt-1">Persistent cough</p>
                </div>
                <div>
                  <span className="font-bold text-slate-400 uppercase text-[10px] tracking-wider block">
                    DIAGNOSIS
                  </span>
                  <span className="inline-block px-2.5 py-1 rounded bg-rose-50 text-rose-700 border border-rose-200 font-semibold mt-1">
                    ⚙ Respiratory infection
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
                <div>
                  <span className="font-bold text-slate-400 uppercase text-[10px] tracking-wider block">
                    PRESCRIPTION
                  </span>
                  <div className="space-y-1 mt-1 text-slate-800">
                    <p className="flex items-center gap-1.5 text-[#006699] font-medium">
                      <Pill className="w-3.5 h-3.5" />
                      Amoxicillin 500mg (3x daily)
                    </p>
                    <p className="flex items-center gap-1.5 text-[#006699] font-medium">
                      <Pill className="w-3.5 h-3.5" />
                      Cough Syrup
                    </p>
                  </div>
                </div>

                <div>
                  <span className="font-bold text-slate-400 uppercase text-[10px] tracking-wider block">
                    INVESTIGATIONS
                  </span>
                  <p className="text-slate-800 mt-1">Blood Test, Chest X-Ray</p>
                </div>
              </div>

              <hr className="border-slate-100" />

              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-[#006699]">
                <button className="flex items-center gap-1.5 hover:underline">
                  <FileText className="w-4 h-4" />
                  <span>View Blood Test</span>
                </button>
                <button className="flex items-center gap-1.5 hover:underline">
                  <Calendar className="w-4 h-4" />
                  <span>View Chest X-Ray</span>
                </button>
              </div>
            </div>
          </div>

          {/* Item 2 */}
          <div className="relative">
            <div className="absolute -left-6 sm:-left-8 top-1.5 w-3 h-3 rounded-full bg-slate-400 ring-4 ring-[#F8FAFC]" />

            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-bold text-slate-700 uppercase tracking-wider">
                  20 AUG 2026
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold text-[10px]">
                  Visit
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900">Metro Health Center</h3>
                <p className="text-xs text-slate-500 mt-0.5">Dr. Anjali Rao</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
                <div>
                  <span className="font-bold text-slate-400 uppercase text-[10px] tracking-wider block">
                    COMPLAINT
                  </span>
                  <p className="text-slate-800 font-medium mt-1">Routine follow-up</p>
                </div>
                <div>
                  <span className="font-bold text-slate-400 uppercase text-[10px] tracking-wider block">
                    DIAGNOSIS
                  </span>
                  <span className="inline-block px-2.5 py-1 rounded bg-sky-50 text-sky-700 border border-sky-200 font-semibold mt-1">
                    📈 Stable Hypertension
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
                <div>
                  <span className="font-bold text-slate-400 uppercase text-[10px] tracking-wider block">
                    PRESCRIPTION
                  </span>
                  <p className="text-[#006699] font-medium mt-1 flex items-center gap-1.5">
                    <Pill className="w-3.5 h-3.5" />
                    Lisinopril 10mg
                  </p>
                </div>

                <div>
                  <span className="font-bold text-slate-400 uppercase text-[10px] tracking-wider block">
                    INVESTIGATIONS
                  </span>
                  <p className="text-slate-800 mt-1">BP Monitoring</p>
                </div>
              </div>

              <hr className="border-slate-100" />

              <div className="flex items-center gap-4 text-xs font-semibold text-[#006699]">
                <button className="flex items-center gap-1.5 hover:underline">
                  <Activity className="w-4 h-4" />
                  <span>BP Log</span>
                </button>
              </div>
            </div>
          </div>

          {/* Item 3 */}
          <div className="relative">
            <div className="absolute -left-6 sm:-left-8 top-1.5 w-3 h-3 rounded-full bg-slate-400 ring-4 ring-[#F8FAFC]" />

            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-bold text-slate-700 uppercase tracking-wider">
                  05 JUN 2026
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold text-[10px]">
                  Visit
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900">Apollo Specialty Clinic</h3>
                <p className="text-xs text-slate-500 mt-0.5">Dr. Vikram Mehta</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
                <div>
                  <span className="font-bold text-slate-400 uppercase text-[10px] tracking-wider block">
                    COMPLAINT
                  </span>
                  <p className="text-slate-800 font-medium mt-1">Severe headache</p>
                </div>
                <div>
                  <span className="font-bold text-slate-400 uppercase text-[10px] tracking-wider block">
                    DIAGNOSIS
                  </span>
                  <span className="inline-block px-2.5 py-1 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 font-semibold mt-1">
                    ⚙ Migraine
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
                <div>
                  <span className="font-bold text-slate-400 uppercase text-[10px] tracking-wider block">
                    PRESCRIPTION
                  </span>
                  <p className="text-[#006699] font-medium mt-1 flex items-center gap-1.5">
                    <Pill className="w-3.5 h-3.5" />
                    Sumatriptan
                  </p>
                </div>

                <div>
                  <span className="font-bold text-slate-400 uppercase text-[10px] tracking-wider block">
                    INVESTIGATIONS
                  </span>
                  <p className="text-slate-800 mt-1">MRI (Brain)</p>
                </div>
              </div>

              <hr className="border-slate-100" />

              <div className="flex items-center gap-4 text-xs font-semibold text-[#006699]">
                <button className="flex items-center gap-1.5 hover:underline">
                  <FileText className="w-4 h-4" />
                  <span>MRI Report</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PatientShell>
  );
}
