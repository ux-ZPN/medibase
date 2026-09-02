"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { PatientShell } from "@/components/layout/patient-shell";
import {
  Building2,
  Activity,
  Pill,
  FileText,
  Download,
  Eye,
  ShieldCheck,
  Clock,
  ArrowRight,
  Calendar,
  Stethoscope,
} from "lucide-react";
import { getCurrentUserProfile, UserProfile } from "@/lib/supabase/auth-helpers";
import { generatePatientQRCodeDataUrl } from "@/lib/identity/qr-code";

interface TimelineEncounter {
  id: string;
  date: string;
  time?: string;
  hospital_name: string;
  department: string;
  doctor_name: string;
  visit_type: string;
  chief_complaint: string;
  diagnoses?: Array<{ name: string }>;
  prescriptions?: Array<{ name: string; dosage?: string; is_active?: boolean }>;
  reports?: Array<{ title: string }>;
}

export default function PatientDashboardPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [encounters, setEncounters] = useState<TimelineEncounter[]>([]);
  const [loadingTimeline, setLoadingTimeline] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const userProfile = await getCurrentUserProfile();
        setProfile(userProfile);

        const medibaseId = userProfile?.patient_data?.medibase_id || "MB-102394";
        const qrToken = userProfile?.patient_data?.qr_code_token || "00000000-0000-0000-0000-000000000000";

        const qrUrl = await generatePatientQRCodeDataUrl(medibaseId, qrToken);
        setQrDataUrl(qrUrl);
      } catch (err) {
        console.error("Error loading patient identity:", err);
      }
    }

    async function loadTimeline() {
      try {
        const res = await fetch("/api/patient/timeline");
        const json = await res.json();
        if (json.success && Array.isArray(json.encounters)) {
          setEncounters(json.encounters);
        }
      } catch (err) {
        console.error("Error loading timeline:", err);
      } finally {
        setLoadingTimeline(false);
      }
    }

    loadData();
    loadTimeline();
  }, []);

  const patientName = profile?.full_name || "Rahul Sharma";
  const medibaseId = profile?.patient_data?.medibase_id || "MB-102394";
  const latestEncounter = encounters[0];
  const activePrescriptionsCount = encounters.flatMap((e) => e.prescriptions || []).filter((p) => p.is_active !== false).length;
  const totalReportsCount = encounters.flatMap((e) => e.reports || []).length;

  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = `MediBase-QR-${medibaseId}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <PatientShell activeNav="dashboard">
      <div className="space-y-6">
        {/* Top Greeting */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Good morning, {patientName.split(" ")[0]}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Here is your longitudinal health overview and digital MediBase ID.
          </p>
        </div>

        {/* Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Dark QR Card (5 cols) */}
          <div className="lg:col-span-5 bg-[#111827] rounded-2xl p-7 text-white shadow-md flex flex-col justify-between text-center space-y-6">
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">Your MediBase ID</h2>
                <span className="inline-block px-3.5 py-1 rounded-full bg-slate-800 text-sky-300 text-xs font-mono font-bold mt-2 border border-slate-700 tracking-wider">
                  {medibaseId}
                </span>
              </div>

              {/* Real QR Code Container */}
              <div className="w-52 h-52 mx-auto bg-white rounded-2xl p-3 flex flex-col items-center justify-center shadow-inner">
                {qrDataUrl ? (
                  <div className="relative w-40 h-40">
                    <Image
                      src={qrDataUrl}
                      alt={`MediBase QR Code for ${medibaseId}`}
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                ) : (
                  <div className="w-40 h-40 flex items-center justify-center text-xs text-slate-400">
                    Generating secure QR...
                  </div>
                )}
                <span className="text-[10px] text-slate-600 font-bold uppercase tracking-wider mt-1">
                  MediBase Patient Reference
                </span>
              </div>

              <p className="text-xs text-slate-300 max-w-xs mx-auto leading-relaxed">
                Show this QR to authorized healthcare providers for instant identification. Medical records are never encoded inside the QR.
              </p>
            </div>

            <div className="space-y-2.5">
              <Link
                href="/patient/identity"
                className="w-full py-2.5 px-4 bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Full ID Card</span>
              </Link>
              <button
                onClick={handleDownloadQr}
                className="w-full py-2.5 px-4 border border-slate-700 hover:bg-slate-800 text-white font-medium text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download QR Code</span>
              </button>
            </div>
          </div>

          {/* Right 2x2 Metric Cards Grid (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Last Visit */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-slate-700 text-xs font-bold uppercase tracking-wider">
                  <span className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[#006699]" />
                    Last Visit
                  </span>
                  {latestEncounter?.date && (
                    <span className="text-[11px] font-mono text-slate-500 font-normal">
                      {latestEncounter.date}
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 truncate">
                    {latestEncounter ? latestEncounter.hospital_name : "City General Hospital"}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                    <span>{latestEncounter ? latestEncounter.visit_type : "Clinical Checkup"}</span>
                    {latestEncounter?.time && <span className="text-slate-400">• ⏰ {latestEncounter.time}</span>}
                  </p>
                </div>
              </div>

              {/* Profile Status */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-2">
                <div className="flex items-center gap-2 text-slate-700 text-xs font-bold uppercase tracking-wider">
                  <Activity className="w-4 h-4 text-[#006699]" />
                  <span>Profile Status</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Verified Citizen Identity</h3>
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase mt-1">
                    SYNCHRONIZED ACTIVE
                  </span>
                </div>
              </div>

              {/* Current Prescriptions */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-2">
                <div className="flex items-center gap-2 text-slate-700 text-xs font-bold uppercase tracking-wider">
                  <Pill className="w-4 h-4 text-[#006699]" />
                  <span>Active Prescriptions</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {activePrescriptionsCount > 0 ? `${activePrescriptionsCount} Active Medicines` : "Synchronized"}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">Updated automatically by attending doctors</p>
                </div>
              </div>

              {/* Recent Reports */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-2">
                <div className="flex items-center gap-2 text-slate-700 text-xs font-bold uppercase tracking-wider">
                  <FileText className="w-4 h-4 text-[#006699]" />
                  <span>Diagnostic Vault</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {totalReportsCount > 0 ? `${totalReportsCount} Uploaded Documents` : "Longitudinal Vault"}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">Encrypted with patient consent</p>
                </div>
              </div>
            </div>

            {/* Recent Treatments & Visits Live Box */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#006699]" />
                  Recent Clinical Encounters ({encounters.length})
                </span>
                <Link
                  href="/patient/timeline"
                  className="text-xs font-semibold text-[#006699] hover:underline flex items-center gap-1"
                >
                  <span>Full Medical Timeline</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="space-y-2.5">
                {encounters.slice(0, 3).map((enc, idx) => (
                  <div
                    key={enc.id || idx}
                    className="p-3 bg-slate-50 hover:bg-sky-50/50 border border-slate-200 rounded-lg transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{enc.visit_type}</span>
                        <span className="text-[11px] font-semibold text-[#006699] bg-sky-100 px-2 py-0.5 rounded">
                          {enc.hospital_name}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {enc.doctor_name} • {enc.chief_complaint}
                      </p>
                    </div>

                    <div className="text-left sm:text-right shrink-0">
                      <span className="text-xs font-bold text-slate-700 block">📅 {enc.date}</span>
                      {enc.time && <span className="text-[11px] text-slate-500 font-medium">⏰ {enc.time}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Security Notice Banner */}
            <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 flex items-start gap-3 text-xs text-slate-700">
              <ShieldCheck className="w-5 h-5 text-[#006699] shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-900">Longitudinal Consent Protected</p>
                <p className="text-slate-600 mt-0.5">
                  Every treatment and visit recorded by attending doctors is synchronized directly with your personal timeline in real time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PatientShell>
  );
}

