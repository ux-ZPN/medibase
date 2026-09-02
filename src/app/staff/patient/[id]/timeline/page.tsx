"use client";

import React, { use, useState, useEffect } from "react";
import Link from "next/link";
import { StaffShell } from "@/components/layout/staff-shell";
import {
  Stethoscope,
  Microscope,
  FileText,
  AlertTriangle,
  Plus,
  Edit,
  ShieldAlert,
  RefreshCw,
  Send,
  Pill,
  Lock,
} from "lucide-react";

interface TimelineResponse {
  authorized: boolean;
  patient?: {
    id: string;
    medibase_id: string;
    name: string;
    age: number;
    blood_group: string;
    allergies: string[];
  };
  encounters?: Array<{
    id: string;
    date: string;
    time?: string;
    timestamp?: string;
    hospital_name: string;
    department: string;
    doctor_name: string;
    doctor_role: string;
    visit_type: string;
    chief_complaint: string;
    diagnoses: Array<{ name: string; code?: string; is_primary?: boolean }>;
    prescriptions: Array<{ name: string; dosage: string; frequency: string; instructions?: string }>;
    investigations?: Array<{ name: string; status: string; result?: string }>;
    reports?: Array<{ title: string; file_name: string; file_url?: string }>;
    clinical_notes?: string;
  }>;
  error?: string;
}

