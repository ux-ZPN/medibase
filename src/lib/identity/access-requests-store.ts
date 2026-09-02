export interface StoredAccessRequest {
  id: string;
  patient_id: string;
  requested_by_staff_id: string;
  hospital_id: string;
  doctor_name: string;
  doctor_role: string;
  hospital_name: string;
  department: string;
  purpose: string;
  requested_scope: string[];
  status: "pending" | "approved" | "denied" | "expired" | "rejected";
  requested_at: string;
  expires_at: string;
  responded_at?: string;
  is_active: boolean;
}

export interface StoredAccessGrant {
  id: string;
  patient_id: string;
  access_request_id?: string;
  emergency_access_id?: string;
  hospital_id: string;
  staff_id: string;
  doctor_name: string;
  hospital_name: string;
  granted_at: string;
  valid_until: string;
  is_active: boolean;
  access_type: "view_only" | "view_and_contribute" | "emergency";
  reason?: string;
}

export interface StoredEmergencyAccess {
  id: string;
  patient_id: string;
  staff_id: string;
  hospital_id: string;
  doctor_name: string;
  hospital_name: string;
  emergency_reason: string;
  access_started_at: string;
  access_ended_at: string;
  is_active: boolean;
}

export interface StoredNotification {
  id: string;
  recipient_type: "patient" | "staff";
  recipient_id: string; // Patient ID or Staff Profile ID
  title: string;
  message: string;
  type: "access_request" | "access_granted" | "access_denied" | "emergency_access" | "record_updated" | "security_alert";
  category: "requests" | "updates" | "security";
  reference_id?: string;
  action_url?: string;
  is_read: boolean;
  metadata?: Record<string, unknown>;
  created_at: string;
}

export interface StoredAuditLog {
  id: string;
  timestamp: string;
  actor_name: string;
  actor_role: string;
  hospital_id?: string;
  hospital_name: string;
  action: string;
  action_label: string;
  purpose: string;
  patient_id: string;
  is_emergency: boolean;
  access_type?: "normal" | "emergency";
  metadata?: Record<string, unknown>;
  ip_address?: string;
  device?: string;
}

export interface ClinicalEncounter {
  id: string;
  patient_id: string;
  date: string;
  time?: string;
  timestamp?: string;
  hospital_name: string;
  department: string;
  doctor_name: string;
  doctor_role: string;
  visit_type: string;
  chief_complaint: string;
  diagnoses: Array<{ code?: string; name: string; is_primary?: boolean; is_new?: boolean }>;
  prescriptions: Array<{
    name: string;
    dosage: string;
    frequency: string;
    duration?: string;
    instructions?: string;
    is_active?: boolean;
    is_new?: boolean;
    discontinued?: boolean;
    discontinuation_reason?: string;
  }>;
  vitals?: {
    bp: string;
    systolic?: number;
    diastolic?: number;
    heart_rate: number;
    glucose_mg_dl?: number;
    spo2?: number;
  };
  investigations?: Array<{ name: string; status: string; result?: string; time?: string }>;
  reports?: Array<{ title: string; file_name: string; file_url?: string }>;
  clinical_notes: string;
}

export interface StoredMedicalReport {
  id: string;
  patient_id: string;
  encounter_id?: string;
  uploaded_by_staff_id: string;
  hospital_name: string;
  doctor_name: string;
  report_title: string;
  report_type: string;
  file_name: string;
  file_size_bytes: number;
  mime_type: string;
  storage_path: string;
  created_at: string;
}

export interface StoredPatientRegistration {
  id: string;
  medibase_id: string;
  full_name: string;
  phone_number: string;
  email?: string;
  occupation: string;
  date_of_birth: string;
  gender: string;
  blood_group: string;
  height_cm?: string | number;
  weight_kg?: string | number;
  allergies: string[];
  emergency_contact: {
    name: string;
    relationship: string;
    phone: string;
  };
  vitals: {
    pulse: number;
    blood_pressure: string;
    temperature: string;
    spo2?: number;
  };
  chronic_conditions?: string[];
  past_history?: Array<{
    date: string;
    time?: string;
    hospital_name: string;
    department?: string;
    doctor_name: string;
    visit_type?: string;
    diagnosis: string;
    treatment: string;
    notes?: string;
  }>;
  uploaded_documents?: Array<{
    id: string;
    name: string;
    type: string;
    sizeBytes: number;
    dataUrl?: string;
    uploadedAt: string;
  }>;
  created_at: string;
}

export function extractPatientIndex(idOrStr: string): number | null {
  if (!idOrStr) return null;
  const digits = idOrStr.replace(/\D/g, "");
  if (!digits) return null;
  const val = parseInt(digits.slice(-6), 10);
  if (isNaN(val)) return null;
  return val >= 100000 ? val - 100000 : val;
}

export interface StoredStaffRegistration {
  id: string;
  staff_id: string;
  full_name: string;
  email: string;
  phone_number: string;
  hospital_id: string;
  hospital_name: string;
  department: string;
  role: string;
  license_number: string;
  aadhaar_last4?: string;
  created_at: string;
}

// Global persistent stores across all Next.js route compilation workers
const globalStore = globalThis as unknown as {
  __medibase_access_requests?: StoredAccessRequest[];
  __medibase_access_grants?: StoredAccessGrant[];
  __medibase_emergency_access?: StoredEmergencyAccess[];
  __medibase_notifications?: StoredNotification[];
  __medibase_audit_logs?: StoredAuditLog[];
  __medibase_clinical_encounters?: Record<string, ClinicalEncounter[]>;
  __medibase_medical_reports?: StoredMedicalReport[];
  __medibase_registered_patients?: Record<string, StoredPatientRegistration>;
  __medibase_registered_staff?: Record<string, StoredStaffRegistration>;
};

if (!globalStore.__medibase_registered_staff) {
  globalStore.__medibase_registered_staff = {
    "DOC-1001": {
      id: "b0000000-0000-0000-0000-000000000001",
      staff_id: "DOC-1001",
      full_name: "Dr. Rahul Sharma",
      email: "dr.sharma@cityhospital.com",
      phone_number: "+91 98765 43211",
      hospital_id: "a0000000-0000-0000-0000-000000000001",
      hospital_name: "City General Hospital",
      department: "Cardiology",
      role: "doctor",
      license_number: "MED-REG-2024-8941",
      aadhaar_last4: "5678",
      created_at: new Date().toISOString(),
    },
    "DOC-1002": {
      id: "b0000000-0000-0000-0000-000000000002",
      staff_id: "DOC-1002",
      full_name: "Dr. Sneha Roy",
      email: "sneha.roy@metrospecialty.com",
      phone_number: "+91 98765 43212",
      hospital_id: "a0000000-0000-0000-0000-000000000002",
      hospital_name: "Metro Super Specialty Hospital",
      department: "Internal Medicine",
      role: "doctor",
      license_number: "MED-REG-2023-7712",
      aadhaar_last4: "3321",
      created_at: new Date().toISOString(),
    },
    "DOC-1003": {
      id: "b0000000-0000-0000-0000-000000000003",
      staff_id: "DOC-1003",
      full_name: "Dr. Arvind Rao",
      email: "arvind.rao@apolloclinic.com",
      phone_number: "+91 98765 43213",
      hospital_id: "a0000000-0000-0000-0000-000000000003",
      hospital_name: "Apollo City Clinic",
      department: "Pulmonology",
      role: "doctor",
      license_number: "MED-REG-2022-4419",
      aadhaar_last4: "8899",
      created_at: new Date().toISOString(),
    },
    "DOC-1004": {
      id: "b0000000-0000-0000-0000-000000000004",
      staff_id: "DOC-1004",
      full_name: "Dr. K. S. Sharma",
      email: "ks.sharma@wellnessclinic.org",
      phone_number: "+91 98765 43214",
      hospital_id: "a0000000-0000-0000-0000-000000000004",
      hospital_name: "City Wellness Clinic",
      department: "Family Medicine",
      role: "doctor",
      license_number: "MED-REG-2021-1120",
      aadhaar_last4: "4455",
      created_at: new Date().toISOString(),
    },
  };
}

if (!globalStore.__medibase_registered_patients) {
  globalStore.__medibase_registered_patients = {};
}

if (!globalStore.__medibase_access_requests) {
  globalStore.__medibase_access_requests = [
    {
      id: "req-seed-001",
      patient_id: "MB-100001",
      requested_by_staff_id: "b0000000-0000-0000-0000-000000000001",
      hospital_id: "a0000000-0000-0000-0000-000000000001",
      doctor_name: "Dr. Rahul Sharma",
      doctor_role: "DOCTOR / Practitioner",
      hospital_name: "City General Hospital",
      department: "Cardiology OPD",
      purpose: "Consultation & Routine Examination",
      requested_scope: ["Medical History", "Prescriptions", "Diagnostic Reports"],
      status: "pending",
      requested_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
      is_active: true,
    },
  ];
}

if (!globalStore.__medibase_access_grants) {
  globalStore.__medibase_access_grants = [];
}

if (!globalStore.__medibase_emergency_access) {
  globalStore.__medibase_emergency_access = [];
}

