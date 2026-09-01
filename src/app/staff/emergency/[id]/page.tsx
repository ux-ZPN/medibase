"use client";

import React, { use, useState, useEffect } from "react";
import Link from "next/link";
import { StaffShell } from "@/components/layout/staff-shell";
import {
  AlertTriangle,
  Pill,
  Activity,
  Stethoscope,
  FlaskConical,
  ChevronRight,
  Shield,
  History,
  RefreshCw,
} from "lucide-react";

interface EmergencyData {
  authorized: boolean;
  patient?: {
    id: string;
    medibase_id: string;
    name: string;
    age: number;
    gender: string;
    blood_group: string;
    allergies: Array<{ allergen: string; severity?: string }>;
    active_conditions: Array<{ condition_name: string; diagnosed_date?: string }>;
    current_medications: Array<{ medicine_name: string; dosage?: string; frequency?: string }>;
    recent_encounters: Array<{
      date: string;
      hospital_name: string;
      doctor_name: string;
      department: string;
      chief_complaint: string;
      diagnoses: Array<{ name: string }>;
    }>;
    recent_vitals?: {
      bp?: string;
      heart_rate?: number;
      glucose_mg_dl?: number;
    };
  };
}

export default function EmergencyCriticalInfoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const patientId = (resolvedParams.id || "MB-100003").toUpperCase();

  const [data, setData] = useState<EmergencyData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEmergencyData() {
      setLoading(true);
      try {
        const res = await fetch(`/api/staff/patient/${patientId}/clinical-access`);
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Emergency data load error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadEmergencyData();
  }, [patientId]);

  const patient = data?.patient;
  const allergies = patient?.allergies || [{ allergen: "Penicillin (Severe)" }];
  const conditions = patient?.active_conditions || [
    { condition_name: "Type 2 Diabetes" },
    { condition_name: "Essential Hypertension" },
  ];
  const medications = patient?.current_medications || [
    { medicine_name: "Metformin 500mg" },
    { medicine_name: "Amlodipine 5mg" },
  ];

  return (
    <StaffShell activeNav="emergency">
      <div className="space-y-6 max-w-5xl mx-auto">
        {/* Top Active Emergency Banner */}
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-5 flex items-start gap-4 shadow-sm">
          <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <h2 className="text-base font-bold text-rose-800 uppercase tracking-wider">
              EMERGENCY ACCESS ACTIVE
            </h2>
            <p className="text-xs text-rose-700 mt-0.5 font-medium">
              Accessing restricted medical records under emergency override pathway. Time remaining: 58 minutes.
            </p>
          </div>
        </div>

        {/* Patient & Access Metadata Header Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              {patient?.name || "Rahul Sharma"}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              MediBase ID: <span className="font-semibold text-slate-700">{patientId}</span> • Age: {patient?.age || 32} • Blood: {patient?.blood_group || "B+"}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-xs text-slate-500">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Accessing Doctor</span>
              <span className="font-semibold text-slate-800">Dr. Rahul Sharma</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Facility</span>
              <span className="font-semibold text-slate-800">City General Hospital</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Access Mode</span>
              <span className="font-semibold text-rose-700">Emergency Override</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-rose-600 block">Status</span>
              <span className="font-bold text-rose-600">Active (Audited)</span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500 space-y-2 bg-white rounded-xl border border-slate-200">
            <RefreshCw className="w-6 h-6 animate-spin text-[#006699] mx-auto mb-2" />
            <span>Loading critical patient emergency data...</span>
          </div>
        ) : (
          <>
            {/* Critical Information Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <span className="text-rose-600">!</span> Critical Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Allergies (Red Highlight) */}
                <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-5 shadow-sm space-y-2">
                  <div className="flex items-center gap-2 text-rose-700 text-xs font-bold uppercase tracking-wider">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Allergies</span>
                  </div>
                  <div className="space-y-1">
                    {allergies.map((a, idx) => (
                      <p key={idx} className="text-base font-bold text-rose-900">
                        {typeof a === "string" ? a : a.allergen}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Active Conditions */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-2">
                  <div className="flex items-center gap-2 text-sky-700 text-xs font-bold uppercase tracking-wider">
                    <Activity className="w-4 h-4" />
                    <span>Active Conditions</span>
                  </div>
                  <div className="text-sm font-semibold text-slate-800 space-y-0.5">
                    {conditions.map((c, idx) => (
                      <p key={idx}>{typeof c === "string" ? c : c.condition_name}</p>
                    ))}
                  </div>
                </div>

                {/* Current Medications */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-2">
                  <div className="flex items-center gap-2 text-[#006699] text-xs font-bold uppercase tracking-wider">
                    <Pill className="w-4 h-4" />
                    <span>Current Medications</span>
                  </div>
                  <div className="text-sm font-semibold text-slate-800 space-y-0.5">
                    {medications.map((m, idx) => (
                      <p key={idx}>{typeof m === "string" ? m : `${m.medicine_name} ${m.dosage || ""}`}</p>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Recent Diagnosis */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-1">
                  <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider">
                    <Stethoscope className="w-4 h-4 text-slate-700" />
                    <span>Recent Diagnosis</span>
                  </div>
                  <p className="text-sm font-medium text-slate-800 pt-1">
                    {patient?.recent_encounters?.[0]?.diagnoses?.[0]?.name || "Essential Hypertension, Type 2 Diabetes"}
                  </p>
                </div>

                {/* Most Recent Investigation */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-1">
                  <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider">
                    <FlaskConical className="w-4 h-4 text-slate-700" />
                    <span>Most Recent Investigation</span>
                  </div>
                  <p className="text-sm font-medium text-slate-800 pt-1">
                    Blood Glucose: {patient?.recent_vitals?.glucose_mg_dl || 145} mg/dL • BP: {patient?.recent_vitals?.bp || "128/82 mmHg"}
                  </p>
                </div>
              </div>
            </div>

            {/* Recent Clinical History List */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900">Recent Clinical Encounters</h2>

              <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-100 shadow-sm overflow-hidden text-xs">
                {patient?.recent_encounters?.slice(0, 3).map((enc, idx) => (
                  <Link
                    key={idx}
                    href={`/staff/patient/${patientId}/timeline`}
                    className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
                  >
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">
                        {enc.department || "Clinical Encounter"}
                      </h3>
                      <p className="text-slate-500 mt-0.5">
                        {enc.date} • {enc.doctor_name}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </Link>
                )) || (
                  <div className="p-4 text-slate-500 text-xs">No prior encounters recorded.</div>
                )}
              </div>

              <div className="flex justify-start pt-2">
                <Link
                  href={`/staff/patient/${patientId}/timeline`}
                  className="px-4 py-2 border border-[#006699] text-[#006699] hover:bg-sky-50 font-semibold text-xs rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <History className="w-4 h-4" />
                  <span>View Full Authorized Timeline</span>
                </Link>
              </div>
            </div>
          </>
        )}

        {/* Audit footer note */}
        <div className="pt-4 border-t border-slate-200 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
          <Shield className="w-3.5 h-3.5 text-slate-400" />
          <span>This emergency access event is being immutably recorded in the compliance audit log.</span>
        </div>
      </div>
    </StaffShell>
  );
}
