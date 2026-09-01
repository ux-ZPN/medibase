"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { PatientShell } from "@/components/layout/patient-shell";
import { Clock, CheckCircle2, Info, Shield, RefreshCw } from "lucide-react";

interface AccessRequestDisplayItem {
  id: string;
  doctor_name: string;
  doctor_role: string;
  hospital_name: string;
  department: string;
  purpose: string;
  requested_scope: string[];
  status: string;
  requested_at: string;
  expires_at: string;
  is_active: boolean;
}

export default function PatientAccessRequestsPage() {
  const [requests, setRequests] = useState<AccessRequestDisplayItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [denied, setDenied] = useState<string[]>([]);

  useEffect(() => {
    async function loadRequests() {
      setLoading(true);
      try {
        const res = await fetch("/api/patient/access-requests");
        const data = await res.json();
        if (data.success && Array.isArray(data.requests)) {
          setRequests(data.requests);
        }
      } catch (err) {
        console.error("Failed to fetch patient access requests:", err);
      } finally {
        setLoading(false);
      }
    }
    loadRequests();
  }, []);

  return (
    <PatientShell activeNav="requests">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Access Requests
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Review requests from authorized healthcare providers before granting access to your medical history.
            </p>
          </div>

          <button
            onClick={() => {
              setLoading(true);
              fetch("/api/patient/access-requests")
                .then((r) => r.json())
                .then((d) => {
                  if (d.requests) setRequests(d.requests);
                })
                .finally(() => setLoading(false));
            }}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title="Refresh requests"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>

        {/* Requests List */}
        <div className="space-y-5">
          {loading && (
            <div className="p-8 text-center bg-white border border-slate-200 rounded-xl">
              <RefreshCw className="w-6 h-6 animate-spin text-[#006699] mx-auto mb-2" />
              <p className="text-xs text-slate-500">Checking for provider access requests...</p>
            </div>
          )}

          {!loading && requests.length === 0 && (
            <div className="p-10 text-center bg-white border border-slate-200 rounded-xl space-y-3">
              <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 mx-auto">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">No Access Requests</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                  You currently have no pending medical record access requests. Requests from clinical providers will appear here.
                </p>
              </div>
            </div>
          )}

          {!loading &&
            requests
              .filter((req) => !denied.includes(req.id))
              .map((req) => {
                const isPending = req.status === "pending";
                const isApproved = req.status === "approved";
                const isExpired = req.status === "expired" || req.status === "rejected";

                return (
                  <div
                    key={req.id}
                    className={`bg-white border rounded-xl p-6 shadow-sm space-y-4 ${
                      isPending
                        ? "border-l-4 border-l-[#006699] border-slate-200"
                        : isApproved
                        ? "border-emerald-200"
                        : "border-slate-200 opacity-75"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            ACCESS REQUEST
                          </span>
                          {isPending && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-sky-50 text-[#006699] border border-sky-200 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              Pending Patient Authorization
                            </span>
                          )}
                          {isApproved && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              Active Access
                            </span>
                          )}
                          {isExpired && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600">
                              🕒 Expired
                            </span>
                          )}
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">{req.doctor_name}</h3>
                        <p className="text-xs text-slate-500">
                          {req.hospital_name} • {req.department}
                        </p>
                      </div>

                      {isPending && (
                        <div className="flex items-center gap-3 shrink-0">
                          <Link
                            href={`/patient/access-requests/${req.id}`}
                            className="px-5 py-2 bg-[#0F172A] hover:bg-slate-800 text-white font-semibold text-xs rounded-lg transition-colors shadow"
                          >
                            Review Request
                          </Link>
                          <button
                            type="button"
                            onClick={() => setDenied([...denied, req.id])}
                            className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-lg transition-colors cursor-pointer"
                          >
                            Deny
                          </button>
                        </div>
                      )}

                      {isApproved && (
                        <div className="text-xs text-slate-500">
                          <span className="block text-[10px] font-semibold text-slate-400 uppercase">
                            Active Scope
                          </span>
                          <span className="font-bold text-slate-800">Authorized Provider</span>
                        </div>
                      )}
                    </div>

                    {/* Details Box */}
                    <div className="bg-sky-50/50 border border-sky-100 rounded-xl p-4 space-y-3 text-xs">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                            Purpose
                          </span>
                          <p className="text-slate-800 font-medium mt-0.5">{req.purpose}</p>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                            Requested Duration
                          </span>
                          <p className="text-slate-800 font-medium mt-0.5 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            15 minutes authorization window
                          </p>
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                          Requested Information Scope
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {req.requested_scope.map((scope, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-1 rounded bg-white border border-slate-200 text-slate-800 font-medium text-[11px]"
                            >
                              {scope}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
        </div>

        {/* Info callout */}
        <div className="bg-sky-50/60 border border-sky-100 rounded-xl p-4 flex items-center gap-3 text-xs text-slate-600">
          <Info className="w-5 h-5 text-[#006699] shrink-0" />
          <p>
            Providers can only view your medical history after you explicitly authorize their request. Emergency break-glass access is recorded with automatic notification.
          </p>
        </div>
      </div>
    </PatientShell>
  );
}
