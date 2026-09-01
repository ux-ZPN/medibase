import Link from "next/link";
import {
  ArrowLeft,
  Upload,
  FileText,
  Info,
} from "lucide-react";
import { SAMPLE_PATIENT } from "@/lib/mock-data";

export default async function UploadMedicalReportPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const patientId = params.id || SAMPLE_PATIENT.medibaseId;

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-teal-500 selection:text-white">
      {/* Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md px-6 h-16 flex items-center justify-between sticky top-0 z-50">
        <Link
          href={`/staff/patient/${patientId}/overview`}
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Patient Overview</span>
        </Link>
        <div className="font-bold text-sm text-slate-200">
          Upload Diagnostic Report
        </div>
        <div className="w-20" />
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-3xl mx-auto px-4 py-8 w-full space-y-8">
        {/* Title */}
        <div className="border-b border-slate-800/80 pb-6">
          <div className="flex items-center gap-2 text-xs font-semibold px-2.5 py-1 rounded-md bg-teal-950 text-teal-400 border border-teal-800 w-fit mb-2">
            <Upload className="w-3.5 h-3.5" />
            <span>Supabase Storage Integration</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Upload Medical Report</h1>
          <p className="text-sm text-slate-400 mt-1">
            Attach diagnostic imaging, laboratory tests, or discharge summaries to {SAMPLE_PATIENT.name}&apos;s ({patientId}) longitudinal record.
          </p>
        </div>

        {/* Upload Form */}
        <form action={`/staff/patient/${patientId}/upload-success`} className="space-y-6">
          {/* Patient Context Block */}
          <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/60 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-slate-500 font-medium">Patient</span>
              <div className="font-semibold text-slate-200 mt-0.5">{SAMPLE_PATIENT.name}</div>
            </div>
            <div>
              <span className="text-slate-500 font-medium">Attending Provider</span>
              <div className="font-semibold text-slate-200 mt-0.5">Dr. Sarah Jenkins, MD</div>
            </div>
            <div>
              <span className="text-slate-500 font-medium">Hospital Facility</span>
              <div className="font-semibold text-teal-400 mt-0.5">Apollo Specialty Hospital</div>
            </div>
          </div>

          {/* Report Title */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Report Title / Document Name
            </label>
            <input
              type="text"
              name="reportTitle"
              defaultValue="Transthoracic Echocardiogram (TTE) & Doppler"
              placeholder="e.g. 12-Lead ECG, Complete Blood Count, Chest X-Ray"
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-teal-500 transition-colors"
            />
          </div>

          {/* Report Category */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Report Classification Type
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { id: "lab", label: "Lab Report" },
                { id: "imaging", label: "Imaging / X-Ray" },
                { id: "discharge", label: "Discharge Summary" },
                { id: "other", label: "Prescription / Other" },
              ].map((cat, idx) => (
                <label
                  key={cat.id}
                  className="flex items-center justify-center p-3 rounded-xl border border-slate-800 bg-slate-900/50 hover:border-teal-500 cursor-pointer text-xs font-semibold text-slate-200 transition-colors has-checked:border-teal-500 has-checked:bg-teal-950/40 has-checked:text-teal-300"
                >
                  <input
                    type="radio"
                    name="reportType"
                    value={cat.label}
                    defaultChecked={idx === 1}
                    className="sr-only"
                  />
                  <span>{cat.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Clinical Findings Summary */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Diagnostic Summary & Key Findings
            </label>
            <textarea
              name="findings"
              rows={3}
              defaultValue="Normal left ventricular size and systolic function. LVEF estimated at 62%. No significant valvular regurgitation or pericardial effusion."
              placeholder="Enter critical findings or test values..."
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-teal-500 transition-colors resize-none"
            />
          </div>

          {/* Drag & Drop File Upload Box */}
          <div className="p-6 rounded-2xl border-2 border-dashed border-teal-500/40 bg-slate-900/40 space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-teal-950 border border-teal-800 flex items-center justify-center text-teal-400 mx-auto">
              <Upload className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-sm text-slate-200">
                Select Medical File to Upload
              </h4>
              <p className="text-xs text-slate-400">
                Supports DICOM, PDF, PNG, JPG files up to 50MB
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 max-w-sm mx-auto flex items-center justify-between text-xs text-slate-300">
              <div className="flex items-center gap-2 truncate">
                <FileText className="w-4 h-4 text-sky-400 shrink-0" />
                <span className="truncate">echocardiogram_tte_2026.pdf</span>
              </div>
              <span className="text-[11px] text-slate-500 shrink-0 font-mono">3.4 MB</span>
            </div>
          </div>

          {/* Security & Audit Notice */}
          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 flex items-start gap-3 text-xs text-slate-400">
            <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <div>
              Files are encrypted at rest and stored in private Supabase Storage buckets. Access is governed by PostgreSQL Row Level Security policies and recorded in the patient audit trail.
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <Link
              href={`/staff/patient/${patientId}/overview`}
              className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-800 hover:bg-slate-900 text-slate-300 text-xs font-semibold text-center transition-colors"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-teal-500/20"
            >
              <Upload className="w-4 h-4" />
              <span>Upload & Append to Record</span>
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
