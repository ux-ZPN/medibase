"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { StaffShell } from "@/components/layout/staff-shell";
import {
  Asterisk,
  AlertTriangle,
  User,
  Building2,
  Lock,
  History,
} from "lucide-react";

export default function EmergencyAccessPage() {
  const router = useRouter();
  const [reason, setReason] = useState(
    "Patient presented unconscious with no next-of-kin present. Immediate access to allergy and medication history required for emergency stabilization."
  );
  const [confirmed, setConfirmed] = useState(true);
  const [isActivating, setIsActivating] = useState(false);

  const handleActivate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmed) return;
    setIsActivating(true);
    setTimeout(() => {
      router.push("/staff/emergency/confirmation");
    }, 600);
  };

  return (
    <StaffShell activeNav="emergency">
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

            {/* Identity Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-sky-50/50 border border-sky-100 rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  PATIENT IDENTITY
                </span>
                <p className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <User className="w-4 h-4 text-[#006699]" />
                  <span>Rahul (MB-102394)</span>
                </p>
              </div>

              <div className="p-4 bg-sky-50/50 border border-sky-100 rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  REQUESTING STAFF
                </span>
                <p className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#006699]" />
                  <span>Dr. Sharma, City Hospital</span>
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
                <span>I confirm this is a genuine emergency.</span>
              </label>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <Link
                  href="/staff/dashboard"
                  className="px-5 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-lg transition-colors"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={!confirmed || isActivating}
                  className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-2 shadow"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>
                    {isActivating ? "Activating..." : "Activate Emergency Access"}
                  </span>
                </button>
              </div>
            </form>
          </div>

          {/* Bottom Audit Note */}
          <div className="p-4 bg-sky-50/50 border-t border-slate-100 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
            <History className="w-3.5 h-3.5" />
            <span>Emergency access will be recorded in the audit log.</span>
          </div>
        </div>
      </div>
    </StaffShell>
  );
}
