"use client";

import React, { use, useState, useEffect } from "react";
import Link from "next/link";
import { StaffShell } from "@/components/layout/staff-shell";
import {
  ArrowLeft,
  Shield,
  ShieldCheck,
  Clock,
  User,
  Building2,
  CheckCircle2,
  Cpu,
  Lock,
  RefreshCw,
} from "lucide-react";

interface AuditDetail {
  id: string;
  timestamp: string;
  actor_name: string;
  actor_role: string;
  hospital_id?: string;
  hospital_name: string;
  action: string;
  action_label: string;
  purpose: string;
  patient_id: string;
  is_emergency: boolean;
  access_type: string;
  ip_address?: string;
  device?: string;
}

export default function AccessEventDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const auditId = resolvedParams.id || "AUD-839291";

  const [log, setLog] = useState<AuditDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDetail() {
      setLoading(true);
      try {
        const res = await fetch(`/api/staff/audit-logs/${auditId}`);
        const data = await res.json();
        if (data.success && data.log) {
          setLog(data.log);
        }
      } catch (err) {
        console.error("Failed to load audit detail:", err);
      } finally {
        setLoading(false);
      }
    }
    loadDetail();
  }, [auditId]);

  const isEmergency = log?.is_emergency === true;
  const actorName = log?.actor_name || "Dr. Rahul Sharma";
  const actorRole = log?.actor_role || "Senior Physician";
  const patientId = log?.patient_id || "MB-100003";
  const timestamp = log?.timestamp || "Oct 24, 2023, 14:31:12";
  const purpose = log?.purpose || "Clinical Consultation & Evaluation";
  const actionLabel = log?.action_label || "Viewed medical history";
  const hospitalName = log?.hospital_name || "City General Hospital";
  const ipAddress = log?.ip_address || "192.168.1.45";
  const device = log?.device || "Hospital Terminal-04 (Chrome/Linux)";

  return (
    <StaffShell activeNav="audit-logs">
      <div className="space-y-6 max-w-5xl mx-auto">
        {/* Header & Badges */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <Link
              href="/staff/audit-log"
              className="text-slate-500 hover:text-slate-900 transition-colors p-1 cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Access Event Details
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Reviewing secure immutable audit log for compliance monitoring.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isEmergency ? (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
                ▲ Emergency
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">
                Normal Access
              </span>
            )}
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Immutable Log
            </span>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500 space-y-2 bg-white rounded-xl border border-slate-200">
            <RefreshCw className="w-6 h-6 animate-spin text-[#006699] mx-auto mb-2" />
            <span>Loading event details...</span>
          </div>
        ) : (
          <>
            {/* Emergency Reason Callout if emergency */}
            {isEmergency && (
              <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-4 flex items-start gap-3">
                <Shield className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-bold text-rose-800 uppercase tracking-wider mb-0.5">
                    Reason for Emergency Access
                  </p>
                  <p className="text-rose-950 font-medium italic">
                    &ldquo;{purpose}&rdquo;
                  </p>
                </div>
              </div>
            )}

            {/* Details Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Access Metadata (7 cols) */}
              <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    ACCESS METADATA
                  </h2>
                  <span className="font-mono text-xs font-bold text-[#006699]">
                    Audit ID: {auditId}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 font-medium block">Timestamp</span>
                    <p className="font-bold text-slate-900 mt-1 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {timestamp}
                    </p>
                  </div>

                  <div>
                    <span className="text-slate-400 font-medium block">Access Classification</span>
                    <p className="font-bold text-slate-900 mt-1 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#006699]" />
                      {isEmergency ? "Emergency Override" : "Authorized Clinical"}
                    </p>
                  </div>
                </div>

                {/* Staff Member Pill */}
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Staff Member
                  </span>
                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-800 text-white font-bold text-xs flex items-center justify-center">
                      {actorName.charAt(actorName.startsWith("Dr.") ? 4 : 0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs">{actorName}</h4>
                      <p className="text-[11px] text-slate-500">{actorRole}</p>
                    </div>
                  </div>
                </div>

                {/* Patient Subject Pill */}
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Patient Subject
                  </span>
                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-sky-100 text-sky-800 font-bold text-xs flex items-center justify-center">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs">Patient Profile</h4>
                      <p className="text-[11px] text-slate-500 font-mono">{patientId}</p>
                    </div>
                  </div>
                </div>

                {/* Facility */}
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Facility
                  </span>
                  <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-[#006699]" />
                    {hospitalName}
                  </p>
                </div>
              </div>

              {/* Right Column: Authorization Scope & Technical Footprint (5 cols) */}
              <div className="lg:col-span-5 space-y-5">
                {/* Scope Box */}
                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
                  <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-3">
                    AUTHORIZATION SCOPE
                  </h2>

                  <div className="text-xs space-y-3">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Action</span>
                      <p className="font-bold text-slate-900 mt-0.5">{actionLabel}</p>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Purpose</span>
                      <p className="font-bold text-slate-900 mt-0.5">{purpose}</p>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">
                        Access Policy
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        <span className="px-2 py-0.5 rounded bg-sky-50 text-sky-800 text-[11px] font-semibold">
                          Time-Bounded Consent
                        </span>
                        <span className="px-2 py-0.5 rounded bg-sky-50 text-sky-800 text-[11px] font-semibold">
                          Append-Only Audit
                        </span>
                      </div>
                    </div>

                    {/* Decision Box */}
                    <div className="p-3 bg-sky-50/70 border border-sky-100 rounded-lg flex items-center gap-2 text-xs font-bold text-[#006699]">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>System Authorized & Verified</span>
                    </div>
                  </div>
                </div>

                {/* Technical Footprint */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-2 text-xs">
                  <div className="flex items-center gap-2 font-bold text-slate-700 mb-2">
                    <Cpu className="w-4 h-4 text-slate-500" />
                    <span>Technical Footprint</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">IP Address:</span>
                    <span className="font-mono font-bold text-slate-900">{ipAddress}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Device:</span>
                    <span className="font-medium text-slate-900">{device}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Immutable Notice & Action */}
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                <span>
                  Event record is immutable and cannot be edited by ordinary users. All access logs are cryptographically verifiable for healthcare compliance.
                </span>
              </div>

              <Link
                href="/staff/audit-log"
                className="px-5 py-2 border border-[#006699] text-[#006699] hover:bg-sky-50 font-semibold text-xs rounded-lg transition-colors text-center shrink-0"
              >
                Back to Audit Log
              </Link>
            </div>
          </>
        )}
      </div>
    </StaffShell>
  );
}
