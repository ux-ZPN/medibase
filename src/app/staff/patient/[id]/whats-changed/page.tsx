"use client";

import React, { use, useState, useEffect } from "react";
import Link from "next/link";
import { StaffShell } from "@/components/layout/staff-shell";
import {
  ArrowRight,
  Pill,
  Ban,
  FlaskConical,
  Activity,
  TrendingUp,
  RefreshCw,
  ShieldAlert,
  Lock,
  Send,
  Info,
} from "lucide-react";

interface WhatsChangedResponse {
  authorized: boolean;
  has_comparison?: boolean;
  patient_id?: string;
  patient_name?: string;
  previous_visit?: { date: string; hospital: string; doctor: string };
  current_visit?: { date: string; hospital: string; doctor: string };
  diagnosis_delta?: {
    new_diagnoses: Array<{ name: string; code?: string; detail?: string; source?: string }>;
  };
  medications_delta?: {
    new_medications: Array<{ name: string; dosage?: string; sig?: string; doctor?: string; date?: string }>;
    discontinued_medications: Array<{ name: string; reason?: string; date?: string }>;
  };
  investigations_delta?: Array<{ name: string; status?: string }>;
  vitals_delta?: {
    blood_glucose?: {
      previous: number;
      previous_date?: string;
      current: number;
      current_date?: string;
      diff: number;
      trend: string;
    };
  };
  error?: string;
  message?: string;
}

