"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { PatientShell } from "@/components/layout/patient-shell";
import {
  AlertTriangle,
  KeyRound,
  Shield,
  FileText,
  Clock,
  Download,
  Check,
  CheckCheck,
  RefreshCw,
  Bell,
} from "lucide-react";

interface NotificationItem {
  id: string;
  recipient_type: "patient" | "staff";
  recipient_id: string;
  title: string;
  message: string;
  type: "access_request" | "access_granted" | "access_denied" | "emergency_access" | "record_updated" | "security_alert";
  category: "requests" | "updates" | "security";
  reference_id?: string;
  action_url?: string;
  is_read: boolean;
  created_at: string;
}

export default function PatientNotificationsPage() {
  const [filter, setFilter] = useState("all");
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const filterOptions = [
    { label: "All", key: "all" },
    { label: "Access Requests", key: "requests" },
    { label: "Medical Updates", key: "updates" },
    { label: "Security", key: "security" },
  ];

  const fetchNotifications = async (cat = filter) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/patient/notifications?category=${cat}`);
      const data = await res.json();
      if (res.ok && data.success) {
        setNotifications(data.notifications || []);
        setUnreadCount(data.unread_count || 0);
      }
    } catch (err) {
      console.error("Failed to load notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications(filter);
  }, [filter]);

  const handleMarkRead = async (id: string) => {
    try {
      const res = await fetch(`/api/patient/notifications/${id}/read`, {
        method: "POST",
      });
      if (res.ok) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error("Failed to mark read:", err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const res = await fetch("/api/patient/notifications/mark-all-read", {
        method: "POST",
      });
      if (res.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
        setUnreadCount(0);
      }
    } catch (err) {
      console.error("Failed to mark all read:", err);
    }
  };

  const formatTimeAgo = (iso: string) => {
    try {
      const diffMs = Date.now() - new Date(iso).getTime();
      const mins = Math.floor(diffMs / 60000);
      if (mins < 1) return "Just now";
      if (mins < 60) return `${mins} min${mins === 1 ? "" : "s"} ago`;
      const hours = Math.floor(mins / 60);
      if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
      const days = Math.floor(hours / 24);
      return `${days} day${days === 1 ? "" : "s"} ago`;
    } catch {
      return "Recently";
    }
  };

  return (
    <PatientShell activeNav="notifications">
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Header with Mark All Read CTA */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
              <span>Notifications</span>
              {unreadCount > 0 && (
                <span className="px-2.5 py-0.5 rounded-full bg-rose-500 text-white text-xs font-bold font-mono">
                  {unreadCount} new
                </span>
              )}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Manage your alerts, access requests, and medical updates.
            </p>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="inline-flex items-center gap-2 px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-lg transition-colors cursor-pointer self-start sm:self-auto"
            >
              <CheckCheck className="w-4 h-4 text-[#006699]" />
              <span>Mark all as read</span>
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {filterOptions.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setFilter(opt.key)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                filter === opt.key
                  ? "bg-[#0F172A] text-white"
                  : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400 space-y-2 bg-white rounded-xl border border-slate-200">
            <RefreshCw className="w-6 h-6 animate-spin text-[#006699] mx-auto mb-2" />
            <span>Loading notifications...</span>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500 space-y-3 bg-white rounded-xl border border-slate-200">
            <Bell className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="font-semibold text-slate-700">No notifications found</p>
            <p className="text-slate-400">You are all caught up on alerts and access requests.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notif) => {
              // 1. Emergency Alert
              if (notif.type === "emergency_access") {
                return (
                  <div
                    key={notif.id}
                    className={`bg-rose-50/70 border-l-4 border-l-rose-500 border border-rose-200 rounded-xl p-5 shadow-sm space-y-3 transition-opacity ${
                      notif.is_read ? "opacity-75" : ""
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                        <AlertTriangle className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="px-2 py-0.5 rounded bg-rose-200/70 text-rose-800 font-bold text-[10px] uppercase">
                            EMERGENCY ALERT
                          </span>
                          <span className="text-xs text-rose-700/80">
                            {formatTimeAgo(notif.created_at)}
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-rose-950 mt-1">
                          {notif.title}
                        </h3>
                        <p className="text-xs text-rose-800 mt-0.5 leading-relaxed">
                          {notif.message}
                        </p>

                        <div className="pt-3 flex items-center gap-3">
                          <Link
                            href={notif.action_url || "/patient/access-history"}
                            className="inline-flex px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white font-semibold text-xs rounded-lg transition-colors shadow-sm cursor-pointer"
                          >
                            Review Event
                          </Link>
                          {!notif.is_read && (
                            <button
                              onClick={() => handleMarkRead(notif.id)}
                              className="px-4 py-2 border border-rose-300 hover:bg-rose-100/50 text-rose-800 font-semibold text-xs rounded-lg transition-colors cursor-pointer"
                            >
                              Mark as read
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              // 2. Access Request
              if (notif.type === "access_request") {
                return (
                  <div
                    key={notif.id}
                    className={`bg-white border-l-4 border-l-[#006699] border border-slate-200 rounded-xl p-5 shadow-sm space-y-3 transition-opacity ${
                      notif.is_read ? "opacity-75" : ""
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-sky-50 text-[#006699] flex items-center justify-center shrink-0 mt-0.5">
                        <KeyRound className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="px-2 py-0.5 rounded bg-sky-50 text-sky-700 font-bold text-[10px] uppercase flex items-center gap-1">
                            ACCESS REQUEST {!notif.is_read && <span className="w-1.5 h-1.5 rounded-full bg-[#006699]"></span>}
                          </span>
                          <span className="text-xs text-slate-400">
                            {formatTimeAgo(notif.created_at)}
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-slate-900 mt-1">
                          {notif.title}
                        </h3>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                          {notif.message}
                        </p>

                        <div className="flex items-center gap-3 pt-3">
                          <Link
                            href={notif.action_url || `/patient/access-requests/${notif.reference_id || "req-seed-001"}`}
                            className="px-4 py-2 bg-black hover:bg-slate-800 text-white font-semibold text-xs rounded-lg transition-colors shadow cursor-pointer"
                          >
                            Review Request
                          </Link>
                          {!notif.is_read && (
                            <button
                              onClick={() => handleMarkRead(notif.id)}
                              className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-lg transition-colors cursor-pointer"
                            >
                              Dismiss
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              // 3. Security Alert
              if (notif.type === "security_alert") {
                return (
                  <div
                    key={notif.id}
                    className={`bg-white border border-slate-200 rounded-xl p-5 shadow-sm transition-opacity ${
                      notif.is_read ? "opacity-75" : ""
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 mt-0.5">
                        <Shield className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-bold text-[10px] uppercase">
                            SECURITY UPDATE
                          </span>
                          <span className="text-xs text-slate-400">
                            {formatTimeAgo(notif.created_at)}
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-slate-900 mt-1">
                          {notif.message}
                        </h3>
                        <div className="flex items-center justify-between pt-2">
                          <p className="text-xs text-slate-500 flex items-center gap-1">
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Audited</span>
                          </p>
                          {!notif.is_read && (
                            <button
                              onClick={() => handleMarkRead(notif.id)}
                              className="text-xs text-slate-500 hover:text-slate-800 underline cursor-pointer"
                            >
                              Mark read
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              // 4. Reports & Medical Updates
              return (
                <div
                  key={notif.id}
                  className={`bg-white border-l-4 border-l-slate-900 border border-slate-200 rounded-xl p-5 shadow-sm transition-opacity ${
                    notif.is_read ? "opacity-75" : ""
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-sky-50 text-[#006699] flex items-center justify-center shrink-0 mt-0.5">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded bg-sky-50 text-sky-700 font-bold text-[10px] uppercase flex items-center gap-1">
                          REPORTS {!notif.is_read && <span className="w-1.5 h-1.5 rounded-full bg-[#006699]"></span>}
                        </span>
                        <span className="text-xs text-slate-400">
                          {formatTimeAgo(notif.created_at)}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 mt-1">
                        {notif.message}
                      </h3>

                      <div className="pt-3 flex items-center gap-3">
                        <Link
                          href={notif.action_url || "/patient/timeline"}
                          className="inline-flex items-center gap-1.5 px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-lg transition-colors cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>View Report</span>
                        </Link>
                        {!notif.is_read && (
                          <button
                            onClick={() => handleMarkRead(notif.id)}
                            className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold text-xs rounded-lg transition-colors cursor-pointer"
                          >
                            Dismiss
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </PatientShell>
  );
}
