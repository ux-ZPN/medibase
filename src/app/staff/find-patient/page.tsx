"use client";

import React, { useState } from "react";
import Link from "next/link";
import { StaffShell } from "@/components/layout/staff-shell";
import {
  Search,
  QrCode,
  ArrowRight,
  ShieldCheck,
  User,
  AlertCircle,
  RefreshCw,
  Sparkles,
  Lock,
} from "lucide-react";

interface IdentifiedPatient {
  id: string;
  medibase_id: string;
  full_name: string;
  age: number | null;
  gender: string | null;
  blood_group: string | null;
  occupation: string | null;
}

export default function FindPatientPage() {
  const [searchQuery, setSearchQuery] = useState("MB-102394");
  const [isLoading, setIsLoading] = useState(false);
  const [identifiedPatient, setIdentifiedPatient] = useState<IdentifiedPatient | null>({
    id: "demo-patient-rec-0001",
    medibase_id: "MB-102394",
    full_name: "Rahul Sharma",
    age: 32,
    gender: "Male",
    blood_group: "O+",
    occupation: "Accountant",
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanId = searchQuery.trim().toUpperCase();

    if (!cleanId) {
      setErrorMessage("Please enter a valid MediBase ID (e.g. MB-102394).");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/staff/lookup-patient", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ medibaseId: cleanId }),
      });

      const data = await res.json();

      if (!res.ok || !data.success || !data.patient) {
        setIdentifiedPatient(null);
        setErrorMessage(data.error || `No registered patient found with MediBase ID "${cleanId}".`);
      } else {
        setIdentifiedPatient(data.patient);
        setErrorMessage(null);
      }
    } catch {
      setErrorMessage("Network error occurred during patient lookup. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectDemoId = (id: string) => {
    setSearchQuery(id);
    setErrorMessage(null);
  };

  return (
    <StaffShell activeNav="find-patient">
      <div className="space-y-8 max-w-5xl">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Find a Patient
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Search by MediBase ID or scan their QR code to securely identify the patient before requesting access.
          </p>
        </div>

        {/* Search Box Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <form onSubmit={handleSearch}>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Patient MediBase ID
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter MediBase ID (e.g., MB-102394 or MB-100001)"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-lg text-sm font-mono text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#006699]"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 bg-[#0F172A] hover:bg-slate-800 disabled:opacity-60 text-white font-medium text-sm rounded-lg transition-colors flex items-center justify-center gap-2 shrink-0 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>Search</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick Demo ID Suggestion Chips */}
          <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#006699]" />
              Quick Demo IDs:
            </span>
            {["MB-102394", "MB-100001", "MB-100002", "MB-100003", "MB-100004"].map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => handleSelectDemoId(id)}
                className="px-2 py-0.5 bg-slate-100 hover:bg-sky-50 hover:text-[#006699] text-slate-700 font-mono text-[11px] rounded border border-slate-200 transition-colors cursor-pointer"
              >
                {id}
              </button>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-center">
            <Link
              href="/staff/scan-qr"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#006699] hover:underline"
            >
              <span>or</span>
              <QrCode className="w-3.5 h-3.5" />
              <span>Scan Patient QR Card instead</span>
            </Link>
          </div>
        </div>

        {/* Error / Not Found Message */}
        {errorMessage && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 text-xs text-rose-800">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold mb-0.5">Patient Not Found</p>
              <p className="text-rose-700 leading-relaxed">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Search Result (Minimal Patient Identification Card) */}
        {identifiedPatient && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                PATIENT IDENTIFIED
              </h2>
              <span className="text-[11px] text-slate-500 flex items-center gap-1">
                <Lock className="w-3 h-3 text-slate-400" />
                Medical records protected until authorized
              </span>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-800 font-bold text-base flex items-center justify-center shrink-0">
                  {identifiedPatient.full_name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase() || "PT"}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-base font-bold text-slate-900">
                      {identifiedPatient.full_name}
                    </h3>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-sky-50 text-sky-700 border border-sky-200">
                      <ShieldCheck className="w-3 h-3" />
                      Verified Patient
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1 font-mono font-semibold text-slate-700">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      {identifiedPatient.medibase_id}
                    </span>
                    <span>•</span>
                    <span>Age: {identifiedPatient.age ?? "32"}</span>
                    <span>•</span>
                    <span>Gender: {identifiedPatient.gender ?? "Male"}</span>
                    <span>•</span>
                    <span>Blood: {identifiedPatient.blood_group ?? "O+"}</span>
                    {identifiedPatient.occupation && (
                      <>
                        <span>•</span>
                        <span className="truncate max-w-[150px]">{identifiedPatient.occupation}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href={`/staff/patient/${identifiedPatient.medibase_id}/authorize`}
                  className="px-5 py-2.5 bg-[#006699] hover:bg-[#005580] text-white font-semibold text-xs rounded-lg transition-colors shadow-sm flex items-center gap-1.5 text-center"
                >
                  <span>Request Access</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Recently Identified Section */}
        <div>
          <h2 className="text-base font-bold text-slate-900 mb-3">
            Recently Accessed Patient Registry
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Patient 1 */}
            <div
              onClick={() => {
                setSearchQuery("MB-100001");
                setIdentifiedPatient({
                  id: "10000000-0000-0000-0000-000000000001",
                  medibase_id: "MB-100001",
                  full_name: "Anjali Mehta",
                  age: 36,
                  gender: "Female",
                  blood_group: "O-",
                  occupation: "School Teacher",
                });
              }}
              className="bg-white border border-slate-200 rounded-xl p-4 hover:border-slate-300 hover:shadow-sm transition-all flex flex-col justify-between cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-slate-900 text-sm">Anjali Mehta</h4>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </div>
              <p className="text-xs font-mono font-semibold text-[#006699] mb-1">MB-100001</p>
              <p className="text-[11px] text-slate-400">School Teacher • Age 36</p>
            </div>

            {/* Patient 2 */}
            <div
              onClick={() => {
                setSearchQuery("MB-100002");
                setIdentifiedPatient({
                  id: "10000000-0000-0000-0000-000000000002",
                  medibase_id: "MB-100002",
                  full_name: "Vikram Singh",
                  age: 50,
                  gender: "Male",
                  blood_group: "A+",
                  occupation: "Farmer",
                });
              }}
              className="bg-white border border-slate-200 rounded-xl p-4 hover:border-slate-300 hover:shadow-sm transition-all flex flex-col justify-between cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-slate-900 text-sm">Vikram Singh</h4>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </div>
              <p className="text-xs font-mono font-semibold text-[#006699] mb-1">MB-100002</p>
              <p className="text-[11px] text-slate-400">Farmer • Age 50</p>
            </div>

            {/* Patient 3 */}
            <div
              onClick={() => {
                setSearchQuery("MB-100003");
                setIdentifiedPatient({
                  id: "10000000-0000-0000-0000-000000000003",
                  medibase_id: "MB-100003",
                  full_name: "Priya Reddy",
                  age: 33,
                  gender: "Female",
                  blood_group: "AB+",
                  occupation: "Marketing Manager",
                });
              }}
              className="bg-white border border-slate-200 rounded-xl p-4 hover:border-slate-300 hover:shadow-sm transition-all flex flex-col justify-between cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-slate-900 text-sm">Priya Reddy</h4>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </div>
              <p className="text-xs font-mono font-semibold text-[#006699] mb-1">MB-100003</p>
              <p className="text-[11px] text-slate-400">Marketing Manager • Age 33</p>
            </div>
          </div>
        </div>
      </div>
    </StaffShell>
  );
}
