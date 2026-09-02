"use client";

import React, { use, useState, useEffect } from "react";
import Link from "next/link";
import { StaffShell } from "@/components/layout/staff-shell";
import {
  AlertTriangle,
  ShieldCheck,
  Calendar,
  FileText,
  Activity,
  ArrowRight,
  Plus,
  Clock,
  ChevronRight,
  ShieldAlert,
  Lock,
  RefreshCw,
  Send,
} from "lucide-react";

interface ClinicalData {
  authorized: boolean;
  valid_until?: string;
  patient?: {
    id: string;
    medibase_id: string;
    name: string;
    age: number;
    allergies: string[];
    chronicConditions: string[];
    currentMedications: Array<{
      name: string;
      dosage: string;
      frequency: string;
      prescribedBy: string;
      startDate: string;
    }>;
  };
  clinical_snapshot?: {
    last_visit: string;
    active_conditions: string[];
    current_medications: string[];
    recent_investigations: Array<{ name: string; status?: string; value?: string }>;
  };
  encounters?: Array<{
    id: string;
    date: string;
    time?: string;
    hospital_name?: string;
    hospital?: string;
    department?: string;
    doctor_name?: string;
    doctorName?: string;
    doctorRole?: string;
    visit_type?: string;
    visitType?: string;
    chief_complaint?: string;
    chiefComplaint?: string;
    diagnosis?: string;
    clinicalNotes?: string;
    prescriptions?: unknown[];
  }>;
  error?: string;
  message?: string;
}

