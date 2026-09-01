"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PatientShell } from "@/components/layout/patient-shell";
import {
  AlertTriangle,
  KeyRound,
  Shield,
  FileText,
  Clock,
  Download,
  Check,
} from "lucide-react";

export default function PatientNotificationsPage() {
  const [filter, setFilter] = useState("all");

  const filterOptions = [
    { label: "All", key: "all" },
    { label: "Access Requests", key: "requests" },
    { label: "Medical Updates", key: "updates" },
    { label: "Security", key: "security" },
  ];

  return (
    <PatientShell activeNav="notifications">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Notifications
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your alerts, access requests, and medical updates.
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
                  ? "bg-[#0F172A] text-white"
                  : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {/* 1. Emergency Alert */}
          {(filter === "all" || filter === "security") && (
            <div className="bg-rose-50/70 border-l-4 border-l-rose-500 border border-rose-200 rounded-xl p-5 shadow-sm space-y-3">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded bg-rose-200/70 text-rose-800 font-bold text-[10px] uppercase">
                      EMERGENCY ALERT
                    </span>
                    <span className="text-xs text-rose-700/80">45 minutes ago</span>
                  </div>

                  <h3 className="text-base font-bold text-rose-950 mt-1">
                    Emergency access to your record was used by Dr. Kumar.
                  </h3>
                  <p className="text-xs text-rose-800 mt-0.5 leading-relaxed">
                    This action was logged automatically due to override protocols. Please review this access event.
                  </p>

                  <div className="pt-3">
                    <Link
                      href="/patient/access-history"
                      className="inline-flex px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white font-semibold text-xs rounded-lg transition-colors shadow-sm"
                    >
                      Review Event
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. Access Request */}
          {(filter === "all" || filter === "requests") && (
            <div className="bg-white border-l-4 border-l-[#006699] border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-sky-50 text-[#006699] flex items-center justify-center shrink-0 mt-0.5">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded bg-sky-50 text-sky-700 font-bold text-[10px] uppercase flex items-center gap-1">
                      ACCESS REQUEST <span className="w-1.5 h-1.5 rounded-full bg-[#006699]"></span>
                    </span>
                    <span className="text-xs text-slate-400">1 hour ago</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mt-1">
                    Dr. Sharma wants access to your medical history.
                  </h3>

                  <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 my-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">From</span>
                      <span className="font-semibold text-slate-800">Dr. Sharma (City Hospital)</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Purpose</span>
                      <span className="font-semibold text-slate-800">Consultation</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Link
                      href="/patient/access-requests/REQ-101"
                      className="px-4 py-2 bg-black hover:bg-slate-800 text-white font-semibold text-xs rounded-lg transition-colors shadow"
                    >
                      Review Request
                    </Link>
                    <button className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-lg transition-colors">
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. Security Update */}
          {(filter === "all" || filter === "security") && (
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Shield className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-bold text-[10px] uppercase">
                      SECURITY UPDATE
                    </span>
                    <span className="text-xs text-slate-400">2 hours ago</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mt-1">
                    Your medical record was accessed by Dr. Patel at Metro Hospital.
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Viewed</span>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 4. Reports */}
          {(filter === "all" || filter === "updates") && (
            <div className="bg-white border-l-4 border-l-slate-900 border border-slate-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-sky-50 text-[#006699] flex items-center justify-center shrink-0 mt-0.5">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded bg-sky-50 text-sky-700 font-bold text-[10px] uppercase flex items-center gap-1">
                      REPORTS <span className="w-1.5 h-1.5 rounded-full bg-[#006699]"></span>
                    </span>
                    <span className="text-xs text-slate-400">Today, 9:15 AM</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mt-1">
                    A new lab report has been uploaded by St. Jude Medical Center.
                  </h3>

                  <div className="pt-3">
                    <Link
                      href="/patient/timeline"
                      className="inline-flex items-center gap-1.5 px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-lg transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>View Report</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </PatientShell>
  );
}
