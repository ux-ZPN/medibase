"use client";

import React, { use, useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { StaffShell } from "@/components/layout/staff-shell";
import {
  ArrowLeft,
  UploadCloud,
  Lock,
  FileText,
  Shield,
  ShieldAlert,
  Send,
  RefreshCw,
  AlertCircle,
  X,
} from "lucide-react";

interface PatientContext {
  authorized: boolean;
  patient?: {
    id: string;
    medibase_id: string;
    name: string;
    age: number;
    blood_group: string;
  };
  error?: string;
}

export default function UploadReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const patientId = (resolvedParams.id || "MB-102394").toUpperCase();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [patientData, setPatientData] = useState<PatientContext | null>(null);
  const [loadingContext, setLoadingContext] = useState(true);

  const [reportType, setReportType] = useState("Laboratory Diagnostics");
  const [reportDate, setReportDate] = useState(new Date().toISOString().split("T")[0]);
  const [description, setDescription] = useState("Complete Lipid Panel and HbA1c lab evaluation.");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadContext() {
      setLoadingContext(true);
      try {
        const res = await fetch(`/api/staff/patient/${patientId}/clinical-access`);
        const data = await res.json();
        setPatientData(data);
      } catch (err) {
        console.error("Context load error:", err);
        setPatientData({ authorized: false, error: "Network error loading patient context." });
      } finally {
        setLoadingContext(false);
      }
    }
    loadContext();
  }, [patientId]);

  const isAuthorized = patientData?.authorized === true;
  const patientName = patientData?.patient?.name || "Rahul Sharma";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 25 * 1024 * 1024) {
        setErrorMessage("File size exceeds the 25 MB limit.");
        return;
      }
      setSelectedFile(file);
      setErrorMessage(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.size > 25 * 1024 * 1024) {
        setErrorMessage("File size exceeds the 25 MB limit.");
        return;
      }
      setSelectedFile(file);
      setErrorMessage(null);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setErrorMessage("Please select a medical report file to upload.");
      return;
    }

    setIsUploading(true);
    setErrorMessage(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("reportTitle", `${reportType}: ${selectedFile.name}`);
      formData.append("reportType", reportType);
      formData.append("reportDate", reportDate);
      formData.append("description", description);

      const res = await fetch(`/api/staff/patient/${patientId}/upload-report`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.error || "Failed to upload medical file.");
        setIsUploading(false);
        return;
      }

      router.push(
        `/staff/patient/${patientId}/upload-success?file=${encodeURIComponent(
          selectedFile.name
        )}&type=${encodeURIComponent(reportType)}`
      );
    } catch (err) {
      console.error("Upload error:", err);
      setErrorMessage("Network error during file upload. Please try again.");
      setIsUploading(false);
    }
  };

  return (
    <StaffShell activeNav="recent-patients">
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
          {/* Header */}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Link
                href={`/staff/patient/${patientId}`}
                className="text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Upload Medical Report
              </h1>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 pl-8">
              <span className="font-semibold text-slate-700">👤 {patientName} ({patientId})</span>
              <span>•</span>
              <span>📅 {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} - City General Hospital</span>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Loading State */}
          {loadingContext && (
            <div className="p-12 text-center bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <RefreshCw className="w-7 h-7 animate-spin text-[#006699] mx-auto mb-2" />
              <p className="text-xs text-slate-500 font-medium">Verifying active patient authorization...</p>
            </div>
          )}

          {/* Unauthorized Guard */}
          {!loadingContext && !isAuthorized && (
            <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-6 sm:p-8 shadow-sm text-center max-w-2xl mx-auto space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-600 mx-auto">
                <ShieldAlert className="w-9 h-9" />
              </div>

              <div>
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-200/80 text-rose-800">
                  Access Restricted • Authorization Required
                </span>
                <h2 className="text-2xl font-bold text-slate-900 mt-3">
                  Cannot Upload Files Without Authorization
                </h2>
                <p className="text-sm text-slate-600 max-w-md mx-auto mt-2 leading-relaxed">
                  Attaching medical files to patient <span className="font-bold text-slate-900">{patientId}</span> requires active consent.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <Link
                  href={`/staff/patient/${patientId}/authorize`}
                  className="w-full sm:w-auto px-6 py-3 bg-[#006699] hover:bg-[#005580] text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 shadow"
                >
                  <Send className="w-4 h-4" />
                  <span>Request Patient Authorization</span>
                </Link>

                <Link
                  href="/staff/find-patient"
                  className="w-full sm:w-auto px-5 py-3 border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-lg transition-colors text-center"
                >
                  Find Another Patient
                </Link>
              </div>
            </div>
          )}

          {/* Upload Grid Form */}
          {!loadingContext && isAuthorized && (
            <form onSubmit={handleUpload} className="space-y-6">
              {errorMessage && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                {/* Dropzone Area (7 cols) */}
                <div className="md:col-span-7">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    className="border-2 border-dashed border-slate-300 rounded-xl p-10 flex flex-col items-center justify-center text-center bg-slate-50/50 hover:bg-slate-50 hover:border-slate-400 transition-colors cursor-pointer min-h-[280px]"
                  >
                    <div className="w-14 h-14 rounded-full bg-sky-100 text-[#006699] flex items-center justify-center mb-4">
                      <UploadCloud className="w-7 h-7" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 mb-1">
                      Drag and drop your files here, or click to browse
                    </h3>
                    <p className="text-xs text-slate-500 mb-4">
                      Accepted formats: PDF, JPG, PNG (Max 25MB)
                    </p>

                    {selectedFile && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 flex items-center gap-3 shadow-sm"
                      >
                        <FileText className="w-4 h-4 text-[#006699]" />
                        <span>{selectedFile.name} ({(selectedFile.size / 1024).toFixed(0)} KB)</span>
                        <button
                          type="button"
                          onClick={() => setSelectedFile(null)}
                          className="p-1 text-slate-400 hover:text-slate-700 rounded-full"
                          title="Remove file"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Metadata Form Fields (5 cols) */}
                <div className="md:col-span-5 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Report Type
                    </label>
                    <select
                      value={reportType}
                      onChange={(e) => setReportType(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#006699]"
                    >
                      <option value="Laboratory Diagnostics">Laboratory Diagnostics</option>
                      <option value="Radiology & Imaging">Radiology & Imaging</option>
                      <option value="Prescription Record">Prescription Record</option>
                      <option value="Clinical Summary">Clinical Summary</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Report Date
                    </label>
                    <input
                      type="date"
                      value={reportDate}
                      onChange={(e) => setReportDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#006699]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Description (Optional)
                    </label>
                    <textarea
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Add any relevant notes..."
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#006699]"
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Shield className="w-4 h-4 text-[#006699] shrink-0" />
                  <span>
                    Medical files are stored in private encrypted storage and accessible only through authorized workflows.
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isUploading || !selectedFile}
                  className="px-6 py-2.5 bg-black hover:bg-slate-800 disabled:opacity-50 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 shrink-0 shadow cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>{isUploading ? "Uploading File..." : "Upload Securely"}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </StaffShell>
  );
}
