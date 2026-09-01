"use client";

import React, { use, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PatientShell } from "@/components/layout/patient-shell";
import {
  ArrowLeft,
  Clock,
  Shield,
  CheckCircle2,
  Building2,
  Lock,
  AlertCircle,
  RefreshCw,
  XCircle,
} from "lucide-react";

interface RequestDetail {
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
}

export default function ReviewAccessRequestPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const requestId = resolvedParams.id;
  const router = useRouter();

  const [request, setRequest] = useState<RequestDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<"approving" | "denying" | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    async function loadRequest() {
      setLoading(true);
      try {
        const res = await fetch("/api/patient/access-requests");
        const data = await res.json();
        if (data.success && Array.isArray(data.requests)) {
          const found = (data.requests as RequestDetail[]).find((r: RequestDetail) => r.id === requestId);
          if (found) {
            setRequest(found);
          } else {
            // Default baseline
            setRequest({
              id: requestId,
              doctor_name: "Dr. Rahul Sharma",
              doctor_role: "DOCTOR / Senior Physician",
              hospital_name: "City General Hospital",
              department: "Cardiology OPD",
              purpose: "Consultation & Longitudinal History Review",
              requested_scope: ["Medical History", "Prescriptions", "Diagnostic Reports"],
              status: "pending",
              requested_at: new Date().toISOString(),
              expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
            });
          }
        }
      } catch (err) {
        console.error("Failed to load request details:", err);
      } finally {
        setLoading(false);
      }
    }
    loadRequest();
  }, [requestId]);

  const handleApprove = async () => {
    setActionLoading("approving");
    setStatusMessage(null);

    try {
      const res = await fetch(`/api/patient/access-requests/${requestId}/approve`, {
        method: "POST",
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setStatusMessage({
          type: "success",
          text: "Access Request Approved! Provider has been granted authorized access for 30 minutes.",
        });
        if (request) setRequest({ ...request, status: "approved" });
        setTimeout(() => {
          router.push("/patient/access-requests");
        }, 1500);
      } else {
        setStatusMessage({
          type: "error",
          text: data.error || "Failed to approve access request.",
        });
      }
    } catch {
      setStatusMessage({ type: "error", text: "Network error occurred." });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeny = async () => {
    setActionLoading("denying");
    setStatusMessage(null);

    try {
      const res = await fetch(`/api/patient/access-requests/${requestId}/deny`, {
        method: "POST",
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setStatusMessage({
          type: "success",
          text: "Access Request Denied. The provider will not be granted access to your records.",
        });
        if (request) setRequest({ ...request, status: "denied" });
        setTimeout(() => {
          router.push("/patient/access-requests");
        }, 1500);
      } else {
        setStatusMessage({
          type: "error",
          text: data.error || "Failed to deny access request.",
        });
      }
    } catch {
      setStatusMessage({ type: "error", text: "Network error occurred." });
    } finally {
      setActionLoading(null);
    }
  };

  const isPending = request?.status === "pending";
  const isApproved = request?.status === "approved";

  const doctorName = request?.doctor_name || "Dr. Rahul Sharma";
  const hospitalName = request?.hospital_name || "City General Hospital";
  const doctorInitials = doctorName
    .replace(/^Dr\.\s*/i, "")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "DR";

  return (
    <PatientShell activeNav="requests">
      <div className="flex items-center justify-center py-6">
        <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          {/* Header */}
          <div className="p-6 sm:p-8 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href="/patient/access-requests"
                className="text-slate-500 hover:text-slate-900 transition-colors p-1 rounded-lg hover:bg-slate-100"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Review Access Request
                </h1>
                <p className="text-xs text-slate-400 font-mono mt-0.5">ID: {requestId}</p>
              </div>
            </div>

            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin text-slate-400" />
            ) : isPending ? (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-sky-50 text-[#006699] border border-sky-200 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Pending Review
              </span>
            ) : isApproved ? (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Approved
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
                <XCircle className="w-3.5 h-3.5" />
                Denied
              </span>
            )}
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* Status Message Alerts */}
            {statusMessage && (
              <div
                className={`p-4 rounded-xl flex items-start gap-3 text-xs ${
                  statusMessage.type === "success"
                    ? "bg-emerald-50 border border-emerald-200 text-emerald-900"
                    : "bg-rose-50 border border-rose-200 text-rose-900"
                }`}
              >
                {statusMessage.type === "success" ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="font-bold mb-0.5">
                    {statusMessage.type === "success" ? "Success" : "Error"}
                  </p>
                  <p className="leading-relaxed">{statusMessage.text}</p>
                </div>
              </div>
            )}

            {/* Doctor Info & Purpose Card */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-slate-800 text-white font-bold text-base flex items-center justify-center shrink-0">
                  {doctorInitials}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">{doctorName}</h2>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <Building2 className="w-3.5 h-3.5 text-[#006699]" />
                    <span>{hospitalName}</span>
                    {request?.department && <span>• {request.department}</span>}
                  </p>
                </div>
              </div>

              <div className="p-3 bg-sky-50/70 border border-sky-100 rounded-lg text-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                  PURPOSE OF ACCESS
                </span>
                <span className="font-semibold text-slate-900">
                  {request?.purpose || "Clinical Consultation"}
                </span>
              </div>
            </div>

            {/* Requested Data Scope (2x2 Grid) */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                REQUESTED DATA SCOPE
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 bg-white border border-slate-200 rounded-lg flex items-center gap-2.5 font-semibold text-slate-800 shadow-xs">
                  <CheckCircle2 className="w-4 h-4 text-[#006699]" />
                  <span>Visit history & encounters</span>
                </div>

                <div className="p-3.5 bg-white border border-slate-200 rounded-lg flex items-center gap-2.5 font-semibold text-slate-800 shadow-xs">
                  <CheckCircle2 className="w-4 h-4 text-[#006699]" />
                  <span>Clinical Diagnoses</span>
                </div>

                <div className="p-3.5 bg-white border border-slate-200 rounded-lg flex items-center gap-2.5 font-semibold text-slate-800 shadow-xs">
                  <CheckCircle2 className="w-4 h-4 text-[#006699]" />
                  <span>Active & past Prescriptions</span>
                </div>

                <div className="p-3.5 bg-white border border-slate-200 rounded-lg flex items-center gap-2.5 font-semibold text-slate-800 shadow-xs">
                  <CheckCircle2 className="w-4 h-4 text-[#006699]" />
                  <span>Diagnostic Lab & Imaging reports</span>
                </div>
              </div>
            </div>

            {/* Blue Duration & Control Box */}
            <div className="bg-sky-50/60 border border-sky-100 rounded-xl p-5 space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <Clock className="w-4 h-4 text-[#006699]" />
                <span>
                  Authorized Access Duration:{" "}
                  <span className="font-normal text-slate-700">30 minutes</span>
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Shield className="w-4 h-4 text-[#006699]" />
                <span>
                  You control whether normal access is granted. You can revoke access at any time.
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              {isPending ? (
                <>
                  <button
                    type="button"
                    onClick={handleDeny}
                    disabled={actionLoading !== null}
                    className="px-5 py-2.5 border border-rose-300 text-rose-700 hover:bg-rose-50 font-semibold text-xs rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    {actionLoading === "denying" ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Denying...</span>
                      </>
                    ) : (
                      <span>Deny Request</span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleApprove}
                    disabled={actionLoading !== null}
                    className="px-6 py-2.5 bg-black hover:bg-slate-800 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-2 shadow cursor-pointer"
                  >
                    {actionLoading === "approving" ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Approving...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5" />
                        <span>Approve Access (30 Min)</span>
                      </>
                    )}
                  </button>
                </>
              ) : (
                <Link
                  href="/patient/access-requests"
                  className="px-5 py-2.5 bg-[#0F172A] hover:bg-slate-800 text-white font-semibold text-xs rounded-lg transition-colors"
                >
                  Return to Access Requests
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </PatientShell>
  );
}