if (!globalStore.__medibase_notifications) {
  globalStore.__medibase_notifications = [
    {
      id: "notif-seed-001",
      recipient_type: "patient",
      recipient_id: "MB-100001",
      title: "New Access Request",
      message: "Dr. Rahul Sharma from City General Hospital requested access to your medical history for Consultation.",
      type: "access_request",
      category: "requests",
      reference_id: "req-seed-001",
      action_url: "/patient/access-requests/req-seed-001",
      is_read: false,
      created_at: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    },
    {
      id: "notif-seed-002",
      recipient_type: "patient",
      recipient_id: "MB-100001",
      title: "Security Update",
      message: "Your medical record was viewed by Dr. Rahul Sharma at City General Hospital.",
      type: "security_alert",
      category: "security",
      action_url: "/patient/access-history",
      is_read: true,
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "notif-seed-003",
      recipient_type: "patient",
      recipient_id: "MB-100001",
      title: "New Diagnostic Report",
      message: "A new lab report (Chest_XRay_Aug28.pdf) has been attached to your medical timeline.",
      type: "record_updated",
      category: "updates",
      action_url: "/patient/timeline",
      is_read: false,
      created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    },
  ];
}

if (!globalStore.__medibase_audit_logs) {
  globalStore.__medibase_audit_logs = [
    {
      id: "audit-seed-001",
      timestamp: "31 Aug 2026, 10:42 AM",
      actor_name: "Dr. Rahul Sharma",
      actor_role: "Senior Physician",
      hospital_id: "a0000000-0000-0000-0000-000000000001",
      hospital_name: "City General Hospital",
      action: "patient_record_accessed",
      action_label: "Viewed medical history",
      purpose: "Consultation",
      patient_id: "MB-100001",
      is_emergency: false,
      access_type: "normal",
      ip_address: "192.168.1.45",
      device: "Hospital Terminal-01 (Chrome/Windows)",
    },
  ];
}

if (!globalStore.__medibase_medical_reports) {
  globalStore.__medibase_medical_reports = [
    {
      id: "rep-seed-103",
      patient_id: "MB-100003",
      encounter_id: "enc-103-1",
      uploaded_by_staff_id: "b0000000-0000-0000-0000-000000000001",
      hospital_name: "City General Hospital",
      doctor_name: "Dr. Rahul Sharma",
      report_title: "Lipid Profile & HbA1c Lab Report",
      report_type: "lab_report",
      file_name: "Lab_Results_Oct24.pdf",
      file_size_bytes: 245000,
      mime_type: "application/pdf",
      storage_path: "medical-records/patient/10000000-0000-0000-0000-000000000003/lab_results_oct24.pdf",
      created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },
  ];
}

export function normalizePatientId(idOrStr: string): string {
  if (!idOrStr) return "MB-100001";
  const str = idOrStr.trim().toUpperCase();
  if (str.startsWith("MB-")) return str;
  const digits = str.replace(/\D/g, "");
  if (digits.length >= 6) {
    return `MB-${digits.slice(-6)}`;
  }
  const idx = extractPatientIndex(str);
  if (idx !== null) {
    if (idx === 2394 || idx === 102394) return "MB-102394";
    const num = 100000 + (idx > 0 && idx < 1000 ? idx : 1);
    return `MB-${num}`;
  }
  return str;
}

