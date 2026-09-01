import Link from "next/link";
import {
  ArrowLeft,
  ShieldAlert,
  ShieldCheck,
  XCircle,
  Clock,
  Building2,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { SAMPLE_ACCESS_REQUESTS } from "@/lib/mock-data";

export default async function AccessRequestsPage(props: {
  searchParams: Promise<{ status?: string }>;
}) {
  const searchParams = await props.searchParams;
  const statusParam = searchParams?.status;

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-sky-500 selection:text-white">
      {/* Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md px-6 h-16 flex items-center justify-between sticky top-0 z-50">
        <Link
          href="/patient/dashboard"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
        <div className="font-bold text-sm text-slate-200">
          Access Requests & Consent
        </div>
        <div className="w-20" />
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto px-4 py-8 w-full space-y-8">
        {/* Banner Feedback if redirected after approve/deny */}
        {statusParam === "approved" && (
          <div className="p-4 rounded-xl border border-emerald-500/40 bg-emerald-950/30 flex items-center gap-3 text-emerald-300 text-sm font-medium">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>Access granted successfully. The healthcare provider has been granted a 24-hour access window.</span>
          </div>
        )}

        {statusParam === "denied" && (
          <div className="p-4 rounded-xl border border-rose-500/40 bg-rose-950/30 flex items-center gap-3 text-rose-300 text-sm font-medium">
            <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <span>Access request was denied. No medical records were shared.</span>
          </div>
        )}

        <div>
          <h1 className="text-3xl font-extrabold text-white">Record Access Requests</h1>
          <p className="text-sm text-slate-400 mt-1">
            Review and grant permission to verified healthcare providers requesting temporary access to your longitudinal medical history.
          </p>
        </div>

        {/* Pending Requests Section */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
            <ShieldAlert className="w-4 h-4" />
            <span>Pending Approvals Awaiting Your Action</span>
          </h2>

          <div className="space-y-4">
            {SAMPLE_ACCESS_REQUESTS.filter((r) => r.status === "pending").map((req) => (
              <div
                key={req.id}
                className="p-6 rounded-2xl border-2 border-amber-500/40 bg-slate-900/80 shadow-xl shadow-amber-500/5 space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950">
                        Pending Your Approval
                      </span>
                      <span className="text-xs text-amber-400 font-mono flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {req.expiresIn}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white mt-1">{req.doctorName}</h3>
                    <div className="text-xs text-slate-400 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>{req.hospital} • {req.department}</span>
                    </div>
                  </div>

                  <Link
                    href={`/patient/access-requests/${req.id}`}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-all shadow-md shadow-amber-500/20"
                  >
                    <span>Review & Respond</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs space-y-1">
                  <span className="text-slate-400 font-medium">Stated Clinical Purpose:</span>
                  <p className="text-slate-200">{req.purpose}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Historical Requests */}
        <div className="space-y-4 pt-6 border-t border-slate-800/80">
          <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
            Past Consent Decisions
          </h2>

          <div className="space-y-3">
            {SAMPLE_ACCESS_REQUESTS.filter((r) => r.status !== "pending").map((req) => (
              <div
                key={req.id}
                className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-slate-200">{req.doctorName}</span>
                    <span className="text-slate-400">• {req.hospital}</span>
                  </div>
                  <div className="text-slate-400">{req.purpose} • Requested {req.requestedAt}</div>
                </div>

                <div>
                  {req.status === "approved" ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Approved
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-950 text-rose-400 border border-rose-800 font-semibold">
                      <XCircle className="w-3.5 h-3.5" />
                      Denied
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
