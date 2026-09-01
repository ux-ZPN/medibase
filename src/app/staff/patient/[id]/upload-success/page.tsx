import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  History,
} from "lucide-react";
import { SAMPLE_PATIENT } from "@/lib/mock-data";

export default async function UploadSuccessPage(props: {
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
          Upload Confirmation
        </div>
        <div className="w-20" />
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 max-w-2xl mx-auto w-full">
        <div className="w-full rounded-3xl border border-slate-800 bg-slate-900/80 backdrop-blur-md p-7 sm:p-9 shadow-2xl space-y-8 text-center">
          {/* Success Icon */}
          <div className="w-16 h-16 rounded-3xl bg-emerald-950 border-2 border-emerald-500/60 flex items-center justify-center text-emerald-400 mx-auto shadow-xl shadow-emerald-500/20">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Diagnostic Report Uploaded Successfully
            </h1>
            <p className="text-sm text-slate-400 max-w-md mx-auto">
              The file has been encrypted and appended to {SAMPLE_PATIENT.name}&apos;s ({patientId}) longitudinal medical record.
            </p>
          </div>

          {/* Upload Metadata Card */}
          <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 text-left space-y-3 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-slate-400 font-medium">Document Title</span>
              <span className="font-bold text-white">Transthoracic Echocardiogram (TTE) & Doppler</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-slate-500">Storage Object Path</span>
                <div className="font-mono text-sky-400 mt-0.5 truncate">
                  reports/MB-89412/echo_tte_2026.pdf
                </div>
              </div>
              <div>
                <span className="text-slate-500">File Size & Format</span>
                <div className="font-semibold text-slate-200 mt-0.5">3.4 MB • Application/PDF</div>
              </div>
              <div>
                <span className="text-slate-500">Uploading Facility</span>
                <div className="font-semibold text-slate-200 mt-0.5">Apollo Specialty Hospital</div>
              </div>
              <div>
                <span className="text-slate-500">Audit Reference ID</span>
                <div className="font-mono text-slate-400 mt-0.5">aud-20260901-7912</div>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <Link
              href={`/staff/patient/${patientId}/timeline`}
              className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-teal-500/20"
            >
              <History className="w-4 h-4" />
              <span>View in Longitudinal Timeline</span>
            </Link>

            <Link
              href={`/staff/patient/${patientId}/overview`}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-slate-800 hover:bg-slate-900 text-slate-300 text-sm font-semibold transition-colors"
            >
              Return to Overview
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
