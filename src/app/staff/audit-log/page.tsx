"use client";

import React, { useState } from "react";
import Link from "next/link";
import { StaffShell } from "@/components/layout/staff-shell";
import {
  Download,
  Printer,
  Calendar,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

export default function StaffAuditLogPage() {
  const [search, setSearch] = useState("");

  return (
    <StaffShell activeNav="audit-logs">
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Header & Export Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Access Audit Log
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Monitor and review clinical record access activity across the facility.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
            <button className="px-4 py-2 bg-black hover:bg-slate-800 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow">
              <Printer className="w-3.5 h-3.5" />
              <span>Print Log</span>
            </button>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 text-xs">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Date Range
            </label>
            <div className="relative">
              <input
                type="text"
                readOnly
                value="📅 Last 24 Hours"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Staff Member
            </label>
            <select className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 font-medium">
              <option>All Staff</option>
              <option>Dr. Sharma</option>
              <option>Dr. Kumar</option>
              <option>Nurse Lee</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Patient ID/Name
            </label>
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#006699]"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Action
            </label>
            <select className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 font-medium">
              <option>All Actions</option>
              <option>Viewed history</option>
              <option>Emergency access</option>
              <option>Added record</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Access Type
            </label>
            <select className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 font-medium">
              <option>All Types</option>
              <option>Normal</option>
              <option>Emergency</option>
            </select>
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#111827] text-white uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-5 font-semibold">Time</th>
                  <th className="py-3.5 px-5 font-semibold">Staff</th>
                  <th className="py-3.5 px-5 font-semibold">Patient</th>
                  <th className="py-3.5 px-5 font-semibold">Action</th>
                  <th className="py-3.5 px-5 font-semibold">Purpose</th>
                  <th className="py-3.5 px-5 font-semibold">Access Type</th>
                  <th className="py-3.5 px-5 font-semibold">Result</th>
                  <th className="py-3.5 px-5 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {/* Row 1 */}
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-5 text-slate-500">Today, 10:42 AM</td>
                  <td className="py-3.5 px-5 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-800 font-bold text-[10px] flex items-center justify-center">
                      S
                    </span>
                    <span className="font-semibold text-slate-900">Dr. Sharma</span>
                  </td>
                  <td className="py-3.5 px-5 font-mono text-[#006699] font-semibold">
                    MB-102394
                  </td>
                  <td className="py-3.5 px-5">Viewed history</td>
                  <td className="py-3.5 px-5 text-slate-600">Consultation</td>
                  <td className="py-3.5 px-5">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-sky-50 text-sky-700 border border-sky-200">
                      Normal
                    </span>
                  </td>
                  <td className="py-3.5 px-5">
                    <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Success
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <Link
                      href="/staff/audit-log/AUD-839291"
                      className="text-[#006699] font-semibold hover:underline"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>

                {/* Row 2 (Emergency) */}
                <tr className="hover:bg-slate-50 transition-colors bg-red-50/20">
                  <td className="py-3.5 px-5 text-slate-500">Today, 14:31 PM</td>
                  <td className="py-3.5 px-5 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-800 font-bold text-[10px] flex items-center justify-center">
                      K
                    </span>
                    <span className="font-semibold text-slate-900">Dr. Kumar</span>
                  </td>
                  <td className="py-3.5 px-5 font-mono text-[#006699] font-semibold">
                    MB-102394
                  </td>
                  <td className="py-3.5 px-5 font-semibold text-rose-700">Emergency access</td>
                  <td className="py-3.5 px-5 text-slate-600">Unconscious patient</td>
                  <td className="py-3.5 px-5">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-100 text-rose-800 border border-rose-200">
                      ▲ Emergency
                    </span>
                  </td>
                  <td className="py-3.5 px-5">
                    <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Success
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <Link
                      href="/staff/audit-log/AUD-839291"
                      className="text-[#006699] font-semibold hover:underline"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>

                {/* Row 3 */}
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-5 text-slate-500">Yesterday, 09:15 AM</td>
                  <td className="py-3.5 px-5 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-800 font-bold text-[10px] flex items-center justify-center">
                      L
                    </span>
                    <span className="font-semibold text-slate-900">Nurse Lee</span>
                  </td>
                  <td className="py-3.5 px-5 font-mono text-[#006699] font-semibold">
                    MB-882103
                  </td>
                  <td className="py-3.5 px-5">Added record</td>
                  <td className="py-3.5 px-5 text-slate-600">Vitals update</td>
                  <td className="py-3.5 px-5">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-sky-50 text-sky-700 border border-sky-200">
                      Normal
                    </span>
                  </td>
                  <td className="py-3.5 px-5">
                    <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Success
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <Link
                      href="/staff/audit-log/AUD-839291"
                      className="text-[#006699] font-semibold hover:underline"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-slate-500">
            <span>Showing 1 to 3 of 128 entries</span>
            <div className="flex items-center gap-1">
              <button className="p-1 rounded border border-slate-200 hover:bg-slate-50 text-slate-500">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="px-2.5 py-1 rounded bg-[#006699] text-white font-bold">
                1
              </button>
              <button className="px-2.5 py-1 rounded border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold">
                2
              </button>
              <button className="px-2.5 py-1 rounded border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold">
                3
              </button>
              <button className="p-1 rounded border border-slate-200 hover:bg-slate-50 text-slate-500">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </StaffShell>
  );
}
