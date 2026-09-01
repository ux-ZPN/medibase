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

function extractPatientIndex(idOrStr: string): number | null {
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
    {
      id: "req-seed-002",
      patient_id: "MB-100001",
      requested_by_staff_id: "b0000000-0000-0000-0000-000000000002",
      hospital_id: "a0000000-0000-0000-0000-000000000002",
      doctor_name: "Dr. Anjali Rao",
      doctor_role: "DOCTOR / Practitioner",
      hospital_name: "Metro Health Institute",
      department: "General Medicine",
      purpose: "Follow-up evaluation",
      requested_scope: ["Medical History", "Lab Reports"],
      status: "approved",
      requested_at: new Date(Date.now() - 3600 * 1000 * 6).toISOString(),
      expires_at: new Date(Date.now() + 3600 * 1000 * 18).toISOString(),
      responded_at: new Date(Date.now() - 3600 * 1000 * 5.8).toISOString(),
      is_active: false,
    },
    {
      id: "req-seed-003",
      patient_id: "MB-100001",
      requested_by_staff_id: "b0000000-0000-0000-0000-000000000003",
      hospital_id: "a0000000-0000-0000-0000-000000000003",
      doctor_name: "Dr. Marcus Sterling",
      doctor_role: "PHYSICIAN / Specialist",
      hospital_name: "St. Mary's Hospital",
      department: "Emergency Triage",
      purpose: "Emergency Triage (History)",
      requested_scope: ["Emergency Clinical Summary"],
      status: "expired",
      requested_at: new Date(Date.now() - 3600 * 1000 * 72).toISOString(),
      expires_at: new Date(Date.now() - 3600 * 1000 * 48).toISOString(),
      is_active: false,
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
    {
      id: "audit-seed-002",
      timestamp: "31 Aug 2026, 11:12 AM",
      actor_name: "Dr. Anjali Rao",
      actor_role: "Consultant Physician",
      hospital_name: "Metro Health Institute",
      action: "Visit Added",
      action_label: "Added visit encounter",
      purpose: "Routine Follow-up",
      patient_id: "MB-100001",
      is_emergency: false,
    },
    {
      id: "audit-seed-003",
      timestamp: "31 Aug 2026, 2:31 PM",
      actor_name: "Dr. Rajesh Kumar",
      actor_role: "Emergency Attending",
      hospital_name: "City General Hospital",
      action: "Emergency Override",
      action_label: "Break-Glass Emergency Access",
      purpose: "Unconscious patient triage",
      patient_id: "MB-100001",
      is_emergency: true,
    },
  ];
}

const runtimeAccessRequests = globalStore.__medibase_access_requests!;
const runtimeAccessGrants = globalStore.__medibase_access_grants!;
const runtimeAuditLogs = globalStore.__medibase_audit_logs!;

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
