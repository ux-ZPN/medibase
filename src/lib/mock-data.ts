export interface PatientRecord {
  id: string;
  medibaseId: string;
  name: string;
  age: number;
  dob: string;
  gender: string;
  bloodGroup: string;
  phone: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  allergies: string[];
  chronicConditions: string[];
  currentMedications: {
    name: string;
    dosage: string;
    frequency: string;
    prescribedBy: string;
    startDate: string;
  }[];
}

export interface VisitRecord {
  id: string;
  date: string;
  hospital: string;
  department: string;
  doctorName: string;
  doctorRole: string;
  visitType: "Outpatient" | "Inpatient" | "Emergency" | "Telehealth";
  chiefComplaint: string;
  diagnosis: string;
  clinicalNotes: string;
  prescriptions: string[];
  reports: {
    id: string;
    title: string;
    type: string;
    fileName: string;
    fileSize: string;
  }[];
}

export interface AccessRequestItem {
  id: string;
  doctorName: string;
  doctorRole: string;
  hospital: string;
  department: string;
  purpose: string;
  requestedScope: string;
  requestedAt: string;
  expiresIn: string;
  status: "pending" | "approved" | "denied";
  patientName?: string;
  patientId?: string;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: string;
  hospital: string;
  action: "Record Viewed" | "Consent Approved" | "Visit Created" | "Report Downloaded" | "Consent Revoked" | "Emergency Override" | "Report Uploaded";
  resource: string;
  ipAddress: string;
  patientName?: string;
  patientId?: string;
  details?: string;
  integrityHash?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: "access_request" | "emergency_access_alert" | "record_updated" | "access_revoked";
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
  actionLabel?: string;
}

export const SAMPLE_PATIENT: PatientRecord = {
  id: "p-89412",
  medibaseId: "MB-2026-89412",
  name: "Johnathan Doe",
  age: 42,
  dob: "1984-05-14",
  gender: "Male",
  bloodGroup: "O+",
  phone: "+1 (555) 234-5678",
  emergencyContact: {
    name: "Elena Doe",
    relationship: "Spouse",
    phone: "+1 (555) 987-6543",
  },
  allergies: ["Penicillin (Anaphylaxis)", "Sulfa Drugs"],
  chronicConditions: ["Hypertension (Stage 1)", "Mild Asthma"],
  currentMedications: [
    {
      name: "Amlodipine Besylate",
      dosage: "5mg",
      frequency: "Once daily (Morning)",
      prescribedBy: "Dr. Sarah Jenkins",
      startDate: "2025-11-10",
    },
    {
      name: "Albuterol Inhaler",
      dosage: "90mcg",
      frequency: "As needed for wheezing",
      prescribedBy: "Dr. Robert Vance",
      startDate: "2024-03-15",
    },
  ],
};

