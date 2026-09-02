"use client";

import React, { use, useState, useEffect, useRef } from "react";
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
  Pill,
  Plus,
  Trash2,
  UploadCloud,
  FileText,
  X,
  CheckCircle2,
  Activity,
  Sparkles,
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

interface MedicationItem {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

interface AttachedFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  category: "Prescription" | "Lab Report" | "Radiology / Scan" | "Discharge Summary";
}

export default function RecordNewVisitPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const patientId = (resolvedParams.id || "MB-102394").toUpperCase();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [patientData, setPatientData] = useState<PatientContext | null>(null);
  const [loadingContext, setLoadingContext] = useState(true);

  // Clinical Details
  const [encounterDate, setEncounterDate] = useState(() => {
    return new Date().toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  });
  const [encounterTime, setEncounterTime] = useState(() => {
    return new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  });

  const [chiefComplaint, setChiefComplaint] = useState(
    "Routine check-up and medication review. Patient reports slight dizziness in morning."
  );
  const [diagnosis, setDiagnosis] = useState("Essential Hypertension (I10)");
  const [clinicalNotes, setClinicalNotes] = useState(
    "BP 138/88 mmHg. Pulse 72 bpm regular. Cardiovascular and respiratory exams unremarkable. Adjusted medication schedule."
  );
  const [visitType, setVisitType] = useState("Outpatient Follow-up");
  const [department, setDepartment] = useState("Cardiology / Outpatient Clinic");

  // Vitals
  const [systolic, setSystolic] = useState("138");
  const [diastolic, setDiastolic] = useState("88");
  const [heartRate, setHeartRate] = useState("72");
  const [spo2, setSpo2] = useState("98");

  // 1. Structured Medications List
  const [medications, setMedications] = useState<MedicationItem[]>([
    {
      id: "med-1",
      name: "Telmisartan",
      dosage: "40mg",
      frequency: "Once Daily (Morning)",
      duration: "30 days",
      instructions: "Take before breakfast",
    },
    {
      id: "med-2",
      name: "Amlodipine",
      dosage: "5mg",
      frequency: "Once Daily (Night)",
      duration: "30 days",
      instructions: "Take after dinner",
    },
  ]);

  // 2. Attached Files / Prescriptions / Reports
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
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

  // Medication handlers
  const handleAddMedication = () => {
    const newMed: MedicationItem = {
      id: `med-${Date.now()}`,
      name: "",
      dosage: "",
      frequency: "Twice Daily (1-0-1)",
      duration: "5 days",
      instructions: "Take after meals",
    };
    setMedications([...medications, newMed]);
  };

  const handleUpdateMedication = (id: string, field: keyof MedicationItem, value: string) => {
    setMedications((prev) =>
      prev.map((med) => (med.id === id ? { ...med, [field]: value } : med))
    );
  };

  const handleRemoveMedication = (id: string) => {
    setMedications((prev) => prev.filter((m) => m.id !== id));
  };

  // File upload handlers
  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;
    const newItems: AttachedFile[] = [];
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      if (f.size > 25 * 1024 * 1024) {
        setErrorMessage(`File "${f.name}" exceeds maximum allowed 25MB limit.`);
        continue;
      }
      newItems.push({
        id: `file-${Date.now()}-${i}`,
        file: f,
        name: f.name,
        size: f.size,
        type: f.type,
        category: f.name.toLowerCase().includes("rx") || f.name.toLowerCase().includes("presc")
          ? "Prescription"
          : "Lab Report",
      });
    }
    setAttachedFiles((prev) => [...prev, ...newItems]);
    setErrorMessage(null);
  };

  const handleRemoveFile = (id: string) => {
    setAttachedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chiefComplaint.trim()) {
      setErrorMessage("Please provide a chief complaint.");
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);

    try {
      // Filter valid medications
      const validPrescriptions = medications
        .filter((m) => m.name.trim().length > 0)
        .map((m) => ({
          name: m.name.trim(),
          dosage: m.dosage.trim() || "Standard",
          frequency: m.frequency.trim(),
          duration: m.duration.trim(),
          instructions: m.instructions.trim(),
        }));

      // Attached report metadata
      const reportsList = attachedFiles.map((f) => ({
        title: `${f.category}: ${f.name}`,
        file_name: f.name,
        category: f.category,
        file_url: `/documents/${patientId}/${f.name}`,
      }));

      const res = await fetch(`/api/staff/patient/${patientId}/new-visit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          encounterDate: encounterDate.trim(),
          encounterTime: encounterTime.trim(),
          chiefComplaint: chiefComplaint.trim(),
          diagnosis: diagnosis.trim(),
          clinicalNotes: clinicalNotes.trim(),
          visitType: visitType,
          department: department,
          vitals: {
            systolic: parseInt(systolic, 10) || 120,
            diastolic: parseInt(diastolic, 10) || 80,
            heart_rate: parseInt(heartRate, 10) || 72,
            spo2: parseInt(spo2, 10) || 98,
          },
          prescriptions: validPrescriptions,
          reports: reportsList,
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
      <div className="space-y-6 max-w-5xl mx-auto pb-10">
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
              Record New Clinical Visit
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Append longitudinal clinical encounter with medications, vital signs, and prescription files.
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

        {/* UNAUTHORIZED / ACCESS RESTRICTED STATE */}
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
                href={`/staff/patient/${patientId}/timeline`}
                className="w-full sm:w-auto px-6 py-3 bg-[#006699] hover:bg-[#005580] text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 shadow"
              >
                <Send className="w-4 h-4" />
                <span>View Patient Timeline</span>
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

        {/* AUTHORIZED RECORD VISIT FORM */}
        {!loadingContext && isAuthorized && (
          <form onSubmit={handleSave} className="space-y-6">
            {/* Patient Context Card */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-bold text-slate-900">{patientName}</h2>
                  <span className="text-xs font-mono font-bold text-[#006699] bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                    {patientId}
                  </span>
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

            {/* Error Banner */}
            {errorMessage && (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* SECTION 1: CLINICAL DIAGNOSIS & NOTES */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <div className="bg-[#111827] text-white px-6 py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-sky-400" />
                  1. Clinical Consultation & Vitals
                </span>
                <span className="text-[11px] font-normal text-slate-300">Required</span>
              </div>

              <div className="p-6 sm:p-8 space-y-5">
                {/* Encounter Date & Time Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-sky-50/70 border border-sky-200 rounded-xl">
                  <div>
                    <label className="block text-xs font-bold text-[#006699] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      Encounter Date <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={encounterDate}
                      onChange={(e) => setEncounterDate(e.target.value)}
                      placeholder="e.g. 2 Sep 2026"
                      required
                      className="w-full px-3.5 py-2 bg-white border border-sky-300 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#006699]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#006699] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      Encounter Time / Treatment Time <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={encounterTime}
                      onChange={(e) => setEncounterTime(e.target.value)}
                      placeholder="e.g. 10:30 AM"
                      required
                      className="w-full px-3.5 py-2 bg-white border border-sky-300 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#006699]"
                    />
                  </div>
                </div>

                {/* Vitals Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Systolic BP (mmHg)
                    </label>
                    <input
                      type="number"
                      value={systolic}
                      onChange={(e) => setSystolic(e.target.value)}
                      placeholder="120"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#006699]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Diastolic BP (mmHg)
                    </label>
                    <input
                      type="number"
                      value={diastolic}
                      onChange={(e) => setDiastolic(e.target.value)}
                      placeholder="80"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#006699]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Heart Rate (BPM)
                    </label>
                    <input
                      type="number"
                      value={heartRate}
                      onChange={(e) => setHeartRate(e.target.value)}
                      placeholder="72"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#006699]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Oxygen SpO2 (%)
                    </label>
                    <input
                      type="number"
                      value={spo2}
                      onChange={(e) => setSpo2(e.target.value)}
                      placeholder="98"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#006699]"
                    />
                  </div>
                </div>

                {/* Chief Complaint */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Chief Complaint <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={chiefComplaint}
                    onChange={(e) => setChiefComplaint(e.target.value)}
                    placeholder="Describe the primary reason for the visit..."
                    required
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#006699]"
                  />
                </div>

                {/* Diagnosis & Visit Type Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Clinical Diagnosis / ICD-10
                    </label>
                    <div className="relative">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={diagnosis}
                        onChange={(e) => setDiagnosis(e.target.value)}
                        placeholder="e.g. Essential Hypertension (I10)"
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#006699]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Visit Classification
                    </label>
                    <select
                      value={visitType}
                      onChange={(e) => setVisitType(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#006699]"
                    >
                      <option value="Outpatient Follow-up">Outpatient Follow-up</option>
                      <option value="Emergency Consultation">Emergency Consultation</option>
                      <option value="Routine General Checkup">Routine General Checkup</option>
                      <option value="Specialist Referral">Specialist Referral</option>
                    </select>
                  </div>
                </div>

                {/* Clinical Notes */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Clinical Examination Notes & Observations
                  </label>
                  <textarea
                    rows={3}
                    value={clinicalNotes}
                    onChange={(e) => setClinicalNotes(e.target.value)}
                    placeholder="Detailed clinical evaluation and treatment plan..."
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#006699]"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 2: STRUCTURED MEDICATIONS DATA ENTRY */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <div className="bg-slate-900 text-white px-6 py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Pill className="w-4 h-4 text-emerald-400" />
                  2. Prescribed Medications
                </span>
                <span className="text-[11px] font-normal text-slate-300">
                  {medications.length} {medications.length === 1 ? "Medicine" : "Medicines"} Prescribed
                </span>
              </div>

              <div className="p-6 sm:p-8 space-y-4">
                <div className="space-y-3">
                  {medications.map((med, idx) => (
                    <div
                      key={med.id}
                      className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 transition-all hover:border-slate-300"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#006699] flex items-center gap-1.5 uppercase tracking-wider">
                          <span className="w-5 h-5 rounded-full bg-sky-100 text-[#006699] flex items-center justify-center text-[10px] font-bold">
                            {idx + 1}
                          </span>
                          Medication Entry
                        </span>
                        {medications.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveMedication(med.id)}
                            className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                            title="Remove medication"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                        {/* Medicine Name */}
                        <div className="sm:col-span-4">
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            Drug / Medicine Name *
                          </label>
                          <input
                            type="text"
                            value={med.name}
                            onChange={(e) => handleUpdateMedication(med.id, "name", e.target.value)}
                            placeholder="e.g. Telmisartan, Amoxicillin"
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#006699]"
                          />
                        </div>

                        {/* Dosage */}
                        <div className="sm:col-span-2">
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            Dosage
                          </label>
                          <input
                            type="text"
                            value={med.dosage}
                            onChange={(e) => handleUpdateMedication(med.id, "dosage", e.target.value)}
                            placeholder="e.g. 500mg / 10ml"
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#006699]"
                          />
                        </div>

                        {/* Frequency */}
                        <div className="sm:col-span-3">
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            Frequency
                          </label>
                          <select
                            value={med.frequency}
                            onChange={(e) => handleUpdateMedication(med.id, "frequency", e.target.value)}
                            className="w-full px-2.5 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#006699]"
                          >
                            <option value="Once Daily (Morning)">Once Daily (Morning - 1-0-0)</option>
                            <option value="Once Daily (Night)">Once Daily (Night - 0-0-1)</option>
                            <option value="Twice Daily (1-0-1)">Twice Daily (1-0-1)</option>
                            <option value="Thrice Daily (1-1-1)">Thrice Daily (1-1-1)</option>
                            <option value="As Needed (SOS)">As Needed (SOS)</option>
                          </select>
                        </div>

                        {/* Duration */}
                        <div className="sm:col-span-3">
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            Duration
                          </label>
                          <input
                            type="text"
                            value={med.duration}
                            onChange={(e) => handleUpdateMedication(med.id, "duration", e.target.value)}
                            placeholder="e.g. 5 days / 1 month"
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#006699]"
                          />
                        </div>
                      </div>

                      {/* Instructions */}
                      <div>
                        <input
                          type="text"
                          value={med.instructions}
                          onChange={(e) => handleUpdateMedication(med.id, "instructions", e.target.value)}
                          placeholder="Instructions (e.g., Take after meals with plenty of water)"
                          className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-md text-[11px] text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#006699]"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleAddMedication}
                  className="px-4 py-2 bg-sky-50 hover:bg-sky-100 text-[#006699] font-bold text-xs rounded-lg transition-colors border border-sky-200 flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Another Medication</span>
                </button>
              </div>
            </div>

            {/* SECTION 3: PRESCRIPTION & REPORT FILE UPLOAD */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <div className="bg-slate-900 text-white px-6 py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-400" />
                  3. Prescription &amp; Clinical Document Upload
                </span>
                <span className="text-[11px] font-normal text-slate-300">
                  JPG, PNG, PDF (Up to 25MB)
                </span>
              </div>

              <div className="p-6 sm:p-8 space-y-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg"
                  onChange={(e) => handleFileSelect(e.target.files)}
                  className="hidden"
                />

                {/* Dropzone */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    handleFileSelect(e.dataTransfer.files);
                  }}
                  className="border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center text-center bg-slate-50/60 hover:bg-slate-50 hover:border-slate-400 transition-colors cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-full bg-sky-100 text-[#006699] flex items-center justify-center mb-3">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <h3 className="text-xs font-bold text-slate-900 mb-1">
                    Click to select or drag &amp; drop prescription scans, lab PDFs, or imaging files
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Supports handwritten prescriptions (JPG, PNG) and diagnostic PDF reports
                  </p>
                </div>

                {/* Uploaded File List */}
                {attachedFiles.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                      Attached Files ({attachedFiles.length}):
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {attachedFiles.map((fileItem) => (
                        <div
                          key={fileItem.id}
                          className="p-3 bg-white border border-slate-200 rounded-lg flex items-center justify-between gap-3 shadow-xs"
                        >
                          <div className="flex items-center gap-2.5 overflow-hidden">
                            <FileText className="w-4 h-4 text-[#006699] shrink-0" />
                            <div className="overflow-hidden text-left">
                              <p className="text-xs font-semibold text-slate-900 truncate">
                                {fileItem.name}
                              </p>
                              <span className="text-[10px] text-slate-400">
                                {(fileItem.size / 1024).toFixed(0)} KB • {fileItem.category}
                              </span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveFile(fileItem.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                            title="Remove file"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Actions Bar */}
            <div className="bg-white border border-slate-200 rounded-xl px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                <span>
                  This visit and attachments will sync directly to patient&apos;s longitudinal timeline.
                </span>
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
                  className="px-6 py-2.5 bg-[#0F172A] hover:bg-slate-800 disabled:opacity-50 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-2 shadow cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? "Saving Clinical Visit..." : "Save Visit & Synchronize Timeline"}</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </StaffShell>
  );
}

