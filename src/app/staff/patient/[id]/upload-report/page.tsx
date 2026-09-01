"use client";

import React, { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { StaffShell } from "@/components/layout/staff-shell";
import {
  ArrowLeft,
  UploadCloud,
  Lock,
  Calendar,
  FileText,
  Shield,
} from "lucide-react";

export default function UploadReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const patientId = resolvedParams.id || "MB-102394";
  const router = useRouter();

  const [reportType, setReportType] = useState("Laboratory Diagnostics");
  const [reportDate, setReportDate] = useState("2023-10-24");
  const [description, setDescription] = useState("Complete Lipid Panel and HbA1c lab evaluation.");
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState("Lab_Results_Oct24.pdf");

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    setTimeout(() => {
      router.push(`/staff/patient/${patientId}/upload-success`);
    }, 600);
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
                className="text-slate-500 hover:text-slate-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Upload Medical Report
              </h1>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 pl-8">
              <span className="font-semibold text-slate-700">👤 Rahul Sharma ({patientId})</span>
              <span>•</span>
              <span>📅 Oct 24, 2023 - City General Hospital</span>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Upload Grid */}
          <form onSubmit={handleUpload} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              {/* Dropzone Area (7 cols) */}
              <div className="md:col-span-7">
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-10 flex flex-col items-center justify-center text-center bg-slate-50/50 hover:bg-slate-50 hover:border-slate-400 transition-colors cursor-pointer min-h-[280px]">
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
                    <div className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 flex items-center gap-2 shadow-sm">
                      <FileText className="w-4 h-4 text-[#006699]" />
                      <span>{selectedFile}</span>
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
                    <option>Select type...</option>
                    <option>Laboratory Diagnostics</option>
                    <option>Radiology & Imaging</option>
                    <option>Prescription Record</option>
                    <option>Clinical Summary</option>
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
                  Medical files are stored separately from structured patient data and are accessible only through authorized workflows.
                </span>
              </div>

              <button
                type="submit"
                disabled={isUploading}
                className="px-6 py-2.5 bg-black hover:bg-slate-800 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 shrink-0 shadow"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{isUploading ? "Uploading..." : "Upload Securely"}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </StaffShell>
  );
}
