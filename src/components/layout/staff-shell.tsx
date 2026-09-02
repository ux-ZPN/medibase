"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutGrid,
  UserSearch,
  QrCode,
  History,
  KeyRound,
  ClipboardList,
  AlertTriangle,
  User,
  LogOut,
  Bell,
  HelpCircle,
  Settings,
  Search,
  ShieldCheck,
  LifeBuoy,
} from "lucide-react";
import { getCurrentUserProfile, UserProfile, signOutUser } from "@/lib/supabase/auth-helpers";
import { normalizeDoctorName } from "@/lib/staff-profile";

interface StaffShellProps {
  children: React.ReactNode;
  activeNav?: string;
  patientHeader?: React.ReactNode;
  portalTitle?: string;
}

export function StaffShell({
  children,
  activeNav,
  patientHeader,
  portalTitle = "Medi Base Staff Portal",
}: StaffShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    async function loadStaff() {
      try {
        const p = await getCurrentUserProfile();
        setProfile(p);
      } catch (err) {
        console.error("Failed to load staff profile in shell:", err);
      }
    }
    loadStaff();
  }, []);

  const rawStaffName = profile?.full_name || "Dr. Sharma";
  const staffName = normalizeDoctorName(rawStaffName);
  const hospitalName = profile?.staff_data?.hospital_name || "City General Hospital";
  const department = profile?.staff_data?.department || "Clinical Division";
  const initials = rawStaffName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "DR";

  const navItems = [
    { label: "Dashboard", href: "/staff/dashboard", icon: LayoutGrid, key: "dashboard" },
    { label: "Find Patient", href: "/staff/find-patient", icon: UserSearch, key: "find-patient" },
    { label: "Scan QR", href: "/staff/scan-qr", icon: QrCode, key: "scan-qr" },
    { label: "Recent Patients", href: "/staff/patient/MB-102394", icon: History, key: "recent-patients" },
    { label: "Access Requests", href: "/staff/access-requests", icon: KeyRound, key: "access-requests" },
    { label: "Audit Logs", href: "/staff/audit-log", icon: ClipboardList, key: "audit-logs" },
    { label: "Emergency Access", href: "/staff/emergency", icon: AlertTriangle, key: "emergency" },
    { label: "Profile", href: "/staff/profile", icon: User, key: "profile" },
  ];

  const isActive = (item: typeof navItems[0]) => {
    if (activeNav) return activeNav === item.key;
    if (item.key === "dashboard" && pathname === "/staff/dashboard") return true;
    if (item.key === "find-patient" && (pathname === "/staff/find-patient" || pathname.startsWith("/staff/find"))) return true;
    if (item.key === "scan-qr" && pathname === "/staff/scan-qr") return true;
    if (item.key === "recent-patients" && (pathname.startsWith("/staff/patient") && !pathname.includes("find"))) return true;
    if (item.key === "access-requests" && pathname.startsWith("/staff/access-requests")) return true;
    if (item.key === "audit-logs" && pathname.startsWith("/staff/audit-log")) return true;
    if (item.key === "emergency" && pathname.startsWith("/staff/emergency")) return true;
    if (item.key === "profile" && pathname.startsWith("/staff/profile")) return true;
    return false;
  };

  return (
    <div className="min-h-screen flex bg-[#F8FAFC]">
      {/* Left Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 fixed inset-y-0 left-0 z-30">
        <div>
          {/* Hospital Branding Header */}
          <div className="p-4 border-b border-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-[#006699] font-bold shadow-sm">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 4v16m-8-8h16" />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="font-bold text-slate-900 text-sm leading-tight truncate" title={hospitalName}>
                {hospitalName}
              </h2>
              <p className="text-xs text-slate-500 truncate">{department}</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const active = isActive(item);
              const Icon = item.icon;
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${active
                      ? "bg-[#006699] text-white shadow-sm"
                      : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                >
                  <Icon className={`w-4 h-4 ${active ? "text-white" : "text-slate-500"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-3 space-y-2 border-t border-slate-100">
          <Link
            href="/staff/emergency"
            className="flex items-center justify-center gap-2 w-full px-3 py-2 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-xs font-semibold rounded-lg transition-colors"
          >
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <span>Emergency Override</span>
          </Link>

          <div className="pt-1 space-y-0.5 text-xs text-slate-600">
            <Link
              href="/staff/profile"
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-700"
            >
              <LifeBuoy className="w-4 h-4 text-slate-400" />
              <span>Support</span>
            </Link>
            <Link
              href="/staff/audit-log"
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-700"
            >
              <ShieldCheck className="w-4 h-4 text-slate-400" />
              <span>Compliance</span>
            </Link>
            <button
              onClick={() => signOutUser("/staff/login")}
              className="w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-slate-400" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col pl-64 min-w-0">
        {/* Top Bar Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <h1 className="font-bold text-slate-900 text-lg">{portalTitle}</h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Global Search */}
            <div className="relative w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search patient ID, name, or MRN..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    router.push("/staff/find-patient");
                  }
                }}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#006699] focus:bg-white"
              />
            </div>

            {/* Quick Action Icons */}
            <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
              <Link
                href="/staff/access-requests"
                className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
              </Link>
              <Link
                href="/staff/profile"
                className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                title="Help"
              >
                <HelpCircle className="w-4 h-4" />
              </Link>
              <Link
                href="/staff/profile"
                className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                title="Settings"
              >
                <Settings className="w-4 h-4" />
              </Link>
            </div>

            {/* Doctor Profile Pill */}
            <Link
              href="/staff/profile"
              className="flex items-center gap-2.5 pl-3 border-l border-slate-200 hover:opacity-90 transition-opacity"
            >
              <div className="text-right">
                <p className="text-xs font-bold text-slate-900 leading-tight">{staffName}</p>
                <p className="text-[11px] text-slate-500">{department}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden border border-slate-300 flex items-center justify-center text-slate-600 font-bold text-xs">
                {initials}
              </div>
            </Link>
          </div>
        </header>

        {/* Optional Patient Header */}
        {patientHeader}

        {/* Page Content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
