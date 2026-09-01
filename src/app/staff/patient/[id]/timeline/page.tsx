import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Building2,
  User,
  FileText,
  Download,
  FilePlus,
  Pill,
  CheckCircle2,
} from "lucide-react";
import { SAMPLE_PATIENT, SAMPLE_VISITS } from "@/lib/mock-data";

export default async function PatientMedicalTimelineStaffPage(props: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const patientId = params.id || SAMPLE_PATIENT.medibaseId;
  const isSaved = searchParams?.saved === "true";

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-teal-500 selection:text-white">
      {/* Top Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md px-6 h-16 flex items-center justify-between sticky top-0 z-50">
        <Link
          href={`/staff/patient/${patientId}/overview`}
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Patient Overview</span>
        </Link>
        <div className="font-bold text-sm text-slate-200">
          Authorized Longitudinal Record
        </div>
        <div className="w-20" />
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto px-4 py-8 w-full space-y-8">
        {/* Saved feedback notice */}
        {isSaved && (
          <div className="p-4 rounded-xl border border-emerald-500/40 bg-emerald-950/30 flex items-center gap-3 text-emerald-300 text-sm font-medium">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>New clinical encounter has been appended to {SAMPLE_PATIENT.name}&apos;s longitudinal record and logged to the audit trail.</span>
          </div>
        )}

        {/* Title & Top Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-white">Clinical Medical Timeline</h1>
            <p className="text-sm text-slate-400 mt-1">
              Cross-hospital longitudinal encounters for {SAMPLE_PATIENT.name} ({patientId}).
            </p>
          </div>

          <Link
            href={`/staff/patient/${patientId}/new-visit`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition-colors shadow-lg shadow-teal-500/20 shrink-0"
          >
            <FilePlus className="w-4 h-4" />
            <span>Record New Visit</span>
          </Link>
        </div>

        {/* Timeline Events List */}
        <div className="space-y-6 relative before:absolute before:inset-0 before:left-4 sm:before:left-8 before:w-0.5 before:bg-slate-800">
          {SAMPLE_VISITS.map((visit) => (
            <div key={visit.id} className="relative pl-10 sm:pl-16 space-y-3">
              {/* Bullet */}
              <div className="absolute left-2.5 sm:left-6.5 top-5 -translate-x-1/2 w-4 h-4 rounded-full border-2 border-teal-400 bg-slate-950 shadow-md shadow-teal-500/30" />

              {/* Card */}
              <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm space-y-5">
                {/* Header info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800/80">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-teal-950 text-teal-400 border border-teal-800">
                        {visit.visitType} Consultation
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
                      <User className="w-3.5 h-3.5 text-teal-400" />
                      {visit.doctorName}
                    </div>
                    <div className="text-[11px] text-slate-400">{visit.doctorRole} • {visit.department}</div>
                  </div>
                </div>

                {/* Complaint & Diagnosis */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Chief Complaint</span>
                    <p className="text-slate-200">{visit.chiefComplaint}</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                    <span className="text-[11px] font-semibold text-teal-400 uppercase tracking-wider">Diagnosis</span>
                    <p className="text-slate-200 font-semibold">{visit.diagnosis}</p>
                  </div>
                </div>

                {/* Clinical Notes */}
                <div className="space-y-1 text-xs">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Clinical Examination Notes</span>
                  <p className="text-slate-300 bg-slate-950/40 p-3 rounded-xl border border-slate-800/60 leading-relaxed">
                    {visit.clinicalNotes}
                  </p>
                </div>

                {/* Prescriptions */}
                {visit.prescriptions.length > 0 && (
                  <div className="space-y-1.5 text-xs">
                    <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                      <Pill className="w-3.5 h-3.5" />
                      <span>Prescriptions</span>
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {visit.prescriptions.map((p, pIdx) => (
                        <div key={pIdx} className="px-3 py-1 rounded-lg bg-emerald-950/40 border border-emerald-800/50 text-emerald-300 font-medium">
                          {p}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Diagnostic Reports */}
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
                            <div className="w-8 h-8 rounded-lg bg-teal-950 border border-teal-800 flex items-center justify-center text-teal-400 shrink-0">
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
