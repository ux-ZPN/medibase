"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Mail,
  Phone,
  ShieldCheck,
  Building2,
  Users,
  Send,
  CheckCircle2,
  Clock,
  MapPin,
  HelpCircle,
  ArrowLeft,
  ExternalLink,
  MessageSquare,
  AlertTriangle,
  Code2,
  Sparkles,
  LifeBuoy,
  ChevronRight,
  Copy,
  Check,
} from "lucide-react";

interface TeamMember {
  name: string;
  role: string;
  email: string;
  badge: string;
  badgeColor: string;
  avatarBg: string;
  description: string;
}

const TEAM_MEMBERS: TeamMember[] = [
  {
    name: "Maitrey Raj",
    role: "General Manager / Supervisor",
    email: "maitreyraj2724@gmail.com",
    badge: "Operations & Supervision",
    badgeColor: "bg-purple-100 text-purple-800 border-purple-200",
    avatarBg: "bg-purple-600",
    description: "Overall platform governance, hospital partner relations, and operational compliance supervisor.",
  },
  {
    name: "Anuj Dutta",
    role: "Technical / Development Lead",
    email: "anujduttacodr@gmail.com",
    badge: "Architecture & Lead",
    badgeColor: "bg-blue-100 text-[#006699] border-blue-200",
    avatarBg: "bg-[#006699]",
    description: "Full-stack system architecture, database security, Supabase integration, and clinical data interoperability.",
  },
  {
    name: "Punyashree Khatri",
    role: "Front-end Developer",
    email: "punyashreekhatri@gmail.com",
    badge: "Front-End Engineering",
    badgeColor: "bg-teal-100 text-teal-800 border-teal-200",
    avatarBg: "bg-teal-600",
    description: "Patient experience interfaces, medical timeline visualization, and responsive client portal development.",
  },
  {
    name: "Ayush Saran",
    role: "Programming Assistance",
    email: "ayushsaran4108@gmail.com",
    badge: "Core Engineering",
    badgeColor: "bg-sky-100 text-sky-800 border-sky-200",
    avatarBg: "bg-sky-600",
    description: "Backend authentication APIs, document parsing pipelines, and automated test verification.",
  },
  {
    name: "Chaitanya Thakur",
    role: "UI / UX Designer",
    email: "thakurchaitanya08@gmail.com",
    badge: "Design Systems",
    badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
    avatarBg: "bg-amber-600",
    description: "Design system architecture, clinical workflow prototyping, and accessibility optimization.",
  },
  {
    name: "Srijita Mukherjee",
    role: "Application UI / UX Designer",
    email: "srijita777mukherjee@gmail.com",
    badge: "Application Design",
    badgeColor: "bg-rose-100 text-rose-800 border-rose-200",
    avatarBg: "bg-rose-600",
    description: "Hospital staff portal UX, emergency break-glass interactive flows, and user journey optimization.",
  },
];

const FAQS = [
  {
    q: "How does MediBase protect patient medical records?",
    a: "All medical records are protected using AES-256-GCM encryption at rest and TLS 1.3 in transit. Access is governed by patient-granted, time-bound consent with immutable audit trails.",
  },
  {
    q: "How can hospital staff contact technical support for integration?",
    a: "Hospital administrators and IT staff can directly email our Development Lead (Anuj Dutta) at anujduttacodr@gmail.com or submit a ticket using the form below for 24/7 SLA escalation.",
  },
  {
    q: "What is the response time for support inquiries?",
    a: "Emergency clinical access issues are answered in under 15 minutes. General support inquiries and onboarding requests are answered within 2 to 4 business hours.",
  },
  {
    q: "How do I report a security vulnerability or audit issue?",
    a: "Please email our technical team directly or send an encrypted report to our supervisor (Maitrey Raj) at maitreyraj2724@gmail.com.",
  },
];

