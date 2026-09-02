"use client";

import React, { useState, Suspense, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Shield,
  Phone,
  Mail,
  User,
  CreditCard,
  Lock,
  HelpCircle,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  Zap,
  Sparkles,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { formatAadhaarInput, isValidAadhaar, sanitizeAadhaar } from "@/lib/identity/aadhaar";

function PatientLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/patient/dashboard";

  // Tab State: "fast" vs "register" vs "login"
  const [authMode, setAuthMode] = useState<"fast" | "register" | "login">("fast");

  // Fast Login Field
  const [medibaseIdInput, setMedibaseIdInput] = useState("MB-100001");
  const [fastLoading, setFastLoading] = useState(false);

  // Registration Fields
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [aadhaar, setAadhaar] = useState("");

  // Login Field
  const [loginEmail, setLoginEmail] = useState("");

  // OTP Verification State
  const [otpSent, setOtpSent] = useState(false);
  const [activeEmail, setActiveEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const handleAadhaarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatAadhaarInput(e.target.value);
    setAadhaar(formatted);
  };

  // Fast Login with MediBase ID (e.g., MB-100001)
  const handleFastLoginSubmit = async (e?: React.FormEvent, customId?: string) => {
    if (e) e.preventDefault();
    const idToUse = (customId || medibaseIdInput).trim().toUpperCase();

    if (!idToUse) {
      setErrorMessage("Please enter a valid MediBase ID (e.g. MB-100001).");
      return;
    }

    setFastLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await fetch("/api/auth/fast-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ medibaseId: idToUse }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.error || "Failed to log in with this MediBase ID.");
        setFastLoading(false);
        return;
      }

      setSuccessMessage(data.message || `Authenticated as ${idToUse}`);
      setTimeout(() => {
        window.location.href = data.redirect || redirectUrl;
      }, 250);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An unexpected error occurred during fast login.";
      setErrorMessage(msg);
      setFastLoading(false);
    }
  };

  // 1-Click Quick Demo Sign-In (For Testing)
  const handleQuickDemoLogin = async () => {
    handleFastLoginSubmit(undefined, "MB-102394");
  };

  // 1. Submit Registration Form
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // Validation
    if (fullName.trim().length < 2) {
      setErrorMessage("Please enter your full legal name (minimum 2 characters).");
      return;
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    const cleanPhone = phoneNumber.replace(/\D/g, "");
    if (cleanPhone.length < 10) {
      setErrorMessage("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (!isValidAadhaar(aadhaar)) {
      setErrorMessage("Please enter a valid 12-digit Aadhaar ID number.");
      return;
    }

    setLoading(true);

    try {
      const demoEmail = email.trim().toLowerCase();
      setActiveEmail(demoEmail);
      setOtpSent(true);
      setResendCooldown(0);
      setSuccessMessage("Demo verification enabled. Enter any 6-digit code to continue instantly.");
      setOtp(["", "", "", "", "", ""]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An unexpected error occurred.";
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  // 2. Submit Sign In Form (Existing Patient Email OTP)
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!loginEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginEmail.trim())) {
      setErrorMessage("Please enter your registered email address.");
      return;
    }

    setLoading(true);

    try {
      const cleanEmail = loginEmail.trim().toLowerCase();
      setActiveEmail(cleanEmail);
      setOtpSent(true);
      setResendCooldown(0);
      setSuccessMessage("Demo verification enabled. Enter any 6-digit code to continue instantly.");
      setOtp(["", "", "", "", "", ""]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An unexpected error occurred.";
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  // 3. Resend OTP handler
  const handleResendOtp = async () => {
    if (!activeEmail) return;
    setLoading(true);
    setErrorMessage(null);

    try {
      setSuccessMessage("Demo code refreshed. Enter any 6-digit code to continue instantly.");
      setOtp(["", "", "", "", "", ""]);
      setResendCooldown(0);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to resend code.";
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  // 4. Verify 6-digit Email OTP & Complete Onboarding
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = otp.join("").trim();

    if (token.length !== 6 || !/^\d{6}$/.test(token)) {
      setErrorMessage("Please enter the complete 6-digit verification code.");
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage("Verification successful. Redirecting to your patient portal...");

    try {
      const onboardResponse = await fetch("/api/auth/complete-patient-onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const onboardData = await onboardResponse.json();

      if (!onboardResponse.ok || !onboardData.success) {
        setErrorMessage(onboardData.error || "Failed to initialize MediBase ID. Please retry.");
        setLoading(false);
        return;
      }

      router.push(redirectUrl);
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An unexpected verification error occurred.";
      setErrorMessage(msg);
      setLoading(false);
    }
  };

  // Handle pasting full 6-digit code
  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").trim().replace(/\D/g, "");
    if (pasted.length === 6) {
      const digits = pasted.split("");
      setOtp(digits);
      const lastInput = document.getElementById("otp-5");
      lastInput?.focus();
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 p-8 sm:p-10 shadow-sm text-center">
      {/* Top Shield Badge */}
      <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-[#006699] mx-auto mb-6">
        <Shield className="w-6 h-6 stroke-[1.75]" />
      </div>

      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
        {otpSent
          ? "Verify your Identity"
          : authMode === "fast"
          ? "Fast Patient Login"
          : authMode === "register"
          ? "Register with MediBase"
          : "Access your MediBase"}
      </h1>

      <p className="text-sm text-slate-500 mb-6 max-w-xs mx-auto">
        {otpSent
          ? `Demo verification is on. Enter any 6-digit code for ${activeEmail || "this account"}.`
          : authMode === "fast"
          ? "Enter your unique MediBase ID (e.g. MB-100001) for instant access."
          : authMode === "register"
          ? "Create your longitudinal health profile and receive a unique MediBase ID."
          : "Enter your registered email to receive a secure login code."}
      </p>

      {/* Tabs Switcher (Only shown before OTP is sent) */}
      {!otpSent && (
        <div className="flex bg-slate-100 p-1 rounded-xl mb-6 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setAuthMode("fast");
              setErrorMessage(null);
            }}
            className={`flex-1 py-2 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              authMode === "fast"
                ? "bg-[#006699] text-white shadow-sm font-bold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Fast Login</span>
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
            New Patient
          </button>
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
            Email OTP
          </button>
        </div>
      )}

      {/* Error Alert Message */}
      {errorMessage && (
        <div className="mb-6 p-3.5 bg-rose-50 border border-rose-200 rounded-lg flex items-start gap-2.5 text-xs text-rose-800 text-left">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed font-medium">{errorMessage}</p>
        </div>
      )}

      {/* Success Banner */}
      {successMessage && (
        <div className="mb-6 p-3.5 bg-emerald-50 border border-emerald-200 rounded-lg flex items-start gap-2.5 text-xs text-emerald-800 text-left">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed font-medium">{successMessage}</p>
        </div>
      )}

      {!otpSent ? (
        authMode === "fast" ? (
          /* FAST LOGIN FORM */
          <form onSubmit={handleFastLoginSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Patient MediBase ID <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <CreditCard className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={medibaseIdInput}
                  onChange={(e) => setMedibaseIdInput(e.target.value.toUpperCase())}
                  placeholder="e.g. MB-100001 or MB-102394"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm font-mono text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#006699] focus:border-transparent transition-all tracking-wider"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Enter your unique MediBase ID number to directly open your account.
              </p>
            </div>

            {/* Quick Demo ID Suggestion Chips */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1.5 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-[#006699]" />
                Select a Test Patient Account:
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: "MB-100001", name: "Priya Sharma" },
                  { id: "MB-100002", name: "Rajesh Gupta" },
                  { id: "MB-100003", name: "Ananya Roy" },
                  { id: "MB-102394", name: "Rahul Sharma" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setMedibaseIdInput(item.id);
                      handleFastLoginSubmit(undefined, item.id);
                    }}
                    className="p-1.5 px-2 bg-white hover:bg-sky-50 hover:border-sky-300 text-slate-700 hover:text-[#006699] font-mono text-[11px] rounded border border-slate-200 transition-colors flex items-center justify-between cursor-pointer shadow-xs text-left"
                  >
                    <span className="font-bold">{item.id}</span>
                    <span className="text-[10px] text-slate-500 font-sans truncate ml-1">{item.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={fastLoading}
              className="w-full py-3 px-4 bg-[#0F172A] hover:bg-slate-800 disabled:opacity-60 text-white font-medium text-sm rounded-lg shadow transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {fastLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Logging into Account...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span>Fast Login to Patient Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        ) : authMode === "register" ? (
          /* PATIENT REGISTRATION FORM */
          <div className="space-y-4 text-left">
            <Link
              href="/patient/register"
              className="block p-3.5 bg-gradient-to-r from-sky-50 to-indigo-50 border border-sky-200 rounded-xl hover:border-sky-300 transition-all shadow-sm group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#006699] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Full Registration & Past History Upload
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-[#006699] group-hover:translate-x-0.5 transition-transform" />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Enter vitals, allergies, emergency contacts, and past medical history to get a new MediBase ID.
              </p>
            </Link>

            <form onSubmit={handleRegisterSubmit} className="space-y-4 text-left">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Verification OTP will be sent to this email.</p>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Phone Number <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+91 98765 43210"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Aadhaar ID */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
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
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm font-mono text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all tracking-wider"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Strictly encrypted. Never stored in plaintext, URLs, or QR codes.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 bg-black hover:bg-slate-800 disabled:opacity-60 text-white font-medium text-sm rounded-lg transition-colors shadow flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Initiating Verification...</span>
                </>
              ) : (
                <>
                  <span>Send Verification Code</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      ) : (
          /* PATIENT LOGIN FORM */
          <form onSubmit={handleLoginSubmit} className="space-y-5 text-left">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Registered Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-black hover:bg-slate-800 disabled:opacity-60 text-white font-medium text-sm rounded-lg transition-colors shadow flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Sending Code...</span>
                </>
              ) : (
                <>
                  <span>Send OTP</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )
      ) : (
        /* OTP VERIFICATION VIEW */
        <form onSubmit={handleVerifyOtp} className="space-y-6">
          <div className="flex justify-center gap-2" onPaste={handleOtpPaste}>
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                value={otp[index]}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "");
                  const newOtp = [...otp];
                  newOtp[index] = val;
                  setOtp(newOtp);
                  if (val && index < 5) {
                    const nextInput = document.getElementById(`otp-${index + 1}`);
                    nextInput?.focus();
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Backspace" && !otp[index] && index > 0) {
                    const prevInput = document.getElementById(`otp-${index - 1}`);
                    prevInput?.focus();
                  }
                }}
                id={`otp-${index}`}
                className="w-11 h-12 text-center text-lg font-bold border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black bg-white text-slate-900"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-black hover:bg-slate-800 disabled:opacity-60 text-white font-medium text-sm rounded-lg transition-colors shadow flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Verifying & Onboarding...</span>
              </>
            ) : (
              <>
                <span>Verify & Access Portal</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="flex items-center justify-between text-xs pt-2">
            <button
              type="button"
              onClick={() => {
                setOtpSent(false);
                setErrorMessage(null);
                setSuccessMessage(null);
                setOtp(["", "", "", "", "", ""]);
              }}
              className="font-semibold text-slate-500 hover:text-slate-900 cursor-pointer"
            >
              ← Back to Details
            </button>

            <button
              type="button"
              disabled={resendCooldown > 0 || loading}
              onClick={handleResendOtp}
              className="font-semibold text-[#006699] hover:underline disabled:text-slate-400 disabled:no-underline cursor-pointer"
            >
              {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend Code"}
            </button>
          </div>
        </form>
      )}

      {/* Security Subtext */}
      <div className="mt-8 pt-6 border-t border-slate-100 text-xs text-slate-500 space-y-2">
        <p>Your identity is verified securely via HIPAA & NDHM-compliant protocols.</p>
        <div className="flex items-center justify-center gap-1.5 text-[#006699] font-medium">
          <Lock className="w-3.5 h-3.5" />
          <span>Secure AES-256 Multi-Factor Auth</span>
        </div>
      </div>
    </div>
  );
}

export default function PatientLoginPage() {
  return (
    <div className="min-h-screen bg-[#F0F5FA] flex flex-col justify-between">
      {/* Top Header */}
      <header className="px-8 py-5 border-b border-slate-200 bg-white flex items-center justify-between">
        <Link href="/" className="font-bold text-2xl text-slate-900 tracking-tight">
          MediBase
        </Link>
        <div className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-slate-900 cursor-pointer">
          <span>Support</span>
          <HelpCircle className="w-4 h-4" />
        </div>
      </header>

      {/* Main Authentication Card */}
      <main className="flex-1 flex items-center justify-center p-4 py-8">
        <Suspense fallback={<div className="text-xs text-slate-500">Loading form...</div>}>
          <PatientLoginForm />
        </Suspense>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-800">MediBase</span>
          <span>© 2024 MediBase Healthcare. All rights reserved. Secure HIPAA Compliant Portal.</span>
        </div>
        <div className="flex flex-wrap items-center gap-6">
          <Link href="#" className="hover:text-slate-900 transition-colors">Privacy Policy</Link>
          <Link href="#" className="hover:text-slate-900 transition-colors">Terms of Service</Link>
          <Link href="#" className="hover:text-slate-900 transition-colors">Security Standards</Link>
          <Link href="#" className="hover:text-slate-900 transition-colors">Contact Support</Link>
        </div>
      </footer>
    </div>
  );
}
