"use client";

import React, { useState, useEffect } from "react";
import { StaffShell } from "@/components/layout/staff-shell";
import {
  Shield,
  ShieldCheck,
  Building2,
  Edit,
  Key,
  Fingerprint,
  LogOut,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  ChevronRight,
  CreditCard,
  Award,
} from "lucide-react";
import { getCurrentUserProfile, UserProfile, signOutUser } from "@/lib/supabase/auth-helpers";
import { getMaskedAadhaar } from "@/lib/identity/aadhaar";

export default function StaffProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [biometricEnabled, setBiometricEnabled] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        const p = await getCurrentUserProfile();
        setProfile(p);
      } catch (err) {
        console.error("Failed to load staff profile:", err);
      }
    }
    loadProfile();
  }, []);

  const staffName = profile?.full_name || "Dr. Rahul Kumar";
  const formattedStaffTitle = staffName.startsWith("Dr.") ? staffName : `Dr. ${staffName}`;
  const initials = staffName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "DR";

  const hospitalName = profile?.staff_data?.hospital_name || "City General Hospital";
  const roleName = profile?.staff_data?.role ? `${profile.staff_data.role.toUpperCase()} / Practitioner` : "Senior Physician";
  const licenseNumber = profile?.staff_data?.license_number || "MED-REG-2024-8941";
  const maskedAadhaar = getMaskedAadhaar(profile?.staff_data?.aadhaar_last4);

  return (
    <StaffShell activeNav="profile">
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Profile & Security
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your verified clinical identity, access levels, and credential settings.
          </p>
        </div>

        {/* 2x2 Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Top-Left: Doctor Profile Card (6 cols) */}
          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-8 shadow-sm flex flex-col justify-between text-center space-y-6">
            <div className="space-y-4">
              <div className="w-20 h-20 rounded-2xl bg-slate-800 text-white font-bold text-2xl flex items-center justify-center mx-auto shadow-md">
                {initials}
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">{formattedStaffTitle}</h2>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">{roleName}</p>
                <p className="text-xs text-slate-500 flex items-center justify-center gap-1 mt-1">
                  <Building2 className="w-3.5 h-3.5 text-[#006699]" />
                  <span>{hospitalName}</span>
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left pt-2">
                <div className="bg-sky-50/70 border border-sky-100 rounded-lg p-3 text-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                    CONTACT EMAIL
                  </span>
                  <span className="font-semibold text-slate-900 truncate block">
                    {profile?.email || "doctor@hospital.org"}
                  </span>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5 flex items-center gap-1">
                    <Award className="w-3 h-3 text-[#006699]" />
                    LICENSE / ID
                  </span>
                  <span className="font-mono font-semibold text-slate-900 truncate block">
                    {licenseNumber}
                  </span>
                </div>
              </div>

              {profile?.staff_data?.aadhaar_last4 && (
                <div className="text-left text-xs bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 flex items-center gap-2">
                  <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-slate-500">Verified Aadhaar:</span>
                  <span className="font-mono font-medium text-slate-800">{maskedAadhaar}</span>
                </div>
              )}
            </div>

            <div>
              <button
                onClick={() => alert("Profile details are managed by your hospital clinical administrator.")}
                className="w-full py-2.5 px-4 border border-[#006699] text-[#006699] hover:bg-sky-50 font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Manage Clinical Credentials</span>
              </button>
            </div>
          </div>

          {/* Top-Right: Security Overview Card (6 cols) */}
          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                  <Shield className="w-4 h-4 text-[#006699]" />
                  <span>Security Overview</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-sky-50 text-sky-700 border border-sky-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Verified Provider Role
                </span>
              </div>

              <div className="space-y-3">
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-lg flex items-center gap-3 text-xs">
                  <div className="w-8 h-8 rounded-lg bg-sky-100 text-[#006699] flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Hospital Terminal Session</p>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      Active session verified via Supabase Auth Row Level Security.
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-white border-l-4 border-l-[#006699] border border-slate-200 rounded-lg flex items-center justify-between gap-3 text-xs">
                  <div>
                    <p className="font-bold text-slate-900">Current Facility Scope</p>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      {hospitalName} • Authorized Clinical Network
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom-Left: Access & Permissions (7 cols) */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <ShieldCheck className="w-4 h-4 text-[#006699]" />
                <span>Access & Permissions</span>
              </div>
              <span className="px-2.5 py-0.5 rounded bg-sky-100 text-sky-800 text-xs font-semibold">
                Role: {roleName}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs pt-1">
              {/* Authorized Actions */}
              <div className="space-y-2.5">
                <span className="font-bold text-[#006699] uppercase text-[10px] tracking-wider block">
                  Authorized Actions
                </span>
                <ul className="space-y-2 text-slate-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#006699] shrink-0 mt-0.5" />
                    <span>View authorized clinical records</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#006699] shrink-0 mt-0.5" />
                    <span>Add clinical visits & notes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#006699] shrink-0 mt-0.5" />
                    <span>Upload medical reports</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#006699] shrink-0 mt-0.5" />
                    <span>Request patient-authorized access</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#006699] shrink-0 mt-0.5" />
                    <span>Initiate emergency override protocol</span>
                  </li>
                </ul>
              </div>

              {/* Restricted Actions */}
              <div className="space-y-2.5">
                <span className="font-bold text-rose-600 uppercase text-[10px] tracking-wider block">
                  Restricted Actions
                </span>
                <ul className="space-y-2 text-slate-700">
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <span>Manage hospital staff accounts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <span>Modify or delete secure audit logs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <span>Access patient records without valid clinical purpose or active emergency</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom-Right: Security Settings (5 cols) */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm border-b border-slate-100 pb-3">
                <Key className="w-4 h-4 text-[#006699]" />
                <span>Security Settings</span>
              </div>

              {/* Change Password */}
              <button
                onClick={() => alert("Password management is available in the security portal.")}
                className="w-full p-3.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg flex items-center justify-between text-left transition-colors text-xs cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Key className="w-4 h-4 text-slate-500" />
                  <div>
                    <p className="font-bold text-slate-900">Change Password</p>
                    <p className="text-[11px] text-slate-500">Update your account credentials</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              {/* Biometric Login */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <Fingerprint className="w-4 h-4 text-slate-500" />
                  <div>
                    <p className="font-bold text-slate-900">Biometric Terminal Authentication</p>
                    <p className="text-[11px] text-slate-500">Hardware security key or biometric</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={biometricEnabled}
                  onChange={(e) => setBiometricEnabled(e.target.checked)}
                  className="rounded-full border-slate-300 text-[#006699] focus:ring-[#006699] w-4 h-4 cursor-pointer"
                />
              </div>
            </div>

            <div>
              <button
                onClick={() => signOutUser("/staff/login")}
                className="w-full py-2.5 px-4 border border-rose-300 hover:bg-rose-50 text-rose-700 font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout of Staff Portal</span>
              </button>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="pt-4 border-t border-slate-200 text-center text-xs text-slate-500 flex items-center justify-center gap-1.5">
          <Eye className="w-3.5 h-3.5 text-slate-400" />
          <span>Your activities are monitored and recorded in the secure audit log for HIPAA & NDHM compliance.</span>
        </div>
      </div>
    </StaffShell>
  );
}
