import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { checkClinicalAccess } from "@/lib/identity/access-requests-store";
import { SAMPLE_PATIENT, SAMPLE_VISITS } from "@/lib/mock-data";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const resolvedParams = await params;
    const targetPatientIdentifier = resolvedParams.id;

    if (!targetPatientIdentifier) {
      return NextResponse.json(
        { success: false, authorized: false, error: "Patient identifier is required." },
        { status: 400 }
      );
    }

    // 1. Verify Authenticated Staff Session
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const demoRole = cookieStore.get("medibase_demo_role")?.value;

    const isStaffSession = Boolean(
      (user && user.user_metadata?.role !== "patient") ||
      demoRole === "hospital_staff"
    );

    if (authError && !isStaffSession) {
      return NextResponse.json(
        {
          success: false,
          authorized: false,
          error: "Unauthorized. Hospital staff credentials required to access clinical records.",
        },
        { status: 401 }
      );
    }

    // 2. Resolve Staff and Hospital Records
    let staffRecordId = "b0000000-0000-0000-0000-000000000001";
    let hospitalRecordId = "a0000000-0000-0000-0000-000000000001";

    if (user) {
      const { data: dbStaff } = await supabase
        .from("hospital_staff")
        .select("id, hospital_id")
        .eq("profile_id", user.id)
        .maybeSingle();

      if (dbStaff) {
        staffRecordId = dbStaff.id;
        hospitalRecordId = dbStaff.hospital_id;
      }
    }

    // 3. Resolve Target Patient Record
    let targetPatientId = targetPatientIdentifier;
    let patientName = "Rahul Sharma";
    let medibaseId = targetPatientIdentifier.toUpperCase();
    let patientAge = 32;

    try {
      const { data: dbPatient } = await supabase
        .from("patients")
        .select("id, medibase_id, date_of_birth, profiles(full_name)")
        .or(`id.eq.${targetPatientIdentifier},medibase_id.eq.${targetPatientIdentifier.toUpperCase()}`)
        .maybeSingle();

      if (dbPatient) {
        targetPatientId = dbPatient.id;
        medibaseId = dbPatient.medibase_id;
        const profileObj = Array.isArray(dbPatient.profiles) ? dbPatient.profiles[0] : dbPatient.profiles;
        patientName = (profileObj as { full_name?: string })?.full_name || patientName;
        if (dbPatient.date_of_birth) {
          patientAge = new Date().getFullYear() - new Date(dbPatient.date_of_birth).getFullYear();
        }
      }
    } catch {
      // Handled by default mapping
    }

    // 4. CRITICAL SECURITY CHECK: Has Patient Granted Active Access?
    let isAuthorized = false;
    let grantValidUntil = new Date(Date.now() + 30 * 60 * 1000).toISOString();

    // Check Database Access Grants
    try {
      const { data: dbGrant } = await supabase
        .from("access_grants")
        .select("id, is_active, valid_until")
        .eq("patient_id", targetPatientId)
        .eq("is_active", true)
        .gt("valid_until", new Date().toISOString())
        .maybeSingle();

      if (dbGrant) {
        isAuthorized = true;
        grantValidUntil = dbGrant.valid_until;
      }
    } catch {
      // Check runtime store
    }

    // Check Runtime Store (Checks both UUID and MediBase ID)
    if (!isAuthorized) {
      const runtimeCheck = checkClinicalAccess(targetPatientId, staffRecordId, hospitalRecordId);
      const runtimeCheckAlt = checkClinicalAccess(medibaseId, staffRecordId, hospitalRecordId);
      if (runtimeCheck.authorized && runtimeCheck.grant) {
        isAuthorized = true;
        grantValidUntil = runtimeCheck.grant.valid_until;
      } else if (runtimeCheckAlt.authorized && runtimeCheckAlt.grant) {
        isAuthorized = true;
        grantValidUntil = runtimeCheckAlt.grant.valid_until;
      }
    }

    // 5. IF UNAUTHORIZED: Return 403 ACCESS DENIED
    if (!isAuthorized) {
      return NextResponse.json(
        {
          success: false,
          authorized: false,
          status: "access_denied",
          patient_id: medibaseId,
          patient_name: patientName,
          error: "ACCESS DENIED: You do not have active patient authorization to view this medical record.",
          message: "Access requires explicit patient approval. Please initiate an authorization request.",
        },
        { status: 403 }
      );
    }

    // 6. IF AUTHORIZED: Record Audit Event and Return Longitudinal Clinical Data
    try {
      await supabase.from("audit_logs").insert({
        actor_profile_id: user?.id || "demo-staff-0001",
        actor_role: "doctor",
        patient_id: targetPatientId,
        hospital_id: hospitalRecordId,
        action: "authorized_patient_record_access_attempt",
        resource_type: "longitudinal_medical_record",
        resource_id: targetPatientId,
        metadata: {
          medibase_id: medibaseId,
          authorized: true,
          valid_until: grantValidUntil,
        },
      });
    } catch {
      // Non-blocking audit log
    }

    return NextResponse.json({
      success: true,
      authorized: true,
      status: "authorized",
      valid_until: grantValidUntil,
      patient: {
        id: targetPatientId,
        medibase_id: medibaseId,
        name: patientName,
        age: patientAge,
        allergies: SAMPLE_PATIENT.allergies,
        chronicConditions: SAMPLE_PATIENT.chronicConditions,
        currentMedications: SAMPLE_PATIENT.currentMedications,
      },
      clinical_snapshot: {
        last_visit: "Oct 12, 2023",
        active_conditions: ["Hypertension", "Seasonal Allergies"],
        current_medications: ["Lisinopril 10mg", "Cetirizine 10mg"],
        recent_investigations: [
          { name: "Lipid Profile", status: "Normal" },
          { name: "HbA1c", value: "6.2%" },
        ],
      },
      encounters: SAMPLE_VISITS,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to verify clinical access.";
    return NextResponse.json({ success: false, authorized: false, error: msg }, { status: 500 });
  }
}