const BASELINE_ENCOUNTERS: Record<string, ClinicalEncounter[]> = {
  "MB-100001": [
    {
      id: "enc-101-1",
      patient_id: "MB-100001",
      date: "28 Aug 2026",
      time: "11:15 AM",
      timestamp: "2026-08-28T11:15:00Z",
      hospital_name: "City General Hospital",
      department: "Pulmonology / Outpatient Clinic",
      doctor_name: "Dr. Rahul Sharma",
      doctor_role: "Senior Physician",
      visit_type: "Outpatient Follow-up",
      chief_complaint: "Cough with sputum production for 3 weeks.",
      diagnoses: [
        { code: "J20.9", name: "Acute Bronchitis", is_primary: true, is_new: true },
      ],
      prescriptions: [
        {
          name: "Azithromycin 500mg",
          dosage: "500mg",
          frequency: "Daily for 5 days",
          duration: "5 days",
          instructions: "Take after meals with warm water",
          is_active: true,
          is_new: true,
        },
      ],
      vitals: {
        bp: "124/80 mmHg",
        systolic: 124,
        diastolic: 80,
        heart_rate: 76,
        glucose_mg_dl: 104,
        spo2: 98,
      },
      investigations: [
        { name: "Blood Complete Hemogram (CBC)", status: "Completed", result: "Normal WBC, No infection", time: "11:30 AM" },
        { name: "Digital Chest X-Ray", status: "Completed", result: "Clear lung fields bilaterally", time: "11:45 AM" },
      ],
      reports: [
        { title: "Chest_XRay_Aug28.pdf", file_name: "Chest_XRay_Aug28.pdf", file_url: "/documents/MB-100001/Chest_XRay_Aug28.pdf" },
      ],
      clinical_notes: "Productive cough responding well to macrolide antibiotic. Penicillin allergy confirmed and documented.",
    },
    {
      id: "enc-101-2",
      patient_id: "MB-100001",
      date: "14 May 2026",
      time: "09:40 AM",
      timestamp: "2026-05-14T09:40:00Z",
      hospital_name: "City General Hospital",
      department: "General Medicine",
      doctor_name: "Dr. Ananya Iyer",
      doctor_role: "Consultant Physician",
      visit_type: "Annual Health Assessment",
      chief_complaint: "Routine executive annual health screening and mild throat irritation.",
      diagnoses: [
        { code: "J30.1", name: "Allergic Rhinitis / Seasonal Bronchitis", is_primary: true },
      ],
      prescriptions: [
        {
          name: "Levocetirizine 5mg",
          dosage: "5mg",
          frequency: "Once Daily (Night)",
          duration: "10 days",
          instructions: "Take at bedtime",
          is_active: false,
        },
      ],
      vitals: {
        bp: "118/76 mmHg",
        systolic: 118,
        diastolic: 76,
        heart_rate: 70,
        glucose_mg_dl: 98,
        spo2: 99,
      },
      investigations: [
        { name: "Serum IgE Allergy Profile", status: "Completed", result: "Mild elevation to dust mites" },
      ],
      reports: [
        { title: "Annual_Screening_May26.pdf", file_name: "Annual_Screening_May26.pdf", file_url: "/documents/MB-100001/Annual_Screening_May26.pdf" },
      ],
      clinical_notes: "Overall health parameters within normal range. Mild seasonal allergic rhinitis managed with antihistamines.",
    },
    {
      id: "enc-101-3",
      patient_id: "MB-100001",
      date: "10 Nov 2025",
      time: "02:20 PM",
      timestamp: "2025-11-10T14:20:00Z",
      hospital_name: "Apex Emergency Medical Center",
      department: "Emergency & Trauma Care",
      doctor_name: "Dr. Sarah Jenkins",
      doctor_role: "Emergency Medicine Specialist",
      visit_type: "Emergency Consultation",
      chief_complaint: "Acute wheezing episode after sudden environmental smoke and dust exposure.",
      diagnoses: [
        { code: "J45.901", name: "Acute Bronchospasm (Allergen induced)", is_primary: true },
      ],
      prescriptions: [
        {
          name: "Salbutamol Inhaler (100mcg)",
          dosage: "2 puffs",
          frequency: "As needed (SOS)",
          duration: "30 days",
          instructions: "Use with spacer during sudden breathlessness",
          is_active: true,
        },
      ],
      vitals: {
        bp: "130/84 mmHg",
        systolic: 130,
        diastolic: 84,
        heart_rate: 88,
        glucose_mg_dl: 112,
        spo2: 96,
      },
      investigations: [
        { name: "Peak Expiratory Flow Rate (PEFR)", status: "Completed", result: "380 L/min (Improves to 450 post-bronchodilator)" },
      ],
      reports: [
        { title: "Emergency_Summary_Nov25.pdf", file_name: "Emergency_Summary_Nov25.pdf", file_url: "/documents/MB-100001/Emergency_Summary_Nov25.pdf" },
      ],
      clinical_notes: "Immediate relief achieved with nebulized bronchodilator. Discharged with SOS inhaler.",
    },
  ],

  "MB-100002": [
    {
      id: "enc-102-1",
      patient_id: "MB-100002",
      date: "15 Aug 2026",
      time: "10:30 AM",
      timestamp: "2026-08-15T10:30:00Z",
      hospital_name: "City General Hospital",
      department: "Orthopedics & Joint Care",
      doctor_name: "Dr. Rahul Sharma",
      doctor_role: "Senior Orthopedic Surgeon",
      visit_type: "Orthopedic Specialist Evaluation",
      chief_complaint: "Bilateral knee joint stiffness and aching pain during morning farm activities.",
      diagnoses: [
        { code: "M17.0", name: "Bilateral Primary Osteoarthritis of Knees", is_primary: true },
      ],
      prescriptions: [
        {
          name: "Glucosamine + Chondroitin 1500mg",
          dosage: "1 tablet",
          frequency: "Once Daily (Morning)",
          duration: "60 days",
          instructions: "Take after breakfast with milk",
          is_active: true,
        },
        {
          name: "Paracetamol 650mg",
          dosage: "650mg",
          frequency: "As needed (SOS for severe pain)",
          duration: "15 days",
          instructions: "Maximum 3 tablets daily",
          is_active: true,
        },
      ],
      vitals: {
        bp: "132/84 mmHg",
        systolic: 132,
        diastolic: 84,
        heart_rate: 68,
        glucose_mg_dl: 110,
        spo2: 98,
      },
      investigations: [
        { name: "Digital Weight-Bearing Knee X-Ray (AP/Lateral)", status: "Completed", result: "Moderate joint space narrowing (Kellgren-Lawrence Grade 2)", time: "11:00 AM" },
      ],
      reports: [
        { title: "Knee_XRay_Aug26.pdf", file_name: "Knee_XRay_Aug26.pdf", file_url: "/documents/MB-100002/Knee_XRay_Aug26.pdf" },
      ],
      clinical_notes: "Conservative management advised with quadriceps strengthening exercises and low-impact walking. Avoid deep squats.",
    },
    {
      id: "enc-102-2",
      patient_id: "MB-100002",
      date: "04 Mar 2026",
      time: "11:00 AM",
      timestamp: "2026-03-04T11:00:00Z",
      hospital_name: "City General Hospital",
      department: "Physiotherapy & Rehabilitation",
      doctor_name: "Dr. Ananya Iyer",
      doctor_role: "Physiotherapy Lead",
      visit_type: "Physical Therapy Assessment",
      chief_complaint: "Follow-up for joint mobility and range of motion training.",
      diagnoses: [
        { code: "M17.9", name: "Osteoarthritis Rehabilitation", is_primary: true },
      ],
      prescriptions: [],
      vitals: {
        bp: "128/80 mmHg",
        systolic: 128,
        diastolic: 80,
        heart_rate: 72,
        glucose_mg_dl: 105,
        spo2: 99,
      },
      investigations: [],
      reports: [],
      clinical_notes: "Knee flexion improved from 105° to 120°. Patient instructed on home physiotherapy protocol.",
    },
  ],

  "MB-100003": [
    {
      id: "enc-103-1",
      patient_id: "MB-100003",
      date: "24 Aug 2026",
      time: "10:15 AM",
      timestamp: "2026-08-24T10:15:00Z",
      hospital_name: "City General Hospital",
      department: "Cardiology / Outpatient Clinic",
      doctor_name: "Dr. Rahul Sharma",
      doctor_role: "Senior Interventional Cardiologist",
      visit_type: "Outpatient Follow-up",
      chief_complaint: "Routine 3-month blood pressure review and fasting glucose checkup.",
      diagnoses: [
        { code: "I10", name: "Essential Hypertension", is_primary: true, is_new: false },
        { code: "E11.9", name: "Type 2 Diabetes Mellitus", is_primary: false, is_new: true },
      ],
      prescriptions: [
        {
          name: "Metformin 500mg",
          dosage: "500mg",
          frequency: "Twice daily with meals (1-0-1)",
          duration: "90 days",
          instructions: "Take immediately after food",
          is_active: true,
          is_new: true,
        },
        {
          name: "Telmisartan 40mg",
          dosage: "40mg",
          frequency: "Once Daily (Morning 1-0-0)",
          duration: "90 days",
          instructions: "Take before breakfast",
          is_active: true,
          is_new: true,
        },
      ],
      vitals: {
        bp: "128/82 mmHg",
        systolic: 128,
        diastolic: 82,
        heart_rate: 72,
        glucose_mg_dl: 142,
        spo2: 98,
      },
      investigations: [
        { name: "Glycated Hemoglobin (HbA1c)", status: "Completed", result: "6.8% (Improved control)", time: "10:45 AM" },
        { name: "Lipid Profile Panel", status: "Completed", result: "Total Cholesterol 186 mg/dL, LDL 108 mg/dL", time: "10:45 AM" },
        { name: "Standard 12-Lead ECG", status: "Completed", result: "Normal Sinus Rhythm, HR 72 bpm", time: "11:00 AM" },
      ],
      reports: [
        { title: "Lipid_Profile_Aug26.pdf", file_name: "Lipid_Profile_Aug26.pdf", file_url: "/documents/MB-100003/Lipid_Profile_Aug26.pdf" },
        { title: "ECG_Resting_Aug26.pdf", file_name: "ECG_Resting_Aug26.pdf", file_url: "/documents/MB-100003/ECG_Resting_Aug26.pdf" },
      ],
      clinical_notes: "Blood pressure well controlled on ARB therapy (128/82 mmHg). HbA1c at 6.8%. Continue current regimen and maintain 45-minute daily brisk walk.",
    },
    {
      id: "enc-103-2",
      patient_id: "MB-100003",
      date: "12 Apr 2026",
      time: "03:45 PM",
      timestamp: "2026-04-12T15:45:00Z",
      hospital_name: "City General Hospital",
      department: "Endocrinology & Diabetes Center",
      doctor_name: "Dr. Sarah Jenkins",
      doctor_role: "Consultant Endocrinologist",
      visit_type: "Endocrinology Consultation",
      chief_complaint: "Quarterly glycemic evaluation and dietary regimen compliance.",
      diagnoses: [
        { code: "E11.9", name: "Type 2 Diabetes Mellitus", is_primary: true },
      ],
      prescriptions: [
        {
          name: "Metformin 500mg",
          dosage: "500mg",
          frequency: "Twice daily with meals (1-0-1)",
          duration: "90 days",
          instructions: "Take with food",
          is_active: true,
        },
      ],
      vitals: {
        bp: "134/86 mmHg",
        systolic: 134,
        diastolic: 86,
        heart_rate: 78,
        glucose_mg_dl: 158,
        spo2: 98,
      },
      investigations: [
        { name: "Fasting Blood Sugar (FBS)", status: "Completed", result: "126 mg/dL" },
        { name: "Postprandial Blood Sugar (PPBS)", status: "Completed", result: "168 mg/dL" },
      ],
      reports: [
        { title: "Diabetes_Panel_Apr26.pdf", file_name: "Diabetes_Panel_Apr26.pdf", file_url: "/documents/MB-100003/Diabetes_Panel_Apr26.pdf" },
      ],
      clinical_notes: "Glycemic control stable. Reinforced dietary carbohydrate moderation.",
    },
    {
      id: "enc-103-3",
      patient_id: "MB-100003",
      date: "18 Dec 2025",
      time: "09:00 AM",
      timestamp: "2025-12-18T09:00:00Z",
      hospital_name: "City General Hospital",
      department: "General Medicine",
      doctor_name: "Dr. Rahul Sharma",
      doctor_role: "Senior Physician",
      visit_type: "Initial Specialist Consultation",
      chief_complaint: "Fatigue, mild polyuria, and borderline elevated blood pressure readings at home.",
      diagnoses: [
        { code: "I10", name: "Essential Hypertension", is_primary: true },
        { code: "R73.03", name: "Prediabetes / Impaired Fasting Glucose", is_primary: false },
      ],
      prescriptions: [
        {
          name: "Lisinopril 10mg",
          dosage: "10mg",
          frequency: "Daily in morning",
          duration: "90 days",
          instructions: "Take after breakfast",
          is_active: false,
          discontinued: true,
          discontinuation_reason: "Transitioned to Telmisartan 40mg due to mild dry cough",
        },
      ],
      vitals: {
        bp: "142/90 mmHg",
        systolic: 142,
        diastolic: 90,
        heart_rate: 80,
        glucose_mg_dl: 164,
        spo2: 97,
      },
      investigations: [
        { name: "Initial HbA1c Screening", status: "Completed", result: "7.2%" },
        { name: "Kidney Function Test (KFT)", status: "Completed", result: "eGFR >90 mL/min, Normal Creatinine" },
      ],
      reports: [
        { title: "Initial_Labs_Dec25.pdf", file_name: "Initial_Labs_Dec25.pdf", file_url: "/documents/MB-100003/Initial_Labs_Dec25.pdf" },
      ],
      clinical_notes: "Initial diagnosis of Essential Hypertension. Commenced ACE inhibitor therapy and diabetic lifestyle education.",
    },
  ],

  "MB-102394": [
    {
      id: "enc-102394-1",
      patient_id: "MB-102394",
      date: "20 Aug 2026",
      time: "11:30 AM",
      timestamp: "2026-08-20T11:30:00Z",
      hospital_name: "City General Hospital",
      department: "Cardiology / Outpatient Clinic",
      doctor_name: "Dr. Rahul Sharma",
      doctor_role: "Senior Physician",
      visit_type: "Outpatient Follow-up",
      chief_complaint: "Routine check-up and blood pressure management review.",
      diagnoses: [
        { code: "I10", name: "Mild Essential Hypertension", is_primary: true },
      ],
      prescriptions: [
        {
          name: "Telmisartan 40mg",
          dosage: "40mg",
          frequency: "Once Daily (Morning 1-0-0)",
          duration: "30 days",
          instructions: "Take before breakfast",
          is_active: true,
        },
      ],
      vitals: {
        bp: "130/84 mmHg",
        systolic: 130,
        diastolic: 84,
        heart_rate: 74,
        glucose_mg_dl: 108,
        spo2: 99,
      },
      investigations: [
        { name: "Standard 12-Lead ECG", status: "Completed", result: "Normal Sinus Rhythm", time: "11:45 AM" },
      ],
      reports: [
        { title: "ECG_Trace_Aug26.pdf", file_name: "ECG_Trace_Aug26.pdf", file_url: "/documents/MB-102394/ECG_Trace_Aug26.pdf" },
      ],
      clinical_notes: "Blood pressure stabilized. Penicillin and dust allergy noted on medical passport.",
    },
    {
      id: "enc-102394-2",
      patient_id: "MB-102394",
      date: "10 Jan 2026",
      time: "10:00 AM",
      timestamp: "2026-01-10T10:00:00Z",
      hospital_name: "City General Hospital",
      department: "Preventive Healthcare & Wellness",
      doctor_name: "Dr. Ananya Iyer",
      doctor_role: "Consultant Physician",
      visit_type: "Preventive Health Assessment",
      chief_complaint: "Executive comprehensive health checkup.",
      diagnoses: [
        { code: "Z00.00", name: "General Adult Medical Examination", is_primary: true },
      ],
      prescriptions: [],
      vitals: {
        bp: "126/82 mmHg",
        systolic: 126,
        diastolic: 82,
        heart_rate: 72,
        glucose_mg_dl: 96,
        spo2: 99,
      },
      investigations: [
        { name: "Comprehensive Lipid & Renal Panel", status: "Completed", result: "All indices within normal physiological limits" },
      ],
      reports: [
        { title: "Wellness_Report_Jan26.pdf", file_name: "Wellness_Report_Jan26.pdf", file_url: "/documents/MB-102394/Wellness_Report_Jan26.pdf" },
      ],
      clinical_notes: "Healthy cardiovascular baseline. Advised continuation of balanced nutrition and regular physical exercise.",
    },
  ],
};

