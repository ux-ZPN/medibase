"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutGrid,
  UserSearch,
  UserPlus,
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

interface StaffNotification {
  id: string;
  recipient_type: string;
  recipient_id: string;
  title: string;
  message: string;
  type: string;
  category: string;
  reference_id?: string;
  action_url?: string;
  is_read: boolean;
  created_at: string;
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
  const [notifications, setNotifications] = useState<StaffNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifOpen, setNotifOpen] = useState(false);

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

    async function loadNotifications() {
      try {
        const res = await fetch("/api/staff/notifications");
        const data = await res.json();
        if (data.success && Array.isArray(data.notifications)) {
          setNotifications(data.notifications);
          setUnreadCount(data.unread_count || 0);
        }
      } catch (err) {
        console.error("Failed to load staff notifications:", err);
      }
    }
    loadNotifications();
    const interval = setInterval(loadNotifications, 4000);
    return () => clearInterval(interval);
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
    { label: "Register Patient", href: "/staff/register-patient", icon: UserPlus, key: "register-patient" },
    { label: "Find Patient", href: "/staff/find-patient", icon: UserSearch, key: "find-patient" },
    { label: "Scan QR", href: "/staff/scan-qr", icon: QrCode, key: "scan-qr" },
    { label: "Recent Patients", href: "/staff/patient/MB-100001/timeline", icon: History, key: "recent-patients" },
    { label: "Access Requests", href: "/staff/access-requests", icon: KeyRound, key: "access-requests" },
    { label: "Audit Logs", href: "/staff/audit-log", icon: ClipboardList, key: "audit-logs" },
    { label: "Emergency Access", href: "/staff/emergency", icon: AlertTriangle, key: "emergency" },
    { label: "Profile", href: "/staff/profile", icon: User, key: "profile" },
  ];

  const isActive = (item: typeof navItems[0]) => {
    if (activeNav) return activeNav === item.key;
    if (item.key === "dashboard" && pathname === "/staff/dashboard") return true;
    if (item.key === "register-patient" && (pathname === "/staff/register-patient" || pathname.startsWith("/staff/register"))) return true;
    if (item.key === "find-patient" && (pathname === "/staff/find-patient" || pathname.startsWith("/staff/find"))) return true;
    if (item.key === "scan-qr" && pathname === "/staff/scan-qr") return true;
    if (item.key === "recent-patients" && (pathname.startsWith("/staff/patient") && !pathname.includes("find"))) return true;
    if (item.key === "access-requests" && pathname.startsWith("/staff/access-requests")) return true;
    if (item.key === "audit-logs" && pathname.startsWith("/staff/audit-log")) return true;
    if (item.key === "emergency" && pathname.startsWith("/staff/emergency")) return true;
    if (item.key === "profile" && pathname.startsWith("/staff/profile")) return true;
    return false;
  };

  const handleNotificationClick = async (notif: StaffNotification) => {
    setNotifOpen(false);
    try {
      await fetch(`/api/staff/notifications/${notif.id}/read`, { method: "POST" });
    } catch {
      // Non-blocking
    }
    const targetUrl = notif.action_url || "/staff/access-requests?tab=approved";
    router.push(targetUrl);
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
              href="/contact"
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

            {/* Quick Action Icons & Interactive Notifications */}
            <div className="flex items-center gap-2 border-l border-slate-200 pl-3 relative">
              {/* Notification Bell with Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setNotifOpen(!notifOpen)}
                  className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                  title="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 px-1 min-w-[16px] h-4 bg-rose-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Floating Notifications Dropdown */}
                {notifOpen && (
                  <div className="absolute right-0 mt-2 w-96 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in-50 slide-in-from-top-2 duration-150">
                    <div className="p-3.5 bg-[#0F172A] text-white flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-sky-400" />
                        <span className="text-xs font-bold">Clinical Notifications</span>
                      </div>
                      <Link
                        href="/staff/access-requests?tab=approved"
                        onClick={() => setNotifOpen(false)}
                        className="text-[11px] text-sky-300 hover:text-white underline font-semibold"
                      >
                        View All
                      </Link>
                    </div>

                    <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 text-xs">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-slate-400 space-y-1">
                          <Bell className="w-6 h-6 mx-auto text-slate-300 mb-1" />
                          <p className="font-semibold text-slate-600">No new notifications</p>
                          <p className="text-[11px]">Approved patient access requests will appear here live.</p>
                        </div>
                      ) : (
                        notifications.slice(0, 5).map((n) => {
                          const isApproved = n.type === "access_granted";
                          return (
                            <div
                              key={n.id}
                              onClick={() => handleNotificationClick(n)}
                              className={`p-3.5 hover:bg-slate-50 transition-colors cursor-pointer space-y-1.5 ${
                                !n.is_read ? "bg-sky-50/40" : ""
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                    isApproved
                                      ? "bg-emerald-100 text-emerald-800"
                                      : "bg-sky-100 text-[#006699]"
                                  }`}
                                >
                                  {isApproved ? "🟢 Access Approved" : n.title}
                                </span>
                                <span className="text-[10px] text-slate-400">
                                  {new Date(n.created_at).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                              </div>
                              <p className="text-slate-800 font-medium leading-snug">{n.message}</p>
                              {isApproved && (
                                <button className="mt-1 w-full py-1.5 px-3 bg-[#006699] hover:bg-[#005580] text-white font-bold text-[11px] rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer">
                                  <span>Open Patient Medical History</span>
                                  <span>➔</span>
                                </button>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>

              <Link
                href="/contact"
                className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                title="Help & Support"
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