export const SAMPLE_VISITS: VisitRecord[] = [
  {
    id: "vis-101",
    date: "2026-08-18",
    hospital: "Apollo Specialty Hospital",
    department: "Cardiology OPD",
    doctorName: "Dr. Sarah Jenkins",
    doctorRole: "Senior Interventional Cardiologist",
    visitType: "Outpatient",
    chiefComplaint: "Routine 6-month blood pressure review and mild exertional fatigue",
    diagnosis: "Well-controlled Essential Hypertension, stable cardiovascular baseline",
    clinicalNotes:
      "BP 128/82 mmHg, HR 72 bpm regular. S1/S2 normal, no murmurs. ECG shows normal sinus rhythm. Advised continued aerobic exercise 30 min daily.",
    prescriptions: ["Amlodipine 5mg OD (Continued)", "Low sodium dietary regimen"],
    reports: [
      {
        id: "rep-01",
        title: "Standard 12-Lead Resting ECG",
        type: "Cardiology",
        fileName: "ecg_trace_20260818.pdf",
        fileSize: "1.4 MB",
      },
      {
        id: "rep-02",
        title: "Comprehensive Metabolic Panel (CMP)",
        type: "Lab Report",
        fileName: "cmp_lab_apollo_2026.pdf",
        fileSize: "840 KB",
      },
    ],
  },
  {
    id: "vis-102",
    date: "2026-03-04",
    hospital: "Metro Health Care Center",
    department: "Pulmonology Clinic",
    doctorName: "Dr. Robert Vance",
    doctorRole: "Consultant Pulmonologist",
    visitType: "Outpatient",
    chiefComplaint: "Seasonal pollen exacerbation and nocturnal cough",
    diagnosis: "Mild Intermittent Asthma with allergic seasonal trigger",
    clinicalNotes:
      "Lungs clear on auscultation. Spirometry FEV1/FVC 84%. Inhaler technique verified. Refilled bronchodilator for PRN use.",
    prescriptions: ["Albuterol HFA 90mcg PRN", "Cetirizine 10mg OD x 14 days"],
    reports: [
      {
        id: "rep-03",
        title: "Digital Pulmonary Function Test (PFT)",
        type: "Pulmonology",
        fileName: "spirometry_report_mar2026.pdf",
        fileSize: "2.1 MB",
      },
    ],
  },
  {
    id: "vis-103",
    date: "2025-11-10",
    hospital: "City Central Medical Center",
    department: "Internal Medicine",
    doctorName: "Dr. Marcus Sterling",
    doctorRole: "Attending Physician",
    visitType: "Outpatient",
    chiefComplaint: "Persistent headaches and elevated home blood pressure readings (145/95)",
    diagnosis: "Primary Essential Hypertension (Stage 1 Initiation)",
    clinicalNotes:
      "Baseline cardiovascular assessment performed. Renal ultrasound unremarkable. Commenced calcium channel blocker therapy with follow-up scheduled.",
    prescriptions: ["Amlodipine 5mg OD (Initial prescription)"],
    reports: [
      {
        id: "rep-04",
        title: "Renal Doppler & Baseline Ultrasound",
        type: "Radiology",
        fileName: "renal_echo_nov2025.pdf",
        fileSize: "4.8 MB",
      },
    ],
  },
];

export const SAMPLE_ACCESS_REQUESTS: AccessRequestItem[] = [
  {
    id: "req-01",
    doctorName: "Dr. Sarah Jenkins",
    doctorRole: "Senior Interventional Cardiologist",
    hospital: "Apollo Specialty Hospital",
    department: "Cardiology Department",
    purpose: "Routine Follow-up & Cardiovascular Review",
    requestedScope: "View Longitudinal Record & Contribute Consultation Notes",
    requestedAt: "10 minutes ago",
    expiresIn: "5 minutes remaining",
    status: "pending",
    patientName: "Johnathan Doe",
    patientId: "MB-2026-89412",
  },
  {
    id: "req-02",
    doctorName: "Dr. Robert Vance",
    doctorRole: "Consultant Pulmonologist",
    hospital: "Metro Health Care Center",
    department: "Pulmonology Clinic",
    purpose: "Seasonal Asthma Follow-up",
    requestedScope: "View Longitudinal History",
    requestedAt: "2026-03-04 09:15 AM",
    expiresIn: "Completed",
    status: "approved",
    patientName: "Johnathan Doe",
    patientId: "MB-2026-89412",
  },
  {
    id: "req-03",
    doctorName: "Dr. Alicia Gomez",
    doctorRole: "Dermatologist",
    hospital: "St. Jude Clinic",
    department: "Dermatology",
    purpose: "Skin lesion consult",
    requestedScope: "Full Record Access",
    requestedAt: "2025-12-14 02:40 PM",
    expiresIn: "Expired",
    status: "denied",
    patientName: "Johnathan Doe",
    patientId: "MB-2026-89412",
  },
];

