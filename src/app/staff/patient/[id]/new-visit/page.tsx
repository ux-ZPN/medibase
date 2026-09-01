"use client";

import React, { use, useState } from "react";
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
} from "lucide-react";

export default function RecordNewVisitPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const patientId = resolvedParams.id || "MB-102394";
  const router = useRouter();

  const [chiefComplaint, setChiefComplaint] = useState(
    "Routine check-up and medication review. Patient reports slight dizziness in morning."
  );
  const [diagnosis, setDiagnosis] = useState("Essential Hypertension (I10)");
  const [clinicalNotes, setClinicalNotes] = useState(
    "BP 138/88 mmHg. Pulse 72 bpm regular. Cardiovascular and respiratory exams unremarkable. Adjusted medication schedule."
  );
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      router.push(`/staff/patient/${patientId}/timeline`);
    }, 600);
  };

  return (
    <StaffShell activeNav="recent-patients">
      <div className="space-y-6 max-w-5xl mx-auto">
        {/* Header with Back button */}
        <div className="flex items-center gap-3">
          <Link
            href={`/staff/patient/${patientId}`}
            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Record New Visit
          </h1>
        </div>

        {/* Patient Context Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold text-slate-900">Rahul Sharma</h2>
              <span className="text-xs text-slate-500">({patientId})</span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">
                ♂ 32 yrs
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                🩸 O+
              </span>
            </div>
          </div>

          <div className="text-right text-xs text-slate-500 space-y-1">
            <p className="flex items-center sm:justify-end gap-1 font-semibold text-slate-700">
              <Building2 className="w-3.5 h-3.5" />
              <span>City General Hospital</span>
            </p>
            <p className="flex items-center sm:justify-end gap-1">
              <Stethoscope className="w-3.5 h-3.5" />
              <span>Dr. Sharma</span>
            </p>
            <p className="flex items-center sm:justify-end gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Oct 24, 2023, 11:30 AM</span>
            </p>
          </div>
        </div>

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
                className="px-4 py-2 border border-[#006699] text-[#006699] hover:bg-sky-50 font-semibold text-xs rounded-lg transition-colors"
              >
                Save Draft
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-5 py-2 bg-black hover:bg-slate-800 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isSaving ? "Saving..." : "Save Visit"}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </StaffShell>
  );
}
