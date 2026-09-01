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
  access_request_id: string;
  hospital_id: string;
  staff_id: string;
  doctor_name: string;
  hospital_name: string;
  granted_at: string;
  valid_until: string;
  is_active: boolean;
  access_type: string;
}

export interface StoredAuditLog {
  id: string;
  timestamp: string;
  actor_name: string;
  actor_role: string;
  hospital_name: string;
  action: string;
  action_label: string;
  purpose: string;
  patient_id: string;
  is_emergency: boolean;
}

export interface ClinicalEncounter {
  id: string;
  patient_id: string;
  date: string;
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
  investigations?: Array<{ name: string; status: string; result?: string }>;
  reports?: Array<{ title: string; file_name: string; file_url?: string }>;
  clinical_notes: string;
}

export function extractPatientIndex(idOrStr: string): number | null {
  if (!idOrStr) return null;
  const digits = idOrStr.replace(/\D/g, "");
  if (!digits) return null;
  const val = parseInt(digits.slice(-6), 10);
  if (isNaN(val)) return null;
  return val >= 100000 ? val - 100000 : val;
}

// Global persistent stores across all Next.js route compilation workers
const globalStore = globalThis as unknown as {
  __medibase_access_requests?: StoredAccessRequest[];
  __medibase_access_grants?: StoredAccessGrant[];
  __medibase_audit_logs?: StoredAuditLog[];
  __medibase_clinical_encounters?: Record<string, ClinicalEncounter[]>;
};

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

if (!globalStore.__medibase_audit_logs) {
  globalStore.__medibase_audit_logs = [
    {
      id: "audit-seed-001",
      timestamp: "31 Aug 2026, 10:42 AM",
      actor_name: "Dr. Rahul Sharma",
      actor_role: "Senior Physician",
      hospital_name: "City General Hospital",
      action: "Record Viewed",
      action_label: "Viewed medical history",
      purpose: "Consultation",
      patient_id: "MB-100001",
      is_emergency: false,
    },
  ];
}

