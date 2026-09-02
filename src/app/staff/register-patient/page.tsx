"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { StaffShell } from "@/components/layout/staff-shell";
import {
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
  ArrowLeft,
  FileText,
  ShieldCheck,
  UploadCloud,
  FileImage,
  File,
  Paperclip,
  X,
  Eye,
  Image as ImageIcon,
  FileCheck,
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

interface UploadedDocument {
  id: string;
  name: string;
  type: "lab_report" | "prescription" | "discharge_summary" | "scan_imaging" | "other";
  sizeBytes: number;
  dataUrl?: string;
  uploadedAt: string;
}

export default function StaffRegisterPatientPage() {
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

  // Uploaded Medical Documents & Images
  const [uploadedDocs, setUploadedDocs] = useState<UploadedDocument[]>([
    {
      id: "doc-seed-1",
      name: "Discharge_Summary_Apollo_Clinic.pdf",
      type: "discharge_summary",
      sizeBytes: 342000,
      uploadedAt: "15 Jan 2025",
    },
    {
      id: "doc-seed-2",
      name: "Chest_XRay_Digital_Scan.png",
      type: "scan_imaging",
      sizeBytes: 1250000,
      uploadedAt: "15 Jan 2025",
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [previewDoc, setPreviewDoc] = useState<UploadedDocument | null>(null);
  const [registeredResult, setRegisteredResult] = useState<{
    medibase_id: string;
    patient_id: string;
    full_name: string;
  } | null>(null);

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

    setUploadedDocs([
      {
        id: "doc-demo-1",
        name: "Prescription_Fluticasone_Feb2025.pdf",
        type: "prescription",
        sizeBytes: 215000,
        uploadedAt: "14 Feb 2025",
      },
      {
        id: "doc-demo-2",
        name: "Sinus_Digital_Scan_View.jpg",
        type: "scan_imaging",
        sizeBytes: 890000,
        uploadedAt: "14 Feb 2025",
      },
      {
        id: "doc-demo-3",
        name: "Annual_Executive_Lab_Report.pdf",
        type: "lab_report",
        sizeBytes: 430000,
        uploadedAt: "20 Sep 2024",
      },
    ]);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      let docType: UploadedDocument["type"] = "other";
      const lower = file.name.toLowerCase();
      if (lower.includes("rx") || lower.includes("prescrip")) docType = "prescription";
      else if (lower.includes("lab") || lower.includes("blood") || lower.includes("test")) docType = "lab_report";
      else if (lower.includes("xray") || lower.includes("scan") || lower.includes("mri") || file.type.startsWith("image/")) docType = "scan_imaging";
      else if (lower.includes("discharge") || lower.includes("summary")) docType = "discharge_summary";

      const reader = new FileReader();
      reader.onload = () => {
        const newDoc: UploadedDocument = {
          id: `doc-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          name: file.name,
          type: docType,
          sizeBytes: file.size,
          dataUrl: reader.result as string,
          uploadedAt: new Date().toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }),
        };
        setUploadedDocs((prev) => [...prev, newDoc]);
      };
      reader.readAsDataURL(file);
    });

    e.target.value = "";
  };

  const handleRemoveDoc = (id: string) => {
    setUploadedDocs(uploadedDocs.filter((d) => d.id !== id));
  };

  const handleUpdateDocType = (id: string, newType: UploadedDocument["type"]) => {
    setUploadedDocs(uploadedDocs.map((d) => (d.id === id ? { ...d, type: newType } : d)));
  };

  const handleAddPastHistory = () => {
    setPastHistory([
      ...pastHistory,
      {
        id: `hist-${Date.now()}`,
        date: new Date().toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }),
        time: "10:00 AM",
        hospitalName: "City General Hospital",
        doctorName: "Dr. Rahul Sharma",
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
        uploadedDocuments: uploadedDocs,
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
    <StaffShell activeNav="register-patient">
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Top Action Bar */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Hospital Staff • Onboard New Patient
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Create a verified citizen profile, record baseline vitals, and upload prior medical history.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePreFillDemo}
              className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>⚡ Pre-fill Sample Data</span>
            </button>

            <Link
              href="/staff/find-patient"
              className="px-3 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Search</span>
            </Link>
          </div>
        </div>

        {registeredResult ? (
          <div className="bg-white border-2 border-emerald-500 rounded-2xl p-8 shadow-xl text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                PATIENT RECORD INITIALIZED
              </span>
              <h2 className="text-2xl font-bold text-slate-900">
                {registeredResult.full_name} Registered Successfully
              </h2>
              <p className="text-slate-600 text-xs max-w-lg mx-auto">
                Patient has been assigned a permanent MediBase ID. Full longitudinal history and vitals are immediately searchable by attending staff.
              </p>
            </div>

            <div className="bg-[#111827] text-white p-6 rounded-2xl max-w-md mx-auto shadow-lg space-y-2">
              <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">
                Assigned Citizen MediBase ID
              </p>
              <div className="text-3xl font-mono font-extrabold text-sky-400 tracking-wider">
                {registeredResult.medibase_id}
              </div>
              <p className="text-xs text-slate-300">
                Authorized for clinical overview and instant visit recording.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                href={`/staff/patient/${registeredResult.medibase_id}`}
                className="w-full sm:w-auto px-6 py-2.5 bg-[#006699] hover:bg-[#005580] text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span>Open Patient Overview</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href={`/staff/patient/${registeredResult.medibase_id}/timeline`}
                className="w-full sm:w-auto px-6 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <Clock className="w-4 h-4 text-[#006699]" />
                <span>View Longitudinal Timeline</span>
              </Link>

              <Link
                href={`/staff/patient/${registeredResult.medibase_id}/new-visit`}
                className="w-full sm:w-auto px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <Stethoscope className="w-4 h-4 text-sky-400" />
                <span>Add Clinical Visit Note</span>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {errorMessage && (
              <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* SECTION 1: Personal Information */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                <div className="w-7 h-7 rounded-lg bg-sky-100 text-[#006699] flex items-center justify-center font-bold text-xs">
                  1
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Personal Information</h2>
                  <p className="text-[11px] text-slate-500">Citizen identification details.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
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
                      className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#006699] font-medium text-slate-900"
                    />
                  </div>
                </div>

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
                      className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#006699] font-medium text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="e.g. amit.patel@medibase.org"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#006699] font-medium text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">3. Occupation</label>
                  <div className="relative">
                    <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="e.g. Software Engineer / Teacher"
                      value={occupation}
                      onChange={(e) => setOccupation(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#006699] font-medium text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">4. Date of Birth</label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="date"
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#006699] font-medium text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#006699] font-medium text-slate-900 bg-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    5. Blood Group <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Droplet className="w-4 h-4 text-rose-500 absolute left-3 top-3" />
                    <select
                      value={bloodGroup}
                      onChange={(e) => setBloodGroup(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#006699] font-bold text-rose-600 bg-white"
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

                <div>
                  <label className="block font-bold text-slate-700 mb-1">6. Height</label>
                  <div className="relative">
                    <Ruler className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="e.g. 175 cm"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#006699] font-medium text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">7. Weight</label>
                  <div className="relative">
                    <Weight className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="e.g. 72 kg"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#006699] font-medium text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    8. Known Allergies (Comma separated)
                  </label>
                  <div className="relative">
                    <AlertTriangle className="w-4 h-4 text-amber-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="e.g. Penicillin, Dust, Peanuts"
                      value={allergiesText}
                      onChange={(e) => setAllergiesText(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#006699] font-medium text-slate-900"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 2: Emergency Contacts */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs">
                  2
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Emergency Contacts</h2>
                  <p className="text-[11px] text-slate-500">Emergency guardian / kin details.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
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
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#006699] font-medium text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">2. Relationship</label>
                  <select
                    value={emergencyRelationship}
                    onChange={(e) => setEmergencyRelationship(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#006699] font-medium text-slate-900 bg-white"
                  >
                    <option value="Spouse">Spouse</option>
                    <option value="Parent">Parent</option>
                    <option value="Child">Child</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Guardian">Guardian</option>
                    <option value="Friend">Friend / Other</option>
                  </select>
                </div>

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
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#006699] font-medium text-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 3: Current Vital Signs & Health Baseline */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                  3
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Current Vital Signs Baseline</h2>
                  <p className="text-[11px] text-slate-500">Triage & intake measurements.</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
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
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#006699] font-bold text-slate-900"
                  />
                </div>

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
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#006699] font-bold text-slate-900"
                  />
                </div>

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
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#006699] font-bold text-slate-900"
                  />
                </div>

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
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#006699] font-bold text-slate-900"
                  />
                </div>

                <div className="col-span-2 sm:col-span-4">
                  <label className="block font-bold text-slate-700 mb-1">
                    Chronic Medical Conditions (Comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Hypertension, Mild Asthma, None"
                    value={chronicConditionsText}
                    onChange={(e) => setChronicConditionsText(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#006699] font-medium text-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 4: Past Medical History Entry */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
                    4
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-900">
                      Past Medical History & Prior Encounters
                    </h2>
                    <p className="text-[11px] text-slate-500">
                      Synchronized into the patient&apos;s longitudinal timeline.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAddPastHistory}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
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

            {/* SECTION 5: Medical Documents & Image Upload */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                    5
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-900">
                      Medical Documents, Prescriptions & Images
                    </h2>
                    <p className="text-[11px] text-slate-500">
                      Import prior prescriptions, diagnostic lab reports, discharge summaries, and medical scans (JPG, PNG, PDF).
                    </p>
                  </div>
                </div>

                <label className="px-3.5 py-1.5 bg-[#006699] hover:bg-[#005580] text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer shadow-sm">
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>Import Files / Images</span>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png,.webp"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Drag & Drop Upload Zone */}
              <label className="border-2 border-dashed border-sky-200 hover:border-[#006699] bg-sky-50/40 hover:bg-sky-50/70 rounded-xl p-5 text-center flex flex-col items-center justify-center gap-2 transition-all cursor-pointer group">
                <div className="w-10 h-10 rounded-full bg-sky-100 text-[#006699] flex items-center justify-center group-hover:scale-105 transition-transform">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">
                    Click to browse or drag & drop files here
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Supports JPG, PNG, WebP image scans, and PDF clinical reports (up to 25 MB each)
                  </p>
                </div>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png,.webp"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {/* Uploaded Documents List */}
              {uploadedDocs.length > 0 && (
                <div className="space-y-2.5 pt-1">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
                    <span>Uploaded Files ({uploadedDocs.length})</span>
                    <span>Classify Document Type</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {uploadedDocs.map((doc) => {
                      const isImage = doc.name.match(/\.(jpg|jpeg|png|webp)$/i);
                      return (
                        <div
                          key={doc.id}
                          className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-3 relative hover:border-slate-300 transition-colors"
                        >
                          {/* Thumbnail / Icon */}
                          <div className="w-11 h-11 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
                            {doc.dataUrl && isImage ? (
                              <img
                                src={doc.dataUrl}
                                alt={doc.name}
                                className="w-full h-full object-cover"
                              />
                            ) : isImage ? (
                              <FileImage className="w-5 h-5 text-sky-600" />
                            ) : (
                              <FileText className="w-5 h-5 text-rose-500" />
                            )}
                          </div>

                          {/* Info & Category Selector */}
                          <div className="min-w-0 flex-1 space-y-1.5">
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-xs font-bold text-slate-900 truncate" title={doc.name}>
                                {doc.name}
                              </p>
                              <button
                                type="button"
                                onClick={() => handleRemoveDoc(doc.id)}
                                className="text-slate-400 hover:text-rose-600 p-0.5 transition-colors cursor-pointer"
                                title="Remove file"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <div className="flex items-center justify-between gap-2 text-[11px]">
                              <span className="text-slate-400 font-mono">
                                {(doc.sizeBytes / 1024).toFixed(0)} KB
                              </span>

                              <select
                                value={doc.type}
                                onChange={(e) =>
                                  handleUpdateDocType(doc.id, e.target.value as UploadedDocument["type"])
                                }
                                className="px-2 py-0.5 rounded border border-slate-300 bg-white text-[11px] font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#006699]"
                              >
                                <option value="prescription">Prescription</option>
                                <option value="lab_report">Lab Report</option>
                                <option value="discharge_summary">Discharge Summary</option>
                                <option value="scan_imaging">Scan / X-Ray / MRI</option>
                                <option value="other">Other Document</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Submit Action */}
            <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-xs text-slate-500">
                <p className="font-bold text-slate-800">Generate MediBase ID & Initialize Record</p>
                <p>The patient will be immediately searchable by all network hospital staff.</p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={handlePreFillDemo}
                  className="px-4 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Pre-fill Demo
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 bg-[#006699] hover:bg-[#005580] disabled:bg-slate-400 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Generating ID & Syncing...</span>
                    </>
                  ) : (
                    <>
                      <span>Register Patient & Generate ID</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </StaffShell>
  );
}
