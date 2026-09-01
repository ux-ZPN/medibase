import Link from "next/link";
import {
  ArrowLeft,
  FilePlus,
  Save,
  Paperclip,
  Pill,
  Info,
} from "lucide-react";
import { SAMPLE_PATIENT } from "@/lib/mock-data";

export default async function RecordNewVisitPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const patientId = params.id || SAMPLE_PATIENT.medibaseId;

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-teal-500 selection:text-white">
      {/* Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md px-6 h-16 flex items-center justify-between sticky top-0 z-50">
        <Link
          href={`/staff/patient/${patientId}/timeline`}
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Cancel & Return to Timeline</span>
        </Link>
        <div className="font-bold text-sm text-slate-200">
          Clinical Encounter Documentation
        </div>
        <div className="w-20" />
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-3xl mx-auto px-4 py-8 w-full space-y-8">
        {/* Title */}
        <div className="border-b border-slate-800/80 pb-6">
          <div className="flex items-center gap-2 text-xs font-semibold px-2.5 py-1 rounded-md bg-teal-950 text-teal-400 border border-teal-800 w-fit mb-2">
            <FilePlus className="w-3.5 h-3.5" />
            <span>Authorized Contribution Flow</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Record New Patient Visit</h1>
          <p className="text-sm text-slate-400 mt-1">
            Contributing to the longitudinal medical history of {SAMPLE_PATIENT.name} ({patientId}).
          </p>
        </div>

        {/* Clinical Documentation Form */}
        <form action={`/staff/patient/${patientId}/timeline?saved=true`} className="space-y-6">
          {/* Metadata Block */}
          <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/60 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-slate-500 font-medium">Attending Provider</span>
              <div className="font-semibold text-slate-200 mt-0.5">Dr. Sarah Jenkins, MD</div>
            </div>
            <div>
              <span className="text-slate-500 font-medium">Facility / Department</span>
              <div className="font-semibold text-slate-200 mt-0.5">Apollo Specialty • Cardiology</div>
            </div>
            <div>
              <span className="text-slate-500 font-medium">Date & Time</span>
              <div className="font-semibold text-teal-400 font-mono mt-0.5">2026-09-01 (Current)</div>
            </div>
          </div>

          {/* Visit Type */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Encounter / Visit Type
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {["Outpatient", "Inpatient", "Emergency", "Telehealth"].map((type, idx) => (
                <label
                  key={type}
                  className="flex items-center justify-center p-3 rounded-xl border border-slate-800 bg-slate-900/50 hover:border-teal-500 cursor-pointer text-xs font-semibold text-slate-200 transition-colors has-checked:border-teal-500 has-checked:bg-teal-950/40 has-checked:text-teal-300"
                >
                  <input
                    type="radio"
                    name="visitType"
                    value={type}
                    defaultChecked={idx === 0}
                    className="sr-only"
                  />
                  <span>{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Chief Complaint */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Chief Complaint / Reason for Visit
            </label>
            <input
              type="text"
              name="chiefComplaint"
              defaultValue="Scheduled 6-month cardiovascular checkup and prescription refill"
              placeholder="e.g. Chest tightness, hypertension follow-up"
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-teal-500 transition-colors"
            />
          </div>

          {/* Diagnosis */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Clinical Diagnosis
            </label>
            <input
              type="text"
              name="diagnosis"
              defaultValue="Essential Hypertension (Well-Controlled)"
              placeholder="e.g. Stage 1 Hypertension (ICD-10: I10)"
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-teal-500 transition-colors"
            />
          </div>

          {/* Clinical Examination Notes */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Clinical Findings & Progress Notes
            </label>
            <textarea
              name="clinicalNotes"
              rows={4}
              defaultValue="Vitals: BP 124/80 mmHg, HR 68 bpm regular, SpO2 99% on room air. Cardiovascular and chest exam unremarkable. Patient reports good tolerance of antihypertensive therapy."
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-teal-500 transition-colors resize-none"
            />
          </div>

          {/* Prescriptions */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Pill className="w-3.5 h-3.5 text-emerald-400" />
              <span>Prescribed Medications & Dosages</span>
            </label>
            <input
              type="text"
              name="prescriptions"
              defaultValue="Amlodipine Besylate 5mg OD (Refill x 90 days)"
              placeholder="e.g. Medication name, dosage, frequency"
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-teal-500 transition-colors"
            />
          </div>

          {/* Attach Diagnostic Report */}
          <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Paperclip className="w-3.5 h-3.5 text-sky-400" />
                <span>Attach Diagnostic File (Supabase Storage Reference)</span>
              </span>
              <span className="text-[11px] text-slate-500">PDF, JPG, DICOM (Max 25MB)</span>
            </div>
            <div className="p-4 rounded-xl border border-dashed border-slate-800 bg-slate-950/60 text-center text-xs text-slate-400">
              <span className="text-sky-400 font-semibold cursor-pointer">Click to upload diagnostic attachment</span> or drag files here
            </div>
          </div>

          {/* Conceptual Backend Process Notice */}
          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 flex items-start gap-3 text-xs text-slate-400">
            <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <div>
              Submitting this encounter commits the visit record to PostgreSQL, stores report metadata for Supabase Storage, logs an immutable audit event, and updates the patient&apos;s longitudinal timeline.
            </div>
          </div>

          {/* Submit Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <Link
              href={`/staff/patient/${patientId}/timeline`}
              className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-800 hover:bg-slate-900 text-slate-300 text-xs font-semibold text-center transition-colors"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-teal-500/20"
            >
              <Save className="w-4 h-4" />
              <span>Save & Append to Longitudinal Record</span>
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