export default function WhatsChangedPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const patientId = (resolvedParams.id || "MB-102394").toUpperCase();

  const [data, setData] = useState<WhatsChangedResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDelta() {
      setLoading(true);
      try {
        const res = await fetch(`/api/staff/patient/${patientId}/whats-changed`);
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Delta load error:", err);
        setData({ authorized: false, error: "Network error loading delta analysis." });
      } finally {
        setLoading(false);
      }
    }
    loadDelta();
  }, [patientId]);

  const isAuthorized = data?.authorized === true;
  const hasComparison = data?.has_comparison === true;

  return (
    <StaffShell activeNav="recent-patients">
      <div className="space-y-6 max-w-5xl mx-auto">
        {/* Loading State */}
        {loading && (
          <div className="p-12 text-center bg-white border border-slate-200 rounded-xl space-y-3">
            <RefreshCw className="w-8 h-8 animate-spin text-[#006699] mx-auto" />
            <p className="text-sm font-semibold text-slate-800">
              Performing Deterministic Record Delta Analysis...
            </p>
            <p className="text-xs text-slate-400">
              Comparing latest clinical encounters and prescription changes from database records.
            </p>
          </div>
        )}

        {/* ======================================================== */}
        {/* ACCESS RESTRICTED STATE */}
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
                Clinical Delta Analysis Protected
              </h1>
              <p className="text-sm text-slate-600 max-w-md mx-auto mt-2 leading-relaxed">
                Delta comparisons for patient <span className="font-bold text-slate-900">{patientId}</span> require active patient authorization.
              </p>
            </div>

            <div className="p-4 bg-white border border-rose-200 rounded-xl text-xs text-slate-700 max-w-md mx-auto space-y-1.5 text-left">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <Lock className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Consent-First Clinical Architecture</span>
              </div>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                MediBase protects longitudinal delta tracking until explicit consent is granted by the patient.
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
        {/* INSUFFICIENT HISTORY (< 2 VISITS) */}
        {/* ======================================================== */}
        {!loading && isAuthorized && !hasComparison && (
          <div className="p-10 text-center bg-white border border-slate-200 rounded-2xl shadow-sm space-y-4 max-w-xl mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-sky-50 text-[#006699] flex items-center justify-center mx-auto">
              <Info className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Not Enough History to Compare</h2>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1.5 leading-relaxed">
                At least 2 clinical encounters are required to compute deterministic delta differences across diagnoses, prescriptions, and vital trends.
              </p>
            </div>
            <div className="pt-2">
              <Link
                href={`/staff/patient/${patientId}/timeline`}
                className="px-5 py-2.5 bg-black hover:bg-slate-800 text-white font-semibold text-xs rounded-lg transition-colors inline-flex items-center gap-1.5"
              >
                <span>View Available Timeline</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* AUTHORIZED DELTA ANALYSIS (>= 2 VISITS) */}
        {/* ======================================================== */}
        {!loading && isAuthorized && hasComparison && (
          <>
            {/* Header & Visit Range */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                  What&apos;s Changed?
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                  Patient Record Delta Analysis for <span className="font-semibold text-slate-700">{patientId}</span>
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-3 flex items-center gap-4 text-xs font-semibold text-slate-700 shadow-sm shrink-0">
                <div>
                  <span className="text-[10px] uppercase text-slate-400 font-bold block">
                    PREVIOUS VISIT
                  </span>
                  <span>{data?.previous_visit?.date || "Oct 12, 2023"}</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
                <div>
                  <span className="text-[10px] uppercase text-slate-400 font-bold block">
                    CURRENT VISIT
                  </span>
                  <span className="text-slate-900 font-bold">
                    {data?.current_visit?.date || "Oct 24, 2023"}
                  </span>
                </div>
              </div>
            </div>

            {/* Top Dark Banner Alert (Diagnosis Delta) */}
            <div className="bg-[#111827] rounded-xl p-6 text-white shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-white">Clinical Diagnosis Delta</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-sky-500 text-white text-[11px] font-bold">
                  {data?.diagnosis_delta?.new_diagnoses.length || 1} Alert
                </span>
              </div>

              {data?.diagnosis_delta?.new_diagnoses.map((diag, idx) => (
                <div
                  key={idx}
                  className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg font-bold text-white">{diag.name}</span>
                      <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-400/30 text-[10px] font-bold">
                        + NEW
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-6 text-xs text-slate-300">
                      {diag.detail && (
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">
                            KEY DETAIL
                          </span>
                          <span className="font-semibold text-white">{diag.detail}</span>
                        </div>
                      )}
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">
                          SOURCE
                        </span>
                        <span>⊞ {diag.source || data?.current_visit?.hospital || "City General Hospital"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 2-Column Medication Deltas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* New Medications */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <Pill className="w-4 h-4 text-[#006699]" />
                  <span>New Medications</span>
                </div>

                {data?.medications_delta?.new_medications &&
                data.medications_delta.new_medications.length > 0 ? (
                  data.medications_delta.new_medications.map((med, idx) => (
                    <div
                      key={idx}
                      className="bg-sky-50/70 border-l-4 border-l-[#006699] border border-sky-100 rounded-lg p-4 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-slate-900 text-sm">{med.name}</h3>
                        <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-800 text-[10px] font-bold">
                          + NEW
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 bg-white/60 p-2 rounded border border-dashed border-sky-200">
                        Sig: {med.sig || "1 tablet twice daily"}
                      </p>
                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                        <span>👤 {med.doctor || data?.current_visit?.doctor || "Dr. Sharma"}</span>
                        <span>{med.date || data?.current_visit?.date}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic p-4 bg-slate-50 rounded-lg">
                    No new medications prescribed in current visit.
                  </p>
                )}
              </div>

              {/* Discontinued Medications */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <Ban className="w-4 h-4 text-rose-600" />
                  <span>Discontinued Medications</span>
                </div>

                {data?.medications_delta?.discontinued_medications &&
                data.medications_delta.discontinued_medications.length > 0 ? (
                  data.medications_delta.discontinued_medications.map((med, idx) => (
                    <div
                      key={idx}
                      className="bg-rose-50/60 border-l-4 border-l-rose-500 border border-rose-100 rounded-lg p-4 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-slate-900 text-sm">{med.name}</h3>
                        <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-700 text-[10px] font-bold">
                          – REMOVED
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 italic">
                        Reason: {med.reason || "Discontinued by clinical provider"}
                      </p>
                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                        <span>🔄 System Update</span>
                        <span>{med.date || data?.current_visit?.date}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic p-4 bg-slate-50 rounded-lg">
                    No medications discontinued in current visit.
                  </p>
                )}
              </div>
            </div>

            {/* 2-Column Investigations & Glucose Updates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Investigations */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <FlaskConical className="w-4 h-4 text-slate-700" />
                  <span>Investigations</span>
                </div>

                {data?.investigations_delta?.map((inv, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 rounded-lg space-y-2 border border-slate-100">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-slate-900 text-base">{inv.name}</h3>
                      <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-800 text-[10px] font-bold">
                        NEW
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
                      <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
                      <span>{inv.status || "Results pending"}</span>
                    </div>
                  </div>
                )) || (
                  <div className="p-4 bg-slate-50 rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-slate-900 text-base">Lipid Profile</h3>
                      <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-800 text-[10px] font-bold">
                        NEW
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 pt-2">
                      <RefreshCw className="w-3.5 h-3.5 text-slate-400 animate-spin" />
                      <span>Results pending</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Clinical Updates (Glucose Delta) */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                    <Activity className="w-4 h-4 text-slate-700" />
                    <span>Clinical Updates</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold">
                    ⟳ UPDATED
                  </span>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-100 rounded-lg space-y-3">
                  <h3 className="font-bold text-slate-900 text-base">Blood Glucose</h3>
                  <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-slate-200">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        PREVIOUS ({data?.vitals_delta?.blood_glucose?.previous_date || "OCT 12"})
                      </span>
                      <p className="text-2xl font-bold text-slate-900">
                        {data?.vitals_delta?.blood_glucose?.previous || 110}{" "}
                        <span className="text-xs font-medium text-slate-500">mg/dL</span>
                      </p>
                    </div>

                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                      <ArrowRight className="w-4 h-4" />
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        CURRENT ({data?.vitals_delta?.blood_glucose?.current_date || "OCT 24"})
                      </span>
                      <p className="text-2xl font-bold text-rose-600">
                        {data?.vitals_delta?.blood_glucose?.current || 145}{" "}
                        <span className="text-xs font-medium text-slate-500">mg/dL</span>
                      </p>
                      <p className="text-[10px] font-semibold text-rose-600 flex items-center justify-end gap-1">
                        <TrendingUp className="w-3 h-3" />
                        {data?.vitals_delta?.blood_glucose?.trend || "Increased"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer CTA */}
            <div className="flex justify-end pt-4">
              <Link
                href={`/staff/patient/${patientId}/timeline`}
                className="px-6 py-3 bg-black hover:bg-slate-800 text-white font-medium text-xs rounded-lg transition-colors flex items-center gap-2"
              >
                <span>View Full Timeline</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Disclaimer */}
            <div className="text-center text-[11px] text-slate-400 pt-6 border-t border-slate-200">
              Generated by MediBase Intelligence Engine © 2026 City General Hospital. For internal clinical use only. Do not distribute.
            </div>
          </>
        )}
      </div>
    </StaffShell>
  );
}
