"use client";

import React, { useState } from "react";
import Link from "next/link";
import { StaffShell } from "@/components/layout/staff-shell";
import {
  Clock,
  CheckCircle2,
  Lock,
  ExternalLink,
  Info,
  Stethoscope,
  ChevronRight,
} from "lucide-react";

export default function StaffAccessRequestsPage() {
  const [activeTab, setActiveTab] = useState<"pending" | "approved" | "denied" | "expired">("pending");

  return (
    <StaffShell activeNav="access-requests">
      <div className="space-y-6 max-w-5xl mx-auto">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Access Requests
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage provisional clinical access permissions across departments.
          </p>
        </div>

        {/* Tab Filters */}
        <div className="border-b border-slate-200 flex items-center gap-6 text-sm font-semibold">
          <button
            onClick={() => setActiveTab("pending")}
            className={`pb-3 flex items-center gap-2 ${
              activeTab === "pending"
                ? "text-[#006699] border-b-2 border-[#006699]"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <span>Pending</span>
            <span className="w-5 h-5 rounded-full bg-sky-100 text-[#006699] text-xs flex items-center justify-center font-bold">
              2
            </span>
          </button>
          <button
            onClick={() => setActiveTab("approved")}
            className={`pb-3 ${
              activeTab === "approved"
                ? "text-[#006699] border-b-2 border-[#006699]"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Approved
          </button>
          <button
            onClick={() => setActiveTab("denied")}
            className={`pb-3 ${
              activeTab === "denied"
                ? "text-[#006699] border-b-2 border-[#006699]"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Denied
          </button>
          <button
            onClick={() => setActiveTab("expired")}
            className={`pb-3 ${
              activeTab === "expired"
                ? "text-[#006699] border-b-2 border-[#006699]"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Expired
          </button>
        </div>

        {/* Request Cards */}
        <div className="space-y-4">
          {/* Card 1: Eleanor Vance */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <h3 className="text-base font-bold text-slate-900">Eleanor Vance</h3>
                <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-100 text-slate-600">
                  MRN-8472-X9
                </span>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                <Clock className="w-3.5 h-3.5" />
                Awaiting patient approval
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">PROVIDER</span>
                <span className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
                  <Stethoscope className="w-3.5 h-3.5 text-[#006699]" />
                  Dr. A. Sharma
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">CLINICAL PURPOSE</span>
                <span className="text-slate-800 mt-0.5 block">Specialist Referral</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">REQUESTED SCOPE</span>
                <span className="text-slate-800 mt-0.5 block">Full History, Lab Results</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">DURATION</span>
                <span className="text-slate-800 mt-0.5 block">48 Hours</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button disabled className="text-xs font-semibold text-slate-400 flex items-center gap-1 cursor-not-allowed">
                <span>Open Patient</span>
                <Lock className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 2: Marcus Thorne (Approved) */}
          <div className="bg-white border-l-4 border-l-[#006699] border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <h3 className="text-base font-bold text-slate-900">Marcus Thorne</h3>
                <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-100 text-slate-600">
                  MRN-3910-A4
                </span>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Access active until 3:45 PM
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">PROVIDER</span>
                <span className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
                  <Stethoscope className="w-3.5 h-3.5 text-[#006699]" />
                  Dr. E. Chen
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">CLINICAL PURPOSE</span>
                <span className="text-slate-800 mt-0.5 block">Surgical Consultation</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">REQUESTED SCOPE</span>
                <span className="text-slate-800 mt-0.5 block">Imaging, Medications</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">DURATION</span>
                <span className="text-slate-800 mt-0.5 block">24 Hours</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Link
                href="/staff/patient/MB-102394"
                className="px-5 py-2 bg-black hover:bg-slate-800 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow"
              >
                <span>Open Patient</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 3: Sarah Jenkins */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <h3 className="text-base font-bold text-slate-900">Sarah Jenkins</h3>
                <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-100 text-slate-600">
                  MRN-9122-C1
                </span>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                <Clock className="w-3.5 h-3.5" />
                Awaiting patient approval
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">PROVIDER</span>
                <span className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
                  <Stethoscope className="w-3.5 h-3.5 text-[#006699]" />
                  Dr. L. Hayes
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">CLINICAL PURPOSE</span>
                <span className="text-slate-800 mt-0.5 block">Medication Review</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">REQUESTED SCOPE</span>
                <span className="text-slate-800 mt-0.5 block">Pharmacy Records Only</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">DURATION</span>
                <span className="text-slate-800 mt-0.5 block">12 Hours</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button disabled className="text-xs font-semibold text-slate-400 flex items-center gap-1 cursor-not-allowed">
                <span>Open Patient</span>
                <Lock className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Disclaimer Box */}
        <div className="bg-sky-50/60 border border-sky-100 rounded-xl p-4 flex items-center gap-3 text-xs text-slate-600">
          <Info className="w-5 h-5 text-[#006699] shrink-0" />
          <p>
            Emergency access must be initiated through the separate <Link href="/staff/emergency" className="font-semibold text-[#006699] underline">Emergency Access workflow</Link>. Unauthorized access to patient records outside of explicitly granted permissions is strictly prohibited and logged for audit.
          </p>
        </div>
      </div>
    </StaffShell>
  );
}