export default function StaffPatientTimelinePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const patientId = (resolvedParams.id || "MB-102394").toUpperCase();

  const [data, setData] = useState<TimelineResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTimeline() {
      setLoading(true);
      try {
        const res = await fetch(`/api/staff/patient/${patientId}/timeline`);
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Timeline loading error:", err);
        setData({ authorized: false, error: "Network error loading timeline." });
      } finally {
        setLoading(false);
      }
    }
    loadTimeline();
  }, [patientId]);

  const isAuthorized = data?.authorized === true;
  const patientName = data?.patient?.name || "Rahul Sharma";
  const patientAge = data?.patient?.age || 32;
  const bloodGroup = data?.patient?.blood_group || "O+";
  const allergies = data?.patient?.allergies || ["Penicillin Allergy"];

  const patientInitials = patientName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "RS";

  return (
    <StaffShell activeNav="recent-patients">
      <div className="space-y-6 max-w-5xl mx-auto">
        {/* Loading State */}
        {loading && (
          <div className="p-12 text-center bg-white border border-slate-200 rounded-xl space-y-3">
            <RefreshCw className="w-8 h-8 animate-spin text-[#006699] mx-auto" />
            <p className="text-sm font-semibold text-slate-800">
              Loading Longitudinal Medical Timeline...
            </p>
            <p className="text-xs text-slate-400">
              Verifying active authorization grant and retrieving chronological encounters.
            </p>
          </div>
        )}

        {/* ======================================================== */}
        {/* UNAUTHORIZED / ACCESS RESTRICTED STATE */}
        {/* ======================================================== */}
        {!loading && !isAuthorized && (
          <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-6 sm:p-8 shadow-sm text-center max-w-2xl mx-auto space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-600 mx-auto">
              <ShieldAlert className="w-9 h-9" />
            </div>

            <div>
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-200/80 text-rose-800">
                Access Restricted • Authorization Required
              </span>
              <h1 className="text-2xl font-bold text-slate-900 mt-3">
                Protected Medical Timeline Locked
              </h1>
              <p className="text-sm text-slate-600 max-w-md mx-auto mt-2 leading-relaxed">
                Viewing past clinical visits and longitudinal history for <span className="font-bold text-slate-900">{patientId}</span> requires active patient authorization.
              </p>
            </div>

            <div className="p-4 bg-white border border-rose-200 rounded-xl text-xs text-slate-700 max-w-md mx-auto space-y-1.5 text-left">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <Lock className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Patient Consent Enforced</span>
              </div>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                Cross-facility encounters, previous prescriptions, and diagnostic reports cannot be accessed until the patient approves your request.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                href={`/staff/patient/${patientId}/authorize`}
                className="w-full sm:w-auto px-6 py-3 bg-[#006699] hover:bg-[#005580] text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 shadow"
              >
                <Send className="w-4 h-4" />
                <span>Request Patient Authorization</span>
              </Link>

              <Link
                href="/staff/find-patient"
                className="w-full sm:w-auto px-5 py-3 border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-lg transition-colors text-center"
              >
                Find Another Patient
              </Link>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* AUTHORIZED LONGITUDINAL MEDICAL TIMELINE */}
        {/* ======================================================== */}
        {!loading && isAuthorized && (
          <>
            {/* Patient Subheader Card */}
            <div className="bg-white border-l-4 border-l-[#006699] border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-800 font-bold text-base flex items-center justify-center shrink-0">
                  {patientInitials}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-xl font-bold text-slate-900">{patientName}</h1>
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-600">
                      {patientId}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span>{patientAge} yrs (M)</span>
                    <span>•</span>
                    <span>🩸 {bloodGroup}</span>
                    <span>•</span>
                    <span className="text-rose-600 font-semibold flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      {allergies.join(", ")}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button className="px-3.5 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer">
                  <Edit className="w-3.5 h-3.5" />
                  <span>Edit Info</span>
                </button>
                <Link
                  href={`/staff/patient/${patientId}/new-visit`}
                  className="px-4 py-2 bg-black hover:bg-slate-800 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Visit</span>
                </Link>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="border-b border-slate-200 flex items-center gap-8 text-sm font-semibold">
              <Link
                href={`/staff/patient/${patientId}`}
                className="pb-3 text-slate-500 hover:text-slate-900"
              >
                Overview
              </Link>
              <button className="pb-3 text-[#006699] border-b-2 border-[#006699]">
                Timeline ({data?.encounters?.length || 0})
              </button>
              <Link
                href={`/staff/patient/${patientId}/upload-report`}
                className="pb-3 text-slate-500 hover:text-slate-900"
              >
                Reports
              </Link>
              <Link
                href="/staff/audit-log"
                className="pb-3 text-slate-500 hover:text-slate-900"
              >
                Access Activity
              </Link>
            </div>

            {/* Empty State */}
            {data?.encounters && data.encounters.length === 0 && (
              <div className="p-10 text-center bg-white border border-slate-200 rounded-xl space-y-2">
                <p className="text-base font-bold text-slate-900">No Medical Encounters Recorded</p>
                <p className="text-xs text-slate-500">This patient has no recorded clinical visits in the network yet.</p>
              </div>
            )}

            {/* Vertical Timeline Nodes (Newest -> Oldest) */}
            {data?.encounters && data.encounters.length > 0 && (
              <div className="relative pl-12 space-y-8 before:absolute before:left-5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
                {data.encounters.map((enc, idx) => {
                  const isLab = enc.visit_type.toLowerCase().includes("diagnostic") || enc.department.toLowerCase().includes("lab");
                  const doctorInitials = enc.doctor_name
                    .replace(/^Dr\.\s*/i, "")
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase() || "DR";

                  return (
                    <div key={enc.id || idx} className="relative">
                      {/* Node Icon */}
                      <div
                        className={`absolute -left-12 top-0 w-10 h-10 rounded-xl flex items-center justify-center ring-4 ring-[#F8FAFC] ${
                          isLab
                            ? "bg-white border border-slate-200 text-slate-600"
                            : "bg-sky-100 text-[#006699]"
                        }`}
                      >
                        {isLab ? <Microscope className="w-5 h-5" /> : <Stethoscope className="w-5 h-5" />}
                      </div>

                      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                          <div>
                            <h3 className="text-base font-bold text-slate-900">
                              {enc.visit_type}
                            </h3>
                            <p className="text-xs text-slate-500 mt-0.5">
                              📅 {enc.date}{enc.time ? ` • ⏰ ${enc.time}` : ""} • {enc.hospital_name} {enc.department ? `(${enc.department})` : ""}
                            </p>
                          </div>
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                            <span className="w-4 h-4 rounded-full bg-slate-800 text-white flex items-center justify-center text-[9px]">
                              {doctorInitials}
                            </span>
                            <span>{enc.doctor_name}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                          <div>
                            <span className="font-bold text-slate-400 uppercase text-[10px] tracking-wider">
                              CHIEF COMPLAINT
                            </span>
                            <p className="text-slate-800 mt-1 leading-relaxed">
                              {enc.chief_complaint}
                            </p>
                          </div>
                          <div>
                            <span className="font-bold text-slate-400 uppercase text-[10px] tracking-wider">
                              DIAGNOSIS
                            </span>
                            <div className="flex flex-wrap gap-1.5 mt-1">
                              {enc.diagnoses && enc.diagnoses.length > 0 ? (
                                enc.diagnoses.map((d, dIdx) => (
                                  <span
                                    key={dIdx}
                                    className="px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-sky-200 font-semibold"
                                  >
                                    {d.name} {d.code ? `(${d.code})` : ""}
                                  </span>
                                ))
                              ) : (
                                <span className="text-slate-400 italic">No specific diagnosis recorded</span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Prescriptions & Investigations */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
                          <div>
                            <span className="font-bold text-slate-400 uppercase text-[10px] tracking-wider">
                              PRESCRIPTION
                            </span>
                            <div className="space-y-1 mt-1 text-slate-800 font-medium">
                              {enc.prescriptions && enc.prescriptions.length > 0 ? (
                                enc.prescriptions.map((p, pIdx) => (
                                  <p key={pIdx} className="flex items-center gap-1.5 text-sky-900">
                                    <span className="w-3.5 h-3.5 rounded-sm bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-[9px]">
                                      +
                                    </span>
                                    {p.name} {p.dosage ? `(${p.dosage})` : ""} {p.frequency ? `— ${p.frequency}` : ""}
                                  </p>
                                ))
                              ) : (
                                <p className="text-slate-400 italic">No prescriptions for this visit</p>
                              )}
                            </div>
                          </div>

                          <div>
                            <span className="font-bold text-slate-400 uppercase text-[10px] tracking-wider">
                              INVESTIGATIONS ORDERED
                            </span>
                            <p className="text-slate-800 mt-1">
                              {enc.investigations && enc.investigations.length > 0
                                ? enc.investigations.map((i) => i.name).join(", ")
                                : "None ordered"}
                            </p>
                          </div>
                        </div>

                        {/* Attached Documents */}
                        {enc.reports && enc.reports.length > 0 && (
                          <div className="bg-sky-50/60 border border-sky-100 rounded-lg p-3">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                              ATTACHED DOCUMENTS
                            </span>
                            <div className="flex flex-wrap gap-2">
                              {enc.reports.map((rep, rIdx) => (
                                <div
                                  key={rIdx}
                                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:border-slate-300 cursor-pointer shadow-2xs"
                                >
                                  <FileText className="w-3.5 h-3.5 text-rose-500" />
                                  <span>{rep.file_name || rep.title}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Clinical Notes */}
                        {enc.clinical_notes && (
                          <div className="text-xs bg-slate-50 p-3 rounded-lg border border-slate-100 text-slate-600">
                            <span className="font-bold text-slate-500 uppercase text-[10px] block mb-0.5">CLINICAL NOTES</span>
                            <p>{enc.clinical_notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </StaffShell>
  );
}
