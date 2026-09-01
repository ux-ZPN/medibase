"use client";

import React, { use, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { StaffShell } from "@/components/layout/staff-shell";
import {
  ArrowLeft,
  Search,
  Lock,
  Save,
  Building2,
  Stethoscope,
  Clock,
  ShieldAlert,
  Send,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

interface PatientContext {
  authorized: boolean;
  patient?: {
    id: string;
    medibase_id: string;
    name: string;
    age: number;
    blood_group: string;
    allergies: string[];
  };
  error?: string;
}

export default function RecordNewVisitPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const patientId = (resolvedParams.id || "MB-102394").toUpperCase();
  const router = useRouter();

  const [patientData, setPatientData] = useState<PatientContext | null>(null);
  const [loadingContext, setLoadingContext] = useState(true);

  const [chiefComplaint, setChiefComplaint] = useState(
    "Routine check-up and medication review. Patient reports slight dizziness in morning."
  );
  const [diagnosis, setDiagnosis] = useState("Essential Hypertension (I10)");
  const [clinicalNotes, setClinicalNotes] = useState(
    "BP 138/88 mmHg. Pulse 72 bpm regular. Cardiovascular and respiratory exams unremarkable. Adjusted medication schedule."
  );
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadPatientContext() {
      setLoadingContext(true);
      try {
        const res = await fetch(`/api/staff/patient/${patientId}/clinical-access`);
        const data = await res.json();
        setPatientData(data);
      } catch (err) {
        console.error("Failed to load patient context:", err);
        setPatientData({ authorized: false, error: "Network error loading patient context." });
      } finally {
        setLoadingContext(false);
      }
    }
    loadPatientContext();
  }, [patientId]);

  const isAuthorized = patientData?.authorized === true;
  const patientName = patientData?.patient?.name || "Rahul Sharma";
  const patientAge = patientData?.patient?.age || 32;
  const bloodGroup = patientData?.patient?.blood_group || "O+";

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chiefComplaint.trim()) {
      setErrorMessage("Please provide a chief complaint.");
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);

    try {
      const res = await fetch(`/api/staff/patient/${patientId}/new-visit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chiefComplaint: chiefComplaint.trim(),
          diagnosis: diagnosis.trim(),
          clinicalNotes: clinicalNotes.trim(),
          visitType: "outpatient",
          department: "Cardiology / Outpatient Clinic",
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.error || "Failed to record clinical visit.");
        setIsSaving(false);
        return;
      }

      // Success: redirect to timeline where newly created visit is visible
      router.push(`/staff/patient/${patientId}/timeline`);
    } catch (err) {
      console.error("Submission error:", err);
      setErrorMessage("Network error occurred while saving visit. Please try again.");
      setIsSaving(false);
    }
  };

  const currentDateFormatted = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <StaffShell activeNav="recent-patients">
      <div className="space-y-6 max-w-5xl mx-auto">
        {/* Header with Back button */}
        <div className="flex items-center gap-3">
          <Link
            href={`/staff/patient/${patientId}`}
            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Record New Visit
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Document clinical encounter into patient&apos;s longitudinal medical history.
            </p>
          </div>
        </div>

        {/* Loading State */}
        {loadingContext && (
          <div className="p-12 text-center bg-white border border-slate-200 rounded-xl space-y-2">
            <RefreshCw className="w-7 h-7 animate-spin text-[#006699] mx-auto mb-2" />
            <p className="text-xs text-slate-500 font-medium">Verifying active patient authorization...</p>
          </div>
        )}

        {/* ======================================================== */}
        {/* UNAUTHORIZED / ACCESS RESTRICTED STATE */}
        {/* ======================================================== */}
        {!loadingContext && !isAuthorized && (
          <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-6 sm:p-8 shadow-sm text-center max-w-2xl mx-auto space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-600 mx-auto">
              <ShieldAlert className="w-9 h-9" />
            </div>

            <div>
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-200/80 text-rose-800">
                Access Restricted • Authorization Required
              </span>
              <h2 className="text-2xl font-bold text-slate-900 mt-3">
                Cannot Record Visit Without Authorization
              </h2>
              <p className="text-sm text-slate-600 max-w-md mx-auto mt-2 leading-relaxed">
                Contributing clinical encounters for patient <span className="font-bold text-slate-900">{patientId}</span> requires active consent.
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
        {/* AUTHORIZED RECORD VISIT FORM */}
        {/* ======================================================== */}
        {!loadingContext && isAuthorized && (
          <>
            {/* Patient Context Card */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-bold text-slate-900">{patientName}</h2>
                  <span className="text-xs text-slate-500 font-semibold">({patientId})</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">
                    ♂ {patientAge} yrs
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                    🩸 {bloodGroup}
                  </span>
                </div>
              </div>

              <div className="text-left sm:text-right text-xs text-slate-500 space-y-1">
                <p className="flex items-center sm:justify-end gap-1 font-semibold text-slate-700">
                  <Building2 className="w-3.5 h-3.5 text-[#006699]" />
                  <span>City General Hospital</span>
                </p>
                <p className="flex items-center sm:justify-end gap-1">
                  <Stethoscope className="w-3.5 h-3.5 text-slate-400" />
                  <span>Dr. Rahul Sharma</span>
                </p>
                <p className="flex items-center sm:justify-end gap-1 text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{currentDateFormatted}</span>
                </p>
              </div>
            </div>

            {/* Error banner if submission failed */}
            {errorMessage && (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Clinical Form Box */}
            <form onSubmit={handleSave} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              {/* Black Banner Bar */}
              <div className="bg-[#111827] text-white px-6 py-3 text-xs font-bold uppercase tracking-wider">
                CLINICAL DETAILS
              </div>

              <div className="p-6 sm:p-8 space-y-6">
                {/* Chief Complaint */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Chief Complaint *
                  </label>
                  <input
                    type="text"
                    value={chiefComplaint}
                    onChange={(e) => setChiefComplaint(e.target.value)}
                    placeholder="Describe the primary reason for the visit..."
                    required
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#006699]"
                  />
                </div>

                {/* Diagnosis */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Diagnosis
                  </label>
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={diagnosis}
                      onChange={(e) => setDiagnosis(e.target.value)}
                      placeholder="Search ICD-10 codes or conditions..."
                      className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#006699]"
                    />
                  </div>
                </div>

                {/* Clinical Notes */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Clinical Notes
                  </label>
                  <textarea
                    rows={5}
                    value={clinicalNotes}
                    onChange={(e) => setClinicalNotes(e.target.value)}
                    placeholder="Detailed examination findings and observations..."
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#006699]"
                  />
                </div>
              </div>

              {/* Bottom Actions Bar */}
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>This visit will become part of the patient&apos;s longitudinal record and the action will be logged.</span>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={() => router.push(`/staff/patient/${patientId}`)}
                    className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold text-xs rounded-lg transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-5 py-2 bg-black hover:bg-slate-800 disabled:opacity-50 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{isSaving ? "Saving Visit..." : "Save Visit"}</span>
                  </button>
                </div>
              </div>
            </form>
          </>
        )}
      </div>
    </StaffShell>
  );
}
