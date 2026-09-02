"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { StaffShell } from "@/components/layout/staff-shell";
import {
  Clock,
  CheckCircle2,
  Lock,
  ExternalLink,
  Info,
  Stethoscope,
  ChevronRight,
  RefreshCw,
  FileText,
  AlertCircle,
  XCircle,
} from "lucide-react";

interface AccessRequestItem {
  id: string;
  patient_id: string;
  doctor_name: string;
  hospital_name: string;
  department?: string;
  purpose: string;
  requested_scope?: string[];
  status: "pending" | "approved" | "denied" | "expired";
  requested_at: string;
  expires_at: string;
  is_active: boolean;
}

function AccessRequestsContent() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") as "pending" | "approved" | "denied" | "expired") || "pending";

  const [activeTab, setActiveTab] = useState<"pending" | "approved" | "denied" | "expired">(initialTab);
  const [requests, setRequests] = useState<AccessRequestItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRequests() {
      try {
        const res = await fetch("/api/staff/access-requests");
        const data = await res.json();
        if (data.success && Array.isArray(data.requests)) {
          setRequests(data.requests);
          const hasApproved = data.requests.some((r: AccessRequestItem) => r.status === "approved");
          const hasPending = data.requests.some((r: AccessRequestItem) => r.status === "pending");
          if (searchParams.get("tab") === "approved") {
            setActiveTab("approved");
          } else if (hasApproved && !hasPending && initialTab === "pending") {
            setActiveTab("approved");
          }
        }
      } catch (err) {
        console.error("Failed to load staff access requests:", err);
      } finally {
        setLoading(false);
      }
    }
    loadRequests();
  }, [searchParams, initialTab]);

  const pendingCount = requests.filter((r) => r.status === "pending").length;
  const approvedCount = requests.filter((r) => r.status === "approved").length;
  const deniedCount = requests.filter((r) => r.status === "denied").length;
  const expiredCount = requests.filter((r) => r.status === "expired").length;

  const filteredRequests = requests.filter((r) => r.status === activeTab);

  return (
    <StaffShell activeNav="access-requests">
      <div className="space-y-6 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Access Requests
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Manage patient authorization requests, view approvals, and access granted medical records.
            </p>
          </div>

          <Link
            href="/staff/find-patient"
            className="px-4 py-2 bg-[#006699] hover:bg-[#005580] text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <span>+ Request New Patient Access</span>
          </Link>
        </div>

        {/* Tab Filters */}
        <div className="border-b border-slate-200 flex items-center gap-6 text-sm font-semibold">
          <button
            onClick={() => setActiveTab("pending")}
            className={`pb-3 flex items-center gap-2 cursor-pointer ${
              activeTab === "pending"
                ? "text-[#006699] border-b-2 border-[#006699]"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <span>Pending</span>
            {pendingCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-sky-100 text-[#006699] text-xs flex items-center justify-center font-bold">
                {pendingCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("approved")}
            className={`pb-3 flex items-center gap-2 cursor-pointer ${
              activeTab === "approved"
                ? "text-[#006699] border-b-2 border-[#006699]"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <span>Approved</span>
            {approvedCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-xs flex items-center justify-center font-bold">
                {approvedCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("denied")}
            className={`pb-3 flex items-center gap-2 cursor-pointer ${
              activeTab === "denied"
                ? "text-[#006699] border-b-2 border-[#006699]"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <span>Denied</span>
            {deniedCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-800 text-xs flex items-center justify-center font-bold">
                {deniedCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("expired")}
            className={`pb-3 flex items-center gap-2 cursor-pointer ${
              activeTab === "expired"
                ? "text-[#006699] border-b-2 border-[#006699]"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <span>Expired</span>
            {expiredCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 text-xs flex items-center justify-center font-bold">
                {expiredCount}
              </span>
            )}
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="p-12 text-center bg-white border border-slate-200 rounded-xl space-y-2">
            <RefreshCw className="w-6 h-6 animate-spin text-[#006699] mx-auto mb-2" />
            <p className="text-xs text-slate-500 font-medium">Loading clinical access requests...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredRequests.length === 0 && (
          <div className="p-10 text-center bg-white border border-slate-200 rounded-xl space-y-2">
            <p className="text-base font-bold text-slate-900">No {activeTab} access requests found</p>
            <p className="text-xs text-slate-500">
              {activeTab === "approved"
                ? "When patients approve your authorization requests, they will appear here with direct links to view their medical history."
                : `There are currently no access requests in the ${activeTab} state.`}
            </p>
          </div>
        )}

        {/* Live Request Cards */}
        {!loading && filteredRequests.length > 0 && (
          <div className="space-y-4">
            {filteredRequests.map((req) => {
              const isApproved = req.status === "approved";
              const isPending = req.status === "pending";

              return (
                <div
                  key={req.id}
                  className={`bg-white border rounded-xl p-6 shadow-sm space-y-4 transition-all ${
                    isApproved
                      ? "border-l-4 border-l-[#006699] border-slate-200"
                      : "border-slate-200"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-3">
                      <h3 className="text-base font-bold text-slate-900">Patient {req.patient_id}</h3>
                      <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-100 text-slate-600">
                        {req.patient_id}
                      </span>
                    </div>

                    {isApproved ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Active Patient Authorization</span>
                      </span>
                    ) : isPending ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        <span>Awaiting Patient Approval</span>
                      </span>
                    ) : req.status === "denied" ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200">
                        <XCircle className="w-3.5 h-3.5 text-rose-600" />
                        <span>Declined by Patient</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Expired</span>
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        REQUESTING DOCTOR
                      </span>
                      <span className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
                        <Stethoscope className="w-3.5 h-3.5 text-[#006699]" />
                        {req.doctor_name}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        CLINICAL PURPOSE
                      </span>
                      <span className="text-slate-800 mt-0.5 block">{req.purpose}</span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        HOSPITAL / CLINIC
                      </span>
                      <span className="text-slate-800 mt-0.5 block">{req.hospital_name}</span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        STATUS / EXPIRES
                      </span>
                      <span className="text-slate-800 mt-0.5 block font-mono">
                        {new Date(req.expires_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex flex-wrap items-center justify-end gap-2.5 pt-2 border-t border-slate-50">
                    {isApproved ? (
                      <>
                        <Link
                          href={`/staff/patient/${req.patient_id}`}
                          className="px-3.5 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-800 font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5"
                        >
                          <span>Patient Overview</span>
                        </Link>

                        <Link
                          href={`/staff/patient/${req.patient_id}/timeline`}
                          className="px-4 py-1.5 bg-[#006699] hover:bg-[#005580] text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
                        >
                          <span>View Full Medical Timeline</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      </>
                    ) : isPending ? (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400 italic">
                          Medical history locked until patient approves
                        </span>
                        <button disabled className="px-3.5 py-1.5 bg-slate-100 text-slate-400 text-xs font-semibold rounded-lg flex items-center gap-1 cursor-not-allowed">
                          <Lock className="w-3.5 h-3.5" />
                          <span>Locked</span>
                        </button>
                      </div>
                    ) : (
                      <Link
                        href={`/staff/find-patient`}
                        className="text-xs font-semibold text-[#006699] hover:underline flex items-center gap-1"
                      >
                        <span>Re-initiate Request</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Disclaimer Box */}
        <div className="bg-sky-50/60 border border-sky-100 rounded-xl p-4 flex items-center gap-3 text-xs text-slate-600">
          <Info className="w-5 h-5 text-[#006699] shrink-0" />
          <p>
            Emergency trauma access can be initiated anytime through the{" "}
            <Link href="/staff/emergency" className="font-semibold text-[#006699] underline">
              Emergency Access Override workflow
            </Link>
            . All patient record accesses are immutably logged in compliance with national privacy standards.
          </p>
        </div>
      </div>
    </StaffShell>
  );
}

export default function StaffAccessRequestsPage() {
  return (
    <Suspense
      fallback={
        <StaffShell activeNav="access-requests">
          <div className="p-12 text-center bg-white border border-slate-200 rounded-xl space-y-2">
            <RefreshCw className="w-6 h-6 animate-spin text-[#006699] mx-auto mb-2" />
            <p className="text-xs text-slate-500 font-medium">Loading clinical access requests...</p>
          </div>
        </StaffShell>
      }
    >
      <AccessRequestsContent />
    </Suspense>
  );
}

