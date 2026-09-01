"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { StaffShell } from "@/components/layout/staff-shell";
import {
  QrCode,
  Keyboard,
  Lock,
  Camera,
  AlertCircle,
  RefreshCw,
  Upload,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { parseAndValidatePatientQR } from "@/lib/identity/qr-code";

interface QrScannerInstance {
  start: (
    cameraConfig: { facingMode: string },
    config: { fps: number; qrbox: { width: number; height: number } },
    onSuccess: (decodedText: string) => void,
    onError: (err: unknown) => void
  ) => Promise<null>;
  stop: () => Promise<void>;
  scanFile: (imageFile: File, showImage?: boolean) => Promise<string>;
}

export default function ScanQRPage() {
  const router = useRouter();
  const [scanning, setScanning] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const [scanSuccess, setScanSuccess] = useState<string | null>(null);
  const scannerRef = useRef<QrScannerInstance | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Stop camera when unmounting
  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        try {
          scannerRef.current.stop().catch(() => {});
        } catch {
          // Cleanup
        }
      }
    };
  }, []);

  const handleProcessQRData = async (rawPayload: string) => {
    setScanning(true);
    setScanError(null);
    setScanSuccess(null);

    const validation = parseAndValidatePatientQR(rawPayload);

    if (!validation.isValid || !validation.medibaseId) {
      setScanError(validation.error || "Invalid QR code. Please scan an authentic MediBase Patient Card.");
      setScanning(false);
      return;
    }

    try {
      const res = await fetch("/api/staff/lookup-patient", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qrPayload: rawPayload }),
      });

      const data = await res.json();

      if (!res.ok || !data.success || !data.patient) {
        setScanError(data.error || "No registered patient found with this QR reference.");
        setScanning(false);
        return;
      }

      setScanSuccess(`Identified: ${data.patient.full_name} (${data.patient.medibase_id})`);
      setTimeout(() => {
        router.push(`/staff/patient/${data.patient.medibase_id}/authorize`);
      }, 600);
    } catch {
      setScanError("Failed to verify patient QR token with backend.");
      setScanning(false);
    }
  };

  const startCamera = async () => {
    setScanError(null);

    try {
      const { Html5Qrcode } = await import("html5-qrcode");
      const html5QrCode = new Html5Qrcode("qr-camera-viewfinder") as unknown as QrScannerInstance;
      scannerRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 220, height: 220 },
        },
        (decodedText: string) => {
          html5QrCode.stop().catch(() => {});
          setCameraActive(false);
          handleProcessQRData(decodedText);
        },
        () => {
          // Scanning frame without QR
        }
      );

      setCameraActive(true);
    } catch (err: unknown) {
      const errMsg = err ? String(err) : "";
      if (errMsg.includes("NotAllowedError") || errMsg.includes("Permission")) {
        setScanError("Camera access was denied. Please allow camera permissions in your browser or search by ID.");
      } else {
        setScanError("Camera device not accessible. You can upload a QR image or use simulated scan.");
      }
      setCameraActive(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setScanning(true);
    setScanError(null);

    try {
      const { Html5Qrcode } = await import("html5-qrcode");
      const html5QrCode = new Html5Qrcode("qr-camera-viewfinder") as unknown as QrScannerInstance;
      const result = await html5QrCode.scanFile(file, true);
      handleProcessQRData(result);
    } catch {
      setScanError("No valid MediBase QR code detected in the selected image.");
      setScanning(false);
    }
  };

  const simulateScan = (patientId = "MB-102394") => {
    const mockPayload = JSON.stringify({
      type: "medibase_patient_ref",
      medibase_id: patientId,
      qr_code_token: "d3b07384-d113-4632-b7e6-8c2ff6d8b991",
    });
    handleProcessQRData(mockPayload);
  };

  const simulateInvalidScan = () => {
    handleProcessQRData("https://example.com/unrelated-qr-code");
  };

  return (
    <StaffShell activeNav="scan-qr">
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] py-4">
        <div className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden text-center">
          {/* Top Blue Accent Line */}
          <div className="h-1.5 bg-[#006699] w-full" />

          <div className="p-8 sm:p-10">
            {/* Top QR Icon Badge */}
            <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-[#006699] mx-auto mb-4">
              <QrCode className="w-6 h-6 stroke-[1.75]" />
            </div>

            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Scan Patient QR
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mb-6 max-w-xs mx-auto">
              Position the patient&apos;s MediBase QR inside the frame or upload a digital ID card.
            </p>

            {/* Error Alert */}
            {scanError && (
              <div className="mb-4 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-left flex items-start gap-2.5 text-xs text-rose-800">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <p className="font-medium leading-relaxed">{scanError}</p>
              </div>
            )}

            {/* Success Alert */}
            {scanSuccess && (
              <div className="mb-4 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-left flex items-start gap-2.5 text-xs text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p className="font-medium leading-relaxed">{scanSuccess}</p>
              </div>
            )}

            {/* Viewfinder Frame */}
            <div className="relative w-64 h-64 mx-auto bg-[#0F172A] rounded-xl flex items-center justify-center group shadow-inner mb-4 overflow-hidden">
              {/* Camera Video Viewfinder Target */}
              <div id="qr-camera-viewfinder" className="w-full h-full overflow-hidden" />

              {/* Cyan Targeting Corner Brackets */}
              <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-sky-400 pointer-events-none z-10" />
              <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-sky-400 pointer-events-none z-10" />
              <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-sky-400 pointer-events-none z-10" />
              <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-sky-400 pointer-events-none z-10" />

              {/* Center Crosshair / Camera Prompt */}
              {!cameraActive && !scanning && (
                <div
                  onClick={startCamera}
                  className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer text-slate-400 hover:text-sky-300 transition-colors p-4 z-20"
                >
                  <Camera className="w-8 h-8 mb-2" />
                  <span className="text-xs font-semibold text-white">Click to Start Camera</span>
                  <span className="text-[10px] text-slate-400 mt-0.5">or use test simulator below</span>
                </div>
              )}

              {/* Scanning Overlay */}
              {scanning && (
                <div className="absolute inset-0 bg-[#0F172A]/85 backdrop-blur-xs flex flex-col items-center justify-center text-white text-xs font-bold gap-2 z-30">
                  <RefreshCw className="w-6 h-6 animate-spin text-sky-400" />
                  <span>Decoding Patient QR...</span>
                </div>
              )}
            </div>

            {/* Scanner Controls Grid */}
            <div className="flex items-center justify-center gap-2 mb-4">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload QR Image</span>
              </button>

              <button
                type="button"
                onClick={() => simulateScan("MB-100001")}
                className="px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-[#006699] text-xs font-semibold rounded-lg border border-sky-200 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Test Demo QR</span>
              </button>
            </div>

            {/* Quick Demo QR Test Chips */}
            <div className="mb-6 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-left">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">
                Quick Test Simulators:
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => simulateScan("MB-100001")}
                  className="px-2 py-0.5 bg-white border border-slate-200 hover:border-[#006699] text-slate-700 font-mono text-[10px] rounded cursor-pointer"
                >
                  Anjali (MB-100001)
                </button>
                <button
                  type="button"
                  onClick={() => simulateScan("MB-100002")}
                  className="px-2 py-0.5 bg-white border border-slate-200 hover:border-[#006699] text-slate-700 font-mono text-[10px] rounded cursor-pointer"
                >
                  Vikram (MB-100002)
                </button>
                <button
                  type="button"
                  onClick={simulateInvalidScan}
                  className="px-2 py-0.5 bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 font-medium text-[10px] rounded cursor-pointer"
                >
                  Test Invalid QR
                </button>
              </div>
            </div>

            {/* OR Divider */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-3 text-slate-400 font-semibold">OR</span>
              </div>
            </div>

            <p className="text-xs text-slate-500 mb-2.5">Search manually by patient MediBase ID</p>

            <Link
              href="/staff/find-patient"
              className="w-full py-2.5 px-4 border border-[#006699] text-[#006699] hover:bg-sky-50 font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Keyboard className="w-4 h-4" />
              <span>Enter MediBase ID</span>
            </Link>
          </div>

          {/* Bottom Security Note */}
          <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-600">
            <Lock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span>Scanning identifies the patient. Medical history is retrieved only after patient authorization.</span>
          </div>
        </div>
      </div>
    </StaffShell>
  );
}