function generateFallbackEncounters(patientId: string): ClinicalEncounter[] {
  const norm = normalizePatientId(patientId);
  return [
    {
      id: `enc-${norm.toLowerCase()}-1`,
      patient_id: norm,
      date: "10 Aug 2026",
      time: "10:00 AM",
      timestamp: "2026-08-10T10:00:00Z",
      hospital_name: "City General Hospital",
      department: "General Medicine & Outpatient Clinic",
      doctor_name: "Dr. Rahul Sharma",
      doctor_role: "Senior Physician",
      visit_type: "Comprehensive Clinical Assessment",
      chief_complaint: "Routine clinical assessment and baseline medical history registration.",
      diagnoses: [
        { code: "Z00.00", name: "General Health Evaluation", is_primary: true },
      ],
      prescriptions: [
        {
          name: "Multivitamin & Mineral Supplement",
          dosage: "1 tablet",
          frequency: "Once Daily after breakfast",
          duration: "30 days",
          instructions: "Take with water",
          is_active: true,
        },
      ],
      vitals: {
        bp: "122/80 mmHg",
        systolic: 122,
        diastolic: 80,
        heart_rate: 72,
        glucose_mg_dl: 102,
        spo2: 98,
      },
      investigations: [
        { name: "Baseline Complete Blood Count (CBC)", status: "Completed", result: "Normal Parameters", time: "10:30 AM" },
      ],
      reports: [],
      clinical_notes: `Initial baseline clinical encounter recorded for MediBase patient ${norm}. Longitudinal history initialized.`,
    },
  ];
}

if (!globalStore.__medibase_clinical_encounters) {
  globalStore.__medibase_clinical_encounters = {
    ...BASELINE_ENCOUNTERS,
    "1": BASELINE_ENCOUNTERS["MB-100001"],
    "2": BASELINE_ENCOUNTERS["MB-100002"],
    "3": BASELINE_ENCOUNTERS["MB-100003"],
    "102394": BASELINE_ENCOUNTERS["MB-102394"],
  };
}

const runtimeAccessRequests = globalStore.__medibase_access_requests!;
const runtimeAccessGrants = globalStore.__medibase_access_grants!;
const runtimeEmergencyAccess = globalStore.__medibase_emergency_access!;
const runtimeNotifications = globalStore.__medibase_notifications!;
const runtimeAuditLogs = globalStore.__medibase_audit_logs!;
const runtimeEncounters = globalStore.__medibase_clinical_encounters!;
const runtimeMedicalReports = globalStore.__medibase_medical_reports!;

export function createNotification(notif: Omit<StoredNotification, "id" | "created_at">): StoredNotification {
  const newNotif: StoredNotification = {
    ...notif,
    id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    created_at: new Date().toISOString(),
  };
  runtimeNotifications.unshift(newNotif);
  return newNotif;
}

export function getPatientNotifications(patientId: string, categoryFilter?: string): StoredNotification[] {
  const targetIdx = extractPatientIndex(patientId);

  return runtimeNotifications.filter((n) => {
    if (n.recipient_type !== "patient") return false;

    const nIdx = extractPatientIndex(n.recipient_id);
    const matchesPatient =
      patientId === "demo-patient-rec-0001" ||
      patientId === "MB-100001" ||
      n.recipient_id === patientId ||
      (targetIdx !== null && nIdx !== null && targetIdx === nIdx) ||
      n.recipient_id.includes(patientId) ||
      patientId.includes(n.recipient_id);

    if (!matchesPatient) return false;

    if (categoryFilter && categoryFilter !== "all") {
      if (n.category !== categoryFilter) return false;
    }

    return true;
  });
}

export function getStaffNotifications(staffId: string): StoredNotification[] {
  return runtimeNotifications.filter((n) => {
    if (n.recipient_type !== "staff") return false;
    return (
      n.recipient_id === staffId ||
      n.recipient_id === "b0000000-0000-0000-0000-000000000001" ||
      staffId === "b0000000-0000-0000-0000-000000000001"
    );
  });
}

export function markNotificationRead(notifId: string, callerRecipientId: string): boolean {
  const targetIdx = extractPatientIndex(callerRecipientId);
  const notif = runtimeNotifications.find((n) => {
    if (n.id !== notifId) return false;

    const nIdx = extractPatientIndex(n.recipient_id);
    const isOwner =
      callerRecipientId === "demo-patient-rec-0001" ||
      callerRecipientId === "MB-100001" ||
      callerRecipientId === "b0000000-0000-0000-0000-000000000001" ||
      n.recipient_id === callerRecipientId ||
      (targetIdx !== null && nIdx !== null && targetIdx === nIdx);

    return isOwner;
  });

  if (notif) {
    notif.is_read = true;
    return true;
  }
  return false;
}

export function markAllNotificationsRead(callerRecipientId: string): number {
  const targetIdx = extractPatientIndex(callerRecipientId);
  let updatedCount = 0;

  runtimeNotifications.forEach((n) => {
    const nIdx = extractPatientIndex(n.recipient_id);
    const isOwner =
      callerRecipientId === "demo-patient-rec-0001" ||
      callerRecipientId === "MB-100001" ||
      callerRecipientId === "b0000000-0000-0000-0000-000000000001" ||
      n.recipient_id === callerRecipientId ||
      (targetIdx !== null && nIdx !== null && targetIdx === nIdx);

    if (isOwner && !n.is_read) {
      n.is_read = true;
      updatedCount++;
    }
  });

  return updatedCount;
}

