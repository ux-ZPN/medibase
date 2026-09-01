import Link from "next/link";
import {
  ArrowLeft,
  Bell,
  ShieldAlert,
  AlertOctagon,
  FileText,
  ArrowRight,
} from "lucide-react";
import { SAMPLE_NOTIFICATIONS } from "@/lib/mock-data";

export default function PatientNotificationsPage() {
  const unreadCount = SAMPLE_NOTIFICATIONS.filter((n) => !n.isRead).length;

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
          Notification Center
        </div>
        <div className="w-20" />
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto px-4 py-8 w-full space-y-8">
        {/* Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold px-2.5 py-1 rounded-md bg-sky-950 text-sky-400 border border-sky-800 w-fit mb-2">
              <Bell className="w-3.5 h-3.5" />
              <span>Real-Time Patient Alerts</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white">Notifications & Alerts</h1>
            <p className="text-sm text-slate-400 mt-1">
              Instant alerts for incoming provider consent requests, emergency break-glass overrides, and clinical additions.
            </p>
          </div>

          {unreadCount > 0 && (
            <div className="px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold shrink-0">
              {unreadCount} Unread Notifications
            </div>
          )}
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {SAMPLE_NOTIFICATIONS.map((item) => (
            <div
              key={item.id}
              className={`p-6 rounded-2xl border backdrop-blur-sm space-y-3 transition-all ${
                !item.isRead
                  ? "bg-slate-900/80 border-sky-500/40 shadow-lg shadow-sky-500/5"
                  : "bg-slate-900/40 border-slate-800 opacity-80"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                      item.type === "emergency_access_alert"
                        ? "bg-rose-950 text-rose-400 border border-rose-800"
                        : item.type === "access_request"
                        ? "bg-amber-950 text-amber-400 border border-amber-800"
                        : "bg-sky-950 text-sky-400 border border-sky-800"
                    }`}
                  >
                    {item.type === "emergency_access_alert" ? (
                      <AlertOctagon className="w-5 h-5" />
                    ) : item.type === "access_request" ? (
                      <ShieldAlert className="w-5 h-5" />
                    ) : (
                      <FileText className="w-5 h-5" />
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base text-white">{item.title}</h3>
                      {!item.isRead && (
                        <span className="w-2 h-2 rounded-full bg-sky-400" />
                      )}
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
                      {item.message}
                    </p>
                  </div>
                </div>

                <span className="text-[11px] text-slate-500 font-mono shrink-0">
                  {item.timestamp}
                </span>
              </div>

              {/* Action Link if available */}
              {item.actionUrl && (
                <div className="pt-2 pl-13 flex justify-end">
                  <Link
                    href={item.actionUrl}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-400 hover:text-sky-300 transition-colors"
                  >
                    <span>{item.actionLabel || "View Details"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