export const SAMPLE_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: "aud-01",
    timestamp: "2026-09-01 11:30 AM",
    actorName: "Dr. Sarah Jenkins",
    actorRole: "Senior Cardiologist",
    hospital: "Apollo Specialty Hospital",
    action: "Emergency Override",
    resource: "Break-Glass Protocol executed for Acute Cardiac Arrhythmia",
    ipAddress: "192.168.10.42 (ED Clinical Terminal #4)",
    patientName: "Johnathan Doe",
    patientId: "MB-2026-89412",
    details: "Unresponsive patient presenting to Emergency Department with chest pain. Break-Glass override authorized by Dr. Jenkins under Section 4.2 Emergency Protocol.",
    integrityHash: "sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069",
  },
  {
    id: "aud-02",
    timestamp: "2026-08-18 10:45 AM",
    actorName: "Dr. Sarah Jenkins",
    actorRole: "Senior Cardiologist",
    hospital: "Apollo Specialty Hospital",
    action: "Visit Created",
    resource: "Consultation encounter vis-101 & 2 diagnostic attachments",
    ipAddress: "192.168.10.42 (Internal Clinical Network)",
    patientName: "Johnathan Doe",
    patientId: "MB-2026-89412",
    details: "Recorded outpatient visit and uploaded ECG & CMP reports.",
    integrityHash: "sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  },
  {
    id: "aud-03",
    timestamp: "2026-08-18 10:32 AM",
    actorName: "Dr. Sarah Jenkins",
    actorRole: "Senior Cardiologist",
    hospital: "Apollo Specialty Hospital",
    action: "Record Viewed",
    resource: "Longitudinal Medical History & Active Prescription List",
    ipAddress: "192.168.10.42 (Internal Clinical Network)",
    patientName: "Johnathan Doe",
    patientId: "MB-2026-89412",
    details: "Authorized 24h session active. Reviewed prior hypertension notes.",
    integrityHash: "sha256:a2b8e612c287a93a4f61f71a3962d3a7e4b52479e0018a1a473bc4b01d32a904",
  },
  {
    id: "aud-04",
    timestamp: "2026-08-18 10:31 AM",
    actorName: "Johnathan Doe (Patient)",
    actorRole: "Patient",
    hospital: "Patient Portal Direct",
    action: "Consent Approved",
    resource: "Granted 24-hour access window to Apollo Specialty Hospital",
    ipAddress: "172.56.21.99 (Mobile Client)",
    patientName: "Johnathan Doe",
    patientId: "MB-2026-89412",
    details: "Patient approved incoming access request from Dr. Sarah Jenkins.",
    integrityHash: "sha256:6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b",
  },
  {
    id: "aud-05",
    timestamp: "2026-03-04 09:20 AM",
    actorName: "Dr. Robert Vance",
    actorRole: "Pulmonologist",
    hospital: "Metro Health Care Center",
    action: "Report Downloaded",
    resource: "Renal Doppler Ultrasound (renal_echo_nov2025.pdf)",
    ipAddress: "10.20.1.15 (Hospital Workstation)",
    patientName: "Johnathan Doe",
    patientId: "MB-2026-89412",
    details: "Downloaded baseline imaging report during pulmonology review.",
    integrityHash: "sha256:d4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35",
  },
];

export const SAMPLE_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-01",
    title: "Incoming Access Request",
    message: "Dr. Sarah Jenkins from Apollo Specialty Hospital has requested 24-hour access to your longitudinal medical record.",
    type: "access_request",
    timestamp: "10 minutes ago",
    isRead: false,
    actionUrl: "/patient/access-requests/req-01",
    actionLabel: "Review & Respond",
  },
  {
    id: "notif-02",
    title: "Emergency Break-Glass Access Alert",
    message: "Emergency access protocol was initiated for your profile by Apollo Specialty Hospital ED due to acute cardiac triage.",
    type: "emergency_access_alert",
    timestamp: "25 minutes ago",
    isRead: false,
    actionUrl: "/patient/access-history",
    actionLabel: "Inspect Audit Trail",
  },
  {
    id: "notif-03",
    title: "New Clinical Consultation Added",
    message: "Dr. Sarah Jenkins recorded an outpatient consultation note and uploaded 2 diagnostic attachments (ECG & CMP).",
    type: "record_updated",
    timestamp: "2 weeks ago",
    isRead: true,
    actionUrl: "/patient/timeline",
    actionLabel: "View Timeline",
  },
  {
    id: "notif-04",
    title: "Access Window Concluded",
    message: "The 24-hour temporary access window granted to Metro Health Care Center has expired and is now closed.",
    type: "access_revoked",
    timestamp: "2026-03-05 09:15 AM",
    isRead: true,
  },
];
