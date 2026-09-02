"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Shield,
  User,
  Phone,
  Briefcase,
  Calendar,
  Droplet,
  Ruler,
  Weight,
  AlertTriangle,
  HeartPulse,
  Activity,
  Thermometer,
  Clock,
  Building2,
  Stethoscope,
  Plus,
  Trash2,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  RefreshCw,
  QrCode,
  ArrowLeft,
  FileText,
} from "lucide-react";

interface PastHistoryItem {
  id: string;
  date: string;
  time: string;
  hospitalName: string;
  doctorName: string;
  diagnosis: string;
  treatment: string;
  notes: string;
}

export default function PatientRegisterPage() {
  const router = useRouter();

  // Form State
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [occupation, setOccupation] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("1994-06-15");
  const [gender, setGender] = useState("Male");
  const [bloodGroup, setBloodGroup] = useState("O+");
  const [height, setHeight] = useState("175 cm");
  const [weight, setWeight] = useState("72 kg");
  const [allergiesText, setAllergiesText] = useState("Penicillin, Dust Mites");

  // Emergency Contact
  const [emergencyName, setEmergencyName] = useState("");
  const [emergencyRelationship, setEmergencyRelationship] = useState("Spouse");
  const [emergencyPhone, setEmergencyPhone] = useState("");

  // Health Baseline / Vitals
  const [pulse, setPulse] = useState("74");
  const [bloodPressure, setBloodPressure] = useState("120/80");
  const [temperature, setTemperature] = useState("98.6 °F");
  const [spo2, setSpo2] = useState("99");
  const [chronicConditionsText, setChronicConditionsText] = useState("Mild Asthma");

  // Past Medical History Entries
  const [pastHistory, setPastHistory] = useState<PastHistoryItem[]>([
    {
      id: "hist-1",
      date: "15 Jan 2025",
      time: "11:30 AM",
      hospitalName: "Apollo City Clinic",
      doctorName: "Dr. Arvind Rao",
      diagnosis: "Acute Bronchitis (J20.9)",
      treatment: "Azithromycin 500mg, Salbutamol Inhaler",
      notes: "Resolved with 5-day antibiotic regimen and bronchodilator.",
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [registeredResult, setRegisteredResult] = useState<{
    medibase_id: string;
    patient_id: string;
    full_name: string;
  } | null>(null);

  // Quick Demo Auto-fill Helper
  const handlePreFillDemo = () => {
    setFullName("Amit Patel");
    setPhoneNumber("+91 98765 22001");
    setEmail("amit.patel@medibase.org");
    setOccupation("Senior Software Architect");
    setDateOfBirth("1992-04-18");
    setGender("Male");
    setBloodGroup("B+");
    setHeight("178 cm");
    setWeight("74 kg");
    setAllergiesText("Penicillin, Shellfish");

    setEmergencyName("Sunita Patel");
    setEmergencyRelationship("Spouse");
    setEmergencyPhone("+91 98765 22002");

    setPulse("72");
    setBloodPressure("118/78");
    setTemperature("98.4 °F");
    setSpo2("99");
    setChronicConditionsText("Mild Allergic Rhinitis");

    setPastHistory([
      {
        id: "hist-1",
        date: "14 Feb 2025",
        time: "02:15 PM",
        hospitalName: "Metro Super Specialty Hospital",
        doctorName: "Dr. Sneha Roy",
        diagnosis: "Allergic Rhinitis & Sinusitis (J30.1)",
        treatment: "Fluticasone Nasal Spray, Cetirizine 10mg",
        notes: "Seasonal flare-up following environmental dust exposure.",
      },
      {
        id: "hist-2",
        date: "20 Sep 2024",
        time: "10:00 AM",
        hospitalName: "City Wellness Clinic",
        doctorName: "Dr. K. S. Sharma",
        diagnosis: "Routine Annual Executive Health Check",
        treatment: "Multivitamins & Vitamin D3 60k IU",
        notes: "Normal lipid profile and resting ECG.",
      },
    ]);
  };

  const handleAddPastHistory = () => {
    setPastHistory([
      ...pastHistory,
      {
        id: `hist-${Date.now()}`,
        date: new Date().toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }),
        time: "10:00 AM",
        hospitalName: "City General Hospital",
        doctorName: "Attending Doctor",
        diagnosis: "",
        treatment: "",
        notes: "",
      },
    ]);
  };

  const handleRemovePastHistory = (id: string) => {
    setPastHistory(pastHistory.filter((item) => item.id !== id));
  };

  const handleUpdatePastHistory = (id: string, field: keyof PastHistoryItem, value: string) => {
    setPastHistory(
      pastHistory.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!fullName.trim()) {
      setErrorMessage("Please enter patient full name.");
      return;
    }

    if (!phoneNumber.trim()) {
      setErrorMessage("Please enter contact phone number.");
      return;
    }

    setLoading(true);

    try {
      const allergies = allergiesText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const chronicConditions = chronicConditionsText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const payload = {
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim(),
        email: email.trim(),
        occupation: occupation.trim() || "General Citizen",
        dateOfBirth,
        gender,
        bloodGroup,
        height: height.trim(),
        weight: weight.trim(),
        allergies,
        emergencyContactName: emergencyName.trim() || "Family Member",
        emergencyContactRelationship: emergencyRelationship.trim() || "Spouse",
        emergencyContactPhone: emergencyPhone.trim() || phoneNumber.trim(),
        pulse,
        bloodPressure,
        temperature,
        spo2,
        chronicConditions,
        pastHistory: pastHistory.map((h) => ({
          date: h.date,
          time: h.time,
          hospital_name: h.hospitalName,
          doctor_name: h.doctorName,
          diagnosis: h.diagnosis,
          treatment: h.treatment,
          notes: h.notes,
        })),
      };

      const res = await fetch("/api/patient/register-full", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to register patient.");
      }

      setRegisteredResult({
        medibase_id: data.medibase_id,
        patient_id: data.patient_id,
        full_name: fullName,
      });
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-[#006699] flex items-center justify-center text-white shadow-sm">
              <Shield className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              Medi<span className="text-[#006699]">Base</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handlePreFillDemo}
              className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>⚡ Pre-fill Sample Data</span>
            </button>

            <Link
              href="/patient/login"
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Login</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Success Modal View */}
        {registeredResult ? (
          <div className="bg-white border-2 border-emerald-500 rounded-2xl p-8 shadow-xl text-center space-y-6 animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                REGISTRATION SUCCESSFUL
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                Welcome to MediBase, {registeredResult.full_name}!
              </h1>
              <p className="text-slate-600 text-sm max-w-lg mx-auto">
                Your longitudinal digital health vault has been created with verified biometric encryption and synchronized with the national hospital network.
              </p>
            </div>

            {/* Generated MediBase ID Card */}
            <div className="bg-[#111827] text-white p-6 rounded-2xl max-w-md mx-auto shadow-lg space-y-3">
              <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">
                Assigned Citizen MediBase ID
              </p>
              <div className="text-3xl font-mono font-extrabold text-sky-400 tracking-wider">
                {registeredResult.medibase_id}
              </div>
              <p className="text-xs text-slate-300">
                Use this unique MediBase ID for instant Fast Login and medical checkups across any network hospital.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <Link
                href="/patient/dashboard"
                className="w-full sm:w-auto px-6 py-3 bg-[#006699] hover:bg-[#005580] text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span>Go to Patient Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/patient/timeline"
                className="w-full sm:w-auto px-6 py-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-semibold text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <Clock className="w-4 h-4 text-[#006699]" />
                <span>View Medical Timeline</span>
              </Link>

              <Link
                href="/staff/find-patient"
                className="w-full sm:w-auto px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <Stethoscope className="w-4 h-4 text-sky-400" />
                <span>Search in Staff Portal</span>
              </Link>
            </div>
          </div>
        ) : (
          /* Registration Form */
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Header Title */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 text-[#006699] text-xs font-bold border border-sky-200">
                <Sparkles className="w-3.5 h-3.5" />
                <span>NEW CITIZEN REGISTRATION & LONGITUDINAL INTAKE</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Register New Patient Account
              </h1>
              <p className="text-slate-600 text-sm">
                Enter your personal information, emergency contacts, vital signs, and past medical history to receive your unique permanent MediBase ID.
              </p>
            </div>

            {errorMessage && (
              <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* SECTION 1: Personal Information */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-sm space-y-5">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-sky-100 text-[#006699] flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Personal Information</h2>
                  <p className="text-xs text-slate-500">Core citizen demographic metrics.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* 1. Name */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    1. Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Amit Patel"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#006699] font-medium text-slate-900"
                    />
                  </div>
                </div>

                {/* 2. Contact Phone */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    2. Contact Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +91 98765 22001"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#006699] font-medium text-slate-900"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="e.g. amit.patel@medibase.org"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#006699] font-medium text-slate-900"
                  />
                </div>

                {/* 3. Occupation */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">3. Occupation</label>
                  <div className="relative">
                    <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="e.g. Software Engineer / Teacher"
                      value={occupation}
                      onChange={(e) => setOccupation(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#006699] font-medium text-slate-900"
                    />
                  </div>
                </div>

                {/* 4. Date of Birth */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">4. Date of Birth</label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="date"
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#006699] font-medium text-slate-900"
                    />
                  </div>
                </div>

                {/* Gender */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#006699] font-medium text-slate-900 bg-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* 5. Blood Group */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    5. Blood Group <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Droplet className="w-4 h-4 text-rose-500 absolute left-3 top-3" />
                    <select
                      value={bloodGroup}
                      onChange={(e) => setBloodGroup(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#006699] font-bold text-rose-600 bg-white"
                    >
                      <option value="A+">A+ (Positive)</option>
                      <option value="A-">A- (Negative)</option>
                      <option value="B+">B+ (Positive)</option>
                      <option value="B-">B- (Negative)</option>
                      <option value="AB+">AB+ (Positive)</option>
                      <option value="AB-">AB- (Negative)</option>
                      <option value="O+">O+ (Positive)</option>
                      <option value="O-">O- (Negative)</option>
                    </select>
                  </div>
                </div>

                {/* 6. Height */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">6. Height</label>
                  <div className="relative">
                    <Ruler className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="e.g. 175 cm"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#006699] font-medium text-slate-900"
                    />
                  </div>
                </div>

                {/* 7. Weight */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">7. Weight</label>
                  <div className="relative">
                    <Weight className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="e.g. 72 kg"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#006699] font-medium text-slate-900"
                    />
                  </div>
                </div>

                {/* 8. Allergies */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    8. Known Allergies (Comma separated)
                  </label>
                  <div className="relative">
                    <AlertTriangle className="w-4 h-4 text-amber-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="e.g. Penicillin, Dust, Peanuts (or None)"
                      value={allergiesText}
                      onChange={(e) => setAllergiesText(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#006699] font-medium text-slate-900"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 2: Emergency Contacts */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-sm space-y-5">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Emergency Contacts</h2>
                  <p className="text-xs text-slate-500">Contact details in case of medical trauma or emergency override.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                {/* 1. Name */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    1. Contact Person Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sunita Patel"
                    value={emergencyName}
                    onChange={(e) => setEmergencyName(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#006699] font-medium text-slate-900"
                  />
                </div>

                {/* 2. Relationship */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">2. Relationship</label>
                  <select
                    value={emergencyRelationship}
                    onChange={(e) => setEmergencyRelationship(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#006699] font-medium text-slate-900 bg-white"
                  >
                    <option value="Spouse">Spouse</option>
                    <option value="Parent">Parent</option>
                    <option value="Child">Child</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Guardian">Guardian</option>
                    <option value="Friend">Friend / Other</option>
                  </select>
                </div>

                {/* 3. Contact Details */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    3. Emergency Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +91 98765 22002"
                    value={emergencyPhone}
                    onChange={(e) => setEmergencyPhone(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#006699] font-medium text-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 3: Current Vital Signs & Health Baseline */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-sm space-y-5">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Health Record & Current Vital Signs</h2>
                  <p className="text-xs text-slate-500">Baseline physiological indicators.</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                {/* 1. Pulse */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <HeartPulse className="w-3.5 h-3.5 text-rose-500" />
                    <span>1. Pulse (BPM)</span>
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 72"
                    value={pulse}
                    onChange={(e) => setPulse(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#006699] font-bold text-slate-900"
                  />
                </div>

                {/* 2. Blood Pressure */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <Activity className="w-3.5 h-3.5 text-sky-600" />
                    <span>2. Blood Pressure</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 120/80"
                    value={bloodPressure}
                    onChange={(e) => setBloodPressure(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#006699] font-bold text-slate-900"
                  />
                </div>

                {/* 3. Temperature */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <Thermometer className="w-3.5 h-3.5 text-amber-500" />
                    <span>3. Temperature</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 98.6 °F"
                    value={temperature}
                    onChange={(e) => setTemperature(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#006699] font-bold text-slate-900"
                  />
                </div>

                {/* SpO2 */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <Droplet className="w-3.5 h-3.5 text-blue-500" />
                    <span>Oxygen SpO2 (%)</span>
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 99"
                    value={spo2}
                    onChange={(e) => setSpo2(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#006699] font-bold text-slate-900"
                  />
                </div>

                {/* Chronic Conditions */}
                <div className="col-span-2 sm:col-span-4">
                  <label className="block font-bold text-slate-700 mb-1">
                    Chronic Medical Conditions (Comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Hypertension, Mild Asthma, None"
                    value={chronicConditionsText}
                    onChange={(e) => setChronicConditionsText(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#006699] font-medium text-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 4: Past Medical History Entry */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm">
                    4
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">
                      Past Medical History & Prior Hospital Encounters
                    </h2>
                    <p className="text-xs text-slate-500">
                      Synchronized directly into your longitudinal database timeline.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAddPastHistory}
                  className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Past Encounter</span>
                </button>
              </div>

              {pastHistory.length === 0 ? (
                <div className="p-6 text-center border-2 border-dashed border-slate-200 rounded-xl space-y-2">
                  <p className="text-xs text-slate-500">No prior medical history entered.</p>
                  <button
                    type="button"
                    onClick={handleAddPastHistory}
                    className="text-xs font-bold text-[#006699] hover:underline"
                  >
                    + Add a prior hospital visit or surgery
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {pastHistory.map((item, idx) => (
                    <div
                      key={item.id}
                      className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 relative"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-[#006699]" />
                          Historical Event #{idx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemovePastHistory(item.id)}
                          className="text-slate-400 hover:text-rose-600 p-1 transition-colors cursor-pointer"
                          title="Remove event"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div>
                          <label className="block font-semibold text-slate-600 mb-1">Encounter Date</label>
                          <input
                            type="text"
                            placeholder="e.g. 15 Jan 2025"
                            value={item.date}
                            onChange={(e) => handleUpdatePastHistory(item.id, "date", e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-medium text-slate-900 text-xs"
                          />
                        </div>

                        <div>
                          <label className="block font-semibold text-slate-600 mb-1">Time of Treatment</label>
                          <input
                            type="text"
                            placeholder="e.g. 10:30 AM"
                            value={item.time}
                            onChange={(e) => handleUpdatePastHistory(item.id, "time", e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-medium text-slate-900 text-xs"
                          />
                        </div>

                        <div>
                          <label className="block font-semibold text-slate-600 mb-1">Hospital / Clinic Name</label>
                          <input
                            type="text"
                            placeholder="e.g. Apollo City Clinic"
                            value={item.hospitalName}
                            onChange={(e) => handleUpdatePastHistory(item.id, "hospitalName", e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-medium text-slate-900 text-xs"
                          />
                        </div>

                        <div>
                          <label className="block font-semibold text-slate-600 mb-1">Attending Doctor</label>
                          <input
                            type="text"
                            placeholder="e.g. Dr. Arvind Rao"
                            value={item.doctorName}
                            onChange={(e) => handleUpdatePastHistory(item.id, "doctorName", e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-medium text-slate-900 text-xs"
                          />
                        </div>

                        <div>
                          <label className="block font-semibold text-slate-600 mb-1">Past Diagnosis / Condition</label>
                          <input
                            type="text"
                            placeholder="e.g. Acute Bronchitis"
                            value={item.diagnosis}
                            onChange={(e) => handleUpdatePastHistory(item.id, "diagnosis", e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-medium text-slate-900 text-xs"
                          />
                        </div>

                        <div>
                          <label className="block font-semibold text-slate-600 mb-1">Past Treatment / Medication</label>
                          <input
                            type="text"
                            placeholder="e.g. Azithromycin 500mg"
                            value={item.treatment}
                            onChange={(e) => handleUpdatePastHistory(item.id, "treatment", e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-medium text-slate-900 text-xs"
                          />
                        </div>

                        <div className="sm:col-span-3">
                          <label className="block font-semibold text-slate-600 mb-1">Clinical Summary / Discharge Notes</label>
                          <input
                            type="text"
                            placeholder="e.g. Fully recovered, symptoms resolved in 5 days."
                            value={item.notes}
                            onChange={(e) => handleUpdatePastHistory(item.id, "notes", e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-medium text-slate-900 text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Action Card */}
            <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-xs text-slate-500">
                <p className="font-bold text-slate-800">Ready to issue your permanent MediBase ID</p>
                <p>All records will be synchronized across the national longitudinal healthcare registry.</p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={handlePreFillDemo}
                  className="px-4 py-3 border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Pre-fill Demo
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-[#006699] hover:bg-[#005580] disabled:bg-slate-400 text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Generating ID & Syncing...</span>
                    </>
                  ) : (
                    <>
                      <span>Complete Registration & Issue ID</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
