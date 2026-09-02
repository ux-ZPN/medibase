"use client";

import React, { useState, useEffect } from "react";
import { PatientShell } from "@/components/layout/patient-shell";
import {
  FileText,
  Activity,
  Pill,
  Calendar,
  RefreshCw,
  Stethoscope,
} from "lucide-react";

interface PatientEncounter {
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
  prescriptions: Array<{ name: string; dosage?: string; frequency?: string; instructions?: string }>;
  investigations?: Array<{ name: string; status?: string; result?: string }>;
  reports?: Array<{ title: string; file_name: string; file_url?: string }>;
  clinical_notes?: string;
}

export default function PatientTimelinePage() {
  const [filter, setFilter] = useState("all");
  const [encounters, setEncounters] = useState<PatientEncounter[]>([]);
  const [loading, setLoading] = useState(true);

  const filterOptions = [
    { label: "All", key: "all" },
    { label: "Visits", key: "visits" },
    { label: "Diagnoses", key: "diagnoses" },
    { label: "Prescriptions", key: "prescriptions" },
    { label: "Reports", key: "reports" },
  ];

  useEffect(() => {
    async function loadPatientTimeline() {
      setLoading(true);
      try {
        const res = await fetch("/api/patient/timeline");
        const json = await res.json();
        if (json.success && Array.isArray(json.encounters)) {
          setEncounters(json.encounters);
        }
      } catch (err) {
        console.error("Failed to load patient timeline:", err);
      } finally {
        setLoading(false);
      }
    }
    loadPatientTimeline();
  }, []);

  const filteredEncounters = encounters.filter((enc) => {
    if (filter === "all") return true;
    if (filter === "visits") return true;
    if (filter === "diagnoses") return enc.diagnoses && enc.diagnoses.length > 0;
    if (filter === "prescriptions") return enc.prescriptions && enc.prescriptions.length > 0;
    if (filter === "reports") return enc.reports && enc.reports.length > 0;
    return true;
  });

  return (
    <PatientShell activeNav="timeline">
      <div className="space-y-6">
        {/* Title */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Medical Timeline
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Your chronological longitudinal healthcare history across authorized network hospitals.
            </p>
          </div>

          <button
            onClick={() => {
              setLoading(true);
              fetch("/api/patient/timeline")
                .then((r) => r.json())
                .then((d) => {
                  if (d.encounters) setEncounters(d.encounters);
                })
                .finally(() => setLoading(false));
            }}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title="Refresh timeline"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {filterOptions.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setFilter(opt.key)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                filter === opt.key
                  ? "bg-[#111827] text-white"
                  : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="p-12 text-center bg-white border border-slate-200 rounded-xl space-y-2">
            <RefreshCw className="w-7 h-7 animate-spin text-[#006699] mx-auto mb-2" />
            <p className="text-xs text-slate-500 font-medium">Loading your verified health records...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredEncounters.length === 0 && (
          <div className="p-10 text-center bg-white border border-slate-200 rounded-xl space-y-2">
            <p className="text-base font-bold text-slate-900">No Records Matching Filter</p>
            <p className="text-xs text-slate-500">No medical encounters matching &quot;{filter}&quot; were found.</p>
          </div>
        )}

        {/* Timeline Items */}
        {!loading && filteredEncounters.length > 0 && (
          <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-2 sm:before:left-3 before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-200">
            {filteredEncounters.map((enc, idx) => (
              <div key={enc.id || idx} className="relative">
                {/* Timeline Bullet */}
                <div className="absolute -left-6 sm:-left-8 top-1.5 w-3 h-3 rounded-full bg-[#006699] ring-4 ring-[#F8FAFC]" />

                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-bold text-[#006699] uppercase tracking-wider flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {enc.date}
                    </span>
                    {enc.time && (
                      <span className="font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded flex items-center gap-1">
                        ⏰ {enc.time}
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded bg-sky-50 text-sky-700 font-semibold text-[10px]">
                      {enc.visit_type || "Clinical Visit"}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{enc.hospital_name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {enc.doctor_name} {enc.department ? `• ${enc.department}` : ""}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
                    <div>
                      <span className="font-bold text-slate-400 uppercase text-[10px] tracking-wider block">
                        COMPLAINT
                      </span>
                      <p className="text-slate-800 font-medium mt-1">
                        {enc.chief_complaint || "Routine evaluation"}
                      </p>
                    </div>
                    <div>
                      <span className="font-bold text-slate-400 uppercase text-[10px] tracking-wider block">
                        DIAGNOSIS
                      </span>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {enc.diagnoses && enc.diagnoses.length > 0 ? (
                          enc.diagnoses.map((d, dIdx) => (
                            <span
                              key={dIdx}
                              className="inline-block px-2.5 py-1 rounded bg-rose-50 text-rose-700 border border-rose-200 font-semibold text-xs"
                            >
                              ⚙ {d.name} {d.code ? `(${d.code})` : ""}
                            </span>
                          ))
                        ) : (
                          <span className="text-slate-400 italic">No specific diagnosis recorded</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Prescriptions & Investigations */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
                    <div>
                      <span className="font-bold text-slate-400 uppercase text-[10px] tracking-wider block">
                        PRESCRIPTION
                      </span>
                      <div className="space-y-1 mt-1 text-slate-800">
                        {enc.prescriptions && enc.prescriptions.length > 0 ? (
                          enc.prescriptions.map((p, pIdx) => (
                            <p key={pIdx} className="flex items-center gap-1.5 text-[#006699] font-medium">
                              <Pill className="w-3.5 h-3.5" />
                              {p.name} {p.dosage ? `(${p.dosage})` : ""} {p.frequency ? `— ${p.frequency}` : ""}
                            </p>
                          ))
                        ) : (
                          <p className="text-slate-400 italic">No active prescriptions for this visit</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <span className="font-bold text-slate-400 uppercase text-[10px] tracking-wider block">
                        INVESTIGATIONS
                      </span>
                      <p className="text-slate-800 mt-1">
                        {enc.investigations && enc.investigations.length > 0
                          ? enc.investigations.map((i) => i.name).join(", ")
                          : "No investigations recorded"}
                      </p>
                    </div>
                  </div>

                  {/* Reports & Documents */}
                  {enc.reports && enc.reports.length > 0 && (
                    <>
                      <hr className="border-slate-100" />
                      <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-[#006699]">
                        {enc.reports.map((rep, rIdx) => (
                          <button
                            key={rIdx}
                            className="flex items-center gap-1.5 hover:underline cursor-pointer"
                          >
                            <FileText className="w-4 h-4 text-rose-500" />
                            <span>View {rep.file_name || rep.title}</span>
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PatientShell>
  );
}
