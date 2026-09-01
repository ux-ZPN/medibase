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
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: string;
  hospital: string;
  action: "Record Viewed" | "Consent Approved" | "Visit Created" | "Report Downloaded" | "Consent Revoked";
  resource: string;
  ipAddress: string;
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
  allergies: ["Penicillin", "Sulfa Drugs"],
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
  },
];

export const SAMPLE_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: "aud-01",
    timestamp: "2026-08-18 10:45 AM",
    actorName: "Dr. Sarah Jenkins",
    actorRole: "Senior Cardiologist",
    hospital: "Apollo Specialty Hospital",
    action: "Visit Created",
    resource: "Consultation encounter vis-101 & 2 diagnostic attachments",
    ipAddress: "192.168.10.42 (Internal Clinical Network)",
  },
  {
    id: "aud-02",
    timestamp: "2026-08-18 10:32 AM",
    actorName: "Dr. Sarah Jenkins",
    actorRole: "Senior Cardiologist",
    hospital: "Apollo Specialty Hospital",
    action: "Record Viewed",
    resource: "Longitudinal Medical History & Active Prescription List",
    ipAddress: "192.168.10.42 (Internal Clinical Network)",
  },
  {
    id: "aud-03",
    timestamp: "2026-08-18 10:31 AM",
    actorName: "Johnathan Doe (Patient)",
    actorRole: "Patient",
    hospital: "Patient Portal Direct",
    action: "Consent Approved",
    resource: "Granted 24-hour access window to Apollo Specialty Hospital",
    ipAddress: "172.56.21.99 (Mobile Client)",
  },
  {
    id: "aud-04",
    timestamp: "2026-03-04 09:20 AM",
    actorName: "Dr. Robert Vance",
    actorRole: "Pulmonologist",
    hospital: "Metro Health Care Center",
    action: "Report Downloaded",
    resource: "Renal Doppler Ultrasound (renal_echo_nov2025.pdf)",
    ipAddress: "10.20.1.15 (Hospital Workstation)",
  },
  {
    id: "aud-05",
    timestamp: "2025-12-14 02:45 PM",
    actorName: "Johnathan Doe (Patient)",
    actorRole: "Patient",
    hospital: "Patient Portal Direct",
    action: "Consent Revoked",
    resource: "Declined access request from St. Jude Clinic",
    ipAddress: "172.56.21.99 (Mobile Client)",
  },
];
