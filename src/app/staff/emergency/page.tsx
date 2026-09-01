"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { StaffShell } from "@/components/layout/staff-shell";
import {
  Asterisk,
  AlertTriangle,
  User,
  Building2,
  Lock,
  History,
  AlertCircle,
} from "lucide-react";

function EmergencyAccessForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const patientParam = searchParams.get("patient") || "MB-100003";

  const [reason, setReason] = useState(
    "Patient presented unconscious with no next-of-kin present. Immediate access to allergy and medication history required for emergency stabilization."
  );
  const [confirmed, setConfirmed] = useState(true);
  const [isActivating, setIsActivating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleActivate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmed) return;
    if (reason.trim().length < 10) {
      setErrorMessage("Please provide a detailed clinical reason (minimum 10 characters).");
      return;
    }

    setIsActivating(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/staff/emergency/override", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId: patientParam,
          reason: reason.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.error || "Failed to activate emergency access.");
        setIsActivating(false);
        return;
      }

      const auditId = data.emergency_access_id || `AUD-${Date.now().toString().slice(-6)}`;
      router.push(
        `/staff/emergency/confirmation?patient=${encodeURIComponent(
          patientParam
        )}&auditId=${encodeURIComponent(auditId)}&reason=${encodeURIComponent(reason.trim())}`
      );
    } catch (err) {
      console.error("Emergency activation error:", err);
      setErrorMessage("Network error during emergency activation.");
      setIsActivating(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] py-6">
      <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {/* Top Red Highlight Line */}
        <div className="h-1.5 bg-rose-500 w-full" />

        <div className="p-8 sm:p-10 space-y-6">
          {/* Top Red Asterisk Badge */}
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
            <Asterisk className="w-6 h-6 stroke-[2.5]" />
          </div>

          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Emergency Access
            </h1>
          </div>

          {/* Red Alert Callout */}
          <div className="bg-rose-50/70 border-l-4 border-l-rose-500 border border-rose-200 rounded-xl p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <p className="text-xs font-semibold text-rose-800 leading-relaxed">
              Use this pathway only when delaying access could put the patient at risk.
            </p>
          </div>

          {errorMessage && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Identity Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-sky-50/50 border border-sky-100 rounded-xl space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                PATIENT IDENTITY
              </span>
              <p className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <User className="w-4 h-4 text-[#006699]" />
                <span>Rahul Sharma ({patientParam})</span>
              </p>
            </div>

            <div className="p-4 bg-sky-50/50 border border-sky-100 rounded-xl space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                REQUESTING STAFF
              </span>
              <p className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#006699]" />
                <span>Dr. Rahul Sharma, City General Hospital</span>
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleActivate} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Reason for emergency access *
              </label>
              <textarea
                rows={4}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g., Patient is unconscious and unable to provide normal authorization."
                required
                className="w-full p-4 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <label className="flex items-center gap-3 text-xs font-medium text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
                className="rounded border-slate-300 text-rose-600 focus:ring-rose-500 w-4 h-4"
              />
              <span>I confirm this is a genuine emergency and will be audited.</span>
            </label>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <Link
                href="/staff/dashboard"
                className="px-5 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={!confirmed || isActivating}
                className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-2 shadow cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>
                  {isActivating ? "Activating Override..." : "Activate Emergency Access"}
                </span>
              </button>
            </div>
          </form>
        </div>

        {/* Bottom Audit Note */}
        <div className="p-4 bg-sky-50/50 border-t border-slate-100 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
          <History className="w-3.5 h-3.5" />
          <span>Emergency access will be immutably recorded in the compliance audit log.</span>
        </div>
      </div>
    </div>
  );
}

export default function EmergencyAccessPage() {
  return (
    <StaffShell activeNav="emergency">
      <Suspense fallback={<div className="p-12 text-center text-xs text-slate-400">Loading emergency workflow...</div>}>
        <EmergencyAccessForm />
      </Suspense>
    </StaffShell>
  );
}