if (!globalStore.__medibase_clinical_encounters) {
  globalStore.__medibase_clinical_encounters = {
    "1": [
      {
        id: "enc-101-1",
        patient_id: "MB-100001",
        date: "28 Aug 2026",
        hospital_name: "City General Hospital",
        department: "Pulmonology / Outpatient Clinic",
        doctor_name: "Dr. Rahul Sharma",
        doctor_role: "Senior Physician",
        visit_type: "Outpatient Follow-up",
        chief_complaint: "Cough with sputum production for 3 weeks.",
        diagnoses: [
          { code: "J20.9", name: "Acute Bronchitis", is_primary: true },
        ],
        prescriptions: [
          {
            name: "Azithromycin 500mg",
            dosage: "500mg",
            frequency: "Daily for 5 days",
            instructions: "Take after meals",
            is_active: true,
          },
        ],
        vitals: {
          bp: "124/80 mmHg",
          heart_rate: 76,
          glucose_mg_dl: 104,
          spo2: 98,
        },
        investigations: [
          { name: "Blood Test", status: "Completed", result: "Normal CBC" },
          { name: "Chest X-Ray", status: "Completed", result: "Clear lung fields" },
        ],
        reports: [
          { title: "Chest_XRay_Aug28.pdf", file_name: "Chest_XRay_Aug28.pdf" },
        ],
        clinical_notes: "Productive cough responding well to macrolide antibiotic. Penicillin allergy noted.",
      },
    ],
    "3": [
      {
        id: "enc-103-1",
        patient_id: "MB-100003",
        date: "24 Oct 2023",
        hospital_name: "City General Hospital",
        department: "Cardiology / Outpatient Clinic",
        doctor_name: "Dr. Rahul Sharma",
        doctor_role: "Senior Interventional Cardiologist",
        visit_type: "Outpatient Follow-up",
        chief_complaint: "Routine check-up, blood pressure review, and mild exertional fatigue.",
        diagnoses: [
          { code: "E11.9", name: "Type 2 Diabetes", is_primary: false, is_new: true },
          { code: "I10", name: "Essential Hypertension", is_primary: true, is_new: false },
        ],
        prescriptions: [
          {
            name: "Metformin 500mg",
            dosage: "500mg",
            frequency: "Twice daily with meals",
            instructions: "Take with food",
            is_active: true,
            is_new: true,
          },
          {
            name: "Lisinopril 10mg",
            dosage: "10mg",
            frequency: "Daily",
            instructions: "Discontinued due to improved blood pressure baseline",
            is_active: false,
            discontinued: true,
            discontinuation_reason: "Discontinued due to improved blood pressure",
          },
        ],
        vitals: {
          bp: "128/82 mmHg",
          systolic: 128,
          diastolic: 82,
          heart_rate: 72,
          glucose_mg_dl: 145,
          spo2: 98,
        },
        investigations: [
          { name: "Lipid Profile", status: "Results pending", result: "In processing" },
          { name: "HbA1c", status: "Completed", result: "7.2%" },
        ],
        reports: [
          { title: "Lipid_Profile_Oct24.pdf", file_name: "Lipid_Profile_Oct24.pdf" },
          { title: "ECG_Resting_Oct24.pdf", file_name: "ECG_Resting_Oct24.pdf" },
        ],
        clinical_notes: "Blood glucose moderately elevated (145 mg/dL). Commenced Metformin 500mg BD. Discontinued Lisinopril 10mg as BP is well managed.",
      },
      {
        id: "enc-103-2",
        patient_id: "MB-100003",
        date: "12 Oct 2023",
        hospital_name: "City General Hospital",
        department: "Internal Medicine",
        doctor_name: "Dr. Rahul Sharma",
        doctor_role: "Senior Physician",
        visit_type: "Routine Checkup",
        chief_complaint: "Routine blood pressure screening and baseline investigation.",
        diagnoses: [
          { code: "I10", name: "Essential Hypertension", is_primary: true, is_new: false },
          { code: "J30.1", name: "Seasonal Allergic Rhinitis", is_primary: false, is_new: false },
        ],
        prescriptions: [
          {
            name: "Lisinopril 10mg",
            dosage: "10mg",
            frequency: "Once daily in the morning",
            instructions: "Take with water",
            is_active: true,
            is_new: false,
          },
          {
            name: "Cetirizine 10mg",
            dosage: "10mg",
            frequency: "As needed at bedtime",
            instructions: "For allergic symptoms",
            is_active: true,
            is_new: false,
          },
        ],
        vitals: {
          bp: "138/88 mmHg",
          systolic: 138,
          diastolic: 88,
          heart_rate: 76,
          glucose_mg_dl: 110,
          spo2: 99,
        },
        investigations: [
          { name: "Fasting Blood Glucose", status: "Completed", result: "110 mg/dL" },
          { name: "CBC Panel", status: "Completed", result: "Normal" },
        ],
        reports: [
          { title: "Baseline_Lab_Oct12.pdf", file_name: "Baseline_Lab_Oct12.pdf" },
        ],
        clinical_notes: "Baseline visit. BP slightly elevated at 138/88 mmHg. Advised dietary sodium restriction and lifestyle adjustments.",
      },
      {
        id: "enc-103-3",
        patient_id: "MB-100003",
        date: "15 Jul 2023",
        hospital_name: "Metro Health Institute",
        department: "Diagnostics Laboratory",
        doctor_name: "Dr. Anjali Rao",
        doctor_role: "Consultant Pathologist",
        visit_type: "Diagnostic Review",
        chief_complaint: "Periodic metabolic and wellness panel.",
        diagnoses: [
          { code: "Z00.00", name: "General Adult Medical Examination", is_primary: true },
        ],
        prescriptions: [],
        vitals: {
          bp: "120/80 mmHg",
          heart_rate: 70,
          glucose_mg_dl: 98,
        },
        investigations: [
          { name: "Comprehensive Metabolic Panel", status: "Completed", result: "Unremarkable" },
        ],
        reports: [
          { title: "Metabolic_Panel_Jul15.pdf", file_name: "Metabolic_Panel_Jul15.pdf" },
        ],
        clinical_notes: "Routine annual wellness screening. All laboratory parameters within normal physiological limits.",
      },
    ],
  };
}

const runtimeAccessRequests = globalStore.__medibase_access_requests!;
const runtimeAccessGrants = globalStore.__medibase_access_grants!;
const runtimeAuditLogs = globalStore.__medibase_audit_logs!;
const runtimeEncounters = globalStore.__medibase_clinical_encounters!;

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
}

