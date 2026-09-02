"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { PatientShell } from "@/components/layout/patient-shell";
import {
  ShieldCheck,
  CheckCircle2,
  Download,
  Printer,
  CreditCard,
} from "lucide-react";
import { getCurrentUserProfile, UserProfile } from "@/lib/supabase/auth-helpers";
import { generatePatientQRCodeDataUrl } from "@/lib/identity/qr-code";
import { getMaskedAadhaar } from "@/lib/identity/aadhaar";

export default function DigitalIdentityPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);

  useEffect(() => {
    async function loadIdentity() {
      try {
        const userProfile = await getCurrentUserProfile();
        setProfile(userProfile);

        const medibaseId = userProfile?.patient_data?.medibase_id || "MB-102394";
        const qrToken = userProfile?.patient_data?.qr_code_token || "00000000-0000-0000-0000-000000000000";

        const qrUrl = await generatePatientQRCodeDataUrl(medibaseId, qrToken);
        setQrDataUrl(qrUrl);
      } catch (err) {
        console.error("Error generating identity card:", err);
      }
    }
    loadIdentity();
  }, []);

  const patientName = profile?.full_name || (profile?.patient_data?.medibase_id ? `Patient (${profile.patient_data.medibase_id})` : "Patient Profile");
  const medibaseId = profile?.patient_data?.medibase_id || "MB-100001";
  const maskedAadhaar = getMaskedAadhaar(profile?.patient_data?.aadhaar_last4);

  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = `MediBase-Card-${medibaseId}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <PatientShell activeNav="identity">
      <div className="flex flex-col items-center justify-center py-6">
        {/* Digital Identity Card Frame */}
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden text-center">
          {/* Dark Header Bar */}
          <div className="bg-[#111827] px-6 py-4 flex items-center justify-between text-white">
            <span className="font-bold text-lg tracking-tight">MediBase</span>
            <ShieldCheck className="w-5 h-5 text-sky-400" />
          </div>

          {/* Card Body */}
          <div className="p-8 space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{patientName}</h1>
              <p className="text-xs font-mono font-bold text-slate-500 mt-1">
                ID: {medibaseId}
              </p>
              {profile?.patient_data?.aadhaar_last4 && (
                <div className="inline-flex items-center gap-1.5 text-[11px] font-mono text-slate-400 mt-1 bg-slate-50 px-2.5 py-0.5 rounded border border-slate-100">
                  <CreditCard className="w-3 h-3 text-slate-400" />
                  <span>Aadhaar: {maskedAadhaar}</span>
                </div>
              )}
            </div>

            {/* QR Code Container */}
            <div className="w-56 h-56 mx-auto bg-slate-50 border-2 border-sky-100 rounded-2xl p-4 flex flex-col items-center justify-center shadow-inner">
              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center">
                {qrDataUrl ? (
                  <div className="relative w-36 h-36">
                    <Image
                      src={qrDataUrl}
                      alt={`MediBase QR Code for ${medibaseId}`}
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                ) : (
                  <div className="w-36 h-36 flex items-center justify-center text-xs text-slate-400">
                    Loading QR...
                  </div>
                )}
                <span className="text-[9px] text-slate-600 font-bold uppercase tracking-wider mt-2">
                  MediBase Digital ID
                </span>
                <span className="text-[8px] text-slate-400">Scan for Provider Verification</span>
              </div>
            </div>

            {/* Status Pill */}
            <div>
              <span className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Your QR is active & verified
              </span>
            </div>

            <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
              This QR securely identifies your MediBase profile. Sensitive medical records and Aadhaar numbers are never stored inside the QR code.
            </p>
          </div>

          {/* Bottom Card Disclaimer */}
          <div className="bg-slate-50 border-t border-slate-100 py-3 px-6 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            SHOW THIS CODE TO AUTHORIZED PARTICIPATING HEALTHCARE PROVIDERS.
          </div>
        </div>

        {/* Action Buttons Below Card */}
        <div className="flex items-center gap-4 mt-8">
          <button
            onClick={handleDownloadQr}
            className="px-6 py-2.5 bg-[#0F172A] hover:bg-slate-800 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-2 shadow cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download QR</span>
          </button>
          <button
            onClick={() => window.print()}
            className="px-6 py-2.5 border border-[#006699] text-[#006699] hover:bg-sky-50 font-semibold text-xs rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Card</span>
          </button>
        </div>
      </div>
    </PatientShell>
  );
}
