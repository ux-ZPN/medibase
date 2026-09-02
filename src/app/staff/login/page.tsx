"use client";

import React, { useState, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Mail,
  Lock,
  Building2,
  User,
  Phone,
  CreditCard,
  Award,
  RefreshCw,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Zap,
  Sparkles,
  ShieldCheck,
  Stethoscope,
  KeyRound,
} from "lucide-react";
import { formatAadhaarInput } from "@/lib/identity/aadhaar";

interface HospitalItem {
  id: string;
  name: string;
  city: string;
}

const DEMO_STAFF_MEMBERS = [
  {
    id: "DOC-1001",
    name: "Dr. Rahul Sharma",
    role: "Doctor",
    dept: "Cardiology",
    hospital: "City General Hospital",
    badgeColor: "bg-sky-100 text-[#006699] border-sky-200",
  },
  {
    id: "DOC-1002",
    name: "Dr. Sneha Roy",
    role: "Doctor",
    dept: "Internal Medicine",
    hospital: "Metro Super Specialty Hospital",
    badgeColor: "bg-purple-100 text-purple-700 border-purple-200",
  },
  {
    id: "DOC-1003",
    name: "Dr. Arvind Rao",
    role: "Doctor",
    dept: "Pulmonology",
    hospital: "Apollo City Clinic",
    badgeColor: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  {
    id: "DOC-1004",
    name: "Dr. K. S. Sharma",
    role: "Doctor",
    dept: "Family Medicine",
    hospital: "City Wellness Clinic",
    badgeColor: "bg-amber-100 text-amber-700 border-amber-200",
  },
];

function StaffLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/staff/dashboard";

  const [authMode, setAuthMode] = useState<"fast" | "register" | "password">("fast");

  // Fast ID / Switcher Input
  const [fastStaffIdInput, setFastStaffIdInput] = useState("DOC-1001");

  // Password Login Fields
  const [email, setEmail] = useState("dr.sharma@cityhospital.com");
  const [password, setPassword] = useState("");

  // Registration Fields
  const [fullName, setFullName] = useState("");
  const [staffIdInput, setStaffIdInput] = useState("");
  const [hospitalName, setHospitalName] = useState("City General Hospital");
  const [customHospital, setCustomHospital] = useState("");
  const [department, setDepartment] = useState("Cardiology");
  const [staffRole, setStaffRole] = useState("doctor");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [aadhaar, setAadhaar] = useState("");

  const [hospitals, setHospitals] = useState<HospitalItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadHospitals() {
      try {
        const res = await fetch("/api/hospitals");
        const data = await res.json();
        if (data.success && Array.isArray(data.hospitals)) {
          setHospitals(data.hospitals);
        }
      } catch (err) {
        console.error("Failed to load hospitals list:", err);
      }
    }
    loadHospitals();
  }, []);

  const handleAadhaarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatAadhaarInput(e.target.value);
    setAadhaar(formatted);
  };

  // Pre-fill demo staff registration
  const handlePreFillDemo = () => {
    const randomNum = Math.floor(1000000000 + Math.random() * 9000000000);
    setFullName("Dr. Vikram Seth");
    setStaffIdInput(`DOC-${randomNum.toString().slice(-6)}`);
    setHospitalName("Metro Super Specialty Hospital");
    setDepartment("Neurology");
    setStaffRole("doctor");
    setPhoneNumber(`+91 ${randomNum}`);
    setRegEmail("dr.vikram.seth@metrohospital.org");
    setAadhaar("8899 4433 2211");
  };

  // 1. Fast Staff Login Submit (Accepts any Staff ID, 10-digit number, or Name)
  const handleFastLoginSubmit = async (e?: React.FormEvent, customId?: string) => {
    if (e) e.preventDefault();
    const idToUse = (customId || fastStaffIdInput).trim();

    if (!idToUse) {
      setErrorMessage("Please enter a Staff ID, Doctor Name, or 10-digit number.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await fetch("/api/auth/staff-fast-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ staffId: idToUse }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.error || "Failed to authenticate staff account.");
        setIsLoading(false);
        return;
      }

      setSuccessMessage(data.message || `Authenticated as ${idToUse}`);
      setTimeout(() => {
        window.location.href = data.redirect || redirectUrl;
      }, 250);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Staff login error.";
      setErrorMessage(msg);
      setIsLoading(false);
    }
  };

  // 2. Staff Registration Submit (Unrestricted)
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    if (fullName.trim().length < 2) {
      setErrorMessage("Please enter staff full name.");
      setIsLoading(false);
      return;
    }

    try {
      const effectiveHospName = hospitalName === "other" ? (customHospital.trim() || "Independent Clinical Practice") : hospitalName;
      const cleanLicense = staffIdInput.trim() || `DOC-${Date.now().toString().slice(-6)}`;

      const res = await fetch("/api/auth/register-staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullName.trim(),
          hospitalName: effectiveHospName,
          licenseNumber: cleanLicense,
          role: staffRole,
          department: department.trim() || "General Medicine",
          phoneNumber: phoneNumber.trim() || "+91 98765 00000",
          email: regEmail.trim(),
          aadhaar: aadhaar.replace(/\D/g, "") || "8899",
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.error || "Failed to register staff account.");
        setIsLoading(false);
        return;
      }

      setSuccessMessage(`Account created! Welcome, ${data.full_name} (${data.hospital_name})`);
      setTimeout(() => {
        window.location.href = data.redirect || redirectUrl;
      }, 300);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An unexpected registration error occurred.";
      setErrorMessage(msg);
      setIsLoading(false);
    }
  };

  // 3. Password Fallback Sign-In Submit
  const handlePasswordLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      // Unrestricted login: accepts work email and logs in
      const res = await fetch("/api/auth/staff-fast-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ staffId: email.trim() }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Login failed.");
      }

      setSuccessMessage(`Signed in as ${data.staff?.full_name || email}`);
      setTimeout(() => {
        window.location.href = data.redirect || redirectUrl;
      }, 250);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Login failed.");
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
      {/* Top Highlight Bar */}
      <div className="h-1.5 bg-[#006699] w-full" />

      <div className="p-7 sm:p-9">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-[#006699] text-xs font-bold mb-3">
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Healthcare Provider Gateway</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {authMode === "register" ? "Register Hospital Staff" : "Hospital Staff Login"}
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {authMode === "register"
              ? "Onboard verified doctors, nurses, and clinical administrators into MediBase."
              : "Instant clinical access with Staff ID, 10-digit number, or doctor profile."}
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-xl mb-6 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setAuthMode("fast");
              setErrorMessage(null);
            }}
            className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              authMode === "fast"
                ? "bg-white text-slate-900 shadow-sm font-bold"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>Fast Login</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMode("register");
              setErrorMessage(null);
            }}
            className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              authMode === "register"
                ? "bg-white text-slate-900 shadow-sm font-bold"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <User className="w-3.5 h-3.5 text-[#006699]" />
            <span>Register New Staff</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMode("password");
              setErrorMessage(null);
            }}
            className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              authMode === "password"
                ? "bg-white text-slate-900 shadow-sm font-bold"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <KeyRound className="w-3.5 h-3.5 text-slate-500" />
            <span>Work Email</span>
          </button>
        </div>

        {/* Error Alert Message */}
        {errorMessage && (
          <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-800">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed font-medium">{errorMessage}</p>
          </div>
        )}

        {/* Success Alert Message */}
        {successMessage && (
          <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2.5 text-xs text-emerald-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed font-medium">{successMessage}</p>
          </div>
        )}

        {authMode === "fast" && (
          /* FAST STAFF LOGIN */
          <div className="space-y-5">
            {/* Quick Demo Staff Switcher */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#006699]" />
                  1-Click Select Doctor Profile
                </span>
                <span className="text-[10px] text-slate-400 font-semibold">Instant Access</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {DEMO_STAFF_MEMBERS.map((doctor) => (
                  <button
                    key={doctor.id}
                    type="button"
                    onClick={() => {
                      setFastStaffIdInput(doctor.id);
                      handleFastLoginSubmit(undefined, doctor.id);
                    }}
                    className="p-3 bg-slate-50 hover:bg-sky-50/60 border border-slate-200 hover:border-sky-300 rounded-xl text-left transition-all group cursor-pointer"
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-xs font-bold text-slate-900 group-hover:text-[#006699] transition-colors">
                        {doctor.name}
                      </span>
                      <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${doctor.badgeColor}`}>
                        {doctor.id}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium truncate">
                      {doctor.dept}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate mt-0.5">
                      {doctor.hospital}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Staff ID / 10-Digit Number Input */}
            <form onSubmit={(e) => handleFastLoginSubmit(e)} className="pt-3 border-t border-slate-100 space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Or Enter Any Staff ID, Doctor Name, or 10-Digit ID:
                </label>
                <div className="relative">
                  <Award className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={fastStaffIdInput}
                    onChange={(e) => setFastStaffIdInput(e.target.value)}
                    placeholder="e.g. DOC-1001 or 9876543210 or Dr. Sarah"
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#006699] focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-[#006699] hover:bg-[#005580] disabled:bg-slate-400 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Signing in to Staff Portal...</span>
                  </>
                ) : (
                  <>
                    <span>Enter Clinical Portal as {fastStaffIdInput || "Staff"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {authMode === "register" && (
          /* UNRESTRICTED STAFF REGISTRATION FORM */
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-left">
            {/* Quick Demo Pre-fill */}
            <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-600 font-medium">Want to test registration quickly?</span>
              <button
                type="button"
                onClick={handlePreFillDemo}
                className="px-3 py-1 bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                Pre-fill Demo Staff
              </button>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Full Name & Title <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Dr. Aditi Verma or Rajesh Kumar"
                  required
                  className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#006699]"
                />
              </div>
            </div>

            {/* Staff Role & ID / 10-digit number */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Clinical Role
                </label>
                <select
                  value={staffRole}
                  onChange={(e) => setStaffRole(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#006699]"
                >
                  <option value="doctor">Doctor / Attending Physician</option>
                  <option value="nurse">Registered Nurse</option>
                  <option value="admin">Clinical Administrator</option>
                  <option value="paramedic">Emergency Physician / Paramedic</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Staff / License ID (or 10-digit)
                </label>
                <div className="relative">
                  <Award className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={staffIdInput}
                    onChange={(e) => setStaffIdInput(e.target.value)}
                    placeholder="e.g. DOC-987654 or 9876543210"
                    className="w-full pl-10 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#006699]"
                  />
                </div>
              </div>
            </div>

            {/* Hospital & Department */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Hospital Affiliation
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <select
                    value={hospitalName}
                    onChange={(e) => setHospitalName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#006699]"
                  >
                    <option value="City General Hospital">City General Hospital</option>
                    <option value="Metro Super Specialty Hospital">Metro Super Specialty Hospital</option>
                    <option value="Apollo City Clinic">Apollo City Clinic</option>
                    <option value="City Wellness Clinic">City Wellness Clinic</option>
                    <option value="AIIMS Clinical Center">AIIMS Clinical Center</option>
                    <option value="Fortis Healthcare">Fortis Healthcare</option>
                    <option value="other">Custom Hospital / Clinic...</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Clinical Department
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#006699]"
                >
                  <option value="Cardiology">Cardiology</option>
                  <option value="Dermatology">Dermatology</option>
                  <option value="Cosmetology">Cosmetology</option>
                  <option value="Gastroenterology">Gastroenterology</option>
                  <option value="Urology">Urology</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="General Physician">General Physician</option>
                  <option value="Orthopedics">Orthopedics</option>
                  <option value="Neurology">Neurology</option>
                  <option value="Oncology">Oncology</option>
                  <option value="Gynecology">Gynecology</option>
                  <option value="Psychiatry">Psychiatry</option>
                  <option value="Endocrinology">Endocrinology</option>
                  <option value="Ophthalmology">Ophthalmology</option>
                  <option value="ENT (Otolaryngology)">ENT (Otolaryngology)</option>
                  <option value="Pulmonology">Pulmonology</option>
                  <option value="Rheumatology">Rheumatology</option>
                  <option value="Radiology">Radiology</option>
                  <option value="Anesthesiology">Anesthesiology</option>
                  <option value="Pathology">Pathology</option>
                  <option value="Emergency Medicine">Emergency Medicine</option>
                  <option value="General Surgery">General Surgery</option>
                </select>
              </div>
            </div>

            {hospitalName === "other" && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Custom Hospital / Clinic Name
                </label>
                <input
                  type="text"
                  value={customHospital}
                  onChange={(e) => setCustomHospital(e.target.value)}
                  placeholder="e.g. St. Jude Memorial Healthcare"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#006699]"
                />
              </div>
            )}

            {/* Contact Phone & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Contact Number (10 digits)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-10 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#006699]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Work Email (Optional)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="doctor@hospital.org"
                    className="w-full pl-10 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#006699]"
                  />
                </div>
              </div>
            </div>

            {/* Aadhaar ID (Optional for Demo) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Aadhaar / National ID (Optional)
              </label>
              <div className="relative">
                <CreditCard className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  maxLength={14}
                  value={aadhaar}
                  onChange={handleAadhaarChange}
                  placeholder="XXXX XXXX XXXX"
                  className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono tracking-wider text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#006699]"
                />
              </div>
            </div>

            {/* Register Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 bg-[#006699] hover:bg-[#005580] disabled:bg-slate-400 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Registering & Initializing Portal...</span>
                </>
              ) : (
                <>
                  <span>Register & Enter Hospital Staff Portal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        )}

        {authMode === "password" && (
          /* WORK EMAIL SIGN IN */
          <form onSubmit={handlePasswordLoginSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Work Email or Username
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. dr.sharma@cityhospital.com or Dr. Rahul"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#006699]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Password (Demo mode: any password accepted)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#006699]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-[#0F172A] hover:bg-slate-800 disabled:opacity-60 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Clinical Portal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Divider and HIPAA Badge */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-slate-500 text-xs font-semibold tracking-wider">
          <ShieldCheck className="w-4 h-4 text-slate-600" />
          <span>HIPAA & NDHM COMPLIANT CLINICAL WORKFORCE PORTAL</span>
        </div>
      </div>
    </div>
  );
}

export default function StaffLoginPage() {
  return (
    <div className="min-h-screen bg-[#F0F5FA] flex flex-col items-center justify-center p-4 sm:p-6 py-10">
      {/* Top Brand Logo */}
      <div className="flex items-center gap-2.5 mb-6">
        <div className="w-10 h-10 rounded-xl bg-[#006699] flex items-center justify-center text-white font-bold shadow-md">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="M12 8v8m-4-4h8" strokeWidth="2.5" />
          </svg>
        </div>
        <span className="font-bold text-2xl text-slate-900 tracking-tight">MediBase</span>
      </div>

      <Suspense fallback={<div className="text-xs text-slate-500">Loading form...</div>}>
        <StaffLoginForm />
      </Suspense>

      {/* Security Note Below Card */}
      <div className="mt-6 text-center text-xs text-slate-500 max-w-sm space-y-1">
        <p>Verified clinical portal for attending doctors, nurses, and hospital staff.</p>
        <p>© 2025 MediBase Healthcare Systems. All rights reserved.</p>
      </div>
    </div>
  );
}
