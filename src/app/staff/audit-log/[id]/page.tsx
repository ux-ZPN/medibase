import Link from "next/link";
import {
  ArrowLeft,
  ShieldCheck,
  Clock,
  Terminal,
} from "lucide-react";
import { SAMPLE_AUDIT_LOGS } from "@/lib/mock-data";

export default async function AccessEventDetailsPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const eventId = params.id;
  const event =
    SAMPLE_AUDIT_LOGS.find((e) => e.id === eventId) ||
    SAMPLE_AUDIT_LOGS[0];

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-teal-500 selection:text-white">
      {/* Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md px-6 h-16 flex items-center justify-between sticky top-0 z-50">
        <Link
          href="/staff/audit-log"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Audit Log</span>
        </Link>
        <div className="font-bold text-sm text-slate-200">
          Audit Event Inspection
        </div>
        <div className="w-20" />
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-3xl mx-auto px-4 py-8 w-full space-y-8">
        <div className="p-7 sm:p-9 rounded-3xl border border-slate-800 bg-slate-900/80 backdrop-blur-md shadow-2xl space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2.5 py-0.5 rounded-md bg-teal-950 text-teal-400 border border-teal-800 font-bold">
                  {event.id}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                  <Clock className="w-3.5 h-3.5" />
                  {event.timestamp}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-white mt-2">{event.action}</h1>
            </div>

            <div className="w-12 h-12 rounded-2xl bg-teal-950 border border-teal-800 flex items-center justify-center text-teal-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
          </div>

          {/* Event Metadata Grid */}
          <div className="space-y-4 text-xs">
            {/* Actor & Hospital */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                <span className="text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                  Clinical Actor
                </span>
                <div className="font-semibold text-slate-200">{event.actorName}</div>
                <div className="text-slate-400">{event.actorRole}</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                <span className="text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                  Facility & Department
                </span>
                <div className="font-semibold text-slate-200">{event.hospital}</div>
                <div className="text-slate-400">Cardiology / Emergency Clinical Dept</div>
              </div>
            </div>

            {/* Target Patient */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
              <span className="text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                Target Patient Record
              </span>
              <div className="flex items-center justify-between">
                <div className="font-semibold text-white">{event.patientName || "Johnathan Doe"}</div>
                <div className="font-mono text-sky-400 font-bold">{event.patientId || "MB-2026-89412"}</div>
              </div>
            </div>

            {/* Context & Description */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <span className="text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                Event Scope & Clinical Context
              </span>
              <p className="text-slate-200 leading-relaxed">{event.details || event.resource}</p>
            </div>

            {/* Origin & Security Signatures */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
              <span className="text-slate-400 font-semibold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-teal-400" />
                <span>Client Origin & Cryptographic Integrity</span>
              </span>

              <div className="space-y-1.5 font-mono text-[11px]">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Network IP Origin:</span>
                  <span className="text-slate-200">{event.ipAddress}</span>
                </div>
                <div className="text-slate-400 pt-1">
                  <span>Tamper-Evident SHA-256 Digest:</span>
                  <div className="text-sky-300 break-all mt-0.5">
                    {event.integrityHash || "sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action */}
          <div className="pt-2 flex justify-end">
            <Link
              href="/staff/audit-log"
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold transition-colors"
            >
              Return to Audit Trail
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
