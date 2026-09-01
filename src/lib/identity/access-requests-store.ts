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
  status: "pending" | "approved" | "denied" | "expired";
  requested_at: string;
  expires_at: string;
  is_active: boolean;
}

// In-memory runtime store shared across API routes in the Node/Next process
const runtimeAccessRequests: StoredAccessRequest[] = [
  {
    id: "req-seed-001",
    patient_id: "demo-patient-rec-0001",
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
    patient_id: "demo-patient-rec-0001",
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
    is_active: false,
  },
  {
    id: "req-seed-003",
    patient_id: "demo-patient-rec-0001",
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

export function findPendingAccessRequest(
  patientId: string,
  staffId: string,
  hospitalId: string
): StoredAccessRequest | undefined {
  const now = new Date();
  return runtimeAccessRequests.find((req) => {
    const isMatching =
      (req.patient_id === patientId || req.patient_id.includes(patientId) || patientId.includes(req.patient_id)) &&
      req.requested_by_staff_id === staffId &&
      req.hospital_id === hospitalId &&
      req.status === "pending";

    const isNotExpired = new Date(req.expires_at) > now;
    return isMatching && isNotExpired;
  });
}

export function addAccessRequest(req: StoredAccessRequest): void {
  // Prepend to top of list
  runtimeAccessRequests.unshift(req);
}

export function getPatientAccessRequests(patientId: string): StoredAccessRequest[] {
  const now = new Date();
  return runtimeAccessRequests
    .filter((req) => {
      // Return requests matching patient ID or all for demo session
      return (
        patientId === "demo-patient-rec-0001" ||
        req.patient_id === patientId ||
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
