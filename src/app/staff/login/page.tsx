"use client";

import React, { useState, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  AlertCircle,
  Building2,
  User,
  Phone,
  CreditCard,
  Award,
  RefreshCw,
  ArrowRight,
  CheckCircle2,
  Zap,
  Sparkles,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { formatAadhaarInput, isValidAadhaar, sanitizeAadhaar } from "@/lib/identity/aadhaar";

interface HospitalItem {
  id: string;
  name: string;
  city: string;
}

function StaffLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/staff/dashboard";

  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  // Sign In Fields
  const [email, setEmail] = useState("dr.sharma@cityhospital.com");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Registration Fields
  const [fullName, setFullName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [hospitalId, setHospitalId] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [staffRole, setStaffRole] = useState("doctor");
  const [department, setDepartment] = useState("Cardiology");
  const [regPassword, setRegPassword] = useState("");

  const [hospitals, setHospitals] = useState<HospitalItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadHospitals() {
      try {
        const res = await fetch("/api/hospitals");
        const data = await res.json();
        if (data.success && Array.isArray(data.hospitals)) {
          setHospitals(data.hospitals);
          if (data.hospitals.length > 0) {
            setHospitalId(data.hospitals[0].id);
          }
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

  // 1-Click Quick Demo Sign-In (For Testing)
  const handleQuickDemoLogin = async () => {
    setDemoLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      document.cookie = "medibase_demo_role=hospital_staff; path=/; max-age=604800; SameSite=Lax";

      // 1. Call server demo-login endpoint to seed default staff DB record
      const res = await fetch("/api/auth/demo-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: "hospital_staff" }),
      });

      const data = await res.json().catch(() => ({}));

      // 2. Also try sign in on client supabase instance
      try {
        const supabase = createClient();
        await supabase.auth.signInWithPassword({
          email: "demo.doctor@cityhospital.com",
          password: "DemoDoctor2024!",
        });
      } catch (e) {
        console.warn("Client supabase signIn ignored in demo mode", e);
      }

      setSuccessMessage("Authenticated as default test doctor: Dr. Rahul Sharma");
      setTimeout(() => {
        window.location.href = data.redirect || "/staff/dashboard";
      }, 300);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to execute quick test login.";
      setErrorMessage(msg);
      setDemoLoading(false);
    }
  };

  // 1. Staff Sign In Submit
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) {
        setErrorMessage(
          error.message === "Invalid login credentials"
            ? "Invalid work email or password. Please verify your credentials."
            : error.message
        );
        setIsLoading(false);
        return;
      }

      if (!data.user) {
        setErrorMessage("Authentication failed. Please try again.");
        setIsLoading(false);
        return;
      }

      // Check role directly (never trust client)
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .maybeSingle();

      if (profile?.role === "patient") {
        await supabase.auth.signOut();
        setErrorMessage("Access restricted. This portal is for authorized healthcare personnel only.");
        setIsLoading(false);
        return;
      }

      // Complete staff onboarding / sync session
      await fetch("/api/auth/complete-staff-onboarding", { method: "POST" }).catch(() => {});

      router.push(redirectUrl);
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An unexpected error occurred.";
      setErrorMessage(msg);
      setIsLoading(false);
    }
  };

  // 2. Staff Registration Submit
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    if (fullName.trim().length < 2) {
      setErrorMessage("Please enter your full legal name.");
      setIsLoading(false);
      return;
    }

    if (!isValidAadhaar(aadhaar)) {
      setErrorMessage("Please enter a valid 12-digit Aadhaar ID number.");
      setIsLoading(false);
      return;
    }

    if (!licenseNumber.trim()) {
      setErrorMessage("Please enter your medical license or employee registration ID.");
      setIsLoading(false);
      return;
    }

    if (regPassword.length < 6) {
      setErrorMessage("Password must be at least 6 characters.");
      setIsLoading(false);
      return;
    }

    try {
      const selectedHospital = hospitals.find((h) => h.id === hospitalId);
      const hospitalName = selectedHospital?.name || "City General Hospital";

      const res = await fetch("/api/auth/register-staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullName.trim(),
          hospitalId: hospitalId || undefined,
          hospitalName: hospitalName,
          email: regEmail.trim().toLowerCase(),
          phoneNumber: phoneNumber.trim(),
          aadhaar: sanitizeAadhaar(aadhaar),
          licenseNumber: licenseNumber.trim(),
          role: staffRole,
          department: department.trim(),
          password: regPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.error || "Failed to register hospital staff account.");
        setIsLoading(false);
        return;
      }

      // Auto sign-in
      const supabase = createClient();
      await supabase.auth.signInWithPassword({
        email: regEmail.trim().toLowerCase(),
        password: regPassword,
      });

      // Complete staff onboarding / sync session
      await fetch("/api/auth/complete-staff-onboarding", { method: "POST" }).catch(() => {});

      router.push(redirectUrl);
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An unexpected registration error occurred.";
      setErrorMessage(msg);
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Top Highlight Bar */}
      <div className="h-1.5 bg-[#006699] w-full" />

      <div className="p-8 sm:p-10">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-slate-900 mb-1.5">
            {authMode === "login" ? "Hospital Staff Login" : "Hospital Staff Onboarding"}
          </h1>
          <p className="text-sm text-slate-500">
            {authMode === "login"
              ? "Authorized healthcare personnel and clinical providers only."
              : "Register your verified clinical credentials with MediBase."}
          </p>
        </div>

        {/* 1-Click Quick Demo Sign-In Box (For Testing) */}
        <div className="mb-6 p-3 bg-gradient-to-r from-sky-50 to-teal-50 border border-sky-200 rounded-xl text-left shadow-sm">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#006699] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#006699]" />
              Quick Test Sign In
            </span>
            <span className="text-[10px] font-mono font-bold text-sky-800 bg-sky-100 px-2 py-0.5 rounded border border-sky-200">
              City General Hospital
            </span>
          </div>
          <p className="text-xs text-slate-600 mb-2.5">
            Click below to instantly open the default healthcare provider account (Dr. Rahul Sharma) without entering credentials.
          </p>
          <button
            type="button"
            onClick={handleQuickDemoLogin}
            disabled={demoLoading}
            className="w-full py-2.5 px-3 bg-[#006699] hover:bg-[#005580] disabled:opacity-60 text-white font-bold text-xs rounded-lg transition-all duration-150 flex items-center justify-center gap-2 shadow cursor-pointer"
          >
            {demoLoading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Signing in to Doctor Account...</span>
              </>
            ) : (
              <>
                <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                <span>Open Default Account (Dr. Rahul Sharma)</span>
              </>
            )}
          </button>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-xl mb-6 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setAuthMode("login");
              setErrorMessage(null);
            }}
            className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
              authMode === "login"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Staff Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMode("register");
              setErrorMessage(null);
            }}
            className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
              authMode === "register"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Register New Staff
          </button>
        </div>

        {/* Error Alert Message */}
        {errorMessage && (
          <div className="mb-6 p-3.5 bg-rose-50 border border-rose-200 rounded-lg flex items-start gap-2.5 text-xs text-rose-800">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed font-medium">{errorMessage}</p>
          </div>
        )}

        {/* Success Alert Message */}
        {successMessage && (
          <div className="mb-6 p-3.5 bg-emerald-50 border border-emerald-200 rounded-lg flex items-start gap-2.5 text-xs text-emerald-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed font-medium">{successMessage}</p>
          </div>
        )}

        {authMode === "login" ? (
          /* STAFF LOGIN FORM */
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {/* Work Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Work Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="dr.sharma@cityhospital.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#006699] focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#006699] focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-[#006699] focus:ring-[#006699]"
                />
                <span>Remember this terminal</span>
              </label>
              <span className="text-[#006699] cursor-pointer hover:underline">
                Forgot credentials?
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-[#0F172A] hover:bg-slate-800 disabled:opacity-60 text-white font-medium text-sm rounded-lg shadow transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Clinical Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          /* STAFF REGISTRATION FORM */
          <form onSubmit={handleRegisterSubmit} className="space-y-4 text-left">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Dr. Ananya Iyer"
                  required
                  className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#006699]"
                />
              </div>
            </div>

            {/* Hospital Affiliation & Department Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Hospital Affiliation <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <select
                    value={hospitalId}
                    onChange={(e) => setHospitalId(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#006699]"
                  >
                    {hospitals.map((h) => (
                      <option key={h.id} value={h.id}>
                        {h.name}
                      </option>
                    ))}
                    {hospitals.length === 0 && (
                      <option value="">City General Hospital</option>
                    )}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Department
                </label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="Cardiology / General"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#006699]"
                />
              </div>
            </div>

            {/* Role & License Number Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Clinical Role <span className="text-rose-500">*</span>
                </label>
                <select
                  value={staffRole}
                  onChange={(e) => setStaffRole(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#006699]"
                >
                  <option value="doctor">Doctor / Physician</option>
                  <option value="nurse">Registered Nurse</option>
                  <option value="admin">Clinical Administrator</option>
                  <option value="paramedic">Paramedic / Emergency</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  License / Staff ID <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Award className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    placeholder="MED-REG-84920"
                    required
                    className="w-full pl-10 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#006699]"
                  />
                </div>
              </div>
            </div>

            {/* Email & Phone Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Work Email <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="dr.iyer@cityhospital.com"
                    required
                    className="w-full pl-10 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#006699]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Contact Phone <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+91 98765 43210"
                    required
                    className="w-full pl-10 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#006699]"
                  />
                </div>
              </div>
            </div>

            {/* Aadhaar ID */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Aadhaar ID (12 Digits) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <CreditCard className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  maxLength={14}
                  value={aadhaar}
                  onChange={handleAadhaarChange}
                  placeholder="XXXX XXXX XXXX"
                  required
                  className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono tracking-wider text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#006699]"
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">Encrypted hash stored for verified healthcare provider registry.</p>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  required
                  minLength={6}
                  className="w-full pl-10 pr-10 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#006699]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 bg-[#0F172A] hover:bg-slate-800 disabled:opacity-60 text-white font-medium text-sm rounded-lg shadow transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Registering Account...</span>
                </>
              ) : (
                <>
                  <span>Register & Access Staff Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Divider and HIPAA Badge */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-slate-500 text-xs font-semibold tracking-wider">
          <ShieldCheck className="w-4 h-4 text-slate-600" />
          <span>HIPAA & NDHM COMPLIANT SYSTEM</span>
        </div>
      </div>
    </div>
  );
}

export default function StaffLoginPage() {
  return (
    <div className="min-h-screen bg-[#F0F5FA] flex flex-col items-center justify-center p-4 sm:p-6 py-10">
      {/* Top Brand Logo */}
      <div className="flex items-center gap-2 mb-6">
        <div className="w-9 h-9 rounded-lg bg-[#006699] flex items-center justify-center text-white font-bold">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
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
        <p>Use of this system is restricted to authorized MediBase personnel. All activity is logged and monitored.</p>
        <p>© 2024 MediBase Healthcare Systems. All rights reserved.</p>
      </div>
    </div>
  );
}