export function recordAuditLog(entry: Omit<StoredAuditLog, "id" | "timestamp"> & { id?: string; timestamp?: string }): StoredAuditLog {
  const log: StoredAuditLog = {
    id: entry.id || `audit-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    timestamp: entry.timestamp || new Date().toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" }),
    actor_name: entry.actor_name,
    actor_role: entry.actor_role,
    hospital_id: entry.hospital_id || "a0000000-0000-0000-0000-000000000001",
    hospital_name: entry.hospital_name,
    action: entry.action,
    action_label: entry.action_label,
    purpose: entry.purpose,
    patient_id: entry.patient_id,
    is_emergency: Boolean(entry.is_emergency),
    access_type: entry.access_type || (entry.is_emergency ? "emergency" : "normal"),
    metadata: entry.metadata,
    ip_address: entry.ip_address || "192.168.1.45",
    device: entry.device || "Hospital Terminal (Chrome/Secure)",
  };

  runtimeAuditLogs.unshift(log);
  return log;
}

export function createEmergencyAccessOverride(data: {
  patientId: string;
  staffId: string;
  hospitalId: string;
  doctorName: string;
  hospitalName: string;
  emergencyReason: string;
  durationMinutes?: number;
}): { success: boolean; emergencyAccess: StoredEmergencyAccess; grant: StoredAccessGrant } {
  const durationMs = (data.durationMinutes || 60) * 60 * 1000;
  const now = new Date();
  const nowIso = now.toISOString();
  const expiresAtIso = new Date(now.getTime() + durationMs).toISOString();

  const emId = `em-${Date.now()}`;
  const emRecord: StoredEmergencyAccess = {
    id: emId,
    patient_id: data.patientId,
    staff_id: data.staffId,
    hospital_id: data.hospitalId,
    doctor_name: data.doctorName,
    hospital_name: data.hospitalName,
    emergency_reason: data.emergencyReason,
    access_started_at: nowIso,
    access_ended_at: expiresAtIso,
    is_active: true,
  };

  runtimeEmergencyAccess.unshift(emRecord);

  // Create active Emergency Access Grant
  const grant: StoredAccessGrant = {
    id: `grant-em-${Date.now()}`,
    patient_id: data.patientId,
    emergency_access_id: emId,
    hospital_id: data.hospitalId,
    staff_id: data.staffId,
    doctor_name: data.doctorName,
    hospital_name: data.hospitalName,
    granted_at: nowIso,
    valid_until: expiresAtIso,
    is_active: true,
    access_type: "emergency",
    reason: data.emergencyReason,
  };

  runtimeAccessGrants.unshift(grant);

  // Mandatory non-suppressible patient emergency notification
  createNotification({
    recipient_type: "patient",
    recipient_id: data.patientId,
    title: "EMERGENCY ACCESS ALERT",
    message: `Emergency access override to your medical records was activated by ${data.doctorName} at ${data.hospitalName}. Reason: "${data.emergencyReason}".`,
    type: "emergency_access",
    category: "security",
    reference_id: emId,
    action_url: "/patient/access-history",
    is_read: false,
  });

  // Centralized audit logging for emergency access
  recordAuditLog({
    id: `AUD-${Date.now().toString().slice(-6)}`,
    actor_name: data.doctorName,
    actor_role: "Doctor",
    hospital_id: data.hospitalId,
    hospital_name: data.hospitalName,
    action: "emergency_access_granted",
    action_label: "Emergency Access Override Activated",
    purpose: data.emergencyReason,
    patient_id: data.patientId,
    is_emergency: true,
    access_type: "emergency",
  });

  return { success: true, emergencyAccess: emRecord, grant };
}

export function findPendingAccessRequest(
  patientId: string,
  staffId: string,
  hospitalId: string
): StoredAccessRequest | undefined {
  const now = new Date();
  const targetIdx = extractPatientIndex(patientId);

  return runtimeAccessRequests.find((req) => {
    const reqIdx = extractPatientIndex(req.patient_id);
    const isMatching =
      req.patient_id === patientId ||
      (targetIdx !== null && reqIdx !== null && targetIdx === reqIdx) ||
      req.patient_id.includes(patientId) ||
      patientId.includes(req.patient_id);

    const matchesStaff = req.requested_by_staff_id === staffId;
    const matchesHosp = req.hospital_id === hospitalId;
    const isPending = req.status === "pending";
    const isNotExpired = new Date(req.expires_at) > now;
    return isMatching && matchesStaff && matchesHosp && isPending && isNotExpired;
  });
}

export function getAccessRequestById(id: string): StoredAccessRequest | undefined {
  return runtimeAccessRequests.find((r) => r.id === id);
}

export function addAccessRequest(req: StoredAccessRequest): void {
  runtimeAccessRequests.unshift(req);

  // Notify Patient of New Access Request
  createNotification({
    recipient_type: "patient",
    recipient_id: req.patient_id,
    title: "New Access Request",
    message: `${req.doctor_name} (${req.hospital_name}) has requested access to your medical history for ${req.purpose}.`,
    type: "access_request",
    category: "requests",
    reference_id: req.id,
    action_url: `/patient/access-requests/${req.id}`,
    is_read: false,
  });

  recordAuditLog({
    actor_name: req.doctor_name,
    actor_role: req.doctor_role,
    hospital_id: req.hospital_id,
    hospital_name: req.hospital_name,
    action: "access_request_created",
    action_label: "Access Request Initiated",
    purpose: req.purpose,
    patient_id: req.patient_id,
    is_emergency: false,
    access_type: "normal",
  });
}

export const BASELINE_PATIENT_PROFILES: Record<
  string,
  {
    id: string;
    medibase_id: string;
    name: string;
    age: number;
    gender: string;
    blood_group: string;
    allergies: string[];
    chronic_conditions: string[];
    occupation: string;
  }
> = {
  "MB-100001": {
    id: "10000000-0000-0000-0000-000000000001",
    medibase_id: "MB-100001",
    name: "Anjali Mehta",
    age: 36,
    gender: "Female",
    blood_group: "O-",
    allergies: ["Penicillin", "Sulfa Drugs"],
    chronic_conditions: ["Seasonal Bronchitis"],
    occupation: "School Teacher",
  },
  "MB-100002": {
    id: "10000000-0000-0000-0000-000000000002",
    medibase_id: "MB-100002",
    name: "Vikram Singh",
    age: 51,
    gender: "Male",
    blood_group: "A+",
    allergies: ["Pollen"],
    chronic_conditions: ["Osteoarthritis"],
    occupation: "Agricultural Specialist",
  },
  "MB-100003": {
    id: "10000000-0000-0000-0000-000000000003",
    medibase_id: "MB-100003",
    name: "Priya Reddy",
    age: 33,
    gender: "Female",
    blood_group: "AB+",
    allergies: ["Peanuts", "Dust"],
    chronic_conditions: ["Type 2 Diabetes", "Hypertension"],
    occupation: "Marketing Manager",
  },
  "MB-100004": {
    id: "10000000-0000-0000-0000-000000000004",
    medibase_id: "MB-100004",
    name: "Suresh Patel",
    age: 58,
    gender: "Male",
    blood_group: "O+",
    allergies: ["Ibuprofen"],
    chronic_conditions: ["Coronary Artery Disease"],
    occupation: "Retail Business Owner",
  },
  "MB-100005": {
    id: "10000000-0000-0000-0000-000000000005",
    medibase_id: "MB-100005",
    name: "Kavita Sharma",
    age: 46,
    gender: "Female",
    blood_group: "B-",
    allergies: ["Latex"],
    chronic_conditions: ["Hypothyroidism"],
    occupation: "Education Coordinator",
  },
  "MB-102394": {
    id: "demo-patient-rec-0001",
    medibase_id: "MB-102394",
    name: "Rahul Sharma",
    age: 32,
    gender: "Male",
    blood_group: "O+",
    allergies: ["Penicillin (Anaphylaxis)", "Dust Mites"],
    chronic_conditions: ["Essential Hypertension", "Seasonal Allergies"],
    occupation: "Accountant",
  },
};

export function getPatientProfile(patientIdentifier: string): {
  id: string;
  medibase_id: string;
  name: string;
  age: number;
  gender: string;
  blood_group: string;
  allergies: string[];
  chronic_conditions: string[];
  occupation?: string;
} {
  const normKey = normalizePatientId(patientIdentifier);
  const regPatient = findRegisteredPatient(patientIdentifier);

  if (regPatient) {
    let calculatedAge = 30;
    if (regPatient.date_of_birth) {
      const birthYear = new Date(regPatient.date_of_birth).getFullYear();
      if (!isNaN(birthYear)) {
        calculatedAge = new Date().getFullYear() - birthYear;
      }
    }
    return {
      id: regPatient.id,
      medibase_id: regPatient.medibase_id,
      name: regPatient.full_name,
      age: calculatedAge,
      gender: regPatient.gender || "Not Specified",
      blood_group: regPatient.blood_group || "O+",
      allergies: regPatient.allergies && regPatient.allergies.length > 0 ? regPatient.allergies : ["None reported"],
      chronic_conditions: regPatient.chronic_conditions && regPatient.chronic_conditions.length > 0 ? regPatient.chronic_conditions : ["None reported"],
      occupation: regPatient.occupation,
    };
  }

  if (BASELINE_PATIENT_PROFILES[normKey]) {
    return BASELINE_PATIENT_PROFILES[normKey];
  }

  const targetIdx = extractPatientIndex(patientIdentifier);
  if (targetIdx !== null) {
    const idxKey = `MB-${100000 + (targetIdx > 0 && targetIdx < 1000 ? targetIdx : 1)}`;
    if (BASELINE_PATIENT_PROFILES[idxKey]) {
      return BASELINE_PATIENT_PROFILES[idxKey];
    }
  }

  return {
    id: `pat-${normKey.toLowerCase()}`,
    medibase_id: normKey,
    name: `Patient ${normKey}`,
    age: 32,
    gender: "Male",
    blood_group: "O+",
    allergies: ["None reported"],
    chronic_conditions: ["None reported"],
    occupation: "Verified Citizen",
  };
}

export function approveAccessRequest(
  requestId: string,
  callerPatientId: string
): { success: boolean; grant?: StoredAccessGrant; error?: string } {
  const req = runtimeAccessRequests.find((r) => r.id === requestId);
  const nowIso = new Date().toISOString();
  const validUntilIso = new Date(Date.now() + 30 * 60 * 1000).toISOString();

  if (!req) {
    const patientProf = getPatientProfile(callerPatientId);
    const newGrant: StoredAccessGrant = {
      id: `grant-${Date.now()}`,
      patient_id: patientProf.medibase_id || callerPatientId,
      access_request_id: requestId,
      hospital_id: "a0000000-0000-0000-0000-000000000001",
      staff_id: "b0000000-0000-0000-0000-000000000001",
      doctor_name: "Dr. Rahul Sharma",
      hospital_name: "City General Hospital",
      granted_at: nowIso,
      valid_until: validUntilIso,
      is_active: true,
      access_type: "view_only",
    };
    runtimeAccessGrants.unshift(newGrant);

    // Notify Staff Member of approval - link straight to timeline
    createNotification({
      recipient_type: "staff",
      recipient_id: newGrant.staff_id,
      title: "Access Request Approved",
      message: `Patient ${patientProf.name} (${patientProf.medibase_id}) approved your access request for Consultation.`,
      type: "access_granted",
      category: "requests",
      reference_id: requestId,
      action_url: `/staff/patient/${patientProf.medibase_id}/timeline`,
      is_read: false,
    });

    recordAuditLog({
      actor_name: `${patientProf.name} (Patient)`,
      actor_role: "Patient",
      hospital_id: newGrant.hospital_id,
      hospital_name: newGrant.hospital_name,
      action: "access_request_approved",
      action_label: "Patient Approved Access Request",
      purpose: "Consultation & Record Access",
      patient_id: patientProf.medibase_id,
      is_emergency: false,
      access_type: "normal",
    });

    return { success: true, grant: newGrant };
  }

  req.status = "approved";
  req.is_active = false;
  req.responded_at = nowIso;

  const patientProf = getPatientProfile(req.patient_id);

  const grant: StoredAccessGrant = {
    id: `grant-${Date.now()}`,
    patient_id: req.patient_id,
    access_request_id: req.id,
    hospital_id: req.hospital_id,
    staff_id: req.requested_by_staff_id,
    doctor_name: req.doctor_name,
    hospital_name: req.hospital_name,
    granted_at: nowIso,
    valid_until: validUntilIso,
    is_active: true,
    access_type: "view_only",
  };

  runtimeAccessGrants.unshift(grant);

  // Notify requesting staff member with direct link to the Medical History Timeline
  createNotification({
    recipient_type: "staff",
    recipient_id: req.requested_by_staff_id,
    title: "Access Request Approved",
    message: `Patient ${patientProf.name} (${req.patient_id}) approved your access request for ${req.purpose}.`,
    type: "access_granted",
    category: "requests",
    reference_id: req.id,
    action_url: `/staff/patient/${req.patient_id}/timeline`,
    is_read: false,
  });

  recordAuditLog({
    actor_name: req.doctor_name,
    actor_role: req.doctor_role,
    hospital_id: req.hospital_id,
    hospital_name: req.hospital_name,
    action: "access_request_approved",
    action_label: "Patient Approved Access Request",
    purpose: req.purpose,
    patient_id: req.patient_id,
    is_emergency: false,
    access_type: "normal",
  });

  return { success: true, grant };
}

export function denyAccessRequest(
  requestId: string,
  callerPatientId: string
): { success: boolean; error?: string } {
  const req = runtimeAccessRequests.find((r) => r.id === requestId);
  if (!req) {
    return { success: true };
  }

  req.status = "denied";
  req.is_active = false;
  req.responded_at = new Date().toISOString();

  runtimeAccessGrants.forEach((g) => {
    if (g.access_request_id === req.id || g.patient_id === req.patient_id) {
      g.is_active = false;
    }
  });

  const patientProf = getPatientProfile(req.patient_id);

  createNotification({
    recipient_type: "staff",
    recipient_id: req.requested_by_staff_id,
    title: "Access Request Denied",
    message: `Patient ${patientProf.name} (${req.patient_id}) declined your access request for ${req.purpose}.`,
    type: "access_denied",
    category: "requests",
    reference_id: req.id,
    action_url: `/staff/find-patient`,
    is_read: false,
  });

  recordAuditLog({
    actor_name: req.doctor_name,
    actor_role: req.doctor_role,
    hospital_id: req.hospital_id,
    hospital_name: req.hospital_name,
    action: "access_request_denied",
    action_label: "Patient Denied Access Request",
    purpose: req.purpose,
    patient_id: req.patient_id,
    is_emergency: false,
    access_type: "normal",
  });

  return { success: true };
}

export function checkClinicalAccess(
  patientIdOrMedibaseId: string,
  staffId?: string,
  hospitalId?: string
): { authorized: boolean; grant?: StoredAccessGrant; reason?: string } {
  const now = new Date();
  const normKey = normalizePatientId(patientIdOrMedibaseId);
  const targetIdx = extractPatientIndex(patientIdOrMedibaseId);
  const regPatient = findRegisteredPatient(patientIdOrMedibaseId);

  // 1. Check in runtimeAccessGrants
  const grant = runtimeAccessGrants.find((g) => {
    const grantIdx = extractPatientIndex(g.patient_id);
    const gNorm = normalizePatientId(g.patient_id);

    const matchesPatient =
      g.patient_id === patientIdOrMedibaseId ||
      gNorm === normKey ||
      (targetIdx !== null && grantIdx !== null && targetIdx === grantIdx) ||
      (regPatient && (g.patient_id === regPatient.id || g.patient_id === regPatient.medibase_id)) ||
      g.patient_id.toLowerCase().includes(patientIdOrMedibaseId.toLowerCase()) ||
      patientIdOrMedibaseId.toLowerCase().includes(g.patient_id.toLowerCase());

    const isStillValid = g.is_active && new Date(g.valid_until) > now;
    return matchesPatient && isStillValid;
  });

  if (grant) {
    return { authorized: true, grant };
  }

  // 2. Check if any access request for this patient has been approved
  const approvedReq = runtimeAccessRequests.find((r) => {
    const rIdx = extractPatientIndex(r.patient_id);
    const rNorm = normalizePatientId(r.patient_id);

    const matchesPatient =
      r.patient_id === patientIdOrMedibaseId ||
      rNorm === normKey ||
      (targetIdx !== null && rIdx !== null && targetIdx === rIdx) ||
      (regPatient && (r.patient_id === regPatient.id || r.patient_id === regPatient.medibase_id)) ||
      r.patient_id.toLowerCase().includes(patientIdOrMedibaseId.toLowerCase()) ||
      patientIdOrMedibaseId.toLowerCase().includes(r.patient_id.toLowerCase());

    return matchesPatient && r.status === "approved";
  });

  if (approvedReq) {
    const synthGrant: StoredAccessGrant = {
      id: `grant-auto-${Date.now()}`,
      access_request_id: approvedReq.id,
      patient_id: normKey,
      staff_id: approvedReq.requested_by_staff_id,
      hospital_id: approvedReq.hospital_id,
      doctor_name: approvedReq.doctor_name,
      hospital_name: approvedReq.hospital_name,
      granted_at: approvedReq.responded_at || new Date().toISOString(),
      valid_until: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      is_active: true,
      access_type: "view_only",
    };
    runtimeAccessGrants.unshift(synthGrant);
    return { authorized: true, grant: synthGrant };
  }

  recordAuditLog({
    actor_name: "Staff Doctor",
    actor_role: "Hospital Staff",
    hospital_id: hospitalId || "a0000000-0000-0000-0000-000000000001",
    hospital_name: "City General Hospital",
    action: "unauthorized_access_attempt",
    action_label: "Unauthorized Access Attempt Blocked",
    purpose: "Clinical View (Missing Active Consent or Expired)",
    patient_id: patientIdOrMedibaseId,
    is_emergency: false,
    access_type: "normal",
  });

  return {
    authorized: false,
    reason: "ACCESS DENIED: You do not have active patient authorization to view this medical record.",
  };
}

export function getPatientAccessRequests(patientId: string): StoredAccessRequest[] {
  const now = new Date();
  const targetIdx = extractPatientIndex(patientId);

  return runtimeAccessRequests
    .filter((req) => {
      const reqIdx = extractPatientIndex(req.patient_id);
      return (
        patientId === "demo-patient-rec-0001" ||
        patientId === "MB-100001" ||
        req.patient_id === patientId ||
        (targetIdx !== null && reqIdx !== null && targetIdx === reqIdx) ||
        req.patient_id.includes(patientId) ||
        patientId.includes(req.patient_id)
      );
    })
    .map((req) => {
      const isExpired = new Date(req.expires_at) <= now;
      if (isExpired && req.status === "pending") {
        return { ...req, status: "expired" as const, is_active: false };
      }
      return req;
    });
}

export function getStaffAccessRequests(staffId?: string): StoredAccessRequest[] {
  const now = new Date();
  return runtimeAccessRequests.map((req) => {
    const isExpired = new Date(req.expires_at) <= now;
    if (isExpired && req.status === "pending") {
      return { ...req, status: "expired" as const, is_active: false };
    }
    return req;
  });
}

export function getPatientAccessHistory(patientId: string): StoredAuditLog[] {
  const targetIdx = extractPatientIndex(patientId);
  return runtimeAuditLogs.filter((a) => {
    const aIdx = extractPatientIndex(a.patient_id);
    return (
      patientId === "demo-patient-rec-0001" ||
      patientId === "MB-100001" ||
      a.patient_id === patientId ||
      (targetIdx !== null && aIdx !== null && targetIdx === aIdx) ||
      a.patient_id.includes(patientId) ||
      patientId.includes(a.patient_id)
    );
  });
}

export function getStaffHospitalAuditLogs(
  hospitalId: string,
  filters?: { staffName?: string; patientId?: string; action?: string; accessType?: string }
): StoredAuditLog[] {
  return runtimeAuditLogs.filter((a) => {
    const matchesHospital =
      !hospitalId ||
      !a.hospital_id ||
      a.hospital_id === hospitalId ||
      a.hospital_id === "a0000000-0000-0000-0000-000000000001";

    if (!matchesHospital) return false;

    if (filters?.staffName && filters.staffName !== "All Staff") {
      if (!a.actor_name.toLowerCase().includes(filters.staffName.toLowerCase())) return false;
    }

    if (filters?.patientId) {
      if (!a.patient_id.toLowerCase().includes(filters.patientId.toLowerCase())) return false;
    }

    if (filters?.action && filters.action !== "All Actions") {
      if (!a.action.toLowerCase().includes(filters.action.toLowerCase()) && !a.action_label.toLowerCase().includes(filters.action.toLowerCase())) {
        return false;
      }
    }

    if (filters?.accessType && filters.accessType !== "All Types") {
      if (filters.accessType.toLowerCase() === "emergency" && !a.is_emergency) return false;
      if (filters.accessType.toLowerCase() === "normal" && a.is_emergency) return false;
    }

    return true;
  });
}

export function getAuditLogById(auditId: string): StoredAuditLog | undefined {
  return runtimeAuditLogs.find((a) => a.id === auditId);
}

export function getPatientEncounters(patientIdentifier: string): ClinicalEncounter[] {
  const normKey = normalizePatientId(patientIdentifier);
  const targetIdx = extractPatientIndex(patientIdentifier);

  if (!runtimeEncounters[normKey]) {
    if (BASELINE_ENCOUNTERS[normKey]) {
      runtimeEncounters[normKey] = [...BASELINE_ENCOUNTERS[normKey]];
    } else {
      runtimeEncounters[normKey] = generateFallbackEncounters(normKey);
    }
  }

  // Also maintain index-based key alias
  if (targetIdx !== null) {
    runtimeEncounters[String(targetIdx)] = runtimeEncounters[normKey];
  }

  return runtimeEncounters[normKey];
}

export function recordClinicalEncounter(
  patientIdentifier: string,
  encounterData: Omit<ClinicalEncounter, "id" | "date"> & { date?: string; time?: string }
): ClinicalEncounter {
  const normKey = normalizePatientId(patientIdentifier);
  const targetIdx = extractPatientIndex(patientIdentifier);

  // Ensure patient history exists before appending
  getPatientEncounters(normKey);

  const now = new Date();
  const formattedDate = encounterData.date || now.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const formattedTime = encounterData.time || now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const newEnc: ClinicalEncounter = {
    ...encounterData,
    id: `enc-rec-${Date.now()}`,
    patient_id: normKey,
    date: formattedDate,
    time: formattedTime,
    timestamp: encounterData.timestamp || now.toISOString(),
  };

  runtimeEncounters[normKey].unshift(newEnc);

  if (targetIdx !== null) {
    runtimeEncounters[String(targetIdx)] = runtimeEncounters[normKey];
  }

  recordAuditLog({
    actor_name: encounterData.doctor_name,
    actor_role: encounterData.doctor_role || "Doctor",
    hospital_name: encounterData.hospital_name,
    action: "visit_created",
    action_label: `Recorded New Clinical Visit (${newEnc.visit_type})`,
    purpose: "Clinical Encounter Documentation",
    patient_id: normKey,
    is_emergency: false,
    access_type: "normal",
  });

  // Notify patient of new encounter addition
  createNotification({
    recipient_type: "patient",
    recipient_id: normKey,
    title: "New Clinical Encounter Recorded",
    message: `${encounterData.doctor_name} at ${encounterData.hospital_name} added a new clinical encounter (${newEnc.visit_type}) to your medical history on ${formattedDate} at ${formattedTime}.`,
    type: "record_updated",
    category: "updates",
    reference_id: newEnc.id,
    action_url: "/patient/timeline",
    is_read: false,
  });

  return newEnc;
}

export function addMedicalReport(report: StoredMedicalReport): StoredMedicalReport {
  runtimeMedicalReports.unshift(report);

  const normKey = normalizePatientId(report.patient_id);
  const encounters = getPatientEncounters(normKey);
  if (encounters && encounters.length > 0) {
    if (!encounters[0].reports) encounters[0].reports = [];
    encounters[0].reports.unshift({
      title: report.report_title,
      file_name: report.file_name,
      file_url: report.storage_path,
    });
  }

  // Patient notification for newly uploaded medical report
  createNotification({
    recipient_type: "patient",
    recipient_id: report.patient_id,
    title: "New Diagnostic Report",
    message: `A new medical report (${report.file_name}) was uploaded by ${report.doctor_name} at ${report.hospital_name}.`,
    type: "record_updated",
    category: "updates",
    reference_id: report.id,
    action_url: "/patient/timeline",
    is_read: false,
  });

  recordAuditLog({
    actor_name: report.doctor_name,
    actor_role: "Doctor",
    hospital_name: report.hospital_name,
    action: "medical_file_uploaded",
    action_label: `Uploaded Medical File (${report.file_name})`,
    purpose: "Clinical Report Attachment",
    patient_id: report.patient_id,
    is_emergency: false,
    access_type: "normal",
  });

  return report;
}

export function getPatientReports(patientIdentifier: string): StoredMedicalReport[] {
  const targetIdx = extractPatientIndex(patientIdentifier);
  return runtimeMedicalReports.filter((r) => {
    const rIdx = extractPatientIndex(r.patient_id);
    return (
      r.patient_id === patientIdentifier ||
      (targetIdx !== null && rIdx !== null && targetIdx === rIdx) ||
      r.patient_id.includes(patientIdentifier) ||
      patientIdentifier.includes(r.patient_id)
    );
  });
}

export function getReportById(reportId: string): StoredMedicalReport | undefined {
  return runtimeMedicalReports.find((r) => r.id === reportId || r.file_name === reportId);
}

const runtimeRegisteredPatients = globalStore.__medibase_registered_patients!;

export function getNextMediBaseId(): string {
  const existingIds = Object.keys(runtimeRegisteredPatients)
    .concat(Object.keys(BASELINE_ENCOUNTERS))
    .filter((id) => id.startsWith("MB-"));

  let maxNum = 100010;
  for (const id of existingIds) {
    const num = parseInt(id.replace(/\D/g, ""), 10);
    if (!isNaN(num) && num > maxNum && num < 900000) {
      maxNum = num;
    }
  }
  return `MB-${maxNum + 1}`;
}

export function registerNewPatient(
  data: Omit<StoredPatientRegistration, "id" | "medibase_id" | "created_at"> & {
    id?: string;
    medibase_id?: string;
  }
): StoredPatientRegistration {
  const newMedibaseId = data.medibase_id || getNextMediBaseId();
  const patientId = data.id || `pat-${newMedibaseId.toLowerCase()}`;
  const now = new Date();

  const regPatient: StoredPatientRegistration = {
    ...data,
    id: patientId,
    medibase_id: newMedibaseId,
    allergies: Array.isArray(data.allergies) ? data.allergies : [],
    chronic_conditions: Array.isArray(data.chronic_conditions) ? data.chronic_conditions : [],
    created_at: now.toISOString(),
  };

  runtimeRegisteredPatients[newMedibaseId] = regPatient;
  runtimeRegisteredPatients[patientId] = regPatient;

  // 1. Build initial encounters list combining past history items + initial intake record
  const initialEncounters: ClinicalEncounter[] = [];

  // If patient has past medical history entries, convert each into a structured historical encounter!
  if (Array.isArray(data.past_history) && data.past_history.length > 0) {
    data.past_history.forEach((hist, idx) => {
      initialEncounters.push({
        id: `enc-past-${newMedibaseId.toLowerCase()}-${idx + 1}`,
        patient_id: newMedibaseId,
        date: hist.date || "Prior Medical History",
        time: hist.time || "10:00 AM",
        timestamp: new Date().toISOString(),
        hospital_name: hist.hospital_name || "Prior Healthcare Provider",
        department: hist.department || "General Medicine",
        doctor_name: hist.doctor_name || "Attending Physician",
        doctor_role: "Doctor",
        visit_type: hist.visit_type || "Historical Consultation",
        chief_complaint: hist.diagnosis ? `Past diagnosis: ${hist.diagnosis}` : "Past medical event",
        diagnoses: hist.diagnosis ? [{ name: hist.diagnosis, is_primary: true }] : [],
        prescriptions: hist.treatment
          ? [
              {
                name: hist.treatment,
                dosage: "As prescribed",
                frequency: "Historical regimen",
                is_active: false,
              },
            ]
          : [],
        vitals: {
          bp: data.vitals.blood_pressure || "120/80 mmHg",
          heart_rate: data.vitals.pulse || 72,
          spo2: data.vitals.spo2 || 98,
        },
        investigations: [],
        reports: [],
        clinical_notes:
          hist.notes ||
          `Historical medical record documented during onboarding. Treatment: ${hist.treatment || "Standard care"}`,
      });
    });
  }

  // 2. Add current baseline health intake encounter at top
  const formattedToday = now.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const formattedTime = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const baselineEnc: ClinicalEncounter = {
    id: `enc-intake-${newMedibaseId.toLowerCase()}`,
    patient_id: newMedibaseId,
    date: formattedToday,
    time: formattedTime,
    timestamp: now.toISOString(),
    hospital_name: "City General Hospital",
    department: "Patient Onboarding & Intake",
    doctor_name: "Dr. Rahul Sharma",
    doctor_role: "Attending Physician",
    visit_type: "Patient Registration & Baseline Intake",
    chief_complaint: `New patient registration. Occupation: ${data.occupation || "N/A"}. Allergies: ${data.allergies && data.allergies.length > 0 ? data.allergies.join(", ") : "None reported"}.`,
    diagnoses:
      data.chronic_conditions && data.chronic_conditions.length > 0
        ? data.chronic_conditions.map((c) => ({ name: c, is_primary: false }))
        : [{ name: "Healthy Adult Baseline Examination", is_primary: true }],
    prescriptions: [],
    vitals: {
      bp: data.vitals.blood_pressure || "120/80 mmHg",
      heart_rate: data.vitals.pulse || 72,
      spo2: data.vitals.spo2 || 98,
    },
    investigations: [
      {
        name: "Intake Vital Signs & Physical Metrics",
        status: "Completed",
        result: `Pulse: ${data.vitals.pulse} bpm, BP: ${data.vitals.blood_pressure}, Temp: ${data.vitals.temperature}, Ht: ${data.height_cm || "N/A"}, Wt: ${data.weight_kg || "N/A"}`,
        time: formattedTime,
      },
    ],
    reports: Array.isArray(data.uploaded_documents)
      ? data.uploaded_documents.map((doc) => ({
          title: doc.name,
          file_name: doc.name,
          file_url: doc.dataUrl || `/medical-records/${newMedibaseId}/${doc.name}`,
        }))
      : [],
    clinical_notes: `Patient successfully onboarded into MediBase Network. Emergency Contact: ${data.emergency_contact.name} (${data.emergency_contact.relationship} - ${data.emergency_contact.phone}). Height: ${data.height_cm || "N/A"}, Weight: ${data.weight_kg || "N/A"}.`,
  };

  // Also register in runtimeMedicalReports
  if (Array.isArray(data.uploaded_documents)) {
    data.uploaded_documents.forEach((doc, idx) => {
      runtimeMedicalReports.unshift({
        id: `rep-onboard-${newMedibaseId.toLowerCase()}-${idx + 1}`,
        patient_id: newMedibaseId,
        encounter_id: baselineEnc.id,
        uploaded_by_staff_id: "b0000000-0000-0000-0000-000000000001",
        hospital_name: "City General Hospital",
        doctor_name: "Dr. Rahul Sharma",
        report_title: doc.name,
        report_type: doc.type || "diagnostic_file",
        file_name: doc.name,
        file_size_bytes: doc.sizeBytes || 240000,
        mime_type: doc.name.toLowerCase().endsWith(".pdf") ? "application/pdf" : "image/jpeg",
        storage_path: doc.dataUrl || `medical-records/${newMedibaseId}/${doc.name}`,
        created_at: now.toISOString(),
      });
    });
  }

  initialEncounters.unshift(baselineEnc);
  runtimeEncounters[newMedibaseId] = initialEncounters;

  // Auto-grant clinical access for demo staff so records are immediately viewable
  runtimeAccessGrants.unshift({
    id: `grant-auto-${Date.now()}`,
    access_request_id: `req-auto-${Date.now()}`,
    patient_id: newMedibaseId,
    staff_id: "b0000000-0000-0000-0000-000000000001",
    hospital_id: "a0000000-0000-0000-0000-000000000001",
    doctor_name: "Dr. Rahul Sharma",
    hospital_name: "City General Hospital",
    reason: "Initial Onboarding & Medical Record Review",
    granted_at: now.toISOString(),
    valid_until: new Date(now.getTime() + 72 * 60 * 60 * 1000).toISOString(),
    is_active: true,
    access_type: "view_and_contribute",
  });

  // Log audit event
  recordAuditLog({
    actor_name: data.full_name,
    actor_role: "Patient",
    hospital_name: "MediBase Universal Registry",
    action: "patient_registered",
    action_label: `New Patient Registered (${newMedibaseId})`,
    purpose: "National Citizen Health Record Onboarding",
    patient_id: newMedibaseId,
    is_emergency: false,
    access_type: "normal",
  });

  return regPatient;
}

export function findRegisteredPatient(query: string): StoredPatientRegistration | undefined {
  if (!query) return undefined;
  const clean = query.trim().toUpperCase();
  if (runtimeRegisteredPatients[clean]) return runtimeRegisteredPatients[clean];

  return Object.values(runtimeRegisteredPatients).find((p) => {
    return (
      p.medibase_id.toUpperCase() === clean ||
      p.id === query ||
      p.full_name.toLowerCase().includes(query.toLowerCase()) ||
      p.phone_number.includes(query)
    );
  });
}

export function getAllRegisteredPatients(): StoredPatientRegistration[] {
  const unique = new Map<string, StoredPatientRegistration>();
  Object.values(runtimeRegisteredPatients).forEach((p) => {
    unique.set(p.medibase_id, p);
  });
  return Array.from(unique.values());
}

const runtimeRegisteredStaff = globalStore.__medibase_registered_staff!;

export function registerNewStaff(data: {
  fullName: string;
  staffId?: string;
  licenseNumber?: string;
  hospitalId?: string;
  hospitalName?: string;
  department?: string;
  role?: string;
  email?: string;
  phoneNumber?: string;
  aadhaar?: string;
}): StoredStaffRegistration {
  const generatedId = data.staffId || data.licenseNumber || `DOC-${Date.now().toString().slice(-6)}`;
  const staffUid = `staff-${generatedId.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;
  const now = new Date();

  const regStaff: StoredStaffRegistration = {
    id: staffUid,
    staff_id: generatedId,
    full_name: data.fullName.trim().startsWith("Dr.") || data.role === "nurse" ? data.fullName.trim() : `Dr. ${data.fullName.trim()}`,
    email: data.email?.trim() || `${data.fullName.toLowerCase().replace(/[^a-z0-9]/g, ".")}@cityhospital.com`,
    phone_number: data.phoneNumber?.trim() || "+91 98765 00000",
    hospital_id: data.hospitalId || "a0000000-0000-0000-0000-000000000001",
    hospital_name: data.hospitalName?.trim() || "City General Hospital",
    department: data.department?.trim() || "General Medicine",
    role: data.role?.toLowerCase() || "doctor",
    license_number: data.licenseNumber?.trim() || generatedId,
    aadhaar_last4: data.aadhaar ? data.aadhaar.slice(-4) : "5678",
    created_at: now.toISOString(),
  };

  runtimeRegisteredStaff[generatedId] = regStaff;
  runtimeRegisteredStaff[staffUid] = regStaff;
  if (regStaff.license_number) {
    runtimeRegisteredStaff[regStaff.license_number] = regStaff;
  }

  recordAuditLog({
    actor_name: regStaff.full_name,
    actor_role: regStaff.role,
    hospital_name: regStaff.hospital_name,
    action: "staff_registered",
    action_label: `New Healthcare Staff Registered (${regStaff.staff_id})`,
    purpose: "Clinical Workforce Onboarding",
    patient_id: "SYSTEM",
    is_emergency: false,
    access_type: "normal",
  });

  return regStaff;
}

export function findRegisteredStaff(query: string): StoredStaffRegistration | undefined {
  if (!query) return undefined;
  const clean = query.trim();
  const cleanUpper = clean.toUpperCase();

  if (runtimeRegisteredStaff[cleanUpper]) return runtimeRegisteredStaff[cleanUpper];
  if (runtimeRegisteredStaff[clean]) return runtimeRegisteredStaff[clean];

  return Object.values(runtimeRegisteredStaff).find((s) => {
    return (
      s.staff_id.toUpperCase() === cleanUpper ||
      s.license_number.toUpperCase() === cleanUpper ||
      s.id.toLowerCase() === clean.toLowerCase() ||
      s.email.toLowerCase() === clean.toLowerCase() ||
      s.full_name.toLowerCase().includes(clean.toLowerCase()) ||
      s.phone_number.includes(clean)
    );
  });
}

export function getAllRegisteredStaff(): StoredStaffRegistration[] {
  const unique = new Map<string, StoredStaffRegistration>();
  Object.values(runtimeRegisteredStaff).forEach((s) => {
    unique.set(s.staff_id, s);
  });
  return Array.from(unique.values());
}

