import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Building2,
  User,
  FileText,
  Download,
  Lock,
  Pill,
} from "lucide-react";
import { SAMPLE_PATIENT, SAMPLE_VISITS } from "@/lib/mock-data";

export default function PatientMedicalTimelinePage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-sky-500 selection:text-white">
      {/* Top Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md px-6 h-16 flex items-center justify-between sticky top-0 z-50">
        <Link
          href="/patient/dashboard"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300">
          <Lock className="w-3.5 h-3.5 text-sky-400" />
          <span>Read-Only Longitudinal Record</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto px-4 py-8 w-full space-y-8">
        {/* Title Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-white">Longitudinal Medical Timeline</h1>
            <p className="text-sm text-slate-400 mt-1">
              Complete chronological medical consultations, diagnoses, and lab tests for {SAMPLE_PATIENT.name} ({SAMPLE_PATIENT.medibaseId}).
            </p>
          </div>
        </div>

        {/* Timeline Records List */}
        <div className="space-y-6 relative before:absolute before:inset-0 before:left-4 sm:before:left-8 before:w-0.5 before:bg-slate-800">
          {SAMPLE_VISITS.map((visit) => (
            <div key={visit.id} className="relative pl-10 sm:pl-16 space-y-3">
              {/* Timeline Bullet */}
              <div className="absolute left-2.5 sm:left-6.5 top-5 -translate-x-1/2 w-4 h-4 rounded-full border-2 border-sky-400 bg-slate-950 shadow-md shadow-sky-500/30" />

              {/* Visit Card */}
              <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm space-y-5">
                {/* Card Top Metadata */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800/80">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-sky-950 text-sky-400 border border-sky-800">
                        {visit.visitType} Encounter
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                        <Calendar className="w-3.5 h-3.5" />
                        {visit.date}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-slate-400" />
                      {visit.hospital}
                    </h3>
                  </div>

                  <div className="text-left sm:text-right">
                    <div className="text-xs font-semibold text-slate-200 flex items-center sm:justify-end gap-1.5">
                      <User className="w-3.5 h-3.5 text-sky-400" />
                      {visit.doctorName}
                    </div>
                    <div className="text-[11px] text-slate-400">{visit.doctorRole} • {visit.department}</div>
                  </div>
                </div>

                {/* Chief Complaint & Diagnosis */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Chief Complaint</span>
                    <p className="text-xs text-slate-200">{visit.chiefComplaint}</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                    <span className="text-[11px] font-semibold text-sky-400 uppercase tracking-wider">Clinical Diagnosis</span>
                    <p className="text-xs text-slate-200 font-semibold">{visit.diagnosis}</p>
                  </div>
                </div>

                {/* Clinical Notes */}
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Physician Clinical Notes</span>
                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/30 p-3 rounded-xl border border-slate-800/50">
                    {visit.clinicalNotes}
                  </p>
                </div>

                {/* Prescriptions */}
                {visit.prescriptions.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                      <Pill className="w-3.5 h-3.5" />
                      <span>Prescriptions & Regimen</span>
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {visit.prescriptions.map((p, pIdx) => (
                        <div key={pIdx} className="px-3 py-1 rounded-lg bg-emerald-950/40 border border-emerald-800/50 text-xs text-emerald-300 font-medium">
                          {p}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Diagnostic Reports Attachments */}
                {visit.reports.length > 0 && (
                  <div className="space-y-2 pt-3 border-t border-slate-800/80">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Attached Diagnostic Reports ({visit.reports.length})
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {visit.reports.map((rep) => (
                        <div
                          key={rep.id}
                          className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                        >
                          <div className="flex items-center gap-2.5 overflow-hidden">
                            <div className="w-8 h-8 rounded-lg bg-sky-950 border border-sky-800 flex items-center justify-center text-sky-400 shrink-0">
                              <FileText className="w-4 h-4" />
                            </div>
                            <div className="truncate">
                              <div className="font-semibold text-slate-200 truncate">{rep.title}</div>
                              <div className="text-[10px] text-slate-400">{rep.fileName} • {rep.fileSize}</div>
                            </div>
                          </div>
                          <span className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
                            <Download className="w-4 h-4" />
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
