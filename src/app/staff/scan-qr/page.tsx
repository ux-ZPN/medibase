"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { StaffShell } from "@/components/layout/staff-shell";
import { QrCode, Keyboard, Lock, Plus } from "lucide-react";

export default function ScanQRPage() {
  const router = useRouter();
  const [scanning, setScanning] = useState(false);

  const simulateScan = () => {
    setScanning(true);
    setTimeout(() => {
      router.push("/staff/patient/MB-102394");
    }, 1200);
  };

  return (
    <StaffShell activeNav="scan-qr">
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <div className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden text-center">
          {/* Top Blue Accent Line */}
          <div className="h-1 bg-[#006699] w-full" />

          <div className="p-8 sm:p-10">
            {/* Top QR Icon Badge */}
            <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-[#006699] mx-auto mb-4">
              <QrCode className="w-6 h-6 stroke-[1.75]" />
            </div>

            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Scan Patient QR
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mb-8 max-w-xs mx-auto">
              Position the patient&apos;s MediBase QR inside the frame.
            </p>

            {/* Viewfinder Frame */}
            <div
              onClick={simulateScan}
              className="relative w-64 h-64 mx-auto bg-[#0F172A] rounded-xl flex items-center justify-center cursor-pointer group shadow-inner mb-6 overflow-hidden"
              title="Click to simulate QR scan"
            >
              {/* Cyan Targeting Corner Brackets */}
              <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-sky-400"></div>
              <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-sky-400"></div>
              <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-sky-400"></div>
              <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-sky-400"></div>

              {/* Center crosshair */}
              <div className="text-slate-600 group-hover:text-sky-400 transition-colors">
                <Plus className="w-8 h-8 stroke-[1.5]" />
              </div>

              {scanning && (
                <div className="absolute inset-0 bg-sky-500/20 backdrop-blur-xs flex items-center justify-center text-white text-xs font-bold">
                  Reading QR Code...
                </div>
              )}
            </div>

            {/* OR Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-3 text-slate-400 font-semibold">OR</span>
              </div>
            </div>

            <p className="text-xs text-slate-500 mb-3">Search by MediBase ID</p>

            <Link
              href="/staff/find-patient"
              className="w-full py-2.5 px-4 border border-[#006699] text-[#006699] hover:bg-sky-50 font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Keyboard className="w-4 h-4" />
              <span>Search by ID</span>
            </Link>
          </div>

          {/* Bottom Security Note */}
          <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-600">
            <Lock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span>Scanning identifies the patient. Medical history is retrieved only after authorization.</span>
          </div>
        </div>
      </div>
    </StaffShell>
  );
}