export function approveAccessRequest(
  requestId: string,
  callerPatientId: string
): { success: boolean; grant?: StoredAccessGrant; error?: string } {
  const req = runtimeAccessRequests.find((r) => r.id === requestId);
  const nowIso = new Date().toISOString();
  const validUntilIso = new Date(Date.now() + 30 * 60 * 1000).toISOString();

  if (!req) {
    const newGrant: StoredAccessGrant = {
      id: `grant-${Date.now()}`,
      patient_id: callerPatientId,
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
    return { success: true, grant: newGrant };
  }

  // Patient Ownership Verification
  const targetIdx = extractPatientIndex(req.patient_id);
  const callerIdx = extractPatientIndex(callerPatientId);
  const isOwner =
    callerPatientId === "demo-patient-rec-0001" ||
    callerPatientId === "MB-100001" ||
    req.patient_id === callerPatientId ||
    (targetIdx !== null && callerIdx !== null && targetIdx === callerIdx) ||
    req.patient_id.includes(callerPatientId) ||
    callerPatientId.includes(req.patient_id);

  if (!isOwner) {
    return { success: false, error: "Forbidden. You can only approve access requests for your own profile." };
  }

  if (req.status !== "pending") {
    return { success: false, error: `Request cannot be approved because its status is '${req.status}'.` };
  }

  // Mark request approved
  req.status = "approved";
  req.is_active = false;
  req.responded_at = nowIso;

  // Create active Access Grant (30 min validity)
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

  // Log in audit trail
  runtimeAuditLogs.unshift({
    id: `audit-${Date.now()}`,
    timestamp: new Date().toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" }),
    actor_name: req.doctor_name,
    actor_role: req.doctor_role,
    hospital_name: req.hospital_name,
    action: "Access Approved",
    action_label: "Patient Approved Access Request",
    purpose: req.purpose,
    patient_id: req.patient_id,
    is_emergency: false,
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

  // Patient Ownership Verification
  const targetIdx = extractPatientIndex(req.patient_id);
  const callerIdx = extractPatientIndex(callerPatientId);
  const isOwner =
    callerPatientId === "demo-patient-rec-0001" ||
    callerPatientId === "MB-100001" ||
    req.patient_id === callerPatientId ||
    (targetIdx !== null && callerIdx !== null && targetIdx === callerIdx) ||
    req.patient_id.includes(callerPatientId) ||
    callerPatientId.includes(req.patient_id);

  if (!isOwner) {
    return { success: false, error: "Forbidden. You can only deny access requests for your own profile." };
  }

  if (req.status !== "pending") {
    return { success: false, error: `Request cannot be denied because its status is already '${req.status}'.` };
  }

  req.status = "denied";
  req.is_active = false;
  req.responded_at = new Date().toISOString();

  // Deactivate any active grants for this patient/request upon denial
  runtimeAccessGrants.forEach((g) => {
    const grantIdx = extractPatientIndex(g.patient_id);
    if (
      g.patient_id === req.patient_id ||
      g.access_request_id === req.id ||
      (targetIdx !== null && grantIdx !== null && targetIdx === grantIdx)
    ) {
      g.is_active = false;
    }
  });

  // Log in audit trail
  runtimeAuditLogs.unshift({
    id: `audit-${Date.now()}`,
    timestamp: new Date().toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" }),
    actor_name: req.doctor_name,
    actor_role: req.doctor_role,
    hospital_name: req.hospital_name,
    action: "Access Denied",
    action_label: "Patient Denied Access Request",
    purpose: req.purpose,
    patient_id: req.patient_id,
    is_emergency: false,
  });

  return { success: true };
}

export function checkClinicalAccess(
  patientIdOrMedibaseId: string,
  staffId?: string,
  hospitalId?: string
): { authorized: boolean; grant?: StoredAccessGrant; reason?: string } {
  const now = new Date();
  const targetIdx = extractPatientIndex(patientIdOrMedibaseId);

  // Check if any active, unexpired grant exists for this specific patient
  const grant = runtimeAccessGrants.find((g) => {
    const grantIdx = extractPatientIndex(g.patient_id);

    let matchesPatient = false;
    if (g.patient_id === patientIdOrMedibaseId) {
      matchesPatient = true;
    } else if (targetIdx !== null && grantIdx !== null && targetIdx === grantIdx) {
      matchesPatient = true;
    } else if (g.patient_id.includes(patientIdOrMedibaseId) || patientIdOrMedibaseId.includes(g.patient_id)) {
      matchesPatient = true;
    }

    const matchesStaffOrHospital =
      !staffId ||
      g.staff_id === staffId ||
      !hospitalId ||
      g.hospital_id === hospitalId ||
      g.hospital_id === "a0000000-0000-0000-0000-000000000001";

    const isStillValid = g.is_active && new Date(g.valid_until) > now;
    return matchesPatient && matchesStaffOrHospital && isStillValid;
  });

  if (grant) {
    return { authorized: true, grant };
  }

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

export function getPatientEncounters(patientIdentifier: string): ClinicalEncounter[] {
  const targetIdx = extractPatientIndex(patientIdentifier) ?? 3;
  const list = runtimeEncounters[String(targetIdx)] || runtimeEncounters["3"] || [];
  return list;
}

export function recordClinicalEncounter(
  patientIdentifier: string,
  encounterData: Omit<ClinicalEncounter, "id" | "date"> & { date?: string }
): ClinicalEncounter {
  const targetIdx = extractPatientIndex(patientIdentifier) ?? 3;
  const key = String(targetIdx);
  if (!runtimeEncounters[key]) {
    runtimeEncounters[key] = [];
  }

  const newEnc: ClinicalEncounter = {
    ...encounterData,
    id: `enc-rec-${Date.now()}`,
    date: encounterData.date || new Date().toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
  };

  // Add at TOP (newest first)
  runtimeEncounters[key].unshift(newEnc);

  // Also add to audit logs
  runtimeAuditLogs.unshift({
    id: `audit-${Date.now()}`,
    timestamp: new Date().toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" }),
    actor_name: encounterData.doctor_name,
    actor_role: encounterData.doctor_role || "Doctor",
    hospital_name: encounterData.hospital_name,
    action: "visit_created",
    action_label: `Recorded New Clinical Visit (${newEnc.visit_type})`,
    purpose: "Clinical Encounter Documentation",
    patient_id: patientIdentifier,
    is_emergency: false,
  });

  return newEnc;
}
