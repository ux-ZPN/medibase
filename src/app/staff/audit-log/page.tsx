"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { StaffShell } from "@/components/layout/staff-shell";
import {
  Download,
  Printer,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  RefreshCw,
} from "lucide-react";

interface AuditLogRow {
  id: string;
  timestamp: string;
  actor_name: string;
  actor_role: string;
  hospital_name: string;
  action: string;
  action_label: string;
  purpose: string;
  patient_id: string;
  is_emergency: boolean;
  access_type: string;
}

export default function StaffAuditLogPage() {
  const [search, setSearch] = useState("");
  const [staffFilter, setStaffFilter] = useState("All Staff");
  const [actionFilter, setActionFilter] = useState("All Actions");
  const [typeFilter, setTypeFilter] = useState("All Types");

  const [logs, setLogs] = useState<AuditLogRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLogs() {
      setLoading(true);
      try {
        const query = new URLSearchParams();
        if (staffFilter !== "All Staff") query.set("staff", staffFilter);
        if (search.trim()) query.set("patient", search.trim());
        if (actionFilter !== "All Actions") query.set("action", actionFilter);
        if (typeFilter !== "All Types") query.set("type", typeFilter);

        const res = await fetch(`/api/staff/audit-logs?${query.toString()}`);
        const data = await res.json();
        if (data.success && Array.isArray(data.logs)) {
          setLogs(data.logs);
        }
      } catch (err) {
        console.error("Failed to load audit logs:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchLogs();
  }, [search, staffFilter, actionFilter, typeFilter]);

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
            <button
              onClick={() => {
                const csvHeader = "ID,Timestamp,Staff,Patient,Action,Purpose,Access Type\n";
                const csvRows = logs
                  .map(
                    (l) =>
                      `"${l.id}","${l.timestamp}","${l.actor_name}","${l.patient_id}","${l.action_label}","${l.purpose}","${l.access_type}"`
                  )
                  .join("\n");
                const blob = new Blob([csvHeader + csvRows], { type: "text/csv" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `audit-log-${new Date().toISOString().slice(0, 10)}.csv`;
                a.click();
              }}
              className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-black hover:bg-slate-800 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow cursor-pointer"
            >
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
                value="📅 Live Real-Time"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Staff Member
            </label>
            <select
              value={staffFilter}
              onChange={(e) => setStaffFilter(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 font-medium cursor-pointer"
            >
              <option value="All Staff">All Staff</option>
              <option value="Dr. Rahul Sharma">Dr. Rahul Sharma</option>
              <option value="Dr. Anjali Rao">Dr. Anjali Rao</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Patient ID/Name
            </label>
            <input
              type="text"
              placeholder="Search patient..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#006699]"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Action
            </label>
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 font-medium cursor-pointer"
            >
              <option value="All Actions">All Actions</option>
              <option value="view">Viewed history</option>
              <option value="request">Access Requests</option>
              <option value="created">Added record</option>
              <option value="file">File Activity</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Access Type
            </label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 font-medium cursor-pointer"
            >
              <option value="All Types">All Types</option>
              <option value="Normal">Normal</option>
              <option value="Emergency">Emergency</option>
            </select>
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          {loading ? (
            <div className="p-12 text-center text-xs text-slate-500 space-y-2">
              <RefreshCw className="w-6 h-6 animate-spin text-[#006699] mx-auto mb-2" />
              <span>Loading audit logs...</span>
            </div>
          ) : logs.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-500 space-y-1">
              <p className="font-bold text-slate-800 text-sm">No Audit Logs Found</p>
              <p>No audit events match your selected search and filter criteria.</p>
            </div>
          ) : (
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
                  {logs.map((log) => {
                    const isEmergency = log.is_emergency;
                    const isBlocked = log.action.includes("unauthorized") || log.action.includes("denied");

                    return (
                      <tr
                        key={log.id}
                        className={`hover:bg-slate-50 transition-colors ${
                          isEmergency ? "bg-rose-50/30" : ""
                        }`}
                      >
                        <td className="py-3.5 px-5 text-slate-500 whitespace-nowrap">
                          {log.timestamp}
                        </td>
                        <td className="py-3.5 px-5 flex items-center gap-2">
                          <span
                            className={`w-6 h-6 rounded-full font-bold text-[10px] flex items-center justify-center shrink-0 ${
                              isEmergency
                                ? "bg-rose-100 text-rose-800"
                                : "bg-sky-100 text-sky-800"
                            }`}
                          >
                            {log.actor_name.charAt(log.actor_name.startsWith("Dr.") ? 4 : 0)}
                          </span>
                          <span className="font-semibold text-slate-900 whitespace-nowrap">
                            {log.actor_name}
                          </span>
                        </td>
                        <td className="py-3.5 px-5 font-mono text-[#006699] font-semibold">
                          {log.patient_id}
                        </td>
                        <td
                          className={`py-3.5 px-5 font-medium ${
                            isEmergency ? "font-semibold text-rose-700" : ""
                          }`}
                        >
                          {log.action_label}
                        </td>
                        <td className="py-3.5 px-5 text-slate-600 max-w-[180px] truncate">
                          {log.purpose}
                        </td>
                        <td className="py-3.5 px-5">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                              isEmergency
                                ? "bg-rose-100 text-rose-800 border-rose-200"
                                : "bg-sky-50 text-sky-700 border-sky-200"
                            }`}
                          >
                            {isEmergency ? "▲ Emergency" : "Normal"}
                          </span>
                        </td>
                        <td className="py-3.5 px-5">
                          {isBlocked ? (
                            <span className="inline-flex items-center gap-1 text-rose-700 font-semibold">
                              <XCircle className="w-3.5 h-3.5" />
                              Blocked
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Success
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-5 text-right whitespace-nowrap">
                          <Link
                            href={`/staff/audit-log/${log.id}`}
                            className="text-[#006699] font-semibold hover:underline"
                          >
                            View Details
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Footer */}
          <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-slate-500">
            <span>Showing 1 to {logs.length} of {logs.length} entries</span>
            <div className="flex items-center gap-1">
              <button className="p-1 rounded border border-slate-200 hover:bg-slate-50 text-slate-500 cursor-pointer">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="px-2.5 py-1 rounded bg-[#006699] text-white font-bold">
                1
              </button>
              <button className="p-1 rounded border border-slate-200 hover:bg-slate-50 text-slate-500 cursor-pointer">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </StaffShell>
  );
}