export default function ContactSupportPage() {
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category: "technical",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({ name: "", email: "", category: "technical", subject: "", message: "" });
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-sky-100 selection:text-sky-900">
      {/* Top Navigation */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 rounded-lg bg-[#006699] flex items-center justify-center text-white font-bold">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="M12 8v8m-4-4h8" strokeWidth="2.5" />
              </svg>
            </div>
            <span className="font-bold text-xl text-slate-900 tracking-tight">MediBase</span>
          </Link>
          <span className="text-slate-300">/</span>
          <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Help &amp; Support</span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>
          <Link
            href="/patient/login"
            className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-white bg-[#006699] hover:bg-[#005580] rounded-lg shadow transition-colors"
          >
            <span>Patient Portal</span>
          </Link>
        </div>
      </header>

      {/* Hero Header */}
      <section className="bg-gradient-to-b from-white via-sky-50/40 to-slate-50 border-b border-slate-200 pt-12 pb-14 px-4 sm:px-8 text-center relative overflow-hidden">
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-sky-100/80 border border-sky-200 text-[#006699] text-xs font-bold mb-4">
            <LifeBuoy className="w-3.5 h-3.5" />
            <span>24/7 Dedicated Support &amp; Leadership Directory</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How Can We Assist You Today?
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Get in touch directly with our leadership, engineering, and design specialists for institutional onboarding, technical assistance, or privacy inquiries.
          </p>

          {/* Quick Metrics Bar */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto text-left">
            <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-xs">
              <span className="text-[11px] text-slate-500 font-semibold block">Response Time</span>
              <span className="text-sm font-bold text-[#006699]">&lt; 15 Mins (Emerg.)</span>
            </div>
            <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-xs">
              <span className="text-[11px] text-slate-500 font-semibold block">Compliance</span>
              <span className="text-sm font-bold text-emerald-600">HIPAA &amp; ABDM</span>
            </div>
            <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-xs">
              <span className="text-[11px] text-slate-500 font-semibold block">Data Encryption</span>
              <span className="text-sm font-bold text-slate-800">AES-256-GCM</span>
            </div>
            <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-xs">
              <span className="text-[11px] text-slate-500 font-semibold block">Support SLA</span>
              <span className="text-sm font-bold text-purple-700">99.9% Uptime</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto w-full px-4 sm:px-8 py-12 space-y-16">
        {/* TEAM DIRECTORY SECTION */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-8">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#006699]">
                <Users className="w-4 h-4" />
                <span>Executive &amp; Technical Leadership</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mt-1">MediBase Project Team Directory</h2>
              <p className="text-xs text-slate-500 mt-1">Direct contact information for project leads, supervisors, developers, and designers.</p>
            </div>
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
              6 Core Contributors
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {TEAM_MEMBERS.map((member, idx) => {
              const initials = member.name
                .split(" ")
                .map((n) => n[0])
                .join("");
              return (
                <div
                  key={idx}
                  className="bg-white border border-slate-200 hover:border-sky-300 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Top row: Avatar & Badge */}
                    <div className="flex items-start justify-between gap-3 mb-3.5">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-11 h-11 rounded-xl ${member.avatarBg} text-white font-bold text-sm flex items-center justify-center shadow-xs shrink-0`}
                        >
                          {initials}
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-slate-900 group-hover:text-[#006699] transition-colors leading-tight">
                            {member.name}
                          </h3>
                          <p className="text-xs font-semibold text-slate-600 mt-0.5">
                            {member.role}
                          </p>
                        </div>
                      </div>
                    </div>

                    <span
                      className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-md border ${member.badgeColor} mb-2.5`}
                    >
                      {member.badge}
                    </span>

                    <p className="text-xs text-slate-500 leading-relaxed mb-4">
                      {member.description}
                    </p>
                  </div>

                  {/* Email & Action Buttons */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <a
                      href={`mailto:${member.email}`}
                      className="flex items-center gap-1.5 text-xs font-medium text-slate-700 hover:text-[#006699] truncate transition-colors"
                      title={`Send email to ${member.email}`}
                    >
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{member.email}</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => handleCopyEmail(member.email)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer shrink-0"
                      title="Copy Email Address"
                    >
                      {copiedEmail === member.email ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* SUPPORT FORM & EMERGENCY HOTLINES GRID */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Direct Support Form */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#006699] mb-1">
              <MessageSquare className="w-4 h-4" />
              <span>Direct Support Inquiries</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-1">Send a Message to the Engineering Team</h2>
            <p className="text-xs text-slate-500 mb-6">
              Fill out the form below for technical support, feature suggestions, or clinical facility onboarding.
            </p>

            {submitted ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-emerald-900">Message Dispatched Successfully</h3>
                <p className="text-xs text-emerald-700 max-w-md mx-auto">
                  Thank you for reaching out. Our development and operations team has received your ticket and will respond via email shortly.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-left">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Your Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Dr. Rajesh Khanna"
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#006699]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. rajesh@cityhospital.com"
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#006699]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#006699]"
                    >
                      <option value="technical">Technical Support &amp; Integration</option>
                      <option value="hospital">Hospital / Clinical Onboarding</option>
                      <option value="security">Security &amp; Data Privacy Inquiries</option>
                      <option value="patient">Patient Portal &amp; Consent Management</option>
                      <option value="other">General Inquiries</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Subject <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="e.g. EHR Synchronization issue"
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#006699]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Message Details <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your question, hospital facility requirements, or technical scenario..."
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#006699]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 bg-[#006699] hover:bg-[#005580] disabled:bg-slate-400 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <span>Submitting Ticket...</span>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Support Ticket</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Institutional Contacts & Quick Links */}
          <div className="lg:col-span-5 space-y-5">
            {/* Emergency Break-Glass Alert Box */}
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 shadow-xs">
              <div className="flex items-center gap-2 text-rose-800 font-bold text-xs mb-2">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Emergency Clinical Escalation</span>
              </div>
              <p className="text-xs text-rose-700 leading-relaxed mb-3">
                For urgent clinical emergencies requiring immediate Break-Glass patient record access or hospital server assistance:
              </p>
              <div className="space-y-1.5 text-xs font-semibold text-rose-900">
                <p className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-rose-600" />
                  <span>24/7 Clinical Hotline: +91 1800-633-2273</span>
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-rose-600" />
                  <span>emergency@medibase.org</span>
                </p>
              </div>
            </div>

            {/* Institutional Channels */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Official Communication Channels</h3>

              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-3">
                  <Building2 className="w-4 h-4 text-[#006699] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-800 block">Hospital Onboarding &amp; Partnerships</span>
                    <a href="mailto:partners@medibase.org" className="text-slate-500 hover:text-[#006699]">
                      partners@medibase.org
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-800 block">Privacy &amp; Data Protection Officer</span>
                    <a href="mailto:privacy@medibase.org" className="text-slate-500 hover:text-emerald-700">
                      privacy@medibase.org
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-800 block">Operating Hours</span>
                    <span className="text-slate-500">24/7 Monitoring | General Desk: Mon - Sat 9:00 AM - 7:00 PM IST</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Policy & Security Quick Links */}
            <div className="bg-gradient-to-br from-sky-50 to-slate-50 border border-sky-200 rounded-2xl p-5 shadow-xs">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5">
                Related Documentation
              </h3>
              <div className="space-y-2">
                <Link
                  href="/privacy-policy"
                  className="flex items-center justify-between p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:text-[#006699] hover:border-sky-300 transition-all"
                >
                  <span>Privacy Policy &amp; Patient Rights</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </Link>
                <Link
                  href="/terms-of-service"
                  className="flex items-center justify-between p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:text-[#006699] hover:border-sky-300 transition-all"
                >
                  <span>Terms of Service &amp; Governance</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </Link>
                <Link
                  href="/security-standards"
                  className="flex items-center justify-between p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:text-[#006699] hover:border-sky-300 transition-all"
                >
                  <span>Security Standards &amp; HIPAA Compliance</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#006699] mb-1">
            <HelpCircle className="w-4 h-4" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-6">Common Inquiries &amp; Guidance</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {FAQS.map((faq, i) => (
              <div key={i} className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <h4 className="text-xs font-bold text-slate-900 mb-1.5">{faq.q}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white px-6 sm:px-12 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-800">MediBase</span>
          <span>© 2026 MediBase Secure Health Systems. All rights reserved.</span>
        </div>
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-slate-600">
          <Link href="/privacy-policy" className="hover:text-slate-900 transition-colors">Privacy Policy</Link>
          <Link href="/terms-of-service" className="hover:text-slate-900 transition-colors">Terms of Service</Link>
          <Link href="/security-standards" className="hover:text-slate-900 transition-colors">Security Standards</Link>
          <Link href="/contact" className="hover:text-slate-900 font-semibold text-[#006699]">Contact Support</Link>
        </div>
      </footer>
    </div>
  );
}
