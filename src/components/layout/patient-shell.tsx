"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  HelpCircle,
  QrCode,
  Clock,
  KeyRound,
  FileText,
  User,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { getCurrentUserProfile, UserProfile, signOutUser } from "@/lib/supabase/auth-helpers";

interface PatientShellProps {
  children: React.ReactNode;
  activeNav?: string;
  showSidebar?: boolean;
}

export function PatientShell({
  children,
  activeNav,
  showSidebar = true,
}: PatientShellProps) {
  const pathname = usePathname();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const p = await getCurrentUserProfile();
        setProfile(p);
      } catch (err) {
        console.error("Failed to load user profile in shell:", err);
      }
    }
    loadUser();
  }, []);

  const patientName = profile?.full_name || "Rahul Sharma";
  const initials = patientName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "MB";

  const topNavLinks = [
    { label: "Dashboard", href: "/patient/dashboard", key: "dashboard" },
    { label: "Timeline", href: "/patient/timeline", key: "timeline" },
    { label: "Requests", href: "/patient/access-requests", key: "requests" },
    { label: "History", href: "/patient/access-history", key: "history" },
    { label: "ID Card", href: "/patient/identity", key: "identity" },
  ];

  const sidebarLinks = [
    { label: "Dashboard", href: "/patient/dashboard", icon: LayoutDashboard, key: "dashboard" },
    { label: "Medical Timeline", href: "/patient/timeline", icon: Clock, key: "timeline" },
    { label: "Access Requests", href: "/patient/access-requests", icon: KeyRound, key: "requests" },
    { label: "Access History", href: "/patient/access-history", icon: FileText, key: "history" },
    { label: "Digital ID", href: "/patient/identity", icon: QrCode, key: "identity" },
    { label: "Notifications", href: "/patient/notifications", icon: Bell, key: "notifications" },
    { label: "Profile", href: "/patient/dashboard", icon: User, key: "profile" },
  ];

  const isCurrent = (key: string) => {
    if (activeNav) return activeNav === key;
    if (key === "dashboard" && pathname === "/patient/dashboard") return true;
    if (key === "timeline" && pathname.startsWith("/patient/timeline")) return true;
    if (key === "requests" && pathname.startsWith("/patient/access-requests")) return true;
    if (key === "history" && (pathname.startsWith("/patient/access-history") || pathname.startsWith("/patient/history"))) return true;
    if (key === "identity" && (pathname.startsWith("/patient/identity") || pathname.startsWith("/patient/id-card"))) return true;
    if (key === "notifications" && pathname.startsWith("/patient/notifications")) return true;
    return false;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      {/* Top Header */}
      <header className="h-16 bg-white border-b border-slate-200 px-6 sm:px-10 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-8">
          <Link href="/patient/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#0F172A] flex items-center justify-center text-white font-bold text-base">
              M
            </div>
            <span className="font-bold text-slate-900 text-xl tracking-tight">MediBase</span>
          </Link>

          {/* Desktop Top Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {topNavLinks.map((link) => {
              const active = isCurrent(link.key);
              return (
                <Link
                  key={link.key}
                  href={link.href}
                  className={`transition-colors pb-0.5 ${
                    active
                      ? "text-slate-900 font-semibold border-b-2 border-[#006699]"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/patient/notifications"
            className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
          </Link>

          <Link
            href="/patient/timeline"
            className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            title="Help"
          >
            <HelpCircle className="w-4 h-4" />
          </Link>

          {/* Patient User Avatar */}
          <Link
            href="/patient/dashboard"
            className="flex items-center gap-2 pl-2 border-l border-slate-200"
          >
            <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xs">
              {initials}
            </div>
            <span className="hidden sm:inline text-xs font-semibold text-slate-800">
              {patientName}
            </span>
          </Link>
        </div>
      </header>

      {/* Main Body */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-6 sm:p-8">
        {showSidebar ? (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Left Nav Menu */}
            <div className="md:col-span-3 bg-white rounded-xl border border-slate-200 p-3 space-y-1 shadow-sm">
              {sidebarLinks.map((item) => {
                const active = isCurrent(item.key);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.key}
                    href={item.href}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      active
                        ? "bg-sky-50 text-[#006699] font-semibold"
                        : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? "text-[#006699]" : "text-slate-400"}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              <div className="pt-2 border-t border-slate-100 mt-2">
                <button
                  onClick={() => signOutUser("/patient/login")}
                  className="w-full text-left flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  <span>Logout</span>
                </button>
              </div>
            </div>

            {/* Right Main Content */}
            <div className="md:col-span-9">{children}</div>
          </div>
        ) : (
          <div>{children}</div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto py-6 px-6 sm:px-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-800 text-sm">MediBase</span>
          <span>© 2024 MediBase Healthcare. All rights reserved. Secure HIPAA Compliant Portal.</span>
        </div>
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-slate-600">
          <Link href="#" className="hover:underline">Privacy Policy</Link>
          <Link href="#" className="hover:underline">Terms of Service</Link>
          <Link href="#" className="hover:underline">Security Standards</Link>
          <Link href="#" className="hover:underline">Contact Support</Link>
        </div>
      </footer>
    </div>
  );
}
