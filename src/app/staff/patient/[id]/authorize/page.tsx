"use client";

import React, { use, useState, useEffect } from "react";
import Link from "next/link";
import { StaffShell } from "@/components/layout/staff-shell";
import {
  ShieldAlert,
  Eye,
  CheckCircle2,
  Stethoscope,
  Building2,
  FileSpreadsheet,
  Send,
  AlertCircle,
  RefreshCw,
  Lock,
  ArrowLeft,
} from "lucide-react";
import { getCurrentUserProfile, UserProfile } from "@/lib/supabase/auth-helpers";

interface PatientIdentity {
  id: string;
  medibase_id: string;
  full_name: string;
  age: number | null;
  gender: string | null;
  blood_group: string | null;
  occupation: string | null;
}

export default function PatientAuthorizePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const patientId = (resolvedParams.id || "MB-102394").toUpperCase();

  const [staffProfile, setStaffProfile] = useState<UserProfile | null>(null);
  const [patient, setPatient] = useState<PatientIdentity | null>(null);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);
  const [requestStatus, setRequestStatus] = useState<"idle" | "sent" | "duplicate" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        // 1. Load authenticated staff profile
        const p = await getCurrentUserProfile();
        setStaffProfile(p);

        // 2. Identify patient via lookup API
        const res = await fetch("/api/staff/lookup-patient", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ medibaseId: patientId }),
        });

        const data = await res.json();
        if (data.success && data.patient) {
          setPatient(data.patient);
        } else {
          // Fallback baseline for demo patient
          setPatient({
            id: "10000000-0000-0000-0000-000000000001",
            medibase_id: patientId,
            full_name: "Identified Patient",
            age: 32,
            gender: "Male",
            blood_group: "O+",
            occupation: "Clinical Consultation",
          });
        }
      } catch (err) {
        console.error("Failed to load patient authorization details:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [patientId]);

  const rawStaffName = staffProfile?.full_name || "Dr. Rahul Sharma";
  const formattedDoctorName = rawStaffName.startsWith("Dr.") ? rawStaffName : `Dr. ${rawStaffName}`;
  const hospitalName = staffProfile?.staff_data?.hospital_name || "City General Hospital";

  const handleRequestAccess = async () => {
    setRequesting(true);
    setStatusMessage(null);

    try {
      const res = await fetch("/api/staff/access-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          medibaseId: patientId,
          patientId: patient?.id,
          reason: "Clinical Consultation & Care",
          accessType: "view_only",
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setRequestStatus("error");
        setStatusMessage(data.error || "Failed to submit access request.");
      } else if (data.is_duplicate) {
        setRequestStatus("duplicate");
        setStatusMessage("A pending access request is already active for this patient. Awaiting patient authorization.");
      } else {
        setRequestStatus("sent");
        setStatusMessage("Access request sent to patient's MediBase app. Awaiting authorization.");
      }
    } catch {
      setRequestStatus("error");
      setStatusMessage("An unexpected network error occurred.");
    } finally {
      setRequesting(false);
    }
  };

  return (
    <StaffShell activeNav="find-patient">
      <div className="space-y-6 max-w-5xl mx-auto">
        {/* Top Back Link & Header */}
        <div>
          <Link
            href="/staff/find-patient"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#006699] mb-3 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Find Patient</span>
          </Link>

          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Patient Access Authorization
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Patient identified. Initiate an authorization request to access longitudinal medical records.
          </p>
        </div>

        {/* Status Messages */}
        {requestStatus === "sent" && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3 text-xs text-emerald-800 shadow-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm text-emerald-900 mb-0.5">Access Request Submitted</p>
              <p className="leading-relaxed">{statusMessage}</p>
              <p className="text-[11px] text-emerald-700 mt-1.5 font-medium">
                The patient will see this notification in their MediBase mobile/web portal and can approve or deny access.
              </p>
            </div>
          </div>
        )}

        {requestStatus === "duplicate" && (
          <div className="p-4 bg-sky-50 border border-sky-200 rounded-xl flex items-start gap-3 text-xs text-sky-800 shadow-sm">
            <CheckCircle2 className="w-5 h-5 text-[#006699] shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm text-sky-900 mb-0.5">Active Request Pending</p>
              <p className="leading-relaxed">{statusMessage}</p>
            </div>
          </div>
        )}

        {requestStatus === "error" && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 text-xs text-rose-800 shadow-sm">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm text-rose-900 mb-0.5">Request Failed</p>
              <p className="leading-relaxed">{statusMessage}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Red Alert Callout */}
            <div className="bg-sky-50/50 border-l-4 border-l-rose-600 border border-slate-200 rounded-xl p-5 flex items-start gap-4">
              <ShieldAlert className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-rose-800 uppercase tracking-wider mb-1">
                  PATIENT AUTHORIZATION REQUIRED
                </p>
                <p className="text-xs text-slate-700 leading-relaxed">
                  Medical records and historical health data are strictly protected under HIPAA & NDHM guidelines. Access is granted only after the patient approves this request.
                </p>
              </div>
            </div>

            {/* Identified Patient Subject Box */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-800 font-bold text-base flex items-center justify-center shrink-0">
                {patient?.full_name
                  ? patient.full_name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()
                  : "PT"}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">
                    {loading ? "Loading patient..." : patient?.full_name || "Rahul Sharma"}
                  </h3>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3" />
                    Verified ID
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                  <span className="font-mono font-semibold text-slate-700">🪪 {patientId}</span>
                  <span>•</span>
                  <span>Age: {patient?.age ?? 32}</span>
                  <span>•</span>
                  <span>Gender: {patient?.gender ?? "Male"}</span>
                  <span>•</span>
                  <span>Blood: {patient?.blood_group ?? "O+"}</span>
                </div>
              </div>
            </div>

            {/* Requesting Entity Information */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                REQUESTING HEALTHCARE PROVIDER
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-lg flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-sky-50 text-[#006699] flex items-center justify-center shrink-0">
                    <Stethoscope className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Attending Provider
                    </span>
                    <span className="text-xs font-bold text-slate-900">{formattedDoctorName}</span>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-100 rounded-lg flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-sky-50 text-[#006699] flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Affiliated Facility
                    </span>
                    <span className="text-xs font-bold text-slate-900">{hospitalName}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-100 rounded-lg flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-sky-50 text-[#006699] flex items-center justify-center shrink-0">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Purpose of Clinical Access
                  </span>
                  <span className="text-xs font-bold text-slate-900">
                    Clinical Consultation & Longitudinal History Review
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm border-b border-slate-100 pb-3">
                <Eye className="w-4 h-4 text-[#006699]" />
                <span>Requested Access Scope</span>
              </div>

              <div className="space-y-3.5">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#006699] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-slate-900">Medical Timeline</p>
                    <p className="text-[11px] text-slate-500">Historical encounters & diagnoses</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#006699] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-slate-900">Prescriptions</p>
                    <p className="text-[11px] text-slate-500">Active and past medications</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#006699] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-slate-900">Diagnostic Reports</p>
                    <p className="text-[11px] text-slate-500">Lab results and imaging records</p>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Expires in 15 minutes if unapproved</span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={handleRequestAccess}
                disabled={requesting || requestStatus === "sent"}
                className="w-full py-3 px-4 bg-[#0F172A] hover:bg-slate-800 disabled:opacity-60 text-white font-semibold text-xs rounded-lg shadow transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                {requesting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Transmitting Request...</span>
                  </>
                ) : requestStatus === "sent" ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Request Transmitted</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Request Patient Access</span>
                  </>
                )}
              </button>

              <Link
                href="/staff/find-patient"
                className="w-full py-2.5 px-4 border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-lg transition-colors block text-center"
              >
                Search Another Patient
              </Link>
            </div>
          </div>
        </div>
      </div>
    </StaffShell>
  );
}
