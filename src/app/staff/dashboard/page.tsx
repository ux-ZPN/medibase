"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { StaffShell } from "@/components/layout/staff-shell";
import {
  Users,
  FileText,
  Hourglass,
  AlertCircle,
  QrCode,
  Search,
  ArrowRight,
  MoreVertical,
  Plus,
} from "lucide-react";
import { getCurrentUserProfile, UserProfile } from "@/lib/supabase/auth-helpers";

export default function StaffDashboardPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        const p = await getCurrentUserProfile();
        setProfile(p);
      } catch (err) {
        console.error("Failed to load staff profile:", err);
      }
    }
    loadProfile();
  }, []);

  const staffName = profile?.full_name || "Dr. Sharma";
  const formattedStaffTitle = staffName.startsWith("Dr.") ? staffName : `Dr. ${staffName}`;

  return (
    <StaffShell activeNav="dashboard">
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Top Greeting & Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Good morning, {formattedStaffTitle}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Here is your clinical overview for today at {profile?.staff_data?.hospital_name || "City General Hospital"}.
            </p>
          </div>
          <Link
            href="/staff/find-patient"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#006699] hover:bg-[#005580] text-white text-sm font-semibold rounded-lg shadow-sm transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>New Consultation</span>
          </Link>
        </div>

        {/* 4 Stat Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Patients Accessed */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Patients Accessed
              </span>
              <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-slate-900">12</span>
              <span className="text-xs font-semibold text-emerald-600">↑2</span>
            </div>
          </div>

          {/* Visits Recorded */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Visits Recorded
              </span>
              <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-slate-900">8</span>
              <span className="text-xs font-medium text-slate-500">Today</span>
            </div>
          </div>

          {/* Pending Requests */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Pending Requests
              </span>
              <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
                <Hourglass className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-slate-900">3</span>
              <span className="text-xs font-medium text-slate-500">Needs review</span>
            </div>
          </div>

          {/* Emergency Access */}
          <div className="bg-red-50/50 border border-red-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold text-red-700 uppercase tracking-wider">
                Emergency Access
              </span>
              <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                <AlertCircle className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-red-700">1</span>
              <span className="text-xs font-semibold text-red-600">Action required</span>
            </div>
          </div>
        </div>

        {/* Action Banners Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Dark QR Scanner Banner */}
          <div className="lg:col-span-7 bg-[#111827] rounded-xl p-7 text-white relative overflow-hidden flex flex-col justify-between min-h-[220px]">
            {/* Background decoration circle */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4 w-64 h-64 rounded-full bg-slate-800/40 pointer-events-none" />

            <div className="relative z-10">
              <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-sky-400 mb-4">
                <QrCode className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-white mb-1.5">Scan Patient QR</h2>
              <p className="text-xs text-slate-300 max-w-sm leading-relaxed mb-6">
                Instantly access patient medical records securely by scanning their unique MediBase QR code.
              </p>
            </div>

            <div className="relative z-10">
              <Link
                href="/staff/scan-qr"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#006699] hover:bg-[#005580] text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
              >
                <QrCode className="w-4 h-4" />
                <span>Open Scanner</span>
              </Link>
            </div>
          </div>

          {/* Right Action Cards */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {/* Search Patient */}
            <Link
              href="/staff/find-patient"
              className="bg-white border border-slate-200 rounded-xl p-5 flex items-center gap-4 hover:border-slate-300 hover:shadow-sm transition-all"
            >
              <div className="w-10 h-10 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                <Search className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Search Patient</h3>
                <p className="text-xs text-slate-500">Manual ID or Name entry</p>
              </div>
            </Link>

            {/* Add Visit Note */}
            <Link
              href="/staff/patient/MB-102394/new-visit"
              className="bg-white border border-slate-200 rounded-xl p-5 flex items-center gap-4 hover:border-slate-300 hover:shadow-sm transition-all"
            >
              <div className="w-10 h-10 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Add Visit Note</h3>
                <p className="text-xs text-slate-500">Quick entry for recent patient</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Activity Table */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-bold text-slate-900 text-base">Recent Activity</h2>
            <Link
              href="/staff/audit-log"
              className="text-xs font-semibold text-[#006699] hover:underline flex items-center gap-1"
            >
              <span>View Full Log</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#111827] text-white uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="py-3 px-5 font-semibold">Patient Name</th>
                  <th className="py-3 px-5 font-semibold">Action</th>
                  <th className="py-3 px-5 font-semibold">Time</th>
                  <th className="py-3 px-5 font-semibold">Status</th>
                  <th className="py-3 px-5 font-semibold text-right">Options</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-5 flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-sky-100 text-sky-800 font-bold flex items-center justify-center text-[10px]">
                      RS
                    </div>
                    <Link
                      href="/staff/patient/MB-102394"
                      className="font-semibold text-slate-900 hover:text-[#006699]"
                    >
                      Rahul Sharma
                    </Link>
                  </td>
                  <td className="py-3.5 px-5">Access Granted</td>
                  <td className="py-3.5 px-5 text-slate-500">10:42 AM</td>
                  <td className="py-3.5 px-5">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      Success
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <button className="text-slate-400 hover:text-slate-600">
                      <MoreVertical className="w-4 h-4 inline" />
                    </button>
                  </td>
                </tr>

                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-5 flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-[10px]">
                      AD
                    </div>
                    <span className="font-semibold text-slate-900">Anita Desai</span>
                  </td>
                  <td className="py-3.5 px-5">Visit Added</td>
                  <td className="py-3.5 px-5 text-slate-500">09:15 AM</td>
                  <td className="py-3.5 px-5">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      Success
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <button className="text-slate-400 hover:text-slate-600">
                      <MoreVertical className="w-4 h-4 inline" />
                    </button>
                  </td>
                </tr>

                <tr className="hover:bg-slate-50 transition-colors bg-red-50/20">
                  <td className="py-3.5 px-5 flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-red-100 text-red-700 font-bold flex items-center justify-center text-[10px]">
                      <AlertCircle className="w-3.5 h-3.5" />
                    </div>
                    <Link
                      href="/staff/emergency/MB-102394"
                      className="font-semibold text-slate-900 hover:text-red-700"
                    >
                      Unknown Patient
                    </Link>
                  </td>
                  <td className="py-3.5 px-5">Emergency Access</td>
                  <td className="py-3.5 px-5 text-slate-500">08:30 AM</td>
                  <td className="py-3.5 px-5">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-red-100 text-red-800 border border-red-200">
                      ▲ Emergency
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <button className="text-slate-400 hover:text-slate-600">
                      <MoreVertical className="w-4 h-4 inline" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="p-3 border-t border-slate-100 text-center text-slate-400 text-xs">
            Showing last 3 activities
          </div>
        </div>
      </div>
    </StaffShell>
  );
}
