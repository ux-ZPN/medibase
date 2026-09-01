"use client";

import React, { useState, useEffect } from "react";
import { PatientShell } from "@/components/layout/patient-shell";
import {
  Eye,
  FileText,
  AlertTriangle,
  Clock,
  RefreshCw,
  ShieldCheck,
  XCircle,
} from "lucide-react";

interface AccessHistoryEvent {
  id: string;
  timestamp: string;
  actor_name: string;
  actor_role: string;
  hospital_name: string;
  action: string;
  action_label: string;
  purpose: string;
  is_emergency: boolean;
}

export default function PatientAccessHistoryPage() {
  const [filter, setFilter] = useState("all");
  const [events, setEvents] = useState<AccessHistoryEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHistory() {
      setLoading(true);
      try {
        const res = await fetch("/api/patient/access-history");
        const data = await res.json();
        if (data.success && Array.isArray(data.events)) {
          setEvents(data.events);
        }
      } catch (err) {
        console.error("Failed to fetch access history:", err);
      } finally {
        setLoading(false);
      }
    }
    loadHistory();
  }, []);

  const filteredEvents = events.filter((ev) => {
    if (filter === "all") return true;
    if (filter === "viewed") return ev.action.toLowerCase().includes("view") || ev.action_label.toLowerCase().includes("view");
    if (filter === "added") return ev.action.toLowerCase().includes("add") || ev.action.toLowerCase().includes("created") || ev.action.toLowerCase().includes("approved");
    if (filter === "emergency") return ev.is_emergency;
    return true;
  });

  return (
    <PatientShell activeNav="history">
      <div className="space-y-6">
        {/* Title */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Who accessed your records?
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              A transparent, immutable log of all clinical views, authorizations, and updates to your medical history.
            </p>
          </div>

          <button
            onClick={() => {
              setLoading(true);
              fetch("/api/patient/access-history")
                .then((r) => r.json())
                .then((d) => {
                  if (d.events) setEvents(d.events);
                })
                .finally(() => setLoading(false));
            }}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title="Refresh access history"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>

        {/* Filter Bar */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-wrap items-center gap-3 text-xs">
          <span className="font-bold text-slate-500">Filter by:</span>
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-1.5 rounded-full font-semibold transition-colors cursor-pointer ${
              filter === "all"
                ? "bg-[#0F172A] text-white"
                : "bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100"
            }`}
          >
            All ({events.length})
          </button>
          <button
            onClick={() => setFilter("viewed")}
            className={`px-4 py-1.5 rounded-full font-semibold transition-colors cursor-pointer ${
              filter === "viewed"
                ? "bg-[#0F172A] text-white"
                : "bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100"
            }`}
          >
            Viewed
          </button>
          <button
            onClick={() => setFilter("added")}
            className={`px-4 py-1.5 rounded-full font-semibold transition-colors cursor-pointer ${
              filter === "added"
                ? "bg-[#0F172A] text-white"
                : "bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100"
            }`}
          >
            Added / Approved
          </button>
          <button
            onClick={() => setFilter("emergency")}
            className={`px-4 py-1.5 rounded-full font-semibold transition-colors cursor-pointer ${
              filter === "emergency"
                ? "bg-rose-600 text-white"
                : "bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100"
            }`}
          >
            ✳ Emergency
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="p-8 text-center bg-white border border-slate-200 rounded-xl">
            <RefreshCw className="w-6 h-6 animate-spin text-[#006699] mx-auto mb-2" />
            <p className="text-xs text-slate-500">Loading audit and access trail...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredEvents.length === 0 && (
          <div className="p-10 text-center bg-white border border-slate-200 rounded-xl space-y-2">
            <p className="text-base font-bold text-slate-900">No Access Events Found</p>
            <p className="text-xs text-slate-500">No records matching the selected filter criteria.</p>
          </div>
        )}

        {/* Vertical Timeline List */}
        {!loading && filteredEvents.length > 0 && (
          <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-2 sm:before:left-3 before:top-6 before:bottom-6 before:w-0.5 before:bg-slate-200">
            {filteredEvents.map((ev) => {
              const isEmergency = ev.is_emergency;
              const isApproval = ev.action.toLowerCase().includes("approved");
              const isDenied = ev.action.toLowerCase().includes("denied");

              return (
                <div key={ev.id} className="relative">
                  {/* Timeline Bullet */}
                  <div
                    className={`absolute -left-6 sm:-left-8 top-6 w-3.5 h-3.5 rounded-full ring-4 ring-[#F8FAFC] ${
                      isEmergency
                        ? "bg-rose-600"
                        : isApproval
                        ? "bg-emerald-600"
                        : isDenied
                        ? "bg-rose-500"
                        : "border-2 border-[#006699] bg-white"
                    }`}
                  />

                  <div
                    className={`border rounded-xl p-5 shadow-sm space-y-3 ${
                      isEmergency
                        ? "bg-rose-50/70 border-rose-200"
                        : "bg-white border-slate-200"
                    }`}
                  >
                    <div
                      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3 ${
                        isEmergency ? "border-rose-200/60" : "border-slate-100"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                            isEmergency
                              ? "bg-rose-100 text-rose-700"
                              : isApproval
                              ? "bg-emerald-50 text-emerald-700"
                              : isDenied
                              ? "bg-rose-50 text-rose-700"
                              : "bg-sky-50 text-[#006699]"
                          }`}
                        >
                          {isEmergency ? (
                            <AlertTriangle className="w-5 h-5" />
                          ) : isApproval ? (
                            <ShieldCheck className="w-5 h-5" />
                          ) : isDenied ? (
                            <XCircle className="w-5 h-5" />
                          ) : ev.action.toLowerCase().includes("view") ? (
                            <Eye className="w-5 h-5" />
                          ) : (
                            <FileText className="w-5 h-5" />
                          )}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <h3
                              className={`font-bold text-base ${
                                isEmergency ? "text-rose-900" : "text-slate-900"
                              }`}
                            >
                              {ev.actor_name}
                            </h3>
                            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-semibold">
                              {ev.hospital_name}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-xs">
                        <span
                          className={`flex items-center gap-1 font-medium ${
                            isEmergency ? "text-rose-700/80" : "text-slate-400"
                          }`}
                        >
                          <Clock className="w-3.5 h-3.5" />
                          {ev.timestamp}
                        </span>

                        {isEmergency ? (
                          <span className="px-2.5 py-0.5 rounded-full bg-rose-600 text-white font-bold text-[10px]">
                            ✳ Emergency
                          </span>
                        ) : isApproval ? (
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold">
                            Approved
                          </span>
                        ) : isDenied ? (
                          <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-semibold">
                            Denied
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200 text-[10px] font-semibold">
                            Normal
                          </span>
                        )}
                      </div>
                    </div>

                    <div
                      className={`text-xs space-y-1 ${
                        isEmergency ? "text-rose-950" : "text-slate-700"
                      }`}
                    >
                      <p>
                        <span className="font-semibold text-slate-900">Action:</span>{" "}
                        {ev.action_label}
                      </p>
                      {ev.purpose && (
                        <p>
                          <span className="font-semibold text-slate-900">Purpose:</span>{" "}
                          {ev.purpose}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </PatientShell>
  );
}