export default function PatientOverviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const patientId = (resolvedParams.id || "MB-102394").toUpperCase();

  const [clinicalData, setClinicalData] = useState<ClinicalData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAccess() {
      setLoading(true);
      try {
        const res = await fetch(`/api/staff/patient/${patientId}/clinical-access`);
        const data = await res.json();
        setClinicalData(data);
      } catch (err) {
        console.error("Clinical access check error:", err);
        setClinicalData({
          authorized: false,
          error: "Connection error during access verification.",
        });
      } finally {
        setLoading(false);
      }
    }
    checkAccess();
  }, [patientId]);

  const isAuthorized = clinicalData?.authorized === true;
  const patientName = clinicalData?.patient?.name || "Rahul Sharma";
  const patientAge = clinicalData?.patient?.age || 32;

  return (
    <StaffShell activeNav="recent-patients">
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Loading State */}
        {loading && (
          <div className="p-12 text-center bg-white border border-slate-200 rounded-xl space-y-3">
            <RefreshCw className="w-8 h-8 animate-spin text-[#006699] mx-auto" />
            <p className="text-sm font-semibold text-slate-800">
              Verifying Patient Authorization & Access Grants...
            </p>
            <p className="text-xs text-slate-400">
              Validating cryptographic permissions against Supabase RLS policies.
            </p>
          </div>
        )}

        {/* ======================================================== */}
        {/* ACCESS DENIED STATE (Strict Separation of Identification) */}
        {/* ======================================================== */}
        {!loading && !isAuthorized && (
          <div className="space-y-6">
            {/* Red Alert Callout */}
            <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-6 sm:p-8 shadow-sm text-center max-w-2xl mx-auto space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-600 mx-auto">
                <ShieldAlert className="w-9 h-9" />
              </div>

              <div>
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-200/80 text-rose-800">
                  Access Restricted • Authorization Required
                </span>
                <h1 className="text-2xl font-bold text-slate-900 mt-3">
                  Longitudinal Medical Records Protected
                </h1>
                <p className="text-sm text-slate-600 max-w-md mx-auto mt-2 leading-relaxed">
                  Patient <span className="font-bold text-slate-900">{patientName}</span> ({patientId}) has been identified, but has not granted active authorization to your facility.
                </p>
              </div>

              <div className="p-4 bg-white border border-rose-200 rounded-xl text-xs text-slate-700 max-w-md mx-auto space-y-1.5 text-left">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <Lock className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>HIPAA & NDHM Privacy Protection</span>
                </div>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  Clinical diagnoses, active prescriptions, and historical visits are completely restricted until the patient approves an access request in their MediBase app.
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
                  Search Another Patient
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* AUTHORIZED ACCESS STATE (Render Longitudinal Medical Record) */}
        {/* ======================================================== */}
        {!loading && isAuthorized && (
          <>
            {/* Patient Identity Header Card */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                  {patientName}
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                  MediBase ID: <span className="font-semibold text-slate-700">{patientId}</span> • Age: {patientAge}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Authorized Access Active
                </span>
                <span className="text-[11px] text-slate-400 font-medium">
                  Valid for 30m
                </span>
              </div>
            </div>

            {/* Clinical Snapshot & What's Changed Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Clinical Snapshot (8 cols) */}
              <div className="lg:col-span-8 space-y-4">
                <h2 className="text-xl font-bold text-slate-900">Clinical Snapshot</h2>

                {/* Allergy Alert */}
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-rose-800 uppercase tracking-wider">
                      Important Alert
                    </p>
                    <p className="text-sm font-semibold text-rose-900 mt-0.5">
                      {clinicalData?.patient?.allergies?.join(", ") || "Penicillin Allergy (Anaphylaxis)"}
                    </p>
                  </div>
                </div>

                {/* 4 Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Last Visit */}
                  <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      LAST VISIT
                    </span>
                    <p className="text-base font-bold text-slate-900 mt-2">
                      {clinicalData?.clinical_snapshot?.last_visit || "Oct 12, 2023"}
                    </p>
                  </div>

                  {/* Active Conditions */}
                  <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      ACTIVE CONDITIONS
                    </span>
                    <div className="mt-2 text-sm text-slate-800 font-medium space-y-0.5">
                      {clinicalData?.clinical_snapshot?.active_conditions?.map((c, i) => (
                        <p key={i}>{c}</p>
                      )) || (
                        <>
                          <p>Hypertension (Stage 1)</p>
                          <p>Seasonal Allergies</p>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Current Medications */}
                  <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      CURRENT MEDICATIONS
                    </span>
                    <div className="mt-2 text-sm text-slate-800 font-medium space-y-0.5">
                      {clinicalData?.clinical_snapshot?.current_medications?.map((m, i) => (
                        <p key={i}>{m}</p>
                      )) || (
                        <>
                          <p>Amlodipine 5mg</p>
                          <p>Albuterol Inhaler</p>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Recent Investigations */}
                  <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      RECENT INVESTIGATIONS
                    </span>
                    <div className="mt-2 text-sm text-slate-800 font-medium space-y-1">
                      {clinicalData?.clinical_snapshot?.recent_investigations?.map((inv, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <span>{inv.name}</span>
                          {inv.status ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-sky-50 text-sky-700 border border-sky-200">
                              {inv.status}
                            </span>
                          ) : (
                            <span className="font-bold text-slate-900">{inv.value}</span>
                          )}
                        </div>
                      )) || (
                        <div className="flex items-center justify-between">
                          <span>Lipid Profile</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-sky-50 text-sky-700 border border-sky-200">
                            Normal
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right What's Changed Preview (4 cols) */}
              <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-slate-900">What&apos;s Changed?</h2>
                    <Link
                      href={`/staff/patient/${patientId}/whats-changed`}
                      className="text-xs font-semibold text-[#006699] hover:underline flex items-center"
                    >
                      Details <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Updates since previous encounter.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-slate-500 uppercase text-[10px]">DIAGNOSIS</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-sky-500 text-white">
                        NEW
                      </span>
                    </div>
                    <p className="text-sm font-bold text-slate-900">Essential Hypertension</p>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-slate-500 uppercase text-[10px]">MEDICATION</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-sky-500 text-white">
                        ACTIVE
                      </span>
                    </div>
                    <p className="text-sm font-bold text-slate-900">Amlodipine 5mg OD</p>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-slate-500 uppercase text-[10px]">INVESTIGATION</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-sky-100 text-sky-800">
                        VERIFIED
                      </span>
                    </div>
                    <p className="text-sm font-bold text-slate-900">12-Lead Resting ECG</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Medical Timeline Table */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-xl font-bold text-slate-900">Medical Timeline</h2>
                <div className="flex items-center gap-3">
                  <Link
                    href={`/staff/patient/${patientId}/timeline`}
                    className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold text-xs rounded-lg transition-colors"
                  >
                    View Full Timeline
                  </Link>
                  <Link
                    href={`/staff/patient/${patientId}/new-visit`}
                    className="px-4 py-2 bg-black hover:bg-slate-800 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Visit</span>
                  </Link>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#0F172A] text-white uppercase text-[11px] tracking-wider">
                      <tr>
                        <th className="py-3 px-5 font-semibold">Date</th>
                        <th className="py-3 px-5 font-semibold">Encounter Type</th>
                        <th className="py-3 px-5 font-semibold">Primary Provider</th>
                        <th className="py-3 px-5 font-semibold text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {clinicalData?.encounters?.map((enc) => (
                        <tr key={enc.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3.5 px-5 font-medium text-slate-900 whitespace-nowrap">
                            <span>📅 {enc.date}</span>
                            {enc.time && <span className="text-[11px] text-slate-500 font-normal ml-2">⏰ {enc.time}</span>}
                          </td>
                          <td className="py-3.5 px-5 font-semibold text-slate-800">
                            {enc.visit_type || enc.visitType || enc.chief_complaint || enc.chiefComplaint || "Clinical Visit"}
                          </td>
                          <td className="py-3.5 px-5 text-slate-600 font-medium">
                            {enc.doctor_name || enc.doctorName || "Dr. Rahul Sharma"}
                          </td>
                          <td className="py-3.5 px-5 text-right">
                            <Link
                              href={`/staff/patient/${patientId}/timeline`}
                              className="text-[#006699] font-semibold hover:underline"
                            >
                              Details ➔
                            </Link>
                          </td>
                        </tr>
                      )) || (
                        <tr className="hover:bg-slate-50 transition-colors">
                          <td className="py-3.5 px-5 font-medium text-slate-900">2026-08-18</td>
                          <td className="py-3.5 px-5">Cardiology OPD Consultation</td>
                          <td className="py-3.5 px-5 text-slate-600">Dr. Sarah Jenkins</td>
                          <td className="py-3.5 px-5 text-right">
                            <Link
                              href={`/staff/patient/${patientId}/timeline`}
                              className="text-[#006699] font-semibold hover:underline"
                            >
                              Details
                            </Link>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </StaffShell>
  );
}
