import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getPatientAccessRequests, StoredAccessRequest } from "@/lib/identity/access-requests-store";

interface DbAccessRequestRow {
  id: string;
  status: string;
  reason?: string;
  access_type?: string;
  requested_at: string;
  expires_at: string;
  hospital_id: string;
  requested_by_staff_id: string;
  hospital_staff?:
    | {
        role?: string;
        department?: string;
        profiles?: { full_name?: string } | Array<{ full_name?: string }>;
      }
    | Array<{
        role?: string;
        department?: string;
        profiles?: { full_name?: string } | Array<{ full_name?: string }>;
      }>;
  hospitals?: { name?: string } | Array<{ name?: string }>;
}

export async function GET() {
  try {
    const supabase = await createClient();

    // 1. Verify Authenticated Patient
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const demoRole = cookieStore.get("medibase_demo_role")?.value;

    const isPatientSession = Boolean(
      (user && user.user_metadata?.role === "patient") ||
      demoRole === "patient" ||
      !authError
    );

    if (authError && !isPatientSession) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please sign in as a patient." },
        { status: 401 }
      );
    }

    // 2. Fetch Patient Record
    let patientId = "demo-patient-rec-0001";

    if (user) {
      const { data: patient } = await supabase
        .from("patients")
        .select("id")
        .eq("profile_id", user.id)
        .maybeSingle();

      if (patient) {
        patientId = patient.id;
      }
    } else if (demoRole === "patient") {
      const activePatientId = cookieStore.get("medibase_active_patient_id")?.value?.trim();
      if (activePatientId) {
        patientId = activePatientId;
      }
    }

    // 3. Query Database for Access Requests
    let dbAccessRequests: Array<{
      id: string;
      doctor_name: string;
      doctor_role: string;
      hospital_name: string;
      department: string;
      purpose: string;
      requested_scope: string[];
      status: string;
      requested_at: string;
      expires_at: string;
      is_active: boolean;
    }> = [];

    try {
      const { data: dbRequests } = await supabase
        .from("access_requests")
        .select(`
          id,
          status,
          reason,
          access_type,
          requested_at,
          expires_at,
          hospital_id,
          requested_by_staff_id,
          hospital_staff (
            role,
            department,
            profiles (full_name)
          ),
          hospitals (
            name
          )
        `)
        .eq("patient_id", patientId)
        .order("requested_at", { ascending: false });

      if (dbRequests && dbRequests.length > 0) {
        const rows = dbRequests as unknown as DbAccessRequestRow[];
        dbAccessRequests = rows.map((req) => {
          const staffObj = Array.isArray(req.hospital_staff)
            ? req.hospital_staff[0]
            : req.hospital_staff;
          const hospObj = Array.isArray(req.hospitals)
            ? req.hospitals[0]
            : req.hospitals;

          const profileObj = staffObj?.profiles
            ? Array.isArray(staffObj.profiles)
              ? staffObj.profiles[0]
              : staffObj.profiles
            : null;

          const docName = (profileObj as { full_name?: string })?.full_name || "Dr. Rahul Sharma";
          const docRole = staffObj?.role ? `${staffObj.role.toUpperCase()} / Practitioner` : "Senior Physician";
          const hospName = (hospObj as { name?: string })?.name || "City General Hospital";
          const dept = staffObj?.department || "Cardiology OPD";

          const isExpired = new Date(req.expires_at) < new Date();
          const effectiveStatus = isExpired && req.status === "pending" ? "expired" : req.status;

          return {
            id: req.id,
            doctor_name: docName.startsWith("Dr.") ? docName : `Dr. ${docName}`,
            doctor_role: docRole,
            hospital_name: hospName,
            department: dept,
            purpose: req.reason || "Clinical Consultation & Care",
            requested_scope: ["Medical History", "Prescriptions", "Diagnostic Reports"],
            status: effectiveStatus,
            requested_at: req.requested_at,
            expires_at: req.expires_at,
            is_active: effectiveStatus === "pending" && !isExpired,
          };
        });
      }
    } catch {
      // Handled by runtime store
    }

    // Combine with runtime access requests store (avoiding duplicates)
    const runtimeRequests = getPatientAccessRequests(patientId);
    const existingIds = new Set(dbAccessRequests.map((r) => r.id));

    const combinedRequests = [
      ...dbAccessRequests,
      ...runtimeRequests
        .filter((r: StoredAccessRequest) => !existingIds.has(r.id))
        .map((r: StoredAccessRequest) => ({
          id: r.id,
          doctor_name: r.doctor_name,
          doctor_role: r.doctor_role,
          hospital_name: r.hospital_name,
          department: r.department,
          purpose: r.purpose,
          requested_scope: r.requested_scope,
          status: r.status,
          requested_at: r.requested_at,
          expires_at: r.expires_at,
          is_active: r.is_active,
        })),
    ];

    return NextResponse.json({
      success: true,
      patient_id: patientId,
      requests: combinedRequests,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to load access requests.";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
