import Link from "next/link";
import {
  ArrowLeft,
  Sparkles,
  PlusCircle,
  MinusCircle,
  Activity,
  FileText,
  ArrowRight,
  TrendingUp,
  History,
} from "lucide-react";
import { SAMPLE_PATIENT } from "@/lib/mock-data";

export default async function WhatsChangedStaffPage(props: {
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
          Structured Clinical Changes
        </div>
        <div className="w-20" />
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto px-4 py-8 w-full space-y-8">
        {/* Title Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-950 text-teal-400 border border-teal-800 text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Structured Longitudinal Delta</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white">What&apos;s Changed?</h1>
            <p className="text-sm text-slate-400 mt-1">
              Structured clinical comparison between latest encounters and previous baseline records for {SAMPLE_PATIENT.name}.
            </p>
          </div>

          <Link
            href={`/staff/patient/${patientId}/timeline`}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-850 hover:border-slate-700 text-sky-400 text-xs font-bold transition-colors shrink-0"
          >
            <History className="w-4 h-4" />
            <span>View Full Timeline</span>
          </Link>
        </div>

        {/* Structured Change Cards */}
        <div className="space-y-6">
          {/* Section 1: Medication Delta */}
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-teal-400" />
              <span>1. Medication Changes (Last 12 Months)</span>
            </h2>

            <div className="space-y-3 text-xs">
              {/* New Medication */}
              <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-800/40 flex items-start gap-3">
                <PlusCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">Amlodipine Besylate 5mg OD</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-300 border border-emerald-800">
                      New / Ongoing
                    </span>
                  </div>
                  <p className="text-slate-300">
                    Initiated on 2025-11-10 by Dr. Marcus Sterling (City Central Hospital) for Stage 1 Hypertension. Continued and verified on 2026-08-18.
                  </p>
                </div>
              </div>

              {/* Discontinued / Concluded */}
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-3">
                <MinusCircle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-400 text-sm">Cetirizine 10mg OD</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 border border-slate-700">
                      14-Day Course Completed
                    </span>
                  </div>
                  <p className="text-slate-400">
                    Prescribed on 2026-03-04 by Dr. Robert Vance for seasonal pollen allergy. Course completed.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Clinical Baseline & Diagnoses */}
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-sky-400" />
              <span>2. Diagnostic & Vital Trend Updates</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
                <span className="text-slate-400 font-medium">Blood Pressure Trend</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-bold text-emerald-400">128/82 mmHg</span>
                  <span className="text-[11px] text-slate-400">(Previous: 145/95 mmHg)</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Improved with pharmacotherapy compliance.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
                <span className="text-slate-400 font-medium">Pulmonary Spirometry (FEV1/FVC)</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-bold text-slate-200">84% Predicted</span>
                  <span className="text-[11px] text-slate-400">(Stable baseline)</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Asthma well-controlled; no acute bronchospasm.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Recent Investigations & Reports */}
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-400" />
              <span>3. New Clinical Investigations & Uploads</span>
            </h2>

            <div className="space-y-2 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-200">Standard 12-Lead Resting ECG</div>
                  <div className="text-slate-400 text-[11px]">Normal sinus rhythm • Apollo Specialty Hospital (2026-08-18)</div>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-sky-950 text-sky-400 border border-sky-800">
                  Normal
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-200">Comprehensive Metabolic Panel (CMP)</div>
                  <div className="text-slate-400 text-[11px]">eGFR &gt; 90, normal electrolytes • Apollo Specialty Hospital (2026-08-18)</div>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-400 border border-emerald-800">
                  Unremarkable
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA to Medical Timeline */}
        <div className="pt-4 flex items-center justify-end">
          <Link
            href={`/staff/patient/${patientId}/timeline`}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm transition-colors shadow-lg shadow-teal-500/20"
          >
            <span>Proceed to Longitudinal Timeline</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>
    </div>
  );
}
