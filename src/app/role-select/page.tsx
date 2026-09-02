"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Stethoscope, ArrowLeft, ArrowRight, Shield, Activity } from "lucide-react";

export default function RoleSelectPage() {
  const router = useRouter();

  const handleSelectRole = (role: "patient" | "hospital_staff", targetUrl: string) => {
    document.cookie = `medibase_demo_role=${role}; path=/; max-age=604800; SameSite=Lax`;
    router.push(targetUrl);
    router.refresh();
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-sky-500 selection:text-white">
      {/* Top Bar */}
      <header className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md px-6 h-16 flex items-center justify-between">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm font-medium transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
        <div className="flex items-center gap-2 font-bold text-lg text-white">
          <Activity className="w-5 h-5 text-sky-400" />
          <span>Medi<span className="text-sky-400">Base</span></span>
        </div>
        <div className="w-20" />
      </header>

      {/* Main Selection Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 max-w-4xl mx-auto w-full">
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-sky-500/30 bg-sky-950/40 text-sky-300 text-xs font-semibold uppercase tracking-wider">
            <Shield className="w-3.5 h-3.5 text-sky-400" />
            Prototype Role Gateway
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Select Your Portal Experience
          </h1>
          <p className="text-slate-400 text-base max-w-lg mx-auto">
            Choose whether you are exploring MediBase as a patient managing your longitudinal consent or as an authorized healthcare provider.
          </p>
        </div>

        {/* 2 Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
          {/* Patient Card */}
          <button
            type="button"
            onClick={() => handleSelectRole("patient", "/patient/dashboard")}
            className="group relative flex flex-col justify-between p-8 rounded-2xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900 hover:border-sky-500/60 transition-all duration-300 shadow-lg hover:shadow-sky-500/10 hover:-translate-y-1 text-left cursor-pointer"
          >
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-sky-950 border border-sky-800/60 flex items-center justify-center text-sky-400 group-hover:scale-110 group-hover:bg-sky-500 group-hover:text-slate-950 transition-all duration-300">
                <User className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white group-hover:text-sky-300 transition-colors">
                  Patient Portal
                </h2>
                <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                  Access your digital MediBase ID card, review your read-only medical timeline, approve or deny incoming access requests, and inspect audit logs.
                </p>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-800/80 flex items-center justify-between text-sm font-semibold text-sky-400 group-hover:text-sky-300 w-full">
              <span>Open Patient Dashboard</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Hospital Staff Card */}
          <button
            type="button"
            onClick={() => handleSelectRole("hospital_staff", "/staff/dashboard")}
            className="group relative flex flex-col justify-between p-8 rounded-2xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900 hover:border-teal-500/60 transition-all duration-300 shadow-lg hover:shadow-teal-500/10 hover:-translate-y-1 text-left cursor-pointer"
          >
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-teal-950 border border-teal-800/60 flex items-center justify-center text-teal-400 group-hover:scale-110 group-hover:bg-teal-400 group-hover:text-slate-950 transition-all duration-300">
                <Stethoscope className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white group-hover:text-teal-300 transition-colors">
                  Hospital Staff Portal
                </h2>
                <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                  Identify patients via QR scanner or MediBase ID, request authorized access, review structured &ldquo;What&apos;s Changed?&rdquo; clinical deltas, and append new visits.
                </p>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-800/80 flex items-center justify-between text-sm font-semibold text-teal-400 group-hover:text-teal-300 w-full">
              <span>Open Provider Dashboard</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-xs text-slate-500">
          <Link href="/patient/login" className="hover:text-sky-400 transition-colors">
            Patient Login Page
          </Link>
          <span>•</span>
          <Link href="/staff/login" className="hover:text-teal-400 transition-colors">
            Hospital Staff Login Page
          </Link>
        </div>
      </main>
    </div>
  );
}

